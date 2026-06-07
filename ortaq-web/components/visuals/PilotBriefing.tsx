"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { useTranslation } from "react-i18next";
import { Container } from "@/components/ui/Section";

/* ── Data ─────────────────────────────────────────────────────────────────── */

const OP_TR = {
  name: "Yamato Machinery",
  country: "Japonya (Osaka)",
  value: "€1.200.000",
  type: "Makine İhracatı",
  phase: "Sözleşme Aşaması",
  updated: "Dün, 23:47",
};
const OP_EN = {
  name: "Yamato Machinery",
  country: "Japan (Osaka)",
  value: "€1,200,000",
  type: "Machinery Export",
  phase: "Contract Phase",
  updated: "Yesterday, 23:47",
};

interface BriefingItem {
  num: string;
  label: string;
  text: string;
  alert?: true;
}

const BRIEFING_TR: BriefingItem[] = [
  {
    num: "01",
    label: "Durum",
    text: "Yamato Machinery sözleşmesi son inceleme aşamasında. Teknik şartname iki tarafça kabul gördü; imza süreci henüz başlatılmadı.",
  },
  {
    num: "02",
    label: "Dikkat Gerektiren Konu",
    text: "Muayene raporu henüz ulaşmadı. Muayene tamamlanmadan yükleme başlayamaz; bu durum mevcut sevkiyat planını etkileyebilir.",
    alert: true,
  },
  {
    num: "03",
    label: "Karşı Taraf Ne Bekliyor?",
    text: "Yamato tarafı teslim tarihi teyidi bekliyor. Son yazışma 22 Haziran tarihli ve üç gündür yanıtsız.",
  },
  {
    num: "04",
    label: "Son Değişiklik",
    text: "22 Haziran'da teslim tarihi revizyonu önerildi. Yeni öneri: 15 Temmuz. Karşılıklı onay henüz alınmadı.",
  },
  {
    num: "05",
    label: "Bugün İçin Öneri",
    text: "Muayene sağlayıcısından kesin tarih alın. Tarihi netleştirdikten sonra Yamato'yu yazılı olarak bilgilendirin.",
  },
];

const BRIEFING_EN: BriefingItem[] = [
  {
    num: "01",
    label: "Status",
    text: "Yamato Machinery contract is in the final review stage. Technical specifications accepted by both parties; signing process not yet initiated.",
  },
  {
    num: "02",
    label: "Attention Required",
    text: "Inspection report has not yet arrived. Loading cannot begin without inspection completion; this may affect the current shipment plan.",
    alert: true,
  },
  {
    num: "03",
    label: "What Is the Counterparty Waiting For?",
    text: "Yamato is waiting for delivery date confirmation. Last correspondence was dated June 22 and has gone unanswered for three days.",
  },
  {
    num: "04",
    label: "Recent Change",
    text: "A delivery date revision was proposed on June 22. New proposal: July 15. Mutual confirmation not yet received.",
  },
  {
    num: "05",
    label: "Suggestion for Today",
    text: "Get a firm date from the inspection provider. Once confirmed, inform Yamato of the updated status in writing.",
  },
];

interface Source { label: string; note: string }
interface QA { q: string; answer: string[]; sources: Source[] }

