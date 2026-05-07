/**
 * Supplier procurement dossier — unified data contract for supplier detail
 * pages. Maps three sources into a single, nullable-friendly shape so the
 * client renders the same dossier regardless of where the data came from:
 *
 *   1. Curated public sample      (server/data/featured-suppliers.json)
 *   2. Authenticated directory    (Prisma `Supplier` table)
 *   3. Self-service supplier      (Prisma `SupplierProfile` table — future)
 *
 * Strict no-fabrication rules:
 *   - Every dossier field is either taken directly from the source row, or
 *     derived deterministically from existing values (parsed JSON/CSV strings,
 *     boolean tier mapping, strategic-material tag detection).
 *   - We never invent certifications, contacts, capacities, ratings, or
 *     review counts. Missing data is `null` / empty array, and the UI shows
 *     graceful labels like "Available upon RFQ qualification".
 *   - The optional `enrichment` block is populated by `supplierEnrichment.ts`
 *     only when a verified domain match exists. Otherwise it is `null`.
 */

import type { EnrichmentSnapshot } from "./supplierEnrichment";

export type SupplierProfileSource = "curated" | "directory" | "profile";

export type SupplierType = "manufacturer" | "trader" | "distributor" | null;

export interface VerificationState {
  /** True when the legal entity matches a public registry. */
  registryVerified: boolean;
  /** True when an operator has validated the contact channel. */
  contactVerified: boolean;
  /**
   * UI-friendly tier label derived from the booleans + provenance metadata.
   * "Verification pending" when neither flag is set. We do not invent
   * intermediate tiers.
   */
  tier: "Operator Verified" | "Registry Verified" | "Verification Pending";
}

export interface RegistryProvenance {
  /** Where this supplier record originated (e.g. "SmartSeek Directory"). */
  dataSource: string | null;
  /** Public registry record URL when known. */
  registryUrl: string | null;
  /** Public registry identifier (e.g. SAIC/Companies House number). */
  registryId: string | null;
  /** Industry classification code, when published. */
  sicCode: string | null;
}

export interface CommercialProfile {
  minOrderValue: number | null;
  currency: string | null;
  paymentTerms: string[];
  incoterms: string[];
  leadTimeDays: number | null;
  /** Free-form response speed band copy, e.g. "Within 24 hours". */
  responseTime: string | null;
}

export interface SupplierProcurementDossier {
  // ── Identity ──────────────────────────────────────────────────────────────
  source: SupplierProfileSource;
  slug: string;
  companyName: string;
  description: string | null;
  /** Short interpretive blurb (curated `tagline` or trimmed description). */
  tagline: string | null;
  type: SupplierType;
  isCurated: boolean;

  // ── Location ──────────────────────────────────────────────────────────────
  country: string | null;
  countryCode: string | null;
  city: string | null;
  region: string | null;

  // ── Capabilities ──────────────────────────────────────────────────────────
  industry: string | null;
  subIndustry: string | null;
  products: string[];
  certifications: string[];
  exportMarkets: string[];

  // ── Commercial ────────────────────────────────────────────────────────────
  commercial: CommercialProfile;

  // ── Company facts (no fabrication) ────────────────────────────────────────
  yearEstablished: number | null;
  employeeCount: number | null;
  /** Pre-computed band like "200-500"; preferred for display when present. */
  employeeBand: string | null;
  annualRevenue: string | null;

  // ── Trust signals ─────────────────────────────────────────────────────────
  verification: VerificationState;
  provenance: RegistryProvenance;

  /** Buyer rating average from the source row, when known. */
  rating: number | null;
  /** Number of buyer reviews, when known. Never inflated. */
  reviewCount: number | null;

  // ── Procurement intelligence (deterministic) ──────────────────────────────
  /** Strategic-material classification, normalised + de-duplicated. */
  strategicTags: string[];

  // ── Internal metadata ─────────────────────────────────────────────────────
  /**
   * Last time the underlying record was updated, when known. Null when not
   * exposed by the source endpoint.
   */
  lastUpdatedAt: string | null;

  /**
   * Whether the contact channel can currently be released to the buyer.
   * Curated/public flow always returns false (RFQ-gated).
   */
  contactReleasable: boolean;

