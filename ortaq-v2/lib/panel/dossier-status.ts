import type { PanelDossierStatus } from "@/types/panel";
import type { DossierStatus } from "@/types/opportunity-dossier";
import type { ReadinessStatus } from "@/types";

type BadgeVariant =
  | ReadinessStatus
  | "default"
  | "success"
  | "warning"
  | "danger";

const STATUS_LABELS: Record<PanelDossierStatus, string> = {
  draft: "Taslak",
  under_review: "İncelemede",
  published: "Yayında",
  matched: "Eşleşti",
  archived: "Arşiv",
  rejected: "Reddedildi",
};

const STATUS_VARIANTS: Record<PanelDossierStatus, BadgeVariant> = {
  draft: "draft",
  under_review: "warning",
  published: "published",
  matched: "success",
  archived: "default",
  rejected: "danger",
};

export function panelStatusLabel(status: PanelDossierStatus): string {
  return STATUS_LABELS[status];
}

export function panelStatusVariant(status: PanelDossierStatus): BadgeVariant {
  return STATUS_VARIANTS[status];
}

export function mapRepositoryStatus(status: DossierStatus): PanelDossierStatus {
  switch (status) {
    case "taslak":
      return "draft";
    case "incelemede":
      return "under_review";
    case "onaylandi":
      return "published";
    default:
      return "draft";
  }
}

export function filterMatchesStatus(
  status: PanelDossierStatus,
  filter: import("@/types/panel").FirsatlarimFilter
): boolean {
  if (filter === "all") return true;
  if (filter === "published") return status === "published" || status === "matched";
  if (filter === "under_review") return status === "under_review";
  if (filter === "draft") return status === "draft";
  if (filter === "rejected") return status === "rejected";
  return true;
}
