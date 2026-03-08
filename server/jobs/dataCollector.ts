/**
 * Automated Data Ingestion Pipeline
 *
 * Runs every 6 hours via node-cron. Four sequential tasks per cycle:
 *
 *  Task 1 — Collect   : Fetch company listings from external directories
 *  Task 2 — Enrich    : Augment raw companies with data-provider details
 *  Task 3 — Upsert DB : Write enriched companies into the Supplier table (Prisma)
 *  Task 4 — Index     : Push updated records into the pgvector search index
 *
 * Each task has:
 *  - Configurable provider (env vars)
 *  - Per-task result metrics
 *  - Full error isolation — one failure doesn't abort subsequent tasks
 *  - Persistent run log in pipeline_runs table (created on first boot)
 *
 * Usage:
 *  import { startDataCollectionPipeline } from "./jobs/dataCollector";
 *  startDataCollectionPipeline();   // call once in server/index.ts
 *
 * Environment variables:
 *  PIPELINE_ENABLED=true             default: true
 *  PIPELINE_CRON=0 *\/6 * * *        default: every 6 hours
 *  PIPELINE_BATCH_SIZE=50            companies per enrichment batch
 *  PIPELINE_MAX_COLLECT=200          max companies collected per run
 *  COLLECTOR_SOURCES=opencorporates,trade_gov,companies_house
 *  ENRICH_PROVIDER=pdl               pdl | proxycurl | clearbit | crunchbase
 */

import cron from "node-cron";
import { pool } from "../db.js";
import { prisma } from "../../lib/prisma.js";
import { getCompany }   from "../services/companyService.js";
import { getTradeData } from "../services/tradeService.js";
import { indexCompany } from "../services/searchService.js";
import { getGraphService } from "../services/graphService.js";
import type { CompanyProvider } from "../services/companyService.js";
import type { TradeProvider }   from "../services/tradeService.js";

// ─── Config ───────────────────────────────────────────────────────────────────

const ENABLED       = process.env.PIPELINE_ENABLED !== "false";
const CRON_SCHEDULE = process.env.PIPELINE_CRON ?? "0 */6 * * *"; // every 6 hours
const BATCH_SIZE    = parseInt(process.env.PIPELINE_BATCH_SIZE ?? "50",  10);
const MAX_COLLECT   = parseInt(process.env.PIPELINE_MAX_COLLECT ?? "200", 10);

const ENRICH_PROVIDER = (process.env.ENRICH_PROVIDER ?? "pdl") as CompanyProvider;
const TRADE_PROVIDER  = (process.env.TRADE_PROVIDER  ?? "pdl") as TradeProvider;

const COLLECTOR_SOURCES = (process.env.COLLECTOR_SOURCES ?? "opencorporates,trade_gov,companies_house")
  .split(",")
  .map(s => s.trim())
  .filter(Boolean);

// ─── Types ────────────────────────────────────────────────────────────────────

interface RawCompany {
  name: string;
  domain?: string | null;
  country: string;
  city?: string | null;
  industry?: string | null;
  registryId?: string | null;
  registryUrl?: string | null;
  source: string;
}

interface TaskResult {
  task: string;
  success: boolean;
  count: number;
  errors: number;
  durationMs: number;
  detail?: string;
}

interface PipelineRun {
  runId: string;
  startedAt: Date;
  tasks: TaskResult[];
  totalDurationMs: number;
  status: "success" | "partial" | "failed";
}

// ─── Persistent run log ───────────────────────────────────────────────────────

async function ensureRunLogTable(): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS pipeline_runs (
      id          TEXT PRIMARY KEY,
      started_at  TIMESTAMPTZ NOT NULL,
      finished_at TIMESTAMPTZ,
      status      TEXT NOT NULL DEFAULT 'running',
      tasks       JSONB,
      total_ms    INTEGER
    )
  `);
}

async function logRun(run: PipelineRun): Promise<void> {
  await pool.query(
    `INSERT INTO pipeline_runs (id, started_at, finished_at, status, tasks, total_ms)
     VALUES ($1,$2,NOW(),$3,$4::jsonb,$5)
     ON CONFLICT (id) DO UPDATE SET
       finished_at = NOW(), status=$3, tasks=$4::jsonb, total_ms=$5`,
    [run.runId, run.startedAt, run.status, JSON.stringify(run.tasks), run.totalDurationMs]
  );
}

// ─── Task helpers ─────────────────────────────────────────────────────────────

function timer(): () => number {
  const start = Date.now();
  return () => Date.now() - start;
}

function slug(name: string, country: string): string {
  return `${name}-${country}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 200);
}

