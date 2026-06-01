"use client";

import { PublicShell } from "@/components/layout/PublicShell";
import {
  GcaHero,
  GcaVerification,
  GcaCategoryClarity,
  GcaWhatIs,
  GcaWhyFails,
  GcaAudience,
  GcaHowItWorks,
  GcaTrust,
  GcaModel,
  GcaCta,
} from "@/components/landing/gca/GcaSections";
import { HomepageFounder } from "@/components/landing/HomepageFounder";
import { HomepageContact } from "@/components/landing/HomepageContact";

/**
 * Growth Capital Access Network — belge, kanıt, keşif, tanıştırma, görüşme odası.
 */
export function HomePageView() {
  return (
    <PublicShell stickyCta>
      <GcaHero />
      <GcaVerification />
      <GcaCategoryClarity />
      <GcaWhatIs />
      <GcaWhyFails />
      <GcaAudience />
      <GcaHowItWorks />
      <GcaTrust />
      <GcaModel />
      <HomepageFounder />
      <GcaCta />
      <HomepageContact />
    </PublicShell>
  );
}
