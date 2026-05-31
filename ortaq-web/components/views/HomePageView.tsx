"use client";

import { PublicShell } from "@/components/layout/PublicShell";
import {
  GcaHero,
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
 * Growth Capital Access Network — 9 bölüm, her bölüm tek soru.
 * Dışa: Access · İç moat: Readiness · Güven: Validation.
 */
export function HomePageView() {
  return (
    <PublicShell stickyCta>
      <GcaHero />
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
