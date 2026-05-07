/**
 * Client-side mirror of `server/lib/supplierDossier.ts`.
 *
 * Keep these types in sync with the server module. The dossier shape is
 * deliberately permissive: every procurement field can be null / empty so
 * that the UI can render gracefully whether the source row is curated,
 * directory, or self-service profile data.
 */

export type SupplierProfileSource = "curated" | "directory" | "profile";

export type SupplierType = "manufacturer" | "trader" | "distributor" | null;

export interface VerificationState {
  registryVerified: boolean;
  contactVerified: boolean;
  tier: "Operator Verified" | "Registry Verified" | "Verification Pending";
}

export interface RegistryProvenance {
  dataSource: string | null;
  registryUrl: string | null;
  registryId: string | null;
  sicCode: string | null;
}

export interface CommercialProfile {
  minOrderValue: number | null;
  currency: string | null;
  paymentTerms: string[];
  incoterms: string[];
  leadTimeDays: number | null;
  responseTime: string | null;
}

export interface SupplierProcurementDossier {
  source: SupplierProfileSource;
  slug: string;
  companyName: string;
  description: string | null;
  tagline: string | null;
  type: SupplierType;
  isCurated: boolean;

  country: string | null;
  countryCode: string | null;
  city: string | null;
  region: string | null;

  industry: string | null;
  subIndustry: string | null;
  products: string[];
  certifications: string[];
  exportMarkets: string[];

  commercial: CommercialProfile;

  yearEstablished: number | null;
  employeeCount: number | null;
  employeeBand: string | null;
  annualRevenue: string | null;

  verification: VerificationState;
  provenance: RegistryProvenance;

  rating: number | null;
  reviewCount: number | null;

  strategicTags: string[];

  lastUpdatedAt: string | null;
  contactReleasable: boolean;

  enrichment: EnrichmentSnapshot | null;
}

/**
 * Verified-only enrichment data sourced from the SmartSeek crawler join. The
 * server populates this only when a domain match exists; the client must
 * treat a missing or null value as "no enrichment available — show RFQ-gated
 * fallback messaging".
 */
export type EnrichmentChannelKind =
  | "website"
  | "linkedin"
  | "email"
  | "phone"
  | "address";

export type ConfidenceBand =
  | "Operator Reviewed"
  | "Registry Verified"
  | "Domain Verified"
  | "Self Reported"
  | "Pending Verification";

export interface EnrichmentChannel {
  kind: EnrichmentChannelKind;
  count: number;
  preview: string | null;
  confidence: ConfidenceBand;
}

export interface EnrichmentSnapshot {
  domain: string;
  source: string;
  confidence: ConfidenceBand;
  pagesVisited: number;
  lastUpdatedAt: string | null;
  channels: EnrichmentChannel[];
  contactReleasable: boolean;
}
