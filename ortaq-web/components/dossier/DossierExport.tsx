"use client";

import { useTranslation } from "react-i18next";
import type { SimulatedCampaign } from "@/lib/campaigns/types";
import { DossierSection } from "@/components/dossier/DossierSection";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

type DossierExportProps = {
  campaign: SimulatedCampaign;
};

export function DossierExport({ campaign: c }: DossierExportProps) {
  const { t } = useTranslation();

  return (
    <DossierSection
      id="export"
      label={t("dossier.export.label")}
      title={t("dossier.export.title")}
    >
      <div className="flex flex-wrap gap-1.5">
        {c.exportMarkets.map((market) => (
          <span
            key={market}
            className="rounded-ortaq-sm border border-ortaq-border bg-ortaq-surface px-2 py-1 text-[0.8125rem] text-ortaq-ink"
          >
            {market}
          </span>
        ))}
      </div>

      <div className="mt-4 overflow-hidden rounded-ortaq-md border border-ortaq-border">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-ortaq-border bg-ortaq-bg-alt">
              <th className={cn(typography.caption, "px-3 py-2 font-medium")}>{t("dossier.export.year")}</th>
              <th className={cn(typography.caption, "px-3 py-2 font-medium")}>{t("dossier.export.market")}</th>
              <th className={cn(typography.caption, "px-3 py-2 font-medium")}>{t("dossier.export.note")}</th>
            </tr>
          </thead>
          <tbody>
            {c.exportEvolution.map((ev) => (
              <tr key={`${ev.year}-${ev.market}`} className="border-b border-ortaq-border last:border-0">
                <td className={cn(typography.bodySm, "whitespace-nowrap px-3 py-2.5 tabular-nums")}>{ev.year}</td>
                <td className={cn(typography.bodySm, "px-3 py-2.5 font-medium text-ortaq-ink")}>{ev.market}</td>
                <td className={cn(typography.bodySm, "px-3 py-2.5 text-ortaq-ink-muted")}>{ev.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DossierSection>
  );
}
