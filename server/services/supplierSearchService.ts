/**
 * Unified supplier search service — FTS-first architecture.
 *
 * Single source of truth for Supplier table search used by:
 *   GET /api/suppliers
 *   POST /api/leads/search (via shared query builders)
 *   GET /api/public/suppliers (when PUBLIC_SEARCH_SOURCE=db)
 *
 * Ranking is deterministic and explainable:
 *   1. ts_rank on search_vector (GIN index)
 *   2. pg_trgm similarity tiebreaker (indexed via gin_trgm_ops)
 *   3. verified + rating boost
 *
 * AI is used only for query interpretation / multilingual term expansion — never scoring.
 * pgvector semantic search remains in searchService.ts (company_search_index) for pipeline/admin use.
 */

import { prisma } from "../../lib/prisma";
import { sqltag as pSql, join as pJoin, raw as pRaw, empty as pEmpty, type Sql as PrismaSQL } from "@prisma/client/runtime/library.js";
import { expandSearchQueryForMultilingual } from "./multilingualSearch";
import { interpretSupplierQuery, type QueryInterpretation } from "./queryInterpretation";
import {
  SEARCH_MULTILINGUAL_ENABLED,
  SEARCH_QUERY_INTERPRETATION_ENABLED,
  SEARCH_EXPLAIN_ENABLED,
} from "../config/searchFeatures";

// ─── Types ────────────────────────────────────────────────────────────────────

export type SupplierRow = {
  id: string | number;
  companyName: string | null;
  slug: string | null;
  country: string | null;
  countryCode: string | null;
  city: string | null;
  industry: string | null;
  subIndustry: string | null;
  products: string | null;
  certifications: string | null;
  description: string | null;
  verified: boolean | null;
  rating: number | null;
  reviewCount: number | null;
  responseTime: string | null;
  minOrderValue: number | null;
  yearEstablished: number | null;
  employeeCount: number | null;
  annualRevenue: number | null;
  dataSource: string | null;
  registryUrl: string | null;
  registryId: string | null;
  sicCode: string | null;
  contactVerified: boolean | null;
};

export interface SupplierSearchParams {
  q?: string;
  country?: string;
  industry?: string;
  verified?: boolean;
  minRating?: number;
  minOrderValue?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
  lang?: string;
  interpret?: boolean;
  isGuest?: boolean;
  freeLimit?: number;
}

export interface SearchMatchExplanation {
  strategy: "fts-first";
  primaryTerm: string;
  expandedTerms?: string[];
  usedMultilingualExpansion: boolean;
  usedQueryInterpretation: boolean;
  interpretation?: QueryInterpretation;
  ranking: string[];
}

export interface SupplierSearchResult {
  suppliers: SupplierRow[];
  total: number | null;
  totalKnown: boolean;
  pagination: {
    page: number;
    limit: number;
    total: number | null;
    totalPages: number | null;
  };
  needFilter?: boolean;
  message?: string;
  searchMeta?: SearchMatchExplanation;
}

const SUPPLIER_SELECT = pSql`
  id, "companyName", slug, country, "countryCode", city,
  industry, "subIndustry", products, certifications,
  description, verified, rating, "reviewCount", "responseTime",
  "minOrderValue", "yearEstablished", "employeeCount",
  "annualRevenue", data_source AS "dataSource", registry_url AS "registryUrl", registry_id AS "registryId",
  sic_code AS "sicCode", contact_verified AS "contactVerified"
`;

const VALID_SORT_FIELDS = ["rating", "reviewCount", "yearEstablished", "companyName", "createdAt"];

// ─── Query preparation ────────────────────────────────────────────────────────

export interface PreparedSearchQuery {
  searchTerm: string;
  ftsTerms: string[];
  country?: string;
  industry?: string;
  interpretation?: QueryInterpretation;
  usedMultilingualExpansion: boolean;
  broadQueryBlocked: boolean;
  blockMessage?: string;
}

