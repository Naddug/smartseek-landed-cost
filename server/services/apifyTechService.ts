/**
 * Apify Tech Stack Detector service
 * Uses automation-lab~tech-stack-detector actor to detect technologies used by a domain.
 */

const APIFY_ACTOR = "automation-lab~tech-stack-detector";
const APIFY_RUN_SYNC_URL = `https://api.apify.com/v2/acts/${APIFY_ACTOR}/run-sync`;

export interface TechStackResult {
  domain: string;
  cms: string | null;
  analytics: string | null;
  ads: string | null;
  hosting: string | null;
  framework: string | null;
}

function toRequestUrl(domain: string): string {
  const trimmed = domain.trim().toLowerCase();
  if (!trimmed) return trimmed;
  // Strip protocol if present, then prepend https://
  const withoutProtocol = trimmed.replace(/^https?:\/\//, "").split("/")[0] || trimmed;
  return `https://${withoutProtocol}`;
}

function extractTechNames(items: Array<{ name?: string; [key: string]: unknown }> | null | undefined): string | null {
  if (!items || !Array.isArray(items) || items.length === 0) return null;
  const names = items
    .map((item) => (typeof item?.name === "string" ? item.name : null))
    .filter(Boolean) as string[];
  return names.length > 0 ? names.join(", ") : null;
}

export async function getTechStack(domain: string): Promise<TechStackResult> {
  const token = process.env.APIFY_TOKEN;
  if (!token) {
    throw new Error("APIFY_TOKEN is not set in environment variables");
  }

  const url = toRequestUrl(domain);
  if (!url) {
    throw new Error("Domain is required");
  }

  const runUrl = `${APIFY_RUN_SYNC_URL}?token=${token}`;

  let response: Response;
  try {
    response = await fetch(runUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Network error";
    throw new Error(`Tech stack request failed: ${msg}`);
  }

  const text = await response.text();
  let data: Record<string, unknown>;

  try {
    data = JSON.parse(text) || {};
  } catch {
    throw new Error("Invalid JSON response from Apify");
  }

  // Handle Apify error responses
  const status = data.status as string | undefined;
  const error = data.error as string | undefined;

  if (status === "FAILED" || !response.ok) {
    const errMsg = (error || data.message || data.statusMessage) as string | undefined;
    if (errMsg?.toLowerCase().includes("actor-not-found") || response.status === 404) {
      throw new Error("actor-not-found");
    }
    if (errMsg?.toLowerCase().includes("run-failed")) {
      throw new Error("run-failed");
    }
    if (response.status === 408 || errMsg?.toLowerCase().includes("timeout") || errMsg?.toLowerCase().includes("run-timeout-exceeded")) {
      throw new Error("run-timeout-exceeded");
    }
    throw new Error(errMsg || "run-failed");
  }

  // Fetch dataset items (run-sync returns Run object; dataset items are separate)
  const datasetId = data.defaultDatasetId as string | undefined;
  let firstItem: Record<string, unknown> = data;
  if (datasetId) {
    const datasetUrl = `https://api.apify.com/v2/datasets/${datasetId}/items?token=${token}`;
    const dsRes = await fetch(datasetUrl);
    const items = (await dsRes.json()) as Array<Record<string, unknown>>;
    if (Array.isArray(items) && items.length > 0) {
      firstItem = items[0];
    }
  }

  // Map common tech stack detector output fields to our simplified shape
  const raw = (firstItem || data) as Record<string, unknown>;
  const technologies = (raw.technologies ?? raw.tech ?? raw.detected ?? raw) as Record<string, unknown>;

  const cms = (technologies.cms ?? technologies.CMS ?? raw.cms) as Array<{ name?: string }> | string | null | undefined;
  const analytics = (technologies.analytics ?? raw.analytics) as Array<{ name?: string }> | string | null | undefined;
  const ads = (technologies.ads ?? technologies.advertising ?? raw.ads) as Array<{ name?: string }> | string | null | undefined;
  const hosting = (technologies.hosting ?? raw.hosting) as Array<{ name?: string }> | string | null | undefined;
  const framework = (technologies.framework ?? technologies.frameworks ?? raw.framework) as Array<{ name?: string }> | string | null | undefined;

  const toStr = (v: unknown): string | null => {
    if (v == null) return null;
    if (typeof v === "string") return v || null;
    if (Array.isArray(v)) return extractTechNames(v);
    return null;
  };

  const baseDomain = domain.trim().replace(/^https?:\/\//, "").split("/")[0] || domain;

  return {
    domain: baseDomain,
    cms: toStr(cms),
    analytics: toStr(analytics),
    ads: toStr(ads),
    hosting: toStr(hosting),
    framework: toStr(framework),
  };
}
