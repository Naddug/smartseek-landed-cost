"use client";

import Image from "next/image";
import { useTranslation } from "react-i18next";
import type { SimulatedCampaign } from "@/lib/campaigns/types";
import { DossierSection } from "@/components/dossier/DossierSection";
import { media } from "@/lib/media";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

type DossierFacilityProps = {
  campaign: SimulatedCampaign;
};

export function DossierFacility({ campaign: c }: DossierFacilityProps) {
  const { t } = useTranslation();
  const facilityArea = c.economics.find((e) => e.label.includes("Kapalı") || e.label.includes("area"));

  return (
    <DossierSection
      id="facility"
      label={t("dossier.facility.label")}
      title={t("dossier.facility.title")}
    >
      <div className="grid gap-3 lg:grid-cols-[1fr_11rem]">
        <div className="overflow-hidden rounded-ortaq-md border border-ortaq-border">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-ortaq-border bg-ortaq-bg-alt">
                <th className={cn(typography.caption, "px-3 py-2 font-medium")}>{t("dossier.facility.zone")}</th>
                <th className={cn(typography.caption, "px-3 py-2 font-medium")}>{t("dossier.facility.observation")}</th>
              </tr>
            </thead>
            <tbody>
              {c.facilityNotes.map((zone) => (
                <tr key={zone.zone} className="border-b border-ortaq-border last:border-0">
                  <td className={cn(typography.bodySm, "whitespace-nowrap px-3 py-2.5 font-medium text-ortaq-ink")}>
                    {zone.zone}
                  </td>
                  <td className={cn(typography.bodySm, "px-3 py-2.5 text-ortaq-ink-muted")}>{zone.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="space-y-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-ortaq-md border border-ortaq-border">
            <Image
              src={media.factoryDetail.src}
              alt={t("media.factoryDetail.alt")}
              fill
              className="object-cover"
              sizes="176px"
            />
          </div>
          {facilityArea && (
            <p className={cn(typography.caption, "text-center")}>
              {facilityArea.label}: {facilityArea.value}
            </p>
          )}
        </div>
      </div>
    </DossierSection>
  );
}
