"use client";

import { useTranslation } from "react-i18next";
import { Container } from "@/components/ui/Section";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

const accessibleKeys = ["1", "2", "3", "4"] as const;
const blockedKeys = ["1", "2", "3", "4"] as const;

export function ProductWhySection() {
  const { t } = useTranslation();

  return (
    <section className="product-section product-divider bg-ortaq-bg-alt">
      <Container wide>
        <div className="max-w-2xl">
          <p className={typography.label}>{t("homeProduct.why.label")}</p>
          <h2 className={cn(typography.h1, "mt-1")}>{t("homeProduct.why.title")}</h2>
          <p className={cn(typography.body, "mt-2 max-w-prose")}>{t("homeProduct.why.lead")}</p>
        </div>

        <div className="mt-5 grid gap-3 lg:grid-cols-2">
          <div className="product-card p-4 sm:p-5">
            <p className={typography.label}>{t("homeProduct.why.mostLabel")}</p>
            <ul className="mt-3 space-y-2">
              {accessibleKeys.map((key) => (
                <li key={key} className={cn(typography.bodySm, "text-ortaq-ink-muted")}>
                  {t(`homeProduct.why.most.${key}`)}
                </li>
              ))}
            </ul>
          </div>

          <div className="product-card border-ortaq-trust/25 bg-ortaq-trust-soft/30 p-4 sm:p-5">
            <p className={cn(typography.label, "text-ortaq-trust-muted")}>{t("homeProduct.why.fewLabel")}</p>
            <ul className="mt-3 space-y-2">
              {blockedKeys.map((key) => (
                <li key={key} className={cn(typography.bodySm, "font-medium text-ortaq-ink")}>
                  {t(`homeProduct.why.few.${key}`)}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className={cn(typography.bodySm, "mt-4 max-w-2xl text-ortaq-ink-muted")}>
          {t("homeProduct.why.barrier")}
        </p>
        <p className={cn(typography.bodySm, "mt-2 max-w-2xl font-medium text-ortaq-ink")}>
          {t("homeProduct.why.ortaq")}
        </p>
      </Container>
    </section>
  );
}
