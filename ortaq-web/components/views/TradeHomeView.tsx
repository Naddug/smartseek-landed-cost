"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/cn";
import { typography } from "@/design/typography";
import { Container } from "@/components/ui/Section";
import { PublicShell } from "@/components/layout/PublicShell";
import { TradeWorkflowTimeline } from "@/components/trade/TradeWorkflowTimeline";
import { ProblemStrip } from "@/components/trade/ProblemStrip";
import { TradeRoomPreview } from "@/components/trade/TradeRoomPreview";
import { WorkflowModuleGrid } from "@/components/trade/WorkflowModuleGrid";
import { CorridorCard } from "@/components/trade/CorridorCard";

export function TradeHomeView() {
  const { t } = useTranslation();

  return (
    <PublicShell stickyCta={false}>
      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="bg-ortaq-surface border-b border-ortaq-border">
        <Container wide>
          <div className="py-16 sm:py-20 lg:py-24">
            <div className="max-w-3xl">
              <p className={cn(typography.label, "mb-4 text-ortaq-trust")}>
                {t("trade.hero.label")}
              </p>
              <h1
                className={cn(
                  "font-body text-[2rem] font-semibold leading-[1.1] tracking-[-0.03em] text-ortaq-ink",
                  "sm:text-[2.5rem] lg:text-[3rem]",
                )}
              >
                {t("trade.hero.headline")}
              </h1>
              <p
                className={cn(
                  typography.body,
                  "mt-4 max-w-xl text-[1rem] leading-relaxed sm:text-[1.0625rem]",
                )}
              >
                {t("trade.hero.sub")}
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/demo"
                  className={cn(
                    "inline-flex min-h-12 items-center justify-center gap-2 rounded-ortaq-sm bg-ortaq-ink px-6 text-[0.9375rem] font-semibold leading-none text-ortaq-cream shadow-[var(--shadow-product)] transition-colors hover:bg-ortaq-ink-muted active:scale-[0.99]",
                  )}
                >
                  {t("trade.hero.ctaPrimary")}
                </Link>
                <Link
                  href="/nasil-calisir"
                  className={cn(
                    "inline-flex min-h-12 items-center justify-center gap-2 rounded-ortaq-sm border border-ortaq-border-strong bg-transparent px-6 text-[0.9375rem] font-medium text-ortaq-ink transition-colors hover:bg-ortaq-bg",
                  )}
                >
                  {t("trade.hero.ctaSecondary")}
                </Link>
              </div>
            </div>

            {/* Workflow timeline */}
            <div className="mt-12 sm:mt-14">
              <p className={cn(typography.label, "mb-4 text-ortaq-ink-soft")}>
                {t("trade.workflow.label")}
              </p>
              <TradeWorkflowTimeline activeStep="inspection" />
            </div>
          </div>
        </Container>
      </section>

      {/* ── PROBLEM ──────────────────────────────────────────────── */}
      <ProblemStrip />

      {/* ── PRODUCT — TRADE ROOM ─────────────────────────────────── */}
      <section className="bg-ortaq-surface border-b border-ortaq-border">
        <Container wide>
          <div className="py-14 sm:py-18 lg:py-20">
            <div className="mb-10 max-w-2xl">
              <p className={cn(typography.label, "mb-3 text-ortaq-trust")}>
                {t("trade.product.label")}
              </p>
              <h2 className={cn(typography.display, "mb-3")}>
                {t("trade.product.headline")}
              </h2>
              <p className={cn(typography.body, "max-w-lg")}>
                {t("trade.product.sub")}
              </p>
            </div>

            <TradeRoomPreview />
          </div>
        </Container>
      </section>

      {/* ── WORKFLOW MODULES ─────────────────────────────────────── */}
      <WorkflowModuleGrid />

      {/* ── CORRIDORS ────────────────────────────────────────────── */}
      <section className="bg-ortaq-bg border-b border-ortaq-border">
        <Container wide>
          <div className="py-14 sm:py-18 lg:py-20">
            <div className="mb-10">
              <p className={cn(typography.label, "mb-3 text-ortaq-ink-soft")}>
                {t("trade.corridors.label")}
              </p>
              <h2 className={cn(typography.display, "mb-3")}>
                {t("trade.corridors.headline")}
              </h2>
              <p className={cn(typography.body, "max-w-xl")}>
                {t("trade.corridors.sub")}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <CorridorCard corridor="asean" />
              <CorridorCard corridor="gulf" />
              <CorridorCard corridor="europe" />
            </div>
          </div>
        </Container>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────────── */}
      <section className="bg-ortaq-dark">
        <Container wide>
          <div className="py-14 sm:py-18 lg:py-20 text-center">
            <h2
              className={cn(
                "font-body text-[1.75rem] font-semibold leading-[1.12] tracking-[-0.025em] text-ortaq-cream",
                "sm:text-[2.125rem]",
              )}
            >
              {t("trade.cta.headline")}
            </h2>
            <p className={cn(typography.body, "mx-auto mt-3 max-w-sm text-ortaq-cream/70")}>
              {t("trade.cta.sub")}
            </p>

            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/demo"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-ortaq-sm bg-ortaq-cream px-6 text-[0.9375rem] font-semibold text-ortaq-ink shadow-[var(--shadow-product)] transition-colors hover:bg-white active:scale-[0.99]"
              >
                {t("trade.cta.primary")}
              </Link>
              <Link
                href="/ekip"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-ortaq-sm border border-white/20 bg-transparent px-6 text-[0.9375rem] font-medium text-ortaq-cream/80 transition-colors hover:border-white/40 hover:text-ortaq-cream"
              >
                {t("trade.cta.secondary")}
              </Link>
            </div>

            <p className={cn(typography.caption, "mx-auto mt-8 max-w-sm text-ortaq-cream/40")}>
              {t("trade.cta.operator")}
            </p>
          </div>
        </Container>
      </section>
    </PublicShell>
  );
}
