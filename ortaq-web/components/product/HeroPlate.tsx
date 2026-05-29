"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { HeroProductPreview } from "@/components/landing/HeroProductPreview";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Section";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

const bulletKeys = ["1", "2", "3"] as const;

/**
 * HeroPlate — first 15 seconds: what ORTAQ is, who it is for, what to do next.
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
      <Container wide className="relative py-10 sm:py-12 lg:py-14">
        <div className="grid gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-start lg:gap-10">
          <div className="landing-fade-in min-w-0">
            <p className={typography.label}>{t("homeLanding.hero.label")}</p>

            <p className={cn(typography.body, "mt-3 max-w-xl font-medium text-ortaq-ink")}>
              {t("homeLanding.hero.elevator")}
            </p>

            <h1
              className={cn(
                typography.display,
                "mt-4 max-w-[24ch] text-[1.75rem] leading-[1.12] sm:text-[2.125rem] lg:text-[2.375rem]",
              )}
            >
              {t("homeLanding.hero.title")}
            </h1>

            <ul className="mt-5 max-w-xl space-y-2">
              {bulletKeys.map((key) => (
                <li key={key} className="flex gap-2.5">
                  <span className={cn(typography.caption, "mt-0.5 font-semibold text-ortaq-trust")} aria-hidden>
                    —
                  </span>
                  <span className={cn(typography.bodySm, "text-ortaq-ink-muted")}>
                    {t(`homeLanding.hero.bullets.${key}`)}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <Link href="#basvuru">
                <Button variant="primary" size="lg" className="min-w-[200px]">
                  {t("homeLanding.hero.ctaPrimary")}
                </Button>
              </Link>
              <Link href="#ozet">
                <Button variant="secondary" size="lg">
                  {t("homeLanding.hero.ctaSecondary")}
                </Button>
              </Link>
            </div>

            <p
              className={cn(
                typography.caption,
                "mt-5 max-w-xl rounded-ortaq-sm border border-ortaq-border bg-ortaq-bg-alt/80 px-3 py-2.5 text-ortaq-ink-muted",
              )}
            >
              {t("homeLanding.hero.boundary")}
            </p>
          </div>

          <div className="landing-fade-in-delayed min-w-0 lg:sticky lg:top-24">
            <HeroProductPreview />
          </div>
        </div>
      </Container>
    </section>
  );
}
