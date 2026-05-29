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
      surface="surface"
    >
      <ol className="grid gap-4 md:grid-cols-3">
        {stepKeys.map((key) => (
          <li key={key} className="border-l-2 border-ortaq-trust pl-4">
            <p className={cn(typography.caption, "font-semibold text-ortaq-trust-muted")}>
              {t(`homeLanding.how.steps.${key}.step`)}
            </p>
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
