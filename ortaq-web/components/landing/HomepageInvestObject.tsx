"use client";

import { useTranslation } from "react-i18next";
import { Container } from "@/components/ui/Section";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

const stepKeys = ["1", "2", "3"] as const;

function FlowArrow({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "flex shrink-0 items-center justify-center text-ortaq-ink-soft",
        className,
      )}
    >
      <span className="text-lg leading-none lg:hidden">↓</span>
      <span className="hidden text-base leading-none lg:inline">→</span>
    </div>
  );
}

export function HomepageInvestObject() {
  const { t } = useTranslation();

  return (
    <section
      className="border-b border-ortaq-border bg-ortaq-surface"
      aria-label={t("homeLanding.investObject.aria")}
    >
      <Container wide className="py-10 sm:py-12">
        <h2 className={cn(typography.h1, "text-[1.375rem] sm:text-[1.5rem]")}>
          {t("homeLanding.investObject.title")}
        </h2>

        <ol className="mt-8 flex list-none flex-col lg:flex-row lg:items-start">
          {stepKeys.flatMap((key, index) => {
            const step = (
              <li
                key={key}
                className={cn(
                  "flex-1 border-t border-ortaq-border pt-5",
                  index > 0 && "lg:border-l lg:pl-8",
                  index === 0 && "lg:border-t-0 lg:pt-0",
                  index > 0 && "lg:border-t-0 lg:pt-0",
                )}
              >
                <p className={cn(typography.bodySm, "font-medium text-ortaq-ink")}>
                  {t(`homeLanding.investObject.steps.${key}.title`)}
                </p>
                <p className={cn(typography.caption, "mt-2 max-w-[22rem] text-ortaq-ink-muted")}>
                  {t(`homeLanding.investObject.steps.${key}.body`)}
                </p>
              </li>
            );

            if (index === stepKeys.length - 1) return [step];

            return [
              step,
              <FlowArrow key={`${key}-arrow`} className="py-3 lg:px-5 lg:py-6" />,
            ];
          })}
        </ol>
      </Container>
    </section>
  );
}
