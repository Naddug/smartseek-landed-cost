"use client";

import { useTranslation } from "react-i18next";
import { Container } from "@/components/ui/Section";
import { getMarketPulse } from "@/lib/market/pulse";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

export function MarketCatalogHeader() {
  const { t } = useTranslation();
  const pulse = getMarketPulse();

  return (
    <section className="intel-band-ink border-b border-white/10">
      <Container wide className="py-6 sm:py-8">
        <p className={cn(typography.label, "text-ortaq-cream/50")}>{t("market.catalog.label")}</p>
        <h1 className="mt-1 text-[1.375rem] font-semibold tracking-[-0.02em] text-ortaq-cream sm:text-[1.625rem]">
          {t("market.catalog.title")}
        </h1>
        <p className={cn(typography.bodySm, "mt-2 max-w-xl text-ortaq-cream/65")}>{t("market.catalog.lead")}</p>
        <p className={cn(typography.caption, "mt-3 font-mono tabular-nums text-ortaq-cream/45")}>
          {t("market.catalog.pulse", {
            coverage: pulse.coverage,
            sectors: pulse.sectorCount,
          })}
        </p>
      </Container>
    </section>
  );
}
