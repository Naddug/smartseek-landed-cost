import { HeroSection } from "@/components/marketing/home/HeroSection";
import { MarketplaceActivity } from "@/components/marketing/home/MarketplaceActivity";
import { TrustProofStrip } from "@/components/marketing/home/TrustProofStrip";
import { FeaturedSpotlight } from "@/components/marketing/home/FeaturedSpotlight";
import { ActiveDossierRail } from "@/components/marketing/home/ActiveDossierRail";
import { PartnerTypeStrip } from "@/components/marketing/home/PartnerTypeStrip";
import { TwoAudienceBlock } from "@/components/marketing/home/TwoAudienceBlock";
import { ProcessTimeline } from "@/components/marketing/home/ProcessTimeline";
import { StandardsBlock } from "@/components/marketing/home/StandardsBlock";
import { MonetizationSection } from "@/components/marketing/home/MonetizationSection";
import { FinalCTASection } from "@/components/marketing/home/FinalCTASection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <MarketplaceActivity />
      <TrustProofStrip />
      <FeaturedSpotlight />
      <ActiveDossierRail />
      <PartnerTypeStrip />
      <TwoAudienceBlock />
      <ProcessTimeline />
      <StandardsBlock />
      <MonetizationSection />
      <FinalCTASection />
    </>
  );
}
