"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/cn";
import { typography } from "@/design/typography";
import { Container } from "@/components/ui/Section";
import { PublicShell } from "@/components/layout/PublicShell";
import { DealRoomCard } from "@/components/trade/DealRoomCard";
import { UseCasesGrid } from "@/components/trade/UseCasesGrid";
import { HowItWorksSection } from "@/components/trade/HowItWorksSection";

export function TradeHomeView() {
  const { t } = useTranslation();

  return (
    <PublicShell stickyCta={false}>

      {/* ══ HERO — split-screen ═══════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-ortaq-surface border-b border-ortaq-border">
        <Container wide>
          <div className="grid min-h-[calc(100dvh-3.75rem)] grid-cols-1 items-center gap-10 py-16 lg:grid-cols-2 lg:gap-16 lg:py-20">

            {/* Left — copy */}
            <div className="flex flex-col">
              <p className={cn(typography.label, "mb-5 text-ortaq-trust")}>
                {t("trade.hero.eyebrow")}
              </p>

              <h1
                className={cn(
                  "font-body font-bold tracking-[-0.035em] text-ortaq-ink leading-[1.06]",
                  "text-[2.5rem] sm:text-[3rem] lg:text-[3.5rem] xl:text-[4rem]",
                )}
              >
                {t("trade.hero.headline")}
              </h1>

              <p
                className={cn(
                  "mt-5 max-w-md leading-relaxed text-ortaq-ink-muted",
                  "text-[1rem] sm:text-[1.0625rem]",
                )}
              >
                {t("trade.hero.sub")}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/demo"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-ortaq-sm bg-ortaq-ink px-6 text-[0.9375rem] font-semibold leading-none text-ortaq-cream shadow-[var(--shadow-product)] transition-colors hover:bg-ortaq-ink-muted active:scale-[0.99]"
                >
                  {t("trade.hero.ctaPrimary")}
                </Link>
                <Link
                  href="/demo"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-ortaq-sm border border-ortaq-border-strong bg-transparent px-6 text-[0.9375rem] font-medium text-ortaq-ink transition-colors hover:bg-ortaq-bg"
                >
                  {t("trade.hero.ctaSecondary")}
                </Link>
              </div>

              {/* Trust signal below CTAs */}
              <p className={cn(typography.caption, "mt-7 text-ortaq-ink-soft")}>
                {t("trade.trust.credential")}
              </p>
            </div>

            {/* Right — Deal Room preview */}
            <div className="relative flex items-center justify-center">
              {/* Subtle background disc */}
              <div
                className="absolute inset-0 -z-10 rounded-full opacity-[0.04]"
                style={{ background: "radial-gradient(circle at 60% 50%, #1e4d3d 0%, transparent 70%)" }}
              />
              <DealRoomCard />
            </div>
          </div>
        </Container>
      </section>

      {/* ══ PROBLEM — brief & emotional ══════════════════════════════ */}
      <section className="bg-ortaq-bg-alt border-b border-ortaq-border">
        <Container wide>
          <div className="py-14 sm:py-16">
            <div className="mx-auto max-w-3xl text-center">
              <p className={cn(typography.label, "mb-4 text-ortaq-accent")}>
                {t("trade.problem.eyebrow")}
              </p>
              <h2
                className={cn(
                  "font-body font-bold tracking-[-0.03em] text-ortaq-ink leading-[1.1]",
                  "text-[1.75rem] sm:text-[2.125rem]",
                )}
              >
                {t("trade.problem.headline")}
              </h2>
              <p className={cn(typography.body, "mx-auto mt-4 max-w-xl")}>
                {t("trade.problem.sub")}
              </p>
            </div>

            {/* 4-tool chaos strip */}
            <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {(["whatsapp", "email", "excel", "pdf"] as const).map((tool) => (
                <div
                  key={tool}
                  className="rounded-ortaq-lg border border-ortaq-border bg-ortaq-surface p-4 text-center"
                >
                  <p className={cn(typography.h3, "mb-1")}>
                    {t(`trade.problem.tools.${tool}.name`)}
                  </p>
                  <p className={cn(typography.caption, "leading-snug")}>
                    {t(`trade.problem.tools.${tool}.problem`)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ══ PRODUCT — Deal Room demo ══════════════════════════════════ */}
      <section className="bg-ortaq-surface border-b border-ortaq-border">
        <Container wide>
          <div className="py-14 sm:py-18 lg:py-20">
            <div className="mb-12 max-w-2xl">
              <p className={cn(typography.label, "mb-3 text-ortaq-trust")}>
                {t("trade.product.eyebrow")}
              </p>
              <h2
                className={cn(
                  "font-body font-bold tracking-[-0.03em] text-ortaq-ink leading-[1.1]",
                  "text-[1.75rem] sm:text-[2.125rem]",
                )}
              >
                {t("trade.product.headline")}
              </h2>
              <p className={cn(typography.body, "mt-3 max-w-lg")}>
                {t("trade.product.sub")}
              </p>
            </div>

            {/* Full-width deal room preview */}
            <FullDealRoomDemo />
          </div>
        </Container>
      </section>

      {/* ══ USE CASES ═════════════════════════════════════════════════ */}
      <UseCasesGrid />

      {/* ══ HOW IT WORKS ══════════════════════════════════════════════ */}
      <HowItWorksSection />

      {/* ══ TRUST ═════════════════════════════════════════════════════ */}
      <section className="bg-ortaq-bg border-b border-ortaq-border">
        <Container wide>
          <div className="py-12 sm:py-14">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="max-w-lg">
                <p className={cn(typography.label, "mb-2 text-ortaq-ink-soft")}>
                  {t("trade.trust.eyebrow")}
                </p>
                <h2 className={cn(typography.h1, "mb-2")}>
                  {t("trade.trust.headline")}
                </h2>
                <p className={cn(typography.body)}>
                  {t("trade.trust.sub")}
                </p>
              </div>
              <div className="shrink-0 rounded-ortaq-md border border-ortaq-border bg-ortaq-surface px-5 py-4 text-center shadow-[var(--shadow-product)]">
                <p className={cn(typography.caption, "mb-2 text-ortaq-ink-soft")}>Kurucu Ekip</p>
                <p className="text-[0.8125rem] font-semibold text-ortaq-ink">LEGO Group</p>
                <p className="text-[0.8125rem] font-semibold text-ortaq-ink">Petlas</p>
                <p className="text-[0.8125rem] font-semibold text-ortaq-ink">Yiğit Akü</p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ══ FINAL CTA ═════════════════════════════════════════════════ */}
      <section className="bg-ortaq-dark">
        <Container wide>
          <div className="py-16 sm:py-20 text-center">
            <h2
              className={cn(
                "font-body font-bold tracking-[-0.03em] text-ortaq-cream leading-[1.1]",
                "text-[1.75rem] sm:text-[2.25rem]",
              )}
            >
              {t("trade.cta.headline")}
            </h2>
            <p className={cn(typography.body, "mx-auto mt-3 max-w-sm text-ortaq-cream/70")}>
              {t("trade.cta.sub")}
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/demo"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-ortaq-sm bg-ortaq-cream px-7 text-[0.9375rem] font-semibold text-ortaq-ink shadow-[var(--shadow-product)] transition-colors hover:bg-white active:scale-[0.99]"
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

            <p className={cn(typography.caption, "mx-auto mt-10 max-w-sm text-ortaq-cream/35")}>
              {t("trade.cta.operator")}
            </p>
          </div>
        </Container>
      </section>

    </PublicShell>
  );
}

/** Wider, more detailed deal room demo for the product section */
function FullDealRoomDemo() {

  return (
    <div className="overflow-hidden rounded-ortaq-lg border border-ortaq-border shadow-[var(--shadow-elevated)]">
      {/* Chrome bar */}
      <div className="flex items-center gap-2 border-b border-ortaq-border bg-ortaq-bg px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <div className="mx-4 flex-1 rounded border border-ortaq-border bg-ortaq-surface px-3 py-0.5 text-[0.625rem] font-mono text-ortaq-ink-soft">
          ortaq.biz/deal/room/DS-2026-0219
        </div>
        <div className="flex items-center gap-1.5">
          {["YÇ", "BG", "SÇ"].map((init, i) => (
            <span
              key={init}
              style={{ zIndex: 3 - i, marginLeft: i > 0 ? -6 : 0 }}
              className={cn(
                "relative flex h-6 w-6 items-center justify-center rounded-full border border-white text-[0.5rem] font-bold",
                i === 0 && "bg-ortaq-trust/20 text-ortaq-trust",
                i === 1 && "bg-ortaq-status-soft text-ortaq-status",
                i === 2 && "bg-ortaq-bg-warm text-ortaq-ink-soft",
              )}
            >
              {init}
            </span>
          ))}
          <span className="ml-1 text-[0.6875rem] text-ortaq-ink-soft">3 katılımcı</span>
        </div>
      </div>

      {/* App body */}
      <div className="flex bg-ortaq-surface">
        {/* Sidebar */}
        <div className="w-44 shrink-0 border-r border-ortaq-border bg-ortaq-bg py-4">
          <div className="border-b border-ortaq-border px-4 pb-4">
            <p className="text-[0.625rem] font-medium uppercase tracking-[0.06em] text-ortaq-ink-soft">Distribütörlük Anlaşması</p>
            <p className="mt-1 text-[0.8125rem] font-semibold text-ortaq-ink leading-tight">Almanya Bölgesi — 2026</p>
          </div>

          <div className="px-3 pt-3">
            <p className="mb-1 px-1 text-[0.5625rem] font-medium uppercase tracking-[0.06em] text-ortaq-ink-soft">Adımlar</p>
            {[
              { label: "Teklif", done: true },
              { label: "Müzakere", done: false, active: true },
              { label: "Sözleşme", done: false },
              { label: "Yürütme", done: false },
              { label: "Kapandı", done: false },
            ].map((step) => (
              <div
                key={step.label}
                className={cn(
                  "flex items-center gap-2.5 rounded px-2 py-2 text-[0.75rem] font-medium",
                  step.active && "bg-ortaq-trust/8 text-ortaq-trust",
                  step.done && "text-ortaq-ink-muted",
                  !step.done && !step.active && "text-ortaq-ink-soft",
                )}
              >
                <span
                  className={cn(
                    "flex h-4 w-4 shrink-0 items-center justify-center rounded-full",
                    step.done && "bg-ortaq-trust text-ortaq-cream",
                    step.active && "border-2 border-ortaq-trust",
                    !step.done && !step.active && "border border-ortaq-border",
                  )}
                >
                  {step.done && (
                    <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 10 10" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2 5l2.5 2.5 3.5-4" />
                    </svg>
                  )}
                  {step.active && <span className="h-1.5 w-1.5 rounded-full bg-ortaq-trust" />}
                </span>
                {step.label}
              </div>
            ))}
          </div>
        </div>

        {/* Main panel */}
        <div className="flex-1 divide-y divide-ortaq-border">
          {/* Next action */}
          <div className="flex items-center justify-between gap-3 bg-ortaq-status-soft px-6 py-3">
            <div className="flex items-center gap-2.5">
              <span className="h-2 w-2 rounded-full bg-ortaq-status" />
              <p className="text-[0.8125rem] font-medium text-ortaq-status">
                BestBuild GmbH fiyat revizyonu talep etti — Bölge 3 komisyon oranı
              </p>
            </div>
            <button className="shrink-0 rounded px-3 py-1.5 text-[0.75rem] font-semibold bg-ortaq-status text-white hover:bg-blue-700">
              Yanıtla
            </button>
          </div>

          {/* Content grid */}
          <div className="grid grid-cols-5 divide-x divide-ortaq-border">
            {/* Document preview */}
            <div className="col-span-3 p-5">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-[0.6875rem] font-medium uppercase tracking-[0.06em] text-ortaq-ink-soft">Aktif Belge</p>
                  <p className="text-[0.875rem] font-semibold text-ortaq-ink mt-0.5">Distribütörlük Sözleşmesi v4.pdf</p>
                </div>
                <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[0.625rem] font-semibold text-amber-700">
                  İnceleme Bekliyor
                </span>
              </div>

              <div className="space-y-2 rounded-ortaq-md border border-ortaq-border bg-ortaq-bg p-4 text-[0.8125rem]">
                {[
                  { clause: "Madde 1", text: "Yetki Bölgesi: Almanya, Avusturya, İsviçre (DACH)", status: "onaylı" },
                  { clause: "Madde 3", text: "Komisyon: Bölge 1-2 için %8, Bölge 3 için %12", status: "revizyon" },
                  { clause: "Madde 7", text: "Süre: 24 ay, 12 ay ihbar süreli fesih hakkıyla", status: "onaylı" },
                  { clause: "Madde 9", text: "Minimum alım taahhüdü: Yıllık €2.4M", status: "müzakere" },
                ].map((row) => (
                  <div key={row.clause} className="flex items-start gap-3">
                    <span className="w-14 shrink-0 text-[0.6875rem] font-medium text-ortaq-ink-soft">{row.clause}</span>
                    <span className="flex-1 leading-snug text-ortaq-ink-muted">{row.text}</span>
                    <span
                      className={cn(
                        "shrink-0 rounded-full px-2 py-0.5 text-[0.5625rem] font-semibold",
                        row.status === "onaylı" && "bg-ortaq-trust/10 text-ortaq-trust",
                        row.status === "revizyon" && "bg-amber-50 text-amber-700",
                        row.status === "müzakere" && "bg-ortaq-status-soft text-ortaq-status",
                      )}
                    >
                      {row.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Activity + AI */}
            <div className="col-span-2 flex flex-col divide-y divide-ortaq-border">
              <div className="p-4">
                <p className="mb-3 text-[0.625rem] font-medium uppercase tracking-[0.06em] text-ortaq-ink-soft">Son Aktivite</p>
                <div className="space-y-3">
                  {[
                    { init: "BG", color: "status" as const, text: "Madde 3 komisyon oranına itiraz etti", time: "1 saat" },
                    { init: "YÇ", color: "trust" as const, text: "v4 sözleşme yükledi (revizyon içeriyor)", time: "3 saat" },
                    { init: "SÇ", color: "neutral" as const, text: "Avukat yorumunu ekledi — Madde 9 taahhüdü", time: "Dün" },
                  ].map((a) => (
                    <div key={a.text} className="flex items-start gap-2">
                      <span
                        className={cn(
                          "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[0.5rem] font-bold",
                          a.color === "status" && "bg-ortaq-status-soft text-ortaq-status",
                          a.color === "trust" && "bg-ortaq-trust/10 text-ortaq-trust",
                          a.color === "neutral" && "bg-ortaq-bg-alt text-ortaq-ink-soft",
                        )}
                      >
                        {a.init}
                      </span>
                      <div>
                        <p className="text-[0.6875rem] leading-snug text-ortaq-ink-muted">{a.text}</p>
                        <p className="mt-0.5 text-[0.5625rem] text-ortaq-ink-soft">{a.time} önce</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI */}
              <div className="p-4">
                <p className="mb-2 text-[0.625rem] font-medium uppercase tracking-[0.06em] text-ortaq-ink-soft">AI Önerisi</p>
                <div className="rounded-ortaq-md border border-ortaq-border bg-ortaq-bg p-3">
                  <p className="text-[0.6875rem] leading-relaxed text-ortaq-ink-muted">
                    Benzer distribütörlük anlaşmalarında Bölge 3 komisyonu %9-11 aralığında belirleniyor. Mevcut taslak %12 içeriyor. Uzlaşı noktası: %10?
                  </p>
                  <div className="mt-2 flex gap-1.5">
                    <button className="rounded border border-ortaq-border bg-white px-2 py-1 text-[0.5625rem] font-medium text-ortaq-ink hover:bg-ortaq-bg">
                      Analizi gör
                    </button>
                    <button className="rounded border border-ortaq-border bg-white px-2 py-1 text-[0.5625rem] font-medium text-ortaq-ink-soft hover:bg-ortaq-bg">
                      Yoksay
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
