import type { NextConfig } from "next";
import path from "path";

const securityHeaders = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  outputFileTracingRoot: path.join(__dirname),
  compress: true,

  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: [],
  },

  async redirects() {
    return [
      // Trade OS — legacy routes → new structure
      { source: "/kesfet", destination: "/nasil-calisir", permanent: true },
      { source: "/sirket/:slug", destination: "/", permanent: true },
      { source: "/sirketler", destination: "/", permanent: true },
      { source: "/alan", destination: "/demo", permanent: true },
      { source: "/degerlendirme", destination: "/nasil-calisir", permanent: true },
      { source: "/riskler", destination: "/guven", permanent: true },
      { source: "/sozluk", destination: "/", permanent: true },
      { source: "/basla", destination: "/demo", permanent: true },
      { source: "/demo/sermaye", destination: "/demo", permanent: false },
    ];
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        source: "/media/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