export async function prepareSupplierSearchQuery(
  params: Pick<SupplierSearchParams, "q" | "country" | "industry" | "lang" | "interpret" | "verified" | "minRating" | "minOrderValue">
): Promise<PreparedSearchQuery> {
  let searchTerm = (params.q ?? "").trim();
  let country = params.country?.trim() || undefined;
  let industry = params.industry?.trim() || undefined;
  let interpretation: QueryInterpretation | undefined;
  let usedMultilingualExpansion = false;

  if (searchTerm && (params.interpret || SEARCH_QUERY_INTERPRETATION_ENABLED)) {
    interpretation = await interpretSupplierQuery(searchTerm);
    if (interpretation.searchTerms[0]) {
      searchTerm = interpretation.searchTerms[0];
    }
    if (!country && interpretation.suggestedCountry) {
      country = interpretation.suggestedCountry;
    }
    if (!industry && interpretation.suggestedIndustry) {
      industry = interpretation.suggestedIndustry;
    }
  }

  const hasNarrowingFilter = !!(
    country ||
    industry ||
    params.verified ||
    (params.minRating != null && params.minRating > 0) ||
    (params.minOrderValue != null && params.minOrderValue > 0)
  );
  const hasSearchQuery = searchTerm.length > 0;

  let broadQueryBlocked = false;
  let blockMessage: string | undefined;

  if (hasSearchQuery && !hasNarrowingFilter) {
    const tokenCount = searchTerm.split(/\s+/).filter(Boolean).length;
    const likelyBroadSingleTerm = tokenCount === 1 && searchTerm.length <= 10;
    if (likelyBroadSingleTerm) {
      broadQueryBlocked = true;
      blockMessage = "Add a category or country to search efficiently across millions of supplier records.";
    }
  }

  let ftsTerms = [searchTerm].filter(Boolean);

  if (searchTerm && SEARCH_MULTILINGUAL_ENABLED) {
    const expanded = await expandSearchQueryForMultilingual(searchTerm, params.lang);
    if (expanded.usedExpansion && expanded.terms.length > 0) {
      ftsTerms = [...new Set(expanded.terms)].slice(0, 6);
      usedMultilingualExpansion = true;
    }
  }

  return {
    searchTerm,
    ftsTerms,
    country,
    industry,
    interpretation,
    usedMultilingualExpansion,
    broadQueryBlocked,
    blockMessage,
  };
}

// ─── SQL builders (shared by supplier search + lead search) ─────────────────

export function buildFtsCondition(terms: string[]): PrismaSQL | null {
  if (terms.length === 0) return null;
  if (terms.length === 1) {
    return pSql`search_vector @@ websearch_to_tsquery('simple', ${terms[0]})`;
  }
  const parts = terms.map((t) => pSql`search_vector @@ websearch_to_tsquery('simple', ${t})`);
  return pSql`(${pJoin(parts, " OR ")})`;
}

export interface SupplierFilterParams {
  ftsTerms?: string[];
  country?: string;
  industry?: string;
  verified?: boolean;
  minRating?: number | null;
  minOrderValue?: number | null;
  requireSlug?: boolean;
  extraConditions?: PrismaSQL[];
}

export async function buildSupplierWhereClause(filters: SupplierFilterParams): Promise<PrismaSQL> {
  const conditions: PrismaSQL[] = [...(filters.extraConditions ?? [])];

  const fts = buildFtsCondition(filters.ftsTerms ?? []);
  if (fts) conditions.push(fts);

  if (filters.country) {
    if (filters.country === "Undefined") {
      conditions.push(pSql`(country = '' OR country IS NULL)`);
    } else {
      const { getCountryCode } = await import("../lib/countryCodes");
      const countryCode = getCountryCode(filters.country);
      const countryParts: PrismaSQL[] = [pSql`country ILIKE ${filters.country}`];
      if (countryCode && countryCode !== "XX" && countryCode !== "SKIP") {
        countryParts.push(pSql`"countryCode" ILIKE ${countryCode}`);
      }
      conditions.push(pSql`(${pJoin(countryParts, " OR ")})`);
    }
  }

  if (filters.industry) {
    conditions.push(pSql`industry ILIKE ${`%${filters.industry}%`}`);
  }

  if (filters.verified) {
    conditions.push(pSql`verified = true`);
  }

  if (filters.minRating != null) {
    conditions.push(pSql`rating >= ${filters.minRating}`);
  }

  if (filters.minOrderValue != null && filters.minOrderValue > 0) {
    conditions.push(pSql`"minOrderValue" >= ${filters.minOrderValue}`);
  }

  if (filters.requireSlug) {
    conditions.push(pSql`slug IS NOT NULL`);
  }

  return conditions.length > 0 ? pSql`WHERE ${pJoin(conditions, " AND ")}` : pEmpty;
}

