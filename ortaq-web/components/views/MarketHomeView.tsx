"use client";

import { PublicShell } from "@/components/layout/PublicShell";
import { MarketTerminalHero } from "@/components/market/MarketTerminalHero";
import { MarketSectorFlow } from "@/components/market/MarketSectorFlow";
import { MarketActivityTape } from "@/components/market/MarketActivityTape";
import { MarketIntelligencePanel } from "@/components/market/MarketIntelligencePanel";
import { MarketCoveragePanel } from "@/components/market/MarketCoveragePanel";
import { MarketInfrastructureBar } from "@/components/market/MarketInfrastructureBar";
import { HomepageContact } from "@/components/landing/HomepageContact";

/** Homepage: private market terminal (movement-first, not company directory). */
export function MarketHomeView() {
  return (
    <PublicShell stickyCta headerOverlay={false}>
      <MarketTerminalHero />
      <MarketSectorFlow />
      <MarketActivityTape />
      <MarketIntelligencePanel />
      <MarketCoveragePanel />
      <MarketInfrastructureBar />
      <HomepageContact />
    </PublicShell>
  );
}
