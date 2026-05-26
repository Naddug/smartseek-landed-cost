import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ORTAQ",
    short_name: "ORTAQ",
    description: "Paya dayalı ortaklık sürecini anlatır.",
    start_url: "/",
    display: "browser",
    background_color: "#faf8f5",
    theme_color: "#faf8f5",
    lang: "tr",
    orientation: "portrait-primary",
    icons: [
      { src: "/favicon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png", purpose: "any" },
    ],
  };
}
