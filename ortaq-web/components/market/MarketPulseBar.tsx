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

export function MarketPulseBar() {
  const { t, i18n } = useTranslation();
  const pulse = getMarketPulse();
  const locale = i18n.language === "tr" ? "tr-TR" : "en-GB";
  const lastLabel = pulse.lastFeedDate ? formatPulseDate(pulse.lastFeedDate, locale) : "—";
  const hero = media.exportWarehouse;

  return (
    <section className="border-b border-ortaq-border bg-ortaq-bg">
      <Container wide className="py-6 sm:py-8">
        <div className="lg:grid lg:grid-cols-12 lg:items-center lg:gap-10">
          <div className="lg:col-span-7">
            <p className={cn(typography.caption, "tabular-nums text-ortaq-ink-soft")}>
              {t("market.terminal.lastSync", { date: lastLabel })}
            </p>

            <h1 className="mt-2 text-[1.375rem] font-semibold leading-tight tracking-[-0.02em] text-ortaq-ink sm:text-[1.625rem]">
              {t("market.terminal.headline", { count: pulse.coverage })}
            </h1>

            <p className={cn(typography.bodySm, "mt-2 tabular-nums text-ortaq-ink-muted")}>
              {t("market.terminal.scope", {
                sectors: pulse.sectorCount,
                cities: pulse.cityCount,
                records: pulse.feedEvents,
              })}
            </p>

            <Link
              href="/kesfet"
              className={cn(typography.bodySm, "mt-5 inline-flex font-semibold text-ortaq-ink underline-offset-2 hover:underline")}
            >
              {t("market.terminal.cta")} →
            </Link>
          </div>

          <div className="relative mt-6 aspect-[16/10] overflow-hidden rounded-ortaq-md border border-ortaq-border bg-ortaq-bg-alt lg:col-span-5 lg:mt-0">
            <Image
              src={hero.src}
              alt=""
              fill
              priority
              className="object-cover"
              style={{ objectPosition: hero.focalPoint }}
              sizes="(max-width: 1024px) 100vw, 420px"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
