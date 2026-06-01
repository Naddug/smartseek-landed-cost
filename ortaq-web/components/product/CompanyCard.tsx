"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import type { SimulatedCampaign } from "@/lib/campaigns/types";
import {
  formatDaysAgo,
  getCampaignMediaAlt,
  getCampaignMediaAsset,
  getLastUpdatedIso,
  getSectorTag,
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
  const sectorTag = getSectorTag(c);
  const situation = getOperationalRelevanceLine(c);
  const lastIso = getLastUpdatedIso(c);
  const updatedAgo = lastIso ? formatDaysAgo(lastIso, locale) : null;

  return (
    <Link
      href={`/sirket/${c.slug}`}
      className={cn(
        "discover-card-hover product-card group flex flex-col overflow-hidden border border-ortaq-border bg-ortaq-surface",
        featured && "w-[calc(100vw-2.5rem)] max-w-[21.25rem] shrink-0 snap-start sm:w-auto sm:max-w-none sm:shrink",
      )}
    >
      <div className="relative aspect-[16/9] w-full shrink-0 overflow-hidden border-b border-ortaq-border bg-ortaq-bg-alt">
        <Image
          src={mediaAsset.src}
          alt={getCampaignMediaAlt(mediaAsset, i18n.language)}
          fill
          loading="lazy"
          className="object-cover transition-opacity group-hover:opacity-95"
          style={{ objectPosition: mediaAsset.focalPoint }}
          sizes={featured ? "340px" : "(max-width: 640px) 88vw, 400px"}
        />
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className={cn(typography.h3, "text-ortaq-ink")}>{c.tradeName}</h3>
        <p className={cn(typography.caption, "mt-1 text-ortaq-ink-muted")}>
          {c.city} · {sectorTag}
        </p>

        <p className={cn(typography.bodySm, "mt-3 line-clamp-3 leading-relaxed text-ortaq-ink-muted")}>
          {situation}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-ortaq-border pt-3">
          <span className={cn(typography.caption, "text-ortaq-ink-soft")}>{reviewStatusLabels[c.reviewStatus]}</span>
          {updatedAgo ? (
            <>
              <span className="text-ortaq-border-strong" aria-hidden>
                ·
              </span>
              <span className={cn(typography.caption, "tabular-nums text-ortaq-ink-soft")}>{updatedAgo}</span>
            </>
          ) : null}
        </div>

        <span className={cn(typography.bodySm, "mt-3 font-medium text-ortaq-trust-muted group-hover:underline")}>
          {t("discovery.companyCard.cta")} →
        </span>
      </div>
    </Link>
  );
}
