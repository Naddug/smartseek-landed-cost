"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { ImmersiveImage } from "@/components/media/ImmersiveImage";
import { FadeIn } from "@/components/ui/FadeIn";
import { LayerReveal } from "@/components/ui/LayerReveal";
import { media } from "@/lib/media";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

/** Final layer — quiet invitation to enter */
export function HomeAccessInvitation() {
  const { t } = useTranslation();

  return (
    <section className="bg-ortaq-bg">
      <ImmersiveImage
        src={media.warehouse.src}
        alt={t("media.warehouse.alt")}
        focalPoint={media.warehouse.focalPoint}
        variant="full"
        cropIntensity="tight"
        parallax={false}
      />

      <LayerReveal depth="06" overlap className="relative z-10">
        <FadeIn>
          <div className="layer-overlap mx-4 max-w-lg bg-ortaq-bg px-6 py-12 sm:mx-8 sm:px-10 sm:py-14 lg:mx-auto lg:ml-16">
            <p className={typography.kicker}>{t("homeAccess.label")}</p>
            <p className={cn("desire-whisper mt-4 text-ortaq-ink")}>{t("homeAccess.title")}</p>
            <p className={cn(typography.body, "mt-5 text-ortaq-ink-muted")}>{t("homeAccess.text")}</p>

            <div className="mt-10 flex flex-col gap-4">
              <Link
                href="/basla"
                className={cn(
                  typography.bodySm,
                  "inline-flex min-h-11 items-center justify-center bg-ortaq-ink px-6 text-ortaq-cream transition-opacity hover:opacity-90",
                )}
              >
                {t("homeAccess.primary")}
              </Link>
              <Link href="/alan" className={cn(typography.bodySm, typography.link, "min-h-11 inline-flex items-center")}>
                {t("homeAccess.secondary")} →
              </Link>
            </div>

            <p className={cn(typography.caption, "mt-8 text-ortaq-ink-soft")}>{t("homeAccess.note")}</p>
          </div>
        </FadeIn>
      </LayerReveal>
    </section>
  );
}
