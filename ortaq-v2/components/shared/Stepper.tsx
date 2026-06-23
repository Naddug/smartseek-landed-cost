import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export interface StepperStep {
  id: string;
  label: string;
  description?: string;
}

interface StepperProps {
  steps: StepperStep[];
  currentStep: number;
  orientation?: "horizontal" | "vertical";
  className?: string;
}

export function Stepper({
  steps,
  currentStep,
  orientation = "horizontal",
  className,
}: StepperProps) {
  return (
    <nav
      aria-label="İlerleme"
      className={cn(
        orientation === "horizontal"
          ? "flex items-center gap-2 overflow-x-auto"
          : "flex flex-col gap-0",
        className
      )}
    >
      {steps.map((step, index) => {
        const isComplete = index < currentStep;
        const isCurrent = index === currentStep;

        return (
          <div
            key={step.id}
            className={cn(
              "flex items-center",
              orientation === "horizontal" ? "shrink-0" : "gap-3"
            )}
          >
            <div
              className={cn(
                "flex items-center gap-2",
                orientation === "vertical" && "py-2"
              )}
            >
              <span
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                  isComplete && "bg-ortaq-success text-white",
                  isCurrent && "bg-ortaq-action text-white",
                  !isComplete && !isCurrent && "bg-ortaq-surface-alt text-ortaq-text-muted"
                )}
              >
                {isComplete ? <Check className="h-3.5 w-3.5" /> : index + 1}
              </span>
              <div className={cn(orientation === "horizontal" && "hidden sm:block")}>
                <p
                  className={cn(
                    "text-sm font-medium",
                    isCurrent ? "text-ortaq-navy" : "text-ortaq-text-muted"
                  )}
                >
                  {step.label}
                </p>
                {step.description && orientation === "vertical" && (
                  <p className="text-xs text-ortaq-text-muted">{step.description}</p>
                )}
              </div>
            </div>
            {index < steps.length - 1 && orientation === "horizontal" && (
              <div
                className={cn(
                  "hidden h-px w-8 sm:block",
                  isComplete ? "bg-ortaq-success" : "bg-ortaq-line"
                )}
              />
            )}
          </div>
        );
      })}
    </nav>
  );
}
