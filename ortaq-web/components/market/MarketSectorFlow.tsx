"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Container } from "@/components/ui/Section";
import { getSectorClusters } from "@/lib/intelligence/discovery";
import { countFeedBySectorCluster } from "@/lib/market/feed-rhythm";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

const CHIP_IDS = ["machinery", "food", "textile", "chemicals", "logistics"] as const;

export function MarketSectorFlow() {
  const { t } = useTranslation();
  const clusters = getSectorClusters();
  const byId = Object.fromEntries(clusters.map((c) => [c.id, c]));
  const feedBySector = countFeedBySectorCluster(14);

  return (
    <section className="border-b border-ortaq-border bg-ortaq-bg-alt" aria-label={t("market.sectorFlow.aria")}>
      <Container wide className="py-4 sm:py-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className={cn(typography.label, "text-ortaq-ink-soft")}>{t("market.sectorFlow.label")}</p>
          <Link href="/kesfet" className={cn(typography.caption, typography.link, "font-medium")}>
            {t("market.sectorFlow.fullTape")} →
          </Link>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {CHIP_IDS.map((id) => {
            const cluster = byId[id];
            const count = cluster?.count ?? 0;
            const recent = feedBySector[id] ?? 0;
            return (
              <Link
                key={id}
                href={`/kesfet?sector=${id}`}
                className="inline-flex items-center gap-2 rounded-ortaq-sm border border-ortaq-border bg-ortaq-surface px-2.5 py-1.5 transition-colors hover:border-ortaq-border-strong"
              >
                <span className={cn(typography.caption, "font-medium text-ortaq-ink")}>
                  {t(`discovery.home.sectorChips.${id}`)}
                </span>
                <span className="font-mono text-[0.6875rem] font-semibold tabular-nums text-ortaq-trust-muted">
                  {count}
                </span>
                {recent > 0 ? (
                  <span className="text-[0.625rem] tabular-nums text-ortaq-ink-soft">
                    {t("market.sectorFlow.recent", { count: recent })}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
