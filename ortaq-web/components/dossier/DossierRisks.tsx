"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import type { SimulatedCampaign } from "@/lib/campaigns/types";
import { DossierSection } from "@/components/dossier/DossierSection";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

const frictionCategoryKeys = {
  supply: "supply",
  capacity: "capacity",
  workforce: "workforce",
  export: "export",
  equipment: "equipment",
} as const;

type DossierRisksProps = {
  campaign: SimulatedCampaign;
};

export function DossierRisks({ campaign: c }: DossierRisksProps) {
  const { t } = useTranslation();

  return (
    <DossierSection
      id="risks"
      label={t("dossier.risks.label")}
      title={t("dossier.risks.title")}
      tier="secondary"
      collapsible
    >
      <div className="grid gap-3 lg:grid-cols-2">
        <div>
          <h3 className={typography.h3}>{t("dossier.risks.bottlenecks")}</h3>
          <ul className="mt-2 space-y-2">
            {c.bottlenecks.map((b) => (
              <li key={b.label} className="product-card p-3">
                <p className={cn(typography.bodySm, "font-medium text-ortaq-ink")}>{b.label}</p>
                <p className={cn(typography.bodySm, "mt-1 text-ortaq-ink-muted")}>{b.note}</p>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className={typography.h3}>{t("dossier.risks.friction")}</h3>
          <ul className="mt-2 space-y-2">
            {c.operationalFriction.map((f) => (
              <li key={f.label} className="product-card p-3">
                <div className="flex flex-wrap items-center gap-2">
                  <p className={cn(typography.bodySm, "font-medium text-ortaq-ink")}>{f.label}</p>
                  <span className="rounded-ortaq-sm bg-ortaq-bg-warm px-1.5 py-0.5 text-[0.625rem] font-medium uppercase tracking-wide text-ortaq-ink-soft">
                    {t(`dossier.risks.categories.${frictionCategoryKeys[f.category]}`)}
                  </span>
                </div>
                <p className={cn(typography.bodySm, "mt-1 text-ortaq-ink-muted")}>{f.note}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-4">
        <h3 className={typography.h3}>{t("dossier.risks.profile")}</h3>
        <ul className="mt-2 divide-y divide-ortaq-border rounded-ortaq-md border border-ortaq-border">
          {c.risks.map((r) => (
            <li key={r.title} className="px-3 py-3">
              <p className={cn(typography.bodySm, "font-medium text-ortaq-ink")}>{r.title}</p>
              <p className={cn(typography.bodySm, "mt-1 text-ortaq-ink-muted")}>{r.text}</p>
            </li>
          ))}
        </ul>
      </div>

      <Link href="/riskler" className={cn(typography.bodySm, typography.link, "mt-3 inline-block")}>
        {t("dossier.risks.generalLink")} →
      </Link>
    </DossierSection>
  );
}