export function buildSupplierOrderClause(
  hasSearchQuery: boolean,
  searchTerm: string,
  sortBy?: string,
  sortOrder?: string
): PrismaSQL {
  if (hasSearchQuery && searchTerm) {
    return pSql`ORDER BY
      ts_rank(search_vector, websearch_to_tsquery('simple', ${searchTerm})) DESC,
      GREATEST(
        similarity(coalesce("companyName", ''), ${searchTerm}),
        similarity(coalesce(products, ''), ${searchTerm})
      ) DESC,
      verified DESC,
      rating DESC`;
  }

  const sortFieldSafe = VALID_SORT_FIELDS.includes(sortBy ?? "") ? sortBy! : "rating";
  const sortDirSafe = sortOrder === "asc" ? "ASC" : "DESC";
  return pSql`ORDER BY ${pRaw(`"${sortFieldSafe}"`)} ${pRaw(sortDirSafe)}`;
}

export function buildLeadSearchOrderClause(keywordForRank: string, industry: string): PrismaSQL {
  return pSql`ORDER BY (
    ts_rank(search_vector, websearch_to_tsquery('simple', ${keywordForRank})) * 1.4
    + GREATEST(
        similarity(coalesce(products, ''), ${keywordForRank}),
        similarity(coalesce("companyName", ''), ${keywordForRank}),
        similarity(coalesce(industry, ''), ${industry})
      ) * 1.1
    + COALESCE(rating, 0) * 0.25
    + CASE WHEN verified THEN 0.6 ELSE 0 END
    + CASE WHEN coalesce(products, '') <> '' THEN 0.2 ELSE 0 END
    + CASE WHEN coalesce(description, '') <> '' THEN 0.1 ELSE 0 END
  ) DESC, verified DESC, rating DESC`;
}

// ─── Main search ──────────────────────────────────────────────────────────────

export async function searchSuppliers(params: SupplierSearchParams): Promise<SupplierSearchResult> {
  const freeLimit = params.freeLimit ?? 3;
  const isGuest = params.isGuest ?? false;
  const pageNum = isGuest ? 1 : Math.max(1, params.page ?? 1);
  const limitNum = isGuest ? freeLimit : Math.min(50, Math.max(1, params.limit ?? 20));
  const skip = isGuest ? 0 : (pageNum - 1) * limitNum;

  const prepared = await prepareSupplierSearchQuery({
    q: params.q,
    country: params.country,
    industry: params.industry,
    lang: params.lang,
    interpret: params.interpret,
    verified: params.verified,
    minRating: params.minRating,
    minOrderValue: params.minOrderValue,
  });

  if (prepared.broadQueryBlocked) {
    return {
      suppliers: [],
      total: null,
      totalKnown: false,
      pagination: { page: pageNum, limit: limitNum, total: null, totalPages: null },
      needFilter: true,
      message: prepared.blockMessage,
      searchMeta: SEARCH_EXPLAIN_ENABLED
        ? {
            strategy: "fts-first",
            primaryTerm: prepared.searchTerm,
            usedMultilingualExpansion: false,
            usedQueryInterpretation: !!prepared.interpretation?.usedAi,
            interpretation: prepared.interpretation,
            ranking: [
              "Broad single-term query blocked without country/industry filter",
              "Add a filter to use GIN search_vector index efficiently",
            ],
          }
        : undefined,
    };
  }

  const hasSearchQuery = prepared.ftsTerms.length > 0;
  const ratingThreshold: number | null = params.minRating ?? null;

  const whereClause = await buildSupplierWhereClause({
    ftsTerms: prepared.ftsTerms,
    country: prepared.country,
    industry: prepared.industry,
    verified: params.verified,
    minRating: ratingThreshold,
    minOrderValue: params.minOrderValue ?? null,
  });

  const orderClause = buildSupplierOrderClause(
    hasSearchQuery,
    prepared.searchTerm,
    params.sortBy,
    params.sortOrder
  );

  const hasFilters =
    hasSearchQuery ||
    prepared.country ||
    prepared.industry ||
    params.verified ||
    ratingThreshold !== null ||
    params.minOrderValue;

  let suppliers: SupplierRow[] = [];
  let total: number | null = 0;

  try {
    const [rows, countResult] = await Promise.all([
      prisma.$queryRaw<SupplierRow[]>`
        SELECT ${SUPPLIER_SELECT}
        FROM "Supplier"
        ${whereClause}
        ${orderClause}
        LIMIT ${limitNum} OFFSET ${skip}
      `,
      hasSearchQuery
        ? Promise.resolve(null)
        : hasFilters
          ? Promise.race([
              prisma.$queryRaw<[{ cnt: bigint }]>`SELECT COUNT(*)::bigint AS cnt FROM "Supplier" ${whereClause}`
                .then((r: [{ cnt: bigint }]) => Number(r[0]?.cnt ?? 0)),
              new Promise<null>((resolve) => setTimeout(() => resolve(null), 5000)),
            ]).catch(() => null)
          : prisma.$queryRaw<[{ cnt: bigint }]>`SELECT reltuples::bigint AS cnt FROM pg_class WHERE relname = 'Supplier'`
              .then((r: [{ cnt: bigint }]) => Number(r[0]?.cnt ?? 0))
              .catch(() => null),
    ]);
    suppliers = rows;
    total = typeof countResult === "number" ? countResult : null;
  } catch (sqlErr) {
    console.error("[supplierSearchService] SQL error:", sqlErr);
    return {
      suppliers: [],
      total: 0,
      totalKnown: true,
      pagination: { page: pageNum, limit: limitNum, total: 0, totalPages: 0 },
    };
  }

  if (suppliers.length > 0 && total === 0) total = suppliers.length;

  const searchMeta: SearchMatchExplanation | undefined = SEARCH_EXPLAIN_ENABLED && hasSearchQuery
    ? {
        strategy: "fts-first",
        primaryTerm: prepared.searchTerm,
        expandedTerms: prepared.usedMultilingualExpansion ? prepared.ftsTerms : undefined,
        usedMultilingualExpansion: prepared.usedMultilingualExpansion,
        usedQueryInterpretation: !!prepared.interpretation?.usedAi,
        interpretation: prepared.interpretation,
        ranking: [
          "Primary: ts_rank on search_vector (GIN index)",
          "Tiebreaker: pg_trgm similarity on companyName and products",
          "Boost: verified status, then rating",
        ],
      }
    : undefined;

  return {
    suppliers,
    total,
    totalKnown: total !== null,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: total == null ? null : Math.ceil(total / limitNum),
    },
    searchMeta,
  };
}

