"use client";

import { useTranslation } from "react-i18next";
import { LandingSection } from "@/components/landing/LandingSection";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

const instrumentKeys = ["revenue", "equity"] as const;

export function HomepageForInvestors() {
  const { t } = useTranslation();

  return (
    <LandingSection
      id="yatirimcilar"
      ariaLabel={t("homeLanding.investors.aria")}
      label={t("homeLanding.investors.label")}
      title={t("homeLanding.investors.title")}
      lead={t("homeLanding.investors.lead")}
      surface="surface"
    >
      <p className={cn(typography.body, "max-w-3xl")}>{t("homeLanding.investors.mechanism")}</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {instrumentKeys.map((key) => (
          <div key={key} className="product-card p-5">
            <h3 className={typography.h3}>{t(`homeLanding.investors.instruments.${key}.title`)}</h3>
            <p className={cn(typography.bodySm, "mt-2")}>{t(`homeLanding.investors.instruments.${key}.body`)}</p>
          </div>
        ))}
      </div>

      <p className={cn(typography.bodySm, "mt-6 max-w-3xl font-medium text-ortaq-ink")}>
        {t("homeLanding.investors.riskReduction")}
      </p>
      <p className={cn(typography.caption, "mt-3 max-w-3xl")}>{t("homeLanding.investors.disclaimer")}</p>
    </LandingSection>
  );
}
