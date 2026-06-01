"use client";

import { useTranslation } from "react-i18next";
import type { SimulatedCampaign } from "@/lib/campaigns/types";
import { DossierSection } from "@/components/dossier/DossierSection";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

type DossierOperationsProps = {
  campaign: SimulatedCampaign;
};

/** Operational priorities and friction — no funding or raise language. */
export function DossierOperations({ campaign: c }: DossierOperationsProps) {
  const { t } = useTranslation();
  const items = [
    ...c.bottlenecks.map((b) => ({ label: b.label, note: b.note })),
    ...c.operationalFriction
      .filter((f) => !c.bottlenecks.some((b) => b.label === f.label))
      .map((f) => ({ label: f.label, note: f.note })),
  ].slice(0, 6);

  if (items.length === 0) return null;

  return (
    <DossierSection
      id="operations"
      label={t("dossier.operations.label")}
      title={t("dossier.operations.title")}
      tier="secondary"
      collapsible
    >
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item.label} className="border border-ortaq-border bg-ortaq-bg-alt px-3 py-2.5">
            <p className={cn(typography.caption, "font-medium text-ortaq-ink-soft")}>{item.label}</p>
            <p className={cn(typography.bodySm, "mt-1 leading-relaxed text-ortaq-ink-muted")}>{item.note}</p>
          </li>
        ))}
      </ul>
      <p className={cn(typography.caption, "mt-3 text-ortaq-ink-soft")}>{t("dossier.operations.footnote")}</p>
    </DossierSection>
  );
}
