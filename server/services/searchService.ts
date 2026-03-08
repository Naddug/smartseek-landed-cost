/**
 * Search indexing service — PostgreSQL full-text + pgvector semantic search.
 *
 * Table: company_search_index
 * Fields indexed: company, country, industry, employees, tech_stack, keywords
 * Endpoint: GET /api/search?q=
 *
 * Strategy:
 *   1. Full-text search via tsvector/tsquery (fast, keyword-exact)
 *   2. Semantic search via pgvector cosine similarity (finds related terms)
 *   3. Results merged: exact matches ranked first, semantic matches appended
 */

import { pool } from "../db.js";
import { getOpenAIClient } from "./openaiClient.js";

// ─── Types ────────────────────────────────────────────────────────────────────
export interface IndexableCompany {
  domain: string;
  company?: string | null;
  country?: string | null;
  industry?: string | null;
  employees?: number | null;
  techStack?: string[] | null;
  keywords?: string[] | null; // extra terms to boost discoverability
}

export interface SearchResult {
  id: number;
  domain: string;
  company: string | null;
  country: string | null;
  industry: string | null;
  employees: number | null;
  techStack: string[];
  keywords: string | null;
  score: number; // combined relevance 0-1
  matchType: "fulltext" | "semantic" | "both";
}

// ─── One-time setup ───────────────────────────────────────────────────────────
let setupDone = false;