function uniqueSlug(base: string, existing: Set<string>): string {
  let s = base;
  let n = 1;
  while (existing.has(s)) s = `${base}-${n++}`;
  existing.add(s);
  return s;
}

// ─── Task 1: Collect companies from directories ───────────────────────────────

async function collectFromOpenCorporates(limit: number): Promise<RawCompany[]> {
  const key = process.env.OPENCORPORATES_API_KEY;
  if (!key) {
    console.log("  [collect] OPENCORPORATES_API_KEY not set — skipping");
    return [];
  }
  try {
    const url = `https://api.opencorporates.com/v0.4/companies/search?q=&api_token=${key}&per_page=100&inactive=false`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`OpenCorporates HTTP ${res.status}`);
    const data = await res.json() as {
      results?: { companies?: Array<{ company: { name: string; jurisdiction_code: string; company_number: string; opencorporates_url: string } }> }
    };
    return (data.results?.companies ?? []).slice(0, limit).map(({ company: c }) => ({
      name:        c.name,
      country:     c.jurisdiction_code?.split("_")[0]?.toUpperCase() ?? "Unknown",
      registryId:  c.company_number,
      registryUrl: c.opencorporates_url,
      source:      "opencorporates",
    }));
  } catch (e) {
    console.warn("  [collect] OpenCorporates error:", (e as Error).message);
    return [];
  }
}

async function collectFromTradeGov(limit: number): Promise<RawCompany[]> {
  try {
    // Trade.gov International Trade Administration — public tariff/company data
    const res = await fetch(
      `https://api.trade.gov/v1/tariff_rates/search.json?api_key=${process.env.TRADE_GOV_API_KEY ?? "DEMO_KEY"}&size=${Math.min(limit, 100)}`
    );
    if (!res.ok) throw new Error(`Trade.gov HTTP ${res.status}`);
    const data = await res.json() as { results?: Array<{ partner_name?: string; country?: string; source?: string }> };
    return (data.results ?? [])
      .filter(r => r.partner_name)
      .map(r => ({
        name:    r.partner_name!,
        country: r.country ?? "Unknown",
        source:  "trade_gov",
      }));
  } catch (e) {
    console.warn("  [collect] Trade.gov error:", (e as Error).message);
    return [];
  }
}

async function collectFromCompaniesHouse(limit: number): Promise<RawCompany[]> {
  const key = process.env.COMPANIES_HOUSE_API_KEY;
  if (!key) {
    console.log("  [collect] COMPANIES_HOUSE_API_KEY not set — skipping");
    return [];
  }
  try {
    // UK Companies House public search
    const res = await fetch(
      `https://api.companieshouse.gov.uk/search/companies?q=limited&items_per_page=${Math.min(limit, 100)}`,
      { headers: { Authorization: `Basic ${Buffer.from(key + ":").toString("base64")}` } }
    );
    if (!res.ok) throw new Error(`Companies House HTTP ${res.status}`);
    const data = await res.json() as { items?: Array<{ title: string; address_snippet?: string; company_number: string }> };
    return (data.items ?? []).map(c => ({
      name:       c.title,
      country:    "GB",
      city:       c.address_snippet?.split(",").pop()?.trim() ?? null,
      registryId: c.company_number,
      source:     "companies_house",
    }));
  } catch (e) {
    console.warn("  [collect] Companies House error:", (e as Error).message);
    return [];
  }
}

async function task1_collect(): Promise<{ result: TaskResult; companies: RawCompany[] }> {
  const elapsed = timer();
  const companies: RawCompany[] = [];
  let errors = 0;

  const perSource = Math.ceil(MAX_COLLECT / Math.max(COLLECTOR_SOURCES.length, 1));

  for (const source of COLLECTOR_SOURCES) {
    try {
      let batch: RawCompany[] = [];
      if (source === "opencorporates")  batch = await collectFromOpenCorporates(perSource);
      else if (source === "trade_gov")  batch = await collectFromTradeGov(perSource);
      else if (source === "companies_house") batch = await collectFromCompaniesHouse(perSource);
      else console.warn(`  [collect] Unknown source: ${source}`);
      console.log(`  [collect] ${source}: ${batch.length} companies`);
      companies.push(...batch);
    } catch (e) {
      errors++;
      console.error(`  [collect] ${source} failed:`, (e as Error).message);
    }
  }

  return {
    result: {
      task: "collect",
      success: companies.length > 0,
      count: companies.length,
      errors,
      durationMs: elapsed(),
      detail: `Sources: ${COLLECTOR_SOURCES.join(", ")}`,
    },
    companies: companies.slice(0, MAX_COLLECT),
  };
}