const QA_TR: QA[] = [
  {
    q: "En büyük risk ne?",
    answer: [
      "Muayene raporu 22 Haziran itibarıyla gelmedi. Muayene belgesi olmadan yükleme başlayamaz.",
      "Mevcut takvimde gemi 28 Haziran'da kalkıyor. Rapor bu tarihten önce ulaşmazsa gemi kaçabilir.",
      "Gemi kaçarsa teslim en erken 15 Temmuz'a kayar. Yamato'ya verilmiş söz bu tarihi bağlıyor.",
    ],
    sources: [
      { label: "Email · 19 Haz", note: "Muayene sağlayıcısı, rapor gecikmesini bildirdi" },
      { label: "Sözleşme · Madde 7", note: "Teslim yükümlülüğü ve gecikme cezası" },
    ],
  },
  {
    q: "Son 7 günde ne değişti?",
    answer: [
      "20 Haziran: Yamato teknik şartnameyi onayladı — yazılı teyit alındı.",
      "22 Haziran: Teslim tarihi revizyon önerisi geldi; 28 Haz yerine 15 Tem.",
      "24 Haziran: Muayene sağlayıcısı randevu talebine yanıt vermedi.",
    ],
    sources: [
      { label: "Email · 20 Haz", note: "Teknik onay, Yamato Satın Alma" },
      { label: "WhatsApp · 22 Haz", note: "Teslim tarihi revizyon önerisi" },
      { label: "Telefon notu · 24 Haz", note: "Muayene ekibi ulaşılamadı" },
    ],
  },
  {
    q: "Kim bekliyor?",
    answer: [
      "Yamato Machinery: Teslim tarihi teyidi — 3 gündür yanıt bekliyor.",
      "Muayene ekibi: Fabrika erişim koordinasyonu — randevu talebi henüz iletilmedi.",
      "Finans ekibi: Revize teslim tarihine göre ödeme takvimi güncellemesi.",
    ],
    sources: [
      { label: "Email · 22 Haz", note: "Yamato tarafının son yazışması" },
      { label: "İç not · 23 Haz", note: "Finans ekibinin talebi" },
    ],
  },
  {
    q: "Şimdi ne yapmalıyım?",
    answer: [
      "Muayene sağlayıcısını ara — kesin tarih iste. Bugün netleşmezse alternatif muayene firmasına geç.",
      "Yamato'ya yazılı güncelleme gönder: teslim tarihi teyidi en geç 27 Haziran.",
      "Sözleşme Madde 7'yi kontrol et — teslim gecikmesinde ceza maddesi ne gerektiriyor?",
    ],
    sources: [
      { label: "Sözleşme rev.3", note: "Madde 7 — gecikme cezası" },
      { label: "Email · 22 Haz", note: "Yamato'nun beklentisi" },
    ],
  },
];

const QA_EN: QA[] = [
  {
    q: "What is the biggest risk?",
    answer: [
      "Inspection report has not arrived as of June 22. Loading cannot begin without the inspection certificate.",
      "Current schedule has the vessel departing June 28. If the report does not arrive before this date, the vessel may be missed.",
      "If the vessel is missed, delivery shifts to July 15 at the earliest — the commitment made to Yamato.",
    ],
    sources: [
      { label: "Email · Jun 19", note: "Inspection provider notified of report delay" },
      { label: "Contract · Clause 7", note: "Delivery obligation and penalty clause" },
    ],
  },
  {
    q: "What changed in the last 7 days?",
    answer: [
      "June 20: Yamato approved the technical specifications — written confirmation received.",
      "June 22: Delivery date revision proposed; July 15 instead of June 28.",
      "June 24: Inspection provider did not respond to appointment request.",
    ],
    sources: [
      { label: "Email · Jun 20", note: "Technical approval, Yamato Procurement" },
      { label: "WhatsApp · Jun 22", note: "Delivery date revision proposal" },
      { label: "Call note · Jun 24", note: "Inspection team unreachable" },
    ],
  },
  {
    q: "Who is waiting?",
    answer: [
      "Yamato Machinery: Delivery date confirmation — no response for 3 days.",
      "Inspection team: Factory access coordination — appointment request not yet sent.",
      "Finance team: Payment schedule update based on revised delivery date.",
    ],
    sources: [
      { label: "Email · Jun 22", note: "Yamato's last correspondence" },
      { label: "Internal note · Jun 23", note: "Finance team request" },
    ],
  },
  {
    q: "What should I do now?",
    answer: [
      "Call inspection provider — request a firm date. If unresolved today, switch to alternative inspection firm.",
      "Send written update to Yamato: delivery date confirmation by June 27 at the latest.",
      "Check contract Clause 7 — what does the penalty clause require for delivery delays?",
    ],
    sources: [
      { label: "Contract rev.3", note: "Clause 7 — delay penalty" },
      { label: "Email · Jun 22", note: "Yamato's expectation" },
    ],
  },
];

