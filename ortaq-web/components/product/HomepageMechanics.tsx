"use client";

import { useTranslation } from "react-i18next";
import { Container } from "@/components/ui/Section";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

const stepKeys = ["1", "2", "3", "4"] as const;
const pathKeys = ["1", "2", "3", "4"] as const;

/**
 * Merged mechanics: mechanism + ownership/realization, in one continuous block.
 * Keeps the homepage compact by merging rather than adding more fragments.
 */
export function HomepageMechanics() {
  const { t } = useTranslation();

  return (
    <section className="border-b border-ortaq-border bg-ortaq-surface" aria-label={t("homeProduct.mechanics.aria")}>
      <Container wide className="py-4 sm:py-5">
        <p className={typography.label}>{t("homeProduct.mechanics.label")}</p>
        <h2 className={cn(typography.h2, "mt-1 max-w-3xl")}>{t("homeProduct.mechanics.title")}</h2>
        <p className={cn(typography.bodySm, "mt-1.5 max-w-3xl text-ortaq-ink-muted")}>
          {t("homeProduct.mechanics.lead")}
        </p>

        <ol className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {stepKeys.map((key) => (
            <li key={key} className="product-card min-h-[4.5rem] p-3 sm:p-3.5">
              <p className={cn(typography.caption, "font-semibold text-ortaq-trust-muted")}>
                {t(`homeProduct.mechanics.steps.${key}.title`)}
              </p>
              <p className={cn(typography.bodySm, "mt-1 leading-snug")}>
                {t(`homeProduct.mechanics.steps.${key}.body`)}
              </p>
            </li>
          ))}
        </ol>

        <div className="mt-3 max-w-3xl space-y-2">
          <p className={typography.bodySm}>{t("homeProduct.mechanics.ownership")}</p>
          <p className={typography.bodySm}>{t("homeProduct.mechanics.growth")}</p>
        </div>

        <p className={cn(typography.caption, "mt-4 font-medium text-ortaq-ink-muted")}>
          {t("homeProduct.mechanics.exitLabel")}
        </p>
        <ul className="mt-2 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
          {pathKeys.map((key) => (
            <li key={key} className="min-w-0 border-l border-ortaq-border pl-2.5">
              <p className={cn(typography.caption, "font-medium text-ortaq-ink")}>
                {t(`homeProduct.mechanics.paths.${key}.title`)}
              </p>
              <p className={cn(typography.caption, "mt-0.5 text-ortaq-ink-muted")}>
                {t(`homeProduct.mechanics.paths.${key}.body`)}
              </p>
            </li>
          ))}
        </ul>

        <p className={cn(typography.caption, "mt-3 max-w-3xl text-ortaq-ink-soft")}>
          {t("homeProduct.mechanics.liquidity")}
        </p>

        <div className="mt-4 max-w-3xl border-t border-ortaq-border pt-3">
          <p className={typography.label}>{t("homeProduct.mechanics.marketWhy.label")}</p>
          <p className={cn(typography.bodySm, "mt-1.5 text-ortaq-ink-muted")}>
            {t("homeProduct.mechanics.marketWhy.body")}
          </p>
        </div>

        <p className={cn(typography.caption, "mt-3 text-ortaq-ink-soft")}>{t("homeProduct.mechanics.footnote")}</p>
      </Container>
    </section>
  );
}

