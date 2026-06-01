"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import type { SimulatedCampaign } from "@/lib/campaigns/types";
import { getCampaignMediaAsset, getCampaignMediaAlt } from "@/lib/product/company-summary";
import { getCompanyFacet } from "@/lib/market/company-facet";
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
  const facet = getCompanyFacet(c, locale);
  const proofShowsHeadcount = /çalışan|employee/i.test(facet.proofLine);

  return (
    <Link
      href={`/sirket/${c.slug}`}
      className={cn(
        "discover-card-hover product-card group flex flex-col overflow-hidden border border-ortaq-border bg-ortaq-surface",
        featured && "w-[calc(100vw-2.5rem)] max-w-[21.25rem] shrink-0 snap-start sm:w-auto sm:max-w-none sm:shrink",
      )}
    >
      <div className="relative h-20 w-full shrink-0 overflow-hidden border-b border-ortaq-border bg-ortaq-bg-alt">
        <Image
          src={mediaAsset.src}
          alt={getCampaignMediaAlt(mediaAsset, i18n.language)}
          fill
          loading="lazy"
          className="object-cover opacity-80 transition-opacity group-hover:opacity-95"
          style={{ objectPosition: mediaAsset.focalPoint }}
          sizes={featured ? "340px" : "(max-width: 640px) 88vw, 400px"}
        />
        {facet.updatedAgo ? (
          <span className="absolute right-2 top-2 rounded-ortaq-sm bg-ortaq-ink/75 px-1.5 py-0.5 text-[0.625rem] font-medium tabular-nums text-ortaq-cream">
            {facet.updatedAgo}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-3.5 sm:p-4">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className={cn(typography.h3, "truncate text-ortaq-ink")}>{facet.tradeName}</h3>
        </div>
        <p className={cn(typography.caption, "mt-0.5 text-ortaq-ink-muted")}>
          {facet.city} · {facet.sector}
        </p>

        <p className={cn(typography.bodySm, "mt-2.5 line-clamp-3 leading-snug text-ortaq-ink")}>
          {facet.situation}
        </p>

        <p className={cn(typography.caption, "mt-2 font-mono text-[0.6875rem] leading-relaxed text-ortaq-ink-soft")}>
          {facet.proofLine}
          {!proofShowsHeadcount ? (
            <>
              <span className="text-ortaq-border-strong"> · </span>
              {t("market.companyCard.employees", { count: facet.employees })}
            </>
          ) : null}
          <span className="text-ortaq-border-strong"> · </span>
          {facet.reviewLabel}
        </p>

        <span className={cn(typography.bodySm, "mt-3 font-medium text-ortaq-trust-muted group-hover:underline")}>
          {t("market.companyCard.cta")} →
        </span>
      </div>
    </Link>
  );
}
