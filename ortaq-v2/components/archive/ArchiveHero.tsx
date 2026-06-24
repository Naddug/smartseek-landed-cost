import Link from "next/link";
import { AppContainer } from "@/components/shared/AppContainer";
import { DossierVisualCover } from "@/components/opportunity/DossierVisualCover";
import { marketingDossiers } from "@/data/marketing/home-dossiers";
import { ORTAQ_COPY } from "@/lib/copy/ortaq-lexicon";
import { getArchiveStats } from "@/lib/archive/archive-filters";

const published = marketingDossiers.filter((d) => d.status === "published");
const stats = getArchiveStats(published);
const previewSlugs = published.filter((d) => d.isCurated).slice(0, 4);

export function ArchiveHero() {
  return (
    <div className="relative overflow-hidden border-b border-ortaq-line bg-ortaq-navy">
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.06) 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }}
      />

      <AppContainer className="relative py-12 md:py-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="max-w-2xl">
            <p className="type-eyebrow-light">{ORTAQ_COPY.labels.dossierArchive}</p>
            <h1 className="type-section-light mt-3">{ORTAQ_COPY.archive.pageTitle}</h1>
            <p className="type-body-on-dark mt-4 text-base">
              {ORTAQ_COPY.archive.intro}
            </p>
            <dl className="mt-8 flex flex-wrap gap-6">
              {[
                { k: "Yayında", v: stats.total },
                { k: "Kategori", v: stats.categories.length },
                { k: "Ortak türü", v: stats.partnerTypes.length },
              ].map(({ k, v }) => (
                <div key={k}>
                  <dt className="type-meta-on-dark">{k}</dt>
                  <dd className="mt-1 font-heading text-2xl font-semibold text-white">
                    {v}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Visual preview strip */}
          <div className="hidden w-full max-w-md grid-cols-2 gap-2 lg:grid">
            {previewSlugs.map((d) => (
              <Link
                key={d.id}
                href={`/firsatlar/${d.slug}`}
                className="overflow-hidden rounded-lg border border-white/10 shadow-ortaq-dark transition-transform hover:-translate-y-0.5"
              >
                <DossierVisualCover
                  slug={d.slug}
                  categoryKey={d.categoryKey}
                  size="sm"
                  showMeta={false}
                  overlay="minimal"
                />
              </Link>
            ))}
          </div>
        </div>
      </AppContainer>
    </div>
  );
}
