"use client";

import { useTranslation } from "react-i18next";

const pointKeys = ["1", "2", "3"] as const;

export function SafetyFramingStep() {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <p className="text-sm leading-[1.65] text-ortaq-ink-muted">{t("onboarding.steps.safety.text")}</p>
      <ul className="space-y-3">
        {pointKeys.map((key) => (
          <li key={key} className="flex gap-3 text-sm leading-[1.6] text-ortaq-ink">
            <span className="text-ortaq-ink-soft">{key}.</span>
            <span>{t(`onboarding.steps.safety.points.${key}`)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
