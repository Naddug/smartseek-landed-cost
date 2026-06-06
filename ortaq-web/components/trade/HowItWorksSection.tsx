"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/cn";
import { typography } from "@/design/typography";
import { Container } from "@/components/ui/Section";

const STEPS = ["s1", "s2", "s3"] as const;

export function HowItWorksSection() {
  const { t } = useTranslation();

  return (
    <section className="bg-ortaq-surface border-b border-ortaq-border">
      <Container wide>
        <div className="py-14 sm:py-18 lg:py-20">
          <div className="mb-12">
            <p className={cn(typography.label, "mb-3 text-ortaq-trust")}>
              {t("trade.howItWorks.eyebrow")}
            </p>
            <h2 className={cn(typography.display)}>
              {t("trade.howItWorks.headline")}
            </h2>
          </div>

          <div className="grid gap-8 sm:grid-cols-3 sm:gap-6 lg:gap-10">
            {STEPS.map((step, i) => (
              <div key={step} className="relative">
                {/* Connector line */}
                {i < STEPS.length - 1 && (
                  <div className="absolute right-0 top-5 hidden h-[1px] w-full translate-x-1/2 bg-ortaq-border sm:block" />
                )}

                <div className="relative">
                  <p
                    className={cn(
                      "mb-4 font-body text-[2rem] font-bold leading-none tracking-[-0.04em]",
                      "text-ortaq-border-strong",
                    )}
                  >
                    {t(`trade.howItWorks.steps.${step}.number`)}
                  </p>
                  <p className={cn(typography.h2, "mb-2")}>
                    {t(`trade.howItWorks.steps.${step}.name`)}
                  </p>
                  <p className={cn(typography.body, "leading-relaxed")}>
                    {t(`trade.howItWorks.steps.${step}.desc`)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12">
            <Link
              href="/demo"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-ortaq-sm bg-ortaq-ink px-7 text-[0.9375rem] font-semibold leading-none text-ortaq-cream shadow-[var(--shadow-product)] transition-colors hover:bg-ortaq-ink-muted active:scale-[0.99]"
            >
              {t("trade.hero.ctaPrimary")}
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
