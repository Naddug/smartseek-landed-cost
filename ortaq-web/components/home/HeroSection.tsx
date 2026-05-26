"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { OperationalTicker } from "@/components/home/OperationalTicker";
import { media } from "@/lib/media";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

export function HeroSection() {
  const { t } = useTranslation();
  const m = media.factoryFloor;

  return (
    <section className="relative min-h-[94dvh] overflow-hidden bg-ortaq-dark sm:min-h-[98dvh]">
      <Image
        src={m.src}
        alt={t("media.factoryFloor.alt")}
        fill
        priority
        sizes="100vw"
        className="object-cover scale-[1.2] contrast-[1.1] saturate-[0.85] brightness-[0.92]"
        style={{ objectPosition: "45% 52%" }}
      />
      <div className="cinematic-gradient absolute inset-0" aria-hidden />
      <div className="access-grain pointer-events-none absolute inset-0 opacity-30" aria-hidden />

      <div className="relative flex min-h-[94dvh] flex-col justify-end sm:min-h-[98dvh]">
        <div className="px-4 pb-6 pt-28 sm:px-6 sm:pb-8 lg:px-10 lg:pb-10">
          <div className="mx-auto w-full max-w-6xl">
            <p className={typography.kickerLight}>{t("hero.kicker")}</p>
            <h1 className={cn(typography.displayLight, "mt-5 max-w-[10ch] sm:max-w-[12ch]")}>
              {t("hero.title")}
            </h1>
            <p className={cn("desire-whisper mt-6 max-w-md text-ortaq-cream/90 sm:max-w-lg")}>
              {t("hero.subtitle")}
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link
                href="#katman-1"
                className={cn(
                  typography.bodySm,
                  "inline-flex min-h-11 items-center justify-center border border-ortaq-cream/70 px-6 text-ortaq-cream transition-colors hover:bg-ortaq-cream hover:text-ortaq-dark sm:justify-start",
                )}
              >
                {t("hero.primaryCta")}
              </Link>
              <Link
                href="/sirket/karat-parca-konya"
                className={cn(typography.bodySm, typography.linkLight, "min-h-11 inline-flex items-center px-1")}
              >
                {t("hero.secondaryCta")} →
              </Link>
            </div>
          </div>
        </div>

        <OperationalTicker variant="light" />

        <div
          className="absolute bottom-20 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 sm:flex motion-reduce:hidden"
          aria-hidden
        >
          <span className={cn(typography.caption, "text-ortaq-cream/30")}>{t("hero.scroll")}</span>
          <span className="block h-8 w-px bg-ortaq-cream/20 scroll-hint" />
        </div>
      </div>
    </section>
  );
}
