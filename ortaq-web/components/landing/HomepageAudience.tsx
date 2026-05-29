"use client";

import { useTranslation } from "react-i18next";
import { Container } from "@/components/ui/Section";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

const producerKeys = ["1", "2", "3"] as const;
const investorKeys = ["1", "2", "3"] as const;

export function HomepageAudience() {
  const { t } = useTranslation();

  return (
    <section
      id="kimler-icin"
      className="border-b border-ortaq-border bg-ortaq-bg scroll-mt-20"
      aria-label={t("homeLanding.audience.aria")}
    >
      <Container wide className="py-10 sm:py-12">
        <div className="grid gap-8 lg:grid-cols-2">
          <article className="rounded-ortaq-lg border border-ortaq-border bg-ortaq-surface p-6 sm:p-7">
            <p className={typography.label}>{t("homeLanding.audience.producer.label")}</p>
            <h2 className={cn(typography.h2, "mt-2")}>{t("homeLanding.audience.producer.title")}</h2>
            <ul className="mt-4 space-y-2.5">
              {producerKeys.map((key) => (
                <li key={key} className={cn(typography.bodySm, "flex gap-2")}>
                  <span className="text-ortaq-trust" aria-hidden>
                    ·
                  </span>
                  {t(`homeLanding.audience.producer.points.${key}`)}
                </li>
              ))}
            </ul>
          </article>

          <article
            id="yatirim"
            className="rounded-ortaq-lg border border-ortaq-border-strong bg-ortaq-surface p-6 sm:p-7"
          >
            <p className={typography.label}>{t("homeLanding.audience.investor.label")}</p>
            <h2 className={cn(typography.h2, "mt-2")}>{t("homeLanding.audience.investor.title")}</h2>
            <p className={cn(typography.bodySm, "mt-3 font-medium text-ortaq-ink")}>
              {t("homeLanding.audience.investor.lead")}
            </p>
            <ul className="mt-4 space-y-2.5">
              {investorKeys.map((key) => (
                <li key={key} className={cn(typography.bodySm, "flex gap-2")}>
                  <span className="text-ortaq-trust" aria-hidden>
                    ·
                  </span>
                  {t(`homeLanding.audience.investor.points.${key}`)}
                </li>
              ))}
            </ul>
            <p className={cn(typography.caption, "mt-5 border-t border-ortaq-border pt-4")}>
              {t("homeLanding.audience.investor.disclaimer")}
            </p>
          </article>
        </div>
      </Container>
    </section>
  );
}
