import { MOCK_OWNER_DOSSIERS } from "@/data/panel/mock-panel-data";
import {
  getInboundInterest,
  getPublicDossierById,
  getPublicDossierBySlug,
} from "@/data/dossier/public-dossier-details";
import type { DossierDetailStatus, PublicDossierDetail } from "@/types/dossier-detail";
import type { PanelDossierStatus } from "@/types/panel";

function mapPanelStatus(status: PanelDossierStatus): DossierDetailStatus {
  return status;
}

export function resolveOwnerDossier(id: string): PublicDossierDetail | null {
  const direct = getPublicDossierById(id);
  if (direct) return direct;

  const mock = MOCK_OWNER_DOSSIERS.find((d) => d.id === id);
  if (mock) {
    const publicDossier = getPublicDossierBySlug(mock.slug);
    if (!publicDossier) return null;
    return {
      ...publicDossier,
      status: mapPanelStatus(mock.status),
    };
  }

  return null;
}

export function getOwnerInboundForPanel(id: string, dossier: PublicDossierDetail) {
  return getInboundInterest(dossier.id);
}
