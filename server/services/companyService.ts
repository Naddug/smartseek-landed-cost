/**
 * Company data service with provider switching.
 * Supports: proxycurl, pdl, clearbit, crunchbase
 */

export type CompanyProvider = "proxycurl" | "pdl" | "clearbit" | "crunchbase";

export interface CompanyData {
  domain: string;
  name: string | null;
  description: string | null;
  industry: string | null;
  employeeCount: number | null;
  foundedYear: number | null;
  headquarters: string | null;
  website: string | null;
  linkedin: string | null;
  revenue: string | null;
  funding: string | null;
  tags: string[];
  provider: CompanyProvider;
  raw?: Record<string, unknown>;
}

// ─── Proxycurl ────────────────────────────────────────────────────────────────
async function fromProxycurl(domain: string): Promise<CompanyData> {
  const key = process.env.PROXYCURL_API_KEY;
  if (!key) throw new Error("PROXYCURL_API_KEY not set");

  const url = `https://nubela.co/proxycurl/api/linkedin/company/resolve?company_domain=${encodeURIComponent(domain)}`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${key}` } });
  if (!res.ok) throw new Error(`Proxycurl error: ${res.status} ${await res.text()}`);
  const d = await res.json() as Record<string, unknown>;

  return {
    domain,
    name: (d.name as string) ?? null,
    description: (d.description as string) ?? null,
    industry: (d.industry as string) ?? null,
    employeeCount: (d.company_size_on_linkedin as number) ?? null,
    foundedYear: (d.founded_year as number) ?? null,
    headquarters: formatProxycurlHQ(d.hq as Record<string, string> | null),
    website: (d.website as string) ?? null,
    linkedin: (d.linkedin_internal_id as string) ? `https://www.linkedin.com/company/${d.linkedin_internal_id}` : null,
    revenue: null,
    funding: (d.total_funding_in_1b_dollars as number) != null ? `$${d.total_funding_in_1b_dollars}B` : null,
    tags: Array.isArray(d.specialities) ? (d.specialities as string[]) : [],
    provider: "proxycurl",
    raw: d,
  };
}

function formatProxycurlHQ(hq: Record<string, string> | null): string | null {
  if (!hq) return null;
  return [hq.city, hq.state, hq.country].filter(Boolean).join(", ") || null;
}

// ─── People Data Labs ─────────────────────────────────────────────────────────
async function fromPDL(domain: string): Promise<CompanyData> {
  const key = process.env.PDL_API_KEY;
  if (!key) throw new Error("PDL_API_KEY not set");

  const res = await fetch(
    `https://api.peopledatalabs.com/v5/company/enrich?website=${encodeURIComponent(domain)}`,
    { headers: { "X-Api-Key": key } }
  );
  if (!res.ok) throw new Error(`PDL error: ${res.status} ${await res.text()}`);
  const d = await res.json() as Record<string, unknown>;

  return {
    domain,
    name: (d.name as string) ?? null,
    description: (d.summary as string) ?? null,
    industry: (d.industry as string) ?? null,
    employeeCount: (d.employee_count as number) ?? null,
    foundedYear: (d.founded as number) ?? null,
    headquarters: formatPDLLocation(d.location as Record<string, string> | null),
    website: (d.website as string) ?? null,
    linkedin: (d.linkedin_url as string) ?? null,
    revenue: (d.annual_revenue as string) ?? null,
    funding: (d.total_funding_raised as number) != null ? `$${(d.total_funding_raised as number).toLocaleString()}` : null,
    tags: Array.isArray(d.tags) ? (d.tags as string[]) : [],
    provider: "pdl",
    raw: d,
  };
}

function formatPDLLocation(loc: Record<string, string> | null): string | null {
  if (!loc) return null;
  return [loc.locality, loc.region, loc.country].filter(Boolean).join(", ") || null;
}

