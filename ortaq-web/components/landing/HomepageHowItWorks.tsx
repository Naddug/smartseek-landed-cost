"use client";

import { useTranslation } from "react-i18next";
import { LandingSection } from "@/components/landing/LandingSection";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

const stepKeys = ["1", "2", "3"] as const;

export function HomepageHowItWorks() {
  const { t } = useTranslation();

  return (
    <LandingSection
      id="nasil-calisir"
      ariaLabel={t("homeLanding.how.aria")}
      label={t("homeLanding.how.label")}
      title={t("homeLanding.how.title")}
      lead={t("homeLanding.how.lead")}
      surface="default"
    >
      <ol className="grid gap-3 sm:grid-cols-3">
        {stepKeys.map((key) => (
          <li key={key} className="rounded-ortaq-md border border-ortaq-border bg-ortaq-surface px-4 py-4">
            <span className={cn(typography.caption, "font-semibold text-ortaq-trust")}>
              {t(`homeLanding.how.steps.${key}.step`)}
            </span>
            <p className={cn(typography.bodySm, "mt-2 font-medium text-ortaq-ink")}>
              {t(`homeLanding.how.steps.${key}.title`)}
            </p>
            <p className={cn(typography.caption, "mt-1")}>{t(`homeLanding.how.steps.${key}.body`)}</p>
          </li>
        ))}
      </ol>
    </LandingSection>
  );
}
