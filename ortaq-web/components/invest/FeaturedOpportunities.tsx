"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Container } from "@/components/ui/Section";
import { OpportunityCard } from "@/components/invest/OpportunityCard";
import { listCampaigns } from "@/lib/campaigns";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

const HOMEPAGE_LIMIT = 8;

export function FeaturedOpportunities() {
  const { t } = useTranslation();
  const all = listCampaigns();
  const visible = all.slice(0, HOMEPAGE_LIMIT);

  return (
    <section id="firsatlar" className="product-section overflow-x-clip bg-ortaq-bg">
      <Container wide>
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className={typography.label}>{t("homeProduct.invest.opportunities.label")}</p>
            <h2 className={cn(typography.h1, "mt-1 text-[1.5rem] sm:text-[1.625rem]")}>
              {t("homeProduct.invest.opportunities.title")}
            </h2>
            <p className={cn(typography.bodySm, "mt-2 max-w-2xl")}>{t("homeProduct.invest.opportunities.lead")}</p>
            <p className={cn(typography.caption, "mt-2 max-w-2xl font-medium text-ortaq-ink-muted")}>
              {t("homeProduct.invest.opportunities.capitalLead")}
            </p>
            <p className={cn(typography.caption, "mt-2 font-medium text-ortaq-trust-muted")}>
              {t("homeProduct.invest.opportunities.count", { count: all.length, shown: visible.length })}
            </p>
          </div>
          <Link
            href="/sirketler"
            className={cn(typography.bodySm, "inline-flex min-h-10 shrink-0 items-center font-semibold text-ortaq-trust hover:underline")}
          >
            {t("homeProduct.invest.opportunities.viewAll")} →
          </Link>
        </div>

        <div className="product-scroll-row invest-opportunity-row -mx-4 flex gap-3 overflow-x-auto px-4 pb-1 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-4 sm:overflow-visible sm:px-0 lg:grid-cols-4 lg:gap-5">
          {visible.map((c, i) => (
            <OpportunityCard
              key={c.slug}
              campaign={c}
              featured={i === 0}
              priority={i === 0}
              className="w-[calc(100vw-2.5rem)] max-w-[20rem] shrink-0 snap-start sm:w-auto sm:max-w-none sm:shrink"
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
