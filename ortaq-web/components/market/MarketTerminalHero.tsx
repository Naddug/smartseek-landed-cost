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

  return (
    <section className="intel-band-ink border-b border-white/10">
      <Container wide className="py-8 sm:py-10">
        <div className="flex flex-wrap items-center gap-2">
          <span className="intel-live-dot intel-live-dot-dark text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-ortaq-cream/70">
            {t("market.terminal.live")}
          </span>
          <span className="text-[0.6875rem] tabular-nums text-ortaq-cream/45">
            {t("market.terminal.lastSync", { date: lastLabel })}
          </span>
        </div>

        <p className={cn(typography.label, "mt-4 text-ortaq-cream/50")}>{t("market.terminal.kicker")}</p>
        <h1 className="mt-2 max-w-3xl text-[1.625rem] font-semibold leading-[1.1] tracking-[-0.03em] text-ortaq-cream sm:text-[2.125rem]">
          {t("market.terminal.headline")}
        </h1>
        <p className={cn(typography.bodySm, "mt-3 max-w-2xl text-ortaq-cream/70")}>{t("market.terminal.sub")}</p>

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

        <p className={cn(typography.caption, "mt-4 max-w-2xl text-ortaq-cream/50")}>
          {t("market.terminal.access")} · {t("market.terminal.legal")}
        </p>

        <div className="mt-5">
          <Link
            href="/kesfet"
            className="inline-flex min-h-10 items-center rounded-ortaq-md bg-ortaq-cream px-4 text-[0.8125rem] font-semibold text-ortaq-ink transition-opacity hover:opacity-90"
          >
            {t("market.terminal.cta")}
          </Link>
        </div>
      </Container>
    </section>
  );
}