  /**
   * Optional verified enrichment snapshot. Populated only when a domain
   * match exists in `CompanyEnrichment` and confidence is at least
   * "Domain Verified". `null` for curated, missing-website, or unmatched
   * suppliers.
   */
  enrichment: EnrichmentSnapshot | null;
}

// ────────────────────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────────────────────

/**
 * Parse a freeform list field that may arrive as JSON array, comma-separated
 * string, or null. Always returns a deduplicated array of trimmed entries.
 */
export function parseListField(input: unknown): string[] {
  if (Array.isArray(input)) {
    return Array.from(new Set(input.map((v) => String(v).trim()).filter(Boolean)));
  }
  if (typeof input !== "string") return [];
  const trimmed = input.trim();
  if (!trimmed) return [];
  if (trimmed.startsWith("[")) {
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return Array.from(
          new Set(parsed.map((v) => String(v).trim()).filter(Boolean))
        );
      }
    } catch {
      // fall through to comma split
    }
  }
  return Array.from(
    new Set(
      trimmed
        .split(/[,;\n]+/)
        .map((s) => s.trim())
        .filter(Boolean)
    )
  );
}

/**
 * Strategic material taxonomy used across the procurement positioning. The
 * matcher is deterministic and only flags a tag when the haystack contains
 * one of its synonym tokens.
 */
// Aligned with the EU Critical Raw Materials list and the US Defense Production
// Act strategic-and-critical materials list. Token rules are deterministic
// substring/word-boundary matches — we never invent a tag from a fuzzy match.
const STRATEGIC_TAG_RULES: Array<{ tag: string; tokens: string[] }> = [
  { tag: "Antimony",     tokens: ["antimony", "antimon"] },
  { tag: "Tungsten",     tokens: ["tungsten", "wolfram"] },
  { tag: "Tin",          tokens: ["\\btin\\b"] },
  { tag: "Copper",       tokens: ["copper", "cathode"] },
  { tag: "Aluminium",    tokens: ["aluminium", "aluminum"] },
  { tag: "Steel",        tokens: ["steel", "rebar", "hrc", "crc"] },
  { tag: "Alloys",       tokens: ["alloy", "ferro"] },
  { tag: "Rare Earths",  tokens: ["rare earth", "neodymium", "ndpr", "lanthanum", "dysprosium", "terbium", "praseodymium"] },
  { tag: "Lithium",      tokens: ["lithium"] },
  { tag: "Nickel",       tokens: ["nickel"] },
  { tag: "Cobalt",       tokens: ["cobalt"] },
  // Critical raw materials added on top of the original eleven. Each token is
  // a discriminating substring; we deliberately avoid short ambiguous tokens
  // (e.g. "Mn", "Cr") that would false-positive on unrelated text.
  { tag: "Molybdenum",   tokens: ["molybdenum", "moly oxide", "ferromoly"] },
  { tag: "Chromium",     tokens: ["chromium", "ferrochrome"] },
  { tag: "Vanadium",     tokens: ["vanadium", "ferrovanadium"] },
  { tag: "Manganese",    tokens: ["manganese", "ferromanganese", "silicomanganese"] },
  { tag: "Niobium",      tokens: ["niobium", "ferroniobium"] },
  { tag: "Tantalum",     tokens: ["tantalum"] },
  { tag: "Gallium",      tokens: ["gallium"] },
  { tag: "Germanium",    tokens: ["germanium"] },
  { tag: "Magnesium",    tokens: ["magnesium"] },
  { tag: "Bismuth",      tokens: ["bismuth"] },
  { tag: "Fabrication",  tokens: ["fabrication", "machining", "stamping", "cnc"] },
];

export function detectStrategicTags(parts: Array<string | null | undefined>): string[] {
  const haystack = parts
    .filter((p): p is string => typeof p === "string" && p.length > 0)
    .join(" \n ")
    .toLowerCase();
  if (!haystack) return [];
  const out: string[] = [];
  for (const rule of STRATEGIC_TAG_RULES) {
    for (const token of rule.tokens) {
      const re = new RegExp(token, "i");
      if (re.test(haystack)) {
        out.push(rule.tag);
        break;
      }
    }
  }
  return Array.from(new Set(out)).slice(0, 6);
}

