/**
 * ORTAQ favicon marks — transaction monitoring platform tab identity.
 * Production: "operations" (deal-list rows + status dot).
 */

import { brand } from "@/lib/brand/identity";

export type FaviconDirection =
  | "operations"
  | "monitoring"
  | "visibility"
  | "wordmark"
  | "enterprise";

export type FaviconTheme = "dark" | "light";

export type FaviconPalette = {
  frame: string;
  frameStroke: string;
  primary: string;
  secondary: string;
  accent: string;
  muted: string;
};

export function getFaviconPalette(theme: FaviconTheme): FaviconPalette {
  if (theme === "light") {
    return {
      frame: brand.cream.primary,
      frameStroke: brand.graphite.muted,
      primary: brand.graphite.primary,
      secondary: brand.graphite.muted,
      accent: brand.gold,
      muted: brand.cream.dim,
    };
  }
  return {
    frame: brand.green.deep,
    frameStroke: brand.cream.primary,
    primary: brand.cream.primary,
    secondary: brand.cream.muted,
    accent: brand.gold,
    muted: brand.mint,
  };
}

export const faviconFrame = { radius: 3.5, insetRadius: 3 } as const;

export const FAVICON_DIRECTION_META: Record<
  FaviconDirection,
  { label: string; labelTR: string; scores: { s16: number; s32: number; dark: number; light: number; tab: number } }
> = {
  operations: {
    label: "Operations tracking",
    labelTR: "Kaynaklama operatörü",
    scores: { s16: 9, s32: 10, dark: 10, light: 9, tab: 9 },
  },
  monitoring: {
    label: "Transaction monitoring",
    labelTR: "İşlem takibi",
    scores: { s16: 7, s32: 9, dark: 9, light: 8, tab: 7 },
  },
  visibility: {
    label: "Status visibility",
    labelTR: "Durum görünürlüğü",
    scores: { s16: 8, s32: 9, dark: 9, light: 8, tab: 8 },
  },
  wordmark: {
    label: "ORTAQ wordmark-derived",
    labelTR: "ORTAQ O işareti",
    scores: { s16: 6, s32: 8, dark: 9, light: 7, tab: 6 },
  },
  enterprise: {
    label: "Enterprise minimal",
    labelTR: "Kurumsal minimal",
    scores: { s16: 8, s32: 7, dark: 9, light: 8, tab: 7 },
  },
};

export const PRODUCTION_FAVICON_DIRECTION: FaviconDirection = "operations";

export function faviconMarkSvg(
  direction: FaviconDirection = PRODUCTION_FAVICON_DIRECTION,
  theme: FaviconTheme = "dark",
): string {
  const p = getFaviconPalette(theme);
  const frame =
    `<rect width="32" height="32" rx="${faviconFrame.radius}" fill="${p.frame}"/>` +
    `<rect x="0.5" y="0.5" width="31" height="31" rx="${faviconFrame.insetRadius}" stroke="${p.frameStroke}" stroke-opacity="0.12" fill="none"/>`;

  const bodies: Record<FaviconDirection, string> = {
    operations:
      `<circle cx="8" cy="11" r="2.25" fill="${p.accent}"/>` +
      `<line x1="11.5" y1="11" x2="24" y2="11" stroke="${p.primary}" stroke-width="2.25" stroke-linecap="round"/>` +
      `<line x1="10" y1="16" x2="22" y2="16" stroke="${p.secondary}" stroke-width="2" stroke-linecap="round" opacity="0.72"/>` +
      `<line x1="10" y1="21" x2="20" y2="21" stroke="${p.secondary}" stroke-width="2" stroke-linecap="round" opacity="0.48"/>`,

    monitoring:
      `<rect x="9" y="8" width="14" height="16" rx="1.5" stroke="${p.primary}" stroke-width="1.75" fill="none"/>` +
      `<line x1="12" y1="12.5" x2="20" y2="12.5" stroke="${p.secondary}" stroke-width="1.5" stroke-linecap="round" opacity="0.5"/>` +
      `<path d="M11 15.2 L12.4 16.6 L15.8 13.2" stroke="${p.accent}" stroke-width="1.6" stroke-linecap="square" fill="none"/>` +
      `<line x1="17" y1="15.4" x2="20" y2="15.4" stroke="${p.primary}" stroke-width="1.5" stroke-linecap="round"/>` +
      `<path d="M11 19.2 L12.4 20.6 L15.8 17.2" stroke="${p.muted}" stroke-width="1.6" stroke-linecap="square" fill="none" opacity="0.75"/>` +
      `<line x1="17" y1="19.4" x2="19" y2="19.4" stroke="${p.secondary}" stroke-width="1.5" stroke-linecap="round" opacity="0.6"/>`,

    visibility:
      `<rect x="8" y="9" width="16" height="14" rx="2" stroke="${p.primary}" stroke-width="1.5" fill="none"/>` +
      `<rect x="10" y="12" width="10" height="2.25" rx="0.5" fill="${p.accent}"/>` +
      `<rect x="10" y="16" width="12" height="2" rx="0.5" fill="${p.primary}" opacity="0.85"/>` +
      `<rect x="10" y="19.75" width="8" height="2" rx="0.5" fill="${p.secondary}" opacity="0.55"/>`,

    wordmark:
      `<path d="M19.5 10.5 A7.5 7.5 0 1 1 11 19" stroke="${p.primary}" stroke-width="3" stroke-linecap="butt" fill="none"/>` +
      `<path d="M11.5 21 A7.5 7.5 0 0 1 20.5 21" stroke="${p.accent}" stroke-width="3" stroke-linecap="butt" fill="none"/>`,

    enterprise:
      `<rect x="7" y="14" width="18" height="4" rx="1" fill="${p.accent}"/>` +
      `<rect x="9" y="20" width="12" height="2" rx="0.5" fill="${p.primary}" opacity="0.35"/>`,
  };

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none">${frame}${bodies[direction]}</svg>`;
}

export function faviconAdaptiveSvg(
  direction: FaviconDirection = PRODUCTION_FAVICON_DIRECTION,
): string {
  const dark = faviconMarkSvg(direction, "dark").replace(/^<svg[^>]*>|<\/svg>$/g, "");
  const light = faviconMarkSvg(direction, "light").replace(/^<svg[^>]*>|<\/svg>$/g, "");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none">
<style>
  .theme-dark { display: block; }
  .theme-light { display: none; }
  @media (prefers-color-scheme: light) {
    .theme-dark { display: none; }
    .theme-light { display: block; }
  }
</style>
<g class="theme-dark">${dark}</g>
<g class="theme-light">${light}</g>
</svg>`;
}
