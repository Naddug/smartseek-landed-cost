"use client";

import { useTranslation } from "react-i18next";
import { Container } from "@/components/ui/Section";

const SOURCES_TR = [
  { icon: "📧", channel: "Email",           excerpt: "\"Revize teslimat tarihi: 15 Temmuz.\"",          meta: "22 Haz" },
  { icon: "💬", channel: "WhatsApp",        excerpt: "\"Muayene ekibinden haber yok — risk mi?\"",     meta: "24 Haz" },
  { icon: "📄", channel: "Sözleşme rev.3", excerpt: "Teslimat yükümlülüğü — 28 Haziran",               meta: "İmzalı" },
  { icon: "📝", channel: "Toplantı notu",  excerpt: "\"Yamato tarihi teyit etmemizi bekliyor.\"",      meta: "21 Haz" },
];

const SOURCES_EN = [
  { icon: "📧", channel: "Email",           excerpt: "\"Revised delivery date: July 15.\"",             meta: "Jun 22" },
  { icon: "💬", channel: "WhatsApp",        excerpt: "\"No news from inspection team — risk?\"",        meta: "Jun 24" },
  { icon: "📄", channel: "Contract rev.3", excerpt: "Delivery obligation — June 28",                   meta: "Signed" },
  { icon: "📝", channel: "Meeting note",   excerpt: "\"Yamato is waiting for our date confirmation.\"", meta: "Jun 21" },
];

const MEMORY_TR = [
  { label: "Ne oldu",       val: "Yamato teknik şartnameyi onayladı" },
  { label: "Ne değişti",   val: "Teslim tarihi 28 Haz → 15 Tem önerildi" },
  { label: "Kim bekliyor", val: "Yamato · 3 gündür yanıtsız" },
];
const MEMORY_EN = [
  { label: "What happened", val: "Yamato approved the technical specifications" },
  { label: "What changed",  val: "Delivery shifted Jun 28 → Jul 15 proposed" },
  { label: "Who is waiting", val: "Yamato · 3 days without response" },
];

const ACTIONS_TR = [
  { action: "Muayene tarihini netleştir",   role: "Operasyon", urgency: "bugün" },
  { action: "Yamato'yu yazılı bilgilendir", role: "Satış",     urgency: "hafta içi" },
];
const ACTIONS_EN = [
  { action: "Clarify inspection date",      role: "Operations", urgency: "today" },
  { action: "Inform Yamato in writing",     role: "Sales",      urgency: "this week" },
];

export function OperationalMemory() {
  const { i18n } = useTranslation();
  const isTR = (i18n.language ?? "tr").startsWith("tr");

  const sources = isTR ? SOURCES_TR : SOURCES_EN;
  const memory  = isTR ? MEMORY_TR  : MEMORY_EN;
  const actions = isTR ? ACTIONS_TR : ACTIONS_EN;

  return (
    <section className="border-b border-ortaq-border bg-[#faf9f7]">
      <Container wide>
        <div className="py-14 sm:py-18">

          {/* Section header */}
          <div className="mb-10">
            <p className="text-[0.625rem] font-bold uppercase tracking-[0.1em] text-ortaq-ink/40">
              {isTR ? "Operasyonel Hafıza" : "Operational Memory"}
            </p>
            <h2 className="mt-2 text-[1.5rem] font-bold tracking-[-0.03em] text-ortaq-ink leading-[1.15] sm:text-[1.875rem]">
              {isTR ? (
                <>
                  ORTAQ operasyonu hatırlar.<br />
                  <span className="text-ortaq-trust">Ekibinizin hatırlaması gerekmez.</span>
                </>
              ) : (
                <>
                  ORTAQ remembers the operation.<br />
                  <span className="text-ortaq-trust">Your team doesn&apos;t have to.</span>
                </>
              )}
            </h2>
          </div>

          {/* Source flow diagram */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_2rem_1.4fr]">

            {/* LEFT — Source channels */}
            <div className="space-y-2">
              {sources.map((src, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 rounded-xl border border-ortaq-border bg-white px-4 py-3"
                >
                  <span className="mt-0.5 shrink-0 text-base">{src.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[0.5rem] font-bold uppercase tracking-[0.06em] text-ortaq-ink/50">
                        {src.channel}
                      </span>
                      <span className="text-[0.4375rem] text-ortaq-ink/25">{src.meta}</span>
                    </div>
                    <p className="text-[0.625rem] italic leading-snug text-ortaq-ink-muted truncate">
                      {src.excerpt}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* MIDDLE — Arrow connector */}
            <div className="hidden lg:flex flex-col items-center justify-center gap-1 text-ortaq-trust/40">
              <div className="h-full w-px bg-ortaq-trust/20 relative flex items-center justify-center">
                <span className="absolute text-[1rem] font-bold text-ortaq-trust/50">→</span>
              </div>
            </div>

            {/* RIGHT — ORTAQ record */}
            <div className="overflow-hidden rounded-xl border border-ortaq-trust/25 bg-white shadow-sm">

              {/* Record header */}
              <div className="border-b border-ortaq-trust/15 bg-ortaq-trust/[0.04] px-5 py-3">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-ortaq-trust" />
                  <p className="text-[0.5rem] font-bold uppercase tracking-[0.1em] text-ortaq-trust/70">
                    {isTR ? "ORTAQ Operasyon Kaydı" : "ORTAQ Operation Record"}
                  </p>
                </div>
                <p className="mt-0.5 text-[0.6875rem] font-semibold text-ortaq-ink">
                  Yamato Machinery · €1.200.000
                </p>
              </div>

              {/* Memory zone */}
              <div className="px-5 py-4">
                <p className="mb-3 text-[0.4375rem] font-bold uppercase tracking-[0.09em] text-ortaq-ink/35">
                  {isTR ? "Hafıza" : "Memory"}
                </p>
                <div className="space-y-2">
                  {memory.map((m, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="mt-[0.15rem] shrink-0 text-[0.5rem] font-bold text-ortaq-trust">✓</span>
                      <div>
                        <p className="text-[0.4375rem] font-semibold uppercase tracking-[0.06em] text-ortaq-ink/40 leading-none mb-0.5">
                          {m.label}
                        </p>
                        <p className="text-[0.75rem] leading-snug text-ortaq-ink/80">{m.val}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div className="mx-5 border-t border-ortaq-trust/10" />

              {/* Action zone */}
              <div className="bg-ortaq-trust/[0.03] px-5 py-4">
                <p className="mb-3 text-[0.4375rem] font-bold uppercase tracking-[0.09em] text-ortaq-trust/60">
                  {isTR ? "Önerilen aksiyonlar" : "Recommended actions"}
                </p>
                <div className="space-y-2.5">
                  {actions.map((a, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="shrink-0 text-[0.875rem] font-bold text-ortaq-trust">→</span>
                      <p className="flex-1 text-[0.8125rem] font-medium text-ortaq-ink">
                        {a.action}
                      </p>
                      <div className="flex shrink-0 items-center gap-1.5">
                        <span className="rounded border border-ortaq-trust/20 bg-ortaq-trust/10 px-1.5 py-0.5 text-[0.375rem] font-bold text-ortaq-trust/70">
                          {a.role}
                        </span>
                        <span className="text-[0.4375rem] font-medium text-amber-600">
                          {a.urgency}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>
      </Container>
    </section>
  );
}
