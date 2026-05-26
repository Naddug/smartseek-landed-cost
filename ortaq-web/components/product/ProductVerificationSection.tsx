"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Container } from "@/components/ui/Section";
import { IntelReveal } from "@/components/intelligence/IntelReveal";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

const checks = ["field", "capacity", "documents", "operations", "export"] as const;

export function ProductVerificationSection() {
  const { t } = useTranslation();

  return (
    <section className="product-section border-y border-ortaq-border bg-ortaq-surface">
      <Container wide>
        <IntelReveal>
          <div className="mb-5 flex flex-wrap items-end justify-between gap-4 sm:mb-6">
            <div>
              <p className={typography.label}>{t("homeProduct.verification.label")}</p>
              <h2 className={cn(typography.h1, "mt-1")}>{t("homeProduct.verification.title")}</h2>
              <p className={cn(typography.bodySm, "mt-2 max-w-2xl")}>{t("homeProduct.verification.lead")}</p>
            </div>
            <Link href="/guven" className={cn(typography.bodySm, typography.link, "font-medium shrink-0")}>
              {t("homeProduct.verification.link")} →
            </Link>
          </div>
        </IntelReveal>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {checks.map((key, index) => (
            <IntelReveal key={key} delay={index * 50}>
              <div className="h-full rounded-ortaq-md border border-ortaq-border bg-ortaq-bg-alt/50 p-3.5">
                <p className={cn(typography.caption, "font-medium text-ortaq-trust-muted")}>
                  {String(index + 1).padStart(2, "0")}
                </p>
                <p className={cn(typography.bodySm, "mt-1 font-semibold text-ortaq-ink")}>
                  {t(`homeProduct.verification.checks.${key}.title`)}
                </p>
                <p className={cn(typography.caption, "mt-1.5 text-ortaq-ink-muted")}>
                  {t(`homeProduct.verification.checks.${key}.text`)}
                </p>
              </div>
            </IntelReveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
