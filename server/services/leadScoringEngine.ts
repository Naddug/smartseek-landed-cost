/**
 * Lead Scoring Engine
 *
 * Scores companies 0–100 using four weighted dimensions:
 *
 *   Employee Size   25 pts   — sweet-spot company scale for B2B deals
 *   Industry Fit    25 pts   — how relevant the industry is to sourcing/supply-chain
 *   Tech Stack      25 pts   — tool signals for budget, sophistication, intent
 *   Website Traffic 25 pts   — reach / traction proxy (SimilarWeb if key set,
 *                              else enrichment proxy signals)
 *
 * Usage:
 *   import { scoreCompany, scoreDomain } from "./leadScoringEngine";
 *
 *   // Supply your own data
 *   const r = scoreCompany({ industry: "Manufacturing", employeeMin: 100, techStack: ["Shopify"] });
 *
 *   // Auto-fetch from DB enrichment + optional SimilarWeb
 *   const r = await scoreDomain("acme.com");
 */

import { prisma } from "../../lib/prisma.js";

// ─── Public types ─────────────────────────────────────────────────────────────

export interface LeadScoringInput {
  domain?:       string;
  companyName?:  string;

  // Company size — accept any of these forms
  employeeCount?: number;  // exact headcount
  employeeMin?:   number;
  employeeMax?:   number;
  employees?:     string;  // raw "50-249" or "1,000+"

  industry?: string;

  techStack?: string[];    // tool names, any case

  // Traffic — provide if you have it (SimilarWeb, etc.)
  trafficMonthlyVisits?: number;
  trafficGlobalRank?:    number;

  // Enrichment signals used as traffic proxy when real data unavailable
  hasEmail?:    boolean;
  hasPhone?:    boolean;
  hasLinkedin?: boolean;
  hasAddress?:  boolean;
  keywordCount?: number;
  pagesVisited?: number;
}

export interface ScoreBreakdown {
  employeeScore:  number;   // 0–25
  industryScore:  number;   // 0–25
  techStackScore: number;   // 0–25
  trafficScore:   number;   // 0–25
  total:          number;   // 0–100
  tier:           LeadTier;
  notes:          string[];
}

export type LeadTier = "hot" | "warm" | "cold";

export interface LeadScoreResult {
  leadScore:  number;
  breakdown:  ScoreBreakdown;
  scoredAt:   Date;
}

// ─── Industry tiers ───────────────────────────────────────────────────────────
// Ordered best→worst fit for a sourcing / supply-chain platform

const INDUSTRY_TIERS: Record<number, RegExp[]> = {
  25: [
    /manufactur/i,
    /wholesale/i,
    /import.*export|export.*import/i,
    /supply.?chain/i,
    /logistics/i,
    /distribution/i,
    /trading/i,
    /sourcing/i,
    /procurement/i,
    /e.?commerce|ecommerce/i,
    /retail/i,
  ],
  20: [
    /automotive/i,
    /food.*(beverage|drink|processing)/i,
    /agriculture|agri/i,
    /pharmaceutical|pharma/i,
    /chemical/i,
    /textile|apparel|fashion/i,
    /electronics|semiconductor/i,
    /hardware/i,
    /packaging/i,
    /warehouse/i,
  ],
  15: [
    /technology|software|saas/i,
    /healthcare|medical/i,
    /construction/i,
    /mining/i,
    /energy|oil.*gas/i,
    /aerospace/i,
    /furniture/i,
    /consumer.goods/i,
    /industrial/i,
  ],
  10: [
    /financial|banking|insurance/i,
    /professional.services|consulting/i,
    /real.estate/i,
    /hospitality|hotel|travel/i,
    /media|publishing|advertising/i,
  ],
};

const INDUSTRY_DEFAULT = 7;

function scoreIndustry(industry: string | undefined): { score: number; note: string } {
  if (!industry) return { score: INDUSTRY_DEFAULT, note: "Industry unknown — default score" };
  for (const [pts, patterns] of Object.entries(INDUSTRY_TIERS).sort((a, b) => Number(b[0]) - Number(a[0]))) {
    if ((patterns as RegExp[]).some(re => re.test(industry))) {
      return { score: Number(pts), note: `Industry "${industry}" → tier ${pts}` };
    }
  }
  return { score: INDUSTRY_DEFAULT, note: `Industry "${industry}" — no tier match, default` };
}

// ─── Employee size ────────────────────────────────────────────────────────────

