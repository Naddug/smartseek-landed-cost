import type { Metadata } from "next";
import { env } from "@/lib/env";
import { deprecatedRobots } from "@/lib/legacy-routes";
import {
  getLiveSitemapRoutes, getRouteByKey, ROUTE_KEY_MAP, type RouteKey,
} from "@/lib/seo/routes";

export const site = {
  name: "ORTAQ",
  url: env.siteUrl.replace(/\/$/, ""),
  locale: "tr_TR",
  defaultTitle: "ORTAQ | Kendi ürün hattınızı başlatın",
  defaultDescription:
    "ORTAQ kaynaklar, üretir ve teslim eder — özel marka ürün programlarınız için tek sorumlu ortak.",
} as const;

export type { RouteKey };

type MetadataOverrides = {
  description?: string;
  title?: string;
};

/** Strip brand suffix so layout title.template does not duplicate "| ORTAQ". */
function resolvePageTitle(title: string, key: string): Metadata["title"] {
  if (key === "home") return { absolute: title };
  return title.replace(/\s*\|\s*ORTAQ\s*$/i, "").trim();
}

export function buildMetadata(route: RouteKey, overrides?: MetadataOverrides & { deprecated?: boolean }): Metadata {
  const registryKey = ROUTE_KEY_MAP[route];
  const meta = getRouteByKey(registryKey);
  if (!meta) {
    return { title: site.defaultTitle, description: site.defaultDescription };
  }

  const title = overrides?.title ?? meta.title;
  const description = overrides?.description ?? meta.description;
  const url = `${site.url}${meta.path}`;
  const noIndex = overrides?.deprecated || env.isStaging || env.isDevelopment;

  return {
    title: resolvePageTitle(title, meta.key),
    description,
    metadataBase: new URL(site.url),
    alternates: {
      canonical: meta.path,
      languages: { "tr-TR": meta.path },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: site.name,
      locale: site.locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: noIndex ? deprecatedRobots : { index: true, follow: true },
  };
}

export function getSitemapRoutes() {
  return getLiveSitemapRoutes().map((r) => ({
    path: r.path, priority: r.priority, changeFrequency: r.changeFrequency, }));
}
