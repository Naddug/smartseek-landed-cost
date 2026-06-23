import { DossierCard } from "@/components/opportunity/DossierCard";
import { DossierRowRecord } from "@/components/opportunity/DossierRowRecord";
import type { MarketingDossier } from "@/types/marketing-dossier";

interface ArchiveDossierGridProps {
  dossiers: MarketingDossier[];
}

export function DossierGrid({ dossiers }: ArchiveDossierGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {dossiers.map((dossier) => (
        <DossierCard
          key={dossier.id}
          dossier={dossier}
          href={`/firsatlar/${dossier.slug}`}
        />
      ))}
    </div>
  );
}

interface ArchiveDossierListProps {
  dossiers: MarketingDossier[];
}

export function DossierList({ dossiers }: ArchiveDossierListProps) {
  return (
    <div className="rounded-xl border border-stone-200 bg-white px-4 md:px-5">
      {dossiers.map((dossier) => (
        <DossierRowRecord
          key={dossier.id}
          dossier={dossier}
          href={`/firsatlar/${dossier.slug}`}
        />
      ))}
    </div>
  );
}
