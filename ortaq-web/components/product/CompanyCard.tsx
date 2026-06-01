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
  const exportLine = getExportMarketsLine(c);
  const lastIso = getLastUpdatedIso(c);
  const situation = getOperationalRelevanceLine(c);

  return (
    <Link
      href={`/sirket/${c.slug}`}
      className={cn(
        "discover-card-hover product-card group flex flex-col overflow-hidden border border-ortaq-border bg-ortaq-surface",
        featured && "w-[calc(100vw-2.5rem)] max-w-[21.25rem] shrink-0 snap-start sm:w-auto sm:max-w-none sm:shrink",
      )}
    >
      <div className="relative h-24 w-full shrink-0 overflow-hidden border-b border-ortaq-border bg-ortaq-bg-alt">
        <Image
          src={mediaAsset.src}
          alt={getCampaignMediaAlt(mediaAsset, i18n.language)}
          fill
          loading="lazy"
          className="object-cover opacity-85 transition-opacity group-hover:opacity-100"
          style={{ objectPosition: mediaAsset.focalPoint }}
          sizes={featured ? "340px" : "(max-width: 640px) 88vw, 400px"}
        />
      </div>

      <div className="flex flex-1 flex-col p-3.5 sm:p-4">
        <p className={cn(typography.bodySm, "line-clamp-3 font-medium leading-snug text-ortaq-ink")}>
          {situation}
        </p>

        <div className="mt-3 border-t border-ortaq-border pt-3">
          <h3 className={cn(typography.h3, "truncate text-ortaq-ink")}>{c.tradeName}</h3>
          <p className={cn(typography.caption, "mt-0.5 text-ortaq-ink-muted")}>
            {c.city} · {sectorTag}
            {exportLine ? ` · ${exportLine}` : ""}
          </p>
          {lastIso ? (
            <p className={cn(typography.caption, "mt-1 tabular-nums text-ortaq-ink-soft")}>
              {formatDaysAgo(lastIso, locale)}
            </p>
          ) : null}
        </div>

        <span className={cn(typography.bodySm, "mt-4 font-medium text-ortaq-trust-muted group-hover:underline")}>
          {t("market.companyCard.cta")} →
        </span>
      </div>
    </Link>
  );
}
