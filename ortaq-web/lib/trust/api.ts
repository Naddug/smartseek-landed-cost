import type {
  VerificationPublicLabel,
  PlatformTrustSnapshot,
  CampaignPublicSnapshot,
  PublicTransparencyRecord,
} from "@/lib/trust/types";

export type { VerificationPublicLabel, PlatformTrustSnapshot, CampaignPublicSnapshot, PublicTransparencyRecord };

export type ComplaintCategory =
  | "misleading_information"
  | "cannot_withdraw"
  | "document_missing"
  | "identity_theft"
  | "harassment"
  | "technical"
  | "other";

export type ComplaintSubmission = {
  category: ComplaintCategory;
  description: string;
  contactEmail: string;
  campaignSlug?: string;
};

export type ComplaintResponse = {
  publicRef: string;
  status: string;
  message: string;
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

async function fetchJson<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_BASE}${path}`);
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export async function getPlatformTrust(): Promise<PlatformTrustSnapshot | null> {
  return fetchJson<PlatformTrustSnapshot>("/v1/trust/platform");
}

export async function getTransparencyFeed(): Promise<PublicTransparencyRecord[]> {
  const data = await fetchJson<{ items: PublicTransparencyRecord[] }>("/v1/trust/transparency");
  return data?.items ?? [];
}

export async function getCampaignTrust(slug: string): Promise<CampaignPublicSnapshot | null> {
  return fetchJson<CampaignPublicSnapshot>(`/v1/campaigns/${slug}`);
}

export async function submitComplaint(input: ComplaintSubmission): Promise<ComplaintResponse | { error: string }> {
  try {
    const res = await fetch(`${API_BASE}/v1/complaints`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    const data = await res.json();
    if (!res.ok) return { error: data.error ?? "submission_failed" };
    return data as ComplaintResponse;
  } catch {
    return { error: "network_error" };
  }
}

/** Map verification label → i18n key */
export function verificationLabelKey(label: VerificationPublicLabel): string {
  return `trust.verification.${label}`;
}

/** Platform TrustStatus unchanged — entity verification uses separate keys */
export function isInvestorReady(campaign: CampaignPublicSnapshot): boolean {
  return campaign.investorReady && campaign.verificationLabel === "approved";
}
