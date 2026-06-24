import type { MarketingDossier } from "@/types/marketing-dossier";

export type DossierVisualTheme = {
  gradientFrom: string;
  gradientVia: string;
  gradientTo: string;
  accent: string;
  accentMuted: string;
  /** Real environment photography — sector-matched, verified HTTP 200 on Unsplash */
  imageUrl: string;
  imagePosition?: string;
  atmosphere: string;
};

/** Verified Unsplash CDN URL builder — every ID is curl-checked before inclusion */
const IMG = (id: string) =>
  `https://images.unsplash.com/${id}?w=1400&q=88&auto=format&fit=crop`;

export const DEFAULT_DOSSIER_IMAGE_URL = IMG("photo-1486406146926-c627a92ad1ab");

const SLUG_THEMES: Record<string, DossierVisualTheme> = {
  "e-ticaret-operasyonu": {
    gradientFrom: "#0f172a",
    gradientVia: "#1e293b",
    gradientTo: "#2563eb",
    accent: "#3B82F6",
    accentMuted: "rgba(59,130,246,0.18)",
    imageUrl: IMG("photo-1556742049-0cfed4f6a45d"),
    imagePosition: "center 45%",
    atmosphere: "E-ticaret depo & paketleme",
  },
  "kafe-lokasyonu": {
    gradientFrom: "#1c1917",
    gradientVia: "#44403c",
    gradientTo: "#d97706",
    accent: "#F59E0B",
    accentMuted: "rgba(245,158,11,0.16)",
    imageUrl: IMG("photo-1517248135467-4c7edcad34c4"),
    imagePosition: "center 40%",
    atmosphere: "Cadde cepheli lokasyon",
  },
  "tekstil-atolyesi": {
    gradientFrom: "#14532d",
    gradientVia: "#166534",
    gradientTo: "#059669",
    accent: "#10B981",
    accentMuted: "rgba(16,185,129,0.16)",
    imageUrl: IMG("photo-1581091226825-a6a2a5aee158"),
    imagePosition: "center 45%",
    atmosphere: "Tekstil üretim hattı",
  },
  "saglik-yazilimi": {
    gradientFrom: "#0c4a6e",
    gradientVia: "#0369a1",
    gradientTo: "#0284c7",
    accent: "#38BDF8",
    accentMuted: "rgba(56,189,248,0.16)",
    imageUrl: IMG("photo-1576091160399-112ba8d25d1d"),
    imagePosition: "center 35%",
    atmosphere: "Sağlık teknolojisi ortamı",
  },
  "lojistik-depo": {
    gradientFrom: "#1e293b",
    gradientVia: "#334155",
    gradientTo: "#64748b",
    accent: "#94A3B8",
    accentMuted: "rgba(148,163,184,0.14)",
    imageUrl: IMG("photo-1553413077-190dd305871c"),
    imagePosition: "center 50%",
    atmosphere: "Depo & lojistik alanı",
  },
  "gida-uretim": {
    gradientFrom: "#451a03",
    gradientVia: "#78350f",
    gradientTo: "#ea580c",
    accent: "#FB923C",
    accentMuted: "rgba(251,146,60,0.14)",
    imageUrl: IMG("photo-1556910103-1c02745aae4d"),
    imagePosition: "center 45%",
    atmosphere: "Gıda üretim tesisi",
  },
  "mobil-uygulama": {
    gradientFrom: "#1e1b4b",
    gradientVia: "#312e81",
    gradientTo: "#4f46e5",
    accent: "#818CF8",
    accentMuted: "rgba(129,140,248,0.16)",
    imageUrl: IMG("photo-1460925895917-afdab827c52f"),
    imagePosition: "center 30%",
    atmosphere: "Ürün & büyüme metrikleri",
  },
  "butik-otel": {
    gradientFrom: "#0c4a6e",
    gradientVia: "#075985",
    gradientTo: "#0ea5e9",
    accent: "#7DD3FC",
    accentMuted: "rgba(125,211,252,0.14)",
    imageUrl: IMG("photo-1566073771259-6a8506099945"),
    imagePosition: "center 50%",
    atmosphere: "Butik konaklama tesisi",
  },
};

/** Secondary verified images — used only when primary load fails */
const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  ecommerce: IMG("photo-1607082348824-0a96f2a4b9da"),
  hospitality: IMG("photo-1554118811-1e0d58224f24"),
  manufacturing: IMG("photo-1581092160562-40aa08e78837"),
  healthcare: IMG("photo-1551836022-deb4988cc6c0"),
  services: IMG("photo-1567620905732-2d1ec7ab7445"),
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
  imageUrl: DEFAULT_DOSSIER_IMAGE_URL,
  imagePosition: "center 40%",
  atmosphere: "Fırsat dosyası",
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

/** Ordered fallback chain: slug primary → category image → platform default */
export function getDossierImageFallbackChain(
  slug: string,
  categoryKey: string
): string[] {
  const primary = getDossierVisual({ slug, categoryKey }).imageUrl;
  const categoryFallback = getDossierCategoryFallbackImage(categoryKey);

  const chain: string[] = [primary];
  if (categoryFallback !== primary) chain.push(categoryFallback);
  if (DEFAULT_DOSSIER_IMAGE_URL !== chain[chain.length - 1]) {
    chain.push(DEFAULT_DOSSIER_IMAGE_URL);
  }
  return chain;
}
