"use client";

import { PublicShell } from "@/components/layout/PublicShell";
import { WlHero } from "@/components/home/whitelabel/WlHero";
import { WlModel } from "@/components/home/whitelabel/WlModel";
import { WlLiveProgram } from "@/components/home/whitelabel/WlLiveProgram";
import { WlCategoryLayers } from "@/components/home/whitelabel/WlCategoryLayers";
import { WlProof } from "@/components/home/whitelabel/WlProof";
import { WlClose } from "@/components/home/whitelabel/WlClose";

/** White-label operator homepage — cat litter first, other categories as layers. */
export function OrtaqHomeView() {
  return (
    <PublicShell stickyCta>
      <WlHero />
      <WlModel />
      <WlLiveProgram />
      <WlCategoryLayers />
      <WlProof />
      <WlClose />
    </PublicShell>
  );
}
