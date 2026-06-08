"use client";

import { useTranslation } from "react-i18next";
import { cn } from "@/lib/cn";
import { Container } from "@/components/ui/Section";

const SOURCES_TR = [
  { icon: "📧", channel: "Email",          excerpt: "\"Numune kargo takip no: TR-88421 — Jakarta'ya yola çıktı.\"", meta: "18 Haz" },
  { icon: "💬", channel: "WhatsApp",       excerpt: "\"Cupping sonucu ne zaman? Alıcı bekliyor.\"",                  meta: "20 Haz" },
  { icon: "📄", channel: "Kontrat CO-1188", excerpt: "Avans ödeme koşulu: numune onayı",                            meta: "İmzalı" },
  { icon: "📝", channel: "Toplantı notu",  excerpt: "\"Green Origin cupping randevusu 22 Haziran.\"",               meta: "19 Haz" },
];

const SOURCES_EN = [
  { icon: "📧", channel: "Email",          excerpt: "\"Sample shipment tracking: TR-88421 — en route to Jakarta.\"", meta: "Jun 18" },
  { icon: "💬", channel: "WhatsApp",       excerpt: "\"When is the cupping result? Buyer is waiting.\"",              meta: "Jun 20" },
  { icon: "📄", channel: "Contract CO-1188", excerpt: "Advance payment condition: sample approval",                 meta: "Signed" },
  { icon: "📝", channel: "Meeting note",   excerpt: "\"Green Origin cupping scheduled June 22.\"",                   meta: "Jun 19" },
];

const MEMORY_TR = [
  { label: "Ne oldu",      val: "Numune Jakarta'ya gönderildi" },
  { label: "Ne değişti",   val: "Cupping randevusu 22 Haziran'a alındı" },
  { label: "Kim bekliyor", val: "Green Origin · cupping sonucu" },
];
const MEMORY_EN = [
  { label: "What happened",  val: "Sample shipped to Jakarta" },
  { label: "What changed",   val: "Cupping appointment set for June 22" },
  { label: "Who is waiting", val: "Green Origin · cupping result" },
];

const ACTIONS_TR = [
  { action: "Cupping tarihini teyit et",              role: "Operasyon", urgency: "bugün" },
  { action: "Alıcıya numune ulaştı bildirimi gönder", role: "Satış",     urgency: "hafta içi" },
];
const ACTIONS_EN = [
  { action: "Confirm cupping date",                   role: "Operations", urgency: "today" },
  { action: "Notify buyer that sample has arrived",   role: "Sales",      urgency: "this week" },
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
              {isTR ? "Platform — işlem dosyası" : "Platform — deal file"}
            </p>
            <h2 className="mt-2 text-[1.5rem] font-bold tracking-[-0.03em] text-ortaq-ink leading-[1.15] sm:text-[1.875rem]">
              {isTR
                ? "İşlem dosyası: yazışma ve karar geçmişi"
                : "Deal file: correspondence and decision history"}
            </h2>
            <p className="mt-3 max-w-xl text-[0.9375rem] leading-relaxed text-ortaq-ink-muted">
              {isTR
                ? "Email, WhatsApp ve belgeler tek dosyada. Her kayıt kanal ve tarihle saklanır. İç notlar karşı tarafa paylaşılmaz."
                : "Email, WhatsApp, and documents in one file. Every record stored with channel and date. Internal notes not shared with counterparty."}
            </p>
          </div>

          {/* Source flow diagram */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_2rem_1.4fr]">

            {/* LEFT — Source channels */}
            <div className="space-y-2 opacity-65">
              {sources.map((src, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 rounded-xl border border-ortaq-border/70 bg-white px-4 py-2.5"
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
                    {isTR ? "İşlem dosyası" : "Deal file"}
                  </p>
                </div>
                <p className="mt-0.5 text-[0.6875rem] font-semibold text-ortaq-ink">
                  Ham Kahve · Green Origin · €185.000
                </p>
              </div>

              {/* Action zone (scan first) */}
              <div className="border-b-2 border-ortaq-trust bg-ortaq-trust/[0.08] px-5 py-4">
                <p className="mb-3 text-[0.4375rem] font-bold uppercase tracking-[0.09em] text-ortaq-trust">
                  {isTR ? "Önerilen aksiyonlar" : "Recommended actions"}
                </p>
                <div className="space-y-3">
                  {actions.map((a, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="shrink-0 text-[1rem] font-bold text-ortaq-trust">→</span>
                      <p className="flex-1 text-[0.875rem] font-semibold text-ortaq-ink">
                        {a.action}
                      </p>
                      <div className="flex shrink-0 items-center gap-1.5">
                        <span className="rounded border border-ortaq-trust/30 bg-ortaq-trust/15 px-2 py-0.5 text-[0.4rem] font-bold text-ortaq-trust">
                          {a.role}
                        </span>
                        <span className="text-[0.46rem] font-bold text-amber-600">
                          {a.urgency}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* History zone */}
              <div className="px-5 py-4 opacity-80">
                <p className="mb-3 text-[0.4rem] font-bold uppercase tracking-[0.09em] text-ortaq-ink/30">
                  {isTR ? "Geçmiş" : "History"}
                </p>
                <div className="space-y-2">
                  {memory.map((m, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="mt-[0.15rem] shrink-0 text-[0.5rem] font-bold text-ortaq-trust/70">✓</span>
                      <div>
                        <p className="text-[0.4rem] font-semibold uppercase tracking-[0.06em] text-ortaq-ink/35 leading-none mb-0.5">
                          {m.label}
                        </p>
                        <p className={cn(
                          "text-[0.75rem] leading-snug",
                          m.label.includes("bekliyor") || m.label.includes("waiting")
                            ? "font-semibold text-ortaq-ink"
                            : "text-ortaq-ink/70",
                        )}>{m.val}</p>
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
