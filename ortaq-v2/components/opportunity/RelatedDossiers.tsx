import Link from "next/link";
import type { PublicDossierDetail } from "@/types/dossier-detail";
import { DossierMarketCard } from "./DossierMarketCard";
import { marketingDossiers } from "@/data/marketing/home-dossiers";
import { ORTAQ_COPY } from "@/lib/copy/ortaq-lexicon";

interface RelatedDossiersProps {
  dossiers: PublicDossierDetail[];
}

export function RelatedDossiers({ dossiers }: RelatedDossiersProps) {
  if (dossiers.length === 0) return null;

  const cards = dossiers
    .map((d) => marketingDossiers.find((m) => m.id === d.id))
    .filter(Boolean);

  return (
    <section className="border-t border-ortaq-line pt-10">
      <h2 className="font-heading text-lg font-semibold text-ortaq-navy">
        İlgili dosyalar
      </h2>
      <p className="mt-1 text-sm text-ortaq-text-secondary">
        Aynı kategori veya ortak türünde benzer fırsatlar
      </p>
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map(
          (d) =>
            d && (
              <DossierMarketCard
                key={d.id}
                dossier={d}
                href={`/firsatlar/${d.slug}`}
                layout="compact"
              />
            )
        )}
      </div>
      <Link
        href="/firsatlar"
        className="mt-6 inline-flex text-sm font-semibold text-blue-600 hover:underline"
      >
        {ORTAQ_COPY.ctas.browseOtherDossiers} →
      </Link>
    </section>
  );
}
