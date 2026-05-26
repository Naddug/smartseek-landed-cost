"use client";

import { useTranslation } from "react-i18next";

export function AboutStep() {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <div className="rounded-ortaq-md border border-ortaq-border bg-ortaq-bg px-4 py-3">
        <p className="text-sm leading-[1.65] text-ortaq-ink">{t("onboarding.steps.about.is")}</p>
      </div>
      <div className="rounded-ortaq-md border border-ortaq-border bg-ortaq-bg-alt px-4 py-3">
        <p className="text-sm leading-[1.65] text-ortaq-ink-muted">{t("onboarding.steps.about.isNot")}</p>
      </div>
    </div>
  );
}
