import { OwnerOnboardingWizard } from "@/components/onboarding/owner/OwnerOnboardingWizard";
import {
  getOpportunityDossier,
  dossierToOnboardingState,
} from "@/lib/actions/opportunity-dossier";

interface PageProps {
  searchParams: { edit?: string };
}

export default async function FirsatSahibiOnboardingPage({
  searchParams,
}: PageProps) {
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
    <OwnerOnboardingWizard initialDraft={initialDraft} existingId={existingId} />
  );
}
