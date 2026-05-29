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
      surface="surface"
    >
      <ol className="grid gap-4 lg:grid-cols-3">
        {stepKeys.map((key) => (
          <li key={key} className="relative product-card flex flex-col p-5 sm:p-6">
            <span
              className={cn(
                typography.caption,
                "inline-flex h-7 w-7 items-center justify-center rounded-ortaq-sm border border-ortaq-border-strong bg-ortaq-bg font-semibold text-ortaq-ink",
              )}
              aria-hidden
            >
              {key}
            </span>
            <h3 className={cn(typography.h3, "mt-4")}>{t(`homeLanding.how.steps.${key}.title`)}</h3>
            <p className={cn(typography.bodySm, "mt-2 flex-1")}>{t(`homeLanding.how.steps.${key}.body`)}</p>
          </li>
        ))}
      </ol>
    </LandingSection>
  );
}
