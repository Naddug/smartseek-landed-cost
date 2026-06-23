import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AppContainer } from "@/components/shared/AppContainer";
import { DossierFilePanel } from "@/components/opportunity/DossierFilePanel";
import { marketingDossierToOpportunity } from "@/lib/marketing/map-marketing-dossier";
import {
  activeRailDossiers,
  getArchiveMeta,
} from "@/data/marketing/home-dossiers";
import { ORTAQ_COPY } from "@/lib/copy/ortaq-lexicon";

export function ActiveDossierRail() {
  const meta = getArchiveMeta();

  return (
    <section className="section-editorial-alt py-16 md:py-20">
      <AppContainer>
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="type-eyebrow">{ORTAQ_COPY.labels.dossierArchive}</p>
            <h2 className="type-section mt-2">
              {ORTAQ_COPY.sections.activeDossiers}
            </h2>
            <p className="mt-2 max-w-lg text-sm text-ortaq-text-secondary">
              {ORTAQ_COPY.archive.intro}
            </p>
            <p className="type-meta mt-2 text-ortaq-text-muted">
              {meta.activeCount} yayındaki dosya · {meta.newThisWeek} yeni bu hafta
            </p>
          </div>
          <Link
            href="/firsatlar"
            className="inline-flex items-center gap-2 text-sm font-semibold text-ortaq-navy hover:text-blue-600"
          >
            {ORTAQ_COPY.ctas.viewAll}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </AppContainer>

      <div className="relative">
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-8 bg-gradient-to-r from-ortaq-surface to-transparent md:w-16" />
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-8 bg-gradient-to-l from-ortaq-surface to-transparent md:w-16" />

        <div className="scrollbar-hide flex gap-4 overflow-x-auto px-4 pb-2 md:px-[max(1rem,calc((100vw-72rem)/2+1rem))] md:snap-x md:snap-mandatory">
          {activeRailDossiers.map((dossier) => (
            <Link
              key={dossier.id}
              href={`/firsatlar/${dossier.slug}`}
              className="w-[min(340px,85vw)] shrink-0 snap-start md:w-[360px]"
            >
              <DossierFilePanel
                opportunity={marketingDossierToOpportunity(dossier)}
                theme="light"
                size="sm"
                className="card-editorial-hover h-full"
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
