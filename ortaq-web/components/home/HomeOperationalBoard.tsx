"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Container, Section } from "@/components/ui/Section";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";
import { formatPulseDate, operationalPulse } from "@/lib/operations/pulse";

export function HomeOperationalBoard() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === "en" ? "en-GB" : "tr-TR";
  const s = operationalPulse.stats;

  const statItems = [
    { key: "preliminary", value: s.preliminaryReview },
    { key: "fieldVisits", value: s.fieldVisitsCompleted },
    { key: "document", value: s.documentReview },
    { key: "committee", value: s.committeeQueue },
  ] as const;

  return (
    <Section spacing="stage" className="border-y border-ortaq-border">
      <Container wide>
        <div className="lg:grid lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <p className={typography.kicker}>{t("homeOps.label")}</p>
            <h2 className={cn(typography.h2, "mt-3")}>{t("homeOps.title")}</h2>
            <p className={cn(typography.body, "mt-4")}>{t("homeOps.intro")}</p>
          </div>
          <div className="mt-8 lg:col-span-8 lg:mt-0">
            <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {statItems.map(({ key, value }) => (
                <div key={key} className="border border-ortaq-border bg-ortaq-cream px-4 py-4">
                  <dt className={typography.caption}>{t(`homeOps.stats.${key}`)}</dt>
                  <dd className={cn(typography.h2, "mt-1 tabular-nums")}>{value}</dd>
                </div>
              ))}
            </dl>
            <ul className="mt-6 divide-y divide-ortaq-border border-y border-ortaq-border">
              {operationalPulse.logs.map((log) => (
                <li key={log.id} className="flex flex-col gap-0.5 py-3 sm:flex-row sm:justify-between">
                  <span className={typography.bodySm}>{t(`homeOps.logs.${log.key}`)}</span>
                  <time dateTime={log.date} className={typography.caption}>
                    {formatPulseDate(log.date, locale)}
                  </time>
                </li>
              ))}
            </ul>
            <Link href="/degerlendirme" className={cn(typography.bodySm, typography.link, "mt-4 inline-block")}>
              {t("homeOps.link")}
            </Link>
          </div>
        </div>
      </Container>
    </Section>
  );
}
