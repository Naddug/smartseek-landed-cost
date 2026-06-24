import type { UserRole } from "@/types";

export type ProfileCompletionLevel = "incomplete" | "partial" | "complete";

export type PartnerEngagementMode =
  | "active_operator"
  | "passive_investor"
  | "both";

export type PartnerOnboardingState = {
  contributionTypes: string[];
  preferredCategories: string[];
  preferredCities: string[];
  engagementMode: PartnerEngagementMode | "";
  capitalRange: string;
  experienceAreas: string[];
  bio: string;
};

export type OwnerProfileProgress = {
  lastStep: number;
  category: string;
  stage: string;
  locationCity: string;
  selectedAssets: string[];
  selectedBlockers: string[];
  partnerPriorities: string[];
};

export type StoredUserProfile = {
  userId: string;
  role: UserRole;
  completionLevel: ProfileCompletionLevel;
  onboardingStep: string | null;
  onboardingCompleted: boolean;
  partner: PartnerOnboardingState;
  ownerProgress: OwnerProfileProgress;
  updatedAt: string;
};

export const EMPTY_PARTNER_ONBOARDING: PartnerOnboardingState = {
  contributionTypes: [],
  preferredCategories: [],
  preferredCities: [],
  engagementMode: "",
  capitalRange: "",
  experienceAreas: [],
  bio: "",
};

export const EMPTY_OWNER_PROGRESS: OwnerProfileProgress = {
  lastStep: 1,
  category: "",
  stage: "",
  locationCity: "",
  selectedAssets: [],
  selectedBlockers: [],
  partnerPriorities: [],
};

export function emptyStoredProfile(userId: string, role: UserRole): StoredUserProfile {
  return {
    userId,
    role,
    completionLevel: "incomplete",
    onboardingStep: null,
    onboardingCompleted: false,
    partner: { ...EMPTY_PARTNER_ONBOARDING },
    ownerProgress: { ...EMPTY_OWNER_PROGRESS },
    updatedAt: new Date().toISOString(),
  };
}
