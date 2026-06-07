"use client";

import { useTranslation } from "react-i18next";
import { Container } from "@/components/ui/Section";

/* ── Data ─────────────────────────────────────────────────────────────────── */

const INPUTS_TR = [
  { date: "12 Haz", channel: "Email",       text: "\"28 Haziran teslim mutabıkız — sözleşme buna göre hazırlanacak.\"" },
  { date: "19 Haz", channel: "WhatsApp",    text: "\"Üretim gecikmesi var, teslimi biraz ötelemek gerekebilir.\"" },
  { date: "22 Haz", channel: "Sözleşme",   text: "Revizyon talebi — yeni tarih: 15 Temmuz önerisi" },
];
const INPUTS_EN = [
  { date: "Jun 12", channel: "Email",    text: "\"We agree on June 28 delivery — the contract will be prepared accordingly.\"" },
  { date: "Jun 19", channel: "WhatsApp", text: "\"There is a production delay, we may need to push delivery a bit.\"" },
  { date: "Jun 22", channel: "Contract", text: "Revision request — proposed new date: July 15" },
];

const GENERIC_OUTPUT_TR = "Teslim tarihiyle ilgili değişiklik konuşuluyor.";
const GENERIC_OUTPUT_EN = "Changes to the delivery date are being discussed.";

const GENERIC_LIMITS_TR = [
  "Geçmiş operasyon bağlamını bilmez",
  "Önceki taahhütleri takip etmez",
  "Risk zincirini modellemez",
  "Siz sormadan uyarmaz",
];
const GENERIC_LIMITS_EN = [
  "Has no past operational context",
  "Does not track previous commitments",
  "Does not model the risk chain",
  "Does not warn unless you ask",
];

const ORTAQ_UNDERSTANDS_TR = [
  "12 Haziran teslim taahhüdü bulundu",
  "22 Haziran revizyonu taahhütle çelişiyor",
  "Operasyon takviminde kayma oluştu",
  "Karşı taraf değişiklikten haberdar değil",
  "4 gün içinde teslimat riski oluşabilir",
  "Bugün aksiyon gerekli",
];
const ORTAQ_UNDERSTANDS_EN = [
  "June 12 delivery commitment found",
  "June 22 revision conflicts with that commitment",
  "Operational timeline has shifted",
  "Counterparty not yet informed of the change",
  "Delivery risk may materialise within 4 days",
  "Action required today",
];

const CAPABILITIES_TR = [
  {
    name: "Operasyonel Hafıza",
    desc: "Önceki konuşmaları, taahhütleri ve kararları operasyona bağlı tutar. Unutmaz.",
  },
  {
    name: "Taahhüt Motoru",
    desc: "Kim neyi ne zaman söyledi — email'de de olsa, WhatsApp'ta da olsa — bilir.",
  },
  {
    name: "Bağımlılık Grafiği",
    desc: "Bir gecikmenin neyi etkileyeceğini zincir halinde görür. Siz sormadan.",
  },
  {
    name: "Risk Motoru",
    desc: "Riskleri problem olmadan önce gösterir. Uyarı sizin aramanızı beklemez.",
  },
];
const CAPABILITIES_EN = [
  {
    name: "Operational Memory",
    desc: "Holds past conversations, commitments, and decisions connected to the operation. Doesn't forget.",
  },
  {
    name: "Commitment Engine",
    desc: "Knows who said what and when — whether in email, WhatsApp, or a meeting.",
  },
  {
    name: "Dependency Graph",
    desc: "Sees what a delay will affect in a chain — before you ask.",
  },
  {
    name: "Risk Engine",
    desc: "Surfaces risks before they become problems. The warning doesn't wait for your question.",
  },
];

/* ── Component ────────────────────────────────────────────────────────────── */

