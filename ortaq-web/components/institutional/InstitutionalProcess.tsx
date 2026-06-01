"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Container } from "@/components/ui/Section";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

const STEPS = ["read", "signal", "intro"] as const;

export function InstitutionalProcess() {
  const { t } = useTranslation();

  return (
    <section className="border-b border-ortaq-border bg-ortaq-bg-alt" aria-labelledby="process-title">
      <Container wide className="py-10 sm:py-12">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className={typography.label}>{t("home.institutional.process.label")}</p>
            <h2 id="process-title" className="mt-2 text-[1.375rem] font-semibold tracking-[-0.02em] text-ortaq-ink sm:text-[1.5rem]">
              {t("home.institutional.process.title")}
            </h2>
          </div>
          <Link href="/nasil-calisir" className={cn(typography.bodySm, typography.link, "shrink-0 font-semibold")}>
            {t("home.institutional.process.link")} →
          </Link>
        </div>

        <ol className="mt-8 grid gap-4 sm:grid-cols-3">
          {STEPS.map((step, i) => (
            <li key={step} className="border border-ortaq-border bg-ortaq-surface px-4 py-5">
              <span className="text-[0.6875rem] font-semibold tabular-nums text-ortaq-trust-muted">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className={cn(typography.body, "mt-2 font-semibold text-ortaq-ink")}>
                {t(`home.institutional.process.steps.${step}.title`)}
              </h3>
              <p className={cn(typography.bodySm, "mt-2 leading-relaxed text-ortaq-ink-muted")}>
                {t(`home.institutional.process.steps.${step}.body`)}
              </p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
