"use client";

import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { EmptyStateBlock } from "@ortaq/components/onboarding/EmptyStateBlock";
import { TrustCommunicationLayer } from "@ortaq/components/onboarding/TrustCommunicationLayer";
import { ReassuranceNote } from "@ortaq/components/onboarding/ReassuranceNote";

const actionKeys = ["1", "2", "3"] as const;

/** Waiting / not-ready state. No fake redirect, no urgency. */
export function WaitingStep() {
  const { t } = useTranslation();

  return (
    <div className="space-y-5">
      <p className="text-sm leading-[1.65] text-ortaq-ink-muted">{t("onboarding.steps.wait.text")}</p>

      <EmptyStateBlock
        title={t("onboarding.steps.wait.emptyTitle")}
        description={t("onboarding.steps.wait.emptyText")}
      >
        <TrustCommunicationLayer
          status="pending"
          context={t("onboarding.steps.wait.partnerNote")}
        />
      </EmptyStateBlock>

      <ReassuranceNote>{t("onboarding.steps.wait.delay")}</ReassuranceNote>

      <div>
        <p className="text-sm font-medium text-ortaq-ink">{t("onboarding.steps.wait.whatYouCanDo")}</p>
        <ul className="mt-2 space-y-2">
          {actionKeys.map((key) => (
            <li key={key} className="text-sm leading-[1.55] text-ortaq-ink-muted">
              {t(`onboarding.steps.wait.actions.${key}`)}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col gap-2 pt-2 sm:flex-row sm:flex-wrap">
        <Link href="/" className="text-sm text-ortaq-ink underline-offset-2 hover:underline">
          {t("onboarding.navigation.exit")}
        </Link>
        <Link href="/riskler" className="text-sm text-ortaq-ink underline-offset-2 hover:underline">
          {t("onboarding.navigation.readRisks")}
        </Link>
        <a href="mailto:destek@ortaq.biz" className="text-sm text-ortaq-ink-muted underline-offset-2 hover:underline">
          destek@ortaq.biz
        </a>
      </div>
    </div>
  );
}
