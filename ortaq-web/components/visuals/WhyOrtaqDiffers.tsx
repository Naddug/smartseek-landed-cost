"use client";

import { useTranslation } from "react-i18next";
import { cn } from "@/lib/cn";
import { Container } from "@/components/ui/Section";

/* ── Data ─────────────────────────────────────────────────────────────────── */

const INPUTS_TR = [
  { date: "8 Haz",  channel: "Email",    text: "\"€290K teklif geçerli — cuma'ya kadar onay bekliyoruz.\"" },
  { date: "14 Haz", channel: "WhatsApp", text: "\"Teknik uygun, fiyat için son onay alacağız.\"" },
  { date: "17 Haz", channel: "Email",    text: "\"5 gündür yanıt yok — stok rezervasyonu iptal edilebilir.\"" },
];
const INPUTS_EN = [
  { date: "Jun 8",  channel: "Email",    text: "\"€290K offer valid — awaiting approval by Friday.\"" },
  { date: "Jun 14", channel: "WhatsApp", text: "\"Technically approved, final sign-off on price pending.\"" },
  { date: "Jun 17", channel: "Email",    text: "\"No response for 5 days — stock reservation may be released.\"" },
];

const SCATTERED_OUTPUT_TR = "Fiyat ve onay süreci devam ediyor.";
const SCATTERED_OUTPUT_EN = "Price and approval process is ongoing.";

const SCATTERED_LIMITS_TR = [
  "Geçmiş yazışmalar tek yerde değil",
  "Teknik onay ile fiyat onayı bir arada görünmüyor",
  "Alıcının kaç gündür sessiz olduğu işaretlenmiyor",
  "Stok rezervasyonu riski otomatik uyarılmıyor",
];
const SCATTERED_LIMITS_EN = [
  "Past messages are not in one place",
  "Technical approval and price sign-off not shown together",
  "How long the buyer has been silent is not flagged",
  "Stock reservation risk is not alerted automatically",
];

const ORTAQ_STATUS_TR = [
  "8 Haziran fiyat teklifi kayıtta",
  "14 Haziran teknik onay geldi",
  "Fiyat onayı 5 gündür bekleniyor",
  "Siam Electric yanıtsız — sıra alıcıda",
  "Stok rezervasyonu 2 gün içinde düşebilir",
  "Bugün aksiyon gerekli",
];
const ORTAQ_STATUS_EN = [
  "June 8 price offer on record",
  "June 14 technical approval received",
  "Price sign-off pending for 5 days",
  "Siam Electric unresponsive — buyer's turn",
  "Stock reservation may release within 2 days",
  "Action required today",
];

/* ── Component ────────────────────────────────────────────────────────────── */

