"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Container } from "@/components/ui/Section";
import { PublicShell } from "@/components/layout/PublicShell";

import { TransformationHero }     from "@/components/visuals/TransformationHero";
import { IntelligenceComparison } from "@/components/visuals/IntelligenceComparison";
import { OperationalMemory }      from "@/components/visuals/OperationalMemory";
import { OperationalReasoning }   from "@/components/visuals/OperationalReasoning";
import { WhyOrtaqDiffers }        from "@/components/visuals/WhyOrtaqDiffers";
import { PilotBriefing }          from "@/components/visuals/PilotBriefing";
import { PortfolioPreview }       from "@/components/visuals/PortfolioPreview";

/**
 * OrtaqHomeView — SPRINT 14 NARRATIVE REORDER
 *
 * CATEGORY-FIRST ORDER (attention → action before record/memory):
 *   1. Hero                 — Recognition
 *   2. Why ORTAQ Differs    — First proof: continuity vs generic AI
 *   3. Pilot Briefing       — Primary category proof (proactive briefing)
 *   4. Intelligence         — Consequence reasoning (single-input comparison)
 *   5. Operational Reasoning — Multi-industry reasoning demonstration
 *   6. Portfolio Preview    — Supporting proof: breadth across operations
 *   7. Operational Memory   — Supporting proof: durability and continuity
 *   8. Demo CTA
 *
 * REMOVED from homepage: UniversalProblem (demoted from category-defining position)
 * NOT MERGED: Intelligence + Operational Reasoning (different formats, distinct proof)
 */

