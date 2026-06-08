/**
 * Category registry — SSOT for public category pages and roadmap UI.
 * Content strings live in locales under `categories.entries.{slug}`.
 */

export type CategoryStatus = "live" | "roadmap" | "hidden";

export type CategorySeo = {
  title: string;
  description: string;
};

export type CategoryEntry = {
  slug: string;
  status: CategoryStatus;
  order: number;
  seo?: CategorySeo;
};

export const CATEGORY_REGISTRY: readonly CategoryEntry[] = [
  {
    slug: "cat-litter",
    status: "live",
    order: 1,
    seo: {
      title: "Özel Marka Kedi Kumu | ORTAQ",
      description:
        "Türkiye'de üretilen özel marka kedi kumu programı. Kaynaklama, üretim ve teslimat tek ortakta.",
    },
  },
  {
    slug: "cosmetics",
    status: "roadmap",
    order: 2,
    seo: {
      title: "Özel Marka Kozmetik | ORTAQ",
      description:
        "Özel marka kozmetik programı. Kaynaklama, üretim ve teslimat — yol haritasında.",
    },
  },
  {
    slug: "supplements",
    status: "roadmap",
    order: 3,
    seo: {
      title: "Özel Marka Takviye | ORTAQ",
      description:
        "Özel marka takviye programı. Kaynaklama, üretim ve teslimat — yol haritasında.",
    },
  },
  {
    slug: "food-beverage",
    status: "roadmap",
    order: 4,
    seo: {
      title: "Özel Marka Gıda ve İçecek | ORTAQ",
      description:
        "Özel marka gıda ve içecek programı. Kaynaklama, üretim ve teslimat — yol haritasında.",
    },
  },
  /** Local dummy — proves hidden categories stay out of public UI */
  {
    slug: "personal-care",
    status: "hidden",
    order: 99,
  },
] as const;

export function getCategoryPath(slug: string): string {
  return `/c/${slug}`;
}

export function getCategoryBySlug(slug: string): CategoryEntry | undefined {
  return CATEGORY_REGISTRY.find((c) => c.slug === slug);
}

export function getCategoriesByStatus(status: CategoryStatus): CategoryEntry[] {
  return CATEGORY_REGISTRY.filter((c) => c.status === status).sort((a, b) => a.order - b.order);
}

/** Live + roadmap — excludes hidden */
export function getPublicCategories(): CategoryEntry[] {
  return CATEGORY_REGISTRY.filter((c) => c.status !== "hidden").sort((a, b) => a.order - b.order);
}

export function getLiveCategories(): CategoryEntry[] {
  return getCategoriesByStatus("live");
}

export function getPrimaryLiveCategory(): CategoryEntry | undefined {
  return getLiveCategories()[0];
}

export function isCategoryPagePublic(slug: string): boolean {
  const entry = getCategoryBySlug(slug);
  return entry?.status === "live";
}

export function getCategoryLocaleBase(slug: string): string {
  return `categories.entries.${slug}`;
}
