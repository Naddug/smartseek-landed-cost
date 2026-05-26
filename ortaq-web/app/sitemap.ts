import type { MetadataRoute } from "next";
import { env } from "@/lib/env";
import { getAllCampaignSlugs } from "@/lib/campaigns";
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

  const campaignRoutes = getAllCampaignSlugs().map((slug) => ({
    url: `${site.url}/sirket/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.75,
  }));

  return [...staticRoutes, ...campaignRoutes];
}