export function OrtaqHomeView() {
  const { t, i18n } = useTranslation();
  const isTR = (i18n.language ?? "tr").startsWith("tr");

  return (
    <PublicShell stickyCta={false}>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 1 — HERO
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="border-b border-ortaq-border bg-ortaq-surface">
        <Container wide>
          <div className="py-12 sm:py-16">

            <div className="mb-8 text-center">
              <h1 className="mx-auto max-w-2xl font-body font-bold tracking-[-0.04em] text-ortaq-ink leading-[1.02] text-[2.25rem] sm:text-[3rem]">
                {t("home.hero.h1a")}<br />
                <span className="text-ortaq-trust">{t("home.hero.h1b")}</span>
              </h1>
              <p className="mx-auto mt-5 max-w-[32rem] text-[0.9375rem] leading-[1.75] text-ortaq-ink-muted">
                {t("home.hero.sub")}
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/demo"
                  className="inline-flex min-h-11 items-center justify-center rounded-lg bg-ortaq-trust px-7 text-[0.9375rem] font-bold text-white shadow-sm transition-all hover:bg-ortaq-trust-deep active:scale-[0.98]"
                >
                  {t("home.hero.cta")} →
                </Link>
                <a
                  href="#ortaq-pilot"
                  className="inline-flex min-h-11 items-center justify-center rounded-lg border border-ortaq-border px-5 text-[0.9375rem] font-medium text-ortaq-ink-muted transition-colors hover:border-ortaq-border-strong hover:text-ortaq-ink"
                >
                  {t("home.hero.ctaSecondary")} ↓
                </a>
              </div>
            </div>

            <TransformationHero />

          </div>
        </Container>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 2 — WHY ORTAQ DIFFERS
          First major proof section after hero.
          ═══════════════════════════════════════════════════════════════════ */}
      <WhyOrtaqDiffers />

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 3 — PILOT BRIEFING
          Primary category proof — proactive operational briefing.
          ═══════════════════════════════════════════════════════════════════ */}
      <PilotBriefing />

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 4 — INTELLIGENCE
          Single-input comparison: generic AI vs operational consequence chain.
          ═══════════════════════════════════════════════════════════════════ */}
      <section id="ortaq-anlama" className="border-b border-ortaq-border bg-ortaq-ink">
        <Container wide>
          <div className="py-14 sm:py-18">
            <div className="mb-8">
              <p className="text-[0.625rem] font-bold uppercase tracking-[0.1em] text-ortaq-trust/70">
                {isTR ? "Operasyonel Zeka" : "Operational Intelligence"}
              </p>
              <h2 className="mt-2 text-[1.5rem] font-bold tracking-[-0.03em] text-ortaq-cream leading-[1.15] sm:text-[1.875rem]">
                {isTR
                  ? <>Bir AI ne görür?<br /><span className="text-ortaq-trust">ORTAQ ne görür?</span></>
                  : <>What does a generic AI see?<br /><span className="text-ortaq-trust">What does ORTAQ see?</span></>}
              </h2>
              <p className="mt-3 max-w-xl text-[0.9375rem] leading-relaxed text-ortaq-cream/60">
                {isTR
                  ? "Aynı cümle. İki farklı anlama kapasitesi. Fark, metni okumakla operasyonu anlamak arasında."
                  : "Same sentence. Two different levels of understanding. The gap is between reading text and understanding operations."}
              </p>
            </div>
            <IntelligenceComparison />
          </div>
        </Container>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 5 — OPERATIONAL REASONING
          Multi-industry tabbed reasoning demonstration.
          Kept separate from Intelligence (comparison vs multi-scenario demo).
          ═══════════════════════════════════════════════════════════════════ */}
      <OperationalReasoning />

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 6 — PORTFOLIO PREVIEW
          Supporting proof: breadth across operations.
          ═══════════════════════════════════════════════════════════════════ */}
      <PortfolioPreview />

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 7 — OPERATIONAL MEMORY
          Supporting proof: durability and continuity.
          ═══════════════════════════════════════════════════════════════════ */}
      <OperationalMemory />

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 8 — DEMO CTA
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="border-t border-ortaq-border bg-ortaq-ink">
        <Container wide>
          <div className="py-16 sm:py-20 text-center">

            <h2 className="mx-auto max-w-2xl text-[1.875rem] font-bold tracking-[-0.03em] text-ortaq-cream leading-[1.1] sm:text-[2.25rem]">
              {t("home.cta.h2a")}<br />
              <span className="text-ortaq-trust">{t("home.cta.h2b")}</span>
            </h2>

            <p className="mx-auto mt-4 max-w-md text-[0.9375rem] leading-relaxed text-ortaq-cream/70">
              {t("home.cta.sub")}
            </p>

            <div className="mx-auto mt-8 max-w-sm overflow-hidden rounded-2xl border border-ortaq-cream/10 bg-ortaq-cream/5 text-left">
              <div className="border-b border-ortaq-cream/10 px-5 py-3">
                <p className="text-[0.4375rem] font-bold uppercase tracking-[0.09em] text-ortaq-cream/40">
                  {isTR ? "Demo nasıl ilerler?" : "What happens in a demo?"}
                </p>
              </div>
              <div className="divide-y divide-ortaq-cream/[0.07]">
                {(isTR ? [
                  "Aktif bir operasyonunuzu seçiyorsunuz.",
                  "ORTAQ o operasyonu nasıl okuduğunu, ne anladığını gösteriyoruz.",
                  "Kendi operasyonunuzda ne görüleceğini 30 dakikada anlıyorsunuz.",
                ] : [
                  "You choose one of your active operations.",
                  "We show how ORTAQ reads that operation and what it understands.",
                  "You see what ORTAQ would surface in your own operation — in 30 minutes.",
                ]).map((step, i) => (
                  <div key={i} className="flex items-start gap-3 px-5 py-3">
                    <span className="shrink-0 font-mono text-[0.4375rem] font-bold text-ortaq-cream/30">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="text-[0.5625rem] text-ortaq-cream/75">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            <p className="mt-6 text-[0.75rem] text-ortaq-cream/35">
              {isTR
                ? "Uluslararası ticarette, tedarik zincirinde, proje tesliminde."
                : "International trade, supply chain, project delivery."}
            </p>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/demo"
                className="inline-flex min-h-12 items-center justify-center rounded-xl bg-ortaq-trust px-8 text-[1rem] font-bold text-white shadow-sm transition-all hover:bg-ortaq-trust-deep active:scale-[0.98]"
              >
                {t("home.cta.primary")} →
              </Link>
              <Link
                href="/senaryolar"
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-ortaq-cream/20 px-6 text-[1rem] font-medium text-ortaq-cream/70 transition-colors hover:border-ortaq-cream/40 hover:text-ortaq-cream"
              >
                {isTR ? "15 Senaryo" : "15 Scenarios"}
              </Link>
            </div>

          </div>
        </Container>
      </section>

    </PublicShell>
  );
}
