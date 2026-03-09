/**
 * Tech stack detection service with provider switching.
 * Supports: proxycurl, pdl, clearbit, crunchbase
 *
 * Also retains the existing Apify-based detector as a bonus provider.
 */

export type TechStackProvider = "proxycurl" | "pdl" | "clearbit" | "crunchbase" | "apify";

export interface TechStackData {
  domain: string;
  technologies: TechEntry[];
  categories: Record<string, string[]>; // category -> tech names
  cms: string | null;
  analytics: string | null;
  crm: string | null;
  erp: string | null;
  ecommerce: string | null;
  hosting: string | null;
  framework: string | null;
  provider: TechStackProvider;
  raw?: Record<string, unknown>;
}

export interface TechEntry {
  name: string;
  category: string | null;
}

// ─── Proxycurl ────────────────────────────────────────────────────────────────
// Proxycurl exposes tech stack on company profiles
async function fromProxycurl(domain: string): Promise<TechStackData> {
  const key = process.env.PROXYCURL_API_KEY;
  if (!key) throw new Error("PROXYCURL_API_KEY not set");

  const res = await fetch(
    `https://nubela.co/proxycurl/api/linkedin/company/resolve?company_domain=${encodeURIComponent(domain)}`,
    { headers: { Authorization: `Bearer ${key}` } }
  );
  if (!res.ok) throw new Error(`Proxycurl tech error: ${res.status} ${await res.text()}`);
  const d = await res.json() as Record<string, unknown>;

  const techs: TechEntry[] = Array.isArray(d.technologies)
    ? (d.technologies as Array<{ name?: string; category?: string }>).map(t => ({
        name: t.name ?? "Unknown",
        category: t.category ?? null,
      }))
    : [];

  return buildResult(domain, techs, "proxycurl", d);
}

// ─── People Data Labs ─────────────────────────────────────────────────────────
async function fromPDL(domain: string): Promise<TechStackData> {
  const key = process.env.PDL_API_KEY;
  if (!key) throw new Error("PDL_API_KEY not set");

  const res = await fetch(
    `https://api.peopledatalabs.com/v5/company/enrich?website=${encodeURIComponent(domain)}`,
    { headers: { "X-Api-Key": key } }
  );
  if (!res.ok) throw new Error(`PDL tech error: ${res.status} ${await res.text()}`);
  const d = await res.json() as Record<string, unknown>;

  const techs: TechEntry[] = Array.isArray(d.tech)
    ? (d.tech as string[]).map(name => ({ name, category: null }))
    : [];

  return buildResult(domain, techs, "pdl", d);
}

// ─── Clearbit ─────────────────────────────────────────────────────────────────
async function fromClearbit(domain: string): Promise<TechStackData> {
  const key = process.env.CLEARBIT_API_KEY;
  if (!key) throw new Error("CLEARBIT_API_KEY not set");

  const res = await fetch(
    `https://company.clearbit.com/v2/companies/find?domain=${encodeURIComponent(domain)}`,
    { headers: { Authorization: `Bearer ${key}` } }
  );
  if (!res.ok) throw new Error(`Clearbit tech error: ${res.status} ${await res.text()}`);
  const d = await res.json() as Record<string, unknown>;

  const techs: TechEntry[] = Array.isArray(d.tech)
    ? (d.tech as string[]).map(name => ({ name, category: guessClearbitCategory(name) }))
    : [];

  return buildResult(domain, techs, "clearbit", d);
}

function guessClearbitCategory(tech: string): string | null {
  const lower = tech.toLowerCase();
  if (/wordpress|drupal|shopify|wix|squarespace/.test(lower)) return "CMS";
  if (/google analytics|mixpanel|segment|amplitude|hotjar/.test(lower)) return "Analytics";
  if (/salesforce|hubspot|pipedrive|zoho/.test(lower)) return "CRM";
  if (/sap|oracle|netsuite|dynamics/.test(lower)) return "ERP";
  if (/shopify|magento|woocommerce|bigcommerce/.test(lower)) return "E-commerce";
  if (/aws|azure|gcp|cloudflare|vercel|heroku/.test(lower)) return "Hosting";
  if (/react|vue|angular|next|nuxt|svelte/.test(lower)) return "Framework";
  return null;
}

