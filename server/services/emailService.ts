/**
 * Email enrichment/lookup service with provider switching.
 * Supports: proxycurl, pdl, clearbit, crunchbase (Hunter used for email-specific lookup)
 */

export type EmailProvider = "proxycurl" | "pdl" | "clearbit" | "crunchbase";

export interface EmailData {
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  fullName: string | null;
  title: string | null;
  company: string | null;
  domain: string | null;
  linkedin: string | null;
  confidence: number | null; // 0-100
  verified: boolean;
  provider: EmailProvider;
  raw?: Record<string, unknown>;
}

// ─── Proxycurl ────────────────────────────────────────────────────────────────
async function fromProxycurl(email: string): Promise<EmailData> {
  const key = process.env.PROXYCURL_API_KEY;
  if (!key) throw new Error("PROXYCURL_API_KEY not set");

  const res = await fetch(
    `https://nubela.co/proxycurl/api/find-email/reverse?email=${encodeURIComponent(email)}`,
    { headers: { Authorization: `Bearer ${key}` } }
  );
  if (!res.ok) throw new Error(`Proxycurl error: ${res.status} ${await res.text()}`);
  const d = await res.json() as Record<string, unknown>;

  return {
    email,
    firstName: (d.first_name as string) ?? null,
    lastName: (d.last_name as string) ?? null,
    fullName: (d.full_name as string) ?? null,
    title: (d.occupation as string) ?? null,
    company: (d.experiences as Array<Record<string, string>>)?.[0]?.company ?? null,
    domain: email.split("@")[1] ?? null,
    linkedin: (d.linkedin_profile_url as string) ?? null,
    confidence: null,
    verified: false,
    provider: "proxycurl",
    raw: d,
  };
}

// ─── People Data Labs ─────────────────────────────────────────────────────────
async function fromPDL(email: string): Promise<EmailData> {
  const key = process.env.PDL_API_KEY;
  if (!key) throw new Error("PDL_API_KEY not set");

  const res = await fetch(
    `https://api.peopledatalabs.com/v5/person/enrich?email=${encodeURIComponent(email)}`,
    { headers: { "X-Api-Key": key } }
  );
  if (!res.ok) throw new Error(`PDL error: ${res.status} ${await res.text()}`);
  const d = await res.json() as Record<string, unknown>;

  const experiences = d.experience as Array<Record<string, unknown>> | null;
  const currentJob = experiences?.find(e => e.is_primary) ?? experiences?.[0] ?? null;

  return {
    email,
    firstName: (d.first_name as string) ?? null,
    lastName: (d.last_name as string) ?? null,
    fullName: (d.full_name as string) ?? null,
    title: (currentJob?.title as Record<string, string>)?.name ?? null,
    company: (currentJob?.company as Record<string, string>)?.name ?? null,
    domain: email.split("@")[1] ?? null,
    linkedin: (d.linkedin_url as string) ?? null,
    confidence: (d.likelihood as number) != null ? Math.round((d.likelihood as number) * 10) : null,
    verified: (d.emails as Array<Record<string, unknown>>)?.some(e => e.address === email && e.type === "professional") ?? false,
    provider: "pdl",
    raw: d,
  };
}

// ─── Clearbit ─────────────────────────────────────────────────────────────────
async function fromClearbit(email: string): Promise<EmailData> {
  const key = process.env.CLEARBIT_API_KEY;
  if (!key) throw new Error("CLEARBIT_API_KEY not set");

  const res = await fetch(
    `https://person.clearbit.com/v2/people/find?email=${encodeURIComponent(email)}`,
    { headers: { Authorization: `Bearer ${key}` } }
  );
  if (!res.ok) throw new Error(`Clearbit error: ${res.status} ${await res.text()}`);
  const d = await res.json() as Record<string, unknown>;

  const employment = d.employment as Record<string, string> | null;

  return {
    email,
    firstName: (d.name as Record<string, string>)?.givenName ?? null,
    lastName: (d.name as Record<string, string>)?.familyName ?? null,
    fullName: (d.name as Record<string, string>)?.fullName ?? null,
    title: employment?.title ?? null,
    company: employment?.name ?? null,
    domain: email.split("@")[1] ?? null,
    linkedin: (d.linkedin as Record<string, string>)?.handle
      ? `https://www.linkedin.com/in/${(d.linkedin as Record<string, string>).handle}`
      : null,
    confidence: null,
    verified: false,
    provider: "clearbit",
    raw: d,
  };
}