export async function setupSearchIndex(): Promise<void> {
  if (setupDone) return;

  await pool.query(`CREATE EXTENSION IF NOT EXISTS vector`);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS company_search_index (
      id          SERIAL PRIMARY KEY,
      domain      TEXT NOT NULL UNIQUE,
      company     TEXT,
      country     TEXT,
      industry    TEXT,
      employees   INTEGER,
      tech_stack  JSONB,
      keywords    TEXT,
      embedding   vector(1536),
      created_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL,
      updated_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL
    )
  `);

  // Full-text index (GIN) on the combined searchable text
  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_csi_fts
    ON company_search_index
    USING GIN (to_tsvector('english',
      COALESCE(company,  '') || ' ' ||
      COALESCE(country,  '') || ' ' ||
      COALESCE(industry, '') || ' ' ||
      COALESCE(keywords, '')
    ))
  `);

  // pgvector HNSW index for fast ANN search
  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_csi_embedding
    ON company_search_index
    USING hnsw (embedding vector_cosine_ops)
  `).catch(() => {
    // HNSW requires pgvector ≥ 0.5; fall back to IVFFlat
    return pool.query(`
      CREATE INDEX IF NOT EXISTS idx_csi_embedding
      ON company_search_index
      USING ivfflat (embedding vector_cosine_ops)
      WITH (lists = 100)
    `);
  });

  setupDone = true;
  console.log("[searchService] Index ready");
}

// ─── Embedding ────────────────────────────────────────────────────────────────
async function embed(text: string): Promise<number[]> {
  const openai = getOpenAIClient();
  const res = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text.slice(0, 8000), // max safe input
  });
  return res.data[0].embedding;
}

function buildEmbeddingText(c: IndexableCompany): string {
  return [
    c.company,
    c.country,
    c.industry,
    ...(c.techStack ?? []),
    ...(c.keywords ?? []),
    c.employees ? `${c.employees} employees` : null,
  ]
    .filter(Boolean)
    .join(" ");
}

// ─── Index / upsert ───────────────────────────────────────────────────────────
export async function indexCompany(company: IndexableCompany): Promise<void> {
  await setupSearchIndex();

  const embeddingText = buildEmbeddingText(company);
  const embedding = await embed(embeddingText);
  const embeddingLiteral = `[${embedding.join(",")}]`;
  const keywordsStr = company.keywords?.join(" ") ?? null;
  const techJson = company.techStack ? JSON.stringify(company.techStack) : null;

  await pool.query(
    `INSERT INTO company_search_index
       (domain, company, country, industry, employees, tech_stack, keywords, embedding, updated_at)
     VALUES ($1,$2,$3,$4,$5,$6::jsonb,$7,$8::vector,$9)
     ON CONFLICT (domain) DO UPDATE SET
       company    = EXCLUDED.company,
       country    = EXCLUDED.country,
       industry   = EXCLUDED.industry,
       employees  = EXCLUDED.employees,
       tech_stack = EXCLUDED.tech_stack,
       keywords   = EXCLUDED.keywords,
       embedding  = EXCLUDED.embedding,
       updated_at = NOW()`,
    [
      company.domain,
      company.company ?? null,
      company.country ?? null,
      company.industry ?? null,
      company.employees ?? null,
      techJson,
      keywordsStr,
      embeddingLiteral,
      new Date(),
    ]
  );
}

export async function indexCompanies(companies: IndexableCompany[]): Promise<{ indexed: number; errors: number }> {
  let indexed = 0;
  let errors = 0;
  for (const c of companies) {
    try {
      await indexCompany(c);
      indexed++;
    } catch (e) {
      errors++;
      console.error(`[searchService] Failed to index ${c.domain}:`, (e as Error).message);
    }
  }
  return { indexed, errors };
}

// ─── Search ───────────────────────────────────────────────────────────────────
export interface SearchOptions {
  limit?: number;
  country?: string;
  industry?: string;
  minEmployees?: number;
  maxEmployees?: number;
}

export async function searchCompanies(
  query: string,
  opts: SearchOptions = {}
): Promise<SearchResult[]> {
  await setupSearchIndex();

  const limit = opts.limit ?? 20;

  // Build WHERE clause filters
  const filters: string[] = [];
  const params: unknown[] = [];
  let pi = 1; // param index

  const addFilter = (clause: string, value: unknown) => {
    filters.push(clause.replace("$?", `$${pi++}`));
    params.push(value);
  };

  if (opts.country) addFilter("LOWER(country) = LOWER($?)", opts.country);
  if (opts.industry) addFilter("LOWER(industry) LIKE LOWER($?)", `%${opts.industry}%`);
  if (opts.minEmployees != null) addFilter("employees >= $?", opts.minEmployees);
  if (opts.maxEmployees != null) addFilter("employees <= $?", opts.maxEmployees);

  const whereClause = filters.length ? `AND ${filters.join(" AND ")}` : "";

  // ── Full-text search ──────────────────────────────────────────────────────
  const ftsQuery = query
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map(w => w.replace(/[^a-zA-Z0-9]/g, "") + ":*")
    .join(" & ");

  const ftsRows = ftsQuery
    ? await pool.query<SearchResult & { raw_score: string }>(
        `SELECT
           id, domain, company, country, industry, employees,
           COALESCE(tech_stack, '[]'::jsonb) AS "techStack",
           keywords,
           ts_rank_cd(
             to_tsvector('english',
               COALESCE(company,'') || ' ' || COALESCE(country,'') || ' ' ||
               COALESCE(industry,'') || ' ' || COALESCE(keywords,'')
             ),
             to_tsquery('english', $${pi})
           )::float AS raw_score
         FROM company_search_index
         WHERE to_tsvector('english',
           COALESCE(company,'') || ' ' || COALESCE(country,'') || ' ' ||
           COALESCE(industry,'') || ' ' || COALESCE(keywords,'')
         ) @@ to_tsquery('english', $${pi})
         ${whereClause}
         ORDER BY raw_score DESC
         LIMIT $${pi + 1}`,
        [...params, ftsQuery, limit]
      )
    : { rows: [] };

  // ── Semantic search ───────────────────────────────────────────────────────
  let semanticRows: Array<SearchResult & { raw_score: string }> = [];
  try {
    const embedding = await embed(query);
    const embeddingLiteral = `[${embedding.join(",")}]`;
    const seRes = await pool.query<SearchResult & { raw_score: string }>(
      `SELECT
         id, domain, company, country, industry, employees,
         COALESCE(tech_stack, '[]'::jsonb) AS "techStack",
         keywords,
         (1 - (embedding <=> $${pi}::vector))::float AS raw_score
       FROM company_search_index
       WHERE embedding IS NOT NULL
       ${whereClause}
       ORDER BY embedding <=> $${pi}::vector
       LIMIT $${pi + 1}`,
      [...params, embeddingLiteral, limit]
    );
    semanticRows = seRes.rows;
  } catch (e) {
    // pgvector not enabled or no embeddings yet — graceful degradation
    console.warn("[searchService] Semantic search unavailable:", (e as Error).message);
  }

  // ── Merge results ─────────────────────────────────────────────────────────
  const seen = new Map<number, SearchResult>();

  for (const row of ftsRows.rows) {
    seen.set(row.id, {
      ...row,
      techStack: Array.isArray(row.techStack) ? row.techStack : [],
      score: Math.min(parseFloat(row.raw_score as unknown as string), 1),
      matchType: "fulltext",
    });
  }

  for (const row of semanticRows) {
    const score = parseFloat(row.raw_score as unknown as string);
    if (seen.has(row.id)) {
      const existing = seen.get(row.id)!;
      existing.score = Math.min((existing.score + score) / 2 + 0.1, 1); // boost for dual match
      existing.matchType = "both";
    } else if (score > 0.75) {
      // Only include semantic-only results above similarity threshold
      seen.set(row.id, {
        ...row,
        techStack: Array.isArray(row.techStack) ? row.techStack : [],
        score,
        matchType: "semantic",
      });
    }
  }

  return Array.from(seen.values())
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

// ─── Delete ───────────────────────────────────────────────────────────────────
export async function removeFromIndex(domain: string): Promise<void> {
  await pool.query(`DELETE FROM company_search_index WHERE domain = $1`, [domain]);
}

export async function getIndexStats(): Promise<{ total: number; withEmbedding: number }> {
  await setupSearchIndex();
  const res = await pool.query<{ total: string; with_embedding: string }>(
    `SELECT COUNT(*)::int AS total, COUNT(embedding)::int AS with_embedding FROM company_search_index`
  );
  return {
    total: parseInt(res.rows[0].total),
    withEmbedding: parseInt(res.rows[0].with_embedding),
  };
}
