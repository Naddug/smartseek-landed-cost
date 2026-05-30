type OnboardingProgressProps = {
  current: number;
  total: number;
  label: string;
};

/** Text-only progress. No bars, no gamification. */
export function OnboardingProgress({ current, total, label }: OnboardingProgressProps) {
  return (
    <p className="text-xs text-ortaq-ink-soft" aria-live="polite">
      {label.replace("{{current}}", String(current)).replace("{{total}}", String(total))}
    </p>
  );
}
