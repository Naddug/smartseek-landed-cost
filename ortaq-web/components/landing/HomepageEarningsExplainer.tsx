"use client";

import { useTranslation } from "react-i18next";
import { LandingSection } from "@/components/landing/LandingSection";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

const pathKeys = ["revenue", "equity"] as const;

export function HomepageEarningsExplainer() {
  const { t } = useTranslation();

  return (
    <LandingSection
      id="yatirimcilar"
      ariaLabel={t("homeLanding.earnings.aria")}
      label={t("homeLanding.earnings.label")}
      title={t("homeLanding.earnings.title")}
      lead={t("homeLanding.earnings.lead")}
      surface="surface"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {pathKeys.map((key) => (
          <div key={key} className="product-card p-5">
            <p className={cn(typography.label, "text-ortaq-trust-muted")}>
              {t(`homeLanding.earnings.paths.${key}.tag`)}
            </p>
            <h3 className={cn(typography.h3, "mt-2 text-base")}>{t(`homeLanding.earnings.paths.${key}.title`)}</h3>
            <p className={cn(typography.bodySm, "mt-2")}>{t(`homeLanding.earnings.paths.${key}.how`)}</p>
          </div>
        ))}
      </div>
      <p className={cn(typography.caption, "mt-5 max-w-3xl")}>{t("homeLanding.earnings.disclaimer")}</p>
    </LandingSection>
  );
}