// ─── Task 2: Enrich company data ──────────────────────────────────────────────

interface EnrichedCompany extends RawCompany {
  description?:    string | null;
  employeeCount?:  number | null;
  revenue?:        string | null;
  foundedYear?:    number | null;
  techStack?:      string[];
  certifications?: string[];
  linkedin?:       string | null;
  website?:        string | null;
  tradeSignals?:   string[];
  products?:       string[];
}

async function enrichSingle(raw: RawCompany): Promise<EnrichedCompany> {
  const domain = raw.domain ?? raw.name.toLowerCase().replace(/[^a-z0-9]/g, "") + ".com";
  try {
    const [company, trade] = await Promise.allSettled([
      getCompany(domain, ENRICH_PROVIDER),
      getTradeData(domain, TRADE_PROVIDER),
    ]);

    return {
      ...raw,
      domain,
      description:   company.status === "fulfilled" ? company.value.description : null,
      employeeCount: company.status === "fulfilled" ? company.value.employeeCount : null,
      revenue:       company.status === "fulfilled" ? company.value.revenue : null,
      foundedYear:   company.status === "fulfilled" ? company.value.foundedYear : null,
      linkedin:      company.status === "fulfilled" ? company.value.linkedin : null,
      website:       company.status === "fulfilled" ? (company.value.website ?? `https://${domain}`) : `https://${domain}`,
      techStack:     [],
      tradeSignals:  trade.status === "fulfilled" ? trade.value.signals : [],
      products:      trade.status === "fulfilled" ? trade.value.topProducts : [],
    };
  } catch {
    return { ...raw, domain, website: `https://${domain}` };
  }
}

async function task2_enrich(companies: RawCompany[]): Promise<{ result: TaskResult; enriched: EnrichedCompany[] }> {
  const elapsed = timer();
  const enriched: EnrichedCompany[] = [];
  let errors = 0;

  // Process in batches to respect rate limits
  for (let i = 0; i < companies.length; i += BATCH_SIZE) {
    const batch = companies.slice(i, i + BATCH_SIZE);
    const results = await Promise.allSettled(batch.map(c => enrichSingle(c)));

    for (const r of results) {
      if (r.status === "fulfilled") enriched.push(r.value);
      else errors++;
    }

    // Rate-limit guard — 500ms between batches
    if (i + BATCH_SIZE < companies.length) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    process.stdout.write(`\r  [enrich] ${enriched.length}/${companies.length}...`);
  }
  process.stdout.write("\n");

  return {
    result: {
      task: "enrich",
      success: enriched.length > 0,
      count: enriched.length,
      errors,
      durationMs: elapsed(),
      detail: `Provider: ${ENRICH_PROVIDER}`,
    },
    enriched,
  };
}

// ─── Task 3: Upsert into Supplier database ────────────────────────────────────

const INDUSTRIES = [
  "Mining & Minerals","Manufacturing (General)","Electronics & Semiconductors",
  "Chemicals & Petrochemicals","Food & Agriculture","Textiles & Apparel",
  "Automotive & Transport","Healthcare & Medical Devices","Construction & Building Materials",
  "Energy & Renewables","Wholesale & Distribution","Consumer Goods & Retail",
  "Machinery & Industrial Equipment","Logistics & Supply Chain","Aerospace & Defense",
  "Maritime & Shipping","Paper & Packaging",
];

function mapIndustry(raw?: string | null): string {
  if (!raw) return "Manufacturing (General)";
  const lower = raw.toLowerCase();
  return INDUSTRIES.find(i => i.toLowerCase().split(" ").some(w => lower.includes(w)))
    ?? "Manufacturing (General)";
}

