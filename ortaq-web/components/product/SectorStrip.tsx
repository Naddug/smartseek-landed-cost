"use client";

import { useTranslation } from "react-i18next";
import { Container } from "@/components/ui/Section";
import { getSectorClusters } from "@/lib/intelligence/discovery";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

export function SectorStrip() {
  const { t } = useTranslation();
  const sectors = getSectorClusters();

  if (sectors.length === 0) return null;

  return (
    <section
      className="border-b border-ortaq-border bg-ortaq-surface"
      aria-label={t("discovery.sectors.aria")}
    >
      <Container wide>
        <div className="flex flex-wrap items-baseline justify-between gap-2 py-4 sm:py-5">
          <p className={typography.label}>{t("discovery.sectors.label")}</p>
          <p className={cn(typography.caption, "text-ortaq-ink-soft")}>
            {t("discovery.sectors.coverage", { count: sectors.length })}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2 pb-5 sm:grid-cols-4 sm:pb-6 lg:grid-cols-5">
          {sectors.map((sector) => (
            <div
              key={sector.id}
              className="rounded-ortaq-md border border-ortaq-border bg-ortaq-bg-alt/40 px-3 py-3"
            >
              <div className="flex items-baseline justify-between gap-2">
                <p className={cn(typography.bodySm, "font-medium text-ortaq-ink")}>{sector.label}</p>
                <span className="text-[0.8125rem] font-medium tabular-nums text-ortaq-ink">
                  {sector.count}
                </span>
              </div>
              <p className={cn(typography.caption, "mt-1 truncate")}>
                {sector.cities.length > 0
                  ? sector.cities.join(" · ")
                  : t("discovery.sectors.noCities")}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
