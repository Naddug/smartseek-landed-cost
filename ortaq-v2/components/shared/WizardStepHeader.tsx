interface WizardStepHeaderProps {
  step: number;
  totalSteps: number;
  title: string;
  description?: string;
}

export function WizardStepHeader({
  step,
  totalSteps,
  title,
  description,
}: WizardStepHeaderProps) {
  return (
    <div className="mb-8">
      <p className="text-xs font-medium uppercase tracking-wider text-ortaq-text-muted">
        Adım {step} / {totalSteps}
      </p>
      <h1 className="mt-2 font-heading text-2xl font-semibold text-ortaq-navy md:text-3xl">
        {title}
      </h1>
      {description && (
        <p className="mt-2 max-w-xl text-base leading-relaxed text-ortaq-text-muted">
          {description}
        </p>
      )}
    </div>
  );
}