export function WhyOrtaqDiffers() {
  const { i18n } = useTranslation();
  const isTR = (i18n.language ?? "tr").startsWith("tr");

  const inputs          = isTR ? INPUTS_TR          : INPUTS_EN;
  const scatteredOutput = isTR ? SCATTERED_OUTPUT_TR : SCATTERED_OUTPUT_EN;
  const scatteredLimits = isTR ? SCATTERED_LIMITS_TR : SCATTERED_LIMITS_EN;
  const ortaqLines      = isTR ? ORTAQ_STATUS_TR    : ORTAQ_STATUS_EN;

  return (
    <section className="border-b border-ortaq-border bg-[#faf9f7]">
      <Container wide>
        <div className="py-14 sm:py-18">

          {/* ── Section header ─────────────────────────────────────────── */}
          <div className="mb-10">
            <p className="text-[0.625rem] font-bold uppercase tracking-[0.1em] text-ortaq-ink/40">
              {isTR ? "İşlem durumu" : "Deal status"}
            </p>
            <h2 className="mt-2 text-[1.5rem] font-bold tracking-[-0.03em] text-ortaq-ink leading-[1.15] sm:text-[1.875rem]">
              {isTR
                ? "Fiyat onayı beklemede. Sorumlu taraf ve süre kayıtlı."
                : "Price sign-off pending. Responsible party and duration on record."}
            </h2>
            <p className="mt-3 max-w-xl text-[0.9375rem] leading-relaxed text-ortaq-ink-muted">
              {isTR
                ? "Email, WhatsApp ve sözleşme ayrı kanallarda. Platformda aynı işlemde onay durumu, gecikme ve sorumlu taraf tek kayıtta. Erişim rol bazlıdır."
                : "Email, WhatsApp, and contract in separate channels. On the platform, approval status, delay, and responsible party in one record. Access is role-based."}
            </p>
          </div>

          {/* ── Shared inputs strip ────────────────────────────────────── */}
          <div className="mb-4 overflow-hidden rounded-xl border border-ortaq-border/70 bg-white opacity-70">
            <div className="border-b border-ortaq-border px-5 py-3">
              <p className="text-[0.5rem] font-bold uppercase tracking-[0.1em] text-ortaq-ink/40">
                {isTR ? "Aynı işlem — üç kanal" : "Same deal — three channels"}
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

            {/* LEFT — Scattered tracking */}
            <div className="overflow-hidden rounded-xl border border-ortaq-border/60 bg-white opacity-55">
              <div className="border-b border-ortaq-border/60 bg-ortaq-ink/[0.03] px-5 py-3">
                <p className="text-[0.5rem] font-bold uppercase tracking-[0.1em] text-ortaq-ink/40">
                  {isTR ? "Excel ve email takibi" : "Excel and email tracking"}
                </p>
              </div>

              <div className="border-b border-ortaq-border/50 bg-ortaq-ink/[0.02] px-5 py-4">
                <p className="text-[0.4375rem] font-bold uppercase tracking-[0.08em] text-ortaq-ink/30 mb-2">
                  {isTR ? "Gördüğünüz" : "What you see"}
                </p>
                <p className="text-[0.875rem] italic text-ortaq-ink/50">
                  &ldquo;{scatteredOutput}&rdquo;
                </p>
              </div>

              <div className="px-5 py-4">
                <p className="text-[0.4375rem] font-bold uppercase tracking-[0.08em] text-ortaq-ink/30 mb-3">
                  {isTR ? "Eksik kalan" : "What's missing"}
                </p>
                <div className="space-y-2">
                  {scatteredLimits.map((line, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <span className="mt-[0.1rem] shrink-0 text-[0.625rem] font-bold text-red-400">✕</span>
                      <p className="text-[0.75rem] leading-relaxed text-ortaq-ink/50">{line}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT — ORTAQ */}
            <div className="overflow-hidden rounded-xl border-2 border-ortaq-trust/40 bg-white shadow-[0_4px_24px_rgb(20_19_16/0.08)]">
              <div className="border-b border-ortaq-trust/20 bg-ortaq-trust/[0.05] px-5 py-3">
                <p className="text-[0.5rem] font-bold uppercase tracking-[0.1em] text-ortaq-trust/70">
                  ORTAQ
                </p>
              </div>

              <div className="border-b-2 border-ortaq-trust-deep bg-ortaq-trust px-5 py-4">
                <p className="text-[0.4375rem] font-bold uppercase tracking-[0.08em] text-white/70 mb-2">
                  {isTR ? "Sonraki adım" : "Next step"}
                </p>
                <div className="flex items-center gap-3">
                  <span className="text-[0.875rem] font-bold text-white">→</span>
                  <p className="text-[0.9375rem] font-semibold text-white">
                    {isTR
                      ? "Siam Electric'e bugün ulaşın"
                      : "Contact Siam Electric today"}
                  </p>
                  <span className="ml-auto shrink-0 rounded bg-white/20 px-2.5 py-1 text-[0.4375rem] font-bold text-white whitespace-nowrap">
                    {isTR ? "Satış" : "Sales"}
                  </span>
                </div>
              </div>

              <div className="border-b border-ortaq-trust/15 bg-ortaq-trust/[0.02] px-5 py-4">
                <p className="text-[0.4375rem] font-bold uppercase tracking-[0.08em] text-ortaq-trust/50 mb-2">
                  {isTR ? "İşlem durumu" : "Deal status"}
                </p>
                <div className="space-y-1.5">
                  {ortaqLines.map((line, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <span className={cn(
                        "mt-[0.1rem] shrink-0 text-[0.5625rem] font-bold",
                        i >= 3 ? "text-amber-600" : "text-ortaq-trust",
                      )}>{i >= 3 ? "⚠" : "✓"}</span>
                      <p className={cn(
                        "text-[0.75rem] leading-relaxed",
                        i >= 3 ? "font-semibold text-ortaq-ink" : "text-ortaq-ink/70",
                      )}>{line}</p>
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
