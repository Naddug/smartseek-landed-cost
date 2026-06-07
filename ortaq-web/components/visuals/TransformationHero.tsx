"use client";

import { useTranslation } from "react-i18next";

/**
 * TransformationHero — Sprint 4: READ → UNDERSTAND → RECOMMEND
 *
 * LEFT  (fragmented reality): 4 input signals all about the same operational
 *        situation (SGS muayene / sevkiyat). Each fragment is real; together
 *        they answer nothing — the human still doesn't know what's happening.
 *
 * RIGHT (ORTAQ reasoning):   Three distinct output layers:
 *        A — BULDU  (what ORTAQ found)      — green ✓
 *        B — ANLADI (what it understands)   — amber ⚠
 *        C — ÖNERİSİ (what it recommends)  — blue →
 *
 * Visitor must read the left side and feel the weight of not knowing.
 * Then read the right and immediately understand that ORTAQ *reasons*,
 * not just organises.
 */

export function TransformationHero() {
  const { i18n } = useTranslation();
  const isTR = (i18n.language ?? "tr").startsWith("tr");

  /* ── Left panel: fragmented inputs ───────────────────────────────────── */
  const inputs = isTR
    ? [
        {
          source: "Outlook",
          icon: "📧",
          color: "#0078D4",
          sender: "Hamburg Steel — Satınalma",
          text: "SGS muayene raporu hâlâ bekleniyor. Sevkiyat onayı için muayene tamamlanmalı.",
          meta: "14 Haz · 08:14",
        },
        {
          source: "WhatsApp",
          icon: "💬",
          color: "#075E54",
          sender: "Kartal Çelik — Ops",
          text: "SGS raporu geldi mi? Gemi 28 Haziran'da kalkıyor, vakit daralıyor!",
          meta: "14 Haz · 11:32",
        },
        {
          source: "PDF",
          icon: "📄",
          color: "#E31837",
          sender: "SGS_RAPORU_v2_TASLAK.pdf",
          text: "Muayene sonucu: 14 parametreden 2'si standart dışı. Revizyon gerekiyor.",
          meta: "Açıldı — Onaysız",
        },
        {
          source: "Toplantı Notu",
          icon: "📝",
          color: "#6B7280",
          sender: "15 Haziran görüşmesi",
          text: "Teslimat tarihi 22 Haz'dan 25 Haz'a kaydı. Alıcı onayı sözlü verildi.",
          meta: "Kayıt dışı",
        },
      ]
    : [
        {
          source: "Outlook",
          icon: "📧",
          color: "#0078D4",
          sender: "Hamburg Steel — Procurement",
          text: "SGS inspection report still pending. Shipment approval requires completed inspection.",
          meta: "Jun 14 · 08:14",
        },
        {
          source: "WhatsApp",
          icon: "💬",
          color: "#075E54",
          sender: "Kartal Steel — Ops",
          text: "Has the SGS report arrived? Vessel departs June 28, time is running out!",
          meta: "Jun 14 · 11:32",
        },
        {
          source: "PDF",
          icon: "📄",
          color: "#E31837",
          sender: "SGS_REPORT_v2_DRAFT.pdf",
          text: "Inspection result: 2 of 14 parameters out of standard. Revision required.",
          meta: "Opened — Unapproved",
        },
        {
          source: "Meeting Note",
          icon: "📝",
          color: "#6B7280",
          sender: "June 15 Meeting",
          text: "Delivery date moved from Jun 22 to Jun 25. Buyer verbally confirmed.",
          meta: "Unrecorded",
        },
      ];

  /* ── Right panel: ORTAQ reasoning output ────────────────────────────── */
  const found = isTR
    ? [
        "SGS taslak raporu alındı — 14 Haz 09:47",
        "Alıcı onayı bekleniyor — 2 gündür yanıt yok",
        "Teslimat 22 Haz → 25 Haz (güncellendi)",
      ]
    : [
        "SGS draft report received — Jun 14, 09:47",
        "Buyer approval pending — no response for 2 days",
        "Delivery Jun 22 → Jun 25 (updated)",
      ];

  const understood = isTR
    ? [
        "Muayene onaylanmadan sevkiyat başlayamaz",
        "LC son tarihi 30 Haz — 5 günlük risk penceresi",
      ]
    : [
        "Shipment cannot begin without inspection approval",
        "LC deadline Jun 30 — 5-day risk window",
      ];

  const recommended = isTR
    ? [
        "Alıcıyla bugün iletişime geçin — 2 gündür yanıt yok",
        "Revize teslimat tarihini karşı tarafa yazılı bildirin",
      ]
    : [
        "Contact buyer today — no response for 2 days",
        "Notify counterparty of revised delivery date in writing",
      ];

  const labels = isTR
    ? { left: "DAĞINIK BİLGİ", right: "ORTAQ ÇIKARIMI", found: "ORTAQ BULDU", understood: "ORTAQ ANLADI", recommended: "ORTAQ ÖNERİSİ" }
    : { left: "FRAGMENTED INPUTS", right: "ORTAQ OUTPUT", found: "ORTAQ FOUND", understood: "ORTAQ UNDERSTANDS", recommended: "ORTAQ RECOMMENDS" };

  return (
    <div className="overflow-hidden rounded-2xl border border-ortaq-border shadow-[0_12px_48px_rgb(20_19_16/0.13)]">
      <div className="grid grid-cols-1 sm:grid-cols-2">

        {/* ══ LEFT — FRAGMENTED INPUTS ═══════════════════════════════════ */}
        <div className="flex flex-col border-b border-ortaq-border bg-[#FBF0ED] sm:border-b-0 sm:border-r">

          {/* Panel header */}
          <div className="flex items-center justify-between border-b border-red-200/50 bg-[#f5e4df] px-4 py-2">
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
              <span className="text-[0.475rem] font-bold uppercase tracking-[0.07em] text-red-700">
                {labels.left}
              </span>
            </div>
            <span className="text-[0.4rem] text-red-500/70">
              {isTR ? "4 kaynak · 1 soru · 0 cevap" : "4 sources · 1 question · 0 answers"}
            </span>
          </div>

          {/* Input fragments */}
          <div className="flex-1 divide-y divide-red-100/80 px-3 py-2 space-y-0">
            {inputs.map((inp, i) => (
              <div key={i} className="flex items-start gap-2 py-2">
                <div
                  className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded text-[0.6rem]"
                  style={{ backgroundColor: inp.color + "18" }}
                >
                  {inp.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <span className="text-[0.42rem] font-bold text-red-900/70 leading-none truncate">
                      {inp.sender}
                    </span>
                    <span className="shrink-0 text-[0.35rem] text-red-400/80">{inp.meta}</span>
                  </div>
                  <p className="text-[0.42rem] leading-snug text-red-900/60 line-clamp-2">
                    {inp.text}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Question footer */}
          <div className="flex items-center justify-between border-t border-red-200/50 bg-red-900/5 px-4 py-2">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-red-500" />
              <span className="text-[0.6875rem] font-bold text-red-700">
                {isTR ? "Şu an gerçekten ne oluyor?" : "What is actually happening right now?"}
              </span>
            </div>
          </div>
        </div>

        {/* ══ RIGHT — ORTAQ REASONING ════════════════════════════════════ */}
        <div className="flex flex-col bg-white">

          {/* Panel header */}
          <div className="flex items-center justify-between border-b border-emerald-200/50 bg-emerald-50/40 px-4 py-2">
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span className="text-[0.475rem] font-bold uppercase tracking-[0.07em] text-emerald-700">
                {labels.right}
              </span>
            </div>
            <span className="text-[0.4rem] text-emerald-600/70">
              {isTR ? "Kartal Çelik · Hamburg Steel · €840.000" : "Kartal Steel · Hamburg Steel · €840,000"}
            </span>
          </div>

          {/* Section A — FOUND */}
          <div className="border-b border-ortaq-border/60 px-3 py-2">
            <p className="mb-1.5 text-[0.38rem] font-bold uppercase tracking-[0.09em] text-emerald-600">
              {labels.found}
            </p>
            <div className="space-y-1.5">
              {found.map((item, i) => (
                <div key={i} className="flex items-start gap-1.5">
                  <span className="mt-px flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[0.38rem] font-bold text-emerald-700">
                    ✓
                  </span>
                  <p className="text-[0.46rem] leading-snug text-ortaq-ink">{item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section B — UNDERSTANDS */}
          <div className="border-b border-ortaq-border/60 bg-amber-50/30 px-3 py-2">
            <p className="mb-1.5 text-[0.38rem] font-bold uppercase tracking-[0.09em] text-amber-600">
              {labels.understood}
            </p>
            <div className="space-y-1.5">
              {understood.map((item, i) => (
                <div key={i} className="flex items-start gap-1.5">
                  <span className="mt-px flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-amber-100 text-[0.38rem] font-bold text-amber-700">
                    ⚠
                  </span>
                  <p className="text-[0.46rem] leading-snug text-ortaq-ink font-medium">{item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section C — RECOMMENDS */}
          <div className="flex-1 bg-ortaq-trust/[0.03] px-3 py-2">
            <p className="mb-1.5 text-[0.38rem] font-bold uppercase tracking-[0.09em] text-ortaq-trust">
              {labels.recommended}
            </p>
            <div className="space-y-1.5">
              {recommended.map((item, i) => (
                <div key={i} className="flex items-start gap-1.5">
                  <span className="mt-px flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-ortaq-trust/15 text-[0.42rem] font-bold text-ortaq-trust">
                    →
                  </span>
                  <p className="text-[0.46rem] leading-snug text-ortaq-ink font-medium">{item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Status footer */}
          <div className="flex items-center justify-between border-t border-emerald-200/50 bg-emerald-50/30 px-4 py-2">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              <span className="text-[0.6875rem] font-bold text-emerald-700">
                {isTR ? "Operasyon anlaşıldı" : "Operation understood"}
              </span>
            </div>
            <span className="text-[0.38rem] text-ortaq-ink-soft">
              {isTR ? "4 kaynak · 3 çıkarım · 2 öneri" : "4 sources · 3 findings · 2 actions"}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
