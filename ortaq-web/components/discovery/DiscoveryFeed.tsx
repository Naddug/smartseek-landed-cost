"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Container } from "@/components/ui/Section";
import { siteFeedTop, siteFeedCount } from "@/lib/feed/site-feed";
import { getReviewQueueBreakdown } from "@/lib/intelligence/discovery";
import { formatPulseDate } from "@/lib/operations/pulse";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

const ROW_LIMIT = 12;

const typeStyles: Record<string, string> = {
  observation: "text-ortaq-cream/55",
  inspection: "text-ortaq-trust-muted",
  capacity: "text-ortaq-accent",
  logistics: "text-ortaq-cream/65",
  founder: "text-ortaq-status",
  update: "text-ortaq-cream/55",
};

export function DiscoveryFeed() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === "tr" ? "tr-TR" : "en-GB";
  const events = siteFeedTop(ROW_LIMIT);
  const totalTraces = siteFeedCount();
  const queue = getReviewQueueBreakdown();

  return (
    <section id="kesif" className="authority-wall product-section product-divider bg-ortaq-ink-panel text-ortaq-cream">
      <Container wide>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.7fr)_minmax(220px,0.65fr)] lg:gap-10">
          <div>
            <p className={cn(typography.label, "text-ortaq-cream/45")}>{t("homeProduct.discovery.feed.label")}</p>
            <h2 className="mt-2 max-w-[18ch] font-body text-[1.625rem] font-semibold leading-[1.08] tracking-[-0.025em] text-ortaq-cream sm:text-[1.875rem]">
              {t("homeProduct.discovery.feed.title")}
            </h2>
            <p className={cn(typography.bodySm, "mt-3 max-w-xl text-ortaq-cream/65")}>{t("homeProduct.discovery.feed.lead")}</p>

            <div className="mt-5 overflow-x-auto">
              <table className="authority-table w-full min-w-[34rem] text-left">
                <thead>
                  <tr className="border-b border-white/12">
                    <th className="pb-2.5 pr-3 text-[0.6875rem] font-medium uppercase tracking-[0.06em] text-ortaq-cream/40">
                      {t("homeProduct.activity.colDate")}
                    </th>
                    <th className="pb-2.5 pr-3 text-[0.6875rem] font-medium uppercase tracking-[0.06em] text-ortaq-cream/40">
                      {t("homeProduct.activity.colCompany")}
                    </th>
                    <th className="pb-2.5 pr-3 text-[0.6875rem] font-medium uppercase tracking-[0.06em] text-ortaq-cream/40">
                      {t("homeProduct.activity.colType")}
                    </th>
                    <th className="pb-2.5 text-[0.6875rem] font-medium uppercase tracking-[0.06em] text-ortaq-cream/40">
                      {t("homeProduct.activity.colNote")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((ev, i) => {
                    const typeKey = ev.kind === "field" ? ev.type : "update";
                    return (
                      <tr
                        key={`${ev.campaignSlug}-${ev.date}-${i}`}
                        className={cn(
                          "authority-feed-row border-b border-white/8 transition-colors last:border-0",
                          i === 0 && "bg-white/[0.04]",
                        )}
                      >
                        <td className="whitespace-nowrap py-3 pr-3 align-top">
                          <span className={cn(typography.meta, "tabular-nums text-ortaq-cream/80")}>
                            {formatPulseDate(ev.date, locale)}
                          </span>
                          <span className={cn(typography.caption, "block tabular-nums text-ortaq-cream/40")}>{ev.time}</span>
                        </td>
                        <td className="py-3 pr-3 align-top">
                          <Link
                            href={`/sirket/${ev.campaignSlug}`}
                            className={cn(typography.bodySm, "font-semibold text-ortaq-cream hover:text-white hover:underline")}
                          >
                            {ev.campaignTradeName}
                          </Link>
                          <span className={cn(typography.caption, "block text-ortaq-cream/45")}>{ev.campaignCity}</span>
                        </td>
                        <td className="py-3 pr-3 align-top">
                          <span className={cn("text-[0.6875rem] font-semibold uppercase tracking-[0.05em]", typeStyles[typeKey])}>
                            {ev.kind === "field" ? t(`dossier.field.types.${ev.type}`) : t("homeProduct.activity.updateChip")}
                          </span>
                        </td>
                        <td className="py-3 align-top">
                          <p className={cn(typography.bodySm, "line-clamp-2 text-ortaq-cream/72")}>{ev.text}</p>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className={cn(typography.caption, "mt-4 text-ortaq-cream/40")}>
              {t("homeProduct.discovery.feed.archiveFootnote", { shown: events.length, total: totalTraces })}
            </p>
          </div>

          <aside className="lg:border-l lg:border-white/10 lg:pl-8">
            <p className={cn(typography.label, "text-ortaq-cream/45")}>{t("homeProduct.discovery.feed.queueLabel")}</p>
            <h3 className="mt-1 font-body text-[1.125rem] font-semibold text-ortaq-cream">{t("homeProduct.discovery.feed.queueTitle")}</h3>
            <ul className="mt-4 divide-y divide-white/10">
              {(Object.keys(queue) as Array<keyof typeof queue>).map((key) => (
                <li key={key} className="flex items-baseline justify-between gap-4 py-3">
                  <span className={cn(typography.bodySm, "text-ortaq-cream/65")}>{t(`homeProduct.discovery.queue.${key}`)}</span>
                  <span className="font-body text-[1.5rem] font-semibold tabular-nums leading-none text-ortaq-cream">
                    {queue[key]}
                  </span>
                </li>
              ))}
            </ul>
            <p className={cn(typography.caption, "mt-4 text-ortaq-cream/40")}>{t("homeProduct.discovery.feed.queueNote")}</p>
            <Link
              href="/degerlendirme"
              className={cn(typography.bodySm, "mt-4 inline-block font-semibold text-ortaq-cream/70 hover:text-ortaq-cream hover:underline")}
            >
              {t("homeProduct.discovery.feed.criteria")} →
            </Link>
          </aside>
        </div>
      </Container>
    </section>
  );
}
