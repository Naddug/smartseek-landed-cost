"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import type { SimulatedCampaign } from "@/lib/campaigns/types";
import {
  getCampaignMediaAsset, getCampaignMediaAlt, getFacilityArea, getLatestOperationalNote, getOperationalSignal, getSectorTag, getSectorTagEn,
} from "@/lib/product/company-summary";
import { ReviewStepper } from "@/components/product/ReviewStepper";
import { reviewStatusLabels } from "@/lib/product/home-data";
import { VerificationLabel } from "@/components/trust/VerificationLabel";
import { getCampaignTensionLine } from "@/lib/intelligence/tension";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";
import { formatPulseDate } from "@/lib/operations/pulse";

type CompanyCardProps = {
  campaign: SimulatedCampaign;
  /** Fixed width for horizontal scroll rows */
  featured?: boolean;
};

export function CompanyCard({ campaign: c, featured = false }: CompanyCardProps) {
  const { t, i18n } = useTranslation();
  const mediaAsset = getCampaignMediaAsset(c.slug, c.sector);
  const capacity = getOperationalSignal(c, "kapasite", "capacity");
  const exportShare = getOperationalSignal(c, "ihracat", "export");
  const facilityArea = getFacilityArea(c) ?? "-";
  const latestNote = getLatestOperationalNote(c);
  const sectorTag = i18n.language === "en" ? getSectorTagEn(c) : getSectorTag(c);
  const tension = getCampaignTensionLine(c);
  const statusLabel =
    i18n.language === "en"
      ? {
          preliminary_review: "Preliminary review", document_review: "Document review", field_verification: "Field verification", committee: "Committee review", }[c.reviewStatus]
      : reviewStatusLabels[c.reviewStatus];

  return (
    <Link
      href={`/sirket/${c.slug}`}
      className={cn(
        "discover-card-hover product-card group flex flex-col overflow-hidden", featured && "w-[calc(100vw-2.5rem)] max-w-[21.25rem] shrink-0 snap-start sm:w-auto sm:max-w-none sm:shrink", )}
    >
      <div className="discover-spotlight-image relative h-32 w-full shrink-0 overflow-hidden border-b border-ortaq-border">
        <Image
          src={mediaAsset.src}
          alt={getCampaignMediaAlt(mediaAsset, i18n.language)}
          fill
          loading="lazy"
          className="object-cover transition-transform duration-500 ease-out motion-reduce:transition-none group-hover:scale-[1.04]"
          style={{ objectPosition: mediaAsset.focalPoint }}
          sizes={featured ? "340px" : "(max-width: 640px) 88vw, 400px"}
        />
        <div className="absolute left-2.5 top-2.5 flex flex-wrap gap-1">
          <span className="rounded-ortaq-sm bg-ortaq-surface/95 px-1.5 py-0.5 text-[0.625rem] font-semibold uppercase tracking-wide text-ortaq-trust">
            {sectorTag}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-3.5 sm:p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className={cn(typography.h3, "truncate")}>{c.tradeName}</h3>
            <p className={cn(typography.caption, "mt-0.5 truncate")}>{c.sector}</p>
          </div>
          <VerificationLabel label={c.verificationLabel} className="max-w-[45%] sm:max-w-none" />
        </div>

        <p className={cn(typography.caption, "mt-2 text-ortaq-ink-muted")}>
          {c.city} · {c.employees} {t("homeProduct.companyCard.employeesUnit")} · {facilityArea}
        </p>

        <p className={cn(typography.caption, "mt-2 line-clamp-1 text-ortaq-ink-muted")}>{tension}</p>

        <dl className="mt-3 grid grid-cols-2 gap-2">
          <MetricCell label={t("homeProduct.companyCard.capacity")} value={capacity?.value ?? "-"} />
          <MetricCell label={t("homeProduct.companyCard.exportShare")} value={exportShare?.value ?? "-"} />
          <MetricCell label={t("homeProduct.companyCard.facility")} value={facilityArea} />
          <MetricCell label={t("homeProduct.companyCard.facilityStatus")} value={statusLabel} />
        </dl>

        <ReviewStepper campaign={c} className="mt-3" />

        {latestNote && (
          <p className={cn(typography.caption, "mt-2.5 line-clamp-2 border-t border-ortaq-border pt-2.5")}>
            <span className="font-medium text-ortaq-ink-soft">
              {formatPulseDate(latestNote.date, i18n.language === "tr" ? "tr-TR" : "en-GB")} · </span>{" "}
            {latestNote.text}
          </p>
        )}

        <span className={cn(typography.bodySm, "mt-auto pt-3 font-medium text-ortaq-trust-muted group-hover:underline")}>
          {t("discovery.companyCard.cta")} →
        </span>
      </div>
    </Link>
  );
}

function MetricCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-ortaq-sm bg-ortaq-bg-alt px-2 py-1.5">
      <dt className={typography.caption}>{label}</dt>
      <dd className={cn(typography.bodySm, "mt-0.5 truncate font-medium text-ortaq-ink")}>{value}</dd>
    </div>
  );
}
