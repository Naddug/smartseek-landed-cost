"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { PublicShell } from "@/components/layout/PublicShell";
import { CompanyCard } from "@/components/product/CompanyCard";
import { CatalogPageHeader } from "@/components/catalog/CatalogPageHeader";
import { SectorNavChips } from "@/components/discovery/SectorNavChips";
import { Container } from "@/components/ui/Section";
import { listCampaigns } from "@/lib/campaigns";
import { sectorMatchers } from "@/lib/product/home-data";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";
import { RelatedLinks } from "@/components/seo/RelatedLinks";

const FILTERABLE_SECTORS = ["machinery", "food", "textile", "chemicals", "logistics"] as const;

type SectorFilter = (typeof FILTERABLE_SECTORS)[number];

function isSectorFilter(value: string | null): value is SectorFilter {
  return value !== null && (FILTERABLE_SECTORS as readonly string[]).includes(value);
}

export function CompaniesListView() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const sectorParam = searchParams.get("sector");
  const sectorFilter = isSectorFilter(sectorParam) ? sectorParam : null;

  const campaigns = useMemo(() => {
    const all = listCampaigns();
    if (!sectorFilter) return all;
    const matcher = sectorMatchers[sectorFilter];
    return matcher ? all.filter((c) => matcher.test(c.sector)) : all;
  }, [sectorFilter]);

  return (
    <PublicShell stickyCta={false}>
      <CatalogPageHeader />
      <SectorNavChips />

      <section className="product-section bg-ortaq-bg">
        <Container wide>
          {sectorFilter ? (
            <p className={cn(typography.caption, "mb-4 text-ortaq-ink-soft")}>
              {t("discovery.catalog.sectorFilter", {
                sector: t(`discovery.home.sectorChips.${sectorFilter}`),
                count: campaigns.length,
              })}
            </p>
          ) : null}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
            {campaigns.length === 0 ? (
              <p className={cn(typography.bodySm, "text-ortaq-ink-muted")}>{t("discovery.catalog.empty")}</p>
            ) : (
              campaigns.map((c) => <CompanyCard key={c.slug} campaign={c} />)
            )}
          </div>
          <p className={cn(typography.caption, "mt-6 text-ortaq-ink-soft")}>{t("market.catalog.legalStrip")}</p>
          <Link href="/degerlendirme" className={cn(typography.bodySm, typography.link, "mt-3 inline-block")}>
            {t("discovery.catalog.evalLink")} →
          </Link>
          <div className="mt-10">
            <RelatedLinks route="kesfet" />
          </div>
        </Container>
      </section>
    </PublicShell>
  );
}
