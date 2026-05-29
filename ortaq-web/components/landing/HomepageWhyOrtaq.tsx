"use client";

import { useTranslation } from "react-i18next";
import { Container } from "@/components/ui/Section";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

const traditionalKeys = ["1", "2", "3", "4"] as const;
const ortaqKeys = ["1", "2", "3", "4"] as const;

export function HomepageWhyOrtaq() {
  const { t } = useTranslation();

  return (
    <section
      className="border-b border-ortaq-border bg-ortaq-bg"
      aria-label={t("homeLanding.why.aria")}
    >
      <Container wide className="py-10 sm:py-12">
        <h2 className={cn(typography.h1, "text-[1.375rem] sm:text-[1.5rem]")}>{t("homeLanding.why.title")}</h2>

        <div className="mt-8 grid gap-10 md:grid-cols-2 md:gap-12">
          <div>
            <p className={cn(typography.label, "text-ortaq-ink-soft")}>{t("homeLanding.why.traditional.label")}</p>
            <ul className="mt-4 space-y-2.5">
              {traditionalKeys.map((key) => (
                <li key={key} className={cn(typography.bodySm, "text-ortaq-ink-muted")}>
                  {t(`homeLanding.why.traditional.items.${key}`)}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className={cn(typography.label, "text-ortaq-trust-muted")}>{t("homeLanding.why.ortaq.label")}</p>
            <ul className="mt-4 space-y-2.5">
              {ortaqKeys.map((key) => (
                <li key={key} className={cn(typography.bodySm, "text-ortaq-ink")}>
                  {t(`homeLanding.why.ortaq.items.${key}`)}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
