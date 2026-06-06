"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/cn";
import { typography } from "@/design/typography";
import { Container } from "@/components/ui/Section";
import { PublicShell } from "@/components/layout/PublicShell";
import { UnifiedInbox } from "@/components/ortaq/UnifiedInbox";
import { ChaosVisual } from "@/components/visuals/ChaosVisual";
import { OrtaqPanel } from "@/components/visuals/OrtaqPanel";
import { DealsBoard } from "@/components/visuals/DealsBoard";
import { ManagementView } from "@/components/visuals/ManagementView";
import { GlobalCollab } from "@/components/visuals/GlobalCollab";

/**
 * Homepage — 5 visual sequences. Minimal copy.
 * If all text vanished, a visitor should still understand ORTAQ.
 *
 * #1 Hero        — Big claim + UnifiedInbox (the product at a glance)
 * #2 Chaos       — The problem, shown not described
 * #3 ORTAQ View  — Same deal, one screen (the transformation)
 * #4 Deals Board — Multiple deals, company-level scope
 * #5 Mgmt View   — Executive command panel
 * #6 Global      — Different countries, same workspace
 * #7 CTA
 */
export function OrtaqHomeView() {
  const { t } = useTranslation();

  return (
    <PublicShell stickyCta={false}>

      {/* ══ HERO ══════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden border-b border-ortaq-border bg-ortaq-surface">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.022]"
          style={{
            backgroundImage:
              "linear-gradient(var(--color-ortaq-ink) 1px, transparent 1px), linear-gradient(90deg, var(--color-ortaq-ink) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />
        <Container wide>
          <div className="relative grid min-h-[calc(100dvh-3.75rem)] grid-cols-1 items-center gap-8 py-12 lg:grid-cols-[1fr_1.5fr] lg:gap-10 lg:py-14">

            <div className="flex flex-col">
              <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-ortaq-trust/30 bg-ortaq-trust/6 px-3 py-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-ortaq-trust" />
                <span className="text-[0.6875rem] font-semibold text-ortaq-trust">
                  {t("home.hero.eyebrow")}
                </span>
              </div>

              <h1
                className={cn(
                  "font-body font-bold tracking-[-0.04em] text-ortaq-ink",
                  "text-[2.5rem] leading-[1.02] sm:text-[3rem] lg:text-[3.5rem] xl:text-[4rem]",
                )}
              >
                {t("home.hero.h1a")}
                <br />
                <span className="text-ortaq-trust">{t("home.hero.h1b")}</span>
              </h1>

              <p className="mt-5 max-w-[20rem] text-[1rem] leading-[1.65] text-ortaq-ink-muted">
                {t("home.hero.sub")}
              </p>

              {/* Source flow — visual language */}
              <div className="mt-6 flex flex-wrap items-center gap-1.5">
                {[
                  { label: "WhatsApp", c: "bg-[#25D366]/10 text-[#128C7E] border-[#25D366]/30" },
                  { label: "E-posta", c: "bg-blue-50 text-blue-600 border-blue-200" },
                  { label: "PDF", c: "bg-red-50 text-red-500 border-red-200" },
                  { label: "Excel", c: "bg-green-50 text-green-700 border-green-200" },
                  { label: "ERP", c: "bg-ortaq-bg text-ortaq-ink-soft border-ortaq-border" },
                  { label: "Toplantılar", c: "bg-violet-50 text-violet-600 border-violet-200" },
                ].map((s) => (
                  <span key={s.label} className={cn("rounded-full border px-2.5 py-1 text-[0.5625rem] font-semibold", s.c)}>
                    {s.label}
                  </span>
                ))}
                <span className="ml-1 text-[0.875rem] font-bold text-ortaq-trust">→</span>
                <span className="rounded-full border border-ortaq-trust/30 bg-ortaq-trust/10 px-3 py-1 text-[0.5625rem] font-bold text-ortaq-trust">
                  ORTAQ
                </span>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/demo"
                  className="inline-flex min-h-12 items-center justify-center rounded-lg bg-ortaq-ink px-7 text-[0.9375rem] font-semibold leading-none text-ortaq-cream shadow-[var(--shadow-product)] transition-all hover:bg-ortaq-ink-muted active:scale-[0.98]"
                >
                  {t("home.hero.cta")}
                </Link>
                <Link
                  href="/nasil-calisir"
                  className="inline-flex min-h-12 items-center justify-center rounded-lg border border-ortaq-border-strong px-6 text-[0.9375rem] font-medium text-ortaq-ink transition-colors hover:bg-ortaq-bg"
                >
                  {t("home.hero.ctaSecondary")}
                </Link>
              </div>
            </div>

            {/* Hero product preview */}
            <div className="w-full">
              <UnifiedInbox />
            </div>
          </div>
        </Container>
      </section>

      {/* ══ VISUAL #1 — THE CHAOS ═══════════════════════════════════ */}
      <section className="border-b border-ortaq-border bg-[#FFF8F6]">
        <Container wide>
          <div className="py-14 sm:py-16">
            <div className="mb-10 text-center">
              <SectionLabel text={t("visuals.chaos.title")} accent />
              <p className={cn(typography.body, "mx-auto mt-2 max-w-sm text-ortaq-ink-muted")}>
                {t("visuals.chaos.sub")}
              </p>
            </div>
            <ChaosVisual />
          </div>
        </Container>
      </section>

      {/* ══ VISUAL #2 — THE ORTAQ VIEW ══════════════════════════════ */}
      <section className="border-b border-ortaq-border bg-[#F6FBF7]">
        <Container wide>
          <div className="py-14 sm:py-16">
            <div className="mb-10 text-center">
              <SectionLabel text={t("visuals.ortaqView.title")} />
              <p className={cn(typography.body, "mx-auto mt-2 max-w-sm text-ortaq-ink-muted")}>
                {t("visuals.ortaqView.sub")}
              </p>
            </div>
            <OrtaqPanel />
          </div>
        </Container>
      </section>

      {/* ══ VISUAL #3 — MULTIPLE DEALS ══════════════════════════════ */}
      <section className="border-b border-ortaq-border bg-ortaq-surface">
        <Container wide>
          <div className="py-14 sm:py-16">
            <div className="mb-10">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <SectionLabel text={t("visuals.deals.title")} />
                  <p className={cn(typography.body, "mt-2 max-w-md text-ortaq-ink-muted")}>
                    {t("visuals.deals.sub")}
                  </p>
                </div>
              </div>
            </div>
            <DealsBoard />
          </div>
        </Container>
      </section>

      {/* ══ VISUAL #4 — MANAGEMENT VIEW ════════════════════════════ */}
      <section className="border-b border-ortaq-border bg-ortaq-bg">
        <Container wide>
          <div className="py-14 sm:py-16">
            <div className="mb-10 text-center">
              <SectionLabel text={t("visuals.mgmt.title")} />
              <p className={cn(typography.body, "mx-auto mt-2 max-w-sm text-ortaq-ink-muted")}>
                {t("visuals.mgmt.sub")}
              </p>
            </div>
            <ManagementView />
          </div>
        </Container>
      </section>

      {/* ══ VISUAL #5 — GLOBAL COLLABORATION ═══════════════════════ */}
      <section className="border-b border-ortaq-border bg-ortaq-surface">
        <Container wide>
          <div className="py-14 sm:py-16">
            <div className="mb-10 text-center">
              <SectionLabel text={t("visuals.global.title")} />
              <p className={cn(typography.body, "mx-auto mt-2 max-w-sm text-ortaq-ink-muted")}>
                {t("visuals.global.sub")}
              </p>
            </div>
            <GlobalCollab />
          </div>
        </Container>
      </section>

      {/* ══ CTA ═══════════════════════════════════════════════════════ */}
      <section className="bg-ortaq-dark">
        <Container wide>
          <div className="py-16 sm:py-20 lg:py-24">
            <div className="mx-auto max-w-xl text-center">
              <h2
                className={cn(
                  "font-body font-bold tracking-[-0.035em] text-ortaq-cream leading-[1.08]",
                  "text-[2rem] sm:text-[2.625rem]",
                )}
              >
                {t("home.cta.h2a")}<br />
                <span className="text-ortaq-trust">{t("home.cta.h2b")}</span>
              </h2>
              <p className={cn(typography.body, "mx-auto mt-4 max-w-md text-ortaq-cream/70")}>
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
          </div>
        </Container>
      </section>

    </PublicShell>
  );
}

function SectionLabel({ text, accent }: { text: string; accent?: boolean }) {
  return (
    <p
      className={cn(
        "font-body font-bold tracking-[-0.03em] text-ortaq-ink leading-[1.1]",
        "text-[1.75rem] sm:text-[2.25rem]",
        accent && "text-ortaq-accent",
      )}
    >
      {text}
    </p>
  );
}
