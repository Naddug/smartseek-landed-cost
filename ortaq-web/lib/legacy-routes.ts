/**
 * @deprecated Legacy crowdfunding / dossier product routes.
 * Removed from public navigation; noindex; kept for internal reference only.
 * Launch product: verified capital access network (/ , /demo , /sss , /nasil-calisir , …).
 */
export const LEGACY_ROUTE_PATHS = [
  "/sirketler",
  "/sozluk",
  "/basla",
] as const;

export const LEGACY_ROUTE_PREFIXES = ["/sirket/"] as const;

export function isLegacyPublicPath(path: string): boolean {
  if (LEGACY_ROUTE_PATHS.includes(path as (typeof LEGACY_ROUTE_PATHS)[number])) return true;
  return LEGACY_ROUTE_PREFIXES.some((prefix) => path.startsWith(prefix));
}

export const deprecatedRobots = { index: false, follow: false } as const;