/* ── Component ────────────────────────────────────────────────────────────── */

export function PilotBriefing() {
  const { i18n } = useTranslation();
  const isTR = (i18n.language ?? "tr").startsWith("tr");

  const op       = isTR ? OP_TR       : OP_EN;
  const briefing = isTR ? BRIEFING_TR : BRIEFING_EN;
  const qa       = isTR ? QA_TR       : QA_EN;

  const [activeQ, setActiveQ] = useState<number>(0);

  return (
    <section id="ortaq-pilot" className="border-b border-ortaq-border bg-ortaq-ink">
      <Container wide>
        <div className="py-14 sm:py-18">

          {/* ── Section header ──────────────────────────────────────────── */}
          <div className="mb-10">
            <p className="text-[0.625rem] font-bold uppercase tracking-[0.1em] text-ortaq-trust/70">
              ORTAQ Pilot
            </p>
            <h2 className="mt-2 text-[1.5rem] font-bold tracking-[-0.03em] text-ortaq-cream leading-[1.15] sm:text-[1.875rem]">
              {isTR
                ? "Sabah geldiğinizde\nORTAQ sizi neyle karşılar?"
                : "What does ORTAQ\nbriefyou with each morning?"}
            </h2>
            <p className="mt-3 max-w-xl text-[0.9375rem] leading-relaxed text-ortaq-cream/55">
              {isTR
                ? "İlk soruyu sormadan önce bilmeniz gerekenler. ORTAQ, operasyonu gece boyunca takip eder ve sabah hazır olarak sunar."
                : "What you need to know before asking the first question. ORTAQ tracks the operation overnight and has it ready each morning."}
            </p>
          </div>

          {/* ── Operation header ────────────────────────────────────────── */}
          <div className="mb-4 overflow-hidden rounded-xl border border-ortaq-cream/15 bg-ortaq-cream/[0.04]">
            <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
              <div>
                <p className="text-[0.9375rem] font-bold text-ortaq-cream leading-snug">{op.name}</p>
                <p className="mt-0.5 text-[0.625rem] text-ortaq-cream/50">
                  {op.country} · {op.value} · {op.type}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="rounded-full border border-ortaq-trust/40 bg-ortaq-trust/10 px-3 py-1 text-[0.4375rem] font-bold uppercase tracking-[0.07em] text-ortaq-trust">
                  {op.phase}
                </span>
                <span className="text-[0.4375rem] text-ortaq-cream/25">
                  {isTR ? "Güncelleme:" : "Updated:"} {op.updated}
                </span>
              </div>
            </div>
          </div>

          {/* ── Briefing document ───────────────────────────────────────── */}
          <div className="mb-8 overflow-hidden rounded-xl border border-ortaq-cream/10 bg-ortaq-cream/[0.02]">
            <div className="border-b border-ortaq-cream/[0.07] px-5 py-3">
              <p className="text-[0.4375rem] font-bold uppercase tracking-[0.1em] text-ortaq-cream/30">
                {isTR ? "ORTAQ Sabah Brifing" : "ORTAQ Morning Briefing"}
              </p>
            </div>
            <div className="divide-y divide-ortaq-cream/[0.06]">
              {briefing.map((item) => (
                <div
                  key={item.num}
                  className={cn(
                    "grid grid-cols-[4rem_1fr] gap-4 px-5 py-4",
                    item.alert && "bg-amber-500/[0.05] border-l-2 border-l-amber-400/50",
                  )}
                >
                  {/* Number + label column */}
                  <div className="pt-0.5">
                    <p className="font-mono text-[0.4375rem] font-bold text-ortaq-cream/20">{item.num}</p>
                    <p className={cn(
                      "mt-1 text-[0.4375rem] font-bold uppercase tracking-[0.07em] leading-tight",
                      item.alert ? "text-amber-400/80" : "text-ortaq-cream/35",
                    )}>
                      {item.label}
                    </p>
                  </div>
                  {/* Text column */}
                  <p className={cn(
                    "text-[0.875rem] leading-relaxed",
                    item.alert ? "text-ortaq-cream/90" : "text-ortaq-cream/75",
                  )}>
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Divider ─────────────────────────────────────────────────── */}
          <div className="mb-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-ortaq-cream/10" />
            <p className="shrink-0 text-[0.5rem] font-bold uppercase tracking-[0.1em] text-ortaq-cream/30">
              {isTR ? "ORTAQ'a sor" : "Ask ORTAQ"}
            </p>
            <div className="h-px flex-1 bg-ortaq-cream/10" />
          </div>

          {/* ── Question pills ──────────────────────────────────────────── */}
          <div className="mb-5 flex flex-wrap gap-2">
            {qa.map((item, i) => (
              <button
                key={i}
                onClick={() => setActiveQ(i)}
                className={cn(
                  "rounded-full border px-4 py-2 text-[0.8125rem] font-medium transition-all",
                  activeQ === i
                    ? "border-ortaq-trust bg-ortaq-trust/15 text-ortaq-trust"
                    : "border-ortaq-cream/20 bg-transparent text-ortaq-cream/50 hover:border-ortaq-cream/40 hover:text-ortaq-cream/80",
                )}
              >
                {item.q}
              </button>
            ))}
          </div>

          {/* ── Answer area ─────────────────────────────────────────────── */}
          <div className="overflow-hidden rounded-xl border border-ortaq-trust/20 bg-ortaq-trust/[0.04]">
            {/* Answer header */}
            <div className="flex items-center gap-2 border-b border-ortaq-trust/15 px-5 py-3">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-ortaq-trust/60" />
              <p className="text-[0.5rem] font-bold uppercase tracking-[0.1em] text-ortaq-trust/60">
                {qa[activeQ].q}
              </p>
            </div>

            {/* Answer lines */}
            <div className="px-5 py-4">
              <div className="space-y-3">
                {qa[activeQ].answer.map((line, i) => (
                  <p key={i} className="text-[0.875rem] leading-relaxed text-ortaq-cream/85">
                    {line}
                  </p>
                ))}
              </div>

              {/* Source citations */}
              <div className="mt-5 border-t border-ortaq-cream/[0.07] pt-4">
                <p className="mb-2 text-[0.4375rem] font-bold uppercase tracking-[0.09em] text-ortaq-cream/25">
                  {isTR ? "Kaynak" : "Source"}
                </p>
                <div className="flex flex-wrap gap-2">
                  {qa[activeQ].sources.map((src, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 rounded-lg border border-ortaq-cream/10 bg-ortaq-cream/[0.04] px-3 py-1.5"
                    >
                      <span className="text-[0.4375rem] font-bold text-ortaq-cream/50">{src.label}</span>
                      <span className="text-[0.4375rem] text-ortaq-cream/25">{src.note}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Trust note ──────────────────────────────────────────────── */}
          <p className="mt-6 max-w-lg text-[0.5625rem] leading-relaxed text-ortaq-cream/25">
            {isTR
              ? "Bu brifing, ORTAQ'ın Yamato Machinery operasyonuna ait tüm email, WhatsApp ve belgelerden gece boyunca ürettiği çıktıdır. Siz sormadan hazır."
              : "This briefing is what ORTAQ produces overnight from all emails, WhatsApp messages, and documents belonging to the Yamato Machinery operation. Ready before you ask."}
          </p>

        </div>
      </Container>
    </section>
  );
}
