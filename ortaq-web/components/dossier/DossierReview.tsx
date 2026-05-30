"use client";

import { useTranslation } from "react-i18next";
import type { SimulatedCampaign } from "@/lib/campaigns/types";
import { DossierSection } from "@/components/dossier/DossierSection";
import { formatPulseDate } from "@/lib/operations/pulse";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

/**
 * Review timeline + company history + activity log.
 * The verification-layers grid that used to live here moved into DossierLead
 * (it was duplicated across this and DossierDocuments). Single source of truth now.
 */

type DossierReviewProps = {
  campaign: SimulatedCampaign;
};

export function DossierReview({ campaign: c }: DossierReviewProps) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === "tr" ? "tr-TR" : "en-GB";

  return (
    <DossierSection
      id="review"
      label={t("dossier.review.label")}
      title={t("dossier.review.title")}
      tier="secondary"
      collapsible
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <h3 className={typography.h3}>{t("dossier.review.timeline")}</h3>
          <ol className="mt-2 space-y-0 divide-y divide-ortaq-border rounded-ortaq-md border border-ortaq-border bg-ortaq-surface">
            {c.process.map((step) => (
              <li
                key={step.label}
                className={cn(
                  "flex items-start justify-between gap-3 px-3 py-2.5",
                  step.status === "active" && "bg-ortaq-trust-soft/40",
                )}
              >
                <div className="min-w-0">
                  <p className={cn(typography.bodySm, step.status === "active" && "font-medium text-ortaq-ink")}>
                    {step.label}
                  </p>
                  <p className={cn(typography.caption, "mt-0.5")}>
                    {step.status === "done" && step.date && formatPulseDate(step.date, locale)}
                    {step.status === "active" && t("dossier.review.inProgress")}
                    {step.status === "pending" && t("dossier.review.pending")}
                  </p>
                </div>
                <StepStatus status={step.status} />
              </li>
            ))}
          </ol>
        </div>

        <div>
          <h3 className={typography.h3}>{t("dossier.review.companyHistory")}</h3>
          <ol className="mt-2 space-y-0 divide-y divide-ortaq-border rounded-ortaq-md border border-ortaq-border bg-ortaq-surface">
            {c.timeline.map((ev) => (
              <li key={ev.year} className="grid grid-cols-[3rem_1fr] gap-2 px-3 py-2">
                <span className={cn(typography.caption, "tabular-nums font-medium")}>{ev.year}</span>
                <span className={typography.bodySm}>{ev.event}</span>
              </li>
            ))}
          </ol>

          <h3 className={cn(typography.h3, "mt-4")}>{t("dossier.review.activityLog")}</h3>
          <ul className="mt-2 space-y-1.5 rounded-ortaq-md border border-ortaq-border bg-ortaq-surface p-3">
            {c.operationalUpdates.map((u) => (
              <li key={`${u.date}-${u.time}`} className={typography.bodySm}>
                <span className={cn(typography.caption, "tabular-nums text-ortaq-ink-soft")}>
                  {u.date.slice(5).replace("-", ".")} {u.time}
                </span>
                {"-"}
                {u.text}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </DossierSection>
  );
}

function StepStatus({ status }: { status: "done" | "active" | "pending" }) {
  const { t } = useTranslation();
  const styles = {
    done: "bg-ortaq-trust-soft text-ortaq-trust",
    active: "bg-ortaq-status-soft text-ortaq-status",
    pending: "bg-ortaq-bg-alt text-ortaq-ink-soft",
  };
  const keys = { done: "done", active: "active", pending: "pending" } as const;

  return (
    <span
      className={cn(
        "shrink-0 rounded-ortaq-sm px-1.5 py-0.5 text-[0.625rem] font-medium uppercase tracking-wide",
        styles[status],
      )}
    >
      {t(`dossier.review.stepStatus.${keys[status]}`)}
    </span>
  );
}
