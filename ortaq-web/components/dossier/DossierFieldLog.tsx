"use client";

import { useTranslation } from "react-i18next";
import type { FieldJournalEntry } from "@/lib/campaigns/types";
import type { SimulatedCampaign } from "@/lib/campaigns/types";
import { DossierSection } from "@/components/dossier/DossierSection";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

const typeKeys: Record<FieldJournalEntry["type"], string> = {
  observation: "observation",
  inspection: "inspection",
  capacity: "capacity",
  logistics: "logistics",
  founder: "founder",
};

type DossierFieldLogProps = {
  campaign: SimulatedCampaign;
};

export function DossierFieldLog({ campaign: c }: DossierFieldLogProps) {
  const { t } = useTranslation();

  return (
    <DossierSection
      id="field"
      label={t("dossier.field.label")}
      title={t("dossier.field.title")}
      tier="secondary"
      collapsible
    >
      <div className="space-y-0 divide-y divide-ortaq-border rounded-ortaq-md border border-ortaq-border">
        {c.fieldJournal.map((entry) => (
          <article key={`${entry.date}-${entry.time}-${entry.type}`} className="px-3 py-3 sm:px-4">
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
              <time className={cn(typography.caption, "tabular-nums font-medium text-ortaq-ink")}>
                {entry.date} · {entry.time}
              </time>
              <span className="rounded-ortaq-sm bg-ortaq-trust-soft px-1.5 py-0.5 text-[0.625rem] font-medium uppercase tracking-wide text-ortaq-trust">
                {t(`dossier.field.types.${typeKeys[entry.type]}`)}
              </span>
              <span className={cn(typography.caption, "text-ortaq-ink-soft")}>{entry.author}</span>
            </div>
            <p className={cn(typography.bodySm, "mt-1.5")}>{entry.text}</p>
          </article>
        ))}
      </div>
    </DossierSection>
  );
}
