import type { MarketingDossier } from "@/types/marketing-dossier";

export type DossierVisualTheme = {
  gradientFrom: string;
  gradientVia: string;
  gradientTo: string;
  accent: string;
  accentMuted: string;
  /** Real environment photography — sector + Türkiye-plausible context */
  imageUrl: string;
  imagePosition?: string;
  atmosphere: string;
  /** Unsplash photo id — used by verify-dossier-images.mjs */
  imageId: string;
};

/** Verified Unsplash CDN URL builder — every ID is curl-checked before inclusion */
export const buildDossierImageUrl = (id: string) =>
  `https://images.unsplash.com/${id}?w=1400&q=88&auto=format&fit=crop`;

const IMG = buildDossierImageUrl;

/** Istanbul · urban waterfront — platform default */
export const DEFAULT_DOSSIER_IMAGE_ID = "photo-1508009603885-50cf7c579365";
export const DEFAULT_DOSSIER_IMAGE_URL = IMG(DEFAULT_DOSSIER_IMAGE_ID);

/**
 * Slug → visual theme registry.
 * Prefer Türkiye-plausible street, port, and SME contexts over generic global stock.
 * Run `node scripts/verify-dossier-images.mjs` before shipping image changes.
 */
const SLUG_THEMES: Record<string, DossierVisualTheme> = {
  "e-ticaret-operasyonu": {
    gradientFrom: "#0f172a",
    gradientVia: "#1e293b",
    gradientTo: "#2563eb",
    accent: "#3B82F6",
    accentMuted: "rgba(59,130,246,0.18)",
    imageId: "photo-1586528116311-ad8dd3c8310d",
    imageUrl: IMG("photo-1586528116311-ad8dd3c8310d"),
    imagePosition: "center 42%",
    atmosphere: "E-ticaret · paketleme & sevkiyat",
  },
  "kafe-lokasyonu": {
    gradientFrom: "#1c1917",
    gradientVia: "#44403c",
    gradientTo: "#d97706",
    accent: "#F59E0B",
    accentMuted: "rgba(245,158,11,0.16)",
    imageId: "photo-1734944808830-c4a8b391b95a",
    imageUrl: IMG("photo-1734944808830-c4a8b391b95a"),
    imagePosition: "center 48%",
    atmosphere: "Kafe · cadde cephesi & servis",
  },
  "tekstil-atolyesi": {
    gradientFrom: "#14532d",
    gradientVia: "#166534",
    gradientTo: "#059669",
    accent: "#10B981",
    accentMuted: "rgba(16,185,129,0.16)",
    imageId: "photo-1742281693044-972b1a1760a4",
    imageUrl: IMG("photo-1742281693044-972b1a1760a4"),
    imagePosition: "center 45%",
    atmosphere: "Tekstil · üretim hattı",
  },
  "saglik-yazilimi": {
    gradientFrom: "#0c4a6e",
    gradientVia: "#0369a1",
    gradientTo: "#0284c7",
    accent: "#38BDF8",
    accentMuted: "rgba(56,189,248,0.16)",
    imageId: "photo-1576091160550-2173dba999ef",
    imageUrl: IMG("photo-1576091160550-2173dba999ef"),
    imagePosition: "center 40%",
    atmosphere: "Sağlık · klinik & dijital süreç",
  },
  "lojistik-depo": {
    gradientFrom: "#1e293b",
    gradientVia: "#334155",
    gradientTo: "#64748b",
    accent: "#94A3B8",
    accentMuted: "rgba(148,163,184,0.14)",
    imageId: "photo-1759888107096-916fbd3eaf25",
    imageUrl: IMG("photo-1759888107096-916fbd3eaf25"),
    imagePosition: "center 42%",
    atmosphere: "Lojistik · liman & depo",
  },
  "gida-uretim": {
    gradientFrom: "#451a03",
    gradientVia: "#78350f",
    gradientTo: "#ea580c",
    accent: "#FB923C",
    accentMuted: "rgba(251,146,60,0.14)",
    imageId: "photo-1556911220-bff31c812dba",
    imageUrl: IMG("photo-1556911220-bff31c812dba"),
    imagePosition: "center 48%",
    atmosphere: "Organize sanayi · lisanslı üretim mutfağı",
  },
  "mobil-uygulama": {
    gradientFrom: "#1e1b4b",
    gradientVia: "#312e81",
    gradientTo: "#4f46e5",
    accent: "#818CF8",
    accentMuted: "rgba(129,140,248,0.16)",
    imageId: "photo-1556761175-b413da4baf72",
    imageUrl: IMG("photo-1556761175-b413da4baf72"),
    imagePosition: "center 45%",
    atmosphere: "Mobil ürün · ekip & sprint",
  },
  "butik-otel": {
    gradientFrom: "#0c4a6e",
    gradientVia: "#075985",
    gradientTo: "#0ea5e9",
    accent: "#7DD3FC",
    accentMuted: "rgba(125,211,252,0.14)",
    imageId: "photo-1650051313661-71790a107987",
    imageUrl: IMG("photo-1650051313661-71790a107987"),
    imagePosition: "center 45%",
    atmosphere: "Konaklama · butik işletme",
  },
};

