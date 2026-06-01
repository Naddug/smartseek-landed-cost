"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { PublicShell } from "@/components/layout/PublicShell";
import { CompanyCard } from "@/components/product/CompanyCard";
import { Container } from "@/components/ui/Section";
import { listCampaigns } from "@/lib/campaigns";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";
import { RelatedLinks } from "@/components/seo/RelatedLinks";

/** @deprecated Legacy crowdfunding company list — noindex, removed from nav. */
export function CompaniesListView() {
  const { t } = useTranslation();
  const campaigns = listCampaigns();

  return (
    <PublicShell stickyCta={false}>
      <section className="border-b border-ortaq-border bg-ortaq-surface">
        <Container wide>
          <div className="py-6 sm:py-8">
            <p className={typography.label}>{t("discovery.catalog.label")}</p>
            <h1 className={cn(typography.h1, "mt-1")}>{t("discovery.catalog.title")}</h1>
            <p className={cn(typography.bodySm, "mt-1.5 max-w-xl")}>{t("discovery.catalog.lead")}</p>
          </div>
        </Container>
      </section>

      <section className="product-section bg-ortaq-bg">
        <Container wide>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
            {campaigns.map((c) => (
              <CompanyCard key={c.slug} campaign={c} />
            ))}
          </div>
          <p className={cn(typography.caption, "mt-6 text-ortaq-ink-soft")}>{t("discovery.catalog.legalStrip")}</p>
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
