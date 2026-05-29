"use client";

import { PublicShell } from "@/components/layout/PublicShell";
import { HeroPlate } from "@/components/product/HeroPlate";
import { HomepageWhyOrtaq } from "@/components/landing/HomepageWhyOrtaq";
import { HomepageHowItWorks } from "@/components/landing/HomepageHowItWorks";
import { HomepageAudience } from "@/components/landing/HomepageAudience";
import { HomepageRegulatoryFrame } from "@/components/landing/HomepageRegulatoryFrame";
import { HomepageContact } from "@/components/landing/HomepageContact";

/** Ana sayfa: az bölüm, tek görsel, net metin. */
export function HomePageView() {
  return (
    <PublicShell stickyCta>
      <HeroPlate />
      <HomepageWhyOrtaq />
      <HomepageHowItWorks />
      <HomepageAudience />
      <HomepageRegulatoryFrame />
      <HomepageContact />
    </PublicShell>
  );
}