function deriveVerification(opts: {
  verified?: boolean | null;
  contactVerified?: boolean | null;
}): VerificationState {
  const registryVerified = opts.verified === true;
  const contactVerified = opts.contactVerified === true;
  const tier: VerificationState["tier"] =
    registryVerified && contactVerified
      ? "Operator Verified"
      : registryVerified
      ? "Registry Verified"
      : "Verification Pending";
  return { registryVerified, contactVerified, tier };
}

// ────────────────────────────────────────────────────────────────────────────
// Mappers
// ────────────────────────────────────────────────────────────────────────────

export interface FeaturedSupplierShape {
  id: number;
  slug: string;
  company_name: string;
  country: string;
  country_code: string;
  city: string;
  industry: string;
  sub_industry: string;
  products: string[];
  tagline: string;
  type: "manufacturer" | "trader" | "distributor";
  verified: boolean;
  rating: number;
  employee_count_band: string;
  year_founded: number;
  is_curated: boolean;
}

/**
 * Map a curated FeaturedSupplier row into the unified dossier. Many
 * procurement fields are not authored in the curated dataset and remain null
 * by design — the UI handles that gracefully without fabrication.
 */
export function featuredToDossier(row: FeaturedSupplierShape): SupplierProcurementDossier {
  const parts = [row.industry, row.sub_industry, row.tagline, ...(row.products ?? [])];
  return {
    source: "curated",
    slug: row.slug,
    companyName: row.company_name,
    description: null,
    tagline: row.tagline || null,
    type: row.type ?? null,
    isCurated: row.is_curated === true,

    country: row.country || null,
    countryCode: row.country_code || null,
    city: row.city || null,
    region: null,

    industry: row.industry || null,
    subIndustry: row.sub_industry || null,
    products: row.products ?? [],
    certifications: [],
    exportMarkets: [],

    commercial: {
      minOrderValue: null,
      currency: null,
      paymentTerms: [],
      incoterms: [],
      leadTimeDays: null,
      responseTime: null,
    },

    yearEstablished: row.year_founded > 0 ? row.year_founded : null,
    employeeCount: null,
    employeeBand: row.employee_count_band || null,
    annualRevenue: null,

    verification: deriveVerification({ verified: row.verified, contactVerified: false }),
    provenance: {
      dataSource: "SmartSeek Curated Sample",
      registryUrl: null,
      registryId: null,
      sicCode: null,
    },

    rating: typeof row.rating === "number" && row.rating > 0 ? row.rating : null,
    reviewCount: null,

    strategicTags: detectStrategicTags(parts),

    lastUpdatedAt: null,
    contactReleasable: false,
    enrichment: null,
  };
}

/**
 * Shape that matches the Prisma `Supplier` row plus the few aliased columns
 * (`dataSource`, `registryUrl`, `registryId`, `sicCode`, `contactVerified`)
 * we already select in `GET /api/suppliers/:slug`.
 */
export interface PrismaSupplierShape {
  companyName?: string | null;
  slug?: string | null;
  country?: string | null;
  countryCode?: string | null;
  city?: string | null;
  region?: string | null;
  industry?: string | null;
  subIndustry?: string | null;
  products?: unknown;
  certifications?: unknown;
  description?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  website?: string | null;
  employeeCount?: number | null;
  annualRevenue?: string | null;
  yearEstablished?: number | null;
  verified?: boolean | null;
  rating?: number | null;
  reviewCount?: number | null;
  responseTime?: string | null;
  minOrderValue?: number | null;
  currency?: string | null;
  paymentTerms?: unknown;
  exportMarkets?: unknown;
  dataSource?: string | null;
  registryUrl?: string | null;
  registryId?: string | null;
  sicCode?: string | null;
  contactVerified?: boolean | null;
  updatedAt?: Date | string | null;
  /** Optional incoterm string when callers join from another table. */
  incoterms?: unknown;
  /** Optional lead-time in days when callers join from another table. */
  leadTimeDays?: number | null;
}

