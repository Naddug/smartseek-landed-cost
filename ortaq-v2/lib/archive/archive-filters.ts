import type { MarketingDossier } from "@/types/marketing-dossier";
import type {
  ArchiveFilterState,
  ArchiveSortKey,
  DossierTier,
} from "@/types/archive";
import { ARCHIVE_PARAM_KEYS } from "@/types/archive";

export const CATEGORY_FILTER_OPTIONS = [
  { value: "all", label: "Tümü" },
  { value: "ecommerce", label: "E-Ticaret" },
  { value: "manufacturing", label: "Üretim" },
  { value: "location", label: "Lokasyon & Mağaza" },
  { value: "digital", label: "Dijital Ürün" },
  { value: "food", label: "Gıda & Kafe" },
  { value: "health", label: "Sağlık" },
  { value: "education", label: "Eğitim" },
  { value: "other", label: "Diğer" },
] as const;

export const PARTNER_FILTER_OPTIONS = [
  { value: "all", label: "Tümü" },
  { value: "operating", label: "İşletme Ortağı" },
  { value: "capital", label: "Sermaye Ortağı" },
  { value: "technical", label: "Teknik Ortak" },
  { value: "growth", label: "Büyüme Ortağı" },
  { value: "sector", label: "Sektör Ortağı" },
] as const;

export const STAGE_FILTER_OPTIONS = [
  { value: "all", label: "Tümü" },
  { value: "stuck", label: "Takıldı" },
  { value: "operating", label: "Çalışıyor, büyüyemiyor" },
  { value: "ready", label: "Hazır" },
] as const;

import { ORTAQ_COPY } from "@/lib/copy/ortaq-lexicon";

export const SORT_OPTIONS: { value: ArchiveSortKey; label: string }[] = [
  { value: "newest", label: "Son Eklenen" },
  { value: "oldest", label: "En Eski" },
  { value: "curated", label: ORTAQ_COPY.archive.sortFeaturedFirst },
  { value: "new_week", label: "Yeni Bu Hafta" },
];

const PARTNER_TYPE_MAP: Record<string, string> = {
  operating_partner: "operating",
  capital_partner: "capital",
  technical_partner: "technical",
  growth_partner: "growth",
  sector_partner: "sector",
  production_partner: "production",
};

/** Map dossier fields to archive category filter keys */
export function resolveArchiveCategory(dossier: MarketingDossier): string {
  if (dossier.categoryKey === "healthcare") return "health";
  if (dossier.categoryKey === "manufacturing") {
    return dossier.category.toLowerCase().includes("gıda") ? "food" : "manufacturing";
  }
  if (dossier.categoryKey === "ecommerce") {
    return dossier.category.toLowerCase().includes("mobil") ? "digital" : "ecommerce";
  }
  if (dossier.categoryKey === "hospitality") {
    return dossier.title.toLowerCase().includes("lokasyon") ||
      dossier.title.toLowerCase().includes("cadde")
      ? "location"
      : "food";
  }
  if (dossier.categoryKey === "services") return "location";
  return "other";
}

export function resolveArchiveStage(dossier: MarketingDossier): string {
  const s = dossier.stage.toLowerCase();
  if (s.includes("hazır") || s.includes("scale")) return "ready";
  if (s.includes("büyüyemiyor") || s.includes("çalışıyor")) return "operating";
  return "stuck";
}

export function resolvePartnerFilter(dossier: MarketingDossier): string {
  return PARTNER_TYPE_MAP[dossier.partnerTypeNeeded] ?? "other";
}

export function getDossierTier(dossier: MarketingDossier): DossierTier {
  if (dossier.isCurated) return "curated";
  if (dossier.isFeatured) return "featured";
  if (dossier.isNewThisWeek) return "new";
  return "standard";
}

export const DEFAULT_ARCHIVE_FILTERS: ArchiveFilterState = {
  category: "all",
  partnerType: "all",
  stage: "all",
  sort: "newest",
  view: "grid",
};

