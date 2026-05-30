"use client";

import { PublicShell } from "@/components/layout/PublicShell";
import { HeroPlate } from "@/components/product/HeroPlate";
import { HomepageWhyNow } from "@/components/landing/HomepageWhyNow";
import { HomepageEditorial } from "@/components/landing/HomepageEditorial";
import { HomepageWhyOrtaq } from "@/components/landing/HomepageWhyOrtaq";
import { HomepageInvestObject } from "@/components/landing/HomepageInvestObject";
import { HomepageDossierPreview } from "@/components/landing/HomepageDossierPreview";
import { HomepageHowItWorks } from "@/components/landing/HomepageHowItWorks";
import { HomepageAudience } from "@/components/landing/HomepageAudience";
import { HomepageMoneyFlow } from "@/components/landing/HomepageMoneyFlow";
import { HomepageFounder } from "@/components/landing/HomepageFounder";
import { HomepageRegulatoryFrame } from "@/components/landing/HomepageRegulatoryFrame";
import { HomepageContact } from "@/components/landing/HomepageContact";

/** Ana sayfa: az bölüm, tek görsel, net metin. */
export function HomePageView() {
  return (
    <PublicShell stickyCta>
      <HeroPlate />
      <HomepageWhyNow />
      <HomepageEditorial />
      <HomepageWhyOrtaq />
      <HomepageInvestObject />
      <HomepageDossierPreview />
      <HomepageHowItWorks />
      <HomepageAudience />
      <HomepageMoneyFlow />
      <HomepageRegulatoryFrame />
      <HomepageContact />
      <HomepageFounder />
    </PublicShell>
  );
}
