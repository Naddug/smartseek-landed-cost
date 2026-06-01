"use client";

import { useTranslation } from "react-i18next";
import type { SimulatedCampaign } from "@/lib/campaigns/types";
import { DossierSection } from "@/components/dossier/DossierSection";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

/** Public profiles show operational growth focus only (no raise table). */
const SHOW_FUNDING_TABLE = false;

type DossierGrowthProps = {
  campaign: SimulatedCampaign;
};

export function DossierGrowth({ campaign: c }: DossierGrowthProps) {
  const { t } = useTranslation();

  return (
    <DossierSection
      id="growth"
      label={t("discovery.profile.growthLabel")}
      title={t("discovery.profile.growthTitle")}
      tier="secondary"
      collapsible
    >
      <p className={cn(typography.bodySm, "max-w-prose text-ortaq-ink-muted")}>{c.funding.purpose}</p>
      <p className={cn(typography.caption, "mt-3 text-ortaq-ink-soft")}>{t("discovery.profile.growthNote")}</p>

      {SHOW_FUNDING_TABLE ? (
        <FundingTable campaign={c} />
      ) : null}
    </DossierSection>
  );
}

function FundingTable({ campaign: c }: { campaign: SimulatedCampaign }) {
  const { t } = useTranslation();

  function formatTry(n: number): string {
    return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 }).format(n);
  }

  return (
    <div className="mt-3 overflow-hidden rounded-ortaq-md border border-ortaq-border">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-ortaq-border bg-ortaq-bg-alt">
            <th className={cn(typography.caption, "px-3 py-2 font-medium")}>{t("dossier.growth.line")}</th>
            <th className={cn(typography.caption, "px-3 py-2 text-right font-medium")}>{t("dossier.growth.amount")}</th>
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
      </table>
    </div>
  );
}
