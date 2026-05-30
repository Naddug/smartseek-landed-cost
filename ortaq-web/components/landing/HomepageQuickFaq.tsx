"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Container } from "@/components/ui/Section";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

const faqKeys = ["1", "2", "3", "4"] as const;

/** Compact FAQ, four questions only, no wall of copy. */
export function HomepageQuickFaq() {
  const { t } = useTranslation();

  return (
    <section className="border-b border-ortaq-border bg-ortaq-bg" aria-label={t("homeLanding.quickFaq.aria")}>
      <Container wide className="py-8 sm:py-9">
        <p className={typography.label}>{t("homeLanding.quickFaq.label")}</p>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2">
          {faqKeys.map((key) => (
            <div key={key} className="rounded-ortaq-md border border-ortaq-border bg-ortaq-surface px-4 py-3">
              <dt className={cn(typography.bodySm, "font-semibold text-ortaq-ink")}>
                {t(`homeLanding.quickFaq.items.${key}.q`)}
              </dt>
              <dd className={cn(typography.bodySm, "mt-1 text-ortaq-ink-muted")}>
                {t(`homeLanding.quickFaq.items.${key}.a`)}
              </dd>
            </div>
          ))}
        </dl>
        <p className={cn(typography.caption, "mt-4")}>
          <Link href="/guven" className={cn(typography.link, "font-medium")}>
            {t("homeLanding.quickFaq.trustLink")}
          </Link>
          {" · "}
          <Link href="/riskler" className={cn(typography.link, "font-medium")}>
            {t("homeLanding.quickFaq.riskLink")}
          </Link>
        </p>
      </Container>
    </section>
  );
}
