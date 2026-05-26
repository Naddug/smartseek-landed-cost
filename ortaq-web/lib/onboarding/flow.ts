/** Four steps — no duplicate of homepage process timeline */
export const ONBOARDING_STEPS = ["safety", "money", "risk", "wait"] as const;

export type OnboardingStepKey = (typeof ONBOARDING_STEPS)[number];

export function stepIndex(key: OnboardingStepKey): number {
  return ONBOARDING_STEPS.indexOf(key);
}

export function isRiskStep(key: OnboardingStepKey): boolean {
  return key === "risk";
}
