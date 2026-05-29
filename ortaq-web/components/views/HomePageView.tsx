"use client";

import { PublicShell } from "@/components/layout/PublicShell";
import { HeroPlate } from "@/components/product/HeroPlate";
import { HomepageProblem } from "@/components/landing/HomepageProblem";
import { HomepageHowItWorks } from "@/components/landing/HomepageHowItWorks";
import { HomepageAiNarrative } from "@/components/landing/HomepageAiNarrative";
import { HomepageForCompanies } from "@/components/landing/HomepageForCompanies";
import { HomepageForInvestors } from "@/components/landing/HomepageForInvestors";
import { HomepageCompliance } from "@/components/landing/HomepageCompliance";
import { HomepageContact } from "@/components/landing/HomepageContact";

export function HomePageView() {
  return (
    <PublicShell stickyCta>
      <HeroPlate />
      <HomepageProblem />
      <HomepageHowItWorks />
      <HomepageAiNarrative />
      <HomepageForCompanies />
      <HomepageForInvestors />
      <HomepageCompliance />
      <HomepageContact />
    </PublicShell>
  );
}
