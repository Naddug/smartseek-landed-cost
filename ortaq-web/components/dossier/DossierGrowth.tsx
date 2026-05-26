"use client";

import { useTranslation } from "react-i18next";
import type { SimulatedCampaign } from "@/lib/campaigns/types";
import { DossierSection } from "@/components/dossier/DossierSection";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

function formatTry(n: number): string {
  return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 }).format(n);
}

type DossierGrowthProps = {
  campaign: SimulatedCampaign;
};

export function DossierGrowth({ campaign: c }: DossierGrowthProps) {
  const { t } = useTranslation();

  return (
    <DossierSection
      id="growth"
      label={t("dossier.growth.label")}
      title={t("dossier.growth.title")}
      tier="secondary"
      collapsible
    >
      <p className={cn(typography.bodySm, "max-w-prose")}>{c.funding.purpose}</p>

      <div className="mt-3 overflow-hidden rounded-ortaq-md border border-ortaq-border">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-ortaq-border bg-ortaq-bg-alt">
              <th className={cn(typography.caption, "px-3 py-2 font-medium")}>{t("dossier.growth.line")}</th>
              <th className={cn(typography.caption, "px-3 py-2 font-medium text-right")}>
                {t("dossier.growth.amount")}
              </th>
            </tr>
          </thead>
          <tbody>
            {c.funding.lines.map((line) => (
              <tr key={line.label} className="border-b border-ortaq-border last:border-0">
                <td className={cn(typography.bodySm, "px-3 py-2.5")}>{line.label}</td>
                <td className={cn(typography.bodySm, "whitespace-nowrap px-3 py-2.5 text-right tabular-nums")}>
                  {formatTry(line.amountTry)} · %{line.percent}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-ortaq-bg-alt">
              <td className={cn(typography.bodySm, "px-3 py-2.5 font-medium")}>{t("dossier.growth.total")}</td>
              <td className={cn(typography.bodySm, "px-3 py-2.5 text-right font-medium tabular-nums")}>
                {formatTry(c.funding.targetTry)}
                <span className={cn(typography.caption, "ml-1 font-normal")}>({t("dossier.growth.simulated")})</span>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <blockquote className="mt-3 border-l-2 border-ortaq-border-strong pl-3">
        <p className={cn(typography.bodySm, "text-ortaq-ink-muted")}>{c.founder.note}</p>
        <footer className={cn(typography.caption, "mt-1.5")}>
          {c.founder.name} · {c.founder.role}
        </footer>
      </blockquote>
    </DossierSection>
  );
}
