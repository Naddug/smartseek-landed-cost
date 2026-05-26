"use client";

import { useTranslation } from "react-i18next";
import { ImmersiveImage } from "@/components/media/ImmersiveImage";
import { FadeIn } from "@/components/ui/FadeIn";
import { Container } from "@/components/ui/Section";
import { media } from "@/lib/media";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

const panels = [
  { key: "production", mediaKey: "cncWorkshop" as const },
  { key: "export", mediaKey: "logisticsDock" as const },
  { key: "people", mediaKey: "machineOperator" as const },
] as const;

/** Step 2 — economic reality through documentary imagery */
export function HomeEconomicReality() {
  const { t } = useTranslation();

  return (
    <section id="gercek-ekonomi" className="bg-ortaq-bg">
      <Container wide className="py-14 sm:py-20 lg:py-24">
        <FadeIn>
          <p className={typography.kicker}>{t("homeReality.label")}</p>
          <h2 className={cn(typography.editorial, "mt-4 max-w-[18ch] sm:max-w-[22ch]")}>
            {t("homeReality.title")}
          </h2>
          <p className={cn(typography.prose, "mt-6 max-w-prose editorial-rhythm")}>
            {t("homeReality.lead")}
          </p>
        </FadeIn>
      </Container>

      <ImmersiveImage
        src={media.exportWarehouse.src}
        alt={t("media.exportWarehouse.alt")}
        credit={t("media.credit", { source: media.exportWarehouse.credit })}
        caption={t("homeReality.heroCaption")}
        focalPoint={media.exportWarehouse.focalPoint}
        variant="tall"
        priority
      />

      <Container wide className="py-14 sm:py-20">
        <div className="space-y-16 sm:space-y-24 lg:space-y-28">
          {panels.map(({ key, mediaKey }, i) => {
            const m = media[mediaKey];
            return (
              <FadeIn key={key} delay={i * 80}>
                <div
                  className={cn(
                    "grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-x-12",
                    i % 2 === 1 && "lg:[&>div:first-child]:order-2",
                  )}
                >
                  <div className="lg:col-span-5">
                    <p className={typography.kicker}>{t(`homeReality.panels.${key}.label`)}</p>
                    <h3 className={cn(typography.h2, "mt-3")}>
                      {t(`homeReality.panels.${key}.title`)}
                    </h3>
                    <p className={cn(typography.prose, "mt-5 max-w-prose editorial-rhythm")}>
                      {t(`homeReality.panels.${key}.text`)}
                    </p>
                  </div>
                  <div className="lg:col-span-7">
                    <ImmersiveImage
                      src={m.src}
                      alt={t(`media.${mediaKey}.alt`)}
                      credit={t("media.credit", { source: m.credit })}
                      focalPoint={m.focalPoint}
                      variant="contained"
                      parallax={false}
                      className="rounded-none"
                    />
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
