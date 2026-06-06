"use client";

import { useTranslation } from "react-i18next";
import { cn } from "@/lib/cn";
import { typography } from "@/design/typography";

const STEPS = [
  "loi",
  "sco",
  "fco",
  "spa",
  "inspection",
  "shipment",
  "payment",
] as const;

type Step = (typeof STEPS)[number];

type Props = {
  activeStep?: Step;
  className?: string;
  compact?: boolean;
};

export function TradeWorkflowTimeline({ activeStep = "fco", className, compact = false }: Props) {
  const { t } = useTranslation();

  return (
    <div className={cn("w-full overflow-x-auto", className)}>
      <div className={cn("flex min-w-[36rem] items-start", compact ? "gap-0" : "gap-0")}>
        {STEPS.map((step, i) => {
          const isCompleted = STEPS.indexOf(step) < STEPS.indexOf(activeStep);
          const isActive = step === activeStep;
          const isLast = i === STEPS.length - 1;

          return (
            <div key={step} className="flex flex-1 items-start">
              <div className="flex flex-1 flex-col items-center">
                {/* Step node */}
                <div
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-[0.6875rem] font-semibold transition-colors",
                    compact && "h-6 w-6 text-[0.625rem]",
                    isCompleted &&
                      "border-ortaq-trust bg-ortaq-trust text-ortaq-cream",
                    isActive &&
                      "border-ortaq-trust bg-ortaq-trust text-ortaq-cream shadow-[0_0_0_4px_rgb(30_77_61/0.12)]",
                    !isCompleted && !isActive &&
                      "border-ortaq-border-strong bg-ortaq-surface text-ortaq-ink-soft",
                  )}
                >
                  {isCompleted ? (
                    <svg className={cn("h-3.5 w-3.5", compact && "h-3 w-3")} fill="none" viewBox="0 0 12 12" strokeWidth={2.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2 6l3 3 5-5" />
                    </svg>
                  ) : (
                    <span>{i + 1}</span>
                  )}
                </div>

                {/* Step labels */}
                {!compact && (
                  <div className="mt-2 flex flex-col items-center gap-0.5 text-center">
                    <span
                      className={cn(
                        "text-[0.75rem] font-semibold leading-tight",
                        isActive || isCompleted ? "text-ortaq-ink" : "text-ortaq-ink-soft",
                      )}
                    >
                      {t(`trade.workflow.steps.${step}.name`)}
                    </span>
                    <span className={cn(typography.caption, "leading-snug max-w-[6rem] text-center")}>
                      {t(`trade.workflow.steps.${step}.desc`)}
                    </span>
                  </div>
                )}

                {compact && (
                  <span
                    className={cn(
                      "mt-1 text-[0.625rem] font-semibold",
                      isActive || isCompleted ? "text-ortaq-ink" : "text-ortaq-ink-soft",
                    )}
                  >
                    {t(`trade.workflow.steps.${step}.name`)}
                  </span>
                )}
              </div>

              {/* Connector */}
              {!isLast && (
                <div className="relative top-[0.9375rem] h-[2px] w-full flex-1 shrink-0">
                  <div
                    className={cn(
                      "h-full w-full transition-colors",
                      isCompleted || isActive ? "bg-ortaq-trust" : "bg-ortaq-border",
                    )}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
