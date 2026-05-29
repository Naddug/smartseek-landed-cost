"use client";

import { useTranslation } from "react-i18next";
import { Container } from "@/components/ui/Section";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

const pairKeys = ["1", "2", "3", "4"] as const;

export function HomepageWhyOrtaq() {
  const { t } = useTranslation();

  return (
    <section
      className="border-b border-ortaq-border bg-ortaq-bg"
      aria-label={t("homeLanding.why.aria")}
    >
      <Container wide className="py-10 sm:py-12">
        <h2 className={cn(typography.h1, "text-[1.375rem] sm:text-[1.5rem]")}>
          {t("homeLanding.why.title")}
        </h2>
        <p className={cn(typography.body, "mt-3 max-w-[42rem] text-ortaq-ink-muted")}>
          {t("homeLanding.why.subtitle")}
        </p>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {pairKeys.map((key) => (
            <div
              key={key}
              className="border-t border-ortaq-border pt-5"
            >
              <p className={cn(typography.caption, "text-ortaq-ink-soft")}>
                <span className={cn(typography.label, "text-ortaq-ink-soft")}>
                  {t("homeLanding.why.traditional.label")}
                </span>
                <span aria-hidden="true"> · </span>
                {t(`homeLanding.why.traditional.items.${key}`)}
              </p>
              <p className={cn(typography.bodySm, "mt-3 text-ortaq-ink")}>
                <span className={cn(typography.label, "text-ortaq-trust-muted")}>
                  {t("homeLanding.why.ortaq.label")}
                </span>
                <span aria-hidden="true"> · </span>
                <span className="font-medium">{t(`homeLanding.why.ortaq.items.${key}`)}</span>
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
