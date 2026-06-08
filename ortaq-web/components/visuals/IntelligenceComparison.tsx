"use client";

import { useTranslation } from "react-i18next";
import { cn } from "@/lib/cn";

/**
 * IntelligenceComparison — Sprint 4
 *
 * The clearest articulation of ORTAQ's differentiation.
 * Shows the exact same input (one email sentence) processed two ways:
 *
 * Generic AI → reads the text, returns a summary of the text.
 * ORTAQ      → reads the operational context, returns what it MEANS:
 *              dependency chain, risk level, time pressure, required action.
 *
 * This is not about AI being bad. Generic AI is useful for many things.
 * ORTAQ is different because it understands the *operation*, not just the text.
 *
 * The section heading poses the question visitors are already asking:
 * "If I already have AI tools, what does ORTAQ add?"
 *
 * This answers it in one visual.
 */
export function IntelligenceComparison() {
  const { i18n } = useTranslation();
  const isTR = (i18n.language ?? "tr").startsWith("tr");

  /* ── The source email — identical for both sides ──────────────────── */
  const email = isTR
    ? {
        label: "Gelen email",
        from: "Al Noor Trading <procurement@alnoor.ae>",
        subject: "Re: Ayçiçek Yağı — LC Belgeleri",
        body: "\"LC tadilatı hâlâ bekliyor. Yükleme penceresi 30 Haziran'da kapanıyor.\"",
      }
    : {
        label: "Incoming email",
        from: "Al Noor Trading <procurement@alnoor.ae>",
        subject: "Re: Sunflower Oil — LC Documents",
        body: "\"LC amendment still pending. Loading window closes June 30.\"",
      };

  /* ── Email summary only ───────────────────────────────────────────── */
  const emailSummary = isTR
    ? {
        label: "Email özeti",
        badge: "Manuel okuma",
        response: "LC tadilatı bekleniyor. Yükleme penceresi 30 Haziran'da kapanıyor.",
        note: "Cümleyi tekrarlar. Bağımlı adımlar ve atanmış iş listelenmez.",
        items: [
          { text: "LC–banka bağımlılığı gösterilmedi", type: "missing" as const },
          { text: "Gecikme riski işaretlenmedi", type: "missing" as const },
          { text: "Sonraki iş atanmadı", type: "missing" as const },
        ],
      }
    : {
        label: "Email summary",
        badge: "Manual read",
        response: "LC amendment pending. Loading window closes June 30.",
        note: "Restates the sentence. Does not list dependent steps or assigned work.",
        items: [
          { text: "LC–bank dependency not shown", type: "missing" as const },
          { text: "Delay risk not flagged", type: "missing" as const },
          { text: "Next action not assigned", type: "missing" as const },
        ],
      };

  /* ── ORTAQ response — the operational chain ───────────────────────── */
  const ortaqResponse = isTR
    ? {
        label: "ORTAQ",
        badge: "Bağımlılık zinciri",
        chain: [
          {
            type: "dependency" as const,
            icon: "🔗",
            text: "LC tadilatı tamamlanmadan banka yükleme onayı vermez.",
          },
          {
            type: "dependency" as const,
            icon: "🔗",
            text: "Banka onayı olmadan konşimento (BL) düzenlenemez.",
          },
          {
            type: "dependency" as const,
            icon: "🔗",
            text: "BL olmadan yükleme başlayamaz.",
          },
          {
            type: "risk" as const,
            icon: "⚠",
            text: "30 Haziran'a 4 gün kaldı. LC süreci 2–3 gün gerekiyor.",
          },
          {
            type: "risk" as const,
            icon: "⚠",
            text: "2 gün içinde aksiyon alınmazsa yükleme penceresi kaçar.",
          },
        ],
        action: {
          text: "Bankayla bugün iletişime geçin",
          role: "Finans",
          urgency: "bugün",
        },
      }
    : {
        label: "ORTAQ",
        badge: "Dependency chain",
        chain: [
          {
            type: "dependency" as const,
            icon: "🔗",
            text: "Bank won't approve loading until LC amendment is complete.",
          },
          {
            type: "dependency" as const,
            icon: "🔗",
            text: "Without bank approval, Bill of Lading (BL) cannot be issued.",
          },
          {
            type: "dependency" as const,
            icon: "🔗",
            text: "Without BL, loading cannot begin.",
          },
          {
            type: "risk" as const,
            icon: "⚠",
            text: "4 days until June 30. LC process requires 2–3 days.",
          },
          {
            type: "risk" as const,
            icon: "⚠",
            text: "If action isn't taken within 2 days, the loading window is missed.",
          },
        ],
        action: {
          text: "Contact bank today",
          role: "Finance",
          urgency: "today",
        },
      };

  const chainStyles = {
    dependency: "border-l-gray-200 bg-gray-50/30 text-ortaq-ink/60",
    risk:       "border-l-4 border-l-amber-500 bg-amber-50 text-ortaq-ink font-semibold",
  } as const;

  return (
    <div className="overflow-hidden rounded-2xl border border-ortaq-border bg-ortaq-ink shadow-[0_8px_32px_rgb(20_19_16/0.2)]">

      {/* ── Source email — shared context ──────────────────────────── */}
      <div className="border-b border-ortaq-cream/10 px-5 py-3 sm:px-7 opacity-70">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <p className="text-[0.5rem] font-bold uppercase tracking-[0.1em] text-ortaq-cream/30">
            {email.label}
          </p>
          <span className="rounded border border-ortaq-cream/15 bg-ortaq-cream/5 px-1.5 py-0.5 text-[0.35rem] font-semibold text-ortaq-cream/40">
            {isTR ? "Bağlı email hesabı" : "Connected email account"}
          </span>
        </div>
        <div className="overflow-hidden rounded-lg border border-ortaq-cream/10 bg-white/5">
          <div className="border-b border-ortaq-cream/10 px-4 py-2">
            <p className="text-[0.46rem] text-ortaq-cream/50">{email.from}</p>
            <p className="text-[0.5rem] font-semibold text-ortaq-cream/80">{email.subject}</p>
          </div>
          <div className="px-4 py-3">
            <p className="font-mono text-[0.5625rem] font-bold text-ortaq-cream italic">
              {email.body}
            </p>
          </div>
        </div>
      </div>

      {/* ── Two-column comparison ───────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2">

        {/* LEFT — Email summary */}
        <div className="border-b border-ortaq-cream/10 p-5 opacity-45 sm:border-b-0 sm:border-r sm:p-7">
          <div className="mb-3 flex items-start justify-between gap-2">
            <div>
              <p className="text-[0.5625rem] font-bold text-ortaq-cream/60">{emailSummary.label}</p>
              <span className="mt-0.5 inline-block rounded bg-ortaq-cream/10 px-1.5 py-0.5 text-[0.375rem] font-semibold text-ortaq-cream/40">
                {emailSummary.badge}
              </span>
            </div>
          </div>

          <div className="mb-4 rounded-lg border border-ortaq-cream/10 bg-white/5 px-4 py-3">
            <p className="text-[0.5625rem] italic text-ortaq-cream/60">
              &ldquo;{emailSummary.response}&rdquo;
            </p>
          </div>

          <div className="space-y-1.5">
            {emailSummary.items.map((item, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="mt-px flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-red-900/30 text-[0.38rem] font-bold text-red-400">
                  ✗
                </span>
                <p className="text-[0.46rem] leading-snug text-red-400/80">
                  {item.text}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-4 text-[0.46rem] italic text-ortaq-cream/30">
            {emailSummary.note}
          </p>
        </div>

        {/* RIGHT — ORTAQ */}
        <div className="p-5 sm:p-7">
          <div className="mb-3 flex items-start justify-between gap-2">
            <div>
              <p className="text-[0.5625rem] font-bold text-ortaq-trust">{ortaqResponse.label}</p>
              <span className="mt-0.5 inline-block rounded bg-ortaq-trust/20 px-1.5 py-0.5 text-[0.375rem] font-semibold text-ortaq-trust/70">
                {ortaqResponse.badge}
              </span>
            </div>
          </div>

          {/* Operational chain — dependency + risk nodes */}
          <div className="space-y-1.5">
            {ortaqResponse.chain.map((step, i) => (
              <div
                key={i}
                className={cn(
                  "flex items-start gap-2 rounded-r-lg border-l-2 px-3 py-2",
                  chainStyles[step.type],
                )}
              >
                <span className="shrink-0 text-[0.6rem] leading-none mt-0.5">
                  {step.icon}
                </span>
                <p className={cn(
                  "leading-snug",
                  step.type === "risk" ? "text-[0.52rem] sm:text-[0.54rem]" : "text-[0.44rem]",
                )}>
                  {step.text}
                </p>
              </div>
            ))}
          </div>

          {/* Action terminal — visually distinct from the chain */}
          <div className="mt-4 overflow-hidden rounded-lg border-2 border-ortaq-trust-deep bg-ortaq-trust shadow-[0_4px_16px_rgb(0_0_0/0.2)]">
            <div className="flex items-center gap-3 px-4 py-3.5">
              <span className="shrink-0 text-[1rem] font-bold text-white">→</span>
              <p className="flex-1 text-[0.5625rem] font-bold text-white leading-snug sm:text-[0.625rem]">
                {ortaqResponse.action.text}
              </p>
              <div className="flex shrink-0 items-center gap-1.5">
                <span className="rounded bg-white/25 px-2 py-0.5 text-[0.4rem] font-bold text-white">
                  {ortaqResponse.action.role}
                </span>
                <span className="text-[0.46rem] font-bold text-white">
                  {ortaqResponse.action.urgency}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
