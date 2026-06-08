/**
 * Trust layer page registry — public process-transparency pages.
 */

export type TrustPageKey =
  | "howSamplingWorks"
  | "qualityControl"
  | "paymentProtection"
  | "whyNotDirectFactory"
  | "launchTimeline";

export type TrustPageEntry = {
  key: TrustPageKey;
  path: string;
  order: number;
};

export const TRUST_PAGES: readonly TrustPageEntry[] = [
  { key: "howSamplingWorks", path: "/how-sampling-works", order: 1 },
  { key: "qualityControl", path: "/quality-control", order: 2 },
  { key: "paymentProtection", path: "/payment-protection", order: 3 },
  { key: "whyNotDirectFactory", path: "/why-not-direct-factory", order: 4 },
  { key: "launchTimeline", path: "/launch-timeline", order: 5 },
] as const;

export function getTrustPageLocaleBase(key: TrustPageKey): string {
  return `trustLayer.pages.${key}`;
}

export function getTrustPageByPath(path: string): TrustPageEntry | undefined {
  return TRUST_PAGES.find((p) => p.path === path);
}

export function getOtherTrustPages(current: TrustPageKey): TrustPageEntry[] {
  return TRUST_PAGES.filter((p) => p.key !== current);
}
