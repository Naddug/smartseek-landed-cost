"use client";

import { useTranslation } from "react-i18next";
import type { SimulatedCampaign } from "@/lib/campaigns/types";
import { DossierSection } from "@/components/dossier/DossierSection";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

type DossierProductionProps = {
  campaign: SimulatedCampaign;
};

export function DossierProduction({ campaign: c }: DossierProductionProps) {
  const { t } = useTranslation();

  return (
    <DossierSection
      id="production"
      label={t("dossier.production.label")}
      title={t("dossier.production.title")}
    >
      <p className={cn(typography.bodySm, "max-w-prose")}>{c.story.production}</p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {c.operations.processes.map((step, i) => (
          <span key={step} className="inline-flex items-center gap-1.5">
            <span className="rounded-ortaq-sm border border-ortaq-border bg-ortaq-surface px-2 py-1 text-[0.8125rem] text-ortaq-ink">
              {step}
            </span>
            {i < c.operations.processes.length - 1 && (
              <span className="text-ortaq-ink-soft" aria-hidden>
                →
              </span>
            )}
          </span>
        ))}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="product-card p-3.5">
          <h3 className={typography.h3}>{t("dossier.production.materials")}</h3>
          <ul className="mt-2 space-y-1">
            {c.operations.materials.map((m) => (
              <li key={m} className={typography.bodySm}>
                {m}
              </li>
            ))}
          </ul>
        </div>
        <div className="product-card p-3.5">
          <h3 className={typography.h3}>{t("dossier.production.shifts")}</h3>
          <p className={cn(typography.bodySm, "mt-2")}>{c.operations.shifts}</p>
          <p className={cn(typography.caption, "mt-2 text-ortaq-ink-soft")}>{c.story.origin}</p>
        </div>
      </div>
    </DossierSection>
  );
}
