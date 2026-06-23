export type UserRole = "opportunity_owner" | "partner" | "admin";

export type OpportunityCategory =
  | "ecommerce"
  | "hospitality"
  | "manufacturing"
  | "healthcare"
  | "services"
  | "other";

export type OpportunityStage =
  | "idea"
  | "partially_built"
  | "operating_stalled"
  | "ready_to_scale";

export type OpportunityAsset =
  | "location"
  | "inventory"
  | "equipment"
  | "brand"
  | "customer_base"
  | "digital_infrastructure"
  | "team"
  | "licenses";

export type OpportunityBlocker =
  | "capital"
  | "operations"
  | "technical"
  | "marketing"
  | "production"
  | "regulatory"
  | "partnership";

export type PartnerType =
  | "investor"
  | "operator"
  | "technical"
  | "growth"
  | "industry_expert"
  | "production";

export type ContributionType =
  | "capital"
  | "operations"
  | "technical"
  | "growth"
  | "industry_expertise"
  | "production_capacity";

export type ReturnModel =
  | "revenue_share"
  | "equity_like"
  | "fixed_return"
  | "hybrid"
  | "negotiable";

export type VisibilityLevel = "private" | "matched_only" | "public";

export type ReadinessStatus =
  | "draft"
  | "incomplete"
  | "review_pending"
  | "published"
  | "paused";

export type MatchReason =
  | "category_fit"
  | "contribution_fit"
  | "stage_fit"
  | "location_fit"
  | "readiness_fit";

/** Temporary draft shape — will align with Prisma model later */
export interface OpportunityDraft {
  id: string;
  title: string;
  summary: string;
  category: OpportunityCategory;
  categoryLabel: string;
  stage: OpportunityStage;
  location: string;
  readinessScore: number;
  readinessStatus: ReadinessStatus;
  blockers: OpportunityBlocker[];
  assets: OpportunityAsset[];
  visibility: VisibilityLevel;
  updatedAt: string;
  /** Display label for primary blocker — TODO: derive from blockers[] via API */
  primaryBlockerLabel: string;
  /** Display label for sought partner type */
  neededPartnerLabel: string;
  /** Short label for existing assets — shown on dossier cards */
  assetsLabel?: string;
  /** Human-readable stage for dossier display */
  stageLabel?: string;
  /** Optional dossier reference id for display */
  fileRef?: string;
  /** One-line commercial hook — shown on cards; falls back to summary */
  hook?: string;
}

/** Temporary partner profile draft — will align with Prisma model later */
export interface PartnerProfileDraft {
  id: string;
  displayName: string;
  partnerTypes: PartnerType[];
  contributionTypes: ContributionType[];
  preferredCategories: OpportunityCategory[];
  preferredReturnModels: ReturnModel[];
  bio: string;
  readinessScore: number;
  updatedAt: string;
}
