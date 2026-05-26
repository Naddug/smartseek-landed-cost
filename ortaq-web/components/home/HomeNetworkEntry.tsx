"use client";

import { useTranslation } from "react-i18next";
import { ImmersiveImage } from "@/components/media/ImmersiveImage";
import { EconomicTrace } from "@/components/operations/EconomicTrace";
import { TraceField } from "@/components/operations/TraceField";
import { FadeIn } from "@/components/ui/FadeIn";
import { LayerReveal } from "@/components/ui/LayerReveal";
import { getLayerTraces } from "@/lib/operations/traces";
import { media } from "@/lib/media";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

const glimpses = [
  { key: "production", mediaKey: "cncWorkshop" as const, offset: "lg:ml-[6%]" },
  { key: "export", mediaKey: "logisticsDock" as const, offset: "lg:mr-[4%] lg:-mt-24" },
] as const;

export function HomeNetworkEntry() {
  const { t } = useTranslation();
  const networkTraces = getLayerTraces("network");
  const overlayTrace = networkTraces[0];

  return (
    <section id="katman-1" className="bg-ortaq-bg pb-12 sm:pb-20">
      <LayerReveal depth="01" label={t("homeNetwork.layerLabel")} className="pt-10 sm:pt-14">
        <FadeIn className="px-4 sm:px-6 lg:px-8">
          <h2 className={cn("desire-whisper max-w-[16ch] text-ortaq-ink sm:max-w-[20ch]")}>
            {t("homeNetwork.title")}
          </h2>
          <p className={cn(typography.body, "mt-5 max-w-sm text-ortaq-ink-soft sm:max-w-md")}>
            {t("homeNetwork.whisper")}
          </p>
        </FadeIn>
        <TraceField layer="network" variant="margin" className="mt-6" />
      </LayerReveal>

      <div className="relative mt-8">
        <ImmersiveImage
          src={media.exportWarehouse.src}
          alt={t("media.exportWarehouse.alt")}
          focalPoint="62% 48%"
          variant="tall"
          cropIntensity="raw"
          density="heavy"
          priority
          overlay={
            overlayTrace ? (
              <div className="absolute bottom-6 right-4 sm:bottom-10 sm:right-10">
                <EconomicTrace
                  traceKey={overlayTrace.key}
                  date={overlayTrace.date}
                  time={overlayTrace.time}
                  variant="overlay"
                  align="right"
                />
              </div>
            ) : null
          }
        />
      </div>

      <div className="relative space-y-0">
        {glimpses.map(({ key, mediaKey, offset }, i) => {
          const m = media[mediaKey];
          return (
            <LayerReveal key={key} depth={`01.${i + 1}`} overlap={i > 0}>
              <FadeIn delay={i * 100}>
                <div className={cn("relative", offset)}>
                  <ImmersiveImage
                    src={m.src}
                    alt={t(`media.${mediaKey}.alt`)}
                    caption={t(`homeNetwork.glimpses.${key}`)}
                    focalPoint={i === 0 ? "38% 42%" : "55% 60%"}
                    variant={i === 0 ? "bleed" : "texture"}
                    cropIntensity="raw"
                    density="heavy"
                    parallax={i === 1}
                    className={cn(i === 0 && "mx-2 sm:mx-6 lg:mx-12", i === 1 && "skew-edge")}
                  />
                </div>
              </FadeIn>
            </LayerReveal>
          );
        })}
      </div>
    </section>
  );
}
