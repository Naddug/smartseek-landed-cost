"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { CompanyCard } from "@/components/product/CompanyCard";
import { Container } from "@/components/ui/Section";
import { listCampaigns } from "@/lib/campaigns";
import { getWeeklySignals } from "@/lib/feed/weekly-signals";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

const COVERAGE_LIMIT = 6;

export function MarketCoveragePanel() {
  const { t } = useTranslation();
  const entries = listCampaigns().slice(0, COVERAGE_LIMIT);
  const weekly = getWeeklySignals();

  return (
    <section className="border-b border-ortaq-border bg-ortaq-bg" aria-labelledby="market-home-title">
      <Container wide className="py-6 sm:py-8">
        <div className="max-w-4xl">
          <h1
            id="market-home-title"
            className="text-[1.375rem] font-semibold leading-tight tracking-[-0.02em] text-ortaq-ink sm:text-[1.75rem]"
          >
            {t("market.coverage.heroTitle")}
          </h1>
          <p className={cn(typography.bodySm, "mt-3 max-w-3xl leading-relaxed text-ortaq-ink-muted")}>
            {t("market.coverage.heroSub1")}
          </p>
          <p className={cn(typography.bodySm, "mt-2 max-w-3xl leading-relaxed text-ortaq-ink-muted")}>
            {t("market.coverage.heroSub2")}
          </p>

          <div className="mt-5 rounded-ortaq-md border border-ortaq-border bg-ortaq-surface p-4">
            <p className={cn(typography.caption, "font-semibold text-ortaq-ink-muted")}>{t("market.coverage.weekTitle")}</p>
            <ul className="mt-2 space-y-1">
              <li className={cn(typography.bodySm, "text-ortaq-ink")}>
                +{weekly.updates} {t("market.coverage.week.updates")}
              </li>
              <li className={cn(typography.bodySm, "text-ortaq-ink")}>
                +{weekly.productionLine} {t("market.coverage.week.lines")}
              </li>
              <li className={cn(typography.bodySm, "text-ortaq-ink")}>
                +{weekly.exportDevelopments} {t("market.coverage.week.exports")}
              </li>
              <li className={cn(typography.bodySm, "text-ortaq-ink")}>
                +{weekly.newSectors} {t("market.coverage.week.sectors")}
              </li>
            </ul>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/kesfet"
              className="inline-flex min-h-10 shrink-0 items-center justify-center rounded-ortaq-md bg-ortaq-ink px-5 text-[0.8125rem] font-semibold text-ortaq-cream"
            >
              {t("market.coverage.ctaPrimary")}
            </Link>
            <Link
              href="/nasil-calisir"
              className="inline-flex min-h-10 items-center justify-center rounded-ortaq-md border border-ortaq-border-strong px-5 text-[0.8125rem] font-semibold text-ortaq-ink"
            >
              {t("market.coverage.ctaSecondary")}
            </Link>
          </div>
        </div>

        <div className="-mx-4 mt-6 flex gap-3 overflow-x-auto px-4 pb-2 snap-x snap-mandatory sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-4 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-3">
          {entries.map((c) => (
            <CompanyCard key={c.slug} campaign={c} featured />
          ))}
        </div>

        <p className={cn(typography.caption, "mt-5 text-ortaq-ink-soft")}>
          <Link href="/kesfet" className={cn(typography.link, "font-medium")}>
            {t("market.coverage.link")} →
          </Link>
        </p>
      </Container>
    </section>
  );
}
