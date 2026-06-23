export type MarketingDossier = {
  id: string;
  refCode: string;
  slug: string;
  title: string;
  summary: string;
  category: string;
  categoryKey: string;
  location: string;
  stage: string;
  partnerTypeNeeded: string;
  assetWhatExists: string;
  missingPiece: string;
  desiredPartner: string;
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
