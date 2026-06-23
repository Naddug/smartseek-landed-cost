"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { AppContainer } from "@/components/shared/AppContainer";
import { DossierFilePanel } from "@/components/opportunity/DossierFilePanel";
import { marketingDossierToOpportunity } from "@/lib/marketing/map-marketing-dossier";
import { SpotlightProgressBar } from "@/components/marketing/home/SpotlightProgressBar";
import type { MarketingDossier } from "@/types/marketing-dossier";
import { featuredSpotlightDossiers } from "@/data/marketing/home-dossiers";
import { ORTAQ_COPY } from "@/lib/copy/ortaq-lexicon";

const ROTATE_MS = 6000;

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
      className="relative overflow-hidden bg-stone-950 py-20 md:py-28"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-25"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.07) 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      />

      <AppContainer className="relative">
        <div className="mb-10 max-w-xl">
          <p className="type-eyebrow-light">{ORTAQ_COPY.sections.featuredEyebrow}</p>
          <h2 className="type-section-light mt-3">{ORTAQ_COPY.sections.featuredDossierSpotlight}</h2>
        </div>

        <div className="mx-auto max-w-4xl">
          <Link href={`/firsatlar/${active.slug}`} className="group block">
            <div className="relative">
              <div
                className="absolute -inset-px rounded-xl bg-gradient-to-b from-white/12 to-transparent"
                aria-hidden
              />
              {active && (
                <DossierFilePanel
                  key={active.id}
                  opportunity={marketingDossierToOpportunity(active)}
                  theme="spotlight"
                  size="lg"
                  showFooter
                  className="relative rounded-xl transition-opacity duration-500"
                />
              )}
              <span className="absolute bottom-6 right-6 inline-flex items-center gap-1.5 text-sm font-medium text-ortaq-accent opacity-100 transition-opacity group-hover:opacity-100 md:opacity-0 md:group-hover:opacity-100 md:bottom-8 md:right-8">
                {ORTAQ_COPY.ctas.viewDossier}
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </div>
          </Link>

          <SpotlightProgressBar
            activeIndex={activeIndex}
            total={dossiers.length}
            durationMs={ROTATE_MS}
            paused={paused}
            onSelect={setActiveIndex}
          />

          {active && (
            <dl className="mt-8 grid grid-cols-3 gap-4 border-t border-white/10 pt-8">
              {[
                { k: "Ref", v: active.refCode },
                { k: "Aşama", v: active.stage },
                { k: "Konum", v: active.location },
              ].map((item) => (
                <div key={item.k}>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.12em] text-white/35">
                    {item.k}
                  </dt>
                  <dd className="mt-1 text-sm font-medium text-white/85">{item.v}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </AppContainer>
    </section>
  );
}
