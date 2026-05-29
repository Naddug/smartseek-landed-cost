"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { HeroProductPreview } from "@/components/landing/HeroProductPreview";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Section";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

/**
 * HeroPlate — homepage entry surface.
 * Answers in five seconds: what ORTAQ does, and what to do next.
 */
export function HeroPlate() {
  const { t } = useTranslation();

  return (
    <section
      className="relative border-b border-ortaq-border bg-ortaq-surface"
      aria-label={t("homeLanding.hero.aria")}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgb(228_237_233/0.45),transparent_55%)]"
        aria-hidden
      />
      <Container wide className="relative py-10 sm:py-12 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-12">
          <div className="landing-fade-in min-w-0">
            <p className={typography.label}>{t("homeLanding.hero.label")}</p>
            <h1
              className={cn(
                typography.display,
                "mt-3 max-w-[22ch] text-[1.875rem] leading-[1.1] sm:text-[2.25rem] lg:text-[2.625rem]",
              )}
            >
              {t("homeLanding.hero.title")}
            </h1>
            <p className={cn(typography.body, "mt-4 max-w-xl text-[0.9375rem] sm:text-base")}>
              {t("homeLanding.hero.subtitle")}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <Link href="#basvuru">
                <Button variant="primary" size="lg" className="min-w-[200px]">
                  {t("homeLanding.hero.ctaPrimary")}
                </Button>
              </Link>
              <Link href="#nasil-calisir">
                <Button variant="secondary" size="lg">
                  {t("homeLanding.hero.ctaSecondary")}
                </Button>
              </Link>
            </div>

            <p className={cn(typography.caption, "mt-5 max-w-lg text-ortaq-ink-muted")}>
              {t("homeLanding.hero.trustLine")}
            </p>
          </div>

          <div className="landing-fade-in-delayed min-w-0">
            <HeroProductPreview />
          </div>
        </div>
      </Container>
    </section>
  );
}
