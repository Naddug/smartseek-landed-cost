"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/cn";
import { Container } from "@/components/ui/Section";
import { PublicShell } from "@/components/layout/PublicShell";

/* Visuals */
import { ChaosVisual }    from "@/components/visuals/ChaosVisual";
import { OrtaqPanel }     from "@/components/visuals/OrtaqPanel";
import { DecisionCards }  from "@/components/visuals/DecisionCards";
import { CommandCenter }  from "@/components/visuals/CommandCenter";
import { GlobalCollab }   from "@/components/visuals/GlobalCollab";

/**
 * ORTAQ Homepage — visual-first emotional story arc.
 *
 * Rule: if all text vanished, a visitor should still understand
 * what ORTAQ does purely through visuals.
 *
 * Emotional arc:
 *   Hero       → "This product exists"
 *   Chaos      → "Yes. This is my life." (recognition)
 *   ORTAQ View → "Everything is finally in one place." (relief)
 *   Decisions  → "I need this right now." (desire)
 *   Command    → "This is serious." (trust)
 *   Global     → "This works across borders." (scale)
 *   CTA        → "Request a demo."
 */
export function OrtaqHomeView() {
  const { t } = useTranslation();

  return (
    <PublicShell stickyCta={false}>

      {/* ══ HERO — minimal copy, big promise ══════════════════════════ */}
      <section className="relative overflow-hidden border-b border-ortaq-border bg-ortaq-surface">
        <GridPattern />
        <Container wide>
          <div className="relative py-16 sm:py-20 lg:py-24">

            {/* Eyebrow */}
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-ortaq-trust/30 bg-ortaq-trust/6 px-3 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-ortaq-trust" />
              <span className="text-[0.6875rem] font-semibold text-ortaq-trust">
                {t("home.hero.eyebrow")}
              </span>
            </div>

            {/* Main headline — deliberately short */}
            <h1 className="font-body font-bold tracking-[-0.04em] text-ortaq-ink leading-[1.02] text-[2.75rem] sm:text-[3.5rem] lg:text-[4.5rem] max-w-2xl">
              {t("home.hero.h1a")}<br />
              <span className="text-ortaq-trust">{t("home.hero.h1b")}</span>
            </h1>

            <p className="mt-5 max-w-[26rem] text-[1.0625rem] leading-[1.65] text-ortaq-ink-muted">
              {t("home.hero.sub")}
            </p>

            {/* Source flow — visual language that replaces a paragraph */}
            <div className="mt-6 flex flex-wrap items-center gap-1.5">
              {[
                { label: "WhatsApp", c: "bg-[#25D366]/10 text-[#128C7E] border-[#25D366]/30" },
                { label: "E-posta",  c: "bg-blue-50 text-blue-600 border-blue-200" },
                { label: "PDF",      c: "bg-red-50 text-red-500 border-red-200" },
                { label: "Excel",    c: "bg-green-50 text-green-700 border-green-200" },
                { label: "ERP",      c: "bg-ortaq-bg text-ortaq-ink-soft border-ortaq-border" },
                { label: "Toplantılar", c: "bg-violet-50 text-violet-600 border-violet-200" },
              ].map((s) => (
                <span key={s.label} className={cn("rounded-full border px-2.5 py-1 text-[0.5625rem] font-semibold", s.c)}>
                  {s.label}
                </span>
              ))}
              <span className="ml-1 text-[1rem] font-bold text-ortaq-trust">→</span>
              <span className="rounded-full border border-ortaq-trust/30 bg-ortaq-trust/10 px-3 py-1 text-[0.5625rem] font-bold text-ortaq-trust">
                ORTAQ
              </span>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/demo"
                className="inline-flex min-h-12 items-center justify-center rounded-lg bg-ortaq-ink px-8 text-[0.9375rem] font-semibold text-ortaq-cream shadow-[var(--shadow-product)] transition-all hover:bg-ortaq-ink-muted active:scale-[0.98]"
              >
                {t("home.hero.cta")}
              </Link>
              <Link
                href="/nasil-calisir"
                className="inline-flex min-h-12 items-center justify-center rounded-lg border border-ortaq-border-strong px-6 text-[0.9375rem] font-medium text-ortaq-ink transition-colors hover:bg-ortaq-bg"
              >
                {t("home.hero.ctaSecondary")} →
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          VISUAL 1 — THE CHAOS
          Emotional target: "Yes. This is exactly my life."
          Background: warm red-tint — it should feel stressful.
      ══════════════════════════════════════════════════════════════ */}
      <section className="border-b border-ortaq-border bg-[#FDF0ED]">
        <Container wide>
          <div className="py-14 sm:py-16">
            <SectionHead
              label={t("visuals.chaos.sectionTitle")}
              sub={t("visuals.chaos.sectionSub")}
              labelColor="text-[#8B3A2C]"
              align="center"
            />
            <div className="mt-8">
              <ChaosVisual />
            </div>
          </div>
        </Container>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          VISUAL 2 — THE ORTAQ VIEW
          Same deal. One screen. Dramatic calm after the storm.
          Background: green-tint — relief, clarity, control.
      ══════════════════════════════════════════════════════════════ */}
      <section className="border-b border-ortaq-border bg-[#F2FAF4]">
        <Container wide>
          <div className="py-14 sm:py-16">
            <SectionHead
              label={t("visuals.ortaqView.sectionTitle")}
              sub={t("visuals.ortaqView.sectionSub")}
              labelColor="text-ortaq-trust"
              align="center"
            />
            <div className="mt-8">
              <OrtaqPanel />
            </div>
          </div>
        </Container>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          VISUAL 3 — THE MOMENT OF VALUE
          Four decisions. Before: darkness. After: clarity.
          "I need this right now."
      ══════════════════════════════════════════════════════════════ */}
      <section className="border-b border-ortaq-border bg-ortaq-surface">
        <Container wide>
          <div className="py-14 sm:py-16">
            <SectionHead
              label={t("visuals.value.sectionTitle")}
              sub={t("visuals.value.sectionSub")}
              align="center"
            />
            <div className="mt-8">
              <DecisionCards />
            </div>
          </div>
        </Container>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          VISUAL 4 — COMMERCIAL COMMAND CENTER
          Dark background. Mission control. "This is serious."
          Large numbers. Unambiguous color. No reading required.
      ══════════════════════════════════════════════════════════════ */}
      <section className="border-b border-white/10 bg-[#0D0C0A]">
        <Container wide>
          <div className="py-14 sm:py-16">
            <SectionHead
              label={t("visuals.command.sectionTitle")}
              sub={t("visuals.command.sectionSub")}
              labelColor="text-white"
              subColor="text-white/40"
              align="center"
            />
            <div className="mt-8">
              <CommandCenter />
            </div>
          </div>
        </Container>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          VISUAL 5 — GLOBAL WORKSPACE
          Different countries. Same screen. Shared visibility.
      ══════════════════════════════════════════════════════════════ */}
      <section className="border-b border-ortaq-border bg-ortaq-surface">
        <Container wide>
          <div className="py-14 sm:py-16">
            <SectionHead
              label={t("visuals.global.title")}
              sub={t("visuals.global.sub")}
              align="center"
            />
            <div className="mt-8">
              <GlobalCollab />
            </div>
          </div>
        </Container>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          CTA — simple, confident, earned
      ══════════════════════════════════════════════════════════════ */}
      <section className="bg-ortaq-dark">
        <Container wide>
          <div className="py-16 sm:py-20 lg:py-24 text-center">
            <h2 className="font-body font-bold tracking-[-0.035em] text-ortaq-cream leading-[1.08] text-[2rem] sm:text-[2.75rem]">
              {t("home.cta.h2a")}<br />
              <span className="text-ortaq-trust">{t("home.cta.h2b")}</span>
            </h2>
            <p className="mx-auto mt-4 max-w-md text-[1rem] leading-relaxed text-ortaq-cream/60">
              {t("home.cta.sub")}
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/demo"
                className="inline-flex min-h-12 items-center justify-center rounded-lg bg-ortaq-cream px-8 text-[0.9375rem] font-semibold text-ortaq-ink transition-colors hover:bg-white active:scale-[0.98]"
              >
                {t("home.cta.primary")}
              </Link>
              <Link
                href="/ekip"
                className="inline-flex min-h-12 items-center justify-center rounded-lg border border-white/20 px-6 text-[0.9375rem] font-medium text-ortaq-cream/80 transition-colors hover:border-white/40 hover:text-ortaq-cream"
              >
                {t("home.cta.secondary")}
              </Link>
            </div>
          </div>
        </Container>
      </section>

    </PublicShell>
  );
}

/* ── layout helpers ── */

function SectionHead({
  label,
  sub,
  labelColor = "text-ortaq-ink",
  subColor = "text-ortaq-ink-muted",
  align = "left",
}: {
  label: string;
  sub: string;
  labelColor?: string;
  subColor?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={cn("max-w-xl", align === "center" && "mx-auto text-center")}>
      <h2
        className={cn(
          "font-body font-bold tracking-[-0.035em] leading-[1.08]",
          "text-[1.875rem] sm:text-[2.375rem]",
          labelColor,
        )}
      >
        {label}
      </h2>
      <p className={cn("mt-2.5 text-[1rem] leading-relaxed", subColor)}>{sub}</p>
    </div>
  );
}

function GridPattern() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 opacity-[0.018]"
      style={{
        backgroundImage:
          "linear-gradient(var(--color-ortaq-ink) 1px, transparent 1px), linear-gradient(90deg, var(--color-ortaq-ink) 1px, transparent 1px)",
        backgroundSize: "44px 44px",
      }}
    />
  );
}
