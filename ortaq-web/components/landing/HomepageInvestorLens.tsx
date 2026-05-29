"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { FrameImage } from "@/components/media/FrameImage";
import { Container } from "@/components/ui/Section";
import { media } from "@/lib/media";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

const pointKeys = ["1", "2", "3"] as const;

export function HomepageInvestorLens() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language === "tr" ? "tr" : "en";
  const img = media.cncWorkshop;

  return (
    <section
      id="yatirim"
      className="border-b border-ortaq-border bg-ortaq-surface scroll-mt-20"
      aria-label={t("homeLanding.investorLens.aria")}
    >
      <Container wide className="py-8 sm:py-10 lg:py-12">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <FrameImage
            src={img.src}
            alt={lang === "tr" ? img.altTr : img.altEn}
            focalPoint={img.focalPoint}
            sizes="(max-width: 1024px) 100vw, 480px"
            aspectClassName="aspect-[4/5] max-h-[min(52vh,480px)]"
            caption={t("homeLanding.investorLens.imageCaption")}
          />

          <div className="min-w-0">
            <p className={typography.label}>{t("homeLanding.investorLens.label")}</p>
            <h2 className={cn(typography.h1, "mt-2 text-[1.375rem] sm:text-[1.625rem]")}>
              {t("homeLanding.investorLens.title")}
            </h2>
            <p className={cn(typography.body, "mt-3 font-medium text-ortaq-ink")}>
              {t("homeLanding.investorLens.object")}
            </p>
            <ul className="mt-4 space-y-2">
              {pointKeys.map((key) => (
                <li key={key} className="flex gap-2">
                  <span className={cn(typography.caption, "text-ortaq-trust")} aria-hidden>
                    ·
                  </span>
                  <span className={typography.bodySm}>{t(`homeLanding.investorLens.points.${key}`)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="rounded-ortaq-sm border border-ortaq-border bg-ortaq-bg-alt px-3 py-1.5 text-[0.75rem] font-medium text-ortaq-ink">
                {t("homeLanding.investorLens.tagRevenue")}
              </span>
              <span className="rounded-ortaq-sm border border-ortaq-border bg-ortaq-bg-alt px-3 py-1.5 text-[0.75rem] font-medium text-ortaq-ink">
                {t("homeLanding.investorLens.tagEquity")}
              </span>
            </div>
            <p className={cn(typography.caption, "mt-4")}>{t("homeLanding.investorLens.disclaimer")}</p>
            <Link
              href="#yatirimcilar"
              className={cn(typography.bodySm, typography.link, "mt-3 inline-block font-medium")}
            >
              {t("homeLanding.investorLens.link")} →
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
