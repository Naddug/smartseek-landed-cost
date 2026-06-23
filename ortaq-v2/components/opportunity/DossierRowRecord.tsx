import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MarketingDossier } from "@/types/marketing-dossier";
import type { DossierTier } from "@/types/archive";
import { getDossierTier } from "@/lib/archive/archive-filters";
import { ORTAQ_COPY } from "@/lib/copy/ortaq-lexicon";

const TIER_BADGE: Partial<
  Record<DossierTier, { label: string; className: string }>
> = {
  curated: {
    label: ORTAQ_COPY.badges.featured,
    className: "border-amber-200 bg-amber-50 text-amber-900",
  },
  featured: {
    label: ORTAQ_COPY.badges.featured,
    className: "border-stone-300 bg-stone-100 text-stone-800",
  },
  new: {
    label: ORTAQ_COPY.badges.new,
    className: "border-stone-200 bg-white text-stone-700",
  },
};

interface DossierRowRecordProps {
  dossier: MarketingDossier;
  href?: string;
  className?: string;
}

export function DossierRowRecord({ dossier, href, className }: DossierRowRecordProps) {
  const tier = getDossierTier(dossier);
  const badge = TIER_BADGE[tier];
  const updated = new Date(dossier.updatedAt).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "short",
  });

  const content = (
    <article
      className={cn(
        "group grid gap-4 border-b border-stone-200 py-4 transition-colors hover:bg-stone-50/80 md:grid-cols-[1fr_auto]",
        className
      )}
    >
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[10px] uppercase tracking-wide text-stone-500">
            {dossier.refCode}
          </span>
          <span className="text-[10px] uppercase tracking-wide text-stone-500">
            {dossier.category}
          </span>
          {badge && (
            <span
              className={cn(
                "rounded border px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide",
                badge.className
              )}
            >
              {badge.label}
            </span>
          )}
        </div>
        <h3 className="mt-1.5 font-heading text-base font-semibold text-stone-950 group-hover:text-stone-700">
          {dossier.title}
        </h3>
        <p className="mt-1 line-clamp-1 text-sm text-stone-600">{dossier.summary}</p>
        <dl className="mt-3 grid gap-1 text-xs md:grid-cols-3 md:gap-4">
          <div>
            <dt className="font-mono text-[9px] uppercase tracking-wider text-stone-400">
              Varlık
            </dt>
            <dd className="text-stone-700">{dossier.assetWhatExists}</dd>
          </div>
          <div>
            <dt className="font-mono text-[9px] uppercase tracking-wider text-stone-400">
              Eksik
            </dt>
            <dd className="text-stone-700">{dossier.missingPiece}</dd>
          </div>
          <div>
            <dt className="font-mono text-[9px] uppercase tracking-wider text-stone-400">
              Aranan ortak
            </dt>
            <dd className="font-medium text-blue-600">{dossier.desiredPartner}</dd>
          </div>
        </dl>
      </div>
      <div className="flex items-center justify-between gap-4 md:flex-col md:items-end md:justify-center">
        <span className="text-[11px] text-stone-500">{updated}</span>
        <span className="inline-flex items-center gap-1 text-sm font-medium text-stone-800">
          İncele
          <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </article>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }
  return content;
}
