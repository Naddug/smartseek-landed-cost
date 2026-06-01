"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Container } from "@/components/ui/Section";
import { getMarketPulse } from "@/lib/market/pulse";
import { formatPulseDate } from "@/lib/operations/pulse";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

const STAT_KEYS = ["coverage", "sectors", "cities", "feed"] as const;

export function MarketTerminalHero() {
  const { t, i18n } = useTranslation();
  const pulse = getMarketPulse();
  const locale = i18n.language === "tr" ? "tr-TR" : "en-GB";
  const lastLabel = pulse.lastFeedDate
    ? formatPulseDate(pulse.lastFeedDate, locale)
    : "—";

  const headline = t("market.terminal.headline", { count: pulse.coverage });
  const rhythm =
    pulse.hottestSector && pulse.eventsLast14Days > 0
      ? t("market.terminal.rhythm", {
          count: pulse.eventsLast14Days,
          sector: pulse.hottestSector,
          sectorCount: pulse.hottestSectorCount,
        })
      : null;

  return (
    <section className="intel-band-ink border-b border-white/10">
      <Container wide className="py-8 sm:py-10">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="intel-live-dot intel-live-dot-dark text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-ortaq-cream/70">
            {t("market.terminal.live")}
          </span>
          <span className="text-[0.6875rem] tabular-nums text-ortaq-cream/45">
            {t("market.terminal.lastSync", { date: lastLabel })}
          </span>
          {pulse.exportHeavyCount > 0 ? (
            <span className="text-[0.6875rem] text-ortaq-cream/45">
              {t("market.terminal.exportNote", { count: pulse.exportHeavyCount })}
            </span>
          ) : null}
        </div>

        <h1 className="mt-5 max-w-3xl text-[1.625rem] font-semibold leading-[1.12] tracking-[-0.03em] text-ortaq-cream sm:text-[2.125rem]">
          {headline}
        </h1>
        <p className={cn(typography.bodySm, "mt-3 max-w-2xl leading-relaxed text-ortaq-cream/75")}>
          {t("market.terminal.sub")}
        </p>
        {rhythm ? (
          <p className={cn(typography.caption, "mt-2 font-mono text-ortaq-cream/55")}>{rhythm}</p>
        ) : null}

        <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-ortaq-md border border-white/12 bg-white/8 sm:grid-cols-4">
          {STAT_KEYS.map((key) => (
            <div key={key} className="bg-ortaq-ink/90 px-3 py-3 sm:px-4 sm:py-4">
              <dt className="text-[0.625rem] font-medium uppercase tracking-[0.07em] text-ortaq-cream/45">
                {t(`market.terminal.stats.${key}.label`)}
              </dt>
              <dd className="mt-1 font-mono text-[1.25rem] font-semibold tabular-nums text-ortaq-cream sm:text-[1.375rem]">
                {key === "coverage"
                  ? pulse.coverage
                  : key === "sectors"
                    ? pulse.sectorCount
                    : key === "cities"
                      ? pulse.cityCount
                      : pulse.feedEvents}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-6 flex flex-wrap gap-2.5">
          <Link
            href="/kesfet"
            className="inline-flex min-h-10 items-center rounded-ortaq-md bg-ortaq-cream px-4 text-[0.8125rem] font-semibold text-ortaq-ink transition-opacity hover:opacity-90"
          >
            {t("market.terminal.cta")}
          </Link>
          <Link
            href="/alan"
            className="inline-flex min-h-10 items-center rounded-ortaq-md border border-ortaq-cream/35 px-4 text-[0.8125rem] font-medium text-ortaq-cream transition-colors hover:border-ortaq-cream/55"
          >
            {t("market.terminal.ctaWorkspace")}
          </Link>
        </div>
      </Container>
    </section>
  );
}
