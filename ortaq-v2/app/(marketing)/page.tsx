import { HomeHero } from "@/components/marketing/home/HomeHero";
import { TrustStrips } from "@/components/marketing/home/TrustStrips";
import { WhoItsFor } from "@/components/marketing/home/WhoItsFor";
import { SampleDossiers } from "@/components/marketing/home/SampleDossiers";
import { HowItWorksPreview } from "@/components/marketing/home/HowItWorksPreview";
import { QualityTrustBlock } from "@/components/marketing/home/QualityTrustBlock";
import { FinalCtas } from "@/components/marketing/home/FinalCtas";

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <TrustStrips />
      <WhoItsFor />
      <SampleDossiers />
      <HowItWorksPreview />
      <QualityTrustBlock />
      <FinalCtas />
    </>
  );
}
