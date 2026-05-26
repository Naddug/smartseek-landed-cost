"use client";

import { PublicShell } from "@/components/layout/PublicShell";
import { InvestHero } from "@/components/invest/InvestHero";
import { FeaturedOpportunities } from "@/components/invest/FeaturedOpportunities";
import { SectorShowcase } from "@/components/invest/SectorShowcase";
import { HowItWorks } from "@/components/invest/HowItWorks";
import { ActivityPreview } from "@/components/invest/ActivityPreview";
import { TrustBand } from "@/components/invest/TrustBand";
import { InvestFaq } from "@/components/invest/InvestFaq";
import { InvestCta } from "@/components/invest/InvestCta";
import { Container } from "@/components/ui/Section";
import { RelatedLinks } from "@/components/seo/RelatedLinks";

export function HomePageView() {
  return (
    <PublicShell stickyCta>
      <InvestHero />
      <FeaturedOpportunities />
      <SectorShowcase />
      <HowItWorks />
      <ActivityPreview />
      <TrustBand />
      <InvestFaq />
      <InvestCta />
      <section className="border-t border-ortaq-border bg-ortaq-bg pb-2">
        <Container wide className="py-6 sm:py-8">
          <RelatedLinks route="home" compact />
        </Container>
      </section>
    </PublicShell>
  );
}
