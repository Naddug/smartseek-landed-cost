import { cn } from "@/lib/utils";
import type { MarketingDossier } from "@/types/marketing-dossier";
import type { DossierTier } from "@/types/archive";
import { getDossierTier } from "@/lib/archive/archive-filters";
import { ORTAQ_COPY } from "@/lib/copy/ortaq-lexicon";
import { DossierFilePanel } from "@/components/opportunity/DossierFilePanel";
import { marketingDossierToOpportunity } from "@/lib/marketing/map-marketing-dossier";

const TIER_BADGE: Partial<Record<DossierTier, { label: string; className: string }>> = {
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

export function ArchiveDossierPanel({
  dossier,
  emphasis,
  className,
}: {
  dossier: MarketingDossier;
  emphasis?: DossierTier;
  className?: string;
}) {
  const tier = emphasis ?? getDossierTier(dossier);
  const badge = TIER_BADGE[tier];

  return (
    <div className={cn("relative", className)}>
      {badge && tier !== "standard" && (
        <span
          className={cn(
            "absolute right-3 top-3 z-10 rounded border px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide",
            badge.className
          )}
        >
          {badge.label}
        </span>
      )}
      <DossierFilePanel
        opportunity={marketingDossierToOpportunity(dossier)}
        theme="light"
        size="sm"
        showFooter
        className={cn(
          tier === "curated" && "border-amber-200/80 shadow-sm ring-1 ring-amber-100"
        )}
      />
    </div>
  );
}
