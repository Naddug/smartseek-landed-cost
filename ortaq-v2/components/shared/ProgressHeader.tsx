import { Stepper, type StepperStep } from "./Stepper";

interface ProgressHeaderProps {
  steps: StepperStep[];
  currentStep: number;
  title?: string;
}

export function ProgressHeader({ steps, currentStep, title }: ProgressHeaderProps) {
  return (
    <div className="border-b border-ortaq-line bg-ortaq-surface">
      <div className="mx-auto max-w-container px-4 py-4 sm:px-6 lg:px-8">
        {title && (
          <p className="mb-3 text-xs font-medium uppercase tracking-wider text-ortaq-text-muted">
            {title}
          </p>
        )}
        <Stepper steps={steps} currentStep={currentStep} />
      </div>
    </div>
  );
}
