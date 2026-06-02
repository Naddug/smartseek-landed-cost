"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Container } from "@/components/ui/Section";
import { getWeeklySignals } from "@/lib/feed/weekly-signals";
import { formatPulseDate } from "@/lib/operations/pulse";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

export function MarketPulseBar() {
  const { t, i18n } = useTranslation();
  const weekly = getWeeklySignals();
  const locale = i18n.language === "tr" ? "tr-TR" : "en-GB";
  const today = formatPulseDate(new Date().toISOString().slice(0, 10), locale);

  return (
    <section className="border-b border-ortaq-border bg-ortaq-bg">
      <Container wide className="py-6 sm:py-8">
        <div className="max-w-4xl">
          <p className={cn(typography.caption, "tabular-nums text-ortaq-ink-soft")}>
            {t("market.terminal.weekOf", { date: today })}
          </p>

          <h1 className="mt-2 text-[1.375rem] font-semibold leading-tight tracking-[-0.02em] text-ortaq-ink sm:text-[1.75rem]">
            {t("market.terminal.headline")}
          </h1>

          <p className={cn(typography.bodySm, "mt-3 max-w-3xl leading-relaxed text-ortaq-ink-muted")}>
            {t("market.terminal.sub")}
          </p>
          <p className={cn(typography.bodySm, "mt-2 max-w-3xl leading-relaxed text-ortaq-ink-muted")}>
            {t("market.terminal.sub2")}
          </p>

          <div className="mt-5 rounded-ortaq-md border border-ortaq-border bg-ortaq-surface p-4">
            <p className={cn(typography.caption, "font-semibold text-ortaq-ink-muted")}>{t("market.terminal.snapshotTitle")}</p>
            <ul className="mt-2 space-y-1">
              <li className={cn(typography.bodySm, "text-ortaq-ink")}>
                +{weekly.updates} {t("market.terminal.snapshot.updates")}
              </li>
              <li className={cn(typography.bodySm, "text-ortaq-ink")}>
                +{weekly.productionLine} {t("market.terminal.snapshot.lines")}
              </li>
              <li className={cn(typography.bodySm, "text-ortaq-ink")}>
                +{weekly.exportDevelopments} {t("market.terminal.snapshot.exports")}
              </li>
              <li className={cn(typography.bodySm, "text-ortaq-ink")}>
                +{weekly.newSectors} {t("market.terminal.snapshot.sectors")}
              </li>
            </ul>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/kesfet"
              className="inline-flex min-h-10 items-center justify-center rounded-ortaq-md bg-ortaq-ink px-5 text-[0.8125rem] font-semibold text-ortaq-cream"
            >
              {t("market.terminal.ctaPrimary")}
            </Link>
            <Link
              href="/nasil-calisir"
              className="inline-flex min-h-10 items-center justify-center rounded-ortaq-md border border-ortaq-border-strong px-5 text-[0.8125rem] font-semibold text-ortaq-ink"
            >
              {t("market.terminal.ctaSecondary")}
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
