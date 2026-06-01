"use client";

import Image from "next/image";
import { useTranslation } from "react-i18next";
import type { SimulatedCampaign } from "@/lib/campaigns/types";
import {
  getCampaignMediaAsset,
  getCampaignMediaAlt,
  getReviewProgress,
  getSectorTag,
  getSectorTagEn,
} from "@/lib/product/company-summary";
import { ReviewStepper } from "@/components/product/ReviewStepper";
import { StatusBadge } from "@/components/trust/StatusBadge";
import { VerificationLabel } from "@/components/trust/VerificationLabel";
import { Container } from "@/components/ui/Section";
import { getOperationalRelevanceLine } from "@/lib/product/operational-relevance";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

type DossierHeaderProps = {
  campaign: SimulatedCampaign;
};

export function DossierHeader({ campaign: c }: DossierHeaderProps) {
  const { t, i18n } = useTranslation();
  const mediaAsset = getCampaignMediaAsset(c.slug, c.sector);
  const { activeStep } = getReviewProgress(c);
  const sectorTag = i18n.language === "en" ? getSectorTagEn(c) : getSectorTag(c);
  const situation = getOperationalRelevanceLine(c);

  return (
    <header className="border-b border-ortaq-border bg-ortaq-surface">
      <Container wide>
        <div className="grid gap-4 py-5 sm:grid-cols-[7rem_1fr] sm:gap-5 sm:py-6 lg:grid-cols-[9rem_1fr_auto] lg:items-start">
          <div className="relative aspect-[4/3] overflow-hidden rounded-ortaq-md border border-ortaq-border sm:aspect-square">
            <Image
              src={mediaAsset.src}
              alt={getCampaignMediaAlt(mediaAsset, i18n.language)}
              fill
              priority
              className="object-cover"
              style={{ objectPosition: mediaAsset.focalPoint }}
              sizes="144px"
            />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-ortaq-sm bg-ortaq-trust-soft px-2 py-0.5 text-[0.6875rem] font-semibold uppercase tracking-wide text-ortaq-trust">
                {sectorTag}
              </span>
              <StatusBadge status="illustrative" />
              <VerificationLabel label={c.verificationLabel} />
              {c.mouStatus && (
                <span
                  className={cn(
                    typography.caption,
                    "rounded-ortaq-sm border border-ortaq-border bg-ortaq-bg-alt px-2 py-0.5 text-ortaq-ink-muted",
                  )}
                >
                  {c.mouStatus}
                </span>
              )}
            </div>
            <p className={cn(typography.label, "mt-2")}>{t("discovery.profile.label")}</p>
            <h1 className={cn(typography.display, "mt-0.5")}>{c.tradeName}</h1>
            <p className={cn(typography.bodySm, "mt-1 text-ortaq-ink-soft")}>{c.legalName}</p>
            <p className={cn(typography.bodySm, "mt-2")}>
              {c.city}, {c.region} · {c.founded} · {c.employees} {t("dossier.header.employees")}
            </p>
            <p className={cn(typography.bodySm, "mt-1 text-ortaq-ink-muted")}>{c.sector}</p>
          </div>

          <div className="sm:col-span-2 lg:col-span-1 lg:min-w-[220px] lg:max-w-[260px]">
            <div className="product-card p-3.5">
              <p className={typography.caption}>{t("dossier.header.reviewStatus")}</p>
              <p className={cn(typography.bodySm, "mt-1 font-medium text-ortaq-ink")}>
                {t(`dossier.access.${c.access.status}`)}
              </p>
              {activeStep && (
                <p className={cn(typography.caption, "mt-1")}>
                  {t("dossier.header.activeStep")}: {activeStep}
                </p>
              )}
              <ReviewStepper campaign={c} compact className="mt-2.5" />
              <p className={cn(typography.caption, "mt-2 text-ortaq-ink-soft")}>
                {t("dossier.header.nextGate")}: {c.access.nextGate}
              </p>
            </div>
          </div>
        </div>

        <div className="intel-header-tension">
          <p className={typography.label}>{t("discovery.profile.whyNow.label")}</p>
          <p className={cn(typography.body, "mt-1 font-medium text-ortaq-ink")}>{situation}</p>
        </div>
      </Container>
    </header>
  );
}
