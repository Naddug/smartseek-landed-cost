"use client";

import { PublicShell } from "@/components/layout/PublicShell";
import { MarketCoveragePanel } from "@/components/market/MarketCoveragePanel";
import { MarketSectorFlow } from "@/components/market/MarketSectorFlow";
import { MarketActivityTape } from "@/components/market/MarketActivityTape";
import { MarketAccessFooter } from "@/components/market/MarketAccessFooter";

/** Layer 1 — Industrial market front page: companies, activity, ORTAQ last. */
export function MarketHomeView() {
  return (
    <PublicShell stickyCta headerOverlay={false}>
      <MarketCoveragePanel />
      <MarketActivityTape />
      <MarketSectorFlow />
      <MarketAccessFooter />
    </PublicShell>
  );
}
