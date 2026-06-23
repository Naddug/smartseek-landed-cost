import type { MarketingDossier } from "@/types/marketing-dossier";
import { DossierCard } from "@/components/opportunity/DossierCard";
import { ORTAQ_COPY } from "@/lib/copy/ortaq-lexicon";

interface CuratedRailProps {
  dossiers: MarketingDossier[];
}

export function CuratedRail({ dossiers }: CuratedRailProps) {
  if (dossiers.length === 0) return null;

  return (
    <section className="mb-10 border-b border-stone-200 pb-10">
      <p className="type-eyebrow mb-2">{ORTAQ_COPY.sections.featuredEyebrow}</p>
      <h2 className="mb-2 font-heading text-lg font-semibold text-stone-950">
        {ORTAQ_COPY.sections.featuredDossiers}
      </h2>
      <p className="mb-5 max-w-xl text-sm text-stone-600">
        {ORTAQ_COPY.archive.featuredRailDescription}
      </p>
      <div className="scrollbar-hide -mx-4 flex gap-4 overflow-x-auto px-4 pb-1 md:mx-0 md:px-0">
        {dossiers.map((dossier) => (
          <div key={dossier.id} className="w-[min(320px,80vw)] shrink-0">
            <DossierCard
              dossier={dossier}
              href={`/firsatlar/${dossier.slug}`}
              emphasis="curated"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
