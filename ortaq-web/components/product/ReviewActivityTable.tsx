"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Container } from "@/components/ui/Section";
import { siteFeedTop } from "@/lib/feed/site-feed";
import { formatPulseDate } from "@/lib/operations/pulse";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

/**
 * Cross-campaign activity log on the homepage.
 *
 * Replaces the old ProductActivitySection, which pulled 4 generic i18n keys
 * with no company attribution. This pulls real fieldJournal + operationalUpdates
 * from every campaign and renders them as a single table.
 */

const ROW_LIMIT = 10;

const typeChipStyles: Record<string, string> = {
  observation: "bg-ortaq-bg-alt text-ortaq-ink-soft",
  inspection: "bg-ortaq-trust-soft text-ortaq-trust",
  capacity: "bg-ortaq-bg-warm text-ortaq-ink-muted",
  logistics: "bg-ortaq-bg-alt text-ortaq-ink-soft",
  founder: "bg-ortaq-status-soft text-ortaq-status",
  update: "bg-ortaq-bg-alt text-ortaq-ink-soft",
};

export function ReviewActivityTable() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === "tr" ? "tr-TR" : "en-GB";
  const events = siteFeedTop(ROW_LIMIT);

  return (
    <section
      id="aktivite"
      className="border-b border-ortaq-border bg-ortaq-bg"
      aria-label={t("homeProduct.activity.aria")}
    >
      <Container wide>
        <div className="flex flex-wrap items-baseline justify-between gap-2 py-5 sm:py-6">
          <div>
            <p className={typography.label}>{t("homeProduct.activity.label")}</p>
            <h2 className={cn(typography.h2, "mt-1")}>{t("homeProduct.activity.title")}</h2>
          </div>
          <p className={cn(typography.caption, "text-ortaq-ink-soft")}>{t("homeProduct.activity.subtitle")}</p>
        </div>

        <div className="overflow-x-auto rounded-ortaq-md border border-ortaq-border">
          <table className="w-full min-w-[36rem] text-left">
            <thead>
              <tr className="border-b border-ortaq-border bg-ortaq-bg-alt">
                <Th narrow>{t("homeProduct.activity.colDate")}</Th>
                <Th narrow>{t("homeProduct.activity.colTime")}</Th>
                <Th>{t("homeProduct.activity.colCompany")}</Th>
                <Th narrow>{t("homeProduct.activity.colType")}</Th>
                <Th>{t("homeProduct.activity.colNote")}</Th>
              </tr>
            </thead>
            <tbody>
              {events.map((ev, i) => {
                const chipTone = ev.kind === "field" ? typeChipStyles[ev.type] : typeChipStyles.update;
                const chipLabel =
                  ev.kind === "field"
                    ? t(`dossier.field.types.${ev.type}`)
                    : t("homeProduct.activity.updateChip");
                return (
                  <tr
                    key={`${ev.campaignSlug}-${ev.date}-${ev.time}-${i}`}
                    className="border-b border-ortaq-border last:border-0"
                  >
                    <Td narrow>
                      <span className="tabular-nums">{formatPulseDate(ev.date, locale)}</span>
                    </Td>
                    <Td narrow>
                      <span className="tabular-nums text-ortaq-ink-soft">{ev.time}</span>
                    </Td>
                    <Td>
                      <Link
                        href={`/sirket/${ev.campaignSlug}`}
                        className="font-medium text-ortaq-ink hover:underline"
                      >
                        {ev.campaignTradeName}
                      </Link>
                      <span className="text-ortaq-ink-soft"> · {ev.campaignCity}</span>
                    </Td>
                    <Td narrow>
                      <span
                        className={cn(
                          "rounded-ortaq-sm px-1.5 py-0.5 text-[0.625rem] font-medium uppercase tracking-wide",
                          chipTone,
                        )}
                      >
                        {chipLabel}
                      </span>
                    </Td>
                    <Td>
                      <p className="line-clamp-2 text-ortaq-ink-muted">{ev.text}</p>
                      {ev.kind === "field" && (
                        <p className={cn(typography.caption, "text-ortaq-ink-soft")}>{ev.author}</p>
                      )}
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <p className={cn(typography.caption, "mt-3 pb-5 sm:pb-6")}>
          {t("homeProduct.activity.note")}
        </p>
      </Container>
    </section>
  );
}

function Th({ children, narrow }: { children: React.ReactNode; narrow?: boolean }) {
  return (
    <th
      className={cn(
        "px-3 py-2 text-[0.75rem] font-medium uppercase tracking-[0.04em] text-ortaq-ink-soft",
        narrow && "whitespace-nowrap",
      )}
    >
      {children}
    </th>
  );
}

function Td({ children, narrow }: { children: React.ReactNode; narrow?: boolean }) {
  return (
    <td
      className={cn("px-3 py-2.5 align-top text-[0.8125rem]", narrow && "whitespace-nowrap")}
    >
      {children}
    </td>
  );
}
