"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { CompanyCard } from "@/components/product/CompanyCard";
import { Container } from "@/components/ui/Section";
import { listCampaigns } from "@/lib/campaigns";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

const FEATURED_COUNT = 6;

export function HomeFeaturedProfiles() {
  const { t } = useTranslation();
  const campaigns = listCampaigns().slice(0, FEATURED_COUNT);

  return (
    <section className="border-b border-ortaq-border bg-ortaq-bg" aria-labelledby="featured-profiles-title">
      <Container wide className="py-10 sm:py-12">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className={cn(typography.label, "text-ortaq-ink-soft")}>{t("discovery.home.featured.label")}</p>
            <h2 id="featured-profiles-title" className="mt-2 text-[1.375rem] font-semibold tracking-[-0.02em] text-ortaq-ink sm:text-[1.625rem]">
              {t("discovery.home.featured.title")}
            </h2>
            <p className={cn(typography.bodySm, "mt-2 max-w-xl text-ortaq-ink-muted")}>{t("discovery.home.featured.lead")}</p>
          </div>
          <Link href="/kesfet" className={cn(typography.bodySm, typography.link, "shrink-0 font-semibold")}>
            {t("discovery.home.featured.link")} →
          </Link>
        </div>

        <div className="-mx-4 mt-8 flex gap-3 overflow-x-auto px-4 pb-2 snap-x snap-mandatory sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-4 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-3">
          {campaigns.map((c) => (
            <CompanyCard key={c.slug} campaign={c} featured />
          ))}
        </div>
      </Container>
    </section>
  );
}
