import { notFound } from "next/navigation";
import {
  DossierDetailView,
  DossierDetailSidebar,
} from "@/components/opportunity/DossierDetailView";
import { DossierManagementPage } from "@/components/panel/DossierManagementPage";
import { getOpportunityDossier, dossierToOnboardingState } from "@/lib/actions/opportunity-dossier";
import { getScoreImprovementChecklist } from "@/lib/readiness-score";
import {
  getOwnerInboundForPanel,
  resolveOwnerDossier,
} from "@/lib/dossier/resolve-owner-dossier";

interface PageProps {
  params: { id: string };
}

export default async function FirsatDetayPage({ params }: PageProps) {
  const publicDossier = resolveOwnerDossier(params.id);

  if (publicDossier) {
    const inbound = getOwnerInboundForPanel(params.id, publicDossier);
    return (
      <DossierManagementPage
        dossier={publicDossier}
        inbound={inbound}
        panelDossierId={params.id}
      />
    );
  }

  const dossier = await getOpportunityDossier(params.id);

  if (!dossier) {
    notFound();
  }

  const state = await dossierToOnboardingState(dossier);
  const checklist = getScoreImprovementChecklist(state);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
      <DossierDetailView dossier={dossier} />
      <DossierDetailSidebar dossier={dossier} checklist={checklist} />
    </div>
  );
}
