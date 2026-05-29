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
      <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr] lg:items-start lg:gap-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          {pathKeys.map((key) => (
            <div key={key} className="product-card p-5">
              <p className={cn(typography.label, "text-ortaq-trust-muted")}>
                {t(`homeLanding.earnings.paths.${key}.tag`)}
              </p>
              <h3 className={cn(typography.h3, "mt-2 text-base")}>
                {t(`homeLanding.earnings.paths.${key}.title`)}
              </h3>
              <p className={cn(typography.bodySm, "mt-2")}>{t(`homeLanding.earnings.paths.${key}.how`)}</p>
              <p className={cn(typography.caption, "mt-3 font-medium text-ortaq-ink")}>
                {t(`homeLanding.earnings.paths.${key}.earn`)}
              </p>
            </div>
          ))}
        </div>

        <div className="rounded-ortaq-lg border border-ortaq-border-strong bg-ortaq-bg p-5 sm:p-6">
          <p className={typography.label}>{t("homeLanding.earnings.diagram.label")}</p>
          <ol className="mt-4 space-y-0">
            {(["1", "2", "3", "4"] as const).map((key, i) => (
              <li key={key}>
                <div className="flex gap-3">
                  <span
                    className={cn(
                      typography.caption,
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-ortaq-border-strong bg-ortaq-surface font-semibold text-ortaq-ink",
                    )}
                  >
                    {key}
                  </span>
                  <div className="pb-4">
                    <p className={cn(typography.bodySm, "font-medium text-ortaq-ink")}>
                      {t(`homeLanding.earnings.diagram.steps.${key}.title`)}
                    </p>
                    <p className={cn(typography.caption, "mt-0.5")}>
                      {t(`homeLanding.earnings.diagram.steps.${key}.body`)}
                    </p>
                  </div>
                </div>
                {i < 3 && <div className="ml-3.5 h-4 border-l border-dashed border-ortaq-border-strong" aria-hidden />}
              </li>
            ))}
          </ol>
        </div>
      </div>

      <p className={cn(typography.caption, "mt-6 max-w-3xl")}>{t("homeLanding.earnings.disclaimer")}</p>
    </LandingSection>
  );
}
