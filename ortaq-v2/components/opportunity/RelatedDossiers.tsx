import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { PublicDossierDetail } from "@/types/dossier-detail";

interface RelatedDossiersProps {
  dossiers: PublicDossierDetail[];
}

export function RelatedDossiers({ dossiers }: RelatedDossiersProps) {
  if (!dossiers.length) return null;

  return (
    <section className="border-t border-stone-200 pt-10">
      <h2 className="font-heading text-lg font-semibold text-stone-900">
        İlgili dosyalar
      </h2>
      <p className="mt-1 text-sm text-stone-500">
        Aynı kategori veya ortak türünden benzer fırsatlar
      </p>

      <ul className="mt-6 divide-y divide-stone-200">
        {dossiers.map((d) => (
          <li key={d.id}>
            <Link
              href={`/firsatlar/${d.slug}`}
              className="group flex items-center justify-between gap-4 py-4"
            >
              <div className="min-w-0">
                <span className="font-mono text-[10px] uppercase tracking-wide text-stone-400">
                  {d.refCode} · {d.category}
                </span>
                <p className="mt-1 font-heading text-base font-medium text-stone-900 group-hover:text-stone-700">
                  {d.title}
                </p>
                <p className="mt-0.5 line-clamp-1 text-sm text-stone-500">
                  {d.desiredPartner}
                </p>
              </div>
              <ArrowRight className="h-4 w-4 shrink-0 text-stone-400 transition-transform group-hover:translate-x-0.5 group-hover:text-stone-700" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
