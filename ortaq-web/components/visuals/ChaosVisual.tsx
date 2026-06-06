"use client";

import { useTranslation } from "react-i18next";
import { cn } from "@/lib/cn";

/** Visual #1 — The Chaos.
 *  Five overlapping "app windows" open at once, each showing a fragment
 *  of the same deal. Stressful, cluttered, instantly recognizable.
 *  All content comes from locale so TR/EN are visually distinct.
 */
export function ChaosVisual() {
  const { t } = useTranslation();

  return (
    <div className="relative mx-auto w-full max-w-3xl select-none">
      {/* Stack of overlapping windows */}
      <div className="relative h-[380px] sm:h-[420px]">

        {/* Window: Excel — back-left */}
        <div className="absolute left-0 top-8 w-[54%] sm:w-[46%] rotate-[-2deg] overflow-hidden rounded-xl border border-green-200 bg-white shadow-[0_4px_24px_rgb(0_0_0/0.14)]">
          <WinBar color="#217346" label="Excel" dot="bg-[#217346]" />
          <div className="px-3 py-2.5">
            <p className="truncate text-[0.5rem] font-mono font-medium text-green-800">
              📊 {t("visuals.chaos.xlsxName")}
            </p>
            <div className="mt-1.5 space-y-0.5">
              {[
                ["A1", "Ürün", "Fiyat", "Miktar"],
                ["A2", "Çelik", "€1.240", "500"],
                ["A3", "—", "—", "—"],
              ].map((row, ri) => (
                <div key={ri} className="grid grid-cols-4 gap-0.5 text-[0.4375rem]">
                  {row.map((cell, ci) => (
                    <div key={ci} className={cn(
                      "rounded px-1 py-0.5 text-center font-mono",
                      ri === 0 ? "bg-green-100 font-bold text-green-800" : "bg-gray-50 text-gray-600",
                      ci === 0 ? "text-green-400" : "",
                    )}>
                      {cell}
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div className="mt-2 flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-2 py-1">
              <span className="text-[0.5rem]">⚠️</span>
              <p className="text-[0.5rem] font-medium text-amber-700">{t("visuals.chaos.xlsxNote")}</p>
            </div>
            <div className="mt-1 flex gap-1">
              {["v1", "v2", "v3", "v_FINAL"].map((v) => (
                <span key={v} className={cn(
                  "rounded px-1 py-0.5 text-[0.375rem] font-bold",
                  v === "v_FINAL" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-400 line-through",
                )}>{v}</span>
              ))}
            </div>
            <NotifBadge count={t("visuals.chaos.badge3")} color="green" />
          </div>
        </div>

        {/* Window: Email — back-right */}
        <div className="absolute right-0 top-4 w-[58%] sm:w-[50%] rotate-[1.5deg] overflow-hidden rounded-xl border border-blue-200 bg-white shadow-[0_4px_24px_rgb(0_0_0/0.14)]">
          <WinBar color="#0078D4" label="Email" dot="bg-[#0078D4]" />
          <div className="px-3 py-2">
            <div className="space-y-1.5">
              {[1, 2, 3].map((i) => (
                <div key={i} className={cn(
                  "rounded-lg border p-2",
                  i === 1 ? "border-blue-200 bg-blue-50" : "border-gray-100 bg-gray-50/50",
                )}>
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-[0.5rem] font-bold text-blue-900">
                      {i === 1 ? t("visuals.chaos.emailSubject") : `Re: ${t("visuals.chaos.emailSubject")}`}
                    </p>
                    <span className="shrink-0 text-[0.375rem] text-gray-400">{i}d önce</span>
                  </div>
                  <p className="mt-0.5 truncate text-[0.4375rem] text-gray-500">
                    {i === 1 ? t("visuals.chaos.emailBody") : "..."}
                  </p>
                  {i === 1 && (
                    <div className="mt-1 flex items-center gap-1">
                      <span className="text-[0.4375rem]">📎</span>
                      <span className="text-[0.4375rem] text-blue-600 underline">SPA_v12_final.pdf</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <NotifBadge count={t("visuals.chaos.badge2")} color="blue" />
          </div>
        </div>

        {/* Window: WhatsApp — front-center */}
        <div className="absolute left-[8%] sm:left-[12%] top-[120px] sm:top-[110px] w-[52%] sm:w-[44%] rotate-[-1deg] overflow-hidden rounded-xl border border-[#25D366]/40 bg-[#ECE5DD] shadow-[0_8px_32px_rgb(0_0_0/0.22)]">
          <WinBar color="#075E54" label="WhatsApp" dot="bg-[#25D366]" />
          <div className="space-y-1.5 p-3">
            <WaBubble text={t("visuals.chaos.wa1")} incoming />
            <WaBubble text={t("visuals.chaos.wa2")} />
            <WaBubble text={t("visuals.chaos.wa3")} incoming />
            <div className="flex items-center gap-1.5 rounded-full bg-[#128C7E]/20 px-2 py-0.5 w-fit">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#25D366]" />
              <span className="text-[0.4375rem] font-semibold text-[#075E54]">{t("visuals.chaos.badge1")}</span>
            </div>
          </div>
        </div>

        {/* Window: Operations — front-right */}
        <div className="absolute right-[2%] sm:right-[4%] top-[150px] sm:top-[160px] w-[44%] sm:w-[38%] rotate-[2deg] overflow-hidden rounded-xl border border-violet-200 bg-white shadow-[0_4px_20px_rgb(0_0_0/0.16)]">
          <WinBar color="#5B21B6" label="Operations" dot="bg-violet-500" />
          <div className="p-3 space-y-2">
            <div className="rounded-lg bg-violet-50 border border-violet-200 px-2.5 py-2">
              <p className="text-[0.4375rem] font-bold text-violet-400 uppercase tracking-wide mb-0.5">Operations</p>
              <p className="text-[0.5rem] text-violet-900">{t("visuals.chaos.opsMsg")}</p>
            </div>
            <div className="flex items-center gap-1.5 text-[0.4375rem] text-gray-400">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              <span>Yanıt yok · 2 gün</span>
            </div>
          </div>
        </div>

        {/* Window: Finance — front-bottom */}
        <div className="absolute bottom-0 left-[18%] sm:left-[22%] w-[56%] sm:w-[48%] rotate-[1deg] overflow-hidden rounded-xl border border-rose-200 bg-white shadow-[0_4px_24px_rgb(0_0_0/0.18)]">
          <WinBar color="#C0392B" label="Finance" dot="bg-rose-500" />
          <div className="p-3">
            <div className="flex items-start gap-2">
              <span className="text-base">💬</span>
              <div>
                <p className="text-[0.5rem] font-bold text-rose-900">{t("visuals.chaos.financeMsg")}</p>
                <p className="text-[0.4375rem] text-gray-400 mt-0.5">Finans Müdürü · 4 sa. önce</p>
              </div>
            </div>
            <div className="mt-2 flex items-center gap-1.5 rounded border border-rose-200 bg-rose-50 px-2 py-1">
              <span className="text-[0.4375rem]">❓</span>
              <p className="text-[0.4375rem] font-medium text-rose-600">Cevap bekleniyor</p>
            </div>
          </div>
        </div>

        {/* Chaos overlay indicator */}
        <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-ortaq-accent/10" />
      </div>

      {/* The question underneath */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        {["Son fiyat neydi?", "Kim onayladı?", "Hangi sürüm?", "SGS ne oldu?", "Ödeme?"].map((q) => (
          <span key={q} className="rounded-full border border-ortaq-accent/20 bg-ortaq-accent/5 px-2.5 py-1 text-[0.6875rem] font-medium text-ortaq-accent">
            {q}
          </span>
        ))}
      </div>
    </div>
  );
}

function WinBar({ color, label, dot }: { color: string; label: string; dot: string }) {
  return (
    <div className="flex items-center gap-1.5 border-b border-black/5 px-3 py-1.5" style={{ background: color }}>
      <span className="h-2 w-2 rounded-full bg-[#ff5f57]" />
      <span className="h-2 w-2 rounded-full bg-[#febc2e]" />
      <span className={cn("h-2 w-2 rounded-full", dot)} />
      <span className="ml-1.5 text-[0.5rem] font-semibold text-white/90">{label}</span>
    </div>
  );
}

function WaBubble({ text, incoming }: { text: string; incoming?: boolean }) {
  return (
    <div className={cn("flex", incoming ? "justify-start" : "justify-end")}>
      <div className={cn(
        "max-w-[85%] rounded-xl px-2.5 py-1.5 text-[0.5rem] leading-snug",
        incoming ? "rounded-tl-none bg-white text-gray-800" : "rounded-tr-none bg-[#DCF8C6] text-gray-800",
      )}>
        {text}
      </div>
    </div>
  );
}

function NotifBadge({ count, color }: { count: string; color: string }) {
  const colors: Record<string, string> = {
    green: "bg-green-100 text-green-700 border-green-200",
    blue: "bg-blue-100 text-blue-700 border-blue-200",
    violet: "bg-violet-100 text-violet-700 border-violet-200",
  };
  return (
    <div className={cn("mt-2 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[0.4375rem] font-bold", colors[color])}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {count}
    </div>
  );
}
