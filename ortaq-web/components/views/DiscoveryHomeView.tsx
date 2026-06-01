"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { PublicShell } from "@/components/layout/PublicShell";
import { DiscoveryHomeHero } from "@/components/discovery/DiscoveryHomeHero";
import { HomeFeaturedProfiles } from "@/components/discovery/HomeFeaturedProfiles";
import { DiscoveryMomentum } from "@/components/discovery/DiscoveryMomentum";
import { DiscoveryFeed } from "@/components/discovery/DiscoveryFeed";
import { SectorStrip } from "@/components/product/SectorStrip";
import { HomepageTeam } from "@/components/landing/HomepageTeam";
import { HomepageContact } from "@/components/landing/HomepageContact";
import { Container } from "@/components/ui/Section";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

export function DiscoveryHomeView() {
  const { t } = useTranslation();

  return (
    <PublicShell stickyCta headerOverlay={false}>
      <DiscoveryHomeHero />
      <SectorStrip />
      <HomeFeaturedProfiles />
      <DiscoveryFeed />
      <DiscoveryMomentum />

      <section className="border-b border-ortaq-border bg-ortaq-bg-alt">
        <Container wide className="grid gap-6 py-10 sm:grid-cols-2 sm:py-12">
          <div className="border border-ortaq-border bg-ortaq-surface p-6">
            <p className={cn(typography.label, "text-ortaq-ink-soft")}>{t("discovery.home.capitalBand.label")}</p>
            <p className="mt-2 font-semibold text-ortaq-ink">{t("discovery.home.capitalBand.title")}</p>
            <p className={cn(typography.bodySm, "mt-2 text-ortaq-ink-muted")}>{t("discovery.home.capitalBand.body")}</p>
            <Link
              href="/kesfet"
              className="mt-4 inline-flex min-h-10 items-center rounded-ortaq-md bg-ortaq-ink px-4 text-[0.8125rem] font-semibold text-ortaq-cream"
            >
              {t("discovery.home.ctaPrimary")}
            </Link>
          </div>
          <div className="border border-ortaq-border bg-ortaq-surface p-6">
            <p className={cn(typography.label, "text-ortaq-ink-soft")}>{t("discovery.home.producerBand.label")}</p>
            <p className="mt-2 font-semibold text-ortaq-ink">{t("discovery.home.producerBand.title")}</p>
            <p className={cn(typography.bodySm, "mt-2 text-ortaq-ink-muted")}>{t("discovery.home.producerBand.body")}</p>
            <Link
              href="/#basvuru"
              className="mt-4 inline-flex min-h-10 items-center rounded-ortaq-md border border-ortaq-border-strong px-4 text-[0.8125rem] font-semibold text-ortaq-ink"
            >
              {t("nav.applyProducer")}
            </Link>
          </div>
        </Container>
      </section>

      <HomepageTeam />
      <HomepageContact />
    </PublicShell>
  );
}
