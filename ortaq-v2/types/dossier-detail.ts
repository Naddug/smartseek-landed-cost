import type { UserRoleMode } from "@/types/nav";

export type DossierDetailStatus =
  | "draft"
  | "under_review"
  | "published"
  | "matched"
  | "archived"
  | "rejected";

export type MatchInterestState = "none" | "applied" | "in_review" | "matched";

export type DossierVerification = {
  companyVerified?: boolean;
  identityVerified?: boolean;
  locationVerified?: boolean;
  dossierReviewed?: boolean;
};

export type PublicDossierDetail = {
  id: string;
  ownerId?: string;
  refCode: string;
  slug: string;
  title: string;
  summary: string;
  longDescription?: string;
  category: string;
  categoryKey: string;
  location: string;
  stage: string;
  partnerTypeNeeded: string;
  assetWhatExists: string;
  missingPiece: string;
  desiredPartner: string;
  idealContribution?: string;
  whyNow?: string;
  status: DossierDetailStatus;
  isFeatured: boolean;
  isCurated: boolean;
  isNewThisWeek: boolean;
  updatedAt: string;
  createdAt: string;
  moderationNote?: string;
  verification?: DossierVerification;
};

export type DossierViewerContext = {
  isAuthenticated: boolean;
  role?: UserRoleMode;
  isOwner?: boolean;
  interestState?: MatchInterestState;
};

export type InboundInterest = {
  id: string;
  counterpartName: string;
  counterpartType: string;
  createdAt: string;
  status: "pending" | "in_review" | "matched" | "declined";
};

export type OwnerDossierManagement = {
  dossier: PublicDossierDetail;
  inbound: InboundInterest[];
};