/** Per-slug secondary fallbacks when primary fails */
const SLUG_SECONDARY_IMAGES: Record<string, string> = {
  "e-ticaret-operasyonu": IMG("photo-1607082348824-0a96f2a4b9da"),
  "kafe-lokasyonu": IMG("photo-1517248135467-4c7edcad34c4"),
  "tekstil-atolyesi": IMG("photo-1748944080838-2602cab8086a"),
  "saglik-yazilimi": IMG("photo-1579684385127-1ef15d508118"),
  "lojistik-depo": IMG("photo-1553413077-190dd305871c"),
  "gida-uretim": IMG("photo-1556909114-f6e7ad7d3136"),
  "mobil-uygulama": IMG("photo-1495474472287-4d71bcdd2085"),
  "butik-otel": IMG("photo-1605649487212-47bdab064df7"),
};

/** Category-level fallbacks — sector + Türkiye-plausible where possible */
const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  ecommerce: IMG("photo-1586528116311-ad8dd3c8310d"),
  hospitality: IMG("photo-1734944808830-c4a8b391b95a"),
  manufacturing: IMG("photo-1742281693044-972b1a1760a4"),
  healthcare: IMG("photo-1576091160550-2173dba999ef"),
  services: IMG("photo-1759888107096-916fbd3eaf25"),
  other: DEFAULT_DOSSIER_IMAGE_URL,
};

const CATEGORY_FALLBACK: Record<string, DossierVisualTheme> = {
  ecommerce: SLUG_THEMES["e-ticaret-operasyonu"],
  hospitality: SLUG_THEMES["kafe-lokasyonu"],
  manufacturing: SLUG_THEMES["tekstil-atolyesi"],
  healthcare: SLUG_THEMES["saglik-yazilimi"],
  services: SLUG_THEMES["lojistik-depo"],
};

const DEFAULT_THEME: DossierVisualTheme = {
  gradientFrom: "#0f172a",
  gradientVia: "#1e293b",
  gradientTo: "#2563eb",
  accent: "#3B82F6",
  accentMuted: "rgba(59,130,246,0.16)",
  imageId: DEFAULT_DOSSIER_IMAGE_ID,
  imageUrl: DEFAULT_DOSSIER_IMAGE_URL,
  imagePosition: "center 42%",
  atmosphere: "İş fırsatı · Türkiye",
};

export function getDossierVisual(
  dossier: Pick<MarketingDossier, "slug" | "categoryKey">
): DossierVisualTheme {
  return (
    SLUG_THEMES[dossier.slug] ??
    CATEGORY_FALLBACK[dossier.categoryKey] ??
    DEFAULT_THEME
  );
}

export function getDossierVisualBySlug(slug: string, categoryKey = "other") {
  return getDossierVisual({ slug, categoryKey });
}

export function getDossierCategoryFallbackImage(categoryKey: string): string {
  return CATEGORY_FALLBACK_IMAGES[categoryKey] ?? DEFAULT_DOSSIER_IMAGE_URL;
}

/** Ordered fallback chain: primary → slug secondary → category → platform default */
export function getDossierImageFallbackChain(
  slug: string,
  categoryKey: string
): string[] {
  const primary = getDossierVisual({ slug, categoryKey }).imageUrl;
  const slugSecondary = SLUG_SECONDARY_IMAGES[slug];
  const categoryFallback = getDossierCategoryFallbackImage(categoryKey);

  const chain: string[] = [primary];
  if (slugSecondary && slugSecondary !== primary) chain.push(slugSecondary);
  if (categoryFallback !== chain[chain.length - 1]) chain.push(categoryFallback);
  if (DEFAULT_DOSSIER_IMAGE_URL !== chain[chain.length - 1]) {
    chain.push(DEFAULT_DOSSIER_IMAGE_URL);
  }
  return chain;
}

/** Registry for audits and verify-dossier-images.mjs */
export const DOSSIER_VISUAL_AUDIT = Object.fromEntries(
  Object.entries(SLUG_THEMES).map(([slug, theme]) => [
    slug,
    {
      imageId: theme.imageId,
      imageUrl: theme.imageUrl,
      atmosphere: theme.atmosphere,
    },
  ])
);

export const ALL_DOSSIER_IMAGE_IDS = Array.from(
  new Set([
    ...Object.values(SLUG_THEMES).map((theme) => theme.imageId),
    ...Object.values(SLUG_SECONDARY_IMAGES).map((url) =>
      url.match(/photo-[a-f0-9-]+/)?.[0] ?? url
    ),
    ...Object.values(CATEGORY_FALLBACK_IMAGES).map((url) =>
      url.match(/photo-[a-f0-9-]+/)?.[0] ?? url
    ),
    DEFAULT_DOSSIER_IMAGE_ID,
  ])
).filter(Boolean);
