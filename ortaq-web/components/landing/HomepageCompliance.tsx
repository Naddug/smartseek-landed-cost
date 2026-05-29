"use client";

import { useTranslation } from "react-i18next";
import { LandingSection } from "@/components/landing/LandingSection";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

const pointKeys = ["1", "2", "3"] as const;

export function HomepageCompliance() {
  const { t } = useTranslation();

  return (
    <LandingSection
      id="uyum"
      ariaLabel={t("homeLanding.compliance.aria")}
      label={t("homeLanding.compliance.label")}
      title={t("homeLanding.compliance.title")}
      lead={t("homeLanding.compliance.lead")}
      surface="default"
    >
      <ul className="max-w-3xl space-y-3">
        {pointKeys.map((key) => (
          <li key={key} className="flex gap-3">
            <span className={cn(typography.caption, "mt-1 text-ortaq-trust")} aria-hidden>
              ✓
            </span>
            <p className={typography.bodySm}>{t(`homeLanding.compliance.points.${key}`)}</p>
          </li>
        ))}
      </ul>
    </LandingSection>
  );
}
