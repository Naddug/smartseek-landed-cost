"use client";

import { useTranslation } from "react-i18next";
import { typography } from "@/design/typography";

const pointKeys = ["1", "2", "3"] as const;

export function SafetyFramingStep() {
  const { t } = useTranslation();

  return (
    <div className="space-y-5">
      <p className={typography.body}>{t("onboarding.steps.safety.text")}</p>
      <ul className="space-y-3 border-y border-ortaq-border py-4">
        {pointKeys.map((key) => (
          <li key={key} className={typography.body}>
            {t(`onboarding.steps.safety.points.${key}`)}
          </li>
        ))}
      </ul>
      <p className={typography.bodySm}>{t("onboarding.steps.about.isNot")}</p>
    </div>
  );
}
