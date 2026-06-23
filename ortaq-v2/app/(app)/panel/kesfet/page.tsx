import Link from "next/link";
import { PageHeader } from "@/components/shared/PageHeader";
import { DossierCard } from "@/components/opportunity/DossierCard";
import { marketingDossiers } from "@/data/marketing/home-dossiers";
import { ORTAQ_COPY } from "@/lib/copy/ortaq-lexicon";

export default function KesfetPage() {
  const published = marketingDossiers
    .filter((d) => d.status === "published")
    .slice(0, 6);

  return (
    <>
      <PageHeader
        eyebrow={ORTAQ_COPY.sections.activeDossiers}
        title={ORTAQ_COPY.ctas.browseDossiers}
        description="Yayında olan fırsat dosyalarını inceleyin. Uygun dosyalara başvuru oluşturabilirsiniz."
      />
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {published.map((dossier) => (
          <DossierCard
            key={dossier.id}
            dossier={dossier}
            href={`/firsatlar/${dossier.slug}`}
          />
        ))}
      </div>
      <p className="mt-6 text-sm text-stone-600">
        <Link href="/firsatlar" className="font-medium text-blue-600 hover:underline">
          {ORTAQ_COPY.ctas.viewAll} →
        </Link>
      </p>
    </>
  );
}
