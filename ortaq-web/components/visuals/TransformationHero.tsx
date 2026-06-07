"use client";

import { useTranslation } from "react-i18next";
import { cn } from "@/lib/cn";

/**
 * TransformationHero — same deal, two realities.
 *
 * LEFT (chaos): Real app mini-windows with authentic brand colors.
 *   WhatsApp · WeChat · Outlook · Excel · SGS Report · BL Draft
 *   Every floating card is immediately recognizable without reading.
 *
 * RIGHT (ORTAQ): Same deal, same amount, same counterparty — organized.
 *   6 answer rows, each directly answering one of the questions on the left.
 *
 * Design rule: visitor must understand the contrast in < 3 seconds
 * without reading a single line of text.
 */
export function TransformationHero() {
  const { t } = useTranslation();

  const dealName      = t("transform.dealName");
  const counterparty  = t("transform.counterparty");
  const amount        = t("transform.amount");

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
    { main: t("transform.a3"), detail: t("transform.a3detail"), tag: t("transform.a3tag"), type: "pending"   as const },
    { main: t("transform.a4"), detail: t("transform.a4detail"), tag: t("transform.a4tag"), type: "pending"   as const },
    { main: t("transform.a5"), detail: t("transform.a5detail"), tag: t("transform.a5tag"), type: "confirmed" as const },
    { main: t("transform.a6"), detail: t("transform.a6detail"), tag: t("transform.a6tag"), type: "live"      as const },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-ortaq-border shadow-[0_12px_48px_rgb(20_19_16/0.13)]">
      <div className="grid grid-cols-1 sm:grid-cols-2">

        {/* ══ LEFT — CHAOS (4 windows max) ════════════════════════ */}
        <div className="flex flex-col border-b border-ortaq-border bg-[#FBF0ED] sm:border-b-0 sm:border-r">

          {/* Header — deal identity visible even in chaos */}
          <DealHeader
            side="chaos"
            label={t("transform.chaosLabel")}
            dealName={dealName}
            counterparty={counterparty}
            amount={amount}
          />

          {/* 4 floating app windows — readable in 2 seconds */}
          <div className="relative overflow-hidden" style={{ aspectRatio: "4/3", minHeight: 248 }}>
            <div className="absolute inset-0 bg-gradient-to-br from-red-100/20 via-transparent to-orange-100/10" />

            {/* WhatsApp — top left */}
            <FloatCard style={{ top: "4%", left: "1%", width: "47%", zIndex: 9 }} rotate="-2deg">
              <AppBar app="WhatsApp" icon="💬" color="#075E54" dot="#25D366" />
              <div className="space-y-1 p-2">
                <WaBubble text={t("transform.q1")} />
                <WaBubble text={t("transform.q4")} />
                <p className="text-[0.34rem] text-[#128C7E] flex items-center gap-0.5">
                  <span className="h-1 w-1 rounded-full bg-[#25D366] animate-pulse" />
                  47 okunmamış mesaj
                </p>
              </div>
            </FloatCard>

            {/* Outlook — top right */}
            <FloatCard style={{ top: "2%", right: "1%", width: "44%", zIndex: 8 }} rotate="2deg">
              <AppBar app="Outlook" icon="📧" color="#0078D4" dot="#0078D4" />
              <div className="p-2 space-y-0.5">
                <div className="rounded bg-blue-50 px-1.5 py-1">
                  <p className="text-[0.38rem] font-bold text-blue-900 leading-tight truncate">
                    Re: Re: Fwd: SPA_v12_final_FINAL.pdf
                  </p>
                  <p className="text-[0.33rem] text-gray-400 truncate">{t("transform.q2")}</p>
                </div>
                <div className="flex items-center gap-0.5">
                  <span className="text-[0.5rem]">📎</span>
                  <p className="text-[0.33rem] text-gray-400 line-through">SPA_v11_revize.pdf</p>
                </div>
                <div className="flex items-center gap-0.5">
                  <span className="text-[0.5rem]">📎</span>
                  <p className="text-[0.33rem] text-gray-500 font-semibold">SPA_v12_FINAL.pdf</p>
                </div>
              </div>
            </FloatCard>

            {/* SGS Report — bottom left */}
            <FloatCard style={{ bottom: "6%", left: "4%", width: "42%", zIndex: 10 }} rotate="-1.5deg">
              <AppBar app="SGS Raporu" icon="🔬" color="#E31837" dot="#E31837" />
              <div className="p-2">
                <div className="flex items-center gap-1">
                  <span className="text-[0.9rem]">📄</span>
                  <div>
                    <p className="text-[0.38rem] font-bold text-gray-700 leading-tight">SGS_TASLAK_v1.pdf</p>
                    <span className="rounded bg-amber-100 px-1 py-px text-[0.3rem] font-bold text-amber-700">
                      ONAYSIZ
                    </span>
                  </div>
                </div>
                <p className="mt-0.5 text-[0.33rem] font-semibold text-red-600">
                  Muayene raporu onaylanmadı
                </p>
              </div>
            </FloatCard>

            {/* Excel — bottom right */}
            <FloatCard style={{ bottom: "4%", right: "2%", width: "44%", zIndex: 9 }} rotate="1.5deg">
              <AppBar app="Excel" icon="📊" color="#217346" dot="#217346" />
              <div className="p-2">
                <p className="text-[0.38rem] font-semibold text-green-800 truncate">FIYAT_v4_REVIZE_SON.xlsx</p>
                <div className="mt-1 grid grid-cols-3 divide-x divide-green-100 rounded border border-green-100 bg-green-50/50">
                  <ExcelCell label="v2" val="1.180" dim />
                  <ExcelCell label="v3" val="1.240" dim />
                  <ExcelCell label="v4" val="1.260" active />
                </div>
                <p className="mt-0.5 text-[0.3rem] text-amber-600 font-semibold">Hangi versiyon geçerli?</p>
              </div>
            </FloatCard>
          </div>

          {/* 4 unanswered question chips */}
          <div className="flex flex-wrap gap-1 px-4 pb-3 pt-2">
            {questions.slice(0, 4).map((q) => (
              <span key={q} className="rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-[0.46rem] font-medium text-red-700">
                {q}
              </span>
            ))}
          </div>

          {/* Status footer */}
          <div className="flex items-center justify-between border-t border-red-200/50 bg-red-900/5 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-red-500" />
              <span className="text-[0.75rem] font-bold tracking-[0.02em] text-red-700">
                {t("transform.chaosStatus")}
              </span>
            </div>
            <span className="text-[0.4rem] text-red-400/80">5 soru · 0 cevap</span>
          </div>
        </div>

        {/* ══ RIGHT — ORTAQ ═══════════════════════════════════════ */}
        <div className="flex flex-col bg-white">

          {/* Header — SAME deal identity mirrored */}
          <DealHeader
            side="ortaq"
            label={t("transform.ortaqLabel")}
            dealName={dealName}
            counterparty={counterparty}
            amount={amount}
          />

          {/* Progress bar */}
          <div className="border-b border-ortaq-border px-4 py-2">
            <div className="flex items-center gap-2.5">
              <div className="flex-1 h-1.5 overflow-hidden rounded-full bg-gray-100">
                <div className="h-full w-[78%] rounded-full bg-ortaq-trust" />
              </div>
              <span className="text-[0.5rem] font-bold text-ortaq-trust shrink-0">78%</span>
              <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[0.375rem] font-bold text-amber-700 shrink-0">
                Muayene
              </span>
            </div>
          </div>

          {/* Answered rows */}
          <div className="flex-1 divide-y divide-ortaq-border/50">
            {answers.map((a, i) => (
              <AnswerRow key={i} {...a} />
            ))}
          </div>

          {/* Status footer */}
          <div className="flex items-center justify-between border-t border-emerald-200/50 bg-emerald-50/30 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              <span className="text-[0.75rem] font-bold tracking-[0.02em] text-emerald-700">
                {t("transform.ortaqStatus")}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              {["YÇ","SK","MK","BB"].map((init) => (
                <span key={init} className="flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-ortaq-trust/15 text-[0.3rem] font-bold text-ortaq-trust shadow-sm">
                  {init}
                </span>
              ))}
              <span className="text-[0.4rem] text-ortaq-ink-soft">Her iki taraf görüyor</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

/* ── Sub-components ─────────────────────────────────────────────────────── */

function DealHeader({ side, label, dealName, counterparty, amount }: {
  side: "chaos" | "ortaq";
  label: string;
  dealName: string;
  counterparty: string;
  amount: string;
}) {
  const isChaos = side === "chaos";
  return (
    <div className={cn(
      "border-b px-4 py-2.5",
      isChaos ? "border-red-200/50 bg-[#f5e4df]" : "border-emerald-200/50 bg-emerald-50/40",
    )}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <span className={cn(
            "h-1.5 w-1.5 rounded-full",
            isChaos ? "animate-pulse bg-red-500" : "bg-emerald-500",
          )} />
          <span className={cn(
            "text-[0.475rem] font-bold uppercase tracking-[0.07em]",
            isChaos ? "text-red-700" : "text-emerald-700",
          )}>
            {label}
          </span>
        </div>
        {/* Deal identity — identical on both sides */}
        <div className="flex items-center gap-1 text-right">
          <span className={cn("text-[0.4rem] font-semibold", isChaos ? "text-red-900/60" : "text-ortaq-ink")}>{dealName}</span>
          <span className={cn("text-[0.375rem]", isChaos ? "text-red-400" : "text-ortaq-ink-soft")}>·</span>
          <span className={cn("text-[0.4rem] font-semibold", isChaos ? "text-red-900/60" : "text-ortaq-ink")}>{counterparty}</span>
          <span className={cn("text-[0.375rem]", isChaos ? "text-red-400" : "text-ortaq-ink-soft")}>·</span>
          <span className={cn("text-[0.4rem] font-bold", isChaos ? "text-red-700" : "text-ortaq-trust")}>{amount}</span>
        </div>
      </div>
    </div>
  );
}

function FloatCard({ children, style, rotate = "0deg" }: {
  children: React.ReactNode;
  style: React.CSSProperties;
  rotate?: string;
}) {
  return (
    <div
      className="absolute overflow-hidden rounded-lg border border-black/[0.07] bg-white shadow-[0_4px_14px_rgb(0_0_0/0.13)]"
      style={{ ...style, transform: `rotate(${rotate})` }}
    >
      {children}
    </div>
  );
}

function AppBar({ app, icon, color, dot }: { app: string; icon: string; color: string; dot: string }) {
  return (
    <div className="flex items-center gap-1 border-b border-black/[0.05] bg-[#f7f7f7] px-1.5 py-0.5">
      <span className="h-1.5 w-1.5 rounded-full bg-[#ff5f57]" />
      <span className="h-1.5 w-1.5 rounded-full bg-[#febc2e]" />
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: dot }} />
      <span className="ml-1 text-[0.35rem]">{icon}</span>
      <span className="text-[0.34rem] font-semibold" style={{ color }}>{app}</span>
    </div>
  );
}

