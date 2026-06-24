import { DossierMarketCard } from "@/components/opportunity/DossierMarketCard";
import { ORTAQ_COPY } from "@/lib/copy/ortaq-lexicon";
import type { MarketingDossier } from "@/types/marketing-dossier";

interface CuratedRailProps {
  dossiers: MarketingDossier[];
}

export function CuratedRail({ dossiers }: CuratedRailProps) {
  if (dossiers.length === 0) return null;

  return (
    <section className="mb-12 border-b border-ortaq-line pb-12">
      <p className="type-eyebrow mb-2">{ORTAQ_COPY.sections.featuredEyebrow}</p>
      <h2 className="font-heading text-xl font-semibold text-ortaq-navy md:text-2xl">
        {ORTAQ_COPY.sections.featuredDossiers}
      </h2>
      <p className="mb-6 mt-2 max-w-xl text-sm text-ortaq-text-secondary">
        {ORTAQ_COPY.archive.featuredRailDescription}
      </p>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {dossiers.map((dossier) => (
          <DossierMarketCard
            key={dossier.id}
            dossier={dossier}
            href={`/firsatlar/${dossier.slug}`}
            emphasis="curated"
            layout="compact"
          />
        ))}
      </div>
    </section>
  );
}
