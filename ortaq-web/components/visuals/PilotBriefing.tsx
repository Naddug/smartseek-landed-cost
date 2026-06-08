"use client";

import { useTranslation } from "react-i18next";
import { cn } from "@/lib/cn";
import { Container } from "@/components/ui/Section";

const OP_TR = { name: "Yamato Machinery", meta: "Japonya · €1.2M · Sözleşme" };
const OP_EN = { name: "Yamato Machinery", meta: "Japan · €1.2M · Contract" };

/**
 * Pilot — one operation screen.
 * Merged proof: Intelligence (risk chain) + Reasoning (cause → effect).
 */
export function PilotBriefing() {
  const { i18n } = useTranslation();
  const isTR = (i18n.language ?? "tr").startsWith("tr");
  const op = isTR ? OP_TR : OP_EN;

  const status = isTR
    ? [
        { label: "Ne değişti",   value: "Teslim 28 Haz → 15 Tem", dot: "text-ortaq-trust" },
        { label: "Kim bekliyor", value: "Yamato · 3 gün",          dot: "text-amber-400" },
        { label: "Risk",         value: "Muayene gecikmesi",       dot: "text-red-400" },
        { label: "Bugün",        value: "Muayene tarihi al",       dot: "text-ortaq-trust" },
      ]
    : [
        { label: "What changed", value: "Delivery Jun 28 → Jul 15", dot: "text-ortaq-trust" },
        { label: "Who waits",    value: "Yamato · 3 days",          dot: "text-amber-400" },
        { label: "At risk",      value: "Inspection delay",         dot: "text-red-400" },
        { label: "Today",        value: "Get inspection date",      dot: "text-ortaq-trust" },
      ];

  const chain = isTR
    ? ["Muayene tamamlanmadan yükleme yok", "Yükleme yok → gemi kaçar", "Teslim 15 Temmuz'a kayar"]
    : ["No loading without inspection", "No loading → vessel missed", "Delivery slips to Jul 15"];

  const cause = isTR
    ? ["Muayene gecikmesi", "Yükleme bloke", "Teslim kayması"]
    : ["Inspection delay", "Loading blocked", "Delivery slip"];

  return (
    <section id="ortaq-pilot" className="border-b border-ortaq-border bg-ortaq-ink">
      <Container wide>
        <div className="py-14 sm:py-16">

          <div className="mb-8">
            <h2 className="text-[1.5rem] font-bold tracking-[-0.03em] text-ortaq-cream sm:text-[1.75rem]">
              {isTR ? "Tek işlem ekranı" : "One operation screen"}
            </h2>
          </div>

          <div className="overflow-hidden rounded-2xl border border-ortaq-cream/15 bg-ortaq-cream/[0.03]">

            {/* Deal header */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ortaq-cream/10 px-5 py-4">
              <div>
                <p className="text-[1rem] font-bold text-ortaq-cream">{op.name}</p>
                <p className="mt-0.5 text-[0.6875rem] text-ortaq-cream/45">{op.meta}</p>
              </div>
              <span className="rounded-full border border-amber-400/40 bg-amber-500/15 px-3 py-1 text-[0.625rem] font-bold text-amber-300">
                {isTR ? "Dikkat" : "Attention"}
              </span>
            </div>

            {/* 4 outputs — story grid */}
            <div className="grid grid-cols-2 border-b border-ortaq-cream/10 sm:grid-cols-4">
              {status.map((s) => (
                <div key={s.label} className="border-b border-ortaq-cream/10 px-4 py-4 sm:border-b-0 sm:border-r last:sm:border-r-0">
                  <p className="text-[0.5rem] font-bold uppercase tracking-[0.07em] text-ortaq-cream/35">
                    {s.label}
                  </p>
                  <p className="mt-1.5 text-[0.8125rem] font-semibold text-ortaq-cream leading-snug">
                    {s.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Risk chain — from Intelligence */}
            <div className="border-b border-ortaq-cream/10 px-5 py-4">
              <p className="mb-3 text-[0.5rem] font-bold uppercase tracking-[0.07em] text-ortaq-cream/30">
                {isTR ? "Risk zinciri" : "Risk chain"}
              </p>
              <div className="space-y-2">
                {chain.map((step, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="shrink-0 text-[0.625rem] font-bold text-ortaq-trust/60">{i + 1}</span>
                    <p className={cn(
                      "text-[0.8125rem] leading-snug",
                      i === chain.length - 1 ? "font-semibold text-amber-300" : "text-ortaq-cream/70",
                    )}>
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Cause → effect — from Reasoning */}
            <div className="border-b border-ortaq-cream/10 px-5 py-4">
              <p className="mb-3 text-[0.5rem] font-bold uppercase tracking-[0.07em] text-ortaq-cream/30">
                {isTR ? "Sebep → sonuç" : "Cause → effect"}
              </p>
              <div className="flex flex-wrap items-center gap-2">
                {cause.map((c, i) => (
                  <span key={c} className="flex items-center gap-2">
                    {i > 0 && <span className="text-ortaq-cream/25">→</span>}
                    <span className="rounded-lg border border-ortaq-cream/15 bg-ortaq-cream/[0.04] px-3 py-1.5 text-[0.75rem] font-medium text-ortaq-cream/80">
                      {c}
                    </span>
                  </span>
                ))}
              </div>
            </div>

            {/* Today action */}
            <div className="bg-ortaq-trust px-5 py-4">
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold text-white">→</span>
                <p className="text-[0.9375rem] font-bold text-white">
                  {isTR ? "Muayene tarihini al, Yamato'yu bilgilendir" : "Get inspection date, notify Yamato"}
                </p>
              </div>
            </div>

          </div>

        </div>
      </Container>
    </section>
  );
}
