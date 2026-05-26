"use client";

import { useTranslation } from "react-i18next";
import type { SimulatedCampaign } from "@/lib/campaigns/types";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

/**
 * 7-stage inspection process visualised as connected dots.
 *
 * Replaces ReviewProgressBar's percentage-filled bar, which read as a
 * crowdfunding "amount raised" affordance. Each dot is a discrete stage:
 *   - done     filled, dark
 *   - active   filled with halo ring
 *   - pending  empty ring, muted
 *
 * Rail connecting the dots is rendered behind them so partial progress
 * reads as "we are here on the line", not "X% funded".
 */

type ReviewStepperProps = {
  campaign: SimulatedCampaign;
  className?: string;
  /** Hide the meta row (X/N + active step name). Default false. */
  compact?: boolean;
};

export function ReviewStepper({ campaign, className, compact = false }: ReviewStepperProps) {
  const { t } = useTranslation();
  const steps = campaign.process;
  const total = steps.length;
  const done = steps.filter((s) => s.status === "done").length;
  const active = steps.find((s) => s.status === "active");

  return (
    <div className={cn("space-y-1.5", className)}>
      {!compact && (
        <div className="flex items-baseline justify-between gap-2">
          <span className={typography.caption}>{t("homeProduct.companyCard.reviewProgress")}</span>
          <span className={cn(typography.caption, "tabular-nums text-ortaq-ink-muted")}>
            {done}/{total}
          </span>
        </div>
      )}

      <div className="relative" aria-label={t("homeProduct.companyCard.reviewProgress")}>
        {/* rail */}
        <div
          aria-hidden
          className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-ortaq-border"
        />
        <ol className="relative flex items-center justify-between">
          {steps.map((step, i) => (
            <li
              key={`${i}-${step.label}`}
              title={step.label}
              className={cn(
                "relative h-2.5 w-2.5 rounded-full border",
                step.status === "done" &&
                  "border-ortaq-trust bg-ortaq-trust",
                step.status === "active" &&
                  "border-ortaq-ink bg-ortaq-surface ring-2 ring-ortaq-ink/15 ring-offset-2 ring-offset-ortaq-surface",
                step.status === "pending" &&
                  "border-ortaq-border-strong bg-ortaq-surface",
              )}
            />
          ))}
        </ol>
      </div>

      {!compact && active && (
        <p className={cn(typography.caption, "truncate text-ortaq-ink-muted")}>
          {t("homeProduct.companyCard.activeStep")}: <span className="text-ortaq-ink">{active.label}</span>
        </p>
      )}
    </div>
  );
}
