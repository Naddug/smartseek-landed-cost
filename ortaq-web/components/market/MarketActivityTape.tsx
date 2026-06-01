"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Container } from "@/components/ui/Section";
import { siteFeedTop } from "@/lib/feed/site-feed";
import { classifyFeedUpdateType } from "@/lib/feed/feed-update-type";
import { formatDaysAgo } from "@/lib/product/company-summary";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

const LIMIT = 12;

export function MarketActivityTape() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === "tr" ? "tr-TR" : "en-GB";
  const events = siteFeedTop(LIMIT);

  return (
    <section className="intel-band-ink border-b border-white/10" aria-labelledby="market-tape-title">
      <Container wide className="py-8 sm:py-10">
        <div className="intel-signal-header-dark -mx-0 mb-0 flex flex-col gap-2 rounded-t-ortaq-md border border-b-0 border-white/10 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 px-1">
            <span className="intel-live-dot intel-live-dot-dark text-[0.6875rem] font-semibold uppercase tracking-[0.06em] text-ortaq-cream/80">
              {t("market.tape.label")}
            </span>
            <h2 id="market-tape-title" className="text-[1.125rem] font-semibold text-ortaq-cream sm:text-[1.25rem]">
              {t("market.tape.title")}
            </h2>
          </div>
          <Link
            href="/kesfet"
            className={cn(typography.caption, "px-1 font-semibold text-ortaq-cream/65 hover:text-ortaq-cream hover:underline")}
          >
            {t("market.tape.expand")} →
          </Link>
        </div>

        <div className="intel-signal-panel-dark rounded-t-none border border-t-0 border-white/10">
          <ul>
            {events.map((ev, i) => {
              const type = classifyFeedUpdateType(ev);
              return (
                <li
                  key={`${ev.campaignSlug}-${ev.date}-${ev.time}-${i}`}
                  className={cn(
                    "intel-signal-row-dark border-b border-white/8 last:border-0",
                    i === 0 && "bg-white/[0.03]",
                  )}
                >
                  <Link
                    href={`/sirket/${ev.campaignSlug}`}
                    className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-start sm:justify-between sm:gap-6"
                  >
                    <div className="min-w-0 flex-1">
                      <p className={cn(typography.bodySm, "line-clamp-2 text-ortaq-cream/85")}>{ev.text}</p>
                      <p className={cn(typography.caption, "mt-1 text-ortaq-cream/45")}>
                        <span className="font-medium text-ortaq-cream/70">{ev.campaignTradeName}</span>
                        {" · "}
                        {ev.campaignCity}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-3 sm:flex-col sm:items-end sm:gap-1">
                      <span className="text-[0.6875rem] font-medium uppercase tracking-[0.04em] text-ortaq-trust-muted">
                        {t(`market.tape.types.${type}`)}
                      </span>
                      <span className={cn(typography.caption, "tabular-nums text-ortaq-cream/40")}>
                        {formatDaysAgo(ev.date, locale)}
                        {ev.time ? ` · ${ev.time.slice(0, 5)}` : ""}
                      </span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
        <p className={cn(typography.caption, "mt-3 text-ortaq-cream/40")}>{t("market.tape.footnote")}</p>
      </Container>
    </section>
  );
}
