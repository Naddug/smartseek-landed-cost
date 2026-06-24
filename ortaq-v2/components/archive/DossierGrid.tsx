import { DossierMarketCard } from "@/components/opportunity/DossierMarketCard";
import { DossierRowRecord } from "@/components/opportunity/DossierRowRecord";
import type { MarketingDossier } from "@/types/marketing-dossier";

interface ArchiveDossierGridProps {
  dossiers: MarketingDossier[];
}

export function DossierGrid({ dossiers }: ArchiveDossierGridProps) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {dossiers.map((dossier) => (
        <DossierMarketCard
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
    <div className="overflow-hidden rounded-xl border border-ortaq-line bg-white shadow-ortaq-sm">
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
