"use client";

import { PublicShell } from "@/components/layout/PublicShell";
import { DiscoveryHomeHero } from "@/components/discovery/DiscoveryHomeHero";
import { SectorNavChips } from "@/components/discovery/SectorNavChips";
import { DiscoveryRecentUpdates } from "@/components/discovery/DiscoveryRecentUpdates";
import { OperatorTrustLine } from "@/components/discovery/OperatorTrustLine";
import { HomeFeaturedProfiles } from "@/components/discovery/HomeFeaturedProfiles";
import { MarketRoleLine } from "@/components/discovery/MarketRoleLine";
import { DiscoveryFeed } from "@/components/discovery/DiscoveryFeed";
import { HomepageContact } from "@/components/landing/HomepageContact";

export function DiscoveryHomeView() {
  return (
    <PublicShell stickyCta headerOverlay={false}>
      <DiscoveryHomeHero />
      <SectorNavChips />
      <DiscoveryRecentUpdates />
      <OperatorTrustLine />
      <HomeFeaturedProfiles />
      <MarketRoleLine />
      <DiscoveryFeed />
      <HomepageContact />
    </PublicShell>
  );
}