// ─── Crunchbase ───────────────────────────────────────────────────────────────
// Crunchbase doesn't expose tech stack — return empty with a note
async function fromCrunchbase(domain: string): Promise<TechStackData> {
  return {
    domain,
    technologies: [],
    categories: {},
    cms: null,
    analytics: null,
    crm: null,
    erp: null,
    ecommerce: null,
    hosting: null,
    framework: null,
    provider: "crunchbase",
    raw: { note: "Crunchbase does not expose tech stack data. Use clearbit or pdl instead." },
  };
}

// ─── Apify (existing service, wrapped) ───────────────────────────────────────
async function fromApify(domain: string): Promise<TechStackData> {
  const { getTechStack } = await import("./apifyTechService.js");
  const result = await getTechStack(domain);

  const techs: TechEntry[] = [
    result.cms && { name: result.cms, category: "CMS" },
    result.analytics && { name: result.analytics, category: "Analytics" },
    result.ads && { name: result.ads, category: "Advertising" },
    result.hosting && { name: result.hosting, category: "Hosting" },
    result.framework && { name: result.framework, category: "Framework" },
  ].filter(Boolean) as TechEntry[];

  return {
    domain,
    technologies: techs,
    categories: buildCategories(techs),
    cms: result.cms,
    analytics: result.analytics,
    crm: null,
    erp: null,
    ecommerce: null,
    hosting: result.hosting,
    framework: result.framework,
    provider: "apify",
    raw: result as unknown as Record<string, unknown>,
  };
}

// ─── Shared helpers ───────────────────────────────────────────────────────────
function buildCategories(techs: TechEntry[]): Record<string, string[]> {
  const cats: Record<string, string[]> = {};
  for (const t of techs) {
    const cat = t.category ?? "Other";
    (cats[cat] ??= []).push(t.name);
  }
  return cats;
}

function pickByCategory(techs: TechEntry[], ...cats: string[]): string | null {
  return techs.find(t => t.category && cats.includes(t.category))?.name ?? null;
}

function buildResult(
  domain: string,
  techs: TechEntry[],
  provider: TechStackProvider,
  raw: Record<string, unknown>
): TechStackData {
  return {
    domain,
    technologies: techs,
    categories: buildCategories(techs),
    cms: pickByCategory(techs, "CMS", "Content Management"),
    analytics: pickByCategory(techs, "Analytics", "Web Analytics"),
    crm: pickByCategory(techs, "CRM", "Customer Relationship Management"),
    erp: pickByCategory(techs, "ERP", "Enterprise Resource Planning"),
    ecommerce: pickByCategory(techs, "E-commerce", "Ecommerce"),
    hosting: pickByCategory(techs, "Hosting", "Cloud", "CDN"),
    framework: pickByCategory(techs, "Framework", "JavaScript Framework"),
    provider,
    raw,
  };
}

// ─── Public API ───────────────────────────────────────────────────────────────
const DEFAULT_PROVIDER: TechStackProvider =
  (process.env.TECH_STACK_PROVIDER as TechStackProvider) || "apify";

export async function getTechStack(
  domain: string,
  provider: TechStackProvider = DEFAULT_PROVIDER
): Promise<TechStackData> {
  switch (provider) {
    case "proxycurl":  return fromProxycurl(domain);
    case "pdl":        return fromPDL(domain);
    case "clearbit":   return fromClearbit(domain);
    case "crunchbase": return fromCrunchbase(domain);
    case "apify":      return fromApify(domain);
    default:
      throw new Error(`Unknown tech stack provider: ${provider}`);
  }
}
