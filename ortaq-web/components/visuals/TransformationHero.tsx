"use client";

import { useTranslation } from "react-i18next";

/**
 * Hero UI — channels merge into one operation screen.
 * Merged proof: Why (scattered channels) + Memory (unified record).
 */
export function TransformationHero() {
  const { i18n } = useTranslation();
  const isTR = (i18n.language ?? "tr").startsWith("tr");

  const channels = [
    { icon: "📧", label: "Email",    color: "#0078D4" },
    { icon: "💬", label: "WhatsApp", color: "#075E54" },
    { icon: "📄", label: "PDF",      color: "#E31837" },
    { icon: "📝", label: isTR ? "Not" : "Note", color: "#6B7280" },
  ];

  const outputs = isTR
    ? [
        { key: "changed",  label: "Ne değişti",   value: "Teslimat 22 → 25 Haz",       tone: "neutral" as const },
        { key: "waiting",  label: "Kim bekliyor", value: "Alıcı · 2 gündür yanıtsız",  tone: "amber" as const },
        { key: "risk",     label: "Risk",         value: "Muayene → sevkiyat bloke",   tone: "risk" as const },
        { key: "today",    label: "Bugün",        value: "Alıcıyla iletişime geç",    tone: "action" as const },
      ]
    : [
        { key: "changed",  label: "What changed",  value: "Delivery Jun 22 → 25",        tone: "neutral" as const },
        { key: "waiting",  label: "Who waits",     value: "Buyer · no reply 2 days",     tone: "amber" as const },
        { key: "risk",     label: "At risk",       value: "Inspection → shipment block", tone: "risk" as const },
        { key: "today",    label: "Today",         value: "Contact buyer",               tone: "action" as const },
      ];

  return (
    <div className="overflow-hidden rounded-2xl border border-ortaq-border bg-white shadow-[0_12px_48px_rgb(20_19_16/0.1)]">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1.4fr]">

        {/* Scattered channels */}
        <div className="border-b border-ortaq-border bg-[#FBF0ED] px-6 py-8 lg:border-b-0 lg:border-r">
          <p className="mb-5 text-[0.5625rem] font-bold uppercase tracking-[0.08em] text-red-800/60">
            {isTR ? "Dağınık kanallar" : "Scattered channels"}
          </p>
          <div className="grid grid-cols-2 gap-3">
            {channels.map((ch) => (
              <div
                key={ch.label}
                className="flex items-center gap-2.5 rounded-lg border border-red-200/50 bg-white/80 px-3 py-3"
              >
                <span
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-lg"
                  style={{ backgroundColor: ch.color + "18" }}
                >
                  {ch.icon}
                </span>
                <span className="text-[0.75rem] font-semibold text-red-900/70">{ch.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Arrow */}
        <div className="hidden lg:flex items-center justify-center px-2 bg-[#faf9f7]">
          <span className="text-2xl font-bold text-ortaq-trust/40">→</span>
        </div>

        {/* One operation screen */}
        <div className="flex flex-col bg-white">
          <div className="border-b border-ortaq-border bg-ortaq-surface/60 px-5 py-3">
            <p className="text-[0.5625rem] font-bold uppercase tracking-[0.08em] text-ortaq-trust">
              {isTR ? "Tek işlem ekranı" : "One operation screen"}
            </p>
            <p className="mt-0.5 text-[0.8125rem] font-bold text-ortaq-ink">
              {isTR ? "Kartal Çelik · Hamburg Steel" : "Kartal Steel · Hamburg Steel"}
            </p>
          </div>

          <div className="border-b-2 border-ortaq-trust-deep bg-ortaq-trust px-5 py-4">
            <p className="text-[0.5625rem] font-bold uppercase tracking-[0.08em] text-white/75 mb-1">
              {isTR ? "Bugün yapılacak" : "Do today"}
            </p>
            <p className="text-[0.9375rem] font-bold text-white">
              {isTR ? "Alıcıyla bugün iletişime geç" : "Contact buyer today"}
            </p>
          </div>

          <div className="divide-y divide-ortaq-border/60 px-5 py-1">
            {outputs.filter((o) => o.key !== "today").map((row) => (
              <div key={row.key} className="flex items-center justify-between gap-4 py-3">
                <span className="shrink-0 text-[0.5625rem] font-bold uppercase tracking-[0.06em] text-ortaq-ink/40 w-24">
                  {row.label}
                </span>
                <span className={`text-[0.8125rem] font-semibold text-right ${
                  row.tone === "risk" ? "text-amber-700" :
                  row.tone === "amber" ? "text-amber-600" :
                  "text-ortaq-ink"
                }`}>
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
