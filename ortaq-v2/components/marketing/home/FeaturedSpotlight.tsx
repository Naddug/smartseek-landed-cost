"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ArrowRight, MapPin, ShieldCheck, Users } from "lucide-react";
import { AppContainer } from "@/components/shared/AppContainer";
import { DossierVisualCover } from "@/components/opportunity/DossierVisualCover";
import { SpotlightProgressBar } from "@/components/marketing/home/SpotlightProgressBar";
import type { MarketingDossier } from "@/types/marketing-dossier";
import { featuredSpotlightDossiers } from "@/data/marketing/home-dossiers";
import { ORTAQ_COPY } from "@/lib/copy/ortaq-lexicon";
import { cn } from "@/lib/utils";

const ROTATE_MS = 7000;

interface FeaturedSpotlightProps {
  dossiers?: MarketingDossier[];
}

export function FeaturedSpotlight({
  dossiers = featuredSpotlightDossiers,
}: FeaturedSpotlightProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const advance = useCallback(() => {
    setActiveIndex((i) => (i + 1) % dossiers.length);
  }, [dossiers.length]);

  useEffect(() => {
    if (paused || dossiers.length <= 1) return;
    const timer = setInterval(advance, ROTATE_MS);
    return () => clearInterval(timer);
  }, [advance, paused, dossiers.length]);

  const active = dossiers[activeIndex];

  if (!dossiers.length || !active) return null;

  return (
    <section
      className="surface-dark relative overflow-hidden py-16 md:py-24"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.08) 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      <AppContainer className="relative">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <p className="type-eyebrow-light">{ORTAQ_COPY.sections.featuredEyebrow}</p>

          <div className="flex flex-wrap gap-2">
            {dossiers.map((d, i) => (
              <button
                key={d.id}
                type="button"
                onClick={() => setActiveIndex(i)}
                className={cn(
                  "rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase tracking-wide transition-colors",
                  i === activeIndex
                    ? "border-white/30 bg-white/15 text-white"
                    : "border-white/10 text-ortaq-dark-text-muted hover:border-white/20 hover:text-ortaq-dark-text-secondary"
                )}
              >
                {d.refCode}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-ortaq-dark-border bg-ortaq-dark-elevated shadow-ortaq-dark">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
            <Link
              href={`/firsatlar/${active.slug}`}
              className="group relative block min-h-[280px] lg:min-h-[420px]"
            >
              <DossierVisualCover
                slug={active.slug}
                categoryKey={active.categoryKey}
                refCode={active.refCode}
                atmosphere={active.category}
                size="hero"
                overlay="editorial"
                className="absolute inset-0 !aspect-auto h-full min-h-[280px] transition-transform duration-500 group-hover:scale-[1.02] lg:min-h-[420px]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent lg:hidden" />
            </Link>

            <div className="flex flex-col border-t border-ortaq-dark-border lg:border-l lg:border-t-0">
              <div className="flex-1 p-6 md:p-8">
                <div className="flex flex-wrap items-center gap-2 text-xs text-ortaq-dark-text-muted">
                  <span>{active.category}</span>
                  <span>·</span>
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {active.neighborhood
                      ? `${active.location} · ${active.neighborhood}`
                      : active.location}
                  </span>
                  <span>·</span>
                  <span>{active.stage}</span>
                </div>

                <h2 className="mt-4 font-heading text-xl font-semibold leading-snug text-ortaq-dark-text md:text-2xl">
                  {active.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-ortaq-dark-text-secondary">
                  {active.summary}
                </p>

                {active.metrics && active.metrics.length > 0 && (
                  <div className="mt-5 grid grid-cols-3 gap-2">
                    {active.metrics.map((m) => (
                      <div
                        key={m.label}
                        className="rounded-lg border border-ortaq-dark-border bg-white/[0.03] px-3 py-2.5"
                      >
                        <p className="font-heading text-sm font-semibold text-white">
                          {m.value}
                        </p>
                        <p className="mt-0.5 text-[11px] text-ortaq-dark-text-muted">
                          {m.label}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                <dl className="mt-4 space-y-3 rounded-xl border border-ortaq-dark-border bg-black/20 p-4">
                  <div className="grid grid-cols-[72px_1fr] gap-2 text-sm">
                    <dt className="font-mono text-[9px] font-semibold uppercase tracking-wider text-ortaq-dark-text-muted">
                      {ORTAQ_COPY.labels.assets}
                    </dt>
                    <dd className="text-ortaq-dark-text-secondary">{active.assetWhatExists}</dd>
                  </div>
                  <div className="grid grid-cols-[72px_1fr] gap-2 text-sm">
                    <dt className="font-mono text-[9px] font-semibold uppercase tracking-wider text-ortaq-dark-text-muted">
                      {ORTAQ_COPY.labels.gap}
                    </dt>
                    <dd className="text-ortaq-dark-text-secondary">{active.missingPiece}</dd>
                  </div>
                  <div className="rounded-lg border border-blue-500/30 bg-blue-500/10 px-3 py-2.5">
                    <dt className="font-mono text-[9px] font-bold uppercase tracking-wider text-blue-300/90">
                      {ORTAQ_COPY.labels.partnerNeeded}
                    </dt>
                    <dd className="mt-1 font-heading text-base font-semibold text-white">
                      {active.desiredPartner}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="border-t border-ortaq-dark-border p-6 md:p-8">
                {(active.verifications?.length ||
                  typeof active.applicants === "number") && (
                  <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-ortaq-dark-text-muted">
                    {active.verifications && active.verifications.length > 0 && (
                      <span className="inline-flex items-center gap-1.5 font-medium text-emerald-300">
                        <ShieldCheck className="h-3.5 w-3.5" strokeWidth={2.25} />
                        {active.verifications[0]}
                      </span>
                    )}
                    {typeof active.applicants === "number" && (
                      <span className="inline-flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5" />
                        {active.applicants} ortak başvurdu
                      </span>
                    )}
                  </div>
                )}
                <Link
                  href={`/firsatlar/${active.slug}`}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-500"
                >
                  {ORTAQ_COPY.ctas.viewDossier}
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <SpotlightProgressBar
                  activeIndex={activeIndex}
                  total={dossiers.length}
                  durationMs={ROTATE_MS}
                  paused={paused}
                  onSelect={setActiveIndex}
                />
              </div>
            </div>
          </div>
        </div>
      </AppContainer>
    </section>
  );
}
