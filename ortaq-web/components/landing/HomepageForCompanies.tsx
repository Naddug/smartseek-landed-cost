"use client";

import { useTranslation } from "react-i18next";
import { LandingSection } from "@/components/landing/LandingSection";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

const benefitKeys = ["1", "2", "3", "4"] as const;

export function HomepageForCompanies() {
  const { t } = useTranslation();

  return (
    <LandingSection
      id="sirketler"
      ariaLabel={t("homeLanding.companies.aria")}
      label={t("homeLanding.companies.label")}
      title={t("homeLanding.companies.title")}
      lead={t("homeLanding.companies.lead")}
      surface="alt"
    >
      <ul className="grid gap-2 sm:grid-cols-2">
        {benefitKeys.map((key) => (
          <li key={key} className="flex gap-3 rounded-ortaq-md border border-ortaq-border bg-ortaq-surface px-4 py-3.5">
            <span className={cn(typography.caption, "mt-0.5 font-semibold text-ortaq-trust")} aria-hidden>
              ·
            </span>
            <p className={cn(typography.bodySm, "text-ortaq-ink")}>{t(`homeLanding.companies.benefits.${key}`)}</p>
          </li>
        ))}
      </ul>
    </LandingSection>
  );
}