// ─── Response formatting (shared) ─────────────────────────────────────────────

export function formatSupplierRows(suppliers: SupplierRow[]) {
  const toTitleCase = (str: string | null | undefined): string => {
    if (!str || typeof str !== "string") return str || "";
    const abbr = new Set(["pt", "tbk", "gmbh", "llc", "ltd", "inc", "co", "lp", "plc", "sa", "ag", "nv", "bv", "corp", "pvt", "uk", "us"]);
    return str.replace(/\w\S*/g, (w) => {
      const lower = w.toLowerCase();
      if (abbr.has(lower)) return lower === "gmbh" ? "GmbH" : lower.toUpperCase();
      return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
    });
  };

  const formatLocation = (str: string | null | undefined): string => {
    if (!str || typeof str !== "string") return str || "";
    return str.split(",").map((p) => toTitleCase(p.trim())).filter(Boolean).join(", ");
  };

  const safeString = (v: unknown): string =>
    v == null ? "" : typeof v === "string" ? v : typeof (v as { name?: string }).name === "string" ? (v as { name: string }).name : String(v);

  return suppliers.map((s) => {
    let products: unknown[] = [];
    let certifications: unknown[] = [];
    try {
      const raw = s.products;
      if (raw != null && typeof raw === "string") {
        const p = JSON.parse(raw);
        products = Array.isArray(p) ? p : [];
      }
    } catch {
      products = [];
    }
    try {
      const raw = s.certifications;
      if (raw != null && typeof raw === "string") {
        const c = JSON.parse(raw);
        certifications = Array.isArray(c) ? c : [];
      }
    } catch {
      certifications = [];
    }
    return {
      ...s,
      products: products.map((p) => toTitleCase(safeString(p))).filter(Boolean),
      certifications: certifications.map((c) => toTitleCase(safeString(c))).filter(Boolean),
      companyName: toTitleCase(s.companyName ?? ""),
      city: formatLocation(s.city ?? ""),
      country: formatLocation(s.country ?? ""),
      industry: toTitleCase(s.industry ?? ""),
      subIndustry: s.subIndustry ? toTitleCase(s.subIndustry) : s.subIndustry,
    };
  });
}

export function mapSupplierToPublicShape(s: ReturnType<typeof formatSupplierRows>[number]) {
  const products = Array.isArray(s.products) ? s.products : [];
  return {
    id: s.id,
    slug: s.slug ?? String(s.id),
    company_name: s.companyName ?? "",
    country: s.country ?? "",
    country_code: s.countryCode ?? "",
    city: s.city ?? "",
    industry: s.industry ?? "",
    sub_industry: s.subIndustry ?? "",
    products,
    tagline: (s.description ?? "").slice(0, 160),
    type: "manufacturer" as const,
    verified: !!s.verified,
    rating: s.rating ?? 0,
    employee_count_band: "200-500" as const,
    year_founded: s.yearEstablished ?? 0,
    is_curated: false,
  };
}
