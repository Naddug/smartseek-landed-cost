/**
 * Trade data service with provider switching.
 * Supports: proxycurl, pdl, clearbit, crunchbase
 *
 * "Trade data" here covers import/export records, trade leads, buyer signals,
 * and company trade history — mapped from what each provider actually exposes.
 */

export type TradeProvider = "proxycurl" | "pdl" | "clearbit" | "crunchbase";

export interface TradeRecord {
  companyName: string | null;
  domain: string | null;
  country: string | null;
  industry: string | null;
  tradeRole: "buyer" | "supplier" | "unknown";
  importVolume: string | null;
  exportVolume: string | null;
  topProducts: string[];
  topPartnerCountries: string[];
  annualRevenue: string | null;
  employeeCount: number | null;
  fundingStage: string | null;
  signals: string[]; // e.g. "hiring", "expanding", "fundraising"
  provider: TradeProvider;
  raw?: Record<string, unknown>;
}

// ─── Proxycurl ────────────────────────────────────────────────────────────────
// Proxycurl is LinkedIn-based — trade signals come from job postings & company updates
async function fromProxycurl(domain: string): Promise<TradeRecord> {
  const key = process.env.PROXYCURL_API_KEY;
  if (!key) throw new Error("PROXYCURL_API_KEY not set");

  const res = await fetch(
    `https://nubela.co/proxycurl/api/linkedin/company/resolve?company_domain=${encodeURIComponent(domain)}&enrich_profiles=company`,
    { headers: { Authorization: `Bearer ${key}` } }
  );
  if (!res.ok) throw new Error(`Proxycurl trade error: ${res.status} ${await res.text()}`);
  const d = await res.json() as Record<string, unknown>;

  const signals: string[] = [];
  const updates = d.updates as Array<Record<string, unknown>> | null;
  if (updates && updates.length > 0) signals.push("active_linkedin_presence");
  if ((d.follower_count as number) > 10000) signals.push("large_following");

  return {
    companyName: (d.name as string) ?? null,
    domain,
    country: (d.hq as Record<string, string>)?.country ?? null,
    industry: (d.industry as string) ?? null,
    tradeRole: "unknown",
    importVolume: null,
    exportVolume: null,
    topProducts: Array.isArray(d.specialities) ? (d.specialities as string[]).slice(0, 5) : [],
    topPartnerCountries: [],
    annualRevenue: null,
    employeeCount: (d.company_size_on_linkedin as number) ?? null,
    fundingStage: (d.funding_data as Array<Record<string, string>>)?.[0]?.funding_type ?? null,
    signals,
    provider: "proxycurl",
    raw: d,
  };
}

// ─── People Data Labs ─────────────────────────────────────────────────────────
async function fromPDL(domain: string): Promise<TradeRecord> {
  const key = process.env.PDL_API_KEY;
  if (!key) throw new Error("PDL_API_KEY not set");

  const res = await fetch(
    `https://api.peopledatalabs.com/v5/company/enrich?website=${encodeURIComponent(domain)}`,
    { headers: { "X-Api-Key": key } }
  );
  if (!res.ok) throw new Error(`PDL trade error: ${res.status} ${await res.text()}`);
  const d = await res.json() as Record<string, unknown>;

  const signals: string[] = [];
  if ((d.employee_count_by_month as Record<string, number>)) signals.push("hiring_tracked");
  if (d.total_funding_raised) signals.push("funded");

  return {
    companyName: (d.name as string) ?? null,
    domain,
    country: (d.location as Record<string, string>)?.country ?? null,
    industry: (d.industry as string) ?? null,
    tradeRole: inferTradeRole(d.industry as string | null),
    importVolume: null,
    exportVolume: null,
    topProducts: Array.isArray(d.tags) ? (d.tags as string[]).slice(0, 5) : [],
    topPartnerCountries: Array.isArray(d.countries)
      ? (d.countries as string[]).slice(0, 5)
      : [],
    annualRevenue: (d.annual_revenue as string) ?? null,
    employeeCount: (d.employee_count as number) ?? null,
    fundingStage: (d.latest_funding_stage as string) ?? null,
    signals,
    provider: "pdl",
    raw: d,
  };
}

