"use client";

import { useState } from "react";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { Container, Section, SectionHeader } from "@ortaq/components/ui/Section";
import { Button } from "@ortaq/components/ui/Button";
import { OnboardingShell } from "@ortaq/components/onboarding/OnboardingShell";
import { OnboardingProgress } from "@ortaq/components/onboarding/OnboardingProgress";
import { TrustCommunicationLayer } from "@ortaq/components/onboarding/TrustCommunicationLayer";
import { SafetyFramingStep } from "@ortaq/components/onboarding/SafetyFramingStep";
import { AboutStep } from "@ortaq/components/onboarding/AboutStep";
import { MoneyPathStep } from "@ortaq/components/onboarding/MoneyPathStep";
import { RiskEducationStep } from "@ortaq/components/onboarding/RiskEducationStep";
import { ProcessOverviewStep } from "@ortaq/components/onboarding/ProcessOverviewStep";
import { WaitingStep } from "@ortaq/components/onboarding/WaitingStep";
import { ONBOARDING_STEPS, type OnboardingStepKey, isRiskStep } from "@ortaq/lib/onboarding/flow";

export default function OnboardingPage() {
  const { t } = useTranslation();
  const [stepIndex, setStepIndex] = useState(0);
  const [riskAck, setRiskAck] = useState(false);

  const current = ONBOARDING_STEPS[stepIndex];
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === ONBOARDING_STEPS.length - 1;

  function goNext() {
    if (isRiskStep(current) && !riskAck) return;
    if (!isLast) setStepIndex((s) => s + 1);
  }

  function goBack() {
    if (stepIndex > 0) setStepIndex((s) => s - 1);
  }

  return (
    <OnboardingShell
      banner={t("onboarding.reassurance.banner")}
      footerNote={t("onboarding.reassurance.noRush")}
    >
      <Section spacing="hero">
        <Container narrow>
          <div className="mb-4 space-y-3">
            <TrustCommunicationLayer status="illustrative" context={t("onboarding.reassurance.notBinding")} />
            <OnboardingProgress
              current={stepIndex + 1}
              total={ONBOARDING_STEPS.length}
              label={t("onboarding.progress")}
            />
          </div>
          <SectionHeader title={t("onboarding.title")} description={t("onboarding.intro")} />
        </Container>
      </Section>

      <Section tone="alt" spacing="compact">
        <Container narrow>
          <div className="rounded-ortaq-xl border border-ortaq-border bg-white p-5 sm:p-6">
            <p className="text-xs text-ortaq-ink-soft">{t(`onboarding.steps.${current}.label`)}</p>
            <h2 className="mt-2 font-heading text-xl text-ortaq-ink">{t(`onboarding.steps.${current}.title`)}</h2>

            <div className="mt-4">
              <StepContent step={current} riskAck={riskAck} onRiskAckChange={setRiskAck} />
            </div>
          </div>

          {!isLast && (
            <div className="mt-6 flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-between">
              {isFirst ? (
                <Link href="/">
                  <Button variant="secondary" fullWidth className="sm:w-auto sm:min-w-[140px]">
                    {t("onboarding.navigation.exit")}
                  </Button>
                </Link>
              ) : (
                <Button variant="secondary" onClick={goBack} fullWidth className="sm:w-auto sm:min-w-[140px]">
                  {t("onboarding.navigation.back")}
                </Button>
              )}
              <Button
                onClick={goNext}
                disabled={isRiskStep(current) && !riskAck}
                fullWidth
                className="sm:ml-auto sm:w-auto sm:min-w-[140px]"
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
    case "about":
      return <AboutStep />;
    case "money":
      return <MoneyPathStep />;
    case "risk":
      return <RiskEducationStep acknowledged={riskAck} onAckChange={onRiskAckChange} />;
    case "process":
      return <ProcessOverviewStep />;
    case "wait":
      return <WaitingStep />;
    default:
      return null;
  }
}
