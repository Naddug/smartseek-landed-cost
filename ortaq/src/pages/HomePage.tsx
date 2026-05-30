import { PublicShell } from "@ortaq/components/layout/PublicShell";
import { HeroSection } from "@ortaq/components/home/HeroSection";
import { ProcessTimeline } from "@ortaq/components/trust/ProcessTimeline";
import { RiskDisclosure } from "@ortaq/components/trust/RiskDisclosure";
import { CampaignTemplateSection } from "@ortaq/components/home/CampaignTemplateSection";
import { TrustDepthSection } from "@ortaq/components/trust/TrustDepthSection";
import { CtaSection } from "@ortaq/components/home/CtaSection";

export default function HomePage() {
  return (
    <PublicShell>
      <HeroSection />
      <ProcessTimeline />
      <RiskDisclosure />
      <CampaignTemplateSection />
      <TrustDepthSection />
      <CtaSection />
    </PublicShell>
  );
}
