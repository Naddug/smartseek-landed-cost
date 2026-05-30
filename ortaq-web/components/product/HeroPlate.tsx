"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Container } from "@/components/ui/Section";
import { media } from "@/lib/media";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

/**
 * HeroPlate, editorial single-surface hero.
 *
 * Breaks the 2-column landing-page template: *   - Photograph is the page, not a "feature image" next to text.
 *   - Single dark ink panel sits over the photograph on desktop;
 *     stacks beneath the photograph on mobile.
 *   - One inline destination link. No button, no second CTA.
 *   - Headline scaled up, magazine-cover weight, not landing-page weight.
 *
 * Copy bound to the approved `homeProduct.heroPlate.*` namespace
 * (Direction-2 final: production-layer gravity, no exclusivity claim, * no cinematic mood, no startup CTA stack).
 */
export function HeroPlate() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language === "tr" ? "tr" : "en";
  const img = media.heroExportPartnership;

  return (
    <section
      className="border-b border-ortaq-border bg-ortaq-surface"
      aria-label={t("homeProduct.heroPlate.aria")}
    >
      <Container wide className="px-0 sm:px-6 lg:px-8">
        <div className="relative">
          {/* Photograph, full-bleed on mobile, framed on desktop */}
          <div className="relative aspect-[4/5] w-full overflow-hidden bg-ortaq-bg-warm sm:aspect-[16/10] sm:rounded-ortaq-lg lg:aspect-[21/9]">
            <Image
              src={img.src}
              alt={lang === "tr" ? img.altTr : img.altEn}
              fill
              priority
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1100px"
              className="object-cover"
              style={{ objectPosition: img.focalPoint }}
            />

            {/* Ink panel, bottom-left on desktop, full-width on mobile */}
            <div className="absolute inset-x-0 bottom-0 lg:inset-x-auto lg:bottom-8 lg:left-8 lg:max-w-[34rem]">
              <div className="bg-ortaq-ink-panel/95 px-5 py-6 backdrop-blur-sm sm:px-7 sm:py-7 lg:rounded-ortaq-md lg:px-8 lg:py-8">
                <p
                  className={cn(
                    typography.label, "text-ortaq-cream/65", )}
                >
                  {t("homeProduct.heroPlate.kicker")}
                </p>
                <h1
                  className={cn(
                    "mt-2 font-semibold leading-[1.08] tracking-[-0.025em] text-ortaq-cream", "text-[1.875rem] sm:text-[2.5rem] lg:text-[2.875rem]", )}
                >
                  {t("homeProduct.heroPlate.headline")}
                </h1>
                <p
                  className={cn(
                    "mt-4 max-w-[28rem] text-[0.9375rem] leading-[1.55] text-ortaq-cream/85", )}
                >
                  {t("homeProduct.heroPlate.body")}
                </p>
                <p
                  className={cn(
                    "mt-2 max-w-[28rem] text-[0.9375rem] leading-[1.55] font-medium text-ortaq-cream", )}
                >
                  {t("homeProduct.heroPlate.closing")}
                </p>
                <Link
                  href="/sirketler"
                  className="mt-5 inline-flex items-center gap-2 text-[0.875rem] font-medium text-ortaq-cream decoration-ortaq-cream/40 underline-offset-4 hover:underline"
                >
                  {t("homeProduct.heroPlate.cta")}
                </Link>
              </div>
            </div>
          </div>

          {/* Caption, beneath photograph, small */}
          <p className={cn(typography.caption, "mt-2 px-4 text-ortaq-ink-soft sm:px-0")}>
            {lang === "tr" ? img.altTr : img.altEn}
          </p>
        </div>
      </Container>
    </section>
  );
}
