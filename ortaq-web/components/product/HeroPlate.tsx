"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { FrameImage } from "@/components/media/FrameImage";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Section";
import { media } from "@/lib/media";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

/**
 * Single clear entry: what ORTAQ is, who it is for, one CTA pair.
 * One editorial image aligned with production/export (not stacked banners).
 */
export function HeroPlate() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language === "tr" ? "tr" : "en";
  const img = media.factoryFloor;

  return (
    <section
      className="border-b border-ortaq-border bg-ortaq-surface"
      aria-label={t("homeLanding.hero.aria")}
    >
      <Container wide className="py-10 sm:py-12 lg:py-14">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-12">
          <div className="min-w-0 order-2 lg:order-1">
            <p className={typography.label}>{t("homeLanding.hero.label")}</p>
            <h1 className={cn(typography.display, "mt-2 max-w-[22ch] text-[1.875rem] sm:text-[2.25rem] lg:text-[2.375rem]")}>
              {t("homeLanding.hero.title")}
            </h1>
            <p className={cn(typography.body, "mt-4 max-w-md")}>{t("homeLanding.hero.subtitle")}</p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link href="#basvuru">
                <Button variant="primary" size="lg" className="min-w-[180px]">
                  {t("homeLanding.hero.ctaPrimary")}
                </Button>
              </Link>
              <Link href="#nasil-calisir" className={cn(typography.bodySm, typography.link, "font-medium")}>
                {t("homeLanding.hero.ctaSecondary")} →
              </Link>
            </div>

            <p className={cn(typography.caption, "mt-6 max-w-md border-t border-ortaq-border pt-4")}>
              {t("homeLanding.hero.disclaimer")}
            </p>
          </div>

          <div className="order-1 min-w-0 lg:order-2">
            <FrameImage
              src={img.src}
              alt={lang === "tr" ? img.altTr : img.altEn}
              focalPoint={img.focalPoint}
              priority
              sizes="(max-width: 1024px) 100vw, 520px"
              aspectClassName="aspect-[4/3]"
              caption={t("homeLanding.hero.imageCaption")}
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
