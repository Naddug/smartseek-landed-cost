"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Container, Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { OnboardingShell } from "@/components/onboarding/OnboardingShell";
import { OnboardingProgress } from "@/components/onboarding/OnboardingProgress";
import { SafetyFramingStep } from "@/components/onboarding/SafetyFramingStep";
import { MoneyPathStep } from "@/components/onboarding/MoneyPathStep";
import { RiskEducationStep } from "@/components/onboarding/RiskEducationStep";
import { WaitingStep } from "@/components/onboarding/WaitingStep";
import { ONBOARDING_STEPS, type OnboardingStepKey, isRiskStep } from "@/lib/onboarding/flow";
import { markOnboardingComplete, setOnboardingStep } from "@/lib/member/storage";
import { typography } from "@/design/typography";
import { useEffect } from "react";

/** @deprecated Legacy onboarding flow — noindex, removed from nav. */
export function OnboardingPageView() {
  const { t } = useTranslation();
  const [stepIndex, setStepIndex] = useState(0);
  const [riskAck, setRiskAck] = useState(false);

  const current = ONBOARDING_STEPS[stepIndex];
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === ONBOARDING_STEPS.length - 1;

  useEffect(() => {
    setOnboardingStep(stepIndex);
    if (isLast) markOnboardingComplete();
  }, [stepIndex, isLast]);

  function goNext() {
    if (isRiskStep(current) && !riskAck) return;
    if (!isLast) setStepIndex((s) => s + 1);
  }

  function goBack() {
    if (stepIndex > 0) setStepIndex((s) => s - 1);
  }

  return (
    <OnboardingShell banner={t("onboarding.reassurance.banner")}>
      <Section spacing="compact">
        <Container narrow>
          <OnboardingProgress
            current={stepIndex + 1}
            total={ONBOARDING_STEPS.length}
            label={t("onboarding.progress")}
          />

          <div className="mt-6 border-t border-ortaq-border pt-6">
            <h1 className={typography.h2}>{t(`onboarding.steps.${current}.title`)}</h1>
            <div className="mt-5">
              <StepContent step={current} riskAck={riskAck} onRiskAckChange={setRiskAck} />
            </div>
          </div>

          {!isLast && (
            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
              {isFirst ? (
                <Link href="/" className="min-h-12 sm:min-h-11">
                  <Button variant="ghost" fullWidth className="sm:w-auto">
                    {t("onboarding.navigation.exit")}
                  </Button>
                </Link>
              ) : (
                <Button
                  variant="ghost"
                  onClick={goBack}
                  fullWidth
                  className="sm:w-auto min-h-12 sm:min-h-11"
                >
                  {t("onboarding.navigation.back")}
                </Button>
              )}
              <Button
                onClick={goNext}
                disabled={isRiskStep(current) && !riskAck}
                fullWidth
                size="lg"
                className="sm:ml-auto sm:w-auto sm:min-w-[10rem] min-h-12"
              >
                {t("onboarding.navigation.next")}
              </Button>
            </div>
          )}
        </Container>
      </Section>
    </OnboardingShell>
  );
}

type StepContentProps = {
  step: OnboardingStepKey;
  riskAck: boolean;
  onRiskAckChange: (value: boolean) => void;
};

function StepContent({ step, riskAck, onRiskAckChange }: StepContentProps) {
  switch (step) {
    case "safety":
      return <SafetyFramingStep />;
    case "money":
      return <MoneyPathStep />;
    case "risk":
      return <RiskEducationStep acknowledged={riskAck} onAckChange={onRiskAckChange} />;
    case "wait":
      return <WaitingStep />;
    default:
      return null;
  }
}
