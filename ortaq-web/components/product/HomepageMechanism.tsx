"use client";

import { useTranslation } from "react-i18next";
import { Container } from "@/components/ui/Section";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

const stepKeys = ["1", "2", "3", "4"] as const;

/**
 * Compact comprehension strip between masthead and dossier index.
 * Subordinate to masthead: smaller heading tier, tight vertical rhythm.
 */
export function HomepageMechanism() {
  const { t } = useTranslation();

  return (
    <section
      className="border-b border-ortaq-border bg-ortaq-bg-alt/40"
      aria-label={t("homeProduct.mechanism.aria")}
    >
      <Container wide className="py-4 sm:py-5">
        <p className={typography.label}>{t("homeProduct.mechanism.label")}</p>
        <h2 className={cn(typography.h2, "mt-1 max-w-2xl")}>{t("homeProduct.mechanism.title")}</h2>
        <p className={cn(typography.bodySm, "mt-1.5 max-w-2xl")}>{t("homeProduct.mechanism.lead")}</p>
        <p className={cn(typography.bodySm, "mt-2.5 max-w-2xl font-medium text-ortaq-ink")}>
          {t("homeProduct.mechanism.thesis")}
        </p>

        <ol className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {stepKeys.map((key) => (
            <li key={key} className="product-card min-h-[4.5rem] p-3 sm:p-3.5">
              <p className={cn(typography.caption, "font-semibold text-ortaq-trust-muted")}>
                {t(`homeProduct.mechanism.steps.${key}.title`)}
              </p>
              <p className={cn(typography.bodySm, "mt-1 leading-snug")}>
                {t(`homeProduct.mechanism.steps.${key}.body`)}
              </p>
            </li>
          ))}
        </ol>

        <p className={cn(typography.bodySm, "mt-3 max-w-3xl text-ortaq-ink-muted")}>
          {t("homeProduct.mechanism.karatExample")}
        </p>

        <p className={cn(typography.caption, "mt-3 text-ortaq-ink-soft")}>{t("homeProduct.mechanism.footnote")}</p>
      </Container>
    </section>
  );
}
