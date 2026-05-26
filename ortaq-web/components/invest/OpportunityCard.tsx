"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import type { SimulatedCampaign } from "@/lib/campaigns/types";
import {
  getCampaignMediaKey,
  getOperationalSignal,
  getReviewProgress,
  getSectorTag,
  getSectorTagEn,
} from "@/lib/product/company-summary";
import { getCampaignTensionLine } from "@/lib/intelligence/tension";
import { getSectorStyle } from "@/lib/invest/sector-style";
import { formatTryCompact } from "@/lib/invest/format";
import { VerificationLabel } from "@/components/trust/VerificationLabel";
import { StatusBadge } from "@/components/trust/StatusBadge";
import { media } from "@/lib/media";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

type OpportunityCardProps = {
  campaign: SimulatedCampaign;
  featured?: boolean;
  priority?: boolean;
  className?: string;
};

export function OpportunityCard({ campaign: c, featured = false, priority = false, className }: OpportunityCardProps) {
  const { t, i18n } = useTranslation();
  const mediaKey = getCampaignMediaKey(c.slug, c.sector);
  const sectorTag = i18n.language === "en" ? getSectorTagEn(c) : getSectorTag(c);
  const style = getSectorStyle(c);
  const { percent } = getReviewProgress(c);
  const exportShare = getOperationalSignal(c, "ihracat", "export");
  const hook = getCampaignTensionLine(c);

  return (
    <Link
      href={`/sirket/${c.slug}`}
      className={cn(
        "invest-opportunity group flex flex-col overflow-hidden rounded-ortaq-lg border border-ortaq-border/90 bg-ortaq-surface shadow-[var(--shadow-elevated)] transition-[box-shadow,transform,border-color] duration-200 hover:-translate-y-0.5 hover:border-ortaq-trust/25 hover:shadow-[var(--shadow-elevated-hover)]",
        className,
      )}
    >
      <div className={cn("relative w-full shrink-0 overflow-hidden", featured ? "h-40 sm:h-48" : "h-36 sm:h-40")}>
        <Image
          src={media[mediaKey].src}
          alt={t(`media.${mediaKey}.alt`)}
          fill
          priority={priority}
          loading={priority ? undefined : "lazy"}
          className="object-cover transition-transform duration-500 ease-out motion-reduce:transition-none group-hover:scale-[1.04]"
          style={{ objectPosition: media[mediaKey].focalPoint }}
          sizes="(max-width: 640px) calc(100vw - 2.5rem), (max-width: 1024px) 50vw, 320px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ortaq-ink/50 via-transparent to-transparent" />
        <span className={cn("absolute left-3 top-3 max-w-[calc(100%-5.5rem)] truncate rounded-ortaq-sm px-2 py-0.5 text-[0.6875rem] font-semibold uppercase tracking-wide", style.badge)}>
          {sectorTag}
        </span>
        <div className="absolute right-3 top-3">
          <StatusBadge status="illustrative" className="border-l-ortaq-border-strong bg-ortaq-surface/95 pl-1.5 text-[10px]" />
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1">
            <h3 className={cn(typography.h2, "line-clamp-1")}>{c.tradeName}</h3>
            <p className={cn(typography.caption, "mt-0.5")}>{c.city}</p>
          </div>
          <VerificationLabel label={c.verificationLabel} className="self-start sm:max-w-[48%]" />
        </div>

        <p className={cn(typography.bodySm, "mt-2 line-clamp-2 font-medium text-ortaq-ink")}>{hook}</p>

        <dl className="mt-3 grid grid-cols-2 gap-2">
          <div className="rounded-ortaq-sm bg-ortaq-bg-alt px-2 py-1.5">
            <dt className={typography.caption}>{t("homeProduct.invest.card.export")}</dt>
            <dd className={cn(typography.bodySm, "mt-0.5 font-semibold text-ortaq-ink")}>{exportShare?.value ?? "—"}</dd>
          </div>
          <div className="rounded-ortaq-sm bg-ortaq-bg-alt px-2 py-1.5">
            <dt className={typography.caption}>{t("homeProduct.invest.card.purpose")}</dt>
            <dd className={cn(typography.bodySm, "mt-0.5 font-semibold tabular-nums text-ortaq-ink")}>
              {formatTryCompact(c.funding.targetTry, i18n.language)}
            </dd>
          </div>
        </dl>

        <div className="mt-3">
          <div className="flex items-center justify-between gap-2">
            <span className={typography.caption}>{t("homeProduct.invest.card.reviewProgress")}</span>
            <span className={cn(typography.caption, "font-semibold tabular-nums text-ortaq-trust")}>{percent}%</span>
          </div>
          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-ortaq-bg-alt">
            <div className={cn("h-full rounded-full transition-all", style.bar)} style={{ width: `${percent}%` }} />
          </div>
        </div>

        <span className={cn(typography.bodySm, "mt-auto pt-3 font-semibold text-ortaq-trust group-hover:underline")}>
          {t("homeProduct.invest.card.cta")} →
        </span>
      </div>
    </Link>
  );
}
