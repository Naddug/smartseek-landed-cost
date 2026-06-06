"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/cn";
import { typography } from "@/design/typography";
import { Container } from "@/components/ui/Section";
import { PublicShell } from "@/components/layout/PublicShell";
import { UnifiedInbox } from "@/components/ortaq/UnifiedInbox";
import { FragmentationGrid } from "@/components/ortaq/FragmentationGrid";
import { TransactionStatus } from "@/components/ortaq/TransactionStatus";

/**
 * Homepage — visual-first, bilingual (TR default / EN via switcher).
 *
 * Design rule: every major section contains a visual component.
 * No text-only sections.
 *
 * Sections:
 *  1. Hero        — "All commercial work. One place." + UnifiedInbox visual
 *  2. Problem     — FragmentationGrid showing 6 scattered tools
 *  3. Solution    — Unified feed callout + TransactionStatus board
 *  4. Approvals   — Visual approval flow
 *  5. Documents   — Document version tracker visual
 *  6. Category    — System of Record positioning
 *  7. CTA         — Dark, direct
 */
export function OrtaqHomeView() {
  const { t } = useTranslation();

  return (
    <PublicShell stickyCta={false}>

      {/* ══ 1. HERO ═══════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden border-b border-ortaq-border bg-ortaq-surface">
        {/* Subtle grid bg */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(var(--color-ortaq-ink) 1px, transparent 1px), linear-gradient(90deg, var(--color-ortaq-ink) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <Container wide>
          <div className="relative grid min-h-[calc(100dvh-3.75rem)] grid-cols-1 items-center gap-8 py-12 lg:grid-cols-[1fr_1.45fr] lg:gap-10 lg:py-14">

            {/* Copy */}
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
                  "text-[2.5rem] leading-[1.02] sm:text-[3rem] lg:text-[3.375rem] xl:text-[3.875rem]",
                )}
              >
                {t("home.hero.h1a")}
                <br />
                <span className="text-ortaq-trust">{t("home.hero.h1b")}</span>
              </h1>

              <p className="mt-5 max-w-[22rem] text-[1rem] leading-[1.65] text-ortaq-ink-muted sm:text-[1.0625rem]">
                {t("home.hero.sub")}
              </p>

              {/* Source icons row */}
              <div className="mt-6 flex flex-wrap items-center gap-2">
                {[
                  { label: "WhatsApp", color: "bg-[#25D366]/10 text-[#128C7E] border-[#25D366]/30" },
                  { label: "E-posta", color: "bg-blue-50 text-blue-600 border-blue-200" },
                  { label: "PDF", color: "bg-red-50 text-red-600 border-red-200" },
                  { label: "Excel", color: "bg-green-50 text-green-700 border-green-200" },
                  { label: "ERP", color: "bg-ortaq-bg text-ortaq-ink-soft border-ortaq-border" },
                  { label: "Dahili Mesajlar", color: "bg-violet-50 text-violet-700 border-violet-200" },
                ].map((s) => (
                  <span
                    key={s.label}
                    className={cn(
                      "rounded-full border px-2.5 py-1 text-[0.625rem] font-semibold",
                      s.color,
                    )}
                  >
                    {s.label}
                  </span>
                ))}
                <span className="text-[0.75rem] text-ortaq-ink-soft">→ ORTAQ</span>
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

              <p className={cn(typography.caption, "mt-6 text-ortaq-ink-soft")}>
                LEGO Group · Petlas · Yiğit Akü operatörleri tarafından kuruldu.
              </p>
            </div>

            {/* Hero visual — the product */}
            <div className="w-full">
              <UnifiedInbox />
            </div>
          </div>
        </Container>
      </section>

      {/* ══ 2. THE PROBLEM — fragmentation visual ═══════════════════ */}
      <section className="border-b border-ortaq-border bg-ortaq-bg">
        <Container wide>
          <div className="py-14 sm:py-16">
            <div className="mb-10 text-center">
              <p className={cn(typography.label, "mb-3 text-ortaq-accent")}>
                {t("home.fragmentation.eyebrow")}
              </p>
              <h2
                className={cn(
                  "font-body font-bold tracking-[-0.03em] text-ortaq-ink",
                  "text-[1.875rem] sm:text-[2.25rem]",
                )}
              >
                {t("home.fragmentation.h2")}
              </h2>
              <p className={cn(typography.body, "mx-auto mt-3 max-w-md")}>
                {t("home.fragmentation.sub")}
              </p>
            </div>

            {/* The 6 silos */}
            <FragmentationGrid />

            {/* Conclusion */}
            <div className="mt-8 rounded-xl border border-ortaq-accent/20 bg-ortaq-accent/5 px-6 py-5 text-center">
              <p
                className={cn(
                  "font-body font-semibold tracking-[-0.02em] text-ortaq-ink",
                  "text-[1.125rem] sm:text-[1.375rem]",
                )}
              >
                {t("home.fragmentation.conclusion")}
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* ══ 3. THE SOLUTION — unified view ══════════════════════════ */}
      <section className="border-b border-ortaq-border bg-ortaq-surface">
        <Container wide>
          <div className="py-14 sm:py-16">
            <div className="mb-10">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className={cn(typography.label, "mb-3 text-ortaq-trust")}>
                    {t("home.unified.eyebrow")}
                  </p>
                  <h2
                    className={cn(
                      "font-body font-bold tracking-[-0.03em] text-ortaq-ink",
                      "text-[1.875rem] sm:text-[2.25rem]",
                    )}
                  >
                    {t("home.unified.h2")}
                  </h2>
                </div>
                <p className={cn(typography.body, "sm:max-w-xs sm:text-right")}>
                  {t("home.unified.sub")}
                </p>
              </div>
            </div>

            {/* Transaction board visual */}
            <div className="mx-auto max-w-2xl">
              <TransactionStatus />
            </div>

            {/* What the feed shows */}
            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: "Ne kararlaştırıldı", desc: "Onaylanan her anlaşma kayıt altında. Her iki taraf görür.", color: "trust" },
                { label: "Ne değişti", desc: "Her revizyon, hangi sürümden, kim tarafından — belgelenmiş.", color: "neutral" },
                { label: "Kim bekliyor", desc: "Sıra kimde, görev kimin — net, isimli, tarihli.", color: "trust" },
                { label: "Sırada ne var", desc: "Bir sonraki adım her zaman görünür. Hiçbir şey kaybolmaz.", color: "neutral" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-ortaq-border bg-ortaq-bg p-4"
                >
                  <div className={cn(
                    "mb-2 inline-flex h-2 w-2 rounded-full",
                    item.color === "trust" ? "bg-ortaq-trust" : "bg-ortaq-border-strong",
                  )} />
                  <p className="text-[0.8125rem] font-bold text-ortaq-ink">{item.label}</p>
                  <p className={cn(typography.bodySm, "mt-1 leading-relaxed")}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ══ 4. APPROVALS — visual approval flow ═════════════════════ */}
      <section className="border-b border-ortaq-border bg-ortaq-bg-alt">
        <Container wide>
          <div className="py-14 sm:py-16">
            <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
              <div>
                <p className={cn(typography.label, "mb-3 text-ortaq-ink-soft")}>
                  {t("home.approvals.eyebrow")}
                </p>
                <h2
                  className={cn(
                    "font-body font-bold tracking-[-0.03em] text-ortaq-ink",
                    "text-[1.875rem] sm:text-[2.25rem]",
                  )}
                >
                  {t("home.approvals.h2")}
                </h2>
                <p className={cn(typography.body, "mt-4 max-w-md")}>
                  {t("home.approvals.sub")}
                </p>
                <ul className="mt-6 space-y-2">
                  {[
                    "Onay talebi doğrudan yetkili kişiye gider",
                    "Her onay tarih ve isimle kayıt altına alınır",
                    "Her iki taraf durumu gerçek zamanlı görür",
                    "Hiçbir karar e-postada kaybolmaz",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <svg className="mt-0.5 h-4 w-4 shrink-0 text-ortaq-trust" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l4 4 6-6" />
                      </svg>
                      <span className={cn(typography.body)}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Approval flow visual */}
              <div className="rounded-2xl border border-ortaq-border bg-white p-5 shadow-[var(--shadow-product)]">
                <div className="mb-4 flex items-center gap-2">
                  <span className="text-base">📋</span>
                  <p className="text-[0.75rem] font-bold text-ortaq-ink">Onay Akışı — Ödeme Koşulları</p>
                </div>

                {[
                  {
                    step: "Talep",
                    actor: "Yılmaz Ç.",
                    desc: "Net 30 LC at sight ödeme koşulları onayı",
                    status: "done",
                    time: "09:14",
                  },
                  {
                    step: "Finans Onayı",
                    actor: "Mehmet K.",
                    desc: "Ödeme koşulları kabul edildi. Akreditif limitimiz dahilinde.",
                    status: "done",
                    time: "11:22",
                  },
                  {
                    step: "Karşı Taraf",
                    actor: "Selim K. (BestBuild)",
                    desc: "Koşullar onaylandı — sözleşmede belirtilsin",
                    status: "done",
                    time: "13:05",
                  },
                  {
                    step: "Kayıt",
                    actor: "ORTAQ",
                    desc: "Ödeme koşulları her iki tarafça onaylandı. Sözleşmeye eklendi.",
                    status: "recorded",
                    time: "13:05",
                  },
                ].map((row, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className={cn(
                        "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[0.5rem] font-bold",
                        row.status === "recorded"
                          ? "bg-ortaq-trust text-white"
                          : "bg-emerald-100 text-emerald-700",
                      )}>
                        {row.status === "recorded" ? "✓" : i + 1}
                      </div>
                      {i < 3 && <div className="my-1 h-6 w-px bg-ortaq-border" />}
                    </div>
                    <div className="pb-3 min-w-0">
                      <div className="flex items-baseline gap-2">
                        <p className="text-[0.625rem] font-bold text-ortaq-ink">{row.step}</p>
                        <p className="text-[0.5rem] text-ortaq-ink-soft">{row.actor} · {row.time}</p>
                      </div>
                      <p className={cn(typography.caption, "mt-0.5 leading-snug")}>{row.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ══ 5. DOCUMENTS — version tracker visual ═══════════════════ */}
      <section className="border-b border-ortaq-border bg-ortaq-surface">
        <Container wide>
          <div className="py-14 sm:py-16">
            <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
              {/* Document version visual */}
              <div className="order-2 lg:order-1 rounded-2xl border border-ortaq-border bg-white p-5 shadow-[var(--shadow-product)]">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-[0.75rem] font-bold text-ortaq-ink">SteelSupply_Contract.pdf</p>
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[0.5rem] font-bold text-emerald-700">
                    v3 — Geçerli
                  </span>
                </div>

                <div className="space-y-2">
                  {[
                    {
                      v: "v1",
                      label: "İlk Taslak",
                      author: "Yılmaz Ç.",
                      date: "2 Haz, 09:00",
                      status: "superseded",
                      changes: "İlk sözleşme şablonu",
                    },
                    {
                      v: "v2",
                      label: "Revize",
                      author: "Selim K.",
                      date: "3 Haz, 10:35",
                      status: "superseded",
                      changes: "Madde 4.2 ödeme koşulları güncellendi",
                    },
                    {
                      v: "v3",
                      label: "İmzalı — Final",
                      author: "Yılmaz Ç.",
                      date: "3 Haz, 14:02",
                      status: "current",
                      changes: "Her iki tarafça imzalandı. Geçerli sürüm.",
                    },
                  ].map((doc) => (
                    <div
                      key={doc.v}
                      className={cn(
                        "flex items-start gap-3 rounded-lg border p-3",
                        doc.status === "current"
                          ? "border-emerald-200 bg-emerald-50"
                          : "border-ortaq-border bg-ortaq-bg",
                      )}
                    >
                      <div className={cn(
                        "flex h-7 w-7 shrink-0 items-center justify-center rounded-md border text-[0.5rem] font-bold",
                        doc.status === "current"
                          ? "border-emerald-300 bg-white text-emerald-700"
                          : "border-ortaq-border bg-white text-ortaq-ink-soft",
                      )}>
                        {doc.v}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline justify-between gap-2">
                          <p className={cn(
                            "text-[0.5625rem] font-bold",
                            doc.status === "current" ? "text-emerald-700" : "text-ortaq-ink-muted",
                          )}>
                            {doc.label}
                          </p>
                          <span className="shrink-0 text-[0.4375rem] text-ortaq-ink-soft">{doc.date}</span>
                        </div>
                        <p className="text-[0.5rem] text-ortaq-ink-soft">{doc.author}</p>
                        <p className={cn(
                          "mt-0.5 text-[0.5rem] leading-snug",
                          doc.status === "current" ? "text-emerald-700" : "text-ortaq-ink-soft",
                        )}>
                          {doc.changes}
                        </p>
                      </div>
                      {doc.status === "current" && (
                        <svg className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l4 4 6-6" />
                        </svg>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-3 rounded-lg border border-ortaq-trust/20 bg-ortaq-trust/5 px-3 py-2">
                  <p className="text-[0.5625rem] font-medium text-ortaq-trust">
                    v3 geçerli sürüm. Her iki taraf erişebilir. Tüm geçmiş takip edildi.
                  </p>
                </div>
              </div>

              <div className="order-1 lg:order-2">
                <p className={cn(typography.label, "mb-3 text-ortaq-ink-soft")}>
                  {t("home.documents.eyebrow")}
                </p>
                <h2
                  className={cn(
                    "font-body font-bold tracking-[-0.03em] text-ortaq-ink",
                    "text-[1.875rem] sm:text-[2.25rem]",
                  )}
                >
                  {t("home.documents.h2")}
                </h2>
                <p className={cn(typography.body, "mt-4 max-w-md")}>
                  {t("home.documents.sub")}
                </p>
                <ul className="mt-6 space-y-2">
                  {[
                    "Her belge anlaşmaya bağlı, bağlam içinde",
                    "Tüm sürümler takip edilir, eski hiç silinmez",
                    "Geçerli kopya her zaman açıkça işaretli",
                    "Her iki taraf aynı belgeye erişir",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <svg className="mt-0.5 h-4 w-4 shrink-0 text-ortaq-trust" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l4 4 6-6" />
                      </svg>
                      <span className={cn(typography.body)}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ══ 6. CATEGORY STATEMENT ════════════════════════════════════ */}
      <section className="border-b border-ortaq-border bg-ortaq-ink">
        <Container wide>
          <div className="py-16 sm:py-20">
            <div className="mx-auto max-w-3xl text-center">
              <p className={cn(typography.label, "mb-5 text-white/40")}>
                {t("home.category.eyebrow")}
              </p>
              <h2
                className={cn(
                  "font-body font-bold tracking-[-0.03em] text-ortaq-cream leading-[1.08]",
                  "text-[2rem] sm:text-[2.625rem]",
                )}
              >
                {t("home.category.h2")}
              </h2>
              <p className="mx-auto mt-5 max-w-lg text-[0.9375rem] leading-[1.65] text-white/60">
                {t("home.category.sub")}
              </p>

              <div className="mx-auto mt-8 max-w-xl rounded-2xl border border-ortaq-trust/30 bg-ortaq-trust/10 px-6 py-5">
                <p className={cn(
                  "font-body font-bold tracking-[-0.02em] text-ortaq-trust leading-[1.2]",
                  "text-[1.125rem] sm:text-[1.375rem]",
                )}>
                  &ldquo;{t("home.category.callout")}&rdquo;
                </p>
              </div>

              {/* Three pillars */}
              <div className="mt-10 grid gap-3 sm:grid-cols-3">
                {[
                  { n: "01", title: "Görünür", desc: "Her taahhüt, karar ve onay görünür hale gelir." },
                  { n: "02", title: "Takip Edilebilir", desc: "Her değişiklik kayıt altında. Kim, ne zaman, neden." },
                  { n: "03", title: "Eyleme Dönüştürülebilir", desc: "Her beklenti netleştirilmiş. Bir sonraki adım her zaman açık." },
                ].map((p) => (
                  <div key={p.n} className="rounded-xl border border-white/10 bg-white/5 px-4 py-5 text-left">
                    <p className="mb-2 text-[1.25rem] font-bold text-white/20 leading-none">{p.n}</p>
                    <p className="text-[0.875rem] font-bold text-ortaq-cream">{p.title}</p>
                    <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-white/55">{p.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ══ 7. CTA ═══════════════════════════════════════════════════ */}
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
