import { Suspense } from "react";
import type { Metadata } from "next";
import { AppContainer } from "@/components/shared/AppContainer";
import { Section } from "@/components/shared/Section";
import { ArchiveHero } from "@/components/archive/ArchiveHero";
import { FirsatlarArchive } from "@/components/archive/FirsatlarArchive";
import { marketingDossiers } from "@/data/marketing/home-dossiers";
import { ORTAQ_COPY } from "@/lib/copy/ortaq-lexicon";

export const metadata: Metadata = {
  title: "Yayındaki Fırsatlar | ORTAQ",
  description: ORTAQ_COPY.archive.intro,
  openGraph: {
    title: "Yayındaki Fırsatlar | ORTAQ",
    description: ORTAQ_COPY.archive.intro,
  },
};

export default function FirsatlarPage() {
  return (
    <>
      <ArchiveHero />
      <Section className="pb-16 md:pb-24">
        <AppContainer>
          <Suspense
            fallback={
              <div className="py-16 text-center text-sm text-ortaq-text-muted">
                Arşiv yükleniyor…
              </div>
            }
          >
            <FirsatlarArchive dossiers={marketingDossiers} />
          </Suspense>
        </AppContainer>
      </Section>
    </>
  );
}
