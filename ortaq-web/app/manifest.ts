import type { MetadataRoute } from "next";
import { brand } from "@/lib/brand/identity";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ORTAQ",
    short_name: "ORTAQ",
    description: "Türk sanayi yatırımı için disiplinli keşif katmanı.",
    start_url: "/",
    display: "browser",
    background_color: brand.cream.primary,
    theme_color: brand.green.deep,
    lang: "tr",
    orientation: "portrait-primary",
    icons: [
      { src: "/favicon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/brand/ortaq-mark-light.svg", sizes: "512x512", type: "image/svg+xml", purpose: "maskable" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png", purpose: "any" },
    ],
  };
}
