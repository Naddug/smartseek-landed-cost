import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MarketingDossier } from "@/types/marketing-dossier";
import type { DossierTier } from "@/types/archive";
import { getDossierTier } from "@/lib/archive/archive-filters";
import { ORTAQ_COPY } from "@/lib/copy/ortaq-lexicon";
import { DossierVisualCover } from "./DossierVisualCover";

const TIER_BADGE: Partial<
  Record<DossierTier, { label: string; className: string }>
> = {
  curated: {
    label: ORTAQ_COPY.badges.featured,
    className: "border-amber-200 bg-amber-50 text-amber-900",
  },
  new: {
    label: ORTAQ_COPY.badges.new,
    className: "border-emerald-200 bg-emerald-50 text-emerald-800",
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
        "group grid gap-4 border-b border-ortaq-line p-4 transition-colors last:border-b-0 hover:bg-ortaq-surface-alt/60 md:grid-cols-[140px_1fr_auto]",
        className
      )}
    >
      <div className="relative h-24 w-full overflow-hidden rounded-lg md:h-[88px] md:w-[140px]">
        <DossierVisualCover
          slug={dossier.slug}
          categoryKey={dossier.categoryKey}
          size="sm"
          showMeta={false}
          className="!aspect-auto h-full"
        />
      </div>

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[10px] uppercase tracking-wide text-ortaq-text-muted">
            {dossier.refCode}
          </span>
          {badge && (
            <span
              className={cn(
                "rounded border px-1.5 py-0.5 text-[10px] font-medium uppercase",
                badge.className
              )}
            >
              {badge.label}
            </span>
          )}
        </div>
        <h3 className="mt-1 font-heading text-base font-semibold text-ortaq-navy group-hover:text-blue-700">
          {dossier.title}
        </h3>
        <p className="mt-0.5 line-clamp-1 text-sm text-ortaq-text-secondary">
          {dossier.summary}
        </p>
        <dl className="mt-3 grid gap-2 text-xs sm:grid-cols-3">
          <div>
            <dt className="font-mono text-[9px] uppercase tracking-wider text-ortaq-text-muted">
              Varlık
            </dt>
            <dd className="text-ortaq-text-secondary">{dossier.assetWhatExists}</dd>
          </div>
          <div>
            <dt className="font-mono text-[9px] uppercase tracking-wider text-ortaq-text-muted">
              Eksik
            </dt>
            <dd className="text-ortaq-text-secondary">{dossier.missingPiece}</dd>
          </div>
          <div className="rounded-md bg-blue-50 px-2 py-1">
            <dt className="font-mono text-[9px] font-bold uppercase tracking-wider text-blue-600/80">
              Aranan ortak
            </dt>
            <dd className="font-semibold text-blue-800">{dossier.desiredPartner}</dd>
          </div>
        </dl>
      </div>

      <div className="flex items-center justify-between gap-4 md:flex-col md:items-end md:justify-center">
        <span className="inline-flex items-center gap-1 text-[11px] text-ortaq-text-muted">
          <MapPin className="h-3 w-3" />
          {dossier.location}
        </span>
        <span className="text-[11px] text-ortaq-text-muted">{updated}</span>
        <span className="inline-flex items-center gap-1 text-sm font-semibold text-ortaq-navy">
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
