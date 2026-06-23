export type ArchiveViewMode = "grid" | "list";

export type ArchiveSortKey =
  | "newest"
  | "oldest"
  | "curated"
  | "new_week";

export type ArchiveFilterState = {
  category: string;
  partnerType: string;
  stage: string;
  sort: ArchiveSortKey;
  view: ArchiveViewMode;
};

export type DossierTier = "curated" | "featured" | "new" | "standard";

export const ARCHIVE_PARAM_KEYS = {
  category: "kategori",
  partnerType: "ortak",
  stage: "asama",
  sort: "sira",
  view: "gorunum",
} as const;
