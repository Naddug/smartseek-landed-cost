"use client";

import { useTranslation } from "react-i18next";
import { LandingSection } from "@/components/landing/LandingSection";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

export function HomepageAiNarrative() {
  const { t } = useTranslation();

  return (
    <LandingSection
      id="yapay-zeka"
      ariaLabel={t("homeLanding.ai.aria")}
      label={t("homeLanding.ai.label")}
      title={t("homeLanding.ai.title")}
      surface="default"
    >
      <blockquote className="max-w-3xl border-l-2 border-ortaq-trust pl-5">
        <p className={cn(typography.body, "text-ortaq-ink")}>{t("homeLanding.ai.body")}</p>
      </blockquote>
      <p className={cn(typography.caption, "mt-4 max-w-2xl")}>{t("homeLanding.ai.footnote")}</p>
    </LandingSection>
  );
}