async function task3_upsertDB(enriched: EnrichedCompany[]): Promise<{ result: TaskResult; upserted: EnrichedCompany[] }> {
  const elapsed = timer();
  let count = 0;
  let errors = 0;
  const upserted: EnrichedCompany[] = [];

  // Load existing slugs to avoid collisions
  const existing = await prisma.supplier.findMany({ select: { slug: true } });
  const slugSet = new Set<string>(existing.map((s: { slug: string }) => s.slug));

  for (const c of enriched) {
    try {
      const baseSlug = slug(c.name, c.country);
      const supplierSlug = uniqueSlug(baseSlug, slugSet);

      await prisma.supplier.upsert({
        where: { slug: supplierSlug },
        create: {
          slug:             supplierSlug,
          companyName:      c.name,
          country:          c.country,
          countryCode:      c.country.slice(0, 2).toUpperCase(),
          city:             c.city ?? "Unknown",
          industry:         mapIndustry(c.industry),
          products:         c.products?.join(", ") || c.industry || "General",
          description:      c.description ?? `${c.name} is a company based in ${c.country}.`,
          contactEmail:     `info@${(c.domain ?? c.name.toLowerCase().replace(/\s+/g, "") + ".com")}`,
          website:          c.website ?? null,
          employeeCount:    c.employeeCount ?? null,
          annualRevenue:    c.revenue ?? null,
          yearEstablished:  c.foundedYear ?? new Date().getFullYear() - 5,
          verified:         false,
          rating:           0,
          dataSource:       `pipeline:${c.source}`,
          registryUrl:      c.registryUrl ?? null,
          registryId:       c.registryId ?? null,
        },
        update: {
          description:   c.description ?? undefined,
          employeeCount: c.employeeCount ?? undefined,
          annualRevenue: c.revenue ?? undefined,
          website:       c.website ?? undefined,
          products:      c.products?.join(", ") || undefined,
        },
      });

      upserted.push(c);
      count++;
    } catch (e) {
      errors++;
      console.warn(`  [db] Failed to upsert ${c.name}:`, (e as Error).message.slice(0, 80));
    }
  }

  return {
    result: {
      task: "upsert_db",
      success: count > 0,
      count,
      errors,
      durationMs: elapsed(),
    },
    upserted,
  };
}

// ─── Task 4: Update search index + graph ─────────────────────────────────────

async function task4_index(upserted: EnrichedCompany[]): Promise<TaskResult> {
  const elapsed = timer();
  let count = 0;
  let errors = 0;
  const graph = getGraphService();

  for (const c of upserted) {
    const domain = c.domain ?? c.name.toLowerCase().replace(/\s+/g, "") + ".com";

    // 4a — pgvector search index
    try {
      await indexCompany({
        domain,
        company:   c.name,
        country:   c.country,
        industry:  c.industry ?? undefined,
        employees: c.employeeCount ?? undefined,
        techStack: c.techStack,
        keywords:  [
          c.country, c.industry, c.city,
          ...(c.products ?? []),
          ...(c.tradeSignals ?? []),
        ].filter((v): v is string => Boolean(v)),
      });
    } catch (e) {
      console.warn(`  [index] Search index failed for ${domain}:`, (e as Error).message.slice(0, 60));
      errors++;
    }

    // 4b — Graph node
    try {
      await graph.upsertNode({
        id:       domain,
        type:     "supplier",
        name:     c.name,
        country:  c.country,
        industry: c.industry ?? undefined,
        metadata: { source: c.source, employees: c.employeeCount, revenue: c.revenue },
      });

      // Product edges
      for (const product of (c.products ?? []).slice(0, 5)) {
        const productId = product.toLowerCase().replace(/\s+/g, "-");
        await graph.upsertNode({ id: productId, type: "product", name: product });
        await graph.upsertEdge({ fromNode: domain, toNode: productId, relation: "SUPPLIES" });
      }

      count++;
    } catch (e) {
      console.warn(`  [graph] Graph upsert failed for ${domain}:`, (e as Error).message.slice(0, 60));
    }
  }

  return {
    task: "index",
    success: count > 0,
    count,
    errors,
    durationMs: elapsed(),
    detail: "pgvector + graph",
  };
}

// ─── Pipeline orchestrator ────────────────────────────────────────────────────

