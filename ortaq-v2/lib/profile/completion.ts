import type { ProfileCompletion } from "@/types/panel";
import type {
  OwnerProfileProgress,
  PartnerOnboardingState,
  ProfileCompletionLevel,
  StoredUserProfile,
} from "@/types/profile-onboarding";
import type { UserRole } from "@/types";

function partnerMissingFields(state: PartnerOnboardingState): string[] {
  const missing: string[] = [];
  if (state.contributionTypes.length === 0) missing.push("Katkı türü seçimi");
  if (state.preferredCategories.length === 0) missing.push("Sektör tercihi");
  if (state.preferredCities.length === 0) missing.push("Lokasyon tercihi");
  if (!state.engagementMode) missing.push("Aktif / pasif rol tercihi");
  return missing;
}

function ownerMissingFields(progress: OwnerProfileProgress): string[] {
  const missing: string[] = [];
  if (!progress.category) missing.push("Sektör / kategori");
  if (!progress.stage) missing.push("İş aşaması");
  if (progress.selectedAssets.length === 0) missing.push("Mevcut varlıklar");
  if (progress.selectedBlockers.length === 0) missing.push("Eksik halka / engel");
  if (progress.partnerPriorities.length === 0) missing.push("Aranan ortak tipi");
  if (!progress.locationCity) missing.push("Lokasyon");
  return missing;
}

export function computePartnerCompletionLevel(
  state: PartnerOnboardingState
): ProfileCompletionLevel {
  const missing = partnerMissingFields(state);
  if (missing.length === 0) return "complete";
  if (state.contributionTypes.length > 0 && state.preferredCategories.length > 0) {
    return "partial";
  }
  return "incomplete";
}

export function computeOwnerCompletionLevel(
  progress: OwnerProfileProgress,
  hasSavedDossier: boolean
): ProfileCompletionLevel {
  if (hasSavedDossier && progress.lastStep >= 8) return "complete";
  const missing = ownerMissingFields(progress);
  if (missing.length === 0) return "complete";
  if (progress.category && progress.stage && progress.selectedAssets.length > 0) {
    return "partial";
  }
  return "incomplete";
}

export function computeProfileCompletion(
  profile: StoredUserProfile,
  options?: { hasSavedDossier?: boolean }
): ProfileCompletion {
  const role = profile.role;
  const hasSavedDossier = options?.hasSavedDossier ?? false;

  if (role === "partner") {
    const missing = partnerMissingFields(profile.partner);
    const level = computePartnerCompletionLevel(profile.partner);
    const total = 4;
    const done = total - missing.length;
    return {
      percent: Math.round((done / total) * 100),
      missingFields: missing,
      level,
    };
  }

  const missing = ownerMissingFields(profile.ownerProgress);
  const level = computeOwnerCompletionLevel(profile.ownerProgress, hasSavedDossier);
  const total = 6;
  const done = total - missing.length;
  const dossierBonus = hasSavedDossier ? 15 : 0;
  return {
    percent: Math.min(100, Math.round((done / total) * 85) + dossierBonus),
    missingFields: hasSavedDossier ? missing : [...missing, "Kayıtlı fırsat dosyası"],
    level,
  };
}

export function canParticipateInMarketplace(
  profile: StoredUserProfile,
  options?: { hasSavedDossier?: boolean }
): boolean {
  const role = profile.role;
  if (role === "partner") {
    return computePartnerCompletionLevel(profile.partner) !== "incomplete";
  }
  const level = computeOwnerCompletionLevel(
    profile.ownerProgress,
    options?.hasSavedDossier ?? false
  );
  return level !== "incomplete";
}

export function marketplaceGateMessage(profile: StoredUserProfile): string {
  if (profile.role === "partner") {
    return "Başvuru yapabilmek için ortak profilinizde katkı türü ve sektör tercihlerini tamamlayın.";
  }
  return "Fırsat yayınlamak için profil ve dosya bilgilerinizi tamamlayın.";
}

export function onboardingPathForProfile(role: UserRole): string {
  return role === "opportunity_owner"
    ? "/onboarding/firsat-sahibi"
    : "/onboarding/ortak";
}
