"use client";

import { useTranslation } from "react-i18next";
import { Container } from "@/components/ui/Section";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

const pathKeys = ["1", "2", "3", "4"] as const;

/**
 * Capital-structure clarity, ownership and possible exit pathways.
 * Sits below mechanism, above dossier index. Text-led, subordinate to masthead.
 */
export function HomepageRealization() {
  const { t } = useTranslation();

  return (
    <section
      className="border-b border-ortaq-border bg-ortaq-surface"
      aria-label={t("homeProduct.realization.aria")}
    >
      <Container wide className="py-4 sm:py-5">
        <p className={typography.label}>{t("homeProduct.realization.label")}</p>
        <h2 className={cn(typography.h2, "mt-1 max-w-2xl")}>{t("homeProduct.realization.title")}</h2>
        <p className={cn(typography.bodySm, "mt-1.5 max-w-3xl text-ortaq-ink-muted")}>
          {t("homeProduct.realization.lead")}
        </p>

        <div className="mt-3 max-w-3xl space-y-2">
          <p className={typography.bodySm}>{t("homeProduct.realization.ownership")}</p>
          <p className={typography.bodySm}>{t("homeProduct.realization.growth")}</p>
        </div>

        <p className={cn(typography.caption, "mt-4 font-medium text-ortaq-ink-muted")}>
          {t("homeProduct.realization.exitLabel")}
        </p>
        <ul className="mt-2 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
          {pathKeys.map((key) => (
            <li key={key} className="min-w-0 border-l border-ortaq-border pl-2.5">
              <p className={cn(typography.caption, "font-medium text-ortaq-ink")}>
                {t(`homeProduct.realization.paths.${key}.title`)}
              </p>
              <p className={cn(typography.caption, "mt-0.5 text-ortaq-ink-muted")}>
                {t(`homeProduct.realization.paths.${key}.body`)}
              </p>
            </li>
          ))}
        </ul>

        <p className={cn(typography.caption, "mt-3 max-w-3xl text-ortaq-ink-soft")}>
          {t("homeProduct.realization.liquidity")}
        </p>

        <div className="mt-4 max-w-3xl border-t border-ortaq-border pt-3">
          <p className={typography.label}>{t("homeProduct.realization.marketWhy.label")}</p>
          <p className={cn(typography.bodySm, "mt-1.5 text-ortaq-ink-muted")}>
            {t("homeProduct.realization.marketWhy.body")}
          </p>
        </div>

        <p className={cn(typography.caption, "mt-3 text-ortaq-ink-soft")}>
          {t("homeProduct.realization.footnote")}
        </p>
      </Container>
    </section>
  );
}
