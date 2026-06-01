"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import type { SimulatedCampaign } from "@/lib/campaigns/types";
import {
  formatDaysAgo,
  getCampaignMediaAsset,
  getCampaignMediaAlt,
  getExportMarketsLine,
  getLastUpdatedIso,
  getSectorTag,
  getSectorTagEn,
} from "@/lib/product/company-summary";
import { getOperationalRelevanceLine } from "@/lib/product/operational-relevance";
import { reviewStatusLabels } from "@/lib/product/home-data";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

type CompanyCardProps = {
  campaign: SimulatedCampaign;
  featured?: boolean;
};

export function CompanyCard({ campaign: c, featured = false }: CompanyCardProps) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === "tr" ? "tr-TR" : "en-GB";
  const mediaAsset = getCampaignMediaAsset(c.slug, c.sector);
  const sectorTag = i18n.language === "en" ? getSectorTagEn(c) : getSectorTag(c);
  const exportLine = getExportMarketsLine(c, 2);
  const lastIso = getLastUpdatedIso(c);
  const situation = getOperationalRelevanceLine(c);

  return (
    <Link
      href={`/sirket/${c.slug}`}
      className={cn(
        "discover-card-hover product-card group flex flex-col overflow-hidden rounded-ortaq-md border border-ortaq-border bg-ortaq-surface shadow-sm",
        featured && "w-[calc(100vw-2.5rem)] max-w-[22rem] shrink-0 snap-start sm:w-auto sm:max-w-none sm:shrink",
      )}
    >
      <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden bg-ortaq-bg-alt">
        <Image
          src={mediaAsset.src}
          alt={getCampaignMediaAlt(mediaAsset, i18n.language)}
          fill
          loading="lazy"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          style={{ objectPosition: mediaAsset.focalPoint }}
          sizes={featured ? "360px" : "(max-width: 640px) 88vw, 400px"}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ortaq-ink/75 via-ortaq-ink/10 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-3">
          <h3 className="text-[0.9375rem] font-semibold leading-tight text-ortaq-cream">{c.tradeName}</h3>
          <p className="mt-0.5 text-[0.75rem] text-ortaq-cream/80">
            {c.city} · {sectorTag}
          </p>
        </div>
        <span className="absolute right-2 top-2 rounded-ortaq-sm bg-ortaq-ink/80 px-2 py-0.5 text-[0.625rem] font-medium text-ortaq-cream">
          {reviewStatusLabels[c.reviewStatus]}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <p className={cn(typography.bodySm, "line-clamp-3 leading-relaxed text-ortaq-ink")}>{situation}</p>

        {exportLine ? (
          <p className={cn(typography.caption, "mt-2 text-ortaq-ink-soft")}>
            {t("market.companyCard.exportLabel")}: {exportLine}
          </p>
        ) : null}

        {lastIso ? (
          <p className={cn(typography.caption, "mt-2 tabular-nums text-ortaq-ink-soft")}>
            {t("market.companyCard.updated", { when: formatDaysAgo(lastIso, locale) })}
          </p>
        ) : null}

        <span className={cn(typography.bodySm, "mt-3 font-semibold text-ortaq-trust-muted group-hover:underline")}>
          {t("market.companyCard.cta")} →
        </span>
      </div>
    </Link>
  );
}
