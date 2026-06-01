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
import { HomepageTeam } from "@/components/landing/HomepageTeam";
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
      <HomepageTeam />
      <GcaCta />
      <HomepageContact />
    </PublicShell>
  );
}
