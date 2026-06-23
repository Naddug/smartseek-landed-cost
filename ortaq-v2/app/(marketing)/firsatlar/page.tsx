import { Suspense } from "react";
import { AppContainer } from "@/components/shared/AppContainer";
import { Section } from "@/components/shared/Section";
import { FirsatlarArchive } from "@/components/archive/FirsatlarArchive";
import { marketingDossiers } from "@/data/marketing/home-dossiers";
import { ORTAQ_COPY } from "@/lib/copy/ortaq-lexicon";

export default function FirsatlarPage() {
  return (
    <Section className="pb-16 md:pb-24">
      <AppContainer>
        <header className="mb-8 border-b border-stone-200 pb-8 md:mb-10">
          <p className="type-eyebrow mb-2">{ORTAQ_COPY.labels.dossierArchive}</p>
          <h1 className="type-section">Fırsat Dosyaları</h1>
          <p className="mt-3 max-w-2xl text-base text-stone-600">
            {ORTAQ_COPY.archive.intro}
          </p>
        </header>

        <Suspense fallback={<div className="py-12 text-sm text-stone-500">Yükleniyor…</div>}>
          <FirsatlarArchive dossiers={marketingDossiers} />
        </Suspense>
      </AppContainer>
    </Section>
  );
}
