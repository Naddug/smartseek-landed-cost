export type DossierMetric = {
  label: string;
  value: string;
};

export type MarketingDossier = {
  id: string;
  refCode: string;
  slug: string;
  title: string;
  summary: string;
  category: string;
  categoryKey: string;
  location: string;
  /** More specific district / zone — adds believable place detail. */
  neighborhood?: string;
  stage: string;
  partnerTypeNeeded: string;
  assetWhatExists: string;
  missingPiece: string;
  desiredPartner: string;
  /** Concrete, scannable facts that make the asset feel real. */
  metrics?: DossierMetric[];
  /** What ORTAQ has checked — the trust layer. */
  verifications?: string[];
  /** Live marketplace signals. */
  applicants?: number;
  views?: number;
  status: "published" | "under_review" | "draft";
  isFeatured: boolean;
  isCurated: boolean;
  isNewThisWeek: boolean;
  updatedAt: string;
  createdAt: string;
};

export type MarketingActivityItem = {
  id: string;
  text: string;
};

export type PartnerTypeChip = {
  id: string;
  label: string;
  filterParam: string;
  count: number;
};

export type ArchiveMeta = {
  activeCount: number;
  newThisWeek: number;
};
