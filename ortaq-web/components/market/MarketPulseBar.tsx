"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Container } from "@/components/ui/Section";
import { getMarketPulse } from "@/lib/market/pulse";
import { formatPulseDate } from "@/lib/operations/pulse";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

const STAT_KEYS = ["coverage", "sectors", "cities", "feed"] as const;

/** Layer 1 header: pulse + stats only. No process, trust, or legal copy. */
export function MarketPulseBar() {
  const { t, i18n } = useTranslation();
  const pulse = getMarketPulse();
  const locale = i18n.language === "tr" ? "tr-TR" : "en-GB";
  const lastLabel = pulse.lastFeedDate ? formatPulseDate(pulse.lastFeedDate, locale) : "—";

  return (
    <section className="border-b border-ortaq-border bg-ortaq-bg">
      <Container wide className="py-5 sm:py-6">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.6875rem] text-ortaq-ink-soft">
          <span className="font-medium uppercase tracking-[0.06em] text-ortaq-ink-muted">{t("market.terminal.live")}</span>
          <span className="tabular-nums">{t("market.terminal.lastSync", { date: lastLabel })}</span>
        </div>

        <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <h1 className="max-w-2xl text-[1.5rem] font-semibold leading-[1.12] tracking-[-0.03em] text-ortaq-ink sm:text-[1.875rem]">
            {t("market.terminal.headline", { count: pulse.coverage })}
          </h1>
          <Link
            href="/kesfet"
            className="inline-flex min-h-10 shrink-0 items-center justify-center rounded-ortaq-md bg-ortaq-ink px-4 text-[0.8125rem] font-semibold text-ortaq-cream"
          >
            {t("market.terminal.cta")}
          </Link>
        </div>

        <dl className="mt-4 flex flex-wrap gap-2">
          {STAT_KEYS.map((key) => (
            <div
              key={key}
              className="rounded-ortaq-sm border border-ortaq-border bg-ortaq-surface px-2.5 py-1.5"
            >
              <dt className="text-[0.625rem] font-medium uppercase tracking-[0.05em] text-ortaq-ink-soft">
                {t(`market.terminal.stats.${key}.label`)}
              </dt>
              <dd className="mt-0.5 text-[0.9375rem] font-semibold tabular-nums text-ortaq-ink">
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
      </Container>
    </section>
  );
}
