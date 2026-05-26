"use client";

import { useTranslation } from "react-i18next";
import type { SimulatedCampaign } from "@/lib/campaigns/types";
import { DossierSection } from "@/components/dossier/DossierSection";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

type DossierMachinesProps = {
  campaign: SimulatedCampaign;
};

export function DossierMachines({ campaign: c }: DossierMachinesProps) {
  const { t } = useTranslation();

  return (
    <DossierSection
      id="machines"
      label={t("dossier.machines.label")}
      title={t("dossier.machines.title")}
    >
      <div className="overflow-hidden rounded-ortaq-md border border-ortaq-border">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-ortaq-border bg-ortaq-bg-alt">
              <th className={cn(typography.caption, "px-3 py-2 font-medium")}>{t("dossier.machines.asset")}</th>
              <th className={cn(typography.caption, "hidden px-3 py-2 font-medium sm:table-cell")}>
                {t("dossier.machines.role")}
              </th>
              <th className={cn(typography.caption, "px-3 py-2 font-medium")}>{t("dossier.machines.note")}</th>
            </tr>
          </thead>
          <tbody>
            {c.machines.map((machine) => (
              <tr key={machine.id} className="border-b border-ortaq-border last:border-0">
                <td className="px-3 py-2.5">
                  <p className={cn(typography.bodySm, "font-medium text-ortaq-ink")}>{machine.name}</p>
                  <p className={cn(typography.caption, "mt-0.5 sm:hidden")}>
                    {machine.role} · {machine.year}
                  </p>
                </td>
                <td className={cn(typography.bodySm, "hidden whitespace-nowrap px-3 py-2.5 sm:table-cell")}>
                  {machine.role} · {machine.year}
                </td>
                <td className={cn(typography.bodySm, "px-3 py-2.5 text-ortaq-ink-muted")}>{machine.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DossierSection>
  );
}