/** Parse headcount from a raw string like "50-249", "1,000+", "500" */
function parseEmployeeString(raw: string): { min: number; max: number } {
  const clean = raw.replace(/,/g, "").replace(/\s/g, "");

  // "1000+" → min 1000
  const plusMatch = clean.match(/^(\d+)\+$/);
  if (plusMatch) return { min: parseInt(plusMatch[1]), max: parseInt(plusMatch[1]) * 3 };

  // "50-249"
  const rangeMatch = clean.match(/^(\d+)[-–](\d+)$/);
  if (rangeMatch) return { min: parseInt(rangeMatch[1]), max: parseInt(rangeMatch[2]) };

  // single number
  const single = parseInt(clean.replace(/\D/g, ""));
  if (!isNaN(single)) return { min: single, max: single };

  return { min: 0, max: 0 };
}

function resolveHeadcount(input: LeadScoringInput): { min: number; max: number } {
  if (input.employeeCount) return { min: input.employeeCount, max: input.employeeCount };
  if (input.employeeMin != null || input.employeeMax != null) {
    return { min: input.employeeMin ?? 0, max: input.employeeMax ?? (input.employeeMin ?? 0) * 2 };
  }
  if (input.employees) return parseEmployeeString(input.employees);
  return { min: 0, max: 0 };
}

function scoreEmployees(input: LeadScoringInput): { score: number; note: string } {
  const { min, max } = resolveHeadcount(input);
  const mid = min === 0 && max === 0 ? -1 : Math.round((min + max) / 2);

  if (mid === -1)  return { score: 8, note: "Employee count unknown — default" };
  if (mid < 10)    return { score: 4, note: `${mid} employees — too small` };
  if (mid < 50)    return { score: 12, note: `${mid} employees — small` };
  if (mid < 200)   return { score: 20, note: `${mid} employees — mid-market` };
  if (mid < 1000)  return { score: 25, note: `${mid} employees — sweet spot` };
  if (mid < 5000)  return { score: 20, note: `${mid} employees — large enterprise` };
  return            { score: 14, note: `${mid} employees — very large, long sales cycle` };
}

// ─── Tech stack ───────────────────────────────────────────────────────────────

// Signals and their point values — capped at 25
const TECH_SIGNALS: Array<{ weight: number; label: string; patterns: RegExp[] }> = [
  {
    weight: 8,
    label: "Enterprise ERP/CRM",
    patterns: [/salesforce/i, /sap/i, /oracle/i, /dynamics\s*365/i, /netsuite/i, /hubspot/i, /zoho/i],
  },
  {
    weight: 8,
    label: "E-commerce platform",
    patterns: [/shopify/i, /magento/i, /woocommerce/i, /bigcommerce/i, /prestashop/i, /opencart/i],
  },
  {
    weight: 6,
    label: "Marketing automation",
    patterns: [/marketo/i, /pardot/i, /mailchimp/i, /klaviyo/i, /activecampaign/i, /eloqua/i],
  },
  {
    weight: 5,
    label: "Analytics / data",
    patterns: [/google.analytics|ga4/i, /mixpanel/i, /amplitude/i, /segment/i, /heap/i, /hotjar/i, /tableau/i, /looker/i],
  },
  {
    weight: 4,
    label: "Cloud infrastructure",
    patterns: [/\baws\b/i, /amazon.web/i, /\bgcp\b/i, /google.cloud/i, /azure/i, /cloudflare/i],
  },
  {
    weight: 4,
    label: "Payment processing",
    patterns: [/stripe/i, /paypal/i, /braintree/i, /adyen/i, /square/i],
  },
  {
    weight: 3,
    label: "Customer support",
    patterns: [/zendesk/i, /intercom/i, /freshdesk/i, /salesforce.service/i],
  },
  {
    weight: 3,
    label: "Supply-chain / ERP",
    patterns: [/sap.*ariba/i, /coupa/i, /netsuite/i, /dynamics.*supply/i, /infor/i],
  },
];

function scoreTechStack(techStack: string[] | undefined): { score: number; note: string } {
  if (!techStack || techStack.length === 0) {
    return { score: 8, note: "No tech stack data — default" };
  }

  const techStr = techStack.join(" ");
  let pts = 0;
  const matched: string[] = [];

  for (const signal of TECH_SIGNALS) {
    if (signal.patterns.some(re => re.test(techStr))) {
      pts += signal.weight;
      matched.push(signal.label);
    }
  }

  const score = Math.min(25, pts === 0 ? 6 : pts);
  const note = matched.length > 0
    ? `Tech signals: ${matched.join(", ")}`
    : "Tech stack present but no high-value signals";

  return { score, note };
}

