"use client";

import { useTranslation } from "react-i18next";
import { Container } from "@/components/ui/Section";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

const stepKeys = ["1", "2", "3", "4", "5"] as const;

export function HomepageInThirty() {
  const { t } = useTranslation();

  return (
    <section
      className="border-b border-ortaq-border bg-ortaq-bg"
      aria-label={t("homeLanding.inThirty.aria")}
    >
      <Container wide className="py-10 sm:py-12">
        <p className={typography.label}>{t("homeLanding.inThirty.label")}</p>
        <h2 className={cn(typography.h1, "mt-2 text-[1.375rem] sm:text-[1.5rem]")}>
          {t("homeLanding.inThirty.title")}
        </h2>

        <ol className="mt-8 flex list-none flex-col items-stretch sm:max-w-2xl">
          {stepKeys.map((key, index) => {
            const isOrtaq = key === "2";
            return (
              <li key={key} className="flex flex-col">
                <div
                  className={cn(
                    "rounded-ortaq-md border px-5 py-4",
                    isOrtaq
                      ? "border-ortaq-trust bg-ortaq-trust-soft"
                      : "border-ortaq-border bg-ortaq-surface",
                  )}
                >
                  <p className={cn(typography.bodySm, "font-semibold text-ortaq-ink")}>
                    {t(`homeLanding.inThirty.steps.${key}.k`)}
                  </p>
                  <p className={cn(typography.caption, "mt-1 text-ortaq-ink-muted")}>
                    {t(`homeLanding.inThirty.steps.${key}.v`)}
                  </p>
                </div>
                {index < stepKeys.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="self-center py-1.5 text-base leading-none text-ortaq-ink-soft"
                  >
                    ↓
                  </span>
                )}
              </li>
            );
          })}
        </ol>

        <p className={cn(typography.caption, "mt-6 max-w-2xl border-t border-ortaq-border pt-4 text-ortaq-ink-soft")}>
          {t("homeLanding.inThirty.earn")}
        </p>
      </Container>
    </section>
  );
}
