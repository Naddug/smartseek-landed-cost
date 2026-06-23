import { HomeHero } from "@/components/marketing/home/HomeHero";
import { FeaturedDossiers } from "@/components/marketing/home/FeaturedDossiers";
import { DossierGrid } from "@/components/marketing/home/DossierGrid";
import { DualAudience } from "@/components/marketing/home/DualAudience";
import { HomeProcess } from "@/components/marketing/home/HomeProcess";
import { ModerationBlock } from "@/components/marketing/home/ModerationBlock";
import { HomeFinalCta } from "@/components/marketing/home/HomeFinalCta";

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <FeaturedDossiers />
      <DossierGrid />
      <DualAudience />
      <HomeProcess />
      <ModerationBlock />
      <HomeFinalCta />
    </>
  );
}
