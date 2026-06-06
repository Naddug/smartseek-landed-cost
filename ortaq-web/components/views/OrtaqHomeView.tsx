"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/cn";
import { Container } from "@/components/ui/Section";
import { PublicShell } from "@/components/layout/PublicShell";

import { TransformationHero } from "@/components/visuals/TransformationHero";
import { HeroDashboard }      from "@/components/visuals/HeroDashboard";
import { UsageStory }         from "@/components/visuals/UsageStory";
import { DecisionCards }      from "@/components/visuals/DecisionCards";
import { CommandCenter }      from "@/components/visuals/CommandCenter";
import { GlobalCollab }       from "@/components/visuals/GlobalCollab";

/**
 * ORTAQ Homepage — V4
 *
 * Success metric: a Turkish exporter understands ORTAQ
 * within 10 seconds without reading the full page.
 *
 * Every section answers one question visually:
 *  Hero    → "Aynı anlaşmanın iki hali" (pain + product in one shot)
 *  Section 2 → "Bir şirket bunu nasıl kullanır?"
 *  Section 3 → "Günlük kullanım nasıl görünür?"
 *  Section 4 → "Hangi sorulara anında cevap alırım?"
 *  Section 5 → "Yönetim nasıl görür?"
 *  Section 6 → "Karşı taraflarla nasıl çalışır?"
 *
 * Language rules enforced throughout:
 *  ✓ fiyat, sözleşme, SGS, sevkiyat, ödeme, onay, revizyon
 *  ✗ workflow, collaboration, platform, command center, coordination
 */
export function OrtaqHomeView() {
  const { t } = useTranslation();

  return (
    <PublicShell stickyCta={false}>

      {/* ══════════════════════════════════════════════════════════════
          HERO — pain and product in one split-screen shot.
          Left: chaos (DURUM BELİRSİZ). Right: ORTAQ (DURUM NET).
          Visitor understands within 5 seconds — no scrolling needed.
      ══════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden border-b border-ortaq-border bg-ortaq-surface">
        <GridPattern />
        <Container wide>
          <div className="relative py-12 sm:py-16">

            {/* Headline */}
            <div className="mb-8 text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-ortaq-trust/30 bg-ortaq-trust/6 px-3 py-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-ortaq-trust" />
                <span className="text-[0.6875rem] font-semibold text-ortaq-trust">
                  {t("home.hero.eyebrow")}
                </span>
              </div>

              <h1 className="mx-auto max-w-2xl font-body font-bold tracking-[-0.04em] text-ortaq-ink leading-[1.02] text-[2.5rem] sm:text-[3.25rem]">
                {t("home.hero.h1a")}<br />
                <span className="text-ortaq-trust">{t("home.hero.h1b")}</span>
              </h1>

              <p className="mx-auto mt-4 max-w-[30rem] text-[1rem] leading-[1.7] text-ortaq-ink-muted">
                {t("home.hero.sub")}
              </p>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/demo"
                  className="inline-flex min-h-11 items-center justify-center rounded-lg bg-ortaq-ink px-7 text-[0.9375rem] font-semibold text-ortaq-cream shadow-[var(--shadow-product)] transition-all hover:bg-ortaq-ink-muted active:scale-[0.98]"
                >
                  {t("home.hero.cta")}
                </Link>
                <Link
                  href="/nasil-calisir"
                  className="inline-flex min-h-11 items-center justify-center rounded-lg border border-ortaq-border-strong px-5 text-[0.9375rem] font-medium text-ortaq-ink transition-colors hover:bg-ortaq-bg"
                >
                  {t("home.hero.ctaSecondary")} →
                </Link>
              </div>
            </div>

            {/* THE transformation split-screen */}
            <TransformationHero />
          </div>
        </Container>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 2 — "Bir şirket ORTAQ'ı böyle kullanır."
          The operational portfolio view. Multiple active deals.
          Different stages, different counterparties, real amounts.
      ══════════════════════════════════════════════════════════════ */}
      <section className="border-b border-ortaq-border bg-ortaq-bg">
        <Container wide>
          <div className="py-14 sm:py-16">
            <SectionHead
              label={t("usage.dashTitle")}
              sub={t("usage.dashSub")}
              align="center"
            />
            <div className="mt-8">
              <HeroDashboard />
            </div>
          </div>
        </Container>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 3 — "Sabahın ilk 2 saati."
          Three roles. Same morning. Each sees what matters to them.
          Business language: SGS, ödeme, akreditif, sözleşme.
      ══════════════════════════════════════════════════════════════ */}
      <section className="border-b border-ortaq-border bg-ortaq-surface">
        <Container wide>
          <div className="py-14 sm:py-16">
            <SectionHead
              label={t("usage.sectionTitle")}
              sub={t("usage.sectionSub")}
              align="center"
            />
            <div className="mt-8">
              <UsageStory />
            </div>
          </div>
        </Container>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 4 — "Hangi sorulara anında cevap alırsınız?"
          Four critical questions every transaction generates.
          Before: dark, searching. After: instant, specific.
      ══════════════════════════════════════════════════════════════ */}
      <section className="border-b border-ortaq-border bg-ortaq-bg">
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
          SECTION 5 — "Yönetim tüm işlemleri nasıl görür?"
          Dark. Large numbers. Color communicates everything.
          2 durmuş, 3 ilerliyor — no reading required.
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
          SECTION 6 — "Farklı ülkeler. Aynı işlem."
          Turkey, Thailand, Germany, Singapore — same deal screen.
          Both sides see current status simultaneously.
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
          CTA — direct, specific, no buzzwords.
      ══════════════════════════════════════════════════════════════ */}
      <section className="bg-ortaq-dark">
        <Container wide>
          <div className="py-16 sm:py-20 text-center">
            <h2 className="font-body font-bold tracking-[-0.035em] text-ortaq-cream leading-[1.08] text-[2rem] sm:text-[2.625rem]">
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
      <h2 className={cn("font-body font-bold tracking-[-0.035em] leading-[1.08] text-[1.875rem] sm:text-[2.375rem]", labelColor)}>
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
