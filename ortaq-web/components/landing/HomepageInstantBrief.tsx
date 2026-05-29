"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Container } from "@/components/ui/Section";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

const cardKeys = ["does", "doesNot", "forWhom", "regulation"] as const;
const faqKeys = ["1", "2", "3", "4", "5", "6", "7", "8"] as const;

export function HomepageInstantBrief() {
  const { t } = useTranslation();

  return (
    <section
      id="ozet"
      className="border-b border-ortaq-border bg-ortaq-bg scroll-mt-20"
      aria-label={t("homeLanding.instant.aria")}
    >
      <Container wide className="py-8 sm:py-10">
        <header className="max-w-3xl">
          <p className={typography.label}>{t("homeLanding.instant.label")}</p>
          <h2 className={cn(typography.h1, "mt-2 text-[1.375rem] sm:text-[1.5rem]")}>
            {t("homeLanding.instant.title")}
          </h2>
          <p className={cn(typography.body, "mt-2")}>{t("homeLanding.instant.lead")}</p>
        </header>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {cardKeys.map((key) => (
            <div
              key={key}
              className={cn(
                "rounded-ortaq-md border px-4 py-3.5",
                key === "doesNot"
                  ? "border-ortaq-border-strong bg-ortaq-bg-alt"
                  : "border-ortaq-border bg-ortaq-surface",
              )}
            >
              <p className={cn(typography.caption, "font-semibold uppercase tracking-wide text-ortaq-trust-muted")}>
                {t(`homeLanding.instant.cards.${key}.label`)}
              </p>
              <p className={cn(typography.bodySm, "mt-1.5 text-ortaq-ink")}>
                {t(`homeLanding.instant.cards.${key}.body`)}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-ortaq-lg border border-ortaq-border bg-ortaq-surface p-5 sm:p-6">
          <p className={typography.label}>{t("homeLanding.instant.faqLabel")}</p>
          <dl className="mt-4 grid gap-4 sm:grid-cols-2">
            {faqKeys.map((key) => (
              <div key={key} className="min-w-0">
                <dt className={cn(typography.bodySm, "font-semibold text-ortaq-ink")}>
                  {t(`homeLanding.instant.faq.${key}.q`)}
                </dt>
                <dd className={cn(typography.bodySm, "mt-1 text-ortaq-ink-muted")}>
                  {t(`homeLanding.instant.faq.${key}.a`)}
                </dd>
              </div>
            ))}
          </dl>
          <p className={cn(typography.caption, "mt-5")}>
            {t("homeLanding.instant.faqFootnote")}{" "}
            <Link href="/guven" className={cn(typography.link, "font-medium")}>
              {t("homeLanding.instant.faqTrustLink")}
            </Link>
            {" · "}
            <Link href="/riskler" className={cn(typography.link, "font-medium")}>
              {t("homeLanding.instant.faqRiskLink")}
            </Link>
          </p>
        </div>
      </Container>
    </section>
  );
}
