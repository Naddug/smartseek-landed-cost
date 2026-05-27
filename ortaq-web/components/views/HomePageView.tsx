"use client";

import { PublicShell } from "@/components/layout/PublicShell";
import { HomepageMasthead } from "@/components/product/HomepageMasthead";
import { HomepageMarketLayer } from "@/components/product/HomepageMarketLayer";
import { HomepageMechanics } from "@/components/product/HomepageMechanics";
import { DossierIndex } from "@/components/product/DossierIndex";
import { ReviewActivityTable } from "@/components/product/ReviewActivityTable";
import { ProductVerificationSection } from "@/components/product/ProductVerificationSection";
import { ProductCtaSection } from "@/components/product/ProductClosing";
import { Container } from "@/components/ui/Section";
import { RelatedLinks } from "@/components/seo/RelatedLinks";

export function HomePageView() {
  return (
    <PublicShell stickyCta>
      <HomepageMasthead />
      <HomepageMarketLayer />
      <HomepageMechanics />
      <DossierIndex />
      <ReviewActivityTable />
      <ProductVerificationSection />
      <ProductCtaSection />
      <section className="border-t border-ortaq-border bg-ortaq-bg pb-2">
        <Container wide className="py-6 sm:py-8">
          <RelatedLinks route="home" compact />
        </Container>
      </section>
    </PublicShell>
  );
}
