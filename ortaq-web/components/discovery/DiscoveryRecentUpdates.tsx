"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Container } from "@/components/ui/Section";
import { siteFeedTop } from "@/lib/feed/site-feed";
import { classifyFeedUpdateType } from "@/lib/feed/feed-update-type";
import { formatDaysAgo } from "@/lib/product/company-summary";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

const LIMIT = 10;

export function DiscoveryRecentUpdates() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === "tr" ? "tr-TR" : "en-GB";
  const events = siteFeedTop(LIMIT);

  return (
    <section className="border-b border-ortaq-border bg-ortaq-surface" aria-labelledby="recent-updates-title">
      <Container wide className="py-8 sm:py-10">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 id="recent-updates-title" className="text-[1.25rem] font-semibold tracking-[-0.02em] text-ortaq-ink sm:text-[1.5rem]">
              {t("discovery.home.movement.title")}
            </h2>
            <p className={cn(typography.bodySm, "mt-1 max-w-xl text-ortaq-ink-muted")}>
              {t("discovery.home.movement.lead")}
            </p>
          </div>
          <Link href="/kesfet" className={cn(typography.bodySm, typography.link, "shrink-0 font-semibold")}>
            {t("discovery.home.movement.viewAll")} →
          </Link>
        </div>

        <ul className="mt-5 divide-y divide-ortaq-border border border-ortaq-border">
          {events.map((ev, i) => {
            const type = classifyFeedUpdateType(ev);
            return (
              <li key={`${ev.campaignSlug}-${ev.date}-${ev.time}-${i}`}>
                <Link
                  href={`/sirket/${ev.campaignSlug}`}
                  className="group flex flex-col gap-1.5 px-4 py-3.5 transition-colors hover:bg-ortaq-bg-alt sm:flex-row sm:items-start sm:gap-4"
                >
                  <div className="flex min-w-0 flex-1 flex-col gap-1 sm:gap-0.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={cn(typography.bodySm, "font-semibold text-ortaq-ink group-hover:underline")}>
                        {ev.campaignTradeName}
                      </span>
                      <span className={cn(typography.caption, "text-ortaq-ink-soft")}>
                        {ev.campaignCity}
                      </span>
                    </div>
                    <p className={cn(typography.bodySm, "line-clamp-2 text-ortaq-ink-muted")}>{ev.text}</p>
                  </div>
                  <div className="flex shrink-0 flex-wrap items-center gap-2 sm:flex-col sm:items-end sm:gap-1">
                    <span className="rounded-ortaq-sm bg-ortaq-bg-alt px-2 py-0.5 text-[0.6875rem] font-medium text-ortaq-ink-muted">
                      {t(`discovery.home.movement.types.${type}`)}
                    </span>
                    <span className={cn(typography.caption, "tabular-nums text-ortaq-ink-soft")}>
                      {formatDaysAgo(ev.date, locale)}
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
