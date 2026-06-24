"use client";

import Link from "next/link";
import { ArrowRight, Check, Minus, ShieldCheck, Users } from "lucide-react";
import { AppContainer } from "@/components/shared/AppContainer";
import { HeroCTAs } from "@/components/marketing/home/HeroCTAs";
import { TrustProofStripCTA } from "@/components/marketing/home/TrustProofStrip";
import { DossierVisualCover } from "@/components/opportunity/DossierVisualCover";
import { getDossierVisual } from "@/lib/dossier/dossier-visuals";
import { heroRotatingDossiers, marketingDossiers } from "@/data/marketing/home-dossiers";
import { ORTAQ_COPY } from "@/lib/copy/ortaq-lexicon";

const featured = heroRotatingDossiers[0];
const mosaic = marketingDossiers
  .filter((d) => d.status === "published" && d.id !== featured?.id)
  .slice(0, 3);

export function HeroSection() {
  const publishedCount = marketingDossiers.filter((d) => d.status === "published").length;

  return (
    <section className="relative overflow-hidden border-b border-ortaq-line bg-ortaq-bg">
      <div
        className="pointer-events-none absolute -right-32 top-0 h-[480px] w-[480px] rounded-full bg-blue-600/[0.06] blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        aria-hidden
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(20,33,61,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(20,33,61,0.03) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <AppContainer className="relative py-12 md:py-16 lg:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12 xl:gap-14">
          <div className="lg:max-w-[36rem]">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-ortaq-line bg-white px-3 py-1 shadow-ortaq-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-ortaq-text-secondary">
                {publishedCount} {ORTAQ_COPY.hero.livePillSuffix}
              </span>
            </div>

            <p className="mb-4 font-heading text-sm font-semibold tracking-wide text-ortaq-navy">
              {ORTAQ_COPY.hero.eyebrow}
            </p>

            <h1 className="font-heading text-[1.75rem] font-semibold leading-[1.15] tracking-[-0.03em] text-ortaq-navy md:text-[2.125rem] lg:text-[2.375rem]">
              {ORTAQ_COPY.hero.headline}
            </h1>

            <ul className="mt-5 space-y-1.5 border-l-2 border-ortaq-line pl-4">
              {ORTAQ_COPY.hero.patternExamples.map((line) => (
                <li
                  key={line}
                  className="text-sm font-medium leading-snug text-ortaq-text-secondary md:text-[0.9375rem]"
                >
                  {line}
                </li>
              ))}
            </ul>

            <p className="type-body-secondary mt-6 max-w-md leading-relaxed md:text-[1.0625rem]">
              {ORTAQ_COPY.hero.subhead}
            </p>

            <HeroCTAs />

            <ul className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                ORTAQ_COPY.hero.trustReview,
                ORTAQ_COPY.hero.trustPrivacy,
                ORTAQ_COPY.hero.trustVerified,
              ].map((label) => (
                <li
                  key={label}
                  className="flex items-start gap-2 rounded-lg border border-ortaq-line bg-white px-3 py-2.5 text-[11px] font-medium leading-snug text-ortaq-text-secondary shadow-ortaq-sm"
                >
                  <Check className="mt-px h-3.5 w-3.5 shrink-0 text-blue-600" strokeWidth={2.5} />
                  <span>{label}</span>
                </li>
              ))}
            </ul>

            <TrustProofStripCTA />
          </div>

          <div className="w-full lg:max-w-[36rem] lg:justify-self-end xl:max-w-[38rem]">
            {featured && (
              <>
                <Link
                  href={`/firsatlar/${featured.slug}`}
                  className="group relative z-10 block overflow-hidden rounded-2xl border border-ortaq-line shadow-ortaq-lg transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-ortaq-xl"
                >
                  <DossierVisualCover
                    slug={featured.slug}
                    categoryKey={featured.categoryKey}
                    refCode={featured.refCode}
                    size="lg"
                    priority
                    overlay="light"
                    showMeta={false}
                  />
                  <div className="border-t border-ortaq-line bg-white p-5">
                    <div className="flex items-center justify-between">
                      <p className="type-eyebrow">{ORTAQ_COPY.sections.featuredEyebrow}</p>
                      <span className="font-mono text-[9px] uppercase tracking-wider text-ortaq-text-muted">
                        {featured.neighborhood
                          ? `${featured.location} · ${featured.neighborhood}`
                          : featured.location}
                      </span>
                    </div>
                    <h2 className="mt-1.5 font-heading text-lg font-semibold leading-snug text-ortaq-navy group-hover:text-blue-700">
                      {featured.title}
                    </h2>

                    {featured.metrics && featured.metrics.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {featured.metrics.map((m) => (
                          <span
                            key={m.label}
                            className="inline-flex items-baseline gap-1 rounded-md border border-ortaq-line bg-ortaq-surface-alt/80 px-2 py-1 text-[11px]"
                          >
                            <span className="font-semibold text-ortaq-navy">{m.value}</span>
                            <span className="text-ortaq-text-muted">{m.label}</span>
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="relative mt-4">
                      <span
                        className="absolute bottom-[1.6rem] left-[0.6875rem] top-[0.4rem] w-px bg-ortaq-line"
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
                            {featured.assetWhatExists}
                          </p>
                        </div>
                      </div>
                      <div className="relative mt-2.5 flex items-start gap-2.5">
                        <span className="mt-0.5 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-amber-50 ring-1 ring-amber-200">
                          <Minus className="h-2.5 w-2.5 text-amber-600" strokeWidth={3} />
                        </span>
                        <div className="min-w-0">
                          <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-ortaq-text-muted">
                            {ORTAQ_COPY.labels.gap}
                          </p>
                          <p className="text-sm leading-snug text-ortaq-text-secondary">
                            {featured.missingPiece}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between rounded-lg border border-blue-200 bg-blue-50/80 px-3 py-2.5">
                      <div className="min-w-0">
                        <p className="font-mono text-[9px] font-bold uppercase tracking-wider text-blue-600/80">
                          {ORTAQ_COPY.labels.partnerNeeded}
                        </p>
                        <p className="truncate font-heading text-sm font-semibold text-blue-900">
                          {featured.desiredPartner}
                        </p>
                      </div>
                      <span className="ml-3 inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-blue-700">
                        {ORTAQ_COPY.ctas.viewDossier}
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-ortaq-line pt-3 text-[11px] text-ortaq-text-muted">
                      {featured.verifications?.[0] && (
                        <span className="inline-flex items-center gap-1 font-medium text-emerald-700">
                          <ShieldCheck className="h-3.5 w-3.5" strokeWidth={2.25} />
                          {featured.verifications[0]}
                        </span>
                      )}
                      {typeof featured.applicants === "number" && (
                        <span className="inline-flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {featured.applicants} başvuru
                        </span>
                      )}
                    </div>
                  </div>
                </Link>

                <div className="mt-3 grid grid-cols-3 gap-3">
                  {mosaic.map((d) => (
                    <Link
                      key={d.id}
                      href={`/firsatlar/${d.slug}`}
                      className="group overflow-hidden rounded-xl border border-ortaq-line shadow-ortaq-sm transition-all hover:-translate-y-0.5 hover:shadow-ortaq-md"
                    >
                      <DossierVisualCover
                        slug={d.slug}
                        categoryKey={d.categoryKey}
                        size="sm"
                        showMeta={false}
                        overlay="minimal"
                      />
                      <p className="flex items-center gap-1 truncate bg-white px-2 py-1.5 text-[10px] font-medium text-ortaq-text-secondary group-hover:text-ortaq-navy">
                        <span
                          className="h-1.5 w-1.5 shrink-0 rounded-full"
                          style={{ backgroundColor: getDossierVisual(d).accent }}
                          aria-hidden
                        />
                        <span className="truncate">{d.category} · {d.location}</span>
                      </p>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </AppContainer>
    </section>
  );
}
