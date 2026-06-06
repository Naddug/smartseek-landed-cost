"use client";

import { useTranslation } from "react-i18next";
import { cn } from "@/lib/cn";

/**
 * TransformationHero — the central visual of the homepage.
 *
 * Split screen. Same deal. Two realities.
 *
 * LEFT  — before ORTAQ: 6 scattered app windows + unanswered questions
 *         + large red "DURUM BELİRSİZ" status badge
 *
 * RIGHT — inside ORTAQ: same transaction, every question answered,
 *         items linked and contextualized, large green "DURUM NET" badge
 *
 * Visitor understands in 5 seconds:
 * "ORTAQ tells me the real status of a commercial transaction."
 *
 * Design rules:
 * - No message feed. No chat bubbles as the primary story.
 * - The questions on the left ARE the pain. The answers on the right ARE the product.
 * - Color does all the emotional work: warm red = stress, clean white = clarity.
 */
export function TransformationHero() {
  const { t } = useTranslation();

  const answers = [
    { text: t("transform.a1"), tag: t("transform.a1tag"), type: "confirmed" as const },
    { text: t("transform.a2"), tag: t("transform.a2tag"), type: "confirmed" as const },
    { text: t("transform.a3"), tag: t("transform.a3tag"), type: "pending" as const },
    { text: t("transform.a4"), tag: t("transform.a4tag"), type: "pending" as const },
    { text: t("transform.a5"), tag: t("transform.a5tag"), type: "confirmed" as const },
    { text: t("transform.a6"), tag: t("transform.a6tag"), type: "live" as const },
  ] as const;

  const questions = [
    t("transform.q1"),
    t("transform.q2"),
    t("transform.q3"),
    t("transform.q4"),
    t("transform.q5"),
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-ortaq-border shadow-[0_12px_48px_rgb(20_19_16/0.13)]">
      <div className="grid grid-cols-1 sm:grid-cols-2">

        {/* ══ LEFT — CHAOS ══════════════════════════════════════════ */}
        <div className="relative flex flex-col border-b border-ortaq-border bg-[#FBF0ED] sm:border-b-0 sm:border-r">

          {/* Header label */}
          <div className="flex items-center gap-2 border-b border-red-200/60 bg-red-900/5 px-4 py-2.5">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
            <span className="text-[0.5625rem] font-bold uppercase tracking-[0.08em] text-red-700">
              {t("transform.chaosLabel")}
            </span>
          </div>

          {/* Scattered items canvas */}
          <div
            className="relative overflow-hidden"
            style={{ aspectRatio: "4/3", minHeight: 240 }}
          >
            {/* Stress background texture */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-100/30 via-transparent to-orange-100/20" />

            {/* ── WhatsApp window ── */}
            <MiniCard style={{ top: "4%", left: "2%", width: "42%", zIndex: 8 }} rotate="-2deg">
              <MiniAppBar app="WhatsApp" color="#075E54" dot="#25D366" />
              <div className="space-y-0.5 p-1.5">
                <MiniWA text={t("transform.q1")} incoming />
                <MiniWA text={t("transform.q4")} incoming />
                <div className="flex items-center gap-0.5 text-[0.35rem] text-[#128C7E]">
                  <span className="h-1 w-1 rounded-full bg-[#25D366]" />
                  <span>47 okunmamış</span>
                </div>
              </div>
            </MiniCard>

            {/* ── Email ── */}
            <MiniCard style={{ top: "3%", right: "2%", width: "44%", zIndex: 7 }} rotate="1.5deg">
              <MiniAppBar app="Email" color="#0078D4" dot="#0078D4" />
              <div className="p-1.5 space-y-1">
                <div className="rounded bg-blue-50 px-1 py-0.5">
                  <p className="truncate text-[0.4rem] font-bold text-blue-900">
                    Re: Re: Fwd: SPA_v12_final_FINAL.pdf
                  </p>
                  <p className="truncate text-[0.35rem] text-gray-400">{t("transform.q2")}</p>
                </div>
                <div className="rounded bg-gray-50 px-1 py-0.5">
                  <p className="truncate text-[0.35rem] text-gray-400 line-through">SPA_v11_revize.pdf</p>
                </div>
              </div>
            </MiniCard>

            {/* ── PDF v12 ── */}
            <MiniCard style={{ top: "42%", left: "5%", width: "36%", zIndex: 10 }} rotate="-3deg">
              <MiniAppBar app="PDF" color="#C0392B" dot="#C0392B" />
              <div className="flex items-center gap-1 p-1.5">
                <span className="text-[0.7rem]">📄</span>
                <div>
                  <p className="text-[0.4rem] font-bold text-gray-800">SPA_v12_final_FINAL.pdf</p>
                  <div className="mt-0.5 rounded bg-amber-50 border border-amber-200 px-0.5">
                    <p className="text-[0.35rem] font-bold text-amber-700">Bu mu geçerli?</p>
                  </div>
                </div>
              </div>
            </MiniCard>

            {/* ── PDF v11 (behind) ── */}
            <MiniCard style={{ top: "48%", left: "18%", width: "33%", zIndex: 6 }} rotate="1.5deg">
              <MiniAppBar app="PDF" color="#C0392B" dot="#C0392B" dim />
              <div className="flex items-center gap-1 p-1.5 opacity-60">
                <span className="text-[0.7rem]">📄</span>
                <p className="text-[0.35rem] font-bold text-gray-400 line-through">SPA_v11_revize.pdf</p>
              </div>
            </MiniCard>

            {/* ── Excel ── */}
            <MiniCard style={{ top: "38%", right: "2%", width: "40%", zIndex: 9 }} rotate="2deg">
              <MiniAppBar app="Excel" color="#217346" dot="#217346" />
              <div className="p-1.5">
                <p className="text-[0.4rem] font-semibold text-green-800">FIYAT_v3_FINAL_revize.xlsx</p>
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

            {/* ── SGS ── */}
            <MiniCard style={{ bottom: "5%", left: "10%", width: "36%", zIndex: 8 }} rotate="-1.5deg">
              <MiniAppBar app="SGS" color="#E31837" dot="#E31837" />
              <div className="p-1.5">
                <p className="text-[0.4rem] font-bold text-gray-700">SGS_Rapor_TASLAK.pdf</p>
                <div className="mt-0.5 rounded bg-amber-100 px-1 py-px">
                  <p className="text-[0.35rem] font-bold text-amber-700">TASLAK — Son değil!</p>
                </div>
              </div>
            </MiniCard>

            {/* ── Voice note ── */}
            <MiniCard style={{ bottom: "4%", right: "3%", width: "34%", zIndex: 7 }} rotate="2.5deg">
              <MiniAppBar app="WhatsApp" color="#075E54" dot="#25D366" />
              <div className="p-1.5">
                <div className="flex items-center gap-1 rounded-lg bg-[#ECE5DD] px-1 py-1">
                  <span className="h-3 w-3 rounded-full bg-[#25D366] text-[0.3rem] text-white flex items-center justify-center">▶</span>
                  <div className="flex gap-px">
                    {[2,4,3,5,2,4,3,2,4,3].map((h,i) => (
                      <div key={i} className="w-px rounded-full bg-[#128C7E]" style={{height: h * 1.5}} />
                    ))}
                  </div>
                  <p className="text-[0.35rem] text-[#128C7E]">1:47</p>
                </div>
                <p className="mt-0.5 text-[0.3rem] text-red-500 font-semibold">Dinlenmedi · 2 gün önce</p>
              </div>
            </MiniCard>
          </div>

          {/* Questions row */}
          <div className="flex flex-wrap gap-1.5 px-4 pb-3 pt-2">
            {questions.map((q) => (
              <span key={q} className="rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-[0.5rem] font-medium text-red-600">
                {q}
              </span>
            ))}
          </div>

          {/* DURUM BELİRSİZ badge */}
          <div className="flex items-center justify-between border-t border-red-200/60 bg-red-900/8 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[0.6875rem] font-bold tracking-[0.04em] text-red-700">
                {t("transform.chaosStatus")}
              </span>
            </div>
            <span className="rounded-full border border-red-200 bg-white/60 px-2 py-0.5 text-[0.4375rem] text-red-500">
              {t("transform.dealName")} · {t("transform.amount")}
            </span>
          </div>
        </div>

        {/* ══ RIGHT — ORTAQ ════════════════════════════════════════ */}
        <div className="flex flex-col bg-white">

          {/* Header label */}
          <div className="flex items-center gap-2 border-b border-emerald-200/60 bg-emerald-50/40 px-4 py-2.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span className="text-[0.5625rem] font-bold uppercase tracking-[0.08em] text-emerald-700">
              {t("transform.ortaqLabel")}
            </span>
          </div>

          {/* Deal identity */}
          <div className="border-b border-ortaq-border bg-[#fafaf9] px-4 py-3">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-[0.5625rem] font-bold text-ortaq-ink">{t("transform.dealName")}</p>
                <p className="text-[0.4375rem] text-ortaq-ink-soft">🇩🇪 {t("transform.counterparty")}</p>
              </div>
              <div className="text-right">
                <p className="text-[0.8125rem] font-bold tabular-nums text-ortaq-ink">{t("transform.amount")}</p>
                <span className="inline-block rounded-full bg-amber-100 px-1.5 py-0.5 text-[0.375rem] font-bold text-amber-700 mt-0.5">
                  Muayene Aşaması
                </span>
              </div>
            </div>
            {/* Progress */}
            <div className="mt-2 flex items-center gap-2">
              <div className="flex-1 h-1.5 overflow-hidden rounded-full bg-ortaq-border">
                <div className="h-full w-[78%] rounded-full bg-ortaq-trust" />
              </div>
              <span className="text-[0.4375rem] font-bold text-ortaq-trust">78%</span>
            </div>
          </div>

          {/* Answered items — the product in action */}
          <div className="flex-1 p-4 space-y-2">
            {answers.map((a, i) => (
              <AnswerRow key={i} text={a.text} tag={a.tag} type={a.type} />
            ))}
          </div>

          {/* DURUM NET badge */}
          <div className="flex items-center justify-between border-t border-emerald-200/60 bg-emerald-50/40 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              <span className="text-[0.6875rem] font-bold tracking-[0.04em] text-emerald-700">
                {t("transform.ortaqStatus")}
              </span>
            </div>
            <div className="flex -space-x-1.5">
              {["YÇ", "SK", "MK", "BB"].map((init) => (
                <span key={init} className="inline-flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-ortaq-trust/15 text-[0.375rem] font-bold text-ortaq-trust">
                  {init}
                </span>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

/* ── helpers ── */

function MiniCard({
  children,
  style,
  rotate = "0deg",
}: {
  children: React.ReactNode;
  style: React.CSSProperties;
  rotate?: string;
}) {
  return (
    <div
      className="absolute overflow-hidden rounded-lg border border-black/[0.07] bg-white shadow-[0_3px_12px_rgb(0_0_0/0.14)]"
      style={{ ...style, transform: `rotate(${rotate})` }}
    >
      {children}
    </div>
  );
}

function MiniAppBar({
  app,
  color,
  dot,
  dim,
}: {
  app: string;
  color: string;
  dot: string;
  dim?: boolean;
}) {
  return (
    <div
      className={cn("flex items-center gap-0.5 border-b border-black/[0.05] px-1.5 py-0.5", dim ? "bg-gray-50" : "bg-[#f7f7f7]")}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-[#ff5f57]" />
      <span className="h-1.5 w-1.5 rounded-full bg-[#febc2e]" />
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: dot }} />
      <span className="ml-1 text-[0.35rem] font-semibold" style={{ color }}>{app}</span>
    </div>
  );
}

function MiniWA({ text, incoming }: { text: string; incoming?: boolean }) {
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

function AnswerRow({
  text,
  tag,
  type,
}: {
  text: string;
  tag: string;
  type: "confirmed" | "pending" | "live";
}) {
  const icon = type === "confirmed" ? "✓" : type === "live" ? "●" : "⏳";
  const styles = {
    confirmed: {
      row: "border-emerald-100 bg-emerald-50/40",
      icon: "text-emerald-600 bg-emerald-100",
      tag: "bg-emerald-100 text-emerald-700",
    },
    pending: {
      row: "border-amber-100 bg-amber-50/30",
      icon: "text-amber-600 bg-amber-100",
      tag: "bg-amber-100 text-amber-700",
    },
    live: {
      row: "border-ortaq-border bg-ortaq-bg/40",
      icon: "text-ortaq-trust bg-ortaq-trust/10",
      tag: "bg-ortaq-trust/10 text-ortaq-trust",
    },
  };
  const s = styles[type];

  return (
    <div className={cn("flex items-center gap-2.5 rounded-lg border px-2.5 py-2", s.row)}>
      <span className={cn("flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[0.5rem] font-bold", s.icon)}>
        {icon}
      </span>
      <p className="flex-1 text-[0.5625rem] font-semibold leading-snug text-ortaq-ink">{text}</p>
      <span className={cn("shrink-0 rounded-full px-1.5 py-0.5 text-[0.375rem] font-bold", s.tag)}>
        {tag}
      </span>
    </div>
  );
}
