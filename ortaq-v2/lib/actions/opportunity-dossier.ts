"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { markOwnerOnboardingComplete } from "@/lib/actions/profile-onboarding";
import { opportunityDossierRepository } from "@/lib/repositories/opportunity-dossier-repository";
import { calculateReadinessScore } from "@/lib/readiness-score";
import { slugify } from "@/lib/slug";
import type {
  OpportunityDossier,
  OwnerOnboardingState,
  OwnerVisibilityLevel,
} from "@/types/opportunity-dossier";

const PLACEHOLDER_OWNER_ID = "placeholder-owner";

async function resolveOwnerId(explicit?: string): Promise<string> {
  if (explicit) return explicit;
  const session = await getServerSession(authOptions);
  return session?.user?.id ?? PLACEHOLDER_OWNER_ID;
}

function toDossier(
  state: OwnerOnboardingState,
  existing?: Partial<OpportunityDossier>
): OpportunityDossier {
  const now = new Date().toISOString();
  const title = state.title.trim() || "İsimsiz fırsat dosyası";
  const readinessScore = calculateReadinessScore(state);

  return {
    id: existing?.id ?? randomUUID(),
    slug: existing?.slug ?? slugify(title),
    ownerId: existing?.ownerId ?? PLACEHOLDER_OWNER_ID,
    status: existing?.status ?? "taslak",
    title,
    summary: state.summary.trim(),
    category: state.category,
    stage: state.stage,
    locationCity: state.locationCity,
    locationDistrict: state.locationDistrict,
    hideDistrict: state.hideDistrict,
    visibilityLevel: (state.visibilityLevel || "restricted") as OwnerVisibilityLevel,
    selectedAssets: state.selectedAssets,
    assetFollowUps: state.assetFollowUps,
    selectedBlockers: state.selectedBlockers,
    partnerPriorities: state.partnerPriorities,
    expectedTimeCommitment: state.expectedTimeCommitment,
    expectedContributions: state.expectedContributions,
    returnModel: state.returnModel,
    returnModelNotes: state.returnModelNotes,
    narrative: state.narrative,
    evidenceFiles: state.evidenceFiles,
    readinessScore,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };
}

export async function saveOpportunityDossier(
  state: OwnerOnboardingState,
  options?: { existingId?: string; partial?: boolean; ownerId?: string }
): Promise<{ id: string; slug: string }> {
  const ownerId = await resolveOwnerId(options?.ownerId);
  const existing = options?.existingId
    ? await opportunityDossierRepository.findById(options.existingId)
    : null;

  const dossier = toDossier(state, { ...(existing ?? undefined), ownerId });

  if (existing) {
    await opportunityDossierRepository.update(existing.id, dossier);
  } else {
    await opportunityDossierRepository.create(dossier);
  }

  if (!options?.partial) {
    await markOwnerOnboardingComplete();
  }

  revalidatePath("/panel/firsatlarim");
  revalidatePath(`/panel/firsatlarim/${dossier.id}`);

  return { id: dossier.id, slug: dossier.slug };
}

export async function getOpportunityDossier(
  id: string
): Promise<OpportunityDossier | null> {
  return opportunityDossierRepository.findById(id);
}

export async function listOpportunityDossiers(
  ownerId?: string
): Promise<OpportunityDossier[]> {
  const resolvedOwner = ownerId ?? (await resolveOwnerId());
  const owned = await opportunityDossierRepository.findAll(resolvedOwner);
  if (owned.length > 0) return owned;
  if (resolvedOwner !== PLACEHOLDER_OWNER_ID) return [];
  return opportunityDossierRepository.findAll(PLACEHOLDER_OWNER_ID);
}

export async function listOpportunityDossiersForOwner(
  ownerId: string
): Promise<OpportunityDossier[]> {
  return opportunityDossierRepository.findAll(ownerId);
}

export async function dossierToOnboardingState(
  dossier: OpportunityDossier
): Promise<OwnerOnboardingState> {
  return {
    category: dossier.category,
    stage: dossier.stage,
    selectedAssets: dossier.selectedAssets,
    assetFollowUps: dossier.assetFollowUps,
    selectedBlockers: dossier.selectedBlockers,
    partnerPriorities: dossier.partnerPriorities,
    expectedTimeCommitment: dossier.expectedTimeCommitment,
    expectedContributions: dossier.expectedContributions,
    returnModel: dossier.returnModel,
    returnModelNotes: dossier.returnModelNotes,
    locationCity: dossier.locationCity,
    locationDistrict: dossier.locationDistrict,
    hideDistrict: dossier.hideDistrict,
    visibilityLevel: dossier.visibilityLevel,
    evidenceFiles: dossier.evidenceFiles,
    narrative: dossier.narrative,
    title: dossier.title,
    summary: dossier.summary,
  };
}