// ─── Website traffic ──────────────────────────────────────────────────────────

/** Fetch monthly visits from SimilarWeb API if key is configured */
async function fetchSimilarWebTraffic(
  domain: string
): Promise<{ monthlyVisits: number; globalRank: number } | null> {
  const key = process.env.SIMILARWEB_API_KEY;
  if (!key) return null;

  try {
    const url =
      `https://api.similarweb.com/v1/website/${encodeURIComponent(domain)}/traffic-and-engagement/visits` +
      `?api_key=${key}&start_date=${lastMonthISO()}&end_date=${thisMonthISO()}&granularity=monthly&main_domain_only=false&format=json`;
    const res = await fetch(url, { signal: AbortSignal.timeout(6_000) });
    if (!res.ok) return null;
    const data = await res.json() as Record<string, unknown>;
    const visits = Array.isArray(data.visits) && data.visits.length > 0
      ? (data.visits as Array<{ visits: number }>).at(-1)?.visits ?? 0
      : 0;
    const rank = (data.global_rank as number) ?? 0;
    return { monthlyVisits: visits, globalRank: rank };
  } catch {
    return null;
  }
}

function lastMonthISO(): string {
  const d = new Date();
  d.setMonth(d.getMonth() - 2);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}
function thisMonthISO(): string {
  const d = new Date();
  d.setMonth(d.getMonth() - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

/** Score from real monthly visits */
function scoreFromVisits(visits: number): number {
  if (visits >= 1_000_000) return 25;
  if (visits >= 100_000)   return 22;
  if (visits >= 10_000)    return 18;
  if (visits >= 1_000)     return 14;
  if (visits >= 100)       return 10;
  return 6;
}

/** Score from global rank (lower = better) */
function scoreFromRank(rank: number): number {
  if (rank <= 0)         return 0;  // no rank data
  if (rank <= 100_000)   return 25;
  if (rank <= 500_000)   return 20;
  if (rank <= 1_000_000) return 15;
  if (rank <= 5_000_000) return 10;
  return 6;
}

/** Proxy traffic score from enrichment signals when no real traffic data */
function scoreTrafficProxy(input: LeadScoringInput): { score: number; note: string } {
  let pts = 0;
  const signals: string[] = [];

  if (input.hasEmail)    { pts += 5; signals.push("has email"); }
  if (input.hasPhone)    { pts += 4; signals.push("has phone"); }
  if (input.hasLinkedin) { pts += 5; signals.push("has LinkedIn"); }
  if (input.hasAddress)  { pts += 4; signals.push("has address"); }

  const kw = input.keywordCount ?? 0;
  if (kw >= 30)       { pts += 4; signals.push(`${kw} keywords`); }
  else if (kw >= 15)  { pts += 3; signals.push(`${kw} keywords`); }
  else if (kw >= 5)   { pts += 2; signals.push(`${kw} keywords`); }

  const pg = input.pagesVisited ?? 0;
  if (pg >= 15)       { pts += 3; signals.push(`${pg} pages crawled`); }
  else if (pg >= 5)   { pts += 2; signals.push(`${pg} pages crawled`); }

  const score = Math.min(25, pts);
  const note = signals.length > 0
    ? `Traffic proxy signals: ${signals.join(", ")}`
    : "No traffic or enrichment signals available";

  return { score, note };
}

async function scoreTraffic(
  input: LeadScoringInput
): Promise<{ score: number; note: string }> {
  // 1. Caller already has traffic numbers
  if (input.trafficMonthlyVisits != null) {
    const score = scoreFromVisits(input.trafficMonthlyVisits);
    return { score, note: `${input.trafficMonthlyVisits.toLocaleString()} monthly visits` };
  }
  if (input.trafficGlobalRank != null) {
    const score = scoreFromRank(input.trafficGlobalRank);
    return { score, note: `Global rank #${input.trafficGlobalRank.toLocaleString()}` };
  }

  // 2. Try SimilarWeb API
  if (input.domain) {
    const sw = await fetchSimilarWebTraffic(input.domain);
    if (sw) {
      const visitScore = scoreFromVisits(sw.monthlyVisits);
      const rankScore  = scoreFromRank(sw.globalRank);
      const score = Math.max(visitScore, rankScore);
      return {
        score,
        note: `SimilarWeb: ${sw.monthlyVisits.toLocaleString()} visits/mo, rank #${sw.globalRank.toLocaleString()}`,
      };
    }
  }

  // 3. Enrichment proxy
  return scoreTrafficProxy(input);
}

// ─── Tier classifier ─────────────────────────────────────────────────────────

function classifyTier(total: number): LeadTier {
  if (total >= 70) return "hot";
  if (total >= 40) return "warm";
  return "cold";
}

// ─── Core scorer ─────────────────────────────────────────────────────────────

export async function scoreCompany(input: LeadScoringInput): Promise<LeadScoreResult> {
  const employeeResult  = scoreEmployees(input);
  const industryResult  = scoreIndustry(input.industry);
  const techResult      = scoreTechStack(input.techStack);
  const trafficResult   = await scoreTraffic(input);

  const total = Math.min(
    100,
    employeeResult.score + industryResult.score + techResult.score + trafficResult.score
  );

  const breakdown: ScoreBreakdown = {
    employeeScore:  employeeResult.score,
    industryScore:  industryResult.score,
    techStackScore: techResult.score,
    trafficScore:   trafficResult.score,
    total,
    tier: classifyTier(total),
    notes: [
      employeeResult.note,
      industryResult.note,
      techResult.note,
      trafficResult.note,
    ],
  };

  return { leadScore: total, breakdown, scoredAt: new Date() };
}

// ─── Domain-aware scorer: auto-loads enrichment from DB ──────────────────────

export async function scoreDomain(domain: string): Promise<LeadScoreResult> {
  const d = domain.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0];

  // Try to load from company_enrichments table
  const enrichment = await prisma.companyEnrichment.findUnique({ where: { domain: d } });

  // Also try to load from companies table
  const company = await prisma.company.findFirst({
    where: { domain: d },
    orderBy: { createdAt: "desc" },
  });

  const input: LeadScoringInput = {
    domain: d,
    industry:    company?.industry ?? undefined,
    employeeMin: company?.employeeMin ?? undefined,
    employeeMax: company?.employeeMax ?? undefined,
    employees:   company?.employees ?? undefined,
    techStack:   company?.techStack ?? [],

    // Enrichment signals for traffic proxy
    hasEmail:    (enrichment?.emails?.length ?? 0) > 0,
    hasPhone:    (enrichment?.phones?.length ?? 0) > 0,
    hasLinkedin: (enrichment?.linkedins?.length ?? 0) > 0,
    hasAddress:  (enrichment?.addresses?.length ?? 0) > 0,
    keywordCount: enrichment?.keywords?.length ?? 0,
    pagesVisited: enrichment?.pagesVisited ?? 0,
  };

  const result = await scoreCompany(input);

  // Persist score back to enrichment record if it exists
  if (enrichment) {
    await prisma.companyEnrichment.update({
      where: { domain: d },
      data: {
        leadScore:      result.leadScore,
        scoreBreakdown: result.breakdown as unknown as object,
        scoredAt:       result.scoredAt,
      },
    });
  }

  return result;
}

// ─── Batch scorer ─────────────────────────────────────────────────────────────

export interface BatchScoreItem {
  domain: string;
  leadScore: number;
  tier: LeadTier;
  scoredAt: Date;
}

export async function scoreBatch(domains: string[]): Promise<BatchScoreItem[]> {
  const results: BatchScoreItem[] = [];
  // Sequential to avoid hammering SimilarWeb API rate limits
  for (const domain of domains) {
    try {
      const r = await scoreDomain(domain);
      results.push({ domain, leadScore: r.leadScore, tier: r.breakdown.tier, scoredAt: r.scoredAt });
    } catch {
      results.push({ domain, leadScore: 0, tier: "cold", scoredAt: new Date() });
    }
  }
  return results;
}

// ─── List top leads ───────────────────────────────────────────────────────────

export async function getTopLeads(opts: { take?: number; tier?: LeadTier } = {}) {
  const take = opts.take ?? 50;
  const records = await prisma.companyEnrichment.findMany({
    where: {
      leadScore: { not: null },
      ...(opts.tier
        ? {
            scoreBreakdown: {
              path: ["tier"],
              equals: opts.tier,
            },
          }
        : {}),
    },
    orderBy: { leadScore: "desc" },
    take,
    select: {
      id: true,
      domain: true,
      companyId: true,
      emails: true,
      phones: true,
      linkedins: true,
      leadScore: true,
      scoreBreakdown: true,
      scoredAt: true,
      crawledAt: true,
    },
  });
  return records;
}
