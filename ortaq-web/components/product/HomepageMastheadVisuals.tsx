"use client";

import { useTranslation } from "react-i18next";
import { FrameImage } from "@/components/media/FrameImage";
import { media } from "@/lib/media";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

const sectorKeys = ["logistics", "manufacturing", "food"] as const;

const sectorMedia = {
  logistics: media.logisticsDock,
  manufacturing: media.cncWorkshop,
  food: media.agrifoodColdchain,
} as const;

export function HomepageMastheadVisuals() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language === "tr" ? "tr" : "en";

  return (
    <div className="flex min-w-0 flex-col gap-2">
      <FrameImage
        src={media.factoryFloor.src}
        alt={lang === "tr" ? media.factoryFloor.altTr : media.factoryFloor.altEn}
        focalPoint={media.factoryFloor.focalPoint}
        priority
        sizes="(max-width: 1024px) 55vw, 420px"
        aspectClassName="aspect-[4/3] max-h-[min(52vh,420px)] sm:aspect-[16/10]"
        caption={t("homeProduct.masthead.visual.heroCaption")}
        className="w-full"
      />

      <div className="grid grid-cols-3 gap-2">
        {sectorKeys.map((key) => {
          const asset = sectorMedia[key];
          return (
            <div key={key} className="min-w-0">
              <FrameImage
                src={asset.src}
                alt={lang === "tr" ? asset.altTr : asset.altEn}
                focalPoint={asset.focalPoint}
                sizes="(max-width: 640px) 33vw, 200px"
                aspectClassName="aspect-[4/3]"
                className="w-full"
              />
              <p className={cn(typography.caption, "mt-1 line-clamp-2 text-ortaq-ink-muted")}>
                {t(`homeProduct.masthead.visual.sectors.${key}`)}
              </p>
            </div>
          );
        })}
      </div>

      <p className={cn(typography.caption, "text-ortaq-ink-soft")}>{t("homeProduct.masthead.visual.evidence")}</p>
    </div>
  );
}
