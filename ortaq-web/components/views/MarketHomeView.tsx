"use client";

import { PublicShell } from "@/components/layout/PublicShell";
import { MarketPulseBar } from "@/components/market/MarketPulseBar";
import { MarketActivityTape } from "@/components/market/MarketActivityTape";
import { MarketInfrastructureBar } from "@/components/market/MarketInfrastructureBar";
import { MarketCoveragePanel } from "@/components/market/MarketCoveragePanel";
import { MarketSectorFlow } from "@/components/market/MarketSectorFlow";
/** Layer 1 — Market: companies and movement first; investor/process copy lives on /investors. */
export function MarketHomeView() {
  return (
    <PublicShell stickyCta headerOverlay={false}>
      <MarketPulseBar />
      <MarketActivityTape />
      <MarketInfrastructureBar />
      <MarketCoveragePanel />
      <MarketSectorFlow />
    </PublicShell>
  );
}
