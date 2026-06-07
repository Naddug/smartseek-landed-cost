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
      "Muayene raporu hâlâ gelmedi. Bu hafta içinde gelmezse, planlanan yükleme tarihi gerçekçi olmaktan çıkar.",
      "Gemi 28 Haziran'da kalkıyor. Rapor bu tarihten önce gelmezse gemi kaçar — teslim en erken 15 Temmuz'a kayar.",
      "Yamato bu durumdan haberdar değil. Onlarla konuşmadan önce muayene tarihini netleştirin.",
    ],
    sources: [
      { label: "Email · 19 Haz", note: "Muayene sağlayıcısı rapor gecikmesini bildirdi" },
      { label: "Sözleşme · Madde 7", note: "Teslim yükümlülüğü ve gecikme cezası" },
    ],
  },
  {
    q: "Son 7 günde ne değişti?",
    answer: [
      "20 Haziran: Yamato teknik şartnameyi onayladı. Beklenen bir adımdı, gerçekleşti.",
      "22 Haziran: Teslim tarihi revizyonu geldi. 28 Haziran yerine 15 Temmuz öneriliyor. Karşılıklı onay henüz yok.",
      "24 Haziran: Muayene sağlayıcısı randevu talebine yanıt vermedi. Üç günlük sessizlik — bu sessizlik risk.",
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
      "Yamato teslim tarihini bilmek istiyor. Üç gündür bekliyorlar. Bir email yeterli — ama önce tarihi bilmek lazım.",
      "Muayene ekibi fabrika erişim koordinasyonu bekliyor. Onlar bekledikçe muayene tarihi uzuyor.",
      "Finans ekibi ödeme takvimine ne yazacağını bilemiyor. Belirsiz teslim tarihi, belirsiz ödeme demek.",
    ],
    sources: [
      { label: "Email · 22 Haz", note: "Yamato'nun son yazışması" },
      { label: "İç not · 23 Haz", note: "Finans ekibinin talebi" },
    ],
  },
  {
    q: "Bugün neye odaklanmalıyız?",
    answer: [
      "Bugün netlik bekleyen üç konu var.",
      "Birincisi: Tedarikçi revize teslimat tarihini hâlâ teyit etmedi. Bu teyit gelmeden Yamato'yla konuşmak erken.",
      "İkincisi: Yamato orijinal takvimin geçerli olduğunu sanıyor. Bu beklenti düzeltilmeli — ama önce tarihi bilmek lazım.",
      "Üçüncüsü: Sözleşme revizyonu imzayı bekliyor. Bu gecikirse ödeme takvimi de gecikir.",
      "Bu sırayla ilerleyin: muayene tarihi → Yamato bilgilendirmesi → sözleşme imzası.",
    ],
    sources: [
      { label: "2 email", note: "Yamato yazışmaları ve revizyon talebi" },
      { label: "Toplantı notu · 21 Haz", note: "Sözleşme revizyon kararı" },
      { label: "Sözleşme rev.3", note: "İmza bekleyen revizyon maddesi" },
    ],
  },
];

