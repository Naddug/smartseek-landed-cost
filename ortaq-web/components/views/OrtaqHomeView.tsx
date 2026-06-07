"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Container } from "@/components/ui/Section";
import { PublicShell } from "@/components/layout/PublicShell";

import { TransformationHero }    from "@/components/visuals/TransformationHero";
import { IntelligenceComparison } from "@/components/visuals/IntelligenceComparison";
import { UniversalProblem }      from "@/components/visuals/UniversalProblem";
import { OperationalMemory }     from "@/components/visuals/OperationalMemory";
import { OperationalReasoning } from "@/components/visuals/OperationalReasoning";
import { WhyOrtaqDiffers }     from "@/components/visuals/WhyOrtaqDiffers";
import { PilotBriefing }       from "@/components/visuals/PilotBriefing";
import { PortfolioPreview }      from "@/components/visuals/PortfolioPreview";

/**
 * OrtaqHomeView — SPRINT 5
 *
 * POSITIONING: "System that understands operations from fragmented communications."
 * NOT: "Shared workspace for import/export."
 *
 * NARRATIVE ORDER (8 sections):
 *   1. Hero        — Recognition: "Bilgi var. Anlayan yok."
 *   2. Problem     — Universal: 5 questions everyone asks every day
 *   3. Memory      — "ORTAQ unutmaz" — operational memory layer
 *   4. Intelligence — "Bir AI ne görür? ORTAQ ne görür?" — core differentiation
 *   5. Pilot       — "ORTAQ'a sor" — 4 Q&A static concept
 *   6. Briefing    — Portfolio / operational output view
 *   7. Guidance    — Strategic guidance layer (honest, not autonomous)
 *   8. Use Cases + Demo CTA
 *
 * COPY RULES: Every section answers one of:
 *   What happened? / What changed? / What is missing? /
 *   Who is waiting? / What is at risk? / What should happen next?
 *
 * BANNED from headlines: SGS · LC · BL · Buyer · Seller · Export · Import
 * (Trade examples stay inside detail content — credibility for ICP)
 */

export function OrtaqHomeView() {
  const { t, i18n } = useTranslation();
  const isTR = (i18n.language ?? "tr").startsWith("tr");

  return (
    <PublicShell stickyCta={false}>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 1 — HERO: Recognition
          "Bilgi var. Anlayan yok."
          Visitor must understand the CORE PROBLEM within 5 seconds.
          The visual shows READ → UNDERSTAND → RECOMMEND, not feature tabs.
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
          SECTION 2 — UNIVERSAL PROBLEM
          Show the 5 questions before mentioning ORTAQ.
          Visitor must recognize themselves.
          Answers: "What happened?" / "What changed?" / "Who is waiting?"
          ═══════════════════════════════════════════════════════════════════ */}
      <UniversalProblem />

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 3 — OPERATIONAL MEMORY
          "ORTAQ unutmaz."
          Context disappears — emails deleted, people leave, messages gone.
          ORTAQ builds a persistent memory per operation.
          ═══════════════════════════════════════════════════════════════════ */}
      <OperationalMemory />

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 4 — INTELLIGENCE
          "Bir AI ne görür? ORTAQ ne görür?"
          Generic AI reads text. ORTAQ understands operations.
          Core differentiator — now primary messaging, not supporting.
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
          SECTION 4b — OPERATIONAL REASONING DEMONSTRATION
          "ORTAQ nasıl düşünüyor?"
          3 tabbed cards: Trade / Supply Chain / Project Delivery.
          Each shows: What exists → Human sees → ORTAQ understands → Recommends.
          Briefing-note style. Readable in under 15 seconds per card.
          Goal: visitor thinks "This is reasoning, not summarising."
          ═══════════════════════════════════════════════════════════════════ */}
      <OperationalReasoning />

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 4c — WHY ORTAQ DIFFERS
          "Neden ORTAQ farklı?"
          Answers: "Why can't I do this with ChatGPT + Outlook?"
          Same inputs → Generic AI output vs ORTAQ understanding.
          Key message: "The difference is not IQ. It is continuity."
          4 capability cards: Memory / Commitment / Dependency / Risk.
          ═══════════════════════════════════════════════════════════════════ */}
      <WhyOrtaqDiffers />

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 5 — PILOT BRIEFING
          "Sabah geldiğinizde ORTAQ sizi neyle karşılar?"
          One specific operation (Yamato Machinery). Overnight briefing
          in 5 structured items. Then 4 question pills with source-cited
          answers. Not a chatbot — an operational briefing interface.
          Goal: "ORTAQ is following my operation, not answering questions."
          ═══════════════════════════════════════════════════════════════════ */}
      <PilotBriefing />

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 6 — OPERATIONAL BRIEFING
          Show the output — not a dashboard, not feature modules.
          Portfolio view = what ORTAQ tells you when you open it in the morning.
          Answers: "Who is waiting?" / "What is at risk?"
          ═══════════════════════════════════════════════════════════════════ */}
      <PortfolioPreview />


      {/* ═══════════════════════════════════════════════════════════════════
          DEMO CTA
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

