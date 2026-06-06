"use client";

import { useTranslation } from "react-i18next";
import { cn } from "@/lib/cn";
import { typography } from "@/design/typography";
import { Container } from "@/components/ui/Section";
import { PublicShell } from "@/components/layout/PublicShell";
import { CorridorCard } from "@/components/trade/CorridorCard";

export function CorridorsPageView() {
  const { t } = useTranslation();

  return (
    <PublicShell>
      {/* Header */}
      <section className="bg-ortaq-surface border-b border-ortaq-border">
        <Container wide>
          <div className="py-12 sm:py-16">
            <p className={cn(typography.label, "mb-3 text-ortaq-ink-soft")}>
              {t("trade.corridors.label")}
            </p>
            <h1 className={cn(typography.display, "mb-3 max-w-2xl")}>
              {t("trade.corridors.headline")}
            </h1>
            <p className={cn(typography.body, "max-w-xl")}>
              {t("trade.corridors.sub")}
            </p>
          </div>
        </Container>
      </section>

      {/* Corridor cards */}
      <section className="bg-ortaq-bg">
        <Container wide>
          <div className="py-10 sm:py-14">
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <CorridorCard corridor="asean" />
              <CorridorCard corridor="gulf" />
              <CorridorCard corridor="europe" />
            </div>
          </div>
        </Container>
      </section>
    </PublicShell>
  );
}