function inferTypeFromText(...parts: Array<string | null | undefined>): SupplierType {
  const text = parts
    .filter((p): p is string => typeof p === "string")
    .join(" ")
    .toLowerCase();
  if (!text) return null;
  if (/\b(distributor|distribution|wholesaler|reseller)\b/.test(text)) return "distributor";
  if (/\b(trader|trading|merchant)\b/.test(text)) return "trader";
  // Manufacturer signals include direct-source operators (mill, refinery,
  // smelter, foundry, mine) commonly used in metals & alloys descriptions.
  if (/\b(manufacturer|factory|producer|mill|refinery|smelter|foundry|mine)\b/.test(text)) return "manufacturer";
  return null;
}

/**
 * Bucket a raw employee headcount into the SmartSeek display band. The bands
 * are the same set used on the Become-a-Supplier intake form and the dossier
 * UI, so a directory row with a numeric `employeeCount` renders identically
 * to a self-service supplier that picked a band directly. Pure interpretation
 * — no fabrication.
 */
export function deriveEmployeeBand(count: number | null | undefined): string | null {
  if (typeof count !== "number" || !Number.isFinite(count) || count <= 0) return null;
  if (count < 10)    return "1-10";
  if (count < 50)    return "10-50";
  if (count < 200)   return "50-200";
  if (count < 500)   return "200-500";
  if (count < 1000)  return "500-1000";
  if (count < 5000)  return "1000-5000";
  return "5000+";
}

export function prismaSupplierToDossier(
  row: PrismaSupplierShape,
  opts: { contactReleasable?: boolean } = {}
): SupplierProcurementDossier {
  const products = parseListField(row.products);
  const certifications = parseListField(row.certifications);
  const paymentTerms = parseListField(row.paymentTerms);
  const exportMarkets = parseListField(row.exportMarkets);
  const incoterms = parseListField(row.incoterms);
  const tagline = row.description ? truncate(row.description, 180) : null;

  return {
    source: "directory",
    slug: row.slug ?? "",
    companyName: row.companyName ?? "",
    description: row.description ?? null,
    tagline,
    type: inferTypeFromText(row.description, row.industry, row.subIndustry),
    isCurated: false,

    country: row.country ?? null,
    countryCode: row.countryCode ?? null,
    city: row.city ?? null,
    region: row.region ?? null,

    industry: row.industry ?? null,
    subIndustry: row.subIndustry ?? null,
    products,
    certifications,
    exportMarkets,

    commercial: {
      minOrderValue:
        typeof row.minOrderValue === "number" && Number.isFinite(row.minOrderValue)
          ? row.minOrderValue
          : null,
      currency: row.currency ?? null,
      paymentTerms,
      incoterms,
      leadTimeDays:
        typeof row.leadTimeDays === "number" && Number.isFinite(row.leadTimeDays)
          ? row.leadTimeDays
          : null,
      responseTime: row.responseTime ?? null,
    },

    yearEstablished:
      typeof row.yearEstablished === "number" && row.yearEstablished > 0
        ? row.yearEstablished
        : null,
    employeeCount:
      typeof row.employeeCount === "number" && row.employeeCount > 0
        ? row.employeeCount
        : null,
    // Deterministic band derived from the actual headcount — no fabrication.
    employeeBand: deriveEmployeeBand(row.employeeCount ?? null),
    annualRevenue: row.annualRevenue ?? null,

    verification: deriveVerification({
      verified: row.verified,
      contactVerified: row.contactVerified,
    }),
    provenance: {
      dataSource: row.dataSource ?? null,
      registryUrl: row.registryUrl ?? null,
      registryId: row.registryId ?? null,
      sicCode: row.sicCode ?? null,
    },

    rating:
      typeof row.rating === "number" && row.rating > 0 ? row.rating : null,
    reviewCount:
      typeof row.reviewCount === "number" && row.reviewCount > 0
        ? row.reviewCount
        : null,

    strategicTags: detectStrategicTags([
      row.industry,
      row.subIndustry,
      row.description,
      ...products,
    ]),

    lastUpdatedAt: row.updatedAt ? new Date(row.updatedAt).toISOString() : null,
    contactReleasable: opts.contactReleasable === true,
    enrichment: null,
  };
}

function truncate(value: string, max: number): string {
  if (!value) return value;
  const clean = value.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  return clean.slice(0, max).trimEnd() + "…";
}
