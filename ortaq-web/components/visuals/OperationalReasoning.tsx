"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/cn";
import { Container } from "@/components/ui/Section";

/* ── Data ─────────────────────────────────────────────────────────────────── */

interface Fragment {
  channel: string;
  text: string;
}

interface Rec {
  timing: string;
  action: string;
}

interface Card {
  category: string;
  situation: string;
  fragments: Fragment[];
  humanSees: string;
  understands: string[];
  recommends: Rec[];
  riskLabel: string;
  riskTier: "medium" | "high" | "critical";
}

const CARDS_TR: Card[] = [
  {
    category: "Uluslararası Ticaret",
    situation: "Muayene durumu belirsiz",
    fragments: [
      {
        channel: "Email",
        text: "\"SGS ekibi cuma günkü muayene için hazır olmayabilir — üretim tarafından henüz yanıt gelmiyor.\"",
      },
      {
        channel: "WhatsApp",
        text: "\"Muayene ekibinden haber var mı? Gemi 26'sında kalkıyor...\"",
      },
      {
        channel: "Belge",
        text: "Akreditif (LC) — ödeme koşulu: muayene belgesi ibrazı zorunlu",
      },
    ],
    humanSees: "SGS raporu gecikmiş gibi görünüyor.",
    understands: [
      "Muayene henüz tamamlanmadı — resmi onay yok",
      "Muayene belgesi olmadan yükleme başlayamaz",
      "Yükleme gecikirse planlanan gemi kaçabilir",
      "Gemi kaçarsa LC ödeme takvimi etkilenir",
      "Alıcı bu riski henüz bilmiyor",
    ],
    recommends: [
      { timing: "Bugün", action: "SGS sağlayıcısıyla durumu netleştir" },
      { timing: "Perşembe'ye kadar", action: "Alıcıyı gecikme ihtimali konusunda bilgilendir" },
    ],
    riskLabel: "Yüksek",
    riskTier: "high",
  },
  {
    category: "Tedarik Zinciri",
    situation: "Tedarikçi teslimat tarihini değiştirdi",
    fragments: [
      {
        channel: "Email",
        text: "\"Üretim gecikmesi nedeniyle teslimatı 14 gün ertelemek zorundayız.\"",
      },
      {
        channel: "WhatsApp",
        text: "\"Bu siparişi başka tedarikçiden karşılayabilir miyiz? Üretim hattı bekliyor.\"",
      },
      {
        channel: "Belge",
        text: "Satın alma siparişi SOP-2847 — teslim tarihi: 18 Haziran",
      },
    ],
    humanSees: "Tedarikçi teslimatı erteledi.",
    understands: [
      "SOP-2847'deki teslim taahhüdü ihlal edildi",
      "Bu gecikme 2 üretim hattının başlangıcını etkiliyor",
      "Müşteriye verilen söz 22 Haziran — tampon süre kalmadı",
      "Sözleşmede gecikme cezası maddesi var",
      "Alternatif tedarikçi araştırması henüz başlatılmadı",
    ],
    recommends: [
      { timing: "Bugün", action: "Alternatif tedarikçilere ulaş" },
      { timing: "Bu hafta içinde", action: "Müşteriye olası gecikme hakkında bilgi ver" },
    ],
    riskLabel: "Kritik",
    riskTier: "critical",
  },
  {
    category: "B2B Proje Teslimi",
    situation: "Kapsam sözlü onaylandı, yazılı değil",
    fragments: [
      {
        channel: "Email",
        text: "\"Toplantıda konuştuklarımıza göre genişletilmiş kapsamla devam edebilirsiniz.\"",
      },
      {
        channel: "WhatsApp",
        text: "\"Müşteri bugün ek modülleri onayladı — takım bilgilendirildi.\"",
      },
      {
        channel: "Belge",
        text: "Aktif sözleşme rev.4 — kapsam: 3 modül, imzalı",
      },
    ],
    humanSees: "Müşteri ek modülleri onayladı.",
    understands: [
      "Yazılı onay alınmadı — yalnızca sözlü mutabakat var",
      "Mevcut sözleşme 3 modül kapsıyor, 5 değil",
      "Sözleşme güncellenmeden geliştirme başlarsa ödeme riski oluşur",
      "Ekip zaten çalışmaya başlamış olabilir — doğrulama gerekiyor",
      "Sözlü kapsam değişikliği anlaşmazlıkta hukuken bağlayıcı değil",
    ],
    recommends: [
      { timing: "Bugün", action: "Müşteriden yazılı onay veya değişiklik belgesi iste" },
      { timing: "Önce", action: "Geliştirme ekibini yazılı onay gelene kadar durdur" },
    ],
    riskLabel: "Orta–Yüksek",
    riskTier: "medium",
  },
];