export function WhyOrtaqDiffers() {
  const { i18n } = useTranslation();
  const isTR = (i18n.language ?? "tr").startsWith("tr");

  const inputs        = isTR ? INPUTS_TR         : INPUTS_EN;
  const genericOutput = isTR ? GENERIC_OUTPUT_TR  : GENERIC_OUTPUT_EN;
  const genericLimits = isTR ? GENERIC_LIMITS_TR  : GENERIC_LIMITS_EN;
  const ortaqLines    = isTR ? ORTAQ_UNDERSTANDS_TR : ORTAQ_UNDERSTANDS_EN;
  const capabilities  = isTR ? CAPABILITIES_TR   : CAPABILITIES_EN;

  return (
    <section className="border-b border-ortaq-border bg-[#faf9f7]">
      <Container wide>
        <div className="py-14 sm:py-18">

          {/* ── Section header ─────────────────────────────────────────── */}
          <div className="mb-10">
            <p className="text-[0.625rem] font-bold uppercase tracking-[0.1em] text-ortaq-ink/40">
              {isTR ? "Neden farklı?" : "Why different?"}
            </p>
            <h2 className="mt-2 text-[1.5rem] font-bold tracking-[-0.03em] text-ortaq-ink leading-[1.15] sm:text-[1.875rem]">
              {isTR ? (
                <>
                  Neden ORTAQ farklı?<br />
                  <span className="text-ortaq-trust">Aynı bilgiyi birçok sistem okuyabilir.</span>
                </>
              ) : (
                <>
                  Why is ORTAQ different?<br />
                  <span className="text-ortaq-trust">Many systems can read the same information.</span>
                </>
              )}
            </h2>
            <p className="mt-3 max-w-xl text-[0.9375rem] leading-relaxed text-ortaq-ink-muted">
              {isTR
                ? "Fark zeka değil — süreklilik. ORTAQ operasyonu hatırlar. Genel bir AI yalnızca sorulan soruya yanıt verir."
                : "The difference is not intelligence — it is continuity. ORTAQ remembers the operation. A generic AI only answers the question asked."}
            </p>
          </div>

          {/* ── Shared inputs strip ────────────────────────────────────── */}
          <div className="mb-4 overflow-hidden rounded-xl border border-ortaq-border bg-white">
            <div className="border-b border-ortaq-border px-5 py-3">
              <p className="text-[0.5rem] font-bold uppercase tracking-[0.1em] text-ortaq-ink/40">
                {isTR ? "Her iki sistem de aynı bilgileri alıyor" : "Both systems receive the same information"}
              </p>
            </div>
            <div className="divide-y divide-ortaq-border/50">
              {inputs.map((inp, i) => (
                <div key={i} className="flex items-start gap-4 px-5 py-3">
                  <span className="shrink-0 font-mono text-[0.4375rem] text-ortaq-ink/30 pt-0.5">{inp.date}</span>
                  <span className="shrink-0 rounded border border-ortaq-border bg-[#faf9f7] px-1.5 py-0.5 text-[0.4375rem] font-bold uppercase tracking-[0.06em] text-ortaq-ink/50">
                    {inp.channel}
                  </span>
                  <p className="text-[0.625rem] leading-relaxed italic text-ortaq-ink-muted">{inp.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Side-by-side comparison ────────────────────────────────── */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

            {/* LEFT — Generic AI */}
            <div className="overflow-hidden rounded-xl border border-ortaq-border/60 bg-white">
              <div className="border-b border-ortaq-border/60 bg-ortaq-ink/[0.03] px-5 py-3">
                <p className="text-[0.5rem] font-bold uppercase tracking-[0.1em] text-ortaq-ink/40">
                  {isTR ? "Genel AI (ChatGPT, Copilot…)" : "Generic AI (ChatGPT, Copilot…)"}
                </p>
              </div>

              {/* Generic output */}
              <div className="border-b border-ortaq-border/50 bg-ortaq-ink/[0.02] px-5 py-4">
                <p className="text-[0.4375rem] font-bold uppercase tracking-[0.08em] text-ortaq-ink/30 mb-2">
                  {isTR ? "Çıktı" : "Output"}
                </p>
                <p className="text-[0.875rem] italic text-ortaq-ink/50">
                  &ldquo;{genericOutput}&rdquo;
                </p>
              </div>

              {/* Limitations */}
              <div className="px-5 py-4">
                <p className="text-[0.4375rem] font-bold uppercase tracking-[0.08em] text-ortaq-ink/30 mb-3">
                  {isTR ? "Yapamadıkları" : "What it cannot do"}
                </p>
                <div className="space-y-2">
                  {genericLimits.map((line, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <span className="mt-[0.1rem] shrink-0 text-[0.625rem] font-bold text-red-400">✕</span>
                      <p className="text-[0.75rem] leading-relaxed text-ortaq-ink/50">{line}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT — ORTAQ */}
            <div className="overflow-hidden rounded-xl border border-ortaq-trust/30 bg-white">
              <div className="border-b border-ortaq-trust/20 bg-ortaq-trust/[0.05] px-5 py-3">
                <p className="text-[0.5rem] font-bold uppercase tracking-[0.1em] text-ortaq-trust/70">
                  ORTAQ
                </p>
              </div>

              {/* ORTAQ understanding */}
              <div className="border-b border-ortaq-trust/15 bg-ortaq-trust/[0.02] px-5 py-4">
                <p className="text-[0.4375rem] font-bold uppercase tracking-[0.08em] text-ortaq-trust/50 mb-2">
                  {isTR ? "Anlayış" : "Understanding"}
                </p>
                <div className="space-y-1.5">
                  {ortaqLines.map((line, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <span className="mt-[0.1rem] shrink-0 text-[0.5625rem] font-bold text-ortaq-trust">✓</span>
                      <p className="text-[0.75rem] leading-relaxed text-ortaq-ink/80">{line}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Why ORTAQ knows */}
              <div className="px-5 py-4">
                <p className="text-[0.4375rem] font-bold uppercase tracking-[0.08em] text-ortaq-trust/50 mb-2">
                  {isTR ? "Bunu neden biliyor?" : "Why does it know this?"}
                </p>
                <p className="text-[0.625rem] leading-relaxed text-ortaq-ink-muted">
                  {isTR
                    ? "12 Haziran taahhüdünü hatırlıyor — çünkü o email bu operasyona ait. Revizyon talebini taahhütle karşılaştırıyor. Sonuçları bağımlılık zincirine göre modelliyor."
                    : "It remembers the June 12 commitment — because that email belongs to this operation. It compares the revision request against the commitment. It models consequences through the dependency chain."}
                </p>
              </div>
            </div>
          </div>

          {/* ── Key distinction callout ────────────────────────────────── */}
          <div className="mt-5 rounded-xl border border-ortaq-border bg-white px-6 py-4">
            <p className="text-[0.75rem] leading-relaxed text-ortaq-ink/70">
              <span className="font-bold text-ortaq-ink">
                {isTR
                  ? "Fark zeka değil, hafıza ve süreklilik. "
                  : "The difference is not intelligence — it is memory and continuity. "}
              </span>
              {isTR
                ? "Genel AI, siz sormadan geçmişi hatırlamaz, taahhütleri takip etmez, risk zincirini kurmaz. ORTAQ'ın operasyonel hafızası olduğu için bu bağlantıları kendiliğinden kurar."
                : "A generic AI doesn't remember the past without being asked, doesn't track commitments, doesn't build a risk chain. Because ORTAQ has operational memory, it builds these connections on its own."}
            </p>
          </div>

          {/* ── Capability cards microsection ─────────────────────────── */}
          <div className="mt-10">
            <h3 className="mb-5 text-[1rem] font-bold tracking-[-0.02em] text-ortaq-ink sm:text-[1.125rem]">
              {isTR ? "ORTAQ neden bunu biliyor?" : "Why does ORTAQ know this?"}
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {capabilities.map((cap) => (
                <div
                  key={cap.name}
                  className="flex flex-col gap-2 rounded-xl border border-ortaq-border bg-white px-5 py-5"
                >
                  <p className="text-[0.5rem] font-bold uppercase tracking-[0.08em] text-ortaq-trust">
                    {cap.name}
                  </p>
                  <p className="text-[0.625rem] leading-relaxed text-ortaq-ink-muted">
                    {cap.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </Container>
    </section>
  );
}
