"use client";

import { useTranslation } from "react-i18next";
import { LandingSection } from "@/components/landing/LandingSection";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

const pointKeys = ["1", "2", "3"] as const;

export function HomepageProblem() {
  const { t } = useTranslation();

  return (
    <LandingSection
      id="problem"
      ariaLabel={t("homeLanding.problem.aria")}
      label={t("homeLanding.problem.label")}
      title={t("homeLanding.problem.title")}
      lead={t("homeLanding.problem.lead")}
      surface="alt"
    >
      <ul className="grid gap-3 sm:grid-cols-3">
        {pointKeys.map((key) => (
          <li key={key} className="product-card p-4 sm:p-5">
            <p className={cn(typography.h3, "text-ortaq-ink")}>{t(`homeLanding.problem.points.${key}.title`)}</p>
            <p className={cn(typography.bodySm, "mt-2")}>{t(`homeLanding.problem.points.${key}.body`)}</p>
          </li>
        ))}
      </ul>
    </LandingSection>
  );
}
