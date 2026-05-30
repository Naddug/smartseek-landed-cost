"use client";

import { PublicShell } from "@/components/layout/PublicShell";
import {
  GcaHero,
  GcaProblem,
  GcaBroken,
  GcaInvisible,
  GcaEngine,
  GcaReadiness,
  GcaMatching,
  GcaAudience,
  GcaIntelligence,
  GcaTrust,
  GcaFaq,
  GcaCta,
} from "@/components/landing/gca/GcaSections";
import { HomepageFounder } from "@/components/landing/HomepageFounder";
import { HomepageContact } from "@/components/landing/HomepageContact";

/**
 * Growth Capital Access Network — yatırımcı-öncelikli, 13 bölümlük akış.
 * Sermaye daha iyi fırsatları keşfeder; şirket finanse edilebilir ve keşfedilebilir olur.
 */
export function HomePageView() {
  return (
    <PublicShell stickyCta>
      <GcaHero />
      <GcaProblem />
      <GcaBroken />
      <GcaInvisible />
      <GcaEngine />
      <GcaReadiness />
      <GcaMatching />
      <GcaAudience />
      <GcaIntelligence />
      <GcaTrust />
      <HomepageFounder />
      <GcaFaq />
      <GcaCta />
      <HomepageContact />
    </PublicShell>
  );
}
