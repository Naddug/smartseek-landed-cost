"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Container } from "@/components/ui/Section";
import { listMarketIntelligenceSignals } from "@/lib/market/signals";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

export function MarketIntelligencePanel() {
  const { t } = useTranslation();
  const signals = listMarketIntelligenceSignals(6);

  return (
    <section className="border-b border-ortaq-border bg-ortaq-surface" aria-labelledby="market-intel-title">
      <Container wide className="py-8 sm:py-10">
        <p className={typography.label}>{t("market.intelligence.label")}</p>
        <h2 id="market-intel-title" className="mt-2 text-[1.25rem] font-semibold tracking-[-0.02em] text-ortaq-ink sm:text-[1.375rem]">
          {t("market.intelligence.title")}
        </h2>
        <p className={cn(typography.bodySm, "mt-2 max-w-xl text-ortaq-ink-muted")}>{t("market.intelligence.lead")}</p>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[32rem] border-collapse text-left">
            <thead>
              <tr className="border-b border-ortaq-border">
                <th className={cn(typography.caption, "pb-2 pr-4 font-medium text-ortaq-ink-soft")}>
                  {t("market.intelligence.colSector")}
                </th>
                <th className={cn(typography.caption, "pb-2 pr-4 font-medium text-ortaq-ink-soft")}>
                  {t("market.intelligence.colSignal")}
                </th>
                <th className={cn(typography.caption, "pb-2 font-medium text-ortaq-ink-soft")}>
                  {t("market.intelligence.colCoverage")}
                </th>
              </tr>
            </thead>
            <tbody>
              {signals.map((row) => (
                <tr key={row.slug} className="border-b border-ortaq-border last:border-0">
                  <td className={cn(typography.caption, "py-3 pr-4 align-top font-medium text-ortaq-ink-muted")}>
                    {row.sector}
                  </td>
                  <td className={cn(typography.bodySm, "py-3 pr-4 align-top text-ortaq-ink")}>{row.signal}</td>
                  <td className="py-3 align-top">
                    <Link
                      href={`/sirket/${row.slug}`}
                      className={cn(typography.caption, "font-semibold text-ortaq-trust-muted hover:underline")}
                    >
                      {row.entity} →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Container>
    </section>
  );
}