// ─── Clearbit ─────────────────────────────────────────────────────────────────
async function fromClearbit(domain: string): Promise<CompanyData> {
  const key = process.env.CLEARBIT_API_KEY;
  if (!key) throw new Error("CLEARBIT_API_KEY not set");

  const res = await fetch(
    `https://company.clearbit.com/v2/companies/find?domain=${encodeURIComponent(domain)}`,
    { headers: { Authorization: `Bearer ${key}` } }
  );
  if (!res.ok) throw new Error(`Clearbit error: ${res.status} ${await res.text()}`);
  const d = await res.json() as Record<string, unknown>;

  const geo = d.geo as Record<string, string> | null;

  return {
    domain,
    name: (d.name as string) ?? null,
    description: (d.description as string) ?? null,
    industry: (d.category as Record<string, string>)?.industry ?? null,
    employeeCount: (d.metrics as Record<string, number>)?.employees ?? null,
    foundedYear: (d.foundedYear as number) ?? null,
    headquarters: geo ? [geo.city, geo.state, geo.country].filter(Boolean).join(", ") : null,
    website: (d.domain as string) ? `https://${d.domain}` : null,
    linkedin: (d.linkedin as Record<string, string>)?.handle
      ? `https://www.linkedin.com/company/${(d.linkedin as Record<string, string>).handle}`
      : null,
    revenue: (d.metrics as Record<string, string>)?.annualRevenue ?? null,
    funding: null,
    tags: Array.isArray((d.category as Record<string, unknown>)?.industryGroup)
      ? [(d.category as Record<string, string>).industryGroup]
      : [],
    provider: "clearbit",
    raw: d,
  };
}

// ─── Crunchbase ───────────────────────────────────────────────────────────────
async function fromCrunchbase(domain: string): Promise<CompanyData> {
  const key = process.env.CRUNCHBASE_API_KEY;
  if (!key) throw new Error("CRUNCHBASE_API_KEY not set");

  const searchRes = await fetch(
    `https://api.crunchbase.com/api/v4/searches/organizations`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-cb-user-key": key },
      body: JSON.stringify({
        field_ids: ["short_description", "num_employees_enum", "founded_on", "location_identifiers",
          "website_url", "linkedin", "revenue_range", "total_funding_usd", "categories", "short_description", "name"],
        predicate: { field_id: "website_url", operator_id: "domain_eq", values: [domain] },
        limit: 1,
      }),
    }
  );
  if (!searchRes.ok) throw new Error(`Crunchbase error: ${searchRes.status} ${await searchRes.text()}`);
  const data = await searchRes.json() as { entities?: Array<{ properties: Record<string, unknown> }> };
  const props = data.entities?.[0]?.properties ?? {};

  const locations = Array.isArray(props.location_identifiers)
    ? (props.location_identifiers as Array<{ value: string }>).map(l => l.value).join(", ")
    : null;

  return {
    domain,
    name: (props.name as string) ?? null,
    description: (props.short_description as string) ?? null,
    industry: Array.isArray(props.categories)
      ? (props.categories as Array<{ value: string }>)[0]?.value ?? null
      : null,
    employeeCount: null,
    foundedYear: props.founded_on ? parseInt(String(props.founded_on).slice(0, 4)) : null,
    headquarters: locations,
    website: (props.website_url as string) ?? null,
    linkedin: (props.linkedin as Record<string, string>)?.value ?? null,
    revenue: (props.revenue_range as string) ?? null,
    funding: (props.total_funding_usd as number) != null
      ? `$${((props.total_funding_usd as number) / 1_000_000).toFixed(1)}M`
      : null,
    tags: Array.isArray(props.categories)
      ? (props.categories as Array<{ value: string }>).map(c => c.value)
      : [],
    provider: "crunchbase",
    raw: props,
  };
}

// ─── Public API ───────────────────────────────────────────────────────────────
const DEFAULT_PROVIDER: CompanyProvider =
  (process.env.COMPANY_PROVIDER as CompanyProvider) || "pdl";

export async function getCompany(
  domain: string,
  provider: CompanyProvider = DEFAULT_PROVIDER
): Promise<CompanyData> {
  switch (provider) {
    case "proxycurl":  return fromProxycurl(domain);
    case "pdl":        return fromPDL(domain);
    case "clearbit":   return fromClearbit(domain);
    case "crunchbase": return fromCrunchbase(domain);
    default:
      throw new Error(`Unknown company provider: ${provider}`);
  }
}
