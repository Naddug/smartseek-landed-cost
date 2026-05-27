"use client";

import { useTranslation } from "react-i18next";
import { Container } from "@/components/ui/Section";
import { FrameImage } from "@/components/media/FrameImage";
import { media } from "@/lib/media";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

const pointKeys = ["1", "2", "3"] as const;

/**
 * Institutional market-thesis layer.
 * Text-led, compact, no dashboards — establishes structural inevitability.
 */
export function HomepageMarketLayer() {
  const { t, i18n } = useTranslation();

  return (
    <section className="border-b border-ortaq-border bg-ortaq-bg" aria-label={t("homeProduct.marketLayer.aria")}>
      <Container wide className="py-4 sm:py-5">
        <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr] lg:items-start lg:gap-8">
          <div className="min-w-0">
            <p className={typography.label}>{t("homeProduct.marketLayer.label")}</p>
            <h2 className={cn(typography.h2, "mt-1 max-w-3xl")}>{t("homeProduct.marketLayer.title")}</h2>
            <p className={cn(typography.bodySm, "mt-1.5 max-w-3xl text-ortaq-ink-muted")}>
              {t("homeProduct.marketLayer.lead")}
            </p>

            <ul className="mt-3 max-w-3xl space-y-2">
              {pointKeys.map((key) => (
                <li key={key} className="flex gap-2">
                  <span className={cn(typography.caption, "mt-[0.125rem] text-ortaq-ink-soft")} aria-hidden>
                    —
                  </span>
                  <p className={cn(typography.bodySm, "text-ortaq-ink-muted")}>
                    {t(`homeProduct.marketLayer.points.${key}`)}
                  </p>
                </li>
              ))}
            </ul>

            <p className={cn(typography.caption, "mt-3 text-ortaq-ink-soft")}>
              {t("homeProduct.marketLayer.footnote")}
            </p>
          </div>

          <div className="min-w-0 lg:sticky lg:top-24">
            <FrameImage
              src={media.warehouse.src}
              alt={i18n.language === "tr" ? media.warehouse.altTr : media.warehouse.altEn}
              focalPoint={media.warehouse.focalPoint}
              sizes="(max-width: 1024px) 40vw, 360px"
              aspectClassName="aspect-[3/4] max-h-[min(40vh,360px)]"
              caption={t("homeProduct.marketLayer.visualCaption")}
            />
          </div>
        </div>
      </Container>
    </section>
  );
}

