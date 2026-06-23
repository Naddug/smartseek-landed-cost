import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export interface FlowStepItem {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface FlowStepsProps {
  steps: FlowStepItem[];
  className?: string;
  numbered?: boolean;
  layout?: "grid" | "stack";
}

export function FlowSteps({
  steps,
  className,
  numbered = true,
  layout = "grid",
}: FlowStepsProps) {
  return (
    <ol
      className={cn(
        layout === "grid"
          ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          : "flex flex-col gap-3",
        className
      )}
    >
      {steps.map((step, index) => {
        const Icon = step.icon;
        return (
          <li
            key={step.title}
            className="relative flex flex-col rounded-xl border border-ortaq-line bg-ortaq-surface p-5"
          >
            <div className="mb-4 flex items-center gap-3">
              {numbered && (
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ortaq-navy text-xs font-semibold text-white">
                  {index + 1}
                </span>
              )}
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-ortaq-surface-alt text-ortaq-action">
                <Icon className="h-4 w-4" />
              </div>
            </div>
            <h3 className="font-heading text-sm font-semibold text-ortaq-navy">
              {step.title}
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-ortaq-text-muted">
              {step.description}
            </p>
          </li>
        );
      })}
    </ol>
  );
}
