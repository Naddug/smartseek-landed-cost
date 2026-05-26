"use client";

import { useTranslation } from "react-i18next";
import type { SimulatedCampaign } from "@/lib/campaigns/types";
import { DossierSection } from "@/components/dossier/DossierSection";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

type DossierCustomersProps = {
  campaign: SimulatedCampaign;
};

export function DossierCustomers({ campaign: c }: DossierCustomersProps) {
  const { t } = useTranslation();
  const { marketMix } = c;

  return (
    <DossierSection
      id="customers"
      label={t("dossier.customers.label")}
      title={t("dossier.customers.title")}
    >
      <dl className="grid grid-cols-2 gap-1.5 sm:max-w-sm">
        <div className="rounded-ortaq-md border border-ortaq-border bg-ortaq-bg-alt/50 px-3 py-2">
          <dt className={typography.caption}>{t("dossier.customers.domestic")}</dt>
          <dd className={cn(typography.bodySm, "mt-0.5 font-medium text-ortaq-ink")}>
            {marketMix.domesticShare}
          </dd>
        </div>
        <div className="rounded-ortaq-md border border-ortaq-border bg-ortaq-bg-alt/50 px-3 py-2">
          <dt className={typography.caption}>{t("dossier.customers.export")}</dt>
          <dd className={cn(typography.bodySm, "mt-0.5 font-medium text-ortaq-ink")}>{marketMix.exportShare}</dd>
        </div>
      </dl>

      <div className="mt-3 overflow-hidden rounded-ortaq-md border border-ortaq-border">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-ortaq-border bg-ortaq-bg-alt">
              <th className={cn(typography.caption, "px-3 py-2 font-medium")}>{t("dossier.customers.segment")}</th>
              <th className={cn(typography.caption, "px-3 py-2 font-medium")}>{t("dossier.customers.share")}</th>
              <th className={cn(typography.caption, "px-3 py-2 font-medium")}>{t("dossier.customers.note")}</th>
            </tr>
          </thead>
          <tbody>
            {marketMix.segments.map((seg) => (
              <tr key={seg.label} className="border-b border-ortaq-border last:border-0">
                <td className={cn(typography.bodySm, "px-3 py-2.5 font-medium text-ortaq-ink")}>{seg.label}</td>
                <td className={cn(typography.bodySm, "whitespace-nowrap px-3 py-2.5 tabular-nums")}>{seg.share}</td>
                <td className={cn(typography.bodySm, "px-3 py-2.5 text-ortaq-ink-muted")}>{seg.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className={cn(typography.caption, "mt-2")}>{t("dossier.customers.disclaimer")}</p>
    </DossierSection>
  );
}
