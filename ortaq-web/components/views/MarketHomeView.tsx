"use client";

import { PublicShell } from "@/components/layout/PublicShell";
import { MarketPulseBar } from "@/components/market/MarketPulseBar";
import { MarketCoveragePanel } from "@/components/market/MarketCoveragePanel";
import { MarketActivityTape } from "@/components/market/MarketActivityTape";
import { MarketSectorFlow } from "@/components/market/MarketSectorFlow";
import { MarketIntelligencePanel } from "@/components/market/MarketIntelligencePanel";

/** Layer 1 — Market: companies and movement first; investor/process copy lives on /investors. */
export function MarketHomeView() {
  return (
    <PublicShell stickyCta headerOverlay={false}>
      <MarketPulseBar />
      <MarketCoveragePanel />
      <MarketActivityTape />
      <MarketSectorFlow />
      <MarketIntelligencePanel />
    </PublicShell>
  );
}
