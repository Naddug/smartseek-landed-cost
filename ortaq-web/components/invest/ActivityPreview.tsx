"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Container } from "@/components/ui/Section";
import { siteFeedTop } from "@/lib/feed/site-feed";
import { formatPulseDate } from "@/lib/operations/pulse";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

export function ActivityPreview() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === "tr" ? "tr-TR" : "en-GB";
  const events = siteFeedTop(9);

  return (
    <section className="border-b border-ortaq-border bg-ortaq-surface py-6 sm:py-8">
      <Container wide>
        <div className="flex flex-wrap items-end justify-between gap-3 mb-5">
          <div>
            <p className={typography.label}>{t("homeProduct.invest.activity.label")}</p>
            <h2 className={cn(typography.h1, "mt-1")}>{t("homeProduct.invest.activity.title")}</h2>
            <p className={cn(typography.bodySm, "mt-2 max-w-xl text-ortaq-ink-muted")}>{t("homeProduct.invest.activity.lead")}</p>
          </div>
          <Link href="/sirketler" className={cn(typography.bodySm, "font-semibold text-ortaq-trust hover:underline")}>
            {t("homeProduct.invest.activity.link")} →
          </Link>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((ev, i) => (
            <Link
              key={`${ev.campaignSlug}-${ev.date}-${i}`}
              href={`/sirket/${ev.campaignSlug}`}
              className="invest-activity-card rounded-ortaq-lg border border-ortaq-border/90 bg-ortaq-bg-alt/60 p-4 shadow-[var(--shadow-product)] transition-[border-color,background-color,transform] duration-200 hover:-translate-y-0.5 hover:border-ortaq-trust/25 hover:bg-ortaq-trust-soft/25"
            >
              <div className="flex items-baseline justify-between gap-2">
                <span className={cn(typography.bodySm, "font-semibold text-ortaq-ink")}>{ev.campaignTradeName}</span>
                <span className={cn(typography.meta, "tabular-nums text-ortaq-ink-soft")}>
                  {formatPulseDate(ev.date, locale)}
                </span>
              </div>
              <p className={cn(typography.caption, "mt-0.5 text-ortaq-trust-muted")}>{ev.campaignCity}</p>
              <p className={cn(typography.bodySm, "mt-2 line-clamp-2 text-ortaq-ink-muted")}>{ev.text}</p>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
