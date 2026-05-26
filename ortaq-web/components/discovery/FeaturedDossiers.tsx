"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { Container } from "@/components/ui/Section";
import { DossierPreviewRow } from "@/components/discovery/DossierPreviewRow";
import { listCampaigns } from "@/lib/campaigns";
import { getCampaign } from "@/lib/campaigns";
import { getFeaturedSlug, getRelatedCampaigns } from "@/lib/intelligence/discovery";
import { getCampaignTensionLine } from "@/lib/intelligence/tension";
import { getCampaignMediaKey, getSectorTag, getSectorTagEn } from "@/lib/product/company-summary";
import { VerificationLabel } from "@/components/trust/VerificationLabel";
import { media } from "@/lib/media";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

export function FeaturedDossiers() {
  const { t, i18n } = useTranslation();
  const featuredSlug = getFeaturedSlug();
  const featured = getCampaign(featuredSlug);
  const rest = listCampaigns().filter((c) => c.slug !== featuredSlug);
  const related = featured ? getRelatedCampaigns(featured.slug, 3) : [];

  if (!featured) return null;

  const mediaKey = getCampaignMediaKey(featured.slug, featured.sector);
  const sectorTag = i18n.language === "en" ? getSectorTagEn(featured) : getSectorTag(featured);
  const tension = getCampaignTensionLine(featured);

  return (
    <section id="dosyalar" className="product-section bg-ortaq-bg">
      <Container wide>
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className={typography.label}>{t("homeProduct.discovery.featured.label")}</p>
            <h2 className="mt-1 max-w-[20ch] font-body text-[1.625rem] font-semibold leading-[1.1] tracking-[-0.02em] text-ortaq-ink sm:text-[1.875rem]">
              {t("homeProduct.discovery.featured.title")}
            </h2>
          </div>
          <Link href="/sirketler" className={cn(typography.bodySm, "font-semibold text-ortaq-trust-muted hover:text-ortaq-trust hover:underline")}>
            {t("homeProduct.companies.viewAll")} →
          </Link>
        </div>

        <Link
          href={`/sirket/${featured.slug}`}
          className="discover-spotlight group mb-6 grid overflow-hidden border border-ortaq-border-strong bg-ortaq-surface lg:grid-cols-[1.35fr_1fr]"
        >
          <div className="discover-spotlight-image authority-image-evidence relative min-h-[240px] overflow-hidden sm:min-h-[320px] lg:min-h-[360px]">
            <Image
              src={media[mediaKey].src}
              alt={t(`media.${mediaKey}.alt`)}
              fill
              className="object-cover"
              style={{ objectPosition: "62% 35%" }}
              sizes="(max-width: 1024px) 100vw, 60vw"
            />
          </div>
          <div className="flex flex-col justify-center border-t border-ortaq-border p-6 lg:border-l lg:border-t-0 lg:p-8">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.06em] text-ortaq-trust">{sectorTag}</span>
              <span className={cn(typography.caption, "font-bold uppercase tracking-[0.08em] text-ortaq-accent")}>
                {t("homeProduct.discovery.featured.spotlight")}
              </span>
              <VerificationLabel label={featured.verificationLabel} />
            </div>
            <h3 className="mt-3 font-body text-[1.75rem] font-semibold leading-[1.08] tracking-[-0.025em] text-ortaq-ink sm:text-[2rem]">
              {featured.tradeName}
            </h3>
            <p className={cn(typography.bodySm, "mt-2 text-ortaq-ink-muted")}>
              {featured.city} · {featured.gateway?.scale ?? featured.sector}
            </p>
            <p className={cn(typography.body, "mt-4 text-[0.9375rem] font-medium leading-snug text-ortaq-ink")}>{tension}</p>
            {featured.gateway?.hook && (
              <p className={cn(typography.bodySm, "mt-2 text-ortaq-ink-muted")}>{featured.gateway.hook}</p>
            )}

            {related.length > 0 && (
              <div className="mt-5 border-t border-ortaq-border pt-4">
                <p className={cn(typography.caption, "font-semibold uppercase tracking-wide text-ortaq-ink-soft")}>
                  {t("homeProduct.discovery.featured.related")}
                </p>
                <div className="mt-2 flex flex-col gap-1">
                  {related.map((c) => (
                    <Link
                      key={c.slug}
                      href={`/sirket/${c.slug}`}
                      onClick={(e) => e.stopPropagation()}
                      className={cn(typography.bodySm, "font-medium text-ortaq-trust-muted hover:text-ortaq-trust hover:underline")}
                    >
                      {c.tradeName}
                      <span className="text-ortaq-ink-soft"> · {c.city}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <span className={cn(typography.bodySm, "mt-6 font-semibold text-ortaq-trust group-hover:underline")}>
              {t("homeProduct.companies.enter")} →
            </span>
          </div>
        </Link>

        <div className="authority-registry divide-y divide-ortaq-border border-y border-ortaq-border-strong">
          {rest.map((c, i) => (
            <DossierPreviewRow key={c.slug} campaign={c} index={i + 2} />
          ))}
        </div>
      </Container>
    </section>
  );
}
