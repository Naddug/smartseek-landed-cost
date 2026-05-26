"use client";

import { useTranslation } from "react-i18next";
import { ImmersiveImage } from "@/components/media/ImmersiveImage";
import { TraceField } from "@/components/operations/TraceField";
import { FadeIn } from "@/components/ui/FadeIn";
import { LayerReveal } from "@/components/ui/LayerReveal";
import { media } from "@/lib/media";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

export function HomeAccessWhisper() {
  const { t } = useTranslation();

  return (
    <section className="relative bg-ortaq-dark">
      <ImmersiveImage
        src={media.machineOperator.src}
        alt={t("media.machineOperator.alt")}
        focalPoint="42% 38%"
        variant="full"
        cropIntensity="raw"
        density="heavy"
        parallax
      />

      <TraceField layer="whisper" variant="ghost" className="-mt-6 relative z-10 sm:-mt-8" />

      <LayerReveal depth="02" overlap className="relative z-10">
        <FadeIn>
          <div className="layer-overlap mx-2 max-w-xl bg-ortaq-dark/92 px-5 py-9 backdrop-blur-sm sm:mx-6 sm:px-9 sm:py-11 lg:mx-12">
            <p className={cn(typography.kickerLight)}>{t("homeWhisper.label")}</p>
            <p className={cn("desire-whisper mt-4 text-ortaq-cream")}>{t("homeWhisper.line")}</p>
            <p className={cn(typography.bodySm, "mt-5 text-ortaq-cream/55")}>{t("homeWhisper.sub")}</p>
          </div>
        </FadeIn>
      </LayerReveal>
    </section>
  );
}
