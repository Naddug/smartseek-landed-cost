/**
 * Supplier enrichment service — verified-only join between `Supplier` /
 * `SupplierProfile` rows and the `CompanyEnrichment` table populated by the
 * SmartSeek website crawler.
 *
 * Strict no-fabrication policy:
 *   - Match is performed solely on a normalised website domain.
 *   - We never invent emails, phones, LinkedIn URLs or addresses.
 *   - Counts are surfaced even when previews are gated, but previews are
 *     never inferred from anything outside the matched enrichment row.
 *   - When confidence is below "Domain Verified" we return null.
 */

import { prisma } from "../../lib/prisma";

export type EnrichmentChannelKind =
  | "website"
  | "linkedin"
  | "email"
  | "phone"
  | "address";

/**
 * Confidence ladder used both for the overall enrichment record and for each
 * channel. Callers must treat anything below `Domain Verified` as untrusted.
 */
export type ConfidenceBand =
  | "Operator Reviewed"
  | "Registry Verified"
  | "Domain Verified"
  | "Self Reported"
  | "Pending Verification";

export interface EnrichmentChannel {
  kind: EnrichmentChannelKind;
  /** Number of distinct values present in the matched enrichment row. */
  count: number;
  /**
   * Human-readable preview value. `null` when contact gating prevents release
   * (typical for emails/phones in non-paid flows).
   */
  preview: string | null;
  confidence: ConfidenceBand;
}

export interface EnrichmentSnapshot {
  domain: string;
  source: string;
  confidence: ConfidenceBand;
  /** Pages crawled — operational maturity hint, never fabricated. */
  pagesVisited: number;
  /** ISO timestamp of the crawl that produced the matched data, when known. */
  lastUpdatedAt: string | null;
  channels: EnrichmentChannel[];
  /** Whether the supplier currently exposes verified contact previews. */
  contactReleasable: boolean;
}

/**
 * Reduce a website-style input to a clean lowercase host string. Returns
 * `null` for any input we cannot normalise — that intentionally aborts the
 * enrichment join and prevents false-positive matches.
 */
export function normalizeDomain(input: unknown): string | null {
  if (typeof input !== "string") return null;
  const trimmed = input.trim();
  if (!trimmed) return null;
  try {
    const u = new URL(trimmed.startsWith("http") ? trimmed : `https://${trimmed}`);
    const host = u.hostname.replace(/^www\./i, "").toLowerCase();
    if (!host || !host.includes(".")) return null;
    return host;
  } catch {
    return null;
  }
}

interface LookupOpts {
  website?: string | null;
  registryVerified?: boolean | null;
  contactVerified?: boolean | null;
  /**
   * When true, channel previews for sensitive fields (email/phone) are
   * exposed. When false, only counts + confidence are returned. Public,
   * unauthenticated, or free-tier callers must pass `false`.
   */
  contactReleasable?: boolean;
}

function pickBaseConfidence(opts: LookupOpts): ConfidenceBand {
  if (opts.registryVerified === true && opts.contactVerified === true) {
    return "Operator Reviewed";
  }
  if (opts.registryVerified === true) return "Registry Verified";
  return "Domain Verified";
}

/**
 * Returns an enrichment snapshot for a supplier-like row, or `null` when:
 *   - no domain can be derived from the website field
 *   - no `CompanyEnrichment` row exists for that domain
 *   - the matched row has no channels worth surfacing
 *
 * The function performs a single indexed lookup; it never crawls or contacts
 * external services. Phase 3 deliberately keeps enrichment passive.
 */
export async function lookupEnrichmentSnapshot(
  opts: LookupOpts
): Promise<EnrichmentSnapshot | null> {
  const domain = normalizeDomain(opts.website);
  if (!domain) return null;

  let row;
  try {
    row = await prisma.companyEnrichment.findUnique({ where: { domain } });
  } catch {
    return null;
  }
  if (!row) return null;

  const releasable = opts.contactReleasable === true;
  const baseConfidence = pickBaseConfidence(opts);

  const channels: EnrichmentChannel[] = [];

  channels.push({
    kind: "website",
    count: 1,
    preview: `https://${domain}`,
    confidence: baseConfidence,
  });

  const linkedins = Array.isArray(row.linkedins) ? row.linkedins.filter(Boolean) : [];
  if (linkedins.length > 0) {
    channels.push({
      kind: "linkedin",
      count: linkedins.length,
      // LinkedIn company URLs are public by design; safe to preview.
      preview: linkedins[0] ?? null,
      confidence: baseConfidence,
    });
  }

  const emails = Array.isArray(row.emails) ? row.emails.filter(Boolean) : [];
  if (emails.length > 0) {
    channels.push({
      kind: "email",
      count: emails.length,
      preview: releasable ? emails[0] ?? null : null,
      confidence: baseConfidence,
    });
  }

  const phones = Array.isArray(row.phones) ? row.phones.filter(Boolean) : [];
  if (phones.length > 0) {
    channels.push({
      kind: "phone",
      count: phones.length,
      preview: releasable ? phones[0] ?? null : null,
      confidence: baseConfidence,
    });
  }

  const addresses = Array.isArray(row.addresses) ? row.addresses.filter(Boolean) : [];
  if (addresses.length > 0) {
    channels.push({
      kind: "address",
      count: addresses.length,
      preview: addresses[0] ?? null,
      confidence: baseConfidence,
    });
  }

  // If the only channel we could produce is the website itself (which we
  // already derived from the input), there is no actual enrichment value
  // to surface — bail to keep the dossier honest.
  if (channels.length <= 1) return null;

  return {
    domain,
    source: "SmartSeek website intelligence",
    confidence: baseConfidence,
    pagesVisited: typeof row.pagesVisited === "number" ? row.pagesVisited : 0,
    lastUpdatedAt: row.crawledAt ? new Date(row.crawledAt).toISOString() : null,
    channels,
    contactReleasable: releasable,
  };
}
