export type PremiumPackageId = "owner" | "partner" | "visibility";

export const PREMIUM_PACKAGE_IDS: PremiumPackageId[] = [
  "owner",
  "partner",
  "visibility",
];

export const PREMIUM_DETAIL_ANCHOR = "premium-detail";

export function isPremiumPackageId(value: string | null | undefined): value is PremiumPackageId {
  return PREMIUM_PACKAGE_IDS.includes(value as PremiumPackageId);
}

export function premiumPackageHref(
  packageId: PremiumPackageId,
  basePath = "/guven-kalite"
): string {
  return `${basePath}?paket=${packageId}#${PREMIUM_DETAIL_ANCHOR}`;
}

export function parsePremiumPackageFromLocation(
  search: string,
  hash: string
): PremiumPackageId | null {
  const params = new URLSearchParams(search.replace(/^\?/, ""));
  const fromQuery = params.get("paket");
  if (isPremiumPackageId(fromQuery)) return fromQuery;

  const normalized = hash.replace(/^#/, "");
  if (normalized === PREMIUM_DETAIL_ANCHOR) return null;
  if (normalized.startsWith("premium-")) {
    const id = normalized.replace("premium-", "");
    if (isPremiumPackageId(id)) return id;
  }

  return null;
}
