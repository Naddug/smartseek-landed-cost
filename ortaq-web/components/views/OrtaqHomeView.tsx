"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/cn";
import { Container } from "@/components/ui/Section";
import { PublicShell } from "@/components/layout/PublicShell";

/* Visuals — ordered by homepage priority */
import { HeroDashboard }  from "@/components/visuals/HeroDashboard";   // P1: transactions first
import { ChaosVisual }    from "@/components/visuals/ChaosVisual";      // P2a: why current state is broken
import { OrtaqPanel }     from "@/components/visuals/OrtaqPanel";       // P2b: what changes inside ORTAQ
import { DecisionCards }  from "@/components/visuals/DecisionCards";    // P3: critical answers
import { CommandCenter }  from "@/components/visuals/CommandCenter";    // P4: manager view
import { GlobalCollab }   from "@/components/visuals/GlobalCollab";     // P5: multi-company

/**
 * ORTAQ Homepage — visual-first, transaction-centric.
 *
 * RULE: the central object on every screen is the TRANSACTION.
 * Not messages. Not files. Not communication.
 * A visitor in 10 seconds must think:
 * "ORTAQ helps my company manage commercial transactions."
 *
 * Page answers 5 visual questions in order:
 *  1. What does ORTAQ manage? (Hero: active transaction dashboard)
 *  2. Why is the current state broken? (Chaos)
 *  3. What changes inside ORTAQ? (ORTAQ View)
 *  4. What answers become instantly visible? (Decision Cards)
 *  5. How do managers monitor all deals? (Command Center)
 *  6. How do companies collaborate? (Global)
 */
export function OrtaqHomeView() {
  const { t } = useTranslation();

  return (
    <PublicShell stickyCta={false}>

      {/* ══════════════════════════════════════════════════════════════
          HERO — "What does ORTAQ manage?"
          Answer: active commercial transactions.
          Visual: an operational dashboard showing 4 live deals,
          their stages, who is waiting, what is blocked, next action.
          NOT: a messaging interface. NOT: WhatsApp icons.
      ══════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden border-b border-ortaq-border bg-ortaq-surface">
        <GridPattern />
        <Container wide>
          <div className="relative grid min-h-[calc(100dvh-3.75rem)] grid-cols-1 items-center gap-10 py-12 lg:grid-cols-[1fr_1.8fr] lg:gap-12 lg:py-16">

            {/* Left: positioning */}
            <div className="flex flex-col">
              <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-ortaq-trust/30 bg-ortaq-trust/6 px-3 py-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-ortaq-trust" />
                <span className="text-[0.6875rem] font-semibold text-ortaq-trust">
                  {t("home.hero.eyebrow")}
                </span>
              </div>

              <h1 className="font-body font-bold tracking-[-0.04em] text-ortaq-ink leading-[1.02] text-[2.5rem] sm:text-[3rem] xl:text-[3.5rem]">
                {t("home.hero.h1a")}<br />
                <span className="text-ortaq-trust">{t("home.hero.h1b")}</span>
              </h1>

              <p className="mt-5 max-w-[22rem] text-[1rem] leading-[1.7] text-ortaq-ink-muted">
                {t("home.hero.sub")}
              </p>

              {/* Transaction types — not tool icons */}
              <div className="mt-6 flex flex-wrap gap-1.5">
                {([
                  "İhracat",
                  "İthalat",
                  "Tedarik",
                  "Üretim",
                  "Dağıtım",
                  "Proje",
                ] as const).map((label) => (
                  <span
                    key={label}
                    className="rounded-full border border-ortaq-border-strong bg-ortaq-bg px-2.5 py-1 text-[0.5625rem] font-semibold text-ortaq-ink-muted"
                  >
                    {label}
                  </span>
                ))}
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

            {/* Right: TRANSACTION DASHBOARD — hero visual */}
            <div className="w-full">
              <HeroDashboard />
            </div>
          </div>
        </Container>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 2 — "Why is the current state broken?"
          One transaction scattered across 14 separate tools.
          Visitor recognition: "Yes. This is exactly my situation."
          Background: warm red — feel the stress.
      ══════════════════════════════════════════════════════════════ */}
      <section className="border-b border-ortaq-border bg-[#FDF0ED]">
        <Container wide>
          <div className="py-14 sm:py-16">
            <SectionHead
              label={t("visuals.chaos.sectionTitle")}
              sub={t("visuals.chaos.sectionSub")}
              align="center"
              labelColor="text-[#8B3A2C]"
            />
            <div className="mt-8">
              <ChaosVisual />
            </div>
          </div>
        </Container>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 3 — "What changes inside ORTAQ?"
          Same deal. One unified operational view.
          Everything linked. Every item in context.
          Background: calm green — feel the relief.
      ══════════════════════════════════════════════════════════════ */}
      <section className="border-b border-ortaq-border bg-[#F2FAF4]">
        <Container wide>
          <div className="py-14 sm:py-16">
            <SectionHead
              label={t("visuals.ortaqView.sectionTitle")}
              sub={t("visuals.ortaqView.sectionSub")}
              align="center"
              labelColor="text-ortaq-trust"
            />
            <div className="mt-8">
              <OrtaqPanel />
            </div>
          </div>
        </Container>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 4 — "What answers become instantly visible?"
          Four commercial decisions. Before: darkness. After: clarity.
          Not features — outcomes. Not tools — decisions.
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
          SECTION 5 — "How do managers see all active transactions?"
          Dark. Mission control. Unambiguous.
          Large numbers. Color carries meaning. No reading required.
      ══════════════════════════════════════════════════════════════ */}
      <section className="border-b border-white/10 bg-[#0D0C0A]">
        <Container wide>
          <div className="py-14 sm:py-16">
            <SectionHead
              label={t("visuals.command.sectionTitle")}
              sub={t("visuals.command.sectionSub")}
              align="center"
              labelColor="text-white"
              subColor="text-white/40"
            />
            <div className="mt-8">
              <CommandCenter />
            </div>
          </div>
        </Container>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 6 — "How do multiple companies collaborate?"
          Turkey, Thailand, Germany, Singapore — one workspace.
          Both sides see the same deal state simultaneously.
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
          CTA — earned confidence
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

/* ── helpers ── */

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