async function runPipeline(): Promise<void> {
  const runId = `run-${Date.now()}`;
  const startedAt = new Date();
  const totalTimer = timer();

  console.log(`\n${"═".repeat(60)}`);
  console.log(`[pipeline] Starting run ${runId} @ ${startedAt.toISOString()}`);
  console.log(`[pipeline] Sources: ${COLLECTOR_SOURCES.join(", ")} | Enrich: ${ENRICH_PROVIDER}`);
  console.log(`${"═".repeat(60)}`);

  const tasks: TaskResult[] = [];

  try {
    // ── Task 1: Collect ────────────────────────────────────────────────────
    console.log("\n[pipeline] Task 1 / 4 — Collecting companies...");
    const { result: r1, companies } = await task1_collect();
    tasks.push(r1);
    console.log(`  ✓ Collected ${r1.count} companies in ${r1.durationMs}ms (${r1.errors} errors)`);

    if (companies.length === 0) {
      console.log("  ⚠ No companies collected — skipping remaining tasks");
      await logRun({ runId, startedAt, tasks, totalDurationMs: totalTimer(), status: "partial" });
      return;
    }

    // ── Task 2: Enrich ─────────────────────────────────────────────────────
    console.log(`\n[pipeline] Task 2 / 4 — Enriching ${companies.length} companies...`);
    const { result: r2, enriched } = await task2_enrich(companies);
    tasks.push(r2);
    console.log(`  ✓ Enriched ${r2.count} companies in ${r2.durationMs}ms (${r2.errors} errors)`);

    // ── Task 3: Upsert DB ──────────────────────────────────────────────────
    console.log(`\n[pipeline] Task 3 / 4 — Upserting ${enriched.length} companies into DB...`);
    const { result: r3, upserted } = await task3_upsertDB(enriched);
    tasks.push(r3);
    console.log(`  ✓ Upserted ${r3.count} suppliers in ${r3.durationMs}ms (${r3.errors} errors)`);

    // ── Task 4: Index ──────────────────────────────────────────────────────
    console.log(`\n[pipeline] Task 4 / 4 — Indexing ${upserted.length} companies...`);
    const r4 = await task4_index(upserted);
    tasks.push(r4);
    console.log(`  ✓ Indexed ${r4.count} companies in ${r4.durationMs}ms (${r4.errors} errors)`);

  } catch (e) {
    console.error("[pipeline] Fatal error:", (e as Error).message);
    tasks.push({ task: "fatal", success: false, count: 0, errors: 1,
                 durationMs: totalTimer(), detail: (e as Error).message });
  }

  const totalMs = totalTimer();
  const allOk   = tasks.every(t => t.success);
  const anyOk   = tasks.some(t => t.success);
  const status  = allOk ? "success" : anyOk ? "partial" : "failed";

  console.log(`\n${"─".repeat(60)}`);
  console.log(`[pipeline] Run ${runId} complete — ${status.toUpperCase()} in ${(totalMs / 1000).toFixed(1)}s`);
  tasks.forEach(t =>
    console.log(`  ${t.success ? "✓" : "✗"} ${t.task.padEnd(12)} ${t.count} items, ${t.errors} errors, ${t.durationMs}ms`)
  );
  console.log(`${"─".repeat(60)}\n`);

  await logRun({ runId, startedAt, tasks, totalDurationMs: totalMs, status }).catch(() => {});
}

// ─── Cron scheduler ───────────────────────────────────────────────────────────

let _started = false;
let _running  = false;

export function startDataCollectionPipeline(): void {
  if (_started || !ENABLED) {
    if (!ENABLED) console.log("[pipeline] Disabled via PIPELINE_ENABLED=false");
    return;
  }
  _started = true;

  ensureRunLogTable().catch(e =>
    console.warn("[pipeline] Could not create pipeline_runs table:", (e as Error).message)
  );

  // Validate cron expression
  if (!cron.validate(CRON_SCHEDULE)) {
    console.error(`[pipeline] Invalid cron schedule: "${CRON_SCHEDULE}". Using default.`);
  }

  const schedule = cron.validate(CRON_SCHEDULE) ? CRON_SCHEDULE : "0 */6 * * *";

  cron.schedule(schedule, async () => {
    if (_running) {
      console.log("[pipeline] Previous run still active — skipping this tick");
      return;
    }
    _running = true;
    try {
      await runPipeline();
    } finally {
      _running = false;
    }
  });

  console.log(`[pipeline] Scheduled — cron: "${schedule}" | batch: ${BATCH_SIZE} | max: ${MAX_COLLECT}`);
}

/**
 * Manually trigger a single pipeline run (for /api/pipeline/trigger endpoint).
 * Returns without waiting if another run is active.
 */
export async function triggerPipelineRun(): Promise<{ started: boolean; reason?: string }> {
  if (_running) return { started: false, reason: "A run is already in progress" };
  _running = true;
  runPipeline().finally(() => { _running = false; });
  return { started: true };
}

/** Returns the last N pipeline runs from the log table. */
export async function getPipelineRuns(limit = 10): Promise<unknown[]> {
  try {
    const r = await pool.query(
      `SELECT id, started_at, finished_at, status, tasks, total_ms
       FROM pipeline_runs ORDER BY started_at DESC LIMIT $1`,
      [limit]
    );
    return r.rows;
  } catch {
    return [];
  }
}

/** Returns whether a run is currently active. */
export function isPipelineRunning(): boolean {
  return _running;
}
