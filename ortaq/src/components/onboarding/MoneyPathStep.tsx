"use client";

import { useTranslation } from "react-i18next";
import { ReassuranceNote } from "@ortaq/components/onboarding/ReassuranceNote";

const phaseKeys = ["1", "2", "3", "4"] as const;

/** "Paranız nerede?" — plain-language money path. No diagrams, no animation. */
export function MoneyPathStep() {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <p className="text-sm leading-[1.65] text-ortaq-ink-muted">{t("onboarding.steps.money.intro")}</p>
      <ol className="divide-y divide-ortaq-border border-y border-ortaq-border">
        {phaseKeys.map((key) => (
          <li key={key} className="py-4 first:pt-0 last:pb-0">
            <p className="text-xs text-ortaq-ink-soft">{t(`onboarding.steps.money.phases.${key}.title`)}</p>
            <p className="mt-1 text-sm leading-[1.6] text-ortaq-ink">{t(`onboarding.steps.money.phases.${key}.text`)}</p>
          </li>
        ))}
      </ol>
      <ReassuranceNote>{t("onboarding.steps.money.note")}</ReassuranceNote>
    </div>
  );
}
