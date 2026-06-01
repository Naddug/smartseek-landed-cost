"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Container } from "@/components/ui/Section";
import { siteFeedTop, siteFeedCount } from "@/lib/feed/site-feed";
import { classifyFeedUpdateType } from "@/lib/feed/feed-update-type";
import { formatDaysAgo } from "@/lib/product/company-summary";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

const ROW_LIMIT = 14;

export function DiscoveryFeed() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === "tr" ? "tr-TR" : "en-GB";
  const events = siteFeedTop(ROW_LIMIT);
  const totalTraces = siteFeedCount();

  return (
    <section id="kesif" className="border-b border-ortaq-border bg-ortaq-ink text-ortaq-cream">
      <Container wide className="py-10 sm:py-12">
        <h2 className="text-[1.25rem] font-semibold tracking-[-0.02em] sm:text-[1.375rem]">
          {t("discovery.home.movement.archiveTitle")}
        </h2>
        <p className={cn(typography.bodySm, "mt-2 max-w-xl text-ortaq-cream/65")}>
          {t("discovery.home.movement.archiveLead")}
        </p>

        <ul className="mt-6 divide-y divide-white/10 border border-white/12">
          {events.map((ev, i) => {
            const type = classifyFeedUpdateType(ev);
            return (
              <li key={`${ev.campaignSlug}-${ev.date}-${i}`}>
                <Link
                  href={`/sirket/${ev.campaignSlug}`}
                  className={cn(
                    "flex flex-col gap-2 px-4 py-3.5 transition-colors hover:bg-white/[0.04] sm:flex-row sm:items-start sm:justify-between sm:gap-6",
                    i === 0 && "bg-white/[0.03]",
                  )}
                >
                  <div className="min-w-0 flex-1">
                    <p className={cn(typography.bodySm, "font-semibold text-ortaq-cream")}>
                      {ev.campaignTradeName}
                      <span className="font-normal text-ortaq-cream/45"> · {ev.campaignCity}</span>
                    </p>
                    <p className={cn(typography.bodySm, "mt-1 line-clamp-2 text-ortaq-cream/72")}>{ev.text}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3 sm:flex-col sm:items-end sm:gap-1">
                    <span className="text-[0.6875rem] font-medium text-ortaq-cream/55">
                      {t(`discovery.home.movement.types.${type}`)}
                    </span>
                    <span className={cn(typography.caption, "tabular-nums text-ortaq-cream/40")}>
                      {formatDaysAgo(ev.date, locale)}
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>

        <p className={cn(typography.caption, "mt-4 text-ortaq-cream/40")}>
          {t("discovery.home.movement.archiveFootnote", { shown: events.length, total: totalTraces })}
        </p>
      </Container>
    </section>
  );
}
