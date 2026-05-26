"use client";

import { useTranslation } from "react-i18next";

const stepKeys = ["1", "2", "3", "4", "5"] as const;

export function ProcessOverviewStep() {
  const { t } = useTranslation();

  return (
    <div>
      <p className="mb-4 text-sm leading-[1.65] text-ortaq-ink-muted">{t("onboarding.steps.process.intro")}</p>
      <ol className="space-y-3">
        {stepKeys.map((key) => (
          <li key={key} className="text-sm leading-[1.6] text-ortaq-ink-muted">
            <span className="font-medium text-ortaq-ink">{t(`process.steps.${key}.title`)}</span>
            <span className="text-ortaq-ink-soft"> · </span>
            {t(`process.steps.${key}.text`)}
          </li>
        ))}
      </ol>
    </div>
  );
}