export function parseArchiveSearchParams(
  params: URLSearchParams
): ArchiveFilterState {
  const sort = params.get(ARCHIVE_PARAM_KEYS.sort);
  const view = params.get(ARCHIVE_PARAM_KEYS.view);

  return {
    category: params.get(ARCHIVE_PARAM_KEYS.category) || "all",
    partnerType: params.get(ARCHIVE_PARAM_KEYS.partnerType) || "all",
    stage: params.get(ARCHIVE_PARAM_KEYS.stage) || "all",
    sort: isValidSort(sort) ? sort : "newest",
    view: view === "list" ? "list" : "grid",
  };
}

function isValidSort(value: string | null): value is ArchiveSortKey {
  return (
    value === "newest" ||
    value === "oldest" ||
    value === "curated" ||
    value === "new_week"
  );
}

export function serializeArchiveFilters(
  filters: ArchiveFilterState
): URLSearchParams {
  const params = new URLSearchParams();

  if (filters.category !== "all") {
    params.set(ARCHIVE_PARAM_KEYS.category, filters.category);
  }
  if (filters.partnerType !== "all") {
    params.set(ARCHIVE_PARAM_KEYS.partnerType, filters.partnerType);
  }
  if (filters.stage !== "all") {
    params.set(ARCHIVE_PARAM_KEYS.stage, filters.stage);
  }
  if (filters.sort !== "newest") {
    params.set(ARCHIVE_PARAM_KEYS.sort, filters.sort);
  }
  if (filters.view !== "grid") {
    params.set(ARCHIVE_PARAM_KEYS.view, filters.view);
  }

  return params;
}

export function matchesArchiveFilters(
  dossier: MarketingDossier,
  filters: ArchiveFilterState
): boolean {
  if (filters.category !== "all") {
    if (resolveArchiveCategory(dossier) !== filters.category) return false;
  }
  if (filters.partnerType !== "all") {
    if (resolvePartnerFilter(dossier) !== filters.partnerType) return false;
  }
  if (filters.stage !== "all") {
    if (resolveArchiveStage(dossier) !== filters.stage) return false;
  }
  return true;
}

export function sortArchiveDossiers(
  dossiers: MarketingDossier[],
  sort: ArchiveSortKey
): MarketingDossier[] {
  const copy = [...dossiers];

  switch (sort) {
    case "oldest":
      return copy.sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    case "curated":
      return copy.sort((a, b) => {
        const tierScore = (d: MarketingDossier) =>
          (d.isCurated ? 4 : 0) + (d.isFeatured ? 2 : 0) + (d.isNewThisWeek ? 1 : 0);
        const diff = tierScore(b) - tierScore(a);
        if (diff !== 0) return diff;
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      });
    case "new_week":
      return copy.sort((a, b) => {
        if (a.isNewThisWeek !== b.isNewThisWeek) {
          return a.isNewThisWeek ? -1 : 1;
        }
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
    case "newest":
    default:
      return copy.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }
}

export function applyArchivePipeline(
  dossiers: MarketingDossier[],
  filters: ArchiveFilterState
): MarketingDossier[] {
  const filtered = dossiers.filter((d) => matchesArchiveFilters(d, filters));
  return sortArchiveDossiers(filtered, filters.sort);
}

export function hasActiveArchiveFilters(filters: ArchiveFilterState): boolean {
  return (
    filters.category !== "all" ||
    filters.partnerType !== "all" ||
    filters.stage !== "all"
  );
}

export function getArchiveStats(dossiers: MarketingDossier[]) {
  return {
    activeCount: dossiers.filter((d) => d.status === "published").length,
    newThisWeek: dossiers.filter((d) => d.isNewThisWeek).length,
  };
}

export function getCuratedDossiers(
  dossiers: MarketingDossier[],
  filters: ArchiveFilterState
): MarketingDossier[] {
  return applyArchivePipeline(
    dossiers.filter((d) => d.isCurated && d.status === "published"),
    { ...filters, sort: "curated" }
  ).slice(0, 4);
}
