"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Container, Section } from "@/components/ui/Section";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";
import { formatPulseDate, operationalPulse } from "@/lib/operations/pulse";

const HOME_NOTES = operationalPulse.notes.slice(0, 2);

export function OperationalPulse() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === "en" ? "en-GB" : "tr-TR";

  return (
    <Section spacing="compact">
      <Container narrow>
        <div className="border-y border-ortaq-border py-6">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <p className={typography.kicker}>{t("pulse.label")}</p>
            <p className={typography.caption}>
              {t("pulse.lastUpdated", {
                date: formatPulseDate(operationalPulse.siteLastUpdated, locale),
              })}
            </p>
          </div>

          <ul className="mt-4 space-y-3">
            {HOME_NOTES.map((note) => (
              <li key={note.id} className="grid gap-1 sm:grid-cols-[7rem_1fr] sm:gap-4">
                <time
                  dateTime={note.date}
                  className={cn(typography.caption, "tabular-nums")}
                >
                  {formatPulseDate(note.date, locale)}
                </time>
                <p className={typography.bodySm}>{t(`pulse.notes.${note.key}`)}</p>
              </li>
            ))}
          </ul>

          <Link
            href="/guven"
            className={cn(typography.bodySm, typography.link, "mt-5 inline-block min-h-11 leading-[2.75rem]")}
          >
            {t("pulse.more")}
          </Link>
        </div>
      </Container>
    </Section>
  );
}
