"use server";

import { randomUUID } from "crypto";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/auth";
import { getPublicDossierBySlug } from "@/data/dossier/public-dossier-details";
import {
  isDossierClosed,
  isDossierOpenForInterest,
} from "@/lib/dossier/viewer-context";
import {
  resolveApplyInterestGate,
  resolveCreateDossierGate,
  toApplyGateView,
} from "@/lib/marketplace/action-gate";
import { getStoredUserProfile } from "@/lib/profile/repository";
import { opportunityDossierRepository } from "@/lib/repositories/opportunity-dossier-repository";
import { dossierInterestRepository } from "@/lib/repositories/dossier-interest-repository";
import type { SubmitDossierInterestResult } from "@/types/dossier-interest";
import type { MatchInterestState } from "@/types/dossier-detail";

export async function getProfileApplyGate(dossierSlug?: string) {
  const session = await getServerSession(authOptions);
  const returnPath = dossierSlug
    ? `/firsatlar/${dossierSlug}?intent=apply`
    : undefined;

  if (!session?.user?.id) {
    return toApplyGateView(
      resolveApplyInterestGate(
        { isAuthenticated: false },
        { dossierSlug, returnPath }
      )
    );
  }

  const profile = await getStoredUserProfile(session.user.id, session.user.role);
  return toApplyGateView(
    resolveApplyInterestGate(
      {
        isAuthenticated: true,
        role: session.user.role,
        sideSelected: session.user.sideSelected,
      },
      { profile, dossierSlug, returnPath }
    )
  );
}

export async function getCreateDossierGate() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return resolveCreateDossierGate({ isAuthenticated: false });
  }

  const profile = await getStoredUserProfile(session.user.id, session.user.role);
  const dossiers =
    session.user.role === "opportunity_owner"
      ? await opportunityDossierRepository.findAll(session.user.id)
      : [];

  return resolveCreateDossierGate(
    {
      isAuthenticated: true,
      role: session.user.role,
      sideSelected: session.user.sideSelected,
    },
    { profile, hasSavedDossier: dossiers.length > 0 }
  );
}

export async function getUserInterestState(
  userId: string | undefined,
  dossierId: string
): Promise<MatchInterestState> {
  if (!userId) return "none";

  const record = await dossierInterestRepository.findByUserAndDossier(
    userId,
    dossierId
  );
  if (!record) return "none";

  switch (record.status) {
    case "pending":
      return "applied";
    case "in_review":
      return "in_review";
    case "matched":
      return "matched";
    default:
      return "none";
  }
}

export async function listUserInterests(userId: string) {
  return dossierInterestRepository.findByUser(userId);
}

export async function submitDossierInterest(
  dossierSlug: string
): Promise<SubmitDossierInterestResult> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !session.user.email) {
    return { ok: false, error: "Başvuru için giriş yapmanız gerekir.", code: "auth" };
  }

  const dossier = getPublicDossierBySlug(dossierSlug);
  if (!dossier) {
    return { ok: false, error: "Fırsat dosyası bulunamadı." };
  }

  if (isDossierClosed(dossier)) {
    return { ok: false, error: "Bu fırsat artık başvuruya kapalı.", code: "closed" };
  }

  if (!isDossierOpenForInterest(dossier)) {
    return { ok: false, error: "Bu fırsat şu an başvuruya açık değil." };
  }

  const isOwner =
    dossier.ownerId === session.user.email.toLowerCase() ||
    dossier.ownerId === session.user.id;
  if (isOwner) {
    return { ok: false, error: "Kendi dosyanıza başvuramazsınız.", code: "owner" };
  }

  const profile = await getStoredUserProfile(session.user.id, session.user.role);
  const gate = resolveApplyInterestGate(
    {
      isAuthenticated: true,
      role: session.user.role,
      sideSelected: session.user.sideSelected,
    },
    {
      profile,
      dossierSlug,
      returnPath: `/firsatlar/${dossierSlug}?intent=apply`,
    }
  );

  if (!gate.allowed) {
    return {
      ok: false,
      error: gate.message ?? "Profilinizi tamamlayın.",
      code: "profile",
    };
  }

  const existing = await dossierInterestRepository.findByUserAndDossier(
    session.user.id,
    dossier.id
  );
  if (existing) {
    return { ok: true, duplicate: true, id: existing.id };
  }

  const now = new Date().toISOString();
  const record = {
    id: randomUUID(),
    userId: session.user.id,
    userEmail: session.user.email.toLowerCase(),
    dossierId: dossier.id,
    dossierSlug: dossier.slug,
    dossierTitle: dossier.title,
    status: "pending" as const,
    createdAt: now,
    updatedAt: now,
  };

  await dossierInterestRepository.create(record);

  revalidatePath(`/firsatlar/${dossierSlug}`);
  revalidatePath("/panel/eslesmelerim");
  revalidatePath("/panel");

  return { ok: true, duplicate: false, id: record.id };
}
