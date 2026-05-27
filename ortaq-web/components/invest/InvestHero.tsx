"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { Building2, ShieldCheck, TrendingUp, Users } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Section";
import { getCampaign } from "@/lib/campaigns";
import { listCampaigns } from "@/lib/campaigns";
import { getFeaturedSlug } from "@/lib/intelligence/discovery";
import { getHomePlatformStats } from "@/lib/intelligence/home-stats";
import {
  getCampaignMediaAsset,
  getCampaignMediaAlt,
  getOperationalSignal,
  getReviewProgress,
  getSectorTag,
  getSectorTagEn,
} from "@/lib/product/company-summary";
import { getCampaignTensionLine } from "@/lib/intelligence/tension";
import { getSectorStyle } from "@/lib/invest/sector-style";
import { formatTryCompact } from "@/lib/invest/format";
import { VerificationLabel } from "@/components/trust/VerificationLabel";
import { media } from "@/lib/media";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

const trustIcons = [ShieldCheck, Building2, Users, TrendingUp] as const;
const trustKeys = ["1", "2", "3", "4"] as const;

export function InvestHero() {
  const { t, i18n } = useTranslation();
  const featured = getCampaign(getFeaturedSlug());
  const stats = getHomePlatformStats();

  if (!featured) return null;

  const mediaAsset = getCampaignMediaAsset(featured.slug, featured.sector);
  const sectorTag = i18n.language === "en" ? getSectorTagEn(featured) : getSectorTag(featured);
  const style = getSectorStyle(featured);
  const { percent } = getReviewProgress(featured);
  const exportShare = getOperationalSignal(featured, "ihracat", "export");
  const tension = getCampaignTensionLine(featured);

  return (
    <section className="invest-hero relative overflow-x-clip overflow-hidden border-b border-ortaq-border">
      <div className="invest-hero-bg absolute inset-0" aria-hidden />
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[42%] opacity-[0.14] lg:block" aria-hidden>
        <Image
          src={media.cncWorkshop.src}
          alt=""
          fill
          loading="lazy"
          className="object-cover"
          style={{ objectPosition: media.cncWorkshop.focalPoint }}
          sizes="42vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#faf9f7] via-[#faf9f7]/60 to-transparent" />
      </div>
      <Container wide className="relative">
        <div className="grid gap-8 py-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center lg:gap-10 lg:py-10">
          <div>
            <p className={cn(typography.label, "text-ortaq-trust-muted")}>{t("homeProduct.invest.hero.label")}</p>
            <h1 className="mt-2 font-body text-[1.75rem] font-semibold leading-[1.1] tracking-[-0.03em] text-ortaq-ink sm:text-[2.375rem] lg:text-[2.625rem]">
              {t("homeProduct.invest.hero.title")}
            </h1>
            <p className={cn(typography.body, "mt-4 max-w-lg font-medium text-ortaq-ink-muted")}>
              {t("homeProduct.invest.hero.lead")}
            </p>
            <p className={cn(typography.bodySm, "mt-3 max-w-lg border-l-2 border-ortaq-trust/30 pl-3 font-medium text-ortaq-ink-muted")}>
              {t("homeProduct.invest.hero.conviction")}
            </p>
            <p className={cn(typography.caption, "mt-2 max-w-lg font-medium text-ortaq-trust-muted")}>
              {t("homeProduct.invest.hero.accessLine")}
            </p>

            <ul className="mt-5 grid gap-2 sm:grid-cols-2">
              {trustKeys.map((key, i) => {
                const Icon = trustIcons[i];
                return (
                  <li key={key} className="flex items-start gap-2 rounded-ortaq-md bg-ortaq-surface/80 px-3 py-2 shadow-[var(--shadow-product)]">
                    <Icon className="mt-0.5 h-4 w-4 shrink-0 text-ortaq-trust" strokeWidth={1.75} />
                    <span className={cn(typography.caption, "font-medium text-ortaq-ink-muted")}>
                      {t(`homeProduct.hero.trust.${key}`)}
                    </span>
                  </li>
                );
              })}
            </ul>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <Link href="#firsatlar" className="w-full sm:w-auto">
                <Button variant="primary" size="lg" fullWidth className="sm:min-w-[200px] sm:w-auto bg-ortaq-trust hover:bg-ortaq-trust-muted">
                  {t("homeProduct.invest.hero.ctaPrimary")}
                </Button>
              </Link>
              <Link href="/nasil-calisir" className="w-full sm:w-auto">
                <Button variant="secondary" size="lg" fullWidth className="sm:w-auto">
                  {t("homeProduct.invest.hero.ctaSecondary")}
                </Button>
              </Link>
            </div>
            <p className={cn(typography.caption, "mt-3")}>{t("homeProduct.hero.disclaimer")}</p>
          </div>

          <Link
            href={`/sirket/${featured.slug}`}
            className="invest-featured-card group overflow-hidden rounded-ortaq-lg border border-ortaq-border-strong bg-ortaq-surface shadow-[var(--shadow-elevated)] transition-[box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-elevated-hover)]"
          >
            <div className="relative h-44 overflow-hidden sm:h-52">
              <Image
                src={mediaAsset.src}
                alt={getCampaignMediaAlt(mediaAsset, i18n.language)}
                fill
                priority
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                style={{ objectPosition: mediaAsset.focalPoint }}
                sizes="(max-width: 1024px) 100vw, 480px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ortaq-ink/70 via-ortaq-ink/20 to-transparent" />
              <span className={cn("absolute left-4 top-4 rounded-ortaq-sm px-2.5 py-1 text-[0.6875rem] font-bold uppercase tracking-wide", style.badge)}>
                {t("homeProduct.invest.hero.featuredBadge")}
              </span>
              <div className="absolute inset-x-4 bottom-4">
                <span className={cn(typography.caption, "font-semibold uppercase tracking-wide text-ortaq-cream/80")}>
                  {sectorTag}
                </span>
                <h2 className="mt-0.5 font-body text-xl font-semibold text-ortaq-cream sm:text-2xl">{featured.tradeName}</h2>
              </div>
            </div>

            <div className="p-5">
              <p className={cn(typography.bodySm, "line-clamp-2 font-medium text-ortaq-ink")}>{tension}</p>
              <dl className="mt-4 grid grid-cols-2 gap-3">
                <div>
                  <dt className={typography.caption}>{t("homeProduct.invest.card.purpose")}</dt>
                  <dd className={cn(typography.bodySm, "mt-0.5 font-semibold tabular-nums text-ortaq-ink")}>
                    {formatTryCompact(featured.funding.targetTry, i18n.language)}
                  </dd>
                </div>
                <div>
                  <dt className={typography.caption}>{t("homeProduct.invest.card.export")}</dt>
                  <dd className={cn(typography.bodySm, "mt-0.5 font-semibold text-ortaq-ink")}>{exportShare?.value ?? "—"}</dd>
                </div>
                <div>
                  <dt className={typography.caption}>{t("homeProduct.invest.hero.location")}</dt>
                  <dd className={cn(typography.bodySm, "mt-0.5 font-semibold text-ortaq-ink")}>{featured.city}</dd>
                </div>
                <div>
                  <dt className={typography.caption}>{t("homeProduct.invest.card.reviewProgress")}</dt>
                  <dd className={cn(typography.bodySm, "mt-0.5 font-semibold tabular-nums text-ortaq-trust")}>{percent}%</dd>
                </div>
              </dl>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-ortaq-bg-alt">
                <div className={cn("h-full rounded-full", style.bar)} style={{ width: `${percent}%` }} />
              </div>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <VerificationLabel label={featured.verificationLabel} className="self-start" />
                <span className={cn(typography.bodySm, "font-semibold text-ortaq-trust group-hover:underline")}>
                  {t("homeProduct.invest.card.cta")} →
                </span>
              </div>
            </div>
          </Link>
        </div>

        <dl className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {(
            [
              ["dossiers", stats.dossiers],
              ["sectors", stats.sectors],
              ["fieldVisits", stats.fieldVisits],
              ["cities", stats.cities],
            ] as const
          ).map(([key, value]) => (
            <div key={key} className="invest-stat-tile rounded-ortaq-lg border border-ortaq-border/90 bg-ortaq-surface px-3 py-3 shadow-[var(--shadow-elevated)] sm:px-4 sm:py-3.5">
              <dt className={typography.caption}>{t(`homeProduct.stats.${key}`)}</dt>
              <dd className={cn(typography.metric, "mt-1 text-[1.25rem] text-ortaq-trust sm:text-[1.5rem]")}>{value}</dd>
            </div>
          ))}
        </dl>

        <div className="mb-8">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <p className={cn(typography.label, "text-ortaq-trust-muted")}>{t("homeProduct.invest.hero.ecosystemLabel")}</p>
            <p className={cn(typography.caption, "font-medium tabular-nums text-ortaq-ink-soft")}>
              {t("homeProduct.invest.hero.activityNote", { count: stats.activityTraces })}
            </p>
          </div>
          <div className="invest-ecosystem-rail product-scroll-row flex gap-2 overflow-x-auto pb-1">
            {listCampaigns().map((c) => (
              <Link
                key={c.slug}
                href={`/sirket/${c.slug}`}
                className="invest-ecosystem-pill max-w-[14rem] shrink-0 snap-start rounded-full border border-ortaq-border bg-ortaq-surface px-3 py-1.5 shadow-[var(--shadow-product)] transition-colors hover:border-ortaq-trust/30 hover:bg-ortaq-trust-soft/40"
              >
                <span className={cn(typography.caption, "block truncate font-semibold text-ortaq-ink")}>{c.tradeName}</span>
                <span className={cn(typography.meta, "block truncate text-ortaq-ink-soft")}>{c.city}</span>
              </Link>
            ))}
            <Link
              href="/sirketler"
              className="invest-ecosystem-pill shrink-0 rounded-full border border-dashed border-ortaq-trust/35 bg-ortaq-trust-soft/30 px-3 py-1.5 transition-colors hover:border-ortaq-trust/50"
            >
              <span className={cn(typography.caption, "font-semibold text-ortaq-trust")}>
                {t("homeProduct.invest.hero.viewRegistry")} →
              </span>
            </Link>
          </div>
          <p className={cn(typography.caption, "mt-2")}>{t("homeProduct.stats.disclaimer")}</p>
        </div>
      </Container>
    </section>
  );
}
