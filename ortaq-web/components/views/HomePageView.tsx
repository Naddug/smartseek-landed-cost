"use client";

import { PublicShell } from "@/components/layout/PublicShell";
import { HeroSection } from "@/components/home/HeroSection";
import { HomeNetworkEntry } from "@/components/home/HomeNetworkEntry";
import { HomeAccessWhisper } from "@/components/home/HomeAccessWhisper";
import { HomeCompanyAccess } from "@/components/home/HomeCompanyAccess";
import { HomeDepthGate } from "@/components/home/HomeDepthGate";
import { HomeEntryPath } from "@/components/home/HomeEntryPath";
import { HomeAccessInvitation } from "@/components/home/HomeAccessInvitation";

export function HomePageView() {
  return (
    <PublicShell headerOverlay stickyCta>
      <HeroSection />
      <HomeNetworkEntry />
      <HomeAccessWhisper />
      <HomeCompanyAccess />
      <HomeDepthGate />
      <HomeEntryPath />
      <HomeAccessInvitation />
    </PublicShell>
  );
}
