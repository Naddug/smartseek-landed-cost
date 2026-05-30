"use client";

import { useTranslation } from "react-i18next";
import { Container } from "@/components/ui/Section";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

const pointKeys = ["1", "2", "3", "4"] as const;

export function HomepageInvestorValue() {
  const { t } = useTranslation();

  return (
    <section
      className="border-b border-ortaq-border bg-ortaq-surface"
      aria-label={t("homeLanding.investorValue.aria")}
    >
      <Container wide className="py-10 sm:py-12">
        <p className={typography.label}>{t("homeLanding.investorValue.label")}</p>
        <h2 className={cn(typography.h1, "mt-2 text-[1.375rem] sm:text-[1.5rem]")}>
          {t("homeLanding.investorValue.title")}
        </h2>

        <dl className="mt-8 grid gap-6 sm:grid-cols-2 lg:gap-8">
          {pointKeys.map((key) => (
            <div key={key} className="border-t border-ortaq-border pt-4">
              <dt className={cn(typography.bodySm, "font-semibold text-ortaq-ink")}>
                {t(`homeLanding.investorValue.points.${key}.k`)}
              </dt>
              <dd className={cn(typography.bodySm, "mt-1.5 text-ortaq-ink-muted")}>
                {t(`homeLanding.investorValue.points.${key}.v`)}
              </dd>
            </div>
          ))}
        </dl>

        <p className={cn(typography.caption, "mt-6 text-ortaq-ink-soft")}>
          {t("homeLanding.investorValue.disclaimer")}
        </p>
      </Container>
    </section>
  );
}
