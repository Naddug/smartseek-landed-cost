import type { Metadata } from "next";
import { env } from "@/lib/env";
import {
  getLiveSitemapRoutes,
  getRouteByKey,
  ROUTE_KEY_MAP,
  type RouteKey,
} from "@/lib/seo/routes";

export const site = {
  name: "ORTAQ",
  url: env.siteUrl.replace(/\/$/, ""),
  locale: "tr_TR",
  defaultTitle: "ORTAQ — Gerçek şirketlere ortak olun",
  defaultDescription:
    "ORTAQ, paya dayalı ortaklık sürecini sade anlatır. Tavsiye vermez. Kazanç garantisi yoktur.",
} as const;

export type { RouteKey };

export function buildMetadata(route: RouteKey): Metadata {
  const registryKey = ROUTE_KEY_MAP[route];
  const meta = getRouteByKey(registryKey);
  if (!meta) {
    return { title: site.defaultTitle, description: site.defaultDescription };
  }

  const url = `${site.url}${meta.path}`;
  const noIndex = env.isStaging || env.isDevelopment;

  return {
    title: meta.title,
    description: meta.description,
    metadataBase: new URL(site.url),
    alternates: {
      canonical: meta.path,
      languages: { "tr-TR": meta.path },
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url,
      siteName: site.name,
      locale: site.locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
    },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
  };
}

export function getSitemapRoutes() {
  return getLiveSitemapRoutes().map((r) => ({
    path: r.path,
    priority: r.priority,
    changeFrequency: r.changeFrequency,
  }));
}
