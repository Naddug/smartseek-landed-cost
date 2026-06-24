import Link from "next/link";
import { ArrowRight, Check, Eye, MapPin, Minus, ShieldCheck, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MarketingDossier } from "@/types/marketing-dossier";
import type { DossierTier } from "@/types/archive";
import { getDossierTier } from "@/lib/archive/archive-filters";
import { getDossierVisual } from "@/lib/dossier/dossier-visuals";
import { ORTAQ_COPY } from "@/lib/copy/ortaq-lexicon";
import { DossierVisualCover } from "./DossierVisualCover";

const TIER_BADGE: Partial<
  Record<DossierTier, { label: string; className: string }>
> = {
  curated: {
    label: ORTAQ_COPY.badges.featured,
    className: "border-amber-300/80 bg-amber-500/90 text-white",
  },
  featured: {
    label: ORTAQ_COPY.badges.featured,
    className: "border-white/20 bg-white/15 text-white backdrop-blur-sm",
  },
  new: {
    label: ORTAQ_COPY.badges.new,
    className: "border-emerald-300/60 bg-emerald-600/90 text-white",
  },
};

interface DossierMarketCardProps {
  dossier: MarketingDossier;
  href?: string;
  className?: string;
  emphasis?: DossierTier;
  layout?: "card" | "compact";
}

export function DossierMarketCard({
  dossier,
  href,
  className,
  emphasis,
  layout = "card",
}: DossierMarketCardProps) {
  const tier = emphasis ?? getDossierTier(dossier);
  const badge = TIER_BADGE[tier];
  const accent = getDossierVisual(dossier).accent;
  const updated = new Date(dossier.updatedAt).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "short",
  });

  const content = (
    <article
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-xl border border-ortaq-line bg-ortaq-surface shadow-ortaq-sm transition-all duration-300",
        "hover:-translate-y-1 hover:border-ortaq-line-strong hover:shadow-ortaq-lg",
        className
      )}
    >
      <div className="relative">
        <DossierVisualCover
          slug={dossier.slug}
          categoryKey={dossier.categoryKey}
          refCode={dossier.refCode}
          size={layout === "compact" ? "sm" : "md"}
          showMeta={false}
          overlay="light"
        />
        <div className="absolute inset-x-0 top-0 flex flex-wrap items-start justify-between gap-2 p-3">
          <span className="rounded-md border border-white/15 bg-black/40 px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wide text-white/90 backdrop-blur-sm">
            {dossier.refCode}
          </span>
          {badge && tier !== "standard" && (
            <span
              className={cn(
                "rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                badge.className
              )}
            >
              {badge.label}
            </span>
          )}
        </div>
        {/* Stage tag floats over the base of the image as a live-listing signal. */}
        <div className="absolute inset-x-0 bottom-0 flex items-center gap-1.5 px-3 pb-3">
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: accent }}
            aria-hidden
          />
          <span className="text-[11px] font-medium text-white/90 drop-shadow-sm">
            {dossier.stage}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col">
        <div className="border-b border-ortaq-line px-4 pb-4 pt-3.5">
          <div className="flex flex-wrap items-center gap-2 text-[10px] font-medium uppercase tracking-wide text-ortaq-text-muted">
            <span
              className="inline-flex items-center gap-1.5 font-semibold"
              style={{ color: accent }}
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: accent }}
                aria-hidden
              />
              {dossier.category}
            </span>
            <span className="text-ortaq-line-strong">·</span>
            <span className="inline-flex items-center gap-0.5">
              <MapPin className="h-3 w-3" />
              {dossier.neighborhood
                ? `${dossier.location} · ${dossier.neighborhood}`
                : dossier.location}
            </span>
          </div>
          <h3 className="mt-2 font-heading text-base font-semibold leading-snug tracking-[-0.02em] text-ortaq-navy group-hover:text-blue-700 md:text-[1.05rem]">
            {dossier.title}
          </h3>
          {layout === "card" && (
            <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-ortaq-text-secondary">
              {dossier.summary}
            </p>
          )}
          {dossier.metrics && dossier.metrics.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {dossier.metrics.map((m) => (
                <span
                  key={m.label}
                  className="inline-flex items-baseline gap-1 rounded-md border border-ortaq-line bg-ortaq-surface-alt/60 px-2 py-1 text-[11px] leading-none"
                >
                  <span className="font-semibold text-ortaq-navy">{m.value}</span>
                  <span className="text-ortaq-text-muted">{m.label}</span>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Completeness ledger — asset present, gap open, partner sought —
            read top-to-bottom as one connected line. */}
        <div className="relative mt-auto px-4 py-4">
          <span
            className="absolute bottom-[1.85rem] left-[1.4rem] top-[1.4rem] w-px bg-ortaq-line"
            aria-hidden
          />

          <div className="relative flex items-start gap-2.5">
            <span className="mt-0.5 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-emerald-50 ring-1 ring-emerald-200">
              <Check className="h-2.5 w-2.5 text-emerald-600" strokeWidth={3} />
            </span>
            <div className="min-w-0">
              <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-ortaq-text-muted">
                {ORTAQ_COPY.labels.assets}
              </p>
              <p className="text-sm leading-snug text-ortaq-text-secondary">
                {dossier.assetWhatExists}
              </p>
            </div>
          </div>

          <div className="relative mt-3 flex items-start gap-2.5">
            <span className="mt-0.5 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-amber-50 ring-1 ring-amber-200">
              <Minus className="h-2.5 w-2.5 text-amber-600" strokeWidth={3} />
            </span>
            <div className="min-w-0">
              <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-ortaq-text-muted">
                {ORTAQ_COPY.labels.gap}
              </p>
              <p className="text-sm leading-snug text-ortaq-text-secondary">
                {dossier.missingPiece}
              </p>
            </div>
          </div>

          <div className="relative mt-3 flex items-start gap-2.5">
            <span className="mt-0.5 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-blue-600 ring-2 ring-blue-100">
              <ArrowRight className="h-2.5 w-2.5 text-white" strokeWidth={3} />
            </span>
            <div className="min-w-0">
              <p className="font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-blue-600/80">
                {ORTAQ_COPY.labels.partnerNeeded}
              </p>
              <p className="font-heading text-sm font-semibold leading-snug text-blue-800">
                {dossier.desiredPartner}
              </p>
            </div>
          </div>
        </div>

        {(dossier.verifications?.length ||
          typeof dossier.applicants === "number" ||
          typeof dossier.views === "number") && (
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-ortaq-line px-4 py-2 text-[11px] text-ortaq-text-muted">
            {dossier.verifications && dossier.verifications.length > 0 && (
              <span className="inline-flex items-center gap-1 font-medium text-emerald-700">
                <ShieldCheck className="h-3.5 w-3.5" strokeWidth={2.25} />
                ORTAQ doğruladı
              </span>
            )}
            {typeof dossier.applicants === "number" && (
              <span className="inline-flex items-center gap-1">
                <Users className="h-3 w-3" />
                {dossier.applicants} başvuru
              </span>
            )}
            {typeof dossier.views === "number" && (
              <span className="inline-flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {dossier.views}
              </span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between border-t border-ortaq-line bg-ortaq-surface-alt/50 px-4 py-2.5">
          <span className="text-[11px] text-ortaq-text-muted">
            {ORTAQ_COPY.labels.lastUpdate} · {updated}
          </span>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-ortaq-navy transition-all group-hover:gap-1.5 group-hover:text-blue-700">
            {ORTAQ_COPY.ctas.viewDossier}
            <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </article>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }
  return content;
}
