"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { CompanyCard } from "@/components/product/CompanyCard";
import { Container } from "@/components/ui/Section";
import { listCampaigns } from "@/lib/campaigns";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

const COVERAGE_LIMIT = 6;

export function MarketCoveragePanel() {
  const { t } = useTranslation();
  const entries = listCampaigns().slice(0, COVERAGE_LIMIT);

  return (
    <section className="border-b border-ortaq-border bg-ortaq-bg" aria-labelledby="market-coverage-title">
      <Container wide className="py-8 sm:py-10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 id="market-coverage-title" className="text-[1.25rem] font-semibold tracking-[-0.02em] text-ortaq-ink sm:text-[1.375rem]">
              {t("market.coverage.title")}
            </h2>
          </div>
          <Link href="/kesfet" className={cn(typography.bodySm, typography.link, "shrink-0 font-semibold")}>
            {t("market.coverage.link")} →
          </Link>
        </div>

        <div className="-mx-4 mt-6 flex gap-3 overflow-x-auto px-4 pb-2 snap-x snap-mandatory sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-4 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-3">
          {entries.map((c) => (
            <CompanyCard key={c.slug} campaign={c} featured />
          ))}
        </div>
      </Container>
    </section>
  );
}
