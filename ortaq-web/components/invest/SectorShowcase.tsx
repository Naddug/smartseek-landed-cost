"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Factory, Leaf, Cog, UtensilsCrossed } from "lucide-react";
import { Container } from "@/components/ui/Section";
import { getSectorClusters } from "@/lib/intelligence/discovery";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

const sectorIcons: Record<string, typeof Factory> = {
  machinery: Cog,
  textile: Factory,
  food: UtensilsCrossed,
  metal: Leaf,
};

export function SectorShowcase() {
  const { t } = useTranslation();
  const sectors = getSectorClusters();

  return (
    <section className="border-y border-ortaq-border bg-ortaq-surface py-6 sm:py-8">
      <Container wide>
        <p className={typography.label}>{t("homeProduct.invest.sectors.label")}</p>
        <h2 className={cn(typography.h1, "mt-1")}>{t("homeProduct.invest.sectors.title")}</h2>
        <p className={cn(typography.bodySm, "mt-2 max-w-2xl text-ortaq-ink-muted")}>{t("homeProduct.invest.sectors.lead")}</p>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {sectors.map((sector) => {
            const Icon = sectorIcons[sector.id] ?? Factory;
            return (
              <Link
                key={sector.id}
                href="#firsatlar"
                className="invest-sector-card group rounded-ortaq-lg border border-ortaq-border/90 bg-gradient-to-br from-ortaq-surface to-ortaq-bg-alt p-5 shadow-[var(--shadow-elevated)] transition-[box-shadow,transform,border-color] duration-200 hover:-translate-y-0.5 hover:border-ortaq-trust/20 hover:shadow-[var(--shadow-elevated-hover)]"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-ortaq-md bg-ortaq-trust-soft text-ortaq-trust">
                  <Icon className="h-5 w-5" strokeWidth={1.75} />
                </div>
                <p className={cn(typography.bodySm, "mt-3 font-semibold text-ortaq-ink")}>{sector.label}</p>
                <p className={cn(typography.metric, "mt-1 text-[1.375rem] text-ortaq-trust")}>{sector.count}</p>
                <p className={cn(typography.caption, "mt-1")}>{sector.cities.join(" · ")}</p>
                {sector.sampleTension && (
                  <p className={cn(typography.caption, "mt-2 line-clamp-2 font-medium text-ortaq-ink-muted group-hover:text-ortaq-ink")}>
                    {sector.sampleTension}
                  </p>
                )}
                <p className={cn(typography.caption, "mt-2 font-medium text-ortaq-trust-muted group-hover:underline")}>
                  {t("homeProduct.invest.sectors.explore")} →
                </p>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
