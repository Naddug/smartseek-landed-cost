"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Container } from "@/components/ui/Section";
import { getSectorClusters } from "@/lib/intelligence/discovery";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

const CHIP_IDS = ["machinery", "food", "textile", "chemicals", "logistics"] as const;

export function MarketSectorFlow() {
  const { t } = useTranslation();
  const clusters = getSectorClusters();
  const byId = Object.fromEntries(clusters.map((c) => [c.id, c]));

  return (
    <section className="border-b border-ortaq-border bg-ortaq-bg" aria-label={t("market.sectorFlow.aria")}>
      <Container wide className="py-4 sm:py-5">
        <p className={cn(typography.caption, "text-ortaq-ink-soft")}>{t("market.sectorFlow.label")}</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {CHIP_IDS.map((id) => {
            const cluster = byId[id];
            if (!cluster?.count) return null;
            return (
              <Link
                key={id}
                href={`/kesfet?sector=${id}`}
                className={cn(typography.caption, "rounded-ortaq-sm border border-ortaq-border bg-ortaq-surface px-2.5 py-1.5 font-medium text-ortaq-ink transition-colors hover:border-ortaq-border-strong")}
              >
                {t(`discovery.home.sectorChips.${id}`)}
              </Link>
            );
          })}
          <Link
            href="/kesfet"
            className={cn(typography.caption, "px-1 py-1.5 font-medium text-ortaq-ink-soft hover:text-ortaq-ink hover:underline")}
          >
            {t("market.sectorFlow.fullTape")} →
          </Link>
        </div>
      </Container>
    </section>
  );
}
