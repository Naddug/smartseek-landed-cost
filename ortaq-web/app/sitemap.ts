import type { MetadataRoute } from "next";
import { env } from "@/lib/env";
import { getSitemapRoutes, site } from "@/lib/metadata";

export default function sitemap(): MetadataRoute.Sitemap {
  if (env.isStaging || env.isDevelopment) {
    return [];
  }

  return getSitemapRoutes().map((route) => ({
    url: `${site.url}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
