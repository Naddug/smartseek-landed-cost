"use client";

import type { SimulatedCampaign } from "@/lib/campaigns/types";
import { PublicShell } from "@/components/layout/PublicShell";
import { Container } from "@/components/ui/Section";
import { DossierHeader } from "@/components/dossier/DossierHeader";
import { DossierStickyNav } from "@/components/dossier/DossierStickyNav";
import { DossierLead } from "@/components/dossier/DossierLead";
import { DossierProduction } from "@/components/dossier/DossierProduction";
import { DossierFacility } from "@/components/dossier/DossierFacility";
import { DossierMachines } from "@/components/dossier/DossierMachines";
import { DossierExport } from "@/components/dossier/DossierExport";
import { DossierCustomers } from "@/components/dossier/DossierCustomers";
import { DossierFieldLog } from "@/components/dossier/DossierFieldLog";
import { DossierGrowth } from "@/components/dossier/DossierGrowth";
import { DossierRisks } from "@/components/dossier/DossierRisks";
import { DossierReview } from "@/components/dossier/DossierReview";
import { DossierDocuments } from "@/components/dossier/DossierDocuments";
import { RelatedLinks } from "@/components/seo/RelatedLinks";
import { DOSSIER_RELATED_LINKS } from "@/lib/seo/internal-links";

/**
 * Three-tier dossier layout.
 *
 *   Header              identity + status (always above the fold)
 *   Lead                dense composite — signals · bottlenecks · top risks · verification strip
 *
 *   Primary tier        production · facility · machines · export · customers
 *   Secondary tier      field log · growth · risks · review · documents (collapsible, demoted)
 *
 * DossierSnapshot is removed; its content is now in DossierLead.
 * The verification-layer list that lived in DossierReview moved to the Lead.
 * The pending-checks list that lived in DossierDocuments was redundant with the
 * Lead's verification strip and is gone.
 */

type CampaignDetailViewProps = {
  campaign: SimulatedCampaign;
};

export function CampaignDetailView({ campaign }: CampaignDetailViewProps) {
  return (
    <PublicShell stickyCta={false}>
      <DossierHeader campaign={campaign} />
      <DossierStickyNav />
      <DossierLead campaign={campaign} />

      <Container wide className="pb-6">
        <DossierProduction campaign={campaign} />
        <DossierFacility campaign={campaign} />
        <DossierMachines campaign={campaign} />
        <DossierExport campaign={campaign} />
        <DossierCustomers campaign={campaign} />

        <DossierFieldLog campaign={campaign} />
        <DossierGrowth campaign={campaign} />
        <DossierRisks campaign={campaign} />
        <DossierReview campaign={campaign} />
        <DossierDocuments campaign={campaign} />

        <div className="mt-8 border-t border-ortaq-border pt-8">
          <RelatedLinks links={DOSSIER_RELATED_LINKS} />
        </div>
      </Container>
    </PublicShell>
  );
}
