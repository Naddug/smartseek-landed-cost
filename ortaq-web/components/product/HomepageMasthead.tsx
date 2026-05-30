"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Section";
import { HomepageMastheadVisuals } from "@/components/product/HomepageMastheadVisuals";
import { listCampaigns } from "@/lib/campaigns";
import { siteFeedTop, siteFeedLastDate } from "@/lib/feed/site-feed";
import { formatPulseDate } from "@/lib/operations/pulse";
import { getSectorClusters } from "@/lib/intelligence/discovery";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

/**
 * Operational masthead.
 *
 * Replaces the old ProductHero (slogan + featured card + 4-up image strip).
 * Operational status + clear positioning copy + documentary visuals (factory reality).
 *
 * Three layers: *   1. status strip: dossier count · sector count · last-event date
 *   2. one-line headline + one-sentence factual subline
 *   3. live cross-campaign event feed (right column on lg+, below on mobile)
 *
 * Sizing target: ~280px desktop / ~360px mobile, so cards in the next
 * section start in (desktop) or just past (mobile) the first viewport.
 */

const FEED_ITEMS = 5;

const typeChipStyles: Record<string, string> = {
  observation: "bg-ortaq-bg-alt text-ortaq-ink-soft", inspection: "bg-ortaq-trust-soft text-ortaq-trust", capacity: "bg-ortaq-bg-warm text-ortaq-ink-muted", logistics: "bg-ortaq-bg-alt text-ortaq-ink-soft", founder: "bg-ortaq-status-soft text-ortaq-status", update: "bg-ortaq-bg-alt text-ortaq-ink-soft",
};

export function HomepageMasthead() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === "tr" ? "tr-TR" : "en-GB";

  const campaigns = listCampaigns();
  const events = useMemo(() => siteFeedTop(FEED_ITEMS), []);
  const lastDate = siteFeedLastDate();

  const sectorsActive = getSectorClusters().length;
  const stages = useMemo(() => {
    const s = { preliminary: 0, document: 0, field: 0, committee: 0 };
    for (const c of campaigns) {
      if (c.reviewStatus === "preliminary_review") s.preliminary += 1;
      else if (c.reviewStatus === "document_review") s.document += 1;
      else if (c.reviewStatus === "field_verification") s.field += 1;
      else if (c.reviewStatus === "committee") s.committee += 1;
    }
    return s;
  }, [campaigns]);

  return (
    <section
      className="border-b border-ortaq-border bg-ortaq-surface"
      aria-label={t("homeProduct.masthead.aria")}
    >
      <Container wide>
        {/* status strip, terminal-style */}
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b border-ortaq-border py-2.5 sm:py-3">
          <StatusItem label={t("homeProduct.masthead.status.dossiers")} value={String(campaigns.length)} />
          <StatusDot />
          <StatusItem label={t("homeProduct.masthead.status.sectors")} value={String(sectorsActive)} />
          <StatusDot />
          <StatusItem
            label={t("homeProduct.masthead.status.field")}
            value={String(stages.field)}
          />
          <StatusDot />
          <StatusItem
            label={t("homeProduct.masthead.status.document")}
            value={String(stages.document)}
          />
          <StatusDot />
          <StatusItem
            label={t("homeProduct.masthead.status.preliminary")}
            value={String(stages.preliminary)}
          />
          {lastDate && (
            <>
              <StatusDot />
              <StatusItem
                label={t("homeProduct.masthead.status.lastEvent")}
                value={formatPulseDate(lastDate, locale)}
              />
            </>
          )}
        </div>

        {/* positioning + visuals */}
        <div className="grid gap-5 py-5 sm:py-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-start lg:gap-8">
          <div className="order-2 min-w-0 flex flex-col lg:order-1">
            <p className={typography.label}>{t("homeProduct.masthead.essence")}</p>
            <h1 className={cn(typography.display, "mt-1.5 max-w-2xl")}>
              {t("homeProduct.masthead.title")}
            </h1>
            <p className={cn(typography.body, "mt-2 max-w-xl")}>
              {t("homeProduct.masthead.subline")}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Link href="#dosyalar">
                <Button variant="primary" size="lg">
                  {t("homeProduct.masthead.ctaPrimary")}
                </Button>
              </Link>
              <Link href="/nasil-calisir" className={cn(typography.bodySm, typography.link, "font-medium")}>
                {t("homeProduct.masthead.ctaSecondary")} →
              </Link>
            </div>
            <p className={cn(typography.caption, "mt-3 max-w-xl")}>
              {t("homeProduct.masthead.disclaimer")}
            </p>
          </div>

          <div className="order-1 lg:order-2">
            <HomepageMastheadVisuals />
          </div>
        </div>

        {/* live feed, full width below hero */}
        <div className="border-t border-ortaq-border pb-5 sm:pb-6">
            <div className="flex items-center justify-between">
              <p className={typography.label}>{t("homeProduct.masthead.feed.label")}</p>
              <Link
                href="#aktivite"
                className={cn(typography.caption, "text-ortaq-ink-soft hover:text-ortaq-ink")}
              >
                {t("homeProduct.masthead.feed.viewAll")} →
              </Link>
            </div>
            <ol className="mt-2 divide-y divide-ortaq-border rounded-ortaq-md border border-ortaq-border bg-ortaq-bg-alt/30">
              {events.map((ev, i) => {
                const tone = ev.kind === "field" ? typeChipStyles[ev.type] : typeChipStyles.update;
                const chipKey =
                  ev.kind === "field"
                    ? t(`dossier.field.types.${ev.type}`)
                    : t("homeProduct.masthead.feed.update");
                return (
                  <li key={`${ev.campaignSlug}-${ev.date}-${ev.time}-${i}`} className="px-3 py-2 sm:px-3.5">
                    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                      <time className={cn(typography.caption, "tabular-nums text-ortaq-ink-soft")}>
                        {ev.date.slice(5).replace("-", ".")} · {ev.time}
                      </time>
                      <Link
                        href={`/sirket/${ev.campaignSlug}`}
                        className={cn(typography.caption, "truncate font-medium text-ortaq-ink hover:underline")}
                      >
                        {ev.campaignTradeName}
                      </Link>
                      <span className={cn(typography.caption, "text-ortaq-ink-soft")}>
                        · {ev.campaignCity}
                      </span>
                      <span
                        className={cn(
                          "ml-auto rounded-ortaq-sm px-1.5 py-0.5 text-[0.625rem] font-medium uppercase tracking-wide", tone, )}
                      >
                        {chipKey}
                      </span>
                    </div>
                    <p className={cn(typography.bodySm, "mt-1 line-clamp-2 text-ortaq-ink-muted")}>{ev.text}</p>
                  </li>
                );
              })}
            </ol>
        </div>
      </Container>
    </section>
  );
}

function StatusItem({ label, value }: { label: string; value: string }) {
  return (
    <span className="inline-flex items-baseline gap-1.5">
      <span className="text-[0.6875rem] uppercase tracking-[0.06em] text-ortaq-ink-soft">{label}</span>
      <span className="text-[0.8125rem] font-medium tabular-nums text-ortaq-ink">{value}</span>
    </span>
  );
}

function StatusDot() {
  return <span aria-hidden className="text-ortaq-border-strong">·</span>;
}
