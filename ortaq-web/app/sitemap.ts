import type { MetadataRoute } from "next";
import { getLiveCategories } from "@/lib/categories/registry";
import { env } from "@/lib/env";
import { getSitemapRoutes, site } from "@/lib/metadata";

export default function sitemap(): MetadataRoute.Sitemap {
  if (env.isStaging || env.isDevelopment) {
    return [];
  }

  const staticRoutes = getSitemapRoutes().map((route) => ({
    url: `${site.url}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const categoryRoutes = getLiveCategories().map((category) => ({
    url: `${site.url}/c/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.88,
  }));

  return [...staticRoutes, ...categoryRoutes];
}
