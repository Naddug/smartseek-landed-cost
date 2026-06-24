import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AppContainer } from "@/components/shared/AppContainer";
import { DossierMarketCard } from "@/components/opportunity/DossierMarketCard";
import {
  activeRailDossiers,
  getArchiveMeta,
} from "@/data/marketing/home-dossiers";
import { ORTAQ_COPY } from "@/lib/copy/ortaq-lexicon";

export function ActiveDossierRail() {
  const meta = getArchiveMeta();
  const dossiers = [...activeRailDossiers]
    .sort((a, b) => {
      if (a.isCurated !== b.isCurated) return a.isCurated ? -1 : 1;
      if (a.isNewThisWeek !== b.isNewThisWeek) return a.isNewThisWeek ? -1 : 1;
      return 0;
    })
    .slice(0, 6);

  return (
    <section className="section-editorial-alt py-16 md:py-20">
      <AppContainer>
        <div className="mb-10 flex flex-col gap-4 border-b border-ortaq-line pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <p className="type-eyebrow">{ORTAQ_COPY.labels.dossierArchive}</p>
            <h2 className="type-section mt-2">{ORTAQ_COPY.sections.activeDossiers}</h2>
            <p className="mt-2 text-sm text-ortaq-text-secondary">
              {ORTAQ_COPY.archive.activeRailIntro}
            </p>
            <p className="type-meta mt-3 text-ortaq-text-muted">
              {meta.activeCount} yayındaki dosya · {meta.newThisWeek} yeni bu hafta
            </p>
          </div>
          <Link
            href="/firsatlar"
            className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-ortaq-line bg-white px-4 py-2.5 text-sm font-semibold text-ortaq-navy shadow-ortaq-sm transition-all hover:border-ortaq-navy hover:shadow-ortaq-md"
          >
            {ORTAQ_COPY.ctas.browseDossiers}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {dossiers.map((dossier) => (
            <DossierMarketCard
              key={dossier.id}
              dossier={dossier}
              href={`/firsatlar/${dossier.slug}`}
            />
          ))}
        </div>
      </AppContainer>
    </section>
  );
}
