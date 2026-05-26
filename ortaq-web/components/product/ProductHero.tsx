"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Section";
import { SignalRegistry } from "@/components/intelligence/SignalRegistry";
import { FrameImage } from "@/components/media/FrameImage";
import { getHomePlatformStats } from "@/lib/intelligence/home-stats";
import { media } from "@/lib/media";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

const trustKeys = ["1", "2", "3", "4"] as const;
const statKeys = ["dossiers", "sectors", "fieldVisits", "reviewLayers"] as const;

export function ProductHero() {
  const { t } = useTranslation();
  const stats = getHomePlatformStats();

  return (
    <section className="border-b border-ortaq-border-strong bg-ortaq-surface">
      <Container wide>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-ortaq-border py-2.5">
          {trustKeys.map((key) => (
            <span key={key} className={cn(typography.caption, "font-medium text-ortaq-ink-muted")}>
              {t(`homeProduct.hero.trust.${key}`)}
            </span>
          ))}
        </div>

        <div className="grid gap-6 py-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-8 lg:py-7">
          <div className="min-w-0">
            <p className={typography.label}>{t("homeProduct.hero.label")}</p>
            <h1 className={cn(typography.display, "mt-1.5 max-w-[18ch] text-[1.875rem] sm:text-[2.125rem] lg:text-[2.375rem]")}>
              {t("homeProduct.hero.title")}
            </h1>
            <p className={cn(typography.body, "mt-4 max-w-xl font-medium text-ortaq-ink")}>
              {t("homeProduct.hero.subtitle")}
            </p>
            <p className={cn(typography.bodySm, "mt-3 max-w-xl")}>{t("homeProduct.hero.tension")}</p>

            <dl className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {statKeys.map((key) => (
                <div key={key} className="rounded-ortaq-md border border-ortaq-border bg-ortaq-bg-alt/60 px-3 py-2.5">
                  <dt className={typography.caption}>{t(`homeProduct.stats.${key}`)}</dt>
                  <dd className={cn(typography.metric, "mt-0.5 text-[1.25rem] sm:text-[1.375rem]")}>
                    {stats[key]}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link href="#dosyalar">
                <Button variant="primary" size="lg" className="min-w-[200px]">
                  {t("homeProduct.hero.ctaPrimary")}
                </Button>
              </Link>
              <Link href="/nasil-calisir" className={cn(typography.bodySm, typography.link, "font-medium")}>
                {t("homeProduct.hero.ctaSecondary")} →
              </Link>
            </div>
            <p className={cn(typography.caption, "mt-3")}>{t("homeProduct.hero.disclaimer")}</p>
          </div>

          <div className="flex min-w-0 flex-col gap-4">
            <FrameImage
              src={media.cncWorkshop.src}
              alt={t("media.cncWorkshop.alt")}
              focalPoint="center 38%"
              priority
              aspectClassName="aspect-[16/10] sm:aspect-[5/3]"
            />
            <SignalRegistry variant="panel" />
          </div>
        </div>
      </Container>
    </section>
  );
}
