"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Container } from "@/components/ui/Section";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

const items = ["1", "2", "3", "4"] as const;
const checks = ["field", "capacity", "documents", "operations", "export"] as const;

export function TrustInfrastructure() {
  const { t } = useTranslation();

  return (
    <section className="authority-compression border-y border-ortaq-border bg-ortaq-bg py-6 sm:py-7">
      <Container wide>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.85fr)_1.15fr] lg:gap-10">
          <div>
            <p className={typography.label}>{t("homeProduct.discovery.trust.label")}</p>
            <h2 className={cn(typography.h1, "mt-1")}>{t("homeProduct.discovery.trust.title")}</h2>
            <p className={cn(typography.bodySm, "mt-2 max-w-md")}>{t("homeProduct.discovery.trust.lead")}</p>
            <Link
              href="/guven"
              className={cn(typography.bodySm, "mt-4 inline-block font-semibold text-ortaq-trust-muted hover:text-ortaq-trust hover:underline")}
            >
              {t("homeProduct.verification.link")} →
            </Link>
          </div>

          <ul className="divide-y divide-ortaq-border border-y border-ortaq-border-strong">
            {items.map((key) => (
              <li key={key} className="py-3.5 first:pt-4 last:pb-4">
                <p className={cn(typography.bodySm, "font-semibold text-ortaq-ink")}>
                  {t(`homeProduct.trust.items.${key}.title`)}
                </p>
                <p className={cn(typography.caption, "mt-1 text-ortaq-ink-muted")}>
                  {t(`homeProduct.trust.items.${key}.text`)}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-ortaq-border pt-4">
          <span className={cn(typography.label, "text-ortaq-trust-muted")}>{t("homeProduct.verification.gate")}</span>
          {checks.map((key) => (
            <span key={key} className={cn(typography.caption, "font-medium text-ortaq-ink-muted")}>
              {t(`homeProduct.verification.checks.${key}.title`)}
            </span>
          ))}
        </div>
      </Container>
    </section>
  );
}
