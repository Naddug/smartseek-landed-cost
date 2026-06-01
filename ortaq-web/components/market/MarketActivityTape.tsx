"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { Container } from "@/components/ui/Section";
import { siteFeedTop } from "@/lib/feed/site-feed";
import { classifyFeedUpdateType } from "@/lib/feed/feed-update-type";
import { getFeedDisplayLine } from "@/lib/feed/feed-display";
import { getCampaign } from "@/lib/campaigns";
import { getCampaignMediaAsset, getCampaignMediaAlt } from "@/lib/product/company-summary";
import { formatDaysAgo } from "@/lib/product/company-summary";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

const LIMIT = 8;

export function MarketActivityTape() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === "tr" ? "tr-TR" : "en-GB";
  const events = siteFeedTop(LIMIT);

  return (
    <section className="border-b border-ortaq-border bg-ortaq-bg-alt" aria-labelledby="market-tape-title">
      <Container wide className="py-8 sm:py-10">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className={typography.label}>{t("market.tape.label")}</p>
            <h2 id="market-tape-title" className="mt-2 text-[1.25rem] font-semibold tracking-[-0.02em] text-ortaq-ink sm:text-[1.375rem]">
              {t("market.tape.title")}
            </h2>
            <p className={cn(typography.bodySm, "mt-2 max-w-xl text-ortaq-ink-muted")}>{t("market.tape.lead")}</p>
          </div>
          <Link href="/kesfet" className={cn(typography.bodySm, typography.link, "shrink-0 font-semibold")}>
            {t("market.tape.expand")} →
          </Link>
        </div>

        <ul className="mt-6 divide-y divide-ortaq-border overflow-hidden rounded-ortaq-md border border-ortaq-border bg-ortaq-surface">
          {events.map((ev, i) => {
            const type = classifyFeedUpdateType(ev);
            const line = getFeedDisplayLine(ev, type);
            const campaign = getCampaign(ev.campaignSlug);
            const media = getCampaignMediaAsset(ev.campaignSlug, campaign?.sector);
            return (
              <li key={`${ev.campaignSlug}-${ev.date}-${ev.time}-${i}`}>
                <Link
                  href={`/sirket/${ev.campaignSlug}`}
                  className="group flex gap-3 p-3 transition-colors hover:bg-ortaq-bg sm:gap-4 sm:p-4"
                >
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-ortaq-sm border border-ortaq-border bg-ortaq-bg-alt sm:h-16 sm:w-16">
                    <Image
                      src={media.src}
                      alt={getCampaignMediaAlt(media, i18n.language)}
                      fill
                      className="object-cover transition-transform group-hover:scale-[1.03]"
                      style={{ objectPosition: media.focalPoint }}
                      sizes="64px"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={cn(typography.bodySm, "font-semibold text-ortaq-ink group-hover:underline")}>
                      {line.company}
                      <span className="font-normal text-ortaq-ink-muted">
                        {" "}
                        · {line.sector} · {line.place}
                      </span>
                    </p>
                    <p className={cn(typography.bodySm, "mt-1 leading-relaxed text-ortaq-ink-muted")}>
                      <span className="font-medium text-ortaq-ink">{line.typeLabel}:</span> {line.summary}
                    </p>
                  </div>
                  <div className="hidden shrink-0 text-right sm:block">
                    <span className={cn(typography.caption, "tabular-nums text-ortaq-ink-soft")}>
                      {formatDaysAgo(ev.date, locale)}
                      {ev.time ? ` · ${ev.time.slice(0, 5)}` : ""}
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
        <p className={cn(typography.caption, "mt-3 text-ortaq-ink-soft")}>{t("market.tape.footnote")}</p>
      </Container>
    </section>
  );
}
