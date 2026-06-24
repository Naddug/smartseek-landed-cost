import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { OwnerOnboardingWizard } from "@/components/onboarding/owner/OwnerOnboardingWizard";
import {
  getOpportunityDossier,
  dossierToOnboardingState,
} from "@/lib/actions/opportunity-dossier";
import { getStoredUserProfile } from "@/lib/profile/repository";

interface PageProps {
  searchParams: { edit?: string; next?: string };
}

export default async function FirsatSahibiOnboardingPage({
  searchParams,
}: PageProps) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/giris?next=/onboarding/firsat-sahibi");
  }

  if (session.user.role === "partner") {
    redirect("/onboarding/ortak");
  }

  const profile = await getStoredUserProfile(session.user.id, session.user.role);
  const savedStep = Number(profile.ownerProgress.lastStep) || 1;
  const initialStep = Math.min(Math.max(savedStep, 1), 8);

  const editId = searchParams.edit;
  let initialDraft;
  let existingId: string | undefined;

  if (editId) {
    const dossier = await getOpportunityDossier(editId);
    if (dossier) {
      initialDraft = await dossierToOnboardingState(dossier);
      existingId = dossier.id;
    }
  }

  return (
    <OwnerOnboardingWizard
      initialDraft={initialDraft}
      existingId={existingId}
      initialStep={initialStep}
    />
  );
}
