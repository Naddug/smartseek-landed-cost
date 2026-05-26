"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Container } from "@/components/ui/Section";
import { getSectorClusters } from "@/lib/intelligence/discovery";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

export function SectorExplorer() {
  const { t } = useTranslation();
  const sectors = getSectorClusters();

  return (
    <section id="sektorler" className="authority-compression border-b border-ortaq-border bg-ortaq-surface py-5 sm:py-6">
      <Container wide>
        <div className="flex flex-wrap items-end justify-between gap-3 mb-4">
          <div>
            <p className={typography.label}>{t("homeProduct.discovery.sectors.label")}</p>
            <h2 className={cn(typography.h1, "mt-1")}>{t("homeProduct.discovery.sectors.title")}</h2>
          </div>
          <Link href="#dosyalar" className={cn(typography.bodySm, "font-semibold text-ortaq-trust-muted hover:text-ortaq-trust hover:underline")}>
            {t("homeProduct.discovery.sectors.browse")} →
          </Link>
        </div>

        <div className="authority-sector-rail divide-y divide-ortaq-border border-y border-ortaq-border-strong">
          {sectors.map((sector) => (
            <Link
              key={sector.id}
              href="#dosyalar"
              className="group grid gap-3 py-4 transition-colors hover:bg-ortaq-bg-alt/80 sm:grid-cols-[3.5rem_1fr_auto] sm:items-baseline sm:gap-6 sm:py-5"
            >
              <span className="font-body text-[1.75rem] font-semibold tabular-nums leading-none text-ortaq-trust sm:text-[2rem]">
                {sector.count}
              </span>
              <div className="min-w-0">
                <p className={cn(typography.bodySm, "font-semibold text-ortaq-ink")}>{sector.label}</p>
                <p className={cn(typography.caption, "mt-0.5")}>{sector.cities.join(" · ")}</p>
                {sector.sampleTension && (
                  <p className={cn(typography.caption, "mt-2 line-clamp-2 font-medium text-ortaq-ink-muted group-hover:text-ortaq-ink")}>
                    {sector.sampleTension}
                  </p>
                )}
              </div>
              <span className={cn(typography.caption, "font-semibold text-ortaq-trust-muted group-hover:text-ortaq-trust group-hover:underline sm:text-right")}>
                {t("homeProduct.discovery.sectors.explore")} →
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
