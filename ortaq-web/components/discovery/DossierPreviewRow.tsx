"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import type { SimulatedCampaign } from "@/lib/campaigns/types";
import { getCampaignMediaAsset, getCampaignMediaAlt, getSectorTag, getSectorTagEn } from "@/lib/product/company-summary";
import { getCampaignTensionLine } from "@/lib/intelligence/tension";
import { VerificationLabel } from "@/components/trust/VerificationLabel";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

type DossierPreviewRowProps = {
  campaign: SimulatedCampaign;
  index: number;
};

export function DossierPreviewRow({ campaign: c, index }: DossierPreviewRowProps) {
  const { t, i18n } = useTranslation();
  const mediaAsset = getCampaignMediaAsset(c.slug, c.sector);
  const sectorTag = i18n.language === "en" ? getSectorTagEn(c) : getSectorTag(c);
  const tension = getCampaignTensionLine(c);

  return (
    <Link
      href={`/sirket/${c.slug}`}
      className="authority-registry-row group grid gap-3 py-4 sm:grid-cols-[4.5rem_1fr_auto] sm:items-start sm:gap-5 sm:py-5"
    >
      <div className="relative aspect-[5/4] w-[4.5rem] shrink-0 overflow-hidden rounded-ortaq-sm border border-ortaq-border-strong bg-ortaq-bg-warm sm:aspect-square sm:h-[4.5rem] sm:w-[4.5rem]">
        <Image
          src={mediaAsset.src}
          alt={getCampaignMediaAlt(mediaAsset, i18n.language)}
          fill
          className="object-cover transition-transform duration-500 ease-out motion-reduce:transition-none group-hover:scale-[1.05]"
          style={{ objectPosition: mediaAsset.focalPoint }}
          sizes="72px"
        />
        <span className="absolute left-1 top-1 rounded-ortaq-sm bg-ortaq-surface/90 px-1 py-0.5 text-[0.625rem] font-semibold tabular-nums text-ortaq-ink-soft">
          {String(index).padStart(2, "0")}
        </span>
      </div>

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.06em] text-ortaq-trust">{sectorTag}</span>
          <VerificationLabel label={c.verificationLabel} />
        </div>
        <h3 className={cn(typography.h2, "mt-1 text-[1.125rem] sm:text-[1.1875rem]")}>{c.tradeName}</h3>
        <p className={cn(typography.bodySm, "mt-1.5 font-medium text-ortaq-ink")}>{tension}</p>
        {c.gateway?.hook && (
          <p className={cn(typography.caption, "mt-1 line-clamp-1 text-ortaq-ink-muted")}>{c.gateway.hook}</p>
        )}
      </div>

      <span className={cn(typography.bodySm, "self-center font-semibold text-ortaq-trust-muted group-hover:text-ortaq-trust group-hover:underline sm:self-start sm:pt-1 sm:text-right")}>
        {t("homeProduct.companies.enter")} →
      </span>
    </Link>
  );
}
