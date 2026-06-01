"use client";

import { useTranslation } from "react-i18next";
import type { SimulatedCampaign } from "@/lib/campaigns/types";
import { PublicShell } from "@/components/layout/PublicShell";
import { Container } from "@/components/ui/Section";
import { DossierHeader } from "@/components/dossier/DossierHeader";
import { DossierStickyNav } from "@/components/dossier/DossierStickyNav";
import { DossierWhyNow } from "@/components/dossier/DossierWhyNow";
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
import { ProfileInterestRail } from "@/components/discovery/ProfileInterestRail";
import { RelatedLinks } from "@/components/seo/RelatedLinks";
import { DOSSIER_RELATED_LINKS } from "@/lib/seo/internal-links";
import { cn } from "@/lib/cn";

type CampaignDetailViewProps = {
  campaign: SimulatedCampaign;
};

export function CampaignDetailView({ campaign }: CampaignDetailViewProps) {
  const { t } = useTranslation();

  return (
    <PublicShell stickyCta={false}>
      <DossierHeader campaign={campaign} />
      <DossierWhyNow campaign={campaign} />
      <DossierStickyNav />
      <DossierLead campaign={campaign} />

      <Container wide className="pb-6">
        <p className={cn("mb-6 border-l-2 border-ortaq-trust pl-3 text-[0.8125rem] leading-relaxed text-ortaq-ink-muted")}>
          {t("discovery.profile.disclaimer")}
        </p>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_17.5rem] lg:items-start">
          <div className="min-w-0 space-y-0">
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
          </div>

          <ProfileInterestRail campaign={campaign} className="lg:sticky lg:top-24" />
        </div>

        <div className="mt-8 border-t border-ortaq-border pt-8">
          <RelatedLinks links={DOSSIER_RELATED_LINKS} />
        </div>
      </Container>
    </PublicShell>
  );
}
