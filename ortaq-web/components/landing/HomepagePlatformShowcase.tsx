"use client";

import { useTranslation } from "react-i18next";
import { FrameImage } from "@/components/media/FrameImage";
import { Container } from "@/components/ui/Section";
import { PartnerMatchScreen } from "@/components/landing/screens/PartnerMatchScreen";
import { ExportTrackScreen } from "@/components/landing/screens/ExportTrackScreen";
import { InvestorReturnScreen } from "@/components/landing/screens/InvestorReturnScreen";
import { media } from "@/lib/media";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

export function HomepagePlatformShowcase() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language === "tr" ? "tr" : "en";
  const side = media.machineOperator;

  return (
    <section
      id="platform"
      className="border-b border-ortaq-border bg-ortaq-bg-alt scroll-mt-20"
      aria-label={t("homeLanding.showcase.aria")}
    >
      <Container wide className="py-8 sm:py-10 lg:py-12">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div className="min-w-0 lg:sticky lg:top-24">
            <p className={typography.label}>{t("homeLanding.showcase.label")}</p>
            <h2 className={cn(typography.h1, "mt-2 text-[1.375rem] sm:text-[1.5rem]")}>
              {t("homeLanding.showcase.title")}
            </h2>
            <p className={cn(typography.bodySm, "mt-3")}>{t("homeLanding.showcase.lead")}</p>
            <FrameImage
              src={side.src}
              alt={lang === "tr" ? side.altTr : side.altEn}
              focalPoint={side.focalPoint}
              sizes="(max-width: 1024px) 80vw, 360px"
              aspectClassName="aspect-[3/4] mt-6 max-h-[360px]"
              caption={t("homeLanding.showcase.imageCaption")}
            />
          </div>

          <div className="grid gap-4">
            <PartnerMatchScreen />
            <ExportTrackScreen />
            <InvestorReturnScreen />
          </div>
        </div>
      </Container>
    </section>
  );
}
