"use client";

import { useTranslation } from "react-i18next";
import { typography } from "@/design/typography";

const phaseKeys = ["1", "2", "3"] as const;

export function MoneyPathStep() {
  const { t } = useTranslation();

  return (
    <ol className="space-y-0 border-y border-ortaq-border">
      {phaseKeys.map((key) => (
        <li key={key} className="border-b border-ortaq-border py-4 last:border-b-0">
          <p className={typography.caption}>{t(`onboarding.steps.money.phases.${key}.title`)}</p>
          <p className={`${typography.body} mt-1`}>{t(`onboarding.steps.money.phases.${key}.text`)}</p>
        </li>
      ))}
    </ol>
  );
}