const CARDS_EN: Card[] = [
  {
    category: "International Trade",
    situation: "Inspection status unclear",
    fragments: [
      {
        channel: "Email",
        text: "\"SGS team may not be ready for Friday's inspection — still no response from production.\"",
      },
      {
        channel: "WhatsApp",
        text: "\"Any news from the inspection team? The vessel departs on the 26th...\"",
      },
      {
        channel: "Document",
        text: "Letter of Credit (LC) — payment condition: inspection certificate required",
      },
    ],
    humanSees: "SGS report appears to be delayed.",
    understands: [
      "Inspection not completed — no official clearance",
      "Loading cannot begin without the inspection certificate",
      "If loading is delayed, the planned vessel may depart without cargo",
      "If the vessel is missed, the LC payment timeline is affected",
      "Buyer is not yet aware of this risk",
    ],
    recommends: [
      { timing: "Today", action: "Clarify status with SGS provider" },
      { timing: "By Thursday", action: "Inform buyer of possible delay" },
    ],
    riskLabel: "High",
    riskTier: "high",
  },
  {
    category: "Supply Chain",
    situation: "Supplier changed delivery date",
    fragments: [
      {
        channel: "Email",
        text: "\"Due to a production delay, we need to postpone the delivery by 14 days.\"",
      },
      {
        channel: "WhatsApp",
        text: "\"Can we source this from another supplier? The production line is waiting.\"",
      },
      {
        channel: "Document",
        text: "Purchase order SOP-2847 — delivery date: June 18",
      },
    ],
    humanSees: "Supplier postponed the delivery.",
    understands: [
      "Delivery commitment in SOP-2847 has been breached",
      "This delay affects the start of 2 production lines",
      "Customer commitment is June 22 — no buffer remaining",
      "Contract includes a late delivery penalty clause",
      "Alternative supplier search has not been initiated",
    ],
    recommends: [
      { timing: "Today", action: "Contact alternative suppliers" },
      { timing: "This week", action: "Inform customer of possible delay" },
    ],
    riskLabel: "Critical",
    riskTier: "critical",
  },
  {
    category: "B2B Project Delivery",
    situation: "Scope approved verbally, not in writing",
    fragments: [
      {
        channel: "Email",
        text: "\"Based on our conversation, you can proceed with the expanded scope.\"",
      },
      {
        channel: "WhatsApp",
        text: "\"Client approved the additional modules today — team was informed.\"",
      },
      {
        channel: "Document",
        text: "Active contract rev.4 — scope: 3 modules, signed",
      },
    ],
    humanSees: "Client approved the additional modules.",
    understands: [
      "No written approval received — verbal agreement only",
      "Current contract covers 3 modules, not 5",
      "Starting development without contract update creates payment risk",
      "Team may already be working — verification needed",
      "Verbal scope change is not enforceable in a dispute",
    ],
    recommends: [
      { timing: "Today", action: "Request written approval or change order from client" },
      { timing: "First", action: "Pause development team until written confirmation arrives" },
    ],
    riskLabel: "Medium–High",
    riskTier: "medium",
  },
];

/* ── Risk badge colour ────────────────────────────────────────────────────── */

