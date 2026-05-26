import type { MetadataRoute } from "next";
import { env } from "@/lib/env";
import { site } from "@/lib/metadata";

export default function robots(): MetadataRoute.Robots {
  if (env.isStaging || env.isDevelopment) {
    return {
      rules: { userAgent: "*", disallow: "/" },
    };
  }

  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
