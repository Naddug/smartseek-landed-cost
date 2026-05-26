"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import type { SimulatedCampaign } from "@/lib/campaigns/types";
import { getCampaignMediaKey, getSectorTag, getSectorTagEn } from "@/lib/product/company-summary";
import { getCampaignTensionLine } from "@/lib/intelligence/tension";
import { VerificationLabel } from "@/components/trust/VerificationLabel";
import { Container } from "@/components/ui/Section";
import { listCampaigns } from "@/lib/campaigns";
import { media } from "@/lib/media";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

export function ProductCompaniesSection() {
  const { t } = useTranslation();
  const campaigns = listCampaigns();

  return (
    <section className="product-section bg-ortaq-bg" id="dosyalar">
      <Container wide>
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4 sm:mb-6">
          <div className="max-w-2xl">
            <p className={typography.label}>{t("homeProduct.companies.label")}</p>
            <h2 className={cn(typography.h1, "mt-1")}>{t("homeProduct.companies.title")}</h2>
            <p className={cn(typography.bodySm, "mt-2")}>{t("homeProduct.companies.lead")}</p>
          </div>
          <span className={cn(typography.meta, "rounded-ortaq-sm border border-ortaq-border bg-ortaq-surface px-2.5 py-1")}>
            {t("homeProduct.companies.count", { count: campaigns.length })}
          </span>
        </div>

        <div className="intel-registry">
          {campaigns.map((c, index) => (
            <RegistryRow key={c.slug} campaign={c} index={index + 1} />
          ))}
        </div>

        <p className={cn(typography.caption, "mt-3")}>{t("homeProduct.companies.footnote")}</p>
        <Link href="/sirketler" className={cn(typography.bodySm, typography.link, "mt-2 inline-block font-medium")}>
          {t("homeProduct.companies.viewAll")} →
        </Link>
      </Container>
    </section>
  );
}

function RegistryRow({ campaign: c, index }: { campaign: SimulatedCampaign; index: number }) {
  const { t, i18n } = useTranslation();
  const mediaKey = getCampaignMediaKey(c.slug, c.sector);
  const sectorTag = i18n.language === "en" ? getSectorTagEn(c) : getSectorTag(c);
  const tension = getCampaignTensionLine(c);
  const scale = c.gateway?.scale ?? `${c.city} · ${c.employees} ${t("homeProduct.companyCard.employeesUnit")}`;

  return (
    <Link href={`/sirket/${c.slug}`} className="group intel-registry-row">
      <span className="intel-index-mark hidden sm:block">{String(index).padStart(2, "0")}</span>
      <span className={cn(typography.metric, "tabular-nums text-ortaq-ink-soft/80 sm:hidden")}>
        {String(index).padStart(2, "0")}
      </span>

      <div className="relative aspect-[5/4] overflow-hidden rounded-ortaq-md border border-ortaq-border-strong bg-ortaq-bg-warm sm:aspect-[4/5] sm:h-[7.25rem] sm:w-[7rem]">
        <Image
          src={media[mediaKey].src}
          alt={t(`media.${mediaKey}.alt`)}
          fill
          sizes="112px"
          className="object-cover"
          style={{ objectPosition: media[mediaKey].focalPoint }}
        />
      </div>

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.05em] text-ortaq-trust">
            {sectorTag}
          </span>
          <span className={typography.meta}>· {scale}</span>
        </div>
        <h3 className={cn(typography.h2, "mt-1.5")}>{c.tradeName}</h3>
        <p className={cn(typography.bodySm, "mt-2 font-medium text-ortaq-ink")}>{tension}</p>
        {c.gateway?.hook && (
          <p className={cn(typography.caption, "mt-1.5 line-clamp-2 text-ortaq-ink-muted")}>{c.gateway.hook}</p>
        )}
      </div>

      <div className="flex flex-row items-center justify-between gap-3 sm:flex-col sm:items-end sm:justify-center sm:gap-2.5">
        <VerificationLabel label={c.verificationLabel} />
        <span className={cn(typography.bodySm, "font-medium text-ortaq-trust-muted group-hover:underline")}>
          {t("homeProduct.companies.enter")} →
        </span>
      </div>
    </Link>
  );
}
