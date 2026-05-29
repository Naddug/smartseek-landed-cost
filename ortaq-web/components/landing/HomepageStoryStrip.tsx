"use client";

import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { FrameImage } from "@/components/media/FrameImage";
import { Container } from "@/components/ui/Section";
import { media } from "@/lib/media";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

const stepKeys = ["1", "2", "3"] as const;

const stepMedia = {
  "1": media.factoryFloor,
  "2": media.logisticsDock,
  "3": media.exportWarehouse,
} as const;

export function HomepageStoryStrip() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language === "tr" ? "tr" : "en";

  return (
    <section
      className="border-b border-ortaq-border bg-ortaq-bg"
      aria-label={t("homeLanding.story.aria")}
    >
      <Container wide className="py-8 sm:py-10">
        <p className={typography.label}>{t("homeLanding.story.label")}</p>
        <h2 className={cn(typography.h1, "mt-2 max-w-xl text-[1.375rem] sm:text-[1.5rem]")}>
          {t("homeLanding.story.title")}
        </h2>

        <div className="mt-6 grid gap-4 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-center">
          {stepKeys.map((key, index) => {
            const asset = stepMedia[key];
            return (
              <div key={key} className="contents">
                <article className="min-w-0">
                  <FrameImage
                    src={asset.src}
                    alt={lang === "tr" ? asset.altTr : asset.altEn}
                    focalPoint={asset.focalPoint}
                    sizes="(max-width: 768px) 100vw, 33vw"
                    aspectClassName="aspect-[4/3]"
                  />
                  <p className={cn(typography.caption, "mt-2 font-semibold text-ortaq-trust-muted")}>
                    {t(`homeLanding.story.steps.${key}.step`)}
                  </p>
                  <p className={cn(typography.bodySm, "mt-0.5 font-medium text-ortaq-ink")}>
                    {t(`homeLanding.story.steps.${key}.title`)}
                  </p>
                </article>
                {index < 2 && (
                  <ArrowRight
                    className="mx-auto hidden h-5 w-5 text-ortaq-ink-soft md:block"
                    strokeWidth={1.5}
                    aria-hidden
                  />
                )}
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
