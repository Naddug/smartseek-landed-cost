import type { DossierDetailStatus } from "@/types/dossier-detail";
import type { ReadinessStatus } from "@/types";

const STATUS_LABELS: Record<DossierDetailStatus, string> = {
  draft: "Taslak",
  under_review: "İncelemede",
  published: "Yayında",
  matched: "Eşleşti",
  archived: "Arşivlendi",
  rejected: "Reddedildi",
};

const STATUS_VARIANTS: Record<
  DossierDetailStatus,
  ReadinessStatus | "default" | "success" | "warning" | "danger"
> = {
  draft: "draft",
  under_review: "warning",
  published: "published",
  matched: "success",
  archived: "default",
  rejected: "danger",
};

export function detailStatusLabel(status: DossierDetailStatus): string {
  return STATUS_LABELS[status];
}

export function detailStatusVariant(status: DossierDetailStatus) {
  return STATUS_VARIANTS[status];
}
