"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Container } from "@/components/ui/Section";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

const PILLARS = ["problem", "solution", "audience"] as const;

export function InstitutionalThesis() {
  const { t } = useTranslation();

  return (
    <section className="border-b border-ortaq-border bg-ortaq-surface" aria-labelledby="thesis-title">
      <Container wide className="py-10 sm:py-12">
        <h2 id="thesis-title" className="max-w-2xl text-[1.375rem] font-semibold tracking-[-0.02em] text-ortaq-ink sm:text-[1.5rem]">
          {t("home.institutional.thesis.title")}
        </h2>
        <p className={cn(typography.bodySm, "mt-2 max-w-2xl text-ortaq-ink-muted")}>
          {t("home.institutional.thesis.lead")}
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {PILLARS.map((key) => (
            <article key={key} className="border border-ortaq-border bg-ortaq-bg px-4 py-5 sm:px-5">
              <h3 className={cn(typography.label, "text-ortaq-ink-soft")}>{t(`home.institutional.thesis.${key}.label`)}</h3>
              <p className={cn(typography.bodySm, "mt-3 leading-relaxed text-ortaq-ink")}>
                {t(`home.institutional.thesis.${key}.body`)}
              </p>
            </article>
          ))}
        </div>

        <p className={cn(typography.bodySm, "mt-8 text-ortaq-ink-muted")}>
          {t("home.institutional.thesis.operator")}{" "}
          <Link href="/ekip" className={cn(typography.link, "font-medium text-ortaq-ink")}>
            {t("home.institutional.thesis.teamLink")} →
          </Link>
        </p>
      </Container>
    </section>
  );
}
