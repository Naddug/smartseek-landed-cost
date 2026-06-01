"use client";

import { PublicShell } from "@/components/layout/PublicShell";
import { InstitutionalHero } from "@/components/institutional/InstitutionalHero";
import { InstitutionalThesis } from "@/components/institutional/InstitutionalThesis";
import { InstitutionalProcess } from "@/components/institutional/InstitutionalProcess";
import { HomeFeaturedProfiles } from "@/components/discovery/HomeFeaturedProfiles";
import { DiscoveryRecentUpdates } from "@/components/discovery/DiscoveryRecentUpdates";
import { OperatorTrustLine } from "@/components/discovery/OperatorTrustLine";
import { HomepageContact } from "@/components/landing/HomepageContact";

/** Homepage: clear thesis, credible layout, product as proof — not a fake market terminal. */
export function InstitutionalHomeView() {
  return (
    <PublicShell stickyCta headerOverlay={false}>
      <InstitutionalHero />
      <InstitutionalThesis />
      <InstitutionalProcess />
      <HomeFeaturedProfiles />
      <DiscoveryRecentUpdates />
      <OperatorTrustLine />
      <HomepageContact />
    </PublicShell>
  );
}
