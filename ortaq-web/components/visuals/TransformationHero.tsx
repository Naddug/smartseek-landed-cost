"use client";

import { useTranslation } from "react-i18next";
import { cn } from "@/lib/cn";

/**
 * TransformationHero — the most important visual on the homepage.
 *
 * Split screen. SAME deal. Two realities.
 *
 * The deal identity (name, counterparty, amount) is prominently visible
 * on BOTH sides so the visitor immediately understands:
 * "This is the same transaction. Before and after ORTAQ."
 *
 * LEFT  (chaos):
 *   - Deal identity in the header (Çelik Tedariki · BestBuild · €840.000)
 *   - 6 scattered app windows: WhatsApp, Email, PDF x2, Excel, SGS
 *   - 5 unanswered questions as red chips
 *   - "DURUM BELİRSİZ" in red at the bottom
 *
 * RIGHT (ORTAQ):
 *   - SAME deal identity in the header (mirrored)
 *   - 6 answered rows — each directly answers one of the 5 questions
 *   - "DURUM NET" in green at the bottom
 *
 * Design rules:
 *  - Questions on left map 1:1 to answers on right
 *  - No randomness — chaos is visually recognizable, not just messy
 *  - The contrast does all the work; no paragraph copy needed
 */
export function TransformationHero() {
  const { t } = useTranslation();

  const questions = [
    t("transform.q1"),
    t("transform.q2"),
    t("transform.q3"),
    t("transform.q4"),
    t("transform.q5"),
  ];

  const answers = [
    { main: t("transform.a1"), detail: t("transform.a1detail"), tag: t("transform.a1tag"), type: "confirmed" as const },
    { main: t("transform.a2"), detail: t("transform.a2detail"), tag: t("transform.a2tag"), type: "confirmed" as const },
    { main: t("transform.a3"), detail: t("transform.a3detail"), tag: t("transform.a3tag"), type: "pending" as const },
    { main: t("transform.a4"), detail: t("transform.a4detail"), tag: t("transform.a4tag"), type: "pending" as const },
    { main: t("transform.a5"), detail: t("transform.a5detail"), tag: t("transform.a5tag"), type: "confirmed" as const },
    { main: t("transform.a6"), detail: t("transform.a6detail"), tag: t("transform.a6tag"), type: "live" as const },
  ] as const;

  const dealName = t("transform.dealName");
  const counterparty = t("transform.counterparty");
  const amount = t("transform.amount");

  return (
    <div className="overflow-hidden rounded-2xl border border-ortaq-border shadow-[0_12px_48px_rgb(20_19_16/0.13)]">
      <div className="grid grid-cols-1 sm:grid-cols-2">

        {/* ══ LEFT — CHAOS ════════════════════════════════════════ */}
        <div className="flex flex-col border-b border-ortaq-border bg-[#FBF0ED] sm:border-b-0 sm:border-r">

          {/* Panel header — deal identity clearly shown on left too */}
          <div className="border-b border-red-200/50 bg-[#f5e4df] px-4 py-2.5">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
                <span className="text-[0.5rem] font-bold uppercase tracking-[0.08em] text-red-700">
                  {t("transform.chaosLabel")}
                </span>
              </div>
              {/* Same deal identity as right panel */}
              <div className="flex items-center gap-1.5 text-right">
                <span className="text-[0.4375rem] font-semibold text-red-900/60">{dealName}</span>
                <span className="text-[0.4375rem] text-red-400">·</span>
                <span className="text-[0.4375rem] font-semibold text-red-900/60">{counterparty}</span>
                <span className="text-[0.4375rem] text-red-400">·</span>
                <span className="text-[0.4375rem] font-bold text-red-700">{amount}</span>
              </div>
            </div>
          </div>

          {/* Scattered app windows — organized chaos */}
          <div className="relative overflow-hidden" style={{ aspectRatio: "4/3", minHeight: 240 }}>
            <div className="absolute inset-0 bg-gradient-to-br from-red-100/20 via-transparent to-orange-100/15" />

            {/* WhatsApp */}
            <MiniCard style={{ top: "4%", left: "2%", width: "44%", zIndex: 8 }} rotate="-2deg">
              <MiniBar app="WhatsApp" color="#075E54" dot="#25D366" />
              <div className="space-y-0.5 p-1.5">
                <WaBubble text={t("transform.q1")} incoming />
                <WaBubble text={t("transform.q4")} incoming />
                <div className="mt-0.5 flex items-center gap-0.5 text-[0.35rem] text-[#128C7E]">
                  <span className="h-1 w-1 rounded-full bg-[#25D366] animate-pulse" />
                  <span>47 okunmamış</span>
                </div>
              </div>
            </MiniCard>

            {/* Email */}
            <MiniCard style={{ top: "3%", right: "2%", width: "46%", zIndex: 7 }} rotate="1.5deg">
              <MiniBar app="Email" color="#0078D4" dot="#0078D4" />
              <div className="p-1.5 space-y-0.5">
                <div className="rounded bg-blue-50 px-1 py-0.5">
                  <p className="truncate text-[0.4rem] font-bold text-blue-900">Re: Re: Fwd: SPA_v12_final_FINAL.pdf</p>
                  <p className="truncate text-[0.35rem] text-gray-400">{t("transform.q2")}</p>
                </div>
                <div className="flex items-center gap-0.5 text-[0.35rem] text-gray-400">
                  <span>📎</span><span className="line-through">SPA_v11.pdf</span>
                </div>
              </div>
            </MiniCard>

            {/* PDF v12 */}
            <MiniCard style={{ top: "42%", left: "5%", width: "38%", zIndex: 10 }} rotate="-3deg">
              <MiniBar app="PDF" color="#C0392B" dot="#C0392B" />
              <div className="flex items-start gap-1 p-1.5">
                <span className="text-[0.75rem]">📄</span>
                <div>
                  <p className="text-[0.4rem] font-bold text-gray-800 leading-tight">SPA_v12_final_FINAL.pdf</p>
                  <div className="mt-0.5 rounded border border-amber-200 bg-amber-50 px-0.5 py-px">
                    <p className="text-[0.35rem] font-bold text-amber-700">Bu mu güncel?</p>
                  </div>
                </div>
              </div>
            </MiniCard>

            {/* PDF v11 (behind) */}
            <MiniCard style={{ top: "49%", left: "18%", width: "34%", zIndex: 6 }} rotate="1.5deg">
              <MiniBar app="PDF" color="#C0392B" dot="#C0392B" dim />
              <div className="flex items-start gap-1 p-1.5 opacity-50">
                <span className="text-[0.75rem]">📄</span>
                <p className="text-[0.35rem] font-bold text-gray-400 line-through leading-tight">SPA_v11_revize.pdf</p>
              </div>
            </MiniCard>

            {/* Excel */}
            <MiniCard style={{ top: "38%", right: "2%", width: "42%", zIndex: 9 }} rotate="2deg">
              <MiniBar app="Excel" color="#217346" dot="#217346" />
              <div className="p-1.5">
                <p className="text-[0.4rem] font-semibold text-green-800 leading-tight">FIYAT_v3_FINAL_revize.xlsx</p>
                <div className="mt-1 flex gap-0.5">
                  {["v1","v2","v3","v4"].map((v,i) => (
                    <span key={v} className={cn(
                      "rounded px-0.5 py-px text-[0.3rem] font-bold",
                      i === 3 ? "bg-green-200 text-green-700" : "bg-gray-100 text-gray-300 line-through"
                    )}>{v}</span>
                  ))}
                </div>
              </div>
            </MiniCard>

            {/* SGS */}
            <MiniCard style={{ bottom: "5%", left: "12%", width: "40%", zIndex: 8 }} rotate="-1.5deg">
              <MiniBar app="SGS Raporu" color="#E31837" dot="#E31837" />
              <div className="p-1.5">
                <p className="text-[0.4rem] font-bold text-gray-700">{t("transform.q3")}</p>
                <div className="mt-0.5 rounded bg-amber-100 px-1 py-px">
                  <p className="text-[0.35rem] font-bold text-amber-700">TASLAK — Onaylı değil</p>
                </div>
              </div>
            </MiniCard>

            {/* Voice note */}
            <MiniCard style={{ bottom: "4%", right: "3%", width: "36%", zIndex: 7 }} rotate="2.5deg">
              <MiniBar app="WhatsApp" color="#075E54" dot="#25D366" />
              <div className="p-1.5">
                <div className="flex items-center gap-1 rounded-lg bg-[#ECE5DD] px-1 py-1">
                  <span className="h-3 w-3 rounded-full bg-[#25D366] text-[0.3rem] text-white flex items-center justify-center shrink-0">▶</span>
                  <div className="flex gap-px flex-1 justify-center">
                    {[2,4,3,5,2,4,3,2].map((h,i) => (
                      <div key={i} className="w-px rounded-full bg-[#128C7E]" style={{height: h * 1.5}} />
                    ))}
                  </div>
                  <p className="text-[0.35rem] text-[#128C7E] shrink-0">1:47</p>
                </div>
                <p className="mt-0.5 text-[0.3rem] text-red-500 font-semibold">Dinlenmedi · 2 gün</p>
              </div>
            </MiniCard>
          </div>

          {/* Questions */}
          <div className="flex flex-wrap gap-1.5 px-4 pb-3 pt-2">
            {questions.map((q) => (
              <span key={q} className="rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-[0.5rem] font-medium text-red-700">
                {q}
              </span>
            ))}
          </div>

          {/* Status bar */}
          <div className="flex items-center justify-between border-t border-red-200/50 bg-red-900/8 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-red-500" />
              <span className="text-[0.75rem] font-bold tracking-[0.03em] text-red-700">
                {t("transform.chaosStatus")}
              </span>
            </div>
            <span className="text-[0.4375rem] font-medium text-red-500/70">5 soru · 0 cevap</span>
          </div>
        </div>

        {/* ══ RIGHT — ORTAQ ═══════════════════════════════════════ */}
        <div className="flex flex-col bg-white">

          {/* Panel header — SAME deal identity mirrored */}
          <div className="border-b border-emerald-200/50 bg-emerald-50/40 px-4 py-2.5">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span className="text-[0.5rem] font-bold uppercase tracking-[0.08em] text-emerald-700">
                  {t("transform.ortaqLabel")}
                </span>
              </div>
              {/* Same deal identity — mirrored from left */}
              <div className="flex items-center gap-1.5 text-right">
                <span className="text-[0.4375rem] font-semibold text-ortaq-ink">{dealName}</span>
                <span className="text-[0.4375rem] text-ortaq-ink-soft">·</span>
                <span className="text-[0.4375rem] font-semibold text-ortaq-ink">{counterparty}</span>
                <span className="text-[0.4375rem] text-ortaq-ink-soft">·</span>
                <span className="text-[0.4375rem] font-bold text-ortaq-trust">{amount}</span>
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="border-b border-ortaq-border px-4 py-2">
            <div className="flex items-center gap-3">
              <div className="flex-1 h-1.5 overflow-hidden rounded-full bg-ortaq-border">
                <div className="h-full w-[78%] rounded-full bg-ortaq-trust" />
              </div>
              <span className="text-[0.5rem] font-bold text-ortaq-trust shrink-0">78%</span>
              <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[0.375rem] font-bold text-amber-700 shrink-0">
                Muayene Aşaması
              </span>
            </div>
          </div>

          {/* Answered rows — each directly answers a question from the left */}
          <div className="flex-1 divide-y divide-ortaq-border/60">
            {answers.map((a, i) => (
              <AnswerRow key={i} {...a} />
            ))}
          </div>

          {/* Status bar */}
          <div className="flex items-center justify-between border-t border-emerald-200/50 bg-emerald-50/40 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              <span className="text-[0.75rem] font-bold tracking-[0.03em] text-emerald-700">
                {t("transform.ortaqStatus")}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="flex -space-x-1">
                {["YÇ","SK","MK","BB"].map((init) => (
                  <span key={init} className="inline-flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-ortaq-trust/15 text-[0.35rem] font-bold text-ortaq-trust">
                    {init}
                  </span>
                ))}
              </div>
              <span className="text-[0.4375rem] text-ortaq-ink-soft">Her iki taraf görüyor</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

/* ── helpers ── */

function MiniCard({ children, style, rotate = "0deg" }: { children: React.ReactNode; style: React.CSSProperties; rotate?: string }) {
  return (
    <div
      className="absolute overflow-hidden rounded-lg border border-black/[0.07] bg-white shadow-[0_3px_12px_rgb(0_0_0/0.14)]"
      style={{ ...style, transform: `rotate(${rotate})` }}
    >
      {children}
    </div>
  );
}

function MiniBar({ app, color, dot, dim }: { app: string; color: string; dot: string; dim?: boolean }) {
  return (
    <div className={cn("flex items-center gap-0.5 border-b border-black/[0.05] px-1.5 py-0.5", dim ? "bg-gray-50" : "bg-[#f7f7f7]")}>
      <span className="h-1.5 w-1.5 rounded-full bg-[#ff5f57]" />
      <span className="h-1.5 w-1.5 rounded-full bg-[#febc2e]" />
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: dot }} />
      <span className="ml-1 text-[0.35rem] font-semibold" style={{ color }}>{app}</span>
    </div>
  );
}

