"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { FrameImage } from "@/components/media/FrameImage";
import { HeroProductPreview } from "@/components/landing/HeroProductPreview";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Section";
import { media } from "@/lib/media";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

const pathKeys = ["producer", "investor"] as const;

export function HeroPlate() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language === "tr" ? "tr" : "en";
  const heroImg = media.logisticsDock;

  return (
    <section
      className="relative border-b border-ortaq-border bg-ortaq-surface"
      aria-label={t("homeLanding.hero.aria")}
    >
      <Container wide className="relative py-8 sm:py-10 lg:py-12">
        <div className="landing-fade-in">
          <FrameImage
            src={heroImg.src}
            alt={lang === "tr" ? heroImg.altTr : heroImg.altEn}
            focalPoint={heroImg.focalPoint}
            priority
            sizes="100vw"
            aspectClassName="aspect-[2/1] max-h-[min(42vh,420px)] sm:aspect-[21/9]"
            caption={t("homeLanding.hero.imageCaption")}
            className="w-full"
          />
        </div>

        <div className="landing-fade-in mt-8 grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div className="min-w-0">
            <p className={typography.label}>{t("homeLanding.hero.label")}</p>
            <h1
              className={cn(
                typography.display,
                "mt-2 max-w-[20ch] text-[1.75rem] leading-[1.1] sm:text-[2.125rem] lg:text-[2.5rem]",
              )}
            >
              {t("homeLanding.hero.title")}
            </h1>
            <p className={cn(typography.body, "mt-3 max-w-lg text-ortaq-ink")}>
              {t("homeLanding.hero.subtitle")}
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {pathKeys.map((key) => (
                <Link
                  key={key}
                  href={t(`homeLanding.hero.paths.${key}.href`)}
                  className="group rounded-ortaq-md border border-ortaq-border bg-ortaq-bg-alt/50 p-4 transition-colors hover:border-ortaq-trust/35 hover:bg-ortaq-trust-soft/25"
                >
                  <p className={cn(typography.caption, "font-semibold text-ortaq-trust-muted")}>
                    {t(`homeLanding.hero.paths.${key}.label`)}
                  </p>
                  <p className={cn(typography.bodySm, "mt-1 font-medium text-ortaq-ink group-hover:text-ortaq-trust")}>
                    {t(`homeLanding.hero.paths.${key}.title`)}
                  </p>
                  <p className={cn(typography.caption, "mt-1")}>
                    {t(`homeLanding.hero.paths.${key}.body`)}
                  </p>
                </Link>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="#basvuru">
                <Button variant="primary" size="lg">
                  {t("homeLanding.hero.ctaPrimary")}
                </Button>
              </Link>
              <Link href="/sirketler">
                <Button variant="secondary" size="lg">
                  {t("homeLanding.hero.ctaDossiers")}
                </Button>
              </Link>
            </div>

            <p className={cn(typography.caption, "mt-4 max-w-lg")}>{t("homeLanding.hero.trustLine")}</p>
          </div>

          <div className="landing-fade-in-delayed min-w-0">
            <HeroProductPreview />
          </div>
        </div>
      </Container>
    </section>
  );
}
