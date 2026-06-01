"use client";

import { useTranslation } from "react-i18next";
import { Container } from "@/components/ui/Section";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

const REASON_KEYS = ["1", "2", "3"] as const;

export function DiscoveryWhyReview() {
  const { t } = useTranslation();

  return (
    <section className="border-b border-ortaq-border bg-ortaq-bg-alt" aria-labelledby="why-review-heading">
      <Container wide className="py-8 sm:py-10">
        <h2 id="why-review-heading" className="text-[1.125rem] font-semibold tracking-[-0.02em] text-ortaq-ink sm:text-[1.25rem]">
          {t("discovery.home.whyReview.title")}
        </h2>
        <p className={cn(typography.bodySm, "mt-2 max-w-2xl text-ortaq-ink-muted")}>
          {t("discovery.home.whyReview.lead")}
        </p>
        <ul className="mt-5 grid gap-3 sm:grid-cols-3">
          {REASON_KEYS.map((k) => (
            <li
              key={k}
              className="border border-ortaq-border bg-ortaq-surface px-4 py-3.5"
            >
              <p className={cn(typography.bodySm, "leading-relaxed text-ortaq-ink")}>
                {t(`discovery.home.whyReview.examples.${k}`)}
              </p>
            </li>
          ))}
        </ul>
        <p className={cn(typography.caption, "mt-4 text-ortaq-ink-soft")}>{t("discovery.home.whyReview.footnote")}</p>
      </Container>
    </section>
  );
}
