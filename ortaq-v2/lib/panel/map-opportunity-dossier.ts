import type { OpportunityDossier } from "@/types/opportunity-dossier";
import type { PanelDossier, PanelDossierStage } from "@/types/panel";
import { mapRepositoryStatus } from "@/lib/panel/dossier-status";
import {
  labelFor,
  CATEGORY_OPTIONS,
} from "@/data/onboarding/owner-options";

function mapStage(stage: string): PanelDossierStage {
  switch (stage) {
    case "partially_built":
    case "idea":
      return "stuck";
    case "operating_stalled":
      return "operating_but_blocked";
    case "ready_to_scale":
      return "ready_for_scale";
    default:
      return "stuck";
  }
}

function refCodeFromId(id: string): string {
  return `FD-${id.slice(0, 8).toUpperCase()}`;
}

export function mapOpportunityToPanelDossier(
  dossier: OpportunityDossier
): PanelDossier {
  const categoryLabel = labelFor(CATEGORY_OPTIONS, dossier.category) || dossier.category;

  return {
    id: dossier.id,
    refCode: refCodeFromId(dossier.id),
    slug: dossier.slug,
    title: dossier.title,
    summary: dossier.summary,
    category: categoryLabel,
    location: dossier.locationCity,
    stage: mapStage(dossier.stage),
    partnerTypeNeeded: "operating_partner",
    assetWhatExists:
      dossier.selectedAssets.length > 0
        ? dossier.selectedAssets.join(" · ")
        : "—",
    missingPiece:
      dossier.selectedBlockers.length > 0
        ? dossier.selectedBlockers.join(" · ")
        : "—",
    desiredPartner:
      dossier.partnerPriorities[0] ?? "Ortak",
    status: mapRepositoryStatus(dossier.status),
    isFeatured: false,
    isCurated: dossier.status === "onaylandi",
    isNewThisWeek:
      Date.now() - new Date(dossier.createdAt).getTime() < 7 * 86_400_000,
    updatedAt: dossier.updatedAt,
    createdAt: dossier.createdAt,
  };
}
