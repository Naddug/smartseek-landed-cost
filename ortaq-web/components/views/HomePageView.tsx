"use client";

import { PublicShell } from "@/components/layout/PublicShell";
import { HeroPlate } from "@/components/product/HeroPlate";
import { HomepageInstantBrief } from "@/components/landing/HomepageInstantBrief";
import { HomepageHowItWorks } from "@/components/landing/HomepageHowItWorks";
import { HomepagePlatformShowcase } from "@/components/landing/HomepagePlatformShowcase";
import { HomepageEarningsExplainer } from "@/components/landing/HomepageEarningsExplainer";
import { HomepageForCompanies } from "@/components/landing/HomepageForCompanies";
import { HomepageRegulatoryFrame } from "@/components/landing/HomepageRegulatoryFrame";
import { HomepageContact } from "@/components/landing/HomepageContact";

export function HomePageView() {
  return (
    <PublicShell stickyCta>
      <HeroPlate />
      <HomepageInstantBrief />
      <HomepageHowItWorks />
      <HomepagePlatformShowcase />
      <HomepageEarningsExplainer />
      <HomepageForCompanies />
      <HomepageRegulatoryFrame />
      <HomepageContact />
    </PublicShell>
  );
}
