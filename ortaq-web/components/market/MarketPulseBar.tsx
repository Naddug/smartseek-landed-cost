"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { Container } from "@/components/ui/Section";
import { getMarketPulse } from "@/lib/market/pulse";
import { formatPulseDate } from "@/lib/operations/pulse";
import { media } from "@/lib/media";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

const STAT_KEYS = ["coverage", "sectors", "cities", "feed"] as const;

export function MarketPulseBar() {
  const { t, i18n } = useTranslation();
  const pulse = getMarketPulse();
  const locale = i18n.language === "tr" ? "tr-TR" : "en-GB";
  const lastLabel = pulse.lastFeedDate ? formatPulseDate(pulse.lastFeedDate, locale) : "—";
  const hero = media.exportWarehouse;

  return (
    <section className="border-b border-ortaq-border bg-ortaq-bg">
      <Container wide className="py-6 sm:py-8">
        <div className="lg:grid lg:grid-cols-12 lg:items-center lg:gap-8">
          <div className="lg:col-span-7">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.6875rem] text-ortaq-ink-soft">
              <span className="font-medium uppercase tracking-[0.06em] text-ortaq-ink-muted">
                {t("market.terminal.live")}
              </span>
              <span className="tabular-nums">{t("market.terminal.lastSync", { date: lastLabel })}</span>
            </div>

            <h1 className="mt-3 max-w-xl text-[1.5rem] font-semibold leading-[1.12] tracking-[-0.03em] text-ortaq-ink sm:text-[2rem]">
              {t("market.terminal.headline", { count: pulse.coverage })}
            </h1>
            <dl className="mt-5 flex flex-wrap gap-2">
              {STAT_KEYS.map((key) => (
                <div
                  key={key}
                  className="rounded-ortaq-sm border border-ortaq-border bg-ortaq-surface px-3 py-2"
                >
                  <dt className="text-[0.625rem] font-medium uppercase tracking-[0.05em] text-ortaq-ink-soft">
                    {t(`market.terminal.stats.${key}.label`)}
                  </dt>
                  <dd className="mt-0.5 text-[1rem] font-semibold tabular-nums text-ortaq-ink">
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

            <Link
              href="/kesfet"
              className="mt-6 inline-flex min-h-10 items-center justify-center rounded-ortaq-md bg-ortaq-ink px-5 text-[0.8125rem] font-semibold text-ortaq-cream"
            >
              {t("market.terminal.cta")}
            </Link>
          </div>

          <div className="relative mt-6 hidden aspect-[16/10] overflow-hidden rounded-ortaq-md border border-ortaq-border bg-ortaq-bg-alt lg:col-span-5 lg:mt-0 lg:block">
            <Image
              src={hero.src}
              alt={t("media.exportWarehouse.alt")}
              fill
              priority
              className="object-cover"
              style={{ objectPosition: hero.focalPoint }}
              sizes="(max-width: 1024px) 0px, 420px"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
