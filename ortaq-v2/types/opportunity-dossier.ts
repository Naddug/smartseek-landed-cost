export type DossierStatus = "taslak" | "incelemede" | "onaylandi";

export type OwnerVisibilityLevel = "public" | "restricted" | "private";

export interface EvidenceFileMeta {
  id: string;
  name: string;
  tag: string;
  size: number;
  addedAt: string;
}

/** Full persisted opportunity dossier — aligns with future Prisma model */
export interface OpportunityDossier {
  id: string;
  slug: string;
  ownerId: string;
  status: DossierStatus;
  title: string;
  summary: string;
  category: string;
  stage: string;
  locationCity: string;
  locationDistrict: string;
  hideDistrict: boolean;
  visibilityLevel: OwnerVisibilityLevel;
  selectedAssets: string[];
  assetFollowUps: Record<string, Record<string, string>>;
  selectedBlockers: string[];
  partnerPriorities: string[];
  expectedTimeCommitment: string;
  expectedContributions: string[];
  returnModel: string;
  returnModelNotes: string;
  narrative: string;
  evidenceFiles: EvidenceFileMeta[];
  readinessScore: number;
  createdAt: string;
  updatedAt: string;
}

/** In-progress onboarding state (all fields optional until filled) */
export interface OwnerOnboardingState {
  category: string;
  stage: string;
  selectedAssets: string[];
  assetFollowUps: Record<string, Record<string, string>>;
  selectedBlockers: string[];
  partnerPriorities: string[];
  expectedTimeCommitment: string;
  expectedContributions: string[];
  returnModel: string;
  returnModelNotes: string;
  locationCity: string;
  locationDistrict: string;
  hideDistrict: boolean;
  visibilityLevel: OwnerVisibilityLevel | "";
  evidenceFiles: EvidenceFileMeta[];
  narrative: string;
  title: string;
  summary: string;
}

export const EMPTY_OWNER_ONBOARDING: OwnerOnboardingState = {
  category: "",
  stage: "",
  selectedAssets: [],
  assetFollowUps: {},
  selectedBlockers: [],
  partnerPriorities: [],
  expectedTimeCommitment: "",
  expectedContributions: [],
  returnModel: "",
  returnModelNotes: "",
  locationCity: "",
  locationDistrict: "",
  hideDistrict: false,
  visibilityLevel: "",
  evidenceFiles: [],
  narrative: "",
  title: "",
  summary: "",
};
