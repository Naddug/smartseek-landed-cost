"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/auth";
import {
  computeOwnerCompletionLevel,
  computePartnerCompletionLevel,
  computeProfileCompletion,
} from "@/lib/profile/completion";
import { getStoredUserProfile, saveStoredUserProfile } from "@/lib/profile/repository";
import { opportunityDossierRepository } from "@/lib/repositories/opportunity-dossier-repository";
import type {
  OwnerProfileProgress,
  PartnerOnboardingState,
  StoredUserProfile,
} from "@/types/profile-onboarding";
import type { ProfileCompletion } from "@/types/panel";

async function requireSessionUserId() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error("Oturum gerekli.");
  }
  return session.user;
}

export async function loadUserProfileState(): Promise<StoredUserProfile | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;
  return getStoredUserProfile(session.user.id, session.user.role);
}

export async function getProfileCompletionForSession(): Promise<ProfileCompletion | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  const profile = await getStoredUserProfile(session.user.id, session.user.role);
  const dossiers =
    session.user.role === "opportunity_owner"
      ? await opportunityDossierRepository.findAll(session.user.id)
      : [];

  return computeProfileCompletion(profile, {
    hasSavedDossier: dossiers.length > 0,
  });
}

export async function savePartnerOnboardingState(
  state: PartnerOnboardingState,
  options?: { step?: number; complete?: boolean }
) {
  const user = await requireSessionUserId();
  const profile = await getStoredUserProfile(user.id, user.role);

  const partner = { ...state };
  const completionLevel = computePartnerCompletionLevel(partner);
  const onboardingCompleted = Boolean(options?.complete) && completionLevel === "complete";

  const next: StoredUserProfile = {
    ...profile,
    role: user.role,
    partner,
    completionLevel: onboardingCompleted ? "complete" : completionLevel,
    onboardingStep: options?.step ? String(options.step) : profile.onboardingStep,
    onboardingCompleted,
  };

  await saveStoredUserProfile(next);
  revalidatePath("/panel/profilim");
  revalidatePath("/onboarding/ortak");

  return {
    ok: true as const,
    completionLevel: next.completionLevel,
    onboardingCompleted: next.onboardingCompleted,
  };
}

export async function saveOwnerOnboardingProgress(
  progress: Partial<OwnerProfileProgress> & { lastStep: number }
) {
  const user = await requireSessionUserId();
  const profile = await getStoredUserProfile(user.id, user.role);
  const dossiers = await opportunityDossierRepository.findAll(user.id);

  const ownerProgress = { ...profile.ownerProgress, ...progress };
  const completionLevel = computeOwnerCompletionLevel(
    ownerProgress,
    dossiers.length > 0
  );

  const next: StoredUserProfile = {
    ...profile,
    role: user.role,
    ownerProgress,
    completionLevel,
    onboardingStep: String(progress.lastStep),
    onboardingCompleted: profile.onboardingCompleted,
  };

  await saveStoredUserProfile(next);
  revalidatePath("/panel/profilim");
  revalidatePath("/onboarding/firsat-sahibi");

  return { ok: true as const, completionLevel: next.completionLevel };
}

export async function markOwnerOnboardingComplete() {
  const user = await requireSessionUserId();
  const profile = await getStoredUserProfile(user.id, user.role);
  const dossiers = await opportunityDossierRepository.findAll(user.id);

  const completionLevel = computeOwnerCompletionLevel(
    profile.ownerProgress,
    dossiers.length > 0
  );

  const next: StoredUserProfile = {
    ...profile,
    completionLevel: completionLevel === "incomplete" ? "partial" : completionLevel,
    onboardingCompleted: true,
    onboardingStep: "complete",
  };

  await saveStoredUserProfile(next);
  revalidatePath("/panel");
  revalidatePath("/panel/profilim");

  return { ok: true as const, completionLevel: next.completionLevel };
}