function WaBubble({ text }: { text: string }) {
  return (
    <div className="flex justify-start">
      <div className="max-w-[90%] rounded-xl rounded-tl-none bg-white px-1.5 py-0.5 text-[0.38rem] leading-snug shadow-sm text-gray-700">
        {text}
      </div>
    </div>
  );
}

function ExcelCell({ label, val, dim, active }: { label: string; val: string; dim?: boolean; active?: boolean }) {
  return (
    <div className="flex flex-col items-center py-0.5 px-1">
      <span className={cn("text-[0.28rem]", dim ? "text-gray-300" : "text-gray-400")}>{label}</span>
      <span className={cn(
        "text-[0.38rem] font-bold",
        active ? "text-green-700" : dim ? "text-gray-300 line-through" : "text-gray-500",
      )}>{val}</span>
    </div>
  );
}

const answerStyles = {
  confirmed: { row: "bg-emerald-50/30", icon: "bg-emerald-100 text-emerald-700", tag: "bg-emerald-100 text-emerald-700", symbol: "✓" },
  pending:   { row: "bg-amber-50/30",   icon: "bg-amber-100 text-amber-700",     tag: "bg-amber-100 text-amber-700",     symbol: "⏳" },
  live:      { row: "bg-sky-50/30",     icon: "bg-sky-100 text-sky-700",         tag: "bg-sky-100 text-sky-700",         symbol: "●" },
} as const;

function AnswerRow({ main, detail, tag, type }: {
  main: string; detail: string; tag: string; type: keyof typeof answerStyles;
}) {
  const s = answerStyles[type];
  return (
    <div className={cn("flex items-start gap-2 px-3 py-2", s.row)}>
      <span className={cn("mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[0.46rem] font-bold", s.icon)}>
        {s.symbol}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-[0.5625rem] font-semibold text-ortaq-ink leading-snug">{main}</p>
        <p className="text-[0.4rem] text-ortaq-ink-soft leading-snug">{detail}</p>
      </div>
      <span className={cn("shrink-0 rounded-full px-1.5 py-0.5 text-[0.35rem] font-bold whitespace-nowrap", s.tag)}>
        {tag}
      </span>
    </div>
  );
}
