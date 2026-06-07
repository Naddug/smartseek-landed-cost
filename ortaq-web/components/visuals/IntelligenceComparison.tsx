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
        from: "Hamburg Steel <procurement@hamburgsteel.de>",
        subject: "Re: Kartal Çelik — Muayene Durumu",
        body: "\"SGS report pending. Vessel departs June 28.\"",
      }
    : {
        label: "Incoming email",
        from: "Hamburg Steel <procurement@hamburgsteel.de>",
        subject: "Re: Kartal Steel — Inspection Status",
        body: "\"SGS report pending. Vessel departs June 28.\"",
      };

  /* ── Generic AI response ──────────────────────────────────────────── */
  const genericAI = isTR
    ? {
        label: "Genel Yapay Zekâ",
        badge: "GPT / Copilot / Gemini",
        response: "SGS raporu bekleniyor. Gemi 28 Haziran'da kalkıyor.",
        note: "Metni özetler. Operasyonu anlamaz.",
        items: [
          { text: "Yazılanı Türkçeye çevirdi", type: "neutral" as const },
          { text: "Metni özetledi", type: "neutral" as const },
          { text: "Bu bilginin ne anlama geldiğini bilmiyor", type: "missing" as const },
          { text: "Hangi riski taşıdığını bilmiyor", type: "missing" as const },
          { text: "Ne yapılması gerektiğini bilmiyor", type: "missing" as const },
        ],
      }
    : {
        label: "Generic AI",
        badge: "GPT / Copilot / Gemini",
        response: "SGS report pending. Vessel departs June 28.",
        note: "Summarizes the text. Doesn't understand the operation.",
        items: [
          { text: "Translated or paraphrased the text", type: "neutral" as const },
          { text: "Produced a summary", type: "neutral" as const },
          { text: "Doesn't know what this means operationally", type: "missing" as const },
          { text: "Doesn't know what risk this creates", type: "missing" as const },
          { text: "Doesn't know what action is required", type: "missing" as const },
        ],
      };

  /* ── ORTAQ response — the operational chain ───────────────────────── */
  const ortaqResponse = isTR
    ? {
        label: "ORTAQ",
        badge: "Operasyonel anlama",
        chain: [
          {
            type: "dependency" as const,
            icon: "🔗",
            text: "SGS onaylanmadan sevkiyat başlayamaz.",
          },
          {
            type: "dependency" as const,
            icon: "🔗",
            text: "Sevkiyat başlamazsa Konşimento (BL) düzenlenemez.",
          },
          {
            type: "dependency" as const,
            icon: "🔗",
            text: "BL düzenlenmezse LC ödemesi tetiklenemez.",
          },
          {
            type: "risk" as const,
            icon: "⚠",
            text: "28 Haziran'a 6 gün kaldı. SGS için 2–3 gün gerekiyor.",
          },
          {
            type: "risk" as const,
            icon: "⚠",
            text: "3 gün içinde aksiyon alınmazsa operasyon risk altına girer.",
          },
        ],
        action: {
          text: "Alıcıyla bugün iletişime geçin",
          role: "Operasyon",
          urgency: "bugün",
        },
        conclusion: "Bu bir cümle değil. Bir sevkiyat riski.",
      }
    : {
        label: "ORTAQ",
        badge: "Operational understanding",
        chain: [
          {
            type: "dependency" as const,
            icon: "🔗",
            text: "Shipment cannot begin without SGS approval.",
          },
          {
            type: "dependency" as const,
            icon: "🔗",
            text: "Without shipment, Bill of Lading (BL) cannot be issued.",
          },
          {
            type: "dependency" as const,
            icon: "🔗",
            text: "Without BL, LC payment cannot be triggered.",
          },
          {
            type: "risk" as const,
            icon: "⚠",
            text: "6 days until June 28. SGS process requires 2–3 days.",
          },
          {
            type: "risk" as const,
            icon: "⚠",
            text: "If action isn't taken within 3 days, the entire operation is at risk.",
          },
        ],
        action: {
          text: "Contact buyer today",
          role: "Operations",
          urgency: "today",
        },
        conclusion: "This is not a sentence. This is a shipment risk.",
      };

  const chainStyles = {
    dependency: "border-l-gray-300 bg-gray-50/50 text-ortaq-ink",
    risk:       "border-l-amber-400 bg-amber-50/60 text-ortaq-ink font-medium",
  } as const;

  return (
    <div className="overflow-hidden rounded-2xl border border-ortaq-border bg-ortaq-ink shadow-[0_8px_32px_rgb(20_19_16/0.2)]">

      {/* ── Source email — shared context ──────────────────────────── */}
      <div className="border-b border-ortaq-cream/10 px-5 py-4 sm:px-7">
        <p className="mb-2 text-[0.5rem] font-bold uppercase tracking-[0.1em] text-ortaq-cream/40">
          {email.label}
        </p>
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

        {/* LEFT — Generic AI */}
        <div className="border-b border-ortaq-cream/10 p-5 sm:border-b-0 sm:border-r sm:p-7">
          <div className="mb-3 flex items-start justify-between gap-2">
            <div>
              <p className="text-[0.5625rem] font-bold text-ortaq-cream/60">{genericAI.label}</p>
              <span className="mt-0.5 inline-block rounded bg-ortaq-cream/10 px-1.5 py-0.5 text-[0.375rem] font-semibold text-ortaq-cream/40">
                {genericAI.badge}
              </span>
            </div>
          </div>

          {/* Generic AI output — just the summary */}
          <div className="mb-4 rounded-lg border border-ortaq-cream/10 bg-white/5 px-4 py-3">
            <p className="text-[0.5625rem] italic text-ortaq-cream/60">
              &ldquo;{genericAI.response}&rdquo;
            </p>
          </div>

          {/* What generic AI did / didn't do */}
          <div className="space-y-1.5">
            {genericAI.items.map((item, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className={cn(
                  "mt-px flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full text-[0.38rem] font-bold",
                  item.type === "neutral"
                    ? "bg-ortaq-cream/10 text-ortaq-cream/50"
                    : "bg-red-900/30 text-red-400",
                )}>
                  {item.type === "neutral" ? "✓" : "✗"}
                </span>
                <p className={cn(
                  "text-[0.46rem] leading-snug",
                  item.type === "neutral" ? "text-ortaq-cream/50" : "text-red-400/80",
                )}>
                  {item.text}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-4 text-[0.46rem] italic text-ortaq-cream/30">
            {genericAI.note}
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
                <p className="text-[0.46rem] leading-snug">
                  {step.text}
                </p>
              </div>
            ))}
          </div>

          {/* Action terminal — visually distinct from the chain */}
          <div className="mt-3 overflow-hidden rounded-lg border-2 border-ortaq-trust bg-ortaq-trust">
            <div className="flex items-center gap-3 px-3 py-2.5">
              <span className="shrink-0 text-[0.875rem] font-bold text-white">→</span>
              <p className="flex-1 text-[0.5rem] font-bold text-white leading-snug">
                {ortaqResponse.action.text}
              </p>
              <div className="flex shrink-0 items-center gap-1.5">
                <span className="rounded bg-white/20 px-1.5 py-0.5 text-[0.375rem] font-bold text-white/80">
                  {ortaqResponse.action.role}
                </span>
                <span className="text-[0.4375rem] font-bold text-white/70">
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
