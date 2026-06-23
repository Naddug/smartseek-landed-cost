import Link from "next/link";
import { MapPin } from "lucide-react";
import { StatusBadge } from "@/components/shared/StatusBadge";
import {
  detailStatusLabel,
  detailStatusVariant,
} from "@/lib/dossier/detail-status";
import { ORTAQ_COPY } from "@/lib/copy/ortaq-lexicon";
import type { PublicDossierDetail } from "@/types/dossier-detail";

interface DossierDetailHeroProps {
  dossier: PublicDossierDetail;
  showStatus?: boolean;
}

export function DossierDetailHero({
  dossier,
  showStatus = true,
}: DossierDetailHeroProps) {
  const updated = new Date(dossier.updatedAt).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <header className="border-b border-stone-200 pb-8">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="font-mono text-[11px] uppercase tracking-wider text-stone-500">
          {dossier.refCode}
        </span>
        <span className="text-stone-300">·</span>
        <StatusBadge
          label={dossier.category}
          className="bg-stone-100 text-stone-700"
        />
        <StatusBadge label={dossier.stage} variant="default" />
        {showStatus && dossier.status !== "published" && (
          <StatusBadge
            label={detailStatusLabel(dossier.status)}
            variant={detailStatusVariant(dossier.status)}
          />
        )}
        {dossier.isCurated && (
          <StatusBadge
            label={ORTAQ_COPY.badges.featured}
            className="border border-amber-200 bg-amber-50 text-amber-900"
          />
        )}
      </div>

      <h1 className="type-section max-w-3xl text-stone-950">{dossier.title}</h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-stone-600">
        {dossier.summary}
      </p>

      <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-stone-500">
        <span className="inline-flex items-center gap-1.5">
          <MapPin className="h-4 w-4 shrink-0" />
          {dossier.location}
        </span>
        <span className="text-stone-300">·</span>
        <span>Son güncelleme: {updated}</span>
      </div>
    </header>
  );
}

export function DossierDetailBackLink() {
  return (
    <Link
      href="/firsatlar"
      className="mb-6 inline-flex text-sm font-medium text-stone-600 hover:text-stone-900"
    >
      ← Fırsat arşivine dön
    </Link>
  );
}
