import type { UserRoleMode } from "@/types/nav";

export type PanelDossierStatus =
  | "draft"
  | "under_review"
  | "published"
  | "matched"
  | "archived"
  | "rejected";

export type PanelPartnerType =
  | "operating_partner"
  | "capital_partner"
  | "technical_partner"
  | "growth_partner"
  | "sector_partner"
  | "production_partner";

export type PanelDossierStage =
  | "stuck"
  | "operating_but_blocked"
  | "ready_for_scale"
  | "paused"
  | "seeking_relaunch";

export type PanelDossier = {
  id: string;
  refCode: string;
  slug: string;
  title: string;
  summary: string;
  category: string;
  location: string;
  stage: PanelDossierStage;
  partnerTypeNeeded: PanelPartnerType;
  assetWhatExists: string;
  missingPiece: string;
  desiredPartner: string;
  status: PanelDossierStatus;
  isFeatured: boolean;
  isCurated: boolean;
  isNewThisWeek: boolean;
  updatedAt: string;
  createdAt: string;
};

export type PanelMatch = {
  id: string;
  dossierId: string;
  dossierSlug?: string;
  dossierTitle: string;
  createdAt: string;
  counterpartName?: string;
  counterpartType?: string;
  status: "pending" | "active" | "closed";
};

export type PanelActivityEvent = {
  id: string;
  label: string;
  createdAt: string;
  type: "match" | "message" | "moderation" | "dossier";
};

import type { ProfileCompletionLevel } from "@/types/profile-onboarding";

export type ProfileCompletion = {
  percent: number;
  missingFields: string[];
  level: ProfileCompletionLevel;
};

export type PanelOverviewPayload = {
  role: UserRoleMode;
  stats: {
    activeDossiers: number;
    pendingMatches: number;
    unreadMessages: number;
  };
  dossiers: PanelDossier[];
  matches: PanelMatch[];
  recentActivity: PanelActivityEvent[];
  profileCompletion: ProfileCompletion;
};

export type FirsatlarimFilter =
  | "all"
  | "published"
  | "under_review"
  | "draft"
  | "rejected";