const QA_EN: QA[] = [
  {
    q: "What is the biggest risk?",
    answer: [
      "The inspection report is still missing. If it does not arrive this week, the planned shipment date becomes unrealistic.",
      "The vessel departs June 28. If the report does not arrive before then, the vessel is missed — delivery shifts to July 15 at the earliest.",
      "Yamato is not yet aware of this situation. Clarify the inspection date before you contact them.",
    ],
    sources: [
      { label: "Email · Jun 19", note: "Inspection provider reported the delay" },
      { label: "Contract · Clause 7", note: "Delivery obligation and penalty clause" },
    ],
  },
  {
    q: "What changed in the last 7 days?",
    answer: [
      "June 20: Yamato approved the technical specifications. An expected step — it happened.",
      "June 22: Delivery date revision arrived. July 15 instead of June 28. Mutual confirmation still pending.",
      "June 24: Inspection provider did not respond to the appointment request. Three days of silence — that silence is risk.",
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
      "Yamato wants to know the delivery date. They have been waiting three days. One email is enough — but you need to know the date first.",
      "The inspection team is waiting for factory access coordination. The longer they wait, the tighter the inspection window gets.",
      "The finance team cannot update the payment schedule without a confirmed delivery date. Uncertain delivery means uncertain payment.",
    ],
    sources: [
      { label: "Email · Jun 22", note: "Yamato's last correspondence" },
      { label: "Internal note · Jun 23", note: "Finance team request" },
    ],
  },
  {
    q: "What should we focus on today?",
    answer: [
      "Today, three things need clarity.",
      "First: The supplier has not confirmed the revised delivery date. Contacting Yamato before this is confirmed would be premature.",
      "Second: Yamato still believes the original timeline is in effect. This needs to be corrected — but not before the delivery date is settled.",
      "Third: The contract revision is waiting to be signed. If it slips, the payment timeline slips with it.",
      "Work through them in this order: inspection date → Yamato update → contract signature.",
    ],
    sources: [
      { label: "2 emails", note: "Yamato correspondence and revision request" },
      { label: "Meeting note · Jun 21", note: "Contract revision decision" },
      { label: "Contract rev.3", note: "Pending revision clause" },
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

  const qLabels = isTR
    ? ["En büyük risk?", "Bu hafta ne değişti?", "Kim bekliyor?", "Bugün ne yapmalı?"]
    : ["Biggest risk?", "What changed this week?", "Who is waiting?", "What to do today?"];

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

          {/* ── Briefing document — document flow, no grid ──────────────── */}
          <div className="mb-6 overflow-hidden rounded-xl border border-ortaq-cream/10 bg-ortaq-cream/[0.02]">
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
                    "px-5 py-4",
                    item.alert
                      ? "bg-amber-500/[0.08] border-l-2 border-l-amber-400"
                      : "",
                  )}
                >
                  <div className="flex items-baseline gap-2 mb-1.5">
                    <span className="font-mono text-[0.4375rem] font-bold text-ortaq-cream/20">
                      {item.num}
                    </span>
                    <span className={cn(
                      "text-[0.4375rem] font-bold uppercase tracking-[0.07em]",
                      item.alert ? "text-amber-400/90" : "text-ortaq-cream/35",
                    )}>
                      {item.label}
                    </span>
                  </div>
                  <p className={cn(
                    "text-[0.9375rem] leading-relaxed",
                    item.alert ? "text-ortaq-cream/95 font-medium" : "text-ortaq-cream/75",
                  )}>
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Action summary bar ──────────────────────────────────────── */}
          <div className="mb-8 overflow-hidden rounded-xl border border-ortaq-trust/25 bg-ortaq-trust">
            <div className="flex flex-col gap-1 px-5 py-3 sm:flex-row sm:items-center sm:gap-4">
              <p className="shrink-0 text-[0.4375rem] font-bold uppercase tracking-[0.1em] text-white/60">
                {isTR ? "Bugün için" : "Today"}
              </p>
              <div className="flex flex-wrap items-center gap-2">
                {(isTR
                  ? ["Muayene tarihi", "Yamato bilgilendirme", "Revizyon imzası"]
                  : ["Inspection date", "Yamato update", "Contract signature"]
                ).map((action, i) => (
                  <span key={i} className="flex items-center gap-1.5">
                    {i > 0 && <span className="text-white/30">→</span>}
                    <span className="text-[0.6875rem] font-semibold text-white">{action}</span>
                  </span>
                ))}
              </div>
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

          {/* ── Question pills — shorter labels ─────────────────────────── */}
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
                {qLabels[i]}
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

              {/* Source citations — real document references */}
              <div className="mt-5 border-t border-ortaq-cream/[0.07] pt-4">
                <p className="mb-3 text-[0.4375rem] font-bold uppercase tracking-[0.09em] text-ortaq-cream/25">
                  {isTR ? "Kaynaklar" : "Sources"}
                </p>
                <div className="space-y-2">
                  {qa[activeQ].sources.map((src, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 rounded-lg border border-ortaq-cream/[0.08] bg-ortaq-cream/[0.03] px-3 py-2.5"
                    >
                      <span className="mt-0.5 shrink-0 text-[0.7rem]">
                        {src.label.toLowerCase().includes("email") || src.label.toLowerCase().includes("e-mail") ? "📧"
                          : src.label.toLowerCase().includes("whatsapp") ? "💬"
                          : src.label.toLowerCase().includes("toplantı") || src.label.toLowerCase().includes("meeting") ? "📝"
                          : "📄"}
                      </span>
                      <div>
                        <p className="text-[0.5rem] font-bold text-ortaq-cream/55">{src.label}</p>
                        <p className="mt-0.5 text-[0.4375rem] italic text-ortaq-cream/30">{src.note}</p>
                      </div>
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
