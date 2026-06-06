"use client";

import { useTranslation } from "react-i18next";
import { cn } from "@/lib/cn";

/**
 * FourScreens — Section 4: "Kim ne görüyor?"
 *
 * Four parties. One deal. Identical status on every screen.
 *
 * The visual message: nobody is working with different information.
 * There is no "my version" of the deal anymore.
 *
 * Design: 2x2 grid of mini status panels.
 * Each panel header: flag + location.
 * Each panel body: identical fields (SGS, BL, Sevkiyat, Ödeme, Sıradaki).
 * Bottom: one shared status bar — same across all four.
 */
export function FourScreens() {
  const { i18n } = useTranslation();
  const isTR = (i18n.language ?? "tr").startsWith("tr");

  const parties = isTR ? [
    { flag: "🇹🇷", code: "TR", role: "Tedarikçi",   location: "İstanbul",  accentColor: "border-ortaq-trust bg-ortaq-trust/[0.04]" },
    { flag: "🇩🇪", code: "DE", role: "Alıcı",        location: "Hamburg",   accentColor: "border-blue-300 bg-blue-50/50" },
    { flag: "🇹🇭", code: "TH", role: "Lojistik",     location: "Bangkok",   accentColor: "border-amber-300 bg-amber-50/50" },
    { flag: "🇦🇪", code: "AE", role: "Finans",        location: "Dubai",     accentColor: "border-violet-300 bg-violet-50/50" },
  ] : [
    { flag: "🇹🇷", code: "TR", role: "Supplier",   location: "Istanbul",  accentColor: "border-ortaq-trust bg-ortaq-trust/[0.04]" },
    { flag: "🇩🇪", code: "DE", role: "Buyer",       location: "Hamburg",   accentColor: "border-blue-300 bg-blue-50/50" },
    { flag: "🇹🇭", code: "TH", role: "Logistics",  location: "Bangkok",   accentColor: "border-amber-300 bg-amber-50/50" },
    { flag: "🇦🇪", code: "AE", role: "Finance",     location: "Dubai",     accentColor: "border-violet-300 bg-violet-50/50" },
  ];

  // Identical status fields — shared across all four screens
  const statusFields = isTR ? [
    { label: "Sözleşme",    value: "SPA v12 · İmzalı",          type: "confirmed" as const },
    { label: "SGS",         value: "Bekleniyor · BestBuild",    type: "waiting"   as const },
    { label: "BL",          value: "Taslak v3 · SGS sonrası",   type: "waiting"   as const },
    { label: "Sevkiyat",    value: "28 Haziran",                  type: "scheduled" as const },
    { label: "Ödeme",       value: "LC hazırlanıyor",             type: "waiting"   as const },
    { label: "Sıradaki",    value: "SGS · BestBuild'de",         type: "action"    as const },
  ] : [
    { label: "Contract",   value: "SPA v12 · Signed",           type: "confirmed" as const },
    { label: "SGS",        value: "Pending · BestBuild",         type: "waiting"   as const },
    { label: "BL",         value: "Draft v3 · After SGS",        type: "waiting"   as const },
    { label: "Shipment",   value: "June 28",                     type: "scheduled" as const },
    { label: "Payment",    value: "LC being prepared",           type: "waiting"   as const },
    { label: "Next",       value: "SGS · With BestBuild",        type: "action"    as const },
  ];

  const fieldStyle = {
    confirmed: { label: "text-ortaq-ink-soft", value: "text-emerald-700 font-bold" },
    waiting:   { label: "text-ortaq-ink-soft", value: "text-amber-700 font-semibold" },
    scheduled: { label: "text-ortaq-ink-soft", value: "text-ortaq-ink font-semibold" },
    action:    { label: "text-ortaq-ink-soft", value: "text-ortaq-trust font-bold" },
  } as const;

  return (
    <div>
      {/* Deal banner */}
      <div className="mb-5 flex items-center gap-3 rounded-xl border border-ortaq-border bg-ortaq-surface px-5 py-3">
        <span className="text-[0.875rem] font-bold text-ortaq-ink">
          {isTR ? "Çelik Tedariki · BestBuild GmbH · €840.000" : "Steel Supply · BestBuild GmbH · €840,000"}
        </span>
        <span className="ml-auto rounded-full bg-amber-100 px-2.5 py-0.5 text-[0.5rem] font-bold text-amber-700">
          {isTR ? "Muayene Aşaması" : "Inspection Stage"}
        </span>
      </div>

      {/* 2x2 grid */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {parties.map((party) => (
          <div
            key={party.code}
            className={cn("overflow-hidden rounded-2xl border", party.accentColor)}
          >
            {/* Party header */}
            <div className="border-b border-current/10 px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="text-[1.25rem]">{party.flag}</span>
                <div>
                  <p className="text-[0.5625rem] font-bold text-ortaq-ink">{party.role}</p>
                  <p className="text-[0.4rem] text-ortaq-ink-soft">{party.location}</p>
                </div>
              </div>
            </div>

            {/* Status fields — SAME for every party */}
            <div className="divide-y divide-current/5 bg-white/70 px-4">
              {statusFields.map((field) => {
                const fs = fieldStyle[field.type];
                return (
                  <div key={field.label} className="flex items-center justify-between gap-2 py-2">
                    <span className={cn("text-[0.4375rem] font-semibold", fs.label)}>
                      {field.label}
                    </span>
                    <span className={cn("text-right text-[0.4375rem]", fs.value)}>
                      {field.value}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Live indicator */}
            <div className="border-t border-current/10 bg-white/50 px-4 py-2">
              <div className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-ortaq-trust" />
                <span className="text-[0.375rem] font-semibold text-ortaq-trust">
                  {isTR ? "Canlı görünüm" : "Live view"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* The shared record message — two-company framing */}
      <div className="mt-4 overflow-hidden rounded-xl border border-ortaq-trust/20 bg-ortaq-trust/[0.04]">
        <div className="px-5 py-4">
          <p className="text-[0.9375rem] font-bold text-ortaq-ink">
            {isTR
              ? "Bu dört ekran aynı ORTAQ kaydını gösteriyor."
              : "These four screens show the same ORTAQ record."}
          </p>
          <p className="mt-1.5 text-[0.5625rem] text-ortaq-ink-soft">
            {isTR
              ? "BestBuild Hamburg ofisinde ne görüyorsa, İstanbul'daki ekibiniz de tam bunu görüyor. Farklı PDF yok. Farklı Excel yok. Farklı gerçek yok."
              : "Whatever BestBuild sees in their Hamburg office, your Istanbul team sees exactly the same. No different PDF. No different Excel. No different version of reality."}
          </p>
        </div>
        <div className="border-t border-ortaq-trust/15 bg-ortaq-trust/[0.06] px-5 py-2.5">
          <p className="text-[0.4375rem] font-bold uppercase tracking-[0.08em] text-ortaq-trust">
            {isTR ? "Şirketler Arası İşlem Kaydı — iki şirket, tek ekran." : "Company-to-Company Transaction Record — two companies, one screen."}
          </p>
        </div>
      </div>
    </div>
  );
}
