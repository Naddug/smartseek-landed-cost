import type { MarketingDossier } from "@/types/marketing-dossier";
import type { OpportunityDraft } from "@/types";

export function marketingDossierToOpportunity(
  dossier: MarketingDossier
): OpportunityDraft {
  return {
    id: dossier.id,
    fileRef: dossier.refCode,
    title: dossier.title,
    summary: dossier.summary,
    hook: dossier.summary,
    category: dossier.categoryKey as OpportunityDraft["category"],
    categoryLabel: dossier.category,
    stage: "partially_built",
    stageLabel: dossier.stage,
    location: dossier.location,
    readinessScore: 70,
    readinessStatus:
      dossier.status === "published" ? "published" : "review_pending",
    blockers: [],
    assets: [],
    assetsLabel: dossier.assetWhatExists,
    visibility: "public",
    updatedAt: dossier.updatedAt,
    primaryBlockerLabel: dossier.missingPiece,
    neededPartnerLabel: dossier.desiredPartner,
  };
}