// ─── Crunchbase ───────────────────────────────────────────────────────────────
async function fromCrunchbase(email: string): Promise<EmailData> {
  // Crunchbase doesn't support email lookup directly — return partial data
  const domain = email.split("@")[1] ?? null;
  return {
    email,
    firstName: null,
    lastName: null,
    fullName: null,
    title: null,
    company: null,
    domain,
    linkedin: null,
    confidence: null,
    verified: false,
    provider: "crunchbase",
    raw: { note: "Crunchbase does not support direct email lookup. Use companyService with the domain instead." },
  };
}

// ─── Public API ───────────────────────────────────────────────────────────────
const DEFAULT_PROVIDER: EmailProvider =
  (process.env.EMAIL_PROVIDER as EmailProvider) || "pdl";

export async function getEmailData(
  email: string,
  provider: EmailProvider = DEFAULT_PROVIDER
): Promise<EmailData> {
  switch (provider) {
    case "proxycurl":  return fromProxycurl(email);
    case "pdl":        return fromPDL(email);
    case "clearbit":   return fromClearbit(email);
    case "crunchbase": return fromCrunchbase(email);
    default:
      throw new Error(`Unknown email provider: ${provider}`);
  }
}

/**
 * Find email addresses for a person at a company domain.
 * Only PDL and Proxycurl support this natively.
 */
export interface FindEmailParams {
  firstName?: string;
  lastName?: string;
  domain: string;
  linkedinUrl?: string;
}

export interface FindEmailResult {
  email: string | null;
  confidence: number | null;
  provider: EmailProvider;
}

export async function findEmail(
  params: FindEmailParams,
  provider: EmailProvider = DEFAULT_PROVIDER
): Promise<FindEmailResult> {
  if (provider === "proxycurl") {
    const key = process.env.PROXYCURL_API_KEY;
    if (!key) throw new Error("PROXYCURL_API_KEY not set");
    const qs = new URLSearchParams({
      first_name: params.firstName ?? "",
      last_name: params.lastName ?? "",
      domain: params.domain,
      ...(params.linkedinUrl ? { linkedin_profile_url: params.linkedinUrl } : {}),
    });
    const res = await fetch(`https://nubela.co/proxycurl/api/find-email?${qs}`, {
      headers: { Authorization: `Bearer ${key}` },
    });
    if (!res.ok) throw new Error(`Proxycurl findEmail error: ${res.status}`);
    const d = await res.json() as { email?: string; confidence?: number };
    return { email: d.email ?? null, confidence: d.confidence ?? null, provider };
  }

  if (provider === "pdl") {
    const key = process.env.PDL_API_KEY;
    if (!key) throw new Error("PDL_API_KEY not set");
    const res = await fetch(
      `https://api.peopledatalabs.com/v5/person/identify?first_name=${encodeURIComponent(params.firstName ?? "")}&last_name=${encodeURIComponent(params.lastName ?? "")}&company_website=${encodeURIComponent(params.domain)}`,
      { headers: { "X-Api-Key": key } }
    );
    if (!res.ok) throw new Error(`PDL findEmail error: ${res.status}`);
    const d = await res.json() as { data?: { emails?: Array<{ address: string }> }; likelihood?: number };
    return {
      email: d.data?.emails?.[0]?.address ?? null,
      confidence: d.likelihood != null ? Math.round(d.likelihood * 10) : null,
      provider,
    };
  }

  return { email: null, confidence: null, provider };
}
