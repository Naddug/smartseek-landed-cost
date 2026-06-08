import type { MetadataRoute } from "next";
import { brand } from "@/lib/brand/identity";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ORTAQ",
    short_name: "ORTAQ",
    description: "İşlem izleme platformu.",
    start_url: "/",
    display: "browser",
    background_color: brand.cream.primary,
    theme_color: brand.green.deep,
    lang: "tr",
    orientation: "portrait-primary",
    icons: [
      { src: "/favicon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
      { src: "/apple-touch-icon.png", sizes: "180x180", type: "image/png", purpose: "any" },
    ],
  };
}
