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

/** Istanbul business skyline — neutral platform default */
export const DEFAULT_DOSSIER_IMAGE_URL = IMG("photo-1524231757912-21f4fe3a7200");

const SLUG_THEMES: Record<string, DossierVisualTheme> = {
  "e-ticaret-operasyonu": {
    gradientFrom: "#0f172a",
    gradientVia: "#1e293b",
    gradientTo: "#2563eb",
    accent: "#3B82F6",
    accentMuted: "rgba(59,130,246,0.18)",
    imageUrl: IMG("photo-1607082348824-0a96f2a4b9da"),
    imagePosition: "center 42%",
    atmosphere: "Maslak · paketleme & sevkiyat",
  },
  "kafe-lokasyonu": {
    gradientFrom: "#1c1917",
    gradientVia: "#44403c",
    gradientTo: "#d97706",
    accent: "#F59E0B",
    accentMuted: "rgba(245,158,11,0.16)",
    imageUrl: IMG("photo-1560799262-3727e67f0c62"),
    imagePosition: "center 55%",
    atmosphere: "Cadde cephesi · işletme lokasyonu",
  },
  "tekstil-atolyesi": {
    gradientFrom: "#14532d",
    gradientVia: "#166534",
    gradientTo: "#059669",
    accent: "#10B981",
    accentMuted: "rgba(16,185,129,0.16)",
    imageUrl: IMG("photo-1742281693044-972b1a1760a4"),
    imagePosition: "center 48%",
    atmosphere: "Demirtaş OSB · tekstil hattı",
  },
  "saglik-yazilimi": {
    gradientFrom: "#0c4a6e",
    gradientVia: "#0369a1",
    gradientTo: "#0284c7",
    accent: "#38BDF8",
    accentMuted: "rgba(56,189,248,0.16)",
    imageUrl: IMG("photo-1579684385127-1ef15d508118"),
    imagePosition: "center 40%",
    atmosphere: "Klinik ortamı · sağlık teknolojisi",
  },
  "lojistik-depo": {
    gradientFrom: "#1e293b",
    gradientVia: "#334155",
    gradientTo: "#64748b",
    accent: "#94A3B8",
    accentMuted: "rgba(148,163,184,0.14)",
    imageUrl: IMG("photo-1759888107096-916fbd3eaf25"),
    imagePosition: "center 45%",
    atmosphere: "Hadımköy · lojistik & liman",
  },
  "gida-uretim": {
    gradientFrom: "#451a03",
    gradientVia: "#78350f",
    gradientTo: "#ea580c",
    accent: "#FB923C",
    accentMuted: "rgba(251,146,60,0.14)",
    imageUrl: IMG("photo-1555396273-367ea4eb4db5"),
    imagePosition: "center 50%",
    atmosphere: "Organize sanayi · üretim mutfağı",
  },
  "mobil-uygulama": {
    gradientFrom: "#1e1b4b",
    gradientVia: "#312e81",
    gradientTo: "#4f46e5",
    accent: "#818CF8",
    accentMuted: "rgba(129,140,248,0.16)",
    imageUrl: IMG("photo-1522202176988-66273c2fd55f"),
    imagePosition: "center 35%",
    atmosphere: "Ürün ekibi · mobil geliştirme",
  },
  "butik-otel": {
    gradientFrom: "#0c4a6e",
    gradientVia: "#075985",
    gradientTo: "#0ea5e9",
    accent: "#7DD3FC",
    accentMuted: "rgba(125,211,252,0.14)",
    imageUrl: IMG("photo-1654162280520-8867181837e8"),
    imagePosition: "center 42%",
    atmosphere: "Kaleiçi · butik konaklama",
  },
};

/** Secondary verified images — used only when primary load fails */
const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  ecommerce: IMG("photo-1607082348824-0a96f2a4b9da"),
  hospitality: IMG("photo-1560799262-3727e67f0c62"),
  manufacturing: IMG("photo-1742281693044-972b1a1760a4"),
  healthcare: IMG("photo-1579684385127-1ef15d508118"),
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
  imageUrl: DEFAULT_DOSSIER_IMAGE_URL,
  imagePosition: "center 40%",
  atmosphere: "Türkiye · iş fırsatı",
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

/** All slug → image mappings for audits and verification scripts */
export const DOSSIER_VISUAL_AUDIT = Object.fromEntries(
  Object.entries(SLUG_THEMES).map(([slug, theme]) => [
    slug,
    { imageUrl: theme.imageUrl, atmosphere: theme.atmosphere },
  ])
);
