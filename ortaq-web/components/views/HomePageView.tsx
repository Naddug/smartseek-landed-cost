"use client";

import { PublicShell } from "@/components/layout/PublicShell";
import { HeroPlate } from "@/components/product/HeroPlate";
import { HomepageStoryStrip } from "@/components/landing/HomepageStoryStrip";
import { HomepageInvestorLens } from "@/components/landing/HomepageInvestorLens";
import { HomepageSampleDossier } from "@/components/landing/HomepageSampleDossier";
import { HomepagePlatformShowcase } from "@/components/landing/HomepagePlatformShowcase";
import { HomepageEarningsExplainer } from "@/components/landing/HomepageEarningsExplainer";
import { HomepageQuickFaq } from "@/components/landing/HomepageQuickFaq";
import { HomepageRegulatoryFrame } from "@/components/landing/HomepageRegulatoryFrame";
import { HomepageContact } from "@/components/landing/HomepageContact";

export function HomePageView() {
  return (
    <PublicShell stickyCta>
      <HeroPlate />
      <HomepageStoryStrip />
      <HomepageInvestorLens />
      <HomepageSampleDossier />
      <HomepagePlatformShowcase />
      <HomepageEarningsExplainer />
      <HomepageQuickFaq />
      <HomepageRegulatoryFrame />
      <HomepageContact />
    </PublicShell>
  );
}
