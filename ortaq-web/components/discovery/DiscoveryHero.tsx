"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Section";
import { siteFeedTop, siteFeedCount } from "@/lib/feed/site-feed";
import { getHomePlatformStats } from "@/lib/intelligence/home-stats";
import { getReviewQueueBreakdown } from "@/lib/intelligence/discovery";
import { formatPulseDate } from "@/lib/operations/pulse";
import { media } from "@/lib/media";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

const statKeys = ["dossiers", "sectors", "fieldVisits", "reviewLayers"] as const;

export function DiscoveryHero() {
  const { t, i18n } = useTranslation();
  const stats = getHomePlatformStats();
  const feed = siteFeedTop(4);
  const queue = getReviewQueueBreakdown();
  const traceCount = siteFeedCount();
  const locale = i18n.language === "tr" ? "tr-TR" : "en-GB";
  const pipelineTotal = Object.values(queue).reduce((a, b) => a + b, 0);

  return (
    <section className="authority-hero relative overflow-hidden border-b border-ortaq-border-strong bg-ortaq-surface">
      <div className="relative lg:min-h-[34rem]">
        <Container wide className="relative z-10 py-8 lg:flex lg:max-w-[46%] lg:flex-col lg:justify-center lg:py-12 xl:max-w-[42%]">
          <p className={cn(typography.label, "text-ortaq-trust-muted")}>{t("homeProduct.discovery.hero.label")}</p>
          <h1 className="authority-hero-title mt-3 max-w-[11ch] font-body text-[2.125rem] font-semibold leading-[1.02] tracking-[-0.035em] text-ortaq-ink sm:text-[2.625rem] lg:text-[3rem] xl:text-[3.25rem]">
            {t("homeProduct.discovery.hero.title")}
          </h1>
          <p className={cn(typography.body, "mt-5 max-w-md font-medium text-ortaq-ink lg:max-w-lg")}>
            {t("homeProduct.discovery.hero.lead")}
          </p>

          <dl className="authority-stat-rail mt-8 flex flex-wrap items-baseline gap-x-8 gap-y-3 border-y border-ortaq-border py-4">
            {statKeys.map((key, i) => (
              <div key={key} className="flex items-baseline gap-2">
                <dd
                  className={cn(
                    "font-body font-semibold tabular-nums text-ortaq-ink",
                    i === 0 ? "text-[2rem] leading-none tracking-[-0.03em]" : "text-[1.375rem] leading-none",
                  )}
                >
                  {stats[key]}
                </dd>
                <dt className={cn(typography.caption, "max-w-[8rem]")}>{t(`homeProduct.stats.${key}`)}</dt>
              </div>
            ))}
          </dl>

          <p className={cn(typography.caption, "mt-3 font-medium text-ortaq-ink-muted")}>
            {t("homeProduct.discovery.hero.archiveDepth", { count: traceCount })}
            <span className="text-ortaq-ink-soft"> · </span>
            {t("homeProduct.discovery.hero.pipelineNote", { count: pipelineTotal })}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link href="#kesif">
              <Button variant="primary" size="lg" className="min-w-[220px]">
                {t("homeProduct.discovery.hero.cta")}
              </Button>
            </Link>
            <Link
              href="#dosyalar"
              className={cn(typography.bodySm, "font-semibold text-ortaq-trust-muted hover:text-ortaq-trust hover:underline")}
            >
              {t("homeProduct.discovery.hero.secondary")} →
            </Link>
          </div>
        </Container>

        <div className="authority-hero-bleed relative mx-4 mb-0 h-56 overflow-hidden rounded-ortaq-md border border-ortaq-border-strong sm:mx-6 sm:h-72 lg:absolute lg:inset-y-0 lg:right-0 lg:mx-0 lg:h-full lg:w-[54%] lg:rounded-none lg:border-0 lg:border-l lg:border-ortaq-border">
          <Image
            src={media.factoryFloor.src}
            alt={t("media.factoryFloor.alt")}
            fill
            priority
            className="object-cover"
            style={{ objectPosition: "55% 38%" }}
            sizes="(max-width: 1024px) 100vw, 54vw"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ortaq-ink/75 via-ortaq-ink/25 to-transparent px-4 py-4 lg:px-6 lg:py-5">
            <p className={cn(typography.caption, "text-ortaq-cream/70")}>{t("homeProduct.discovery.hero.imageCaption")}</p>
            <p className={cn(typography.bodySm, "mt-0.5 font-medium text-ortaq-cream")}>
              {t("homeProduct.discovery.hero.imageEvidence")}
            </p>
          </div>
        </div>
      </div>

      <div className="authority-terminal relative z-10 border-t border-ortaq-border-strong bg-ortaq-bg-alt">
        <Container wide>
          <div className="flex flex-wrap items-baseline justify-between gap-2 py-3">
            <p className={cn(typography.label, "intel-live-dot")}>{t("homeProduct.discovery.hero.feedLabel")}</p>
            <Link href="#kesif" className={cn(typography.caption, "font-semibold text-ortaq-trust-muted hover:text-ortaq-trust hover:underline")}>
              {t("homeProduct.discovery.hero.feedLink")} →
            </Link>
          </div>
          <div className="grid divide-y divide-ortaq-border border-y border-ortaq-border sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4 lg:divide-x lg:divide-y-0">
            {feed.map((ev, i) => (
              <Link
                key={`${ev.campaignSlug}-${ev.date}-${i}`}
                href={`/sirket/${ev.campaignSlug}`}
                className={cn(
                  "authority-terminal-cell group block px-0 py-3 sm:px-4 sm:py-3.5 lg:px-4",
                  i === 0 && "bg-ortaq-trust-soft/40",
                )}
              >
                <div className="flex items-baseline justify-between gap-2">
                  <span className={cn(typography.bodySm, "font-semibold text-ortaq-ink group-hover:text-ortaq-trust")}>
                    {ev.campaignTradeName}
                  </span>
                  <span className={cn(typography.meta, "shrink-0 tabular-nums")}>{formatPulseDate(ev.date, locale)}</span>
                </div>
                <p className={cn(typography.caption, "mt-1.5 line-clamp-2 text-ortaq-ink-muted group-hover:text-ortaq-ink")}>
                  {ev.text}
                </p>
              </Link>
            ))}
          </div>
        </Container>
      </div>
    </section>
  );
}
