"use client";

import { PublicShell } from "@/components/layout/PublicShell";
import { OperatorHero } from "@/components/home/operator/OperatorHero";
import { HeroRestatement } from "@/components/home/operator/HeroRestatement";
import { OperatorProcessSteps } from "@/components/home/operator/OperatorProcessSteps";
import { ActiveCategoryBand } from "@/components/home/operator/ActiveCategoryBand";
import { ExecutionTrust } from "@/components/home/operator/ExecutionTrust";
import { CategoryRoadmap } from "@/components/home/operator/CategoryRoadmap";
import { HomepageFaq } from "@/components/home/operator/HomepageFaq";
import { QuoteCta } from "@/components/home/operator/QuoteCta";
import { TrustLayerLinks } from "@/components/trust/TrustLayerLinks";

/**
 * OrtaqHomeView — operator homepage (approved positioning).
 * Hierarchy: hero → process → active category → trust → roadmap → FAQ → CTA
 */
export function OrtaqHomeView() {
  return (
    <PublicShell stickyCta>
      <OperatorHero />
      <HeroRestatement />
      <OperatorProcessSteps />
      <ActiveCategoryBand />
      <ExecutionTrust />
      <TrustLayerLinks />
      <CategoryRoadmap />
      <HomepageFaq />
      <QuoteCta />
    </PublicShell>
  );
}