// ─── Clearbit ─────────────────────────────────────────────────────────────────
async function fromClearbit(domain: string): Promise<TradeRecord> {
  const key = process.env.CLEARBIT_API_KEY;
  if (!key) throw new Error("CLEARBIT_API_KEY not set");

  const res = await fetch(
    `https://company.clearbit.com/v2/companies/find?domain=${encodeURIComponent(domain)}`,
    { headers: { Authorization: `Bearer ${key}` } }
  );
  if (!res.ok) throw new Error(`Clearbit trade error: ${res.status} ${await res.text()}`);
  const d = await res.json() as Record<string, unknown>;

  const cat = d.category as Record<string, string> | null;
  const metrics = d.metrics as Record<string, unknown> | null;
  const geo = d.geo as Record<string, string> | null;

  const signals: string[] = [];
  if ((metrics?.alexaGlobalRank as number) < 100000) signals.push("high_web_traffic");
  if ((metrics?.raised as number) > 0) signals.push("funded");

  return {
    companyName: (d.name as string) ?? null,
    domain,
    country: geo?.country ?? null,
    industry: cat?.industry ?? null,
    tradeRole: inferTradeRole(cat?.industry ?? null),
    importVolume: null,
    exportVolume: null,
    topProducts: cat?.industryGroup ? [cat.industryGroup] : [],
    topPartnerCountries: [],
    annualRevenue: metrics?.annualRevenue as string ?? null,
    employeeCount: metrics?.employees as number ?? null,
    fundingStage: null,
    signals,
    provider: "clearbit",
    raw: d,
  };
}

// ─── Crunchbase ───────────────────────────────────────────────────────────────
async function fromCrunchbase(domain: string): Promise<TradeRecord> {
  const key = process.env.CRUNCHBASE_API_KEY;
  if (!key) throw new Error("CRUNCHBASE_API_KEY not set");

  const res = await fetch(
    "https://api.crunchbase.com/api/v4/searches/organizations",
    {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-cb-user-key": key },
      body: JSON.stringify({
        field_ids: [
          "name", "short_description", "categories", "location_identifiers",
          "revenue_range", "num_employees_enum", "last_funding_type",
          "total_funding_usd", "website_url", "status",
        ],
        predicate: { field_id: "website_url", operator_id: "domain_eq", values: [domain] },
        limit: 1,
      }),
    }
  );
  if (!res.ok) throw new Error(`Crunchbase trade error: ${res.status} ${await res.text()}`);
  const data = await res.json() as { entities?: Array<{ properties: Record<string, unknown> }> };
  const props = data.entities?.[0]?.properties ?? {};

  const cats = Array.isArray(props.categories)
    ? (props.categories as Array<{ value: string }>).map(c => c.value)
    : [];
  const locations = Array.isArray(props.location_identifiers)
    ? (props.location_identifiers as Array<{ value: string; location_type: string }>)
        .filter(l => l.location_type === "country")
        .map(l => l.value)
    : [];

  const signals: string[] = [];
  if (props.last_funding_type) signals.push("recently_funded");
  if (props.status === "ipo") signals.push("public_company");

  return {
    companyName: (props.name as string) ?? null,
    domain,
    country: locations[0] ?? null,
    industry: cats[0] ?? null,
    tradeRole: inferTradeRole(cats[0] ?? null),
    importVolume: null,
    exportVolume: null,
    topProducts: cats.slice(0, 5),
    topPartnerCountries: [],
    annualRevenue: (props.revenue_range as string) ?? null,
    employeeCount: parseEmployeeEnum(props.num_employees_enum as string | null),
    fundingStage: (props.last_funding_type as string) ?? null,
    signals,
    provider: "crunchbase",
    raw: props,
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function inferTradeRole(industry: string | null): "buyer" | "supplier" | "unknown" {
  if (!industry) return "unknown";
  const lower = industry.toLowerCase();
  if (/manufactur|mining|agricultural|chemical|textile|steel|metal|lumber/.test(lower)) return "supplier";
  if (/retail|wholesale|distribution|import|trading/.test(lower)) return "buyer";
  return "unknown";
}

function parseEmployeeEnum(val: string | null): number | null {
  if (!val) return null;
  const map: Record<string, number> = {
    c_00001_00010: 5, c_00011_00050: 30, c_00051_00100: 75,
    c_00101_00250: 175, c_00251_00500: 375, c_00501_01000: 750,
    c_01001_05000: 3000, c_05001_10000: 7500, c_10001_max: 15000,
  };
  return map[val] ?? null;
}

// ─── Public API ───────────────────────────────────────────────────────────────
const DEFAULT_PROVIDER: TradeProvider =
  (process.env.TRADE_PROVIDER as TradeProvider) || "pdl";

export async function getTradeData(
  domain: string,
  provider: TradeProvider = DEFAULT_PROVIDER
): Promise<TradeRecord> {
  switch (provider) {
    case "proxycurl":  return fromProxycurl(domain);
    case "pdl":        return fromPDL(domain);
    case "clearbit":   return fromClearbit(domain);
    case "crunchbase": return fromCrunchbase(domain);
    default:
      throw new Error(`Unknown trade provider: ${provider}`);
  }
}