function WaBubble({ text, incoming }: { text: string; incoming?: boolean }) {
  return (
    <div className={cn("flex", incoming ? "justify-start" : "justify-end")}>
      <div className={cn(
        "max-w-[90%] rounded-xl px-1.5 py-0.5 text-[0.4rem] leading-snug",
        incoming ? "rounded-tl-none bg-white shadow-sm text-gray-700" : "rounded-tr-none bg-[#DCF8C6] text-gray-700"
      )}>
        {text}
      </div>
    </div>
  );
}

const answerStyles = {
  confirmed: {
    row: "bg-emerald-50/30",
    icon: "bg-emerald-100 text-emerald-700",
    tag: "bg-emerald-100 text-emerald-700",
    symbol: "✓",
  },
  pending: {
    row: "bg-amber-50/30",
    icon: "bg-amber-100 text-amber-700",
    tag: "bg-amber-100 text-amber-700",
    symbol: "⏳",
  },
  live: {
    row: "bg-ortaq-trust/[0.04]",
    icon: "bg-ortaq-trust/15 text-ortaq-trust",
    tag: "bg-ortaq-trust/15 text-ortaq-trust",
    symbol: "●",
  },
} as const;

function AnswerRow({ main, detail, tag, type }: {
  main: string;
  detail: string;
  tag: string;
  type: keyof typeof answerStyles;
}) {
  const s = answerStyles[type];
  return (
    <div className={cn("flex items-start gap-2.5 px-3 py-2", s.row)}>
      <span className={cn("mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[0.5rem] font-bold", s.icon)}>
        {s.symbol}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-[0.5625rem] font-semibold text-ortaq-ink leading-snug">{main}</p>
        <p className="text-[0.4375rem] text-ortaq-ink-soft leading-snug">{detail}</p>
      </div>
      <span className={cn("shrink-0 rounded-full px-1.5 py-0.5 text-[0.375rem] font-bold whitespace-nowrap", s.tag)}>
        {tag}
      </span>
    </div>
  );
}
