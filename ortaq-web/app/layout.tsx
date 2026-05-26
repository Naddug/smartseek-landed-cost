import type { Metadata } from "next";
import { Fraunces, DM_Sans, Inter } from "next/font/google";
import { I18nProvider } from "@/lib/i18n/provider";
import { AnalyticsProvider } from "@/components/providers/AnalyticsProvider";
import { MemberProgressTracker } from "@/components/providers/MemberProgressTracker";
import { JsonLd } from "@/components/seo/JsonLd";
import { organizationSchema, webSiteSchema } from "@/lib/seo/schema";
import { site } from "@/lib/metadata";
import { env } from "@/lib/env";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600", "700"],
  display: "swap",
  variable: "--font-fraunces",
  preload: true,
});

const dmSans = DM_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-dm-sans",
  preload: true,
});

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  weight: ["600", "700"],
  display: "swap",
  variable: "--font-brand",
  preload: true,
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover" as const,
  themeColor: "#0A1310",
};

export const metadata: Metadata = {
  title: {
    default: site.defaultTitle,
    template: "%s | ORTAQ",
  },
  description: site.defaultDescription,
  metadataBase: new URL(site.url),
  applicationName: "ORTAQ",
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/apple-icon", sizes: "180x180" }],
  },
  openGraph: {
    type: "website",
    locale: site.locale,
    siteName: site.name,
    title: site.defaultTitle,
    description: site.defaultDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: site.defaultTitle,
    description: site.defaultDescription,
  },
  robots: env.isProduction
    ? { index: true, follow: true, googleBot: { index: true, follow: true } }
    : { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={`${fraunces.variable} ${dmSans.variable} ${inter.variable}`}>
      <body>
        <JsonLd data={[organizationSchema(), webSiteSchema()]} />
        <I18nProvider>
          <AnalyticsProvider>
            <MemberProgressTracker />
            {children}
          </AnalyticsProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