const RISK_STYLE: Record<Card["riskTier"], string> = {
  medium:   "bg-amber-50 border-amber-200 text-amber-700",
  high:     "bg-orange-50 border-orange-200 text-orange-700",
  critical: "bg-red-50 border-red-200 text-red-700",
};

/* ── Component ────────────────────────────────────────────────────────────── */

export function OperationalReasoning() {
  const { i18n } = useTranslation();
  const isTR = (i18n.language ?? "tr").startsWith("tr");
  const cards = isTR ? CARDS_TR : CARDS_EN;

  const [activeCard, setActiveCard] = useState(0);
  const card = cards[activeCard];

  return (
    <section className="border-b border-ortaq-border bg-white">
      <Container wide>
        <div className="py-14 sm:py-18">

          {/* ── Section header ─────────────────────────────────────────── */}
          <div className="mb-10">
            <p className="text-[0.625rem] font-bold uppercase tracking-[0.1em] text-ortaq-ink/40">
              {isTR ? "Nasıl düşünüyor?" : "How does it think?"}
            </p>
            <h2 className="mt-2 text-[1.5rem] font-bold tracking-[-0.03em] text-ortaq-ink leading-[1.15] sm:text-[1.875rem]">
              {isTR ? (
                <>
                  ORTAQ nasıl düşünüyor?<br />
                  <span className="text-ortaq-trust">Aynı bilgiyi herkes görebilir.</span>
                </>
              ) : (
                <>
                  How does ORTAQ think?<br />
                  <span className="text-ortaq-trust">Anyone can see the same information.</span>
                </>
              )}
            </h2>
            <p className="mt-3 max-w-xl text-[0.9375rem] leading-relaxed text-ortaq-ink-muted">
              {isTR
                ? "Önemli olan ne anladığınızdır. Aynı email, mesaj ve belge — insan gözü ile ORTAQ'ın operasyonel zekası arasındaki fark."
                : "What matters is what you understand from it. Same email, message, and document — the difference between a human eye and ORTAQ's operational intelligence."}
            </p>
          </div>

          {/* ── Card selector tabs ─────────────────────────────────────── */}
          <div className="mb-6 flex flex-wrap gap-2">
            {cards.map((c, i) => (
              <button
                key={i}
                onClick={() => setActiveCard(i)}
                className={cn(
                  "rounded-full border px-4 py-2 text-[0.8125rem] font-medium transition-all",
                  activeCard === i
                    ? "border-ortaq-ink bg-ortaq-ink text-ortaq-cream"
                    : "border-ortaq-border bg-white text-ortaq-ink-soft hover:border-ortaq-ink/40 hover:text-ortaq-ink",
                )}
              >
                {c.category}
              </button>
            ))}
          </div>

          {/* ── Single active reasoning card ───────────────────────────── */}
          <div className="overflow-hidden rounded-2xl border border-ortaq-border">

            {/* Card header */}
            <div className="border-b border-ortaq-border bg-[#faf9f7] px-6 py-4">
              <p className="text-[0.5rem] font-bold uppercase tracking-[0.1em] text-ortaq-ink/40">{card.category}</p>
              <p className="mt-0.5 text-[0.9375rem] font-bold text-ortaq-ink">{card.situation}</p>
            </div>

            {/* Four-zone layout */}
            <div className="divide-y divide-ortaq-border">

              {/* Zone 1: WHAT EXISTS */}
              <div className="grid grid-cols-1 gap-0 sm:grid-cols-[7rem_1fr]">
                <div className="flex items-start border-b border-ortaq-border bg-[#f5f4f2] px-5 py-4 sm:border-b-0 sm:border-r">
                  <p className="text-[0.5rem] font-bold uppercase tracking-[0.08em] text-ortaq-ink/40 pt-0.5">
                    {isTR ? "Mevcut bilgi" : "What exists"}
                  </p>
                </div>
                <div className="divide-y divide-ortaq-border/50 bg-[#faf9f7]">
                  {card.fragments.map((f, i) => (
                    <div key={i} className="flex items-start gap-3 px-5 py-3">
                      <span className="mt-0.5 shrink-0 rounded bg-ortaq-border px-1.5 py-0.5 text-[0.4375rem] font-bold uppercase tracking-[0.06em] text-ortaq-ink/60">
                        {f.channel}
                      </span>
                      <p className="text-[0.625rem] leading-relaxed text-ortaq-ink-muted italic">{f.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Zone 2: WHAT A HUMAN SEES */}
              <div className="grid grid-cols-1 sm:grid-cols-[7rem_1fr]">
                <div className="flex items-center border-b border-ortaq-border bg-amber-50/60 px-5 py-4 sm:border-b-0 sm:border-r">
                  <p className="text-[0.5rem] font-bold uppercase tracking-[0.08em] text-amber-700/70">
                    {isTR ? "İnsan görür" : "Human sees"}
                  </p>
                </div>
                <div className="flex items-center bg-amber-50/30 px-5 py-4">
                  <p className="text-[0.875rem] italic text-ortaq-ink/60">&ldquo;{card.humanSees}&rdquo;</p>
                </div>
              </div>

              {/* Zone 3: WHAT ORTAQ UNDERSTANDS */}
              <div className="grid grid-cols-1 sm:grid-cols-[7rem_1fr]">
                <div className="flex items-start border-b border-ortaq-border bg-ortaq-trust/[0.06] px-5 py-4 sm:border-b-0 sm:border-r">
                  <p className="text-[0.5rem] font-bold uppercase tracking-[0.08em] text-ortaq-trust/70 pt-0.5">
                    {isTR ? "ORTAQ anlar" : "ORTAQ understands"}
                  </p>
                </div>
                <div className="bg-ortaq-trust/[0.03] px-5 py-4">
                  <div className="space-y-2">
                    {card.understands.map((line, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <span className="mt-[0.15rem] shrink-0 text-[0.5625rem] font-bold text-ortaq-trust">✓</span>
                        <p className="text-[0.8125rem] leading-relaxed text-ortaq-ink/80">{line}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Zone 4: WHAT ORTAQ RECOMMENDS */}
              <div className="grid grid-cols-1 sm:grid-cols-[7rem_1fr]">
                <div className="flex items-start border-b border-ortaq-border bg-ortaq-ink/[0.04] px-5 py-4 sm:border-b-0 sm:border-r">
                  <p className="text-[0.5rem] font-bold uppercase tracking-[0.08em] text-ortaq-ink/40 pt-0.5">
                    {isTR ? "ORTAQ önerir" : "ORTAQ recommends"}
                  </p>
                </div>
                <div className="bg-white px-5 py-4">
                  <div className="space-y-2.5">
                    {card.recommends.map((r, i) => (
                      <div key={i} className="flex items-baseline gap-3">
                        <span className="shrink-0 rounded-full border border-ortaq-border bg-[#faf9f7] px-2 py-0.5 text-[0.4375rem] font-bold text-ortaq-ink/50 whitespace-nowrap">
                          {r.timing}
                        </span>
                        <p className="text-[0.8125rem] font-medium text-ortaq-ink">{r.action}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <span className="text-[0.4375rem] font-bold uppercase tracking-[0.08em] text-ortaq-ink/30">
                      {isTR ? "Risk" : "Risk level"}
                    </span>
                    <span className={cn(
                      "rounded border px-2 py-0.5 text-[0.4375rem] font-bold",
                      RISK_STYLE[card.riskTier],
                    )}>
                      {card.riskLabel}
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* ── Bottom note ────────────────────────────────────────────── */}
          <p className="mt-6 text-[0.5625rem] leading-relaxed text-ortaq-ink/30 max-w-lg">
            {isTR
              ? "Bu çıktı, ORTAQ'ın aynı operasyondaki email, mesaj ve belgelerden çıkardığı bağımlılık zinciridir. Özetleme değil — operasyonel sonuç anlayışı."
              : "This output is the dependency chain ORTAQ extracts from emails, messages and documents across the same operation. Not summarisation — operational consequence understanding."}
          </p>

        </div>
      </Container>
    </section>
  );
}
