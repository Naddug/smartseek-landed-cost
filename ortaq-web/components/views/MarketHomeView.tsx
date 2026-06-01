"use client";

import { PublicShell } from "@/components/layout/PublicShell";
import { MarketTerminalHero } from "@/components/market/MarketTerminalHero";
import { MarketCoveragePanel } from "@/components/market/MarketCoveragePanel";
import { MarketActivityTape } from "@/components/market/MarketActivityTape";
import { MarketSectorFlow } from "@/components/market/MarketSectorFlow";
import { MarketIntelligencePanel } from "@/components/market/MarketIntelligencePanel";

/**
 * Layer 1 — Market homepage.
 * Priority: companies → activity → sectors → movement. No ORTAQ pitch, no contact form.
 */
export function MarketHomeView() {
  return (
    <PublicShell stickyCta headerOverlay={false}>
      <MarketTerminalHero />
      <MarketCoveragePanel />
      <MarketActivityTape />
      <MarketSectorFlow />
      <MarketIntelligencePanel />
    </PublicShell>
  );
}
