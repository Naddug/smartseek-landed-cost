"use client";

import { useTranslation } from "react-i18next";
import { cn } from "@/lib/cn";

/**
 * RealExample — Section 2
 *
 * ONE real transaction. THREE questions. THREE instant answers.
 * The visitor immediately understands the value without reading a paragraph.
 *
 * Design: two-column card.
 *   Left:  the question (what every exporter asks every morning)
 *   Right: the ORTAQ answer (status, who, when — immediately)
 *
 * No fictional company names. No BestBuild.
 * Trade terms: SGS, BL, LC, sözleşme, sevkiyat, ödeme.
 */

interface QA {
  q: string;
  qSub: string;
  status: "waiting" | "active" | "done";
  statusLabel: string;
  answer: string;
  answerSub: string;
  who: string;
}

export function RealExample() {
  const { i18n } = useTranslation();
  const isTR = (i18n.language ?? "tr").startsWith("tr");

  const deal = isTR
    ? { name: "Tekstil Sevkiyatı", amount: "€340.000", buyer: "Alman alıcı", seller: "Türk üretici" }
    : { name: "Textile Shipment",  amount: "€340,000", buyer: "German buyer", seller: "Turkish producer" };

  const qas: QA[] = isTR ? [
    {
      q: "Son durum ne?",
      qSub: "İşlem hangi aşamada, sırada ne var?",
      status: "done",
      statusLabel: "Muayene tamamlandı",
      answer: "Sözleşme imzalı · Muayene onaylı · Sevkiyat 15 Tem.",
      answerSub: "Packing list hazır. BL taslağı taşıyıcıya gönderildi. Gemi kalkış onayı bekleniyor.",
      who: "Taşıyıcı taraf",
    },
    {
      q: "Ödeme çıktı mı?",
      qSub: "Akreditif onaylandı mı, ödeme ne zaman?",
      status: "active",
      statusLabel: "LC işlemde",
      answer: "Frankfurt Handelsbank · LC İşlemde",
      answerSub: "Muayene onayı alındıktan sonra LC açıldı. Belge eşleştirmesi tamamlanınca ödeme çıkacak.",
      who: "Banka sürecinde",
    },
    {
      q: "Sıra kimde?",
      qSub: "Şu an kim ne yapmalı?",
      status: "waiting",
      statusLabel: "Bizim tarafımızda",
      answer: "BL onayı · kargo taşıyıcısı",
      answerSub: "BL taslağı taşıyıcıdan onay bekliyor. Alıcı bu aşamada bizi bekliyor.",
      who: "Taşıyıcı bekleniyor",
    },
  ] : [
    {
      q: "What is the latest status?",
      qSub: "Which stage, what comes next?",
      status: "done",
      statusLabel: "Inspection complete",
      answer: "Contract signed · Inspection approved · Shipment Jul 15",
      answerSub: "Packing list ready. BL draft sent to carrier. Awaiting vessel departure confirmation.",
      who: "Carrier side",
    },
    {
      q: "Has payment gone out?",
      qSub: "Has the letter of credit been opened?",
      status: "active",
      statusLabel: "LC in process",
      answer: "Frankfurt Handelsbank · LC Open",
      answerSub: "LC opened after inspection approval. Payment releases once document matching completes.",
      who: "In bank process",
    },
    {
      q: "Whose turn is it?",
      qSub: "Who needs to act right now?",
      status: "waiting",
      statusLabel: "Our side",
      answer: "BL approval · cargo carrier",
      answerSub: "BL draft awaiting carrier approval. Buyer is waiting for our confirmation at this stage.",
      who: "Carrier pending",
    },
  ];

  const statusStyles = {
    waiting: { dot: "bg-amber-400", badge: "bg-amber-100 text-amber-700" },
    active:  { dot: "bg-blue-400",  badge: "bg-blue-100  text-blue-700"  },
    done:    { dot: "bg-emerald-400",badge: "bg-emerald-100 text-emerald-700" },
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-ortaq-border bg-white shadow-sm">

      {/* Deal header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ortaq-border bg-ortaq-surface px-5 py-4">
        <div>
          <p className="text-[0.5rem] font-bold uppercase tracking-[0.09em] text-ortaq-ink-soft">
            {isTR ? "Aktif İşlem" : "Active Deal"}
          </p>
          <p className="mt-0.5 text-[0.9375rem] font-bold text-ortaq-ink">{deal.name} · {deal.amount}</p>
          <p className="text-[0.5rem] text-ortaq-ink-soft">{deal.seller} → {deal.buyer}</p>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
          <span className="text-[0.5rem] font-bold text-emerald-600">
            {isTR ? "Canlı kayıt" : "Live record"}
          </span>
        </div>
      </div>

      {/* Q&A rows */}
      <div className="divide-y divide-ortaq-border">
        {qas.map((qa, i) => {
          const s = statusStyles[qa.status];
          return (
            <div key={i} className="grid grid-cols-1 sm:grid-cols-2">

              {/* Left — the question */}
              <div className="border-b border-ortaq-border/60 bg-[#FDFAF9] px-5 py-4 sm:border-b-0 sm:border-r">
                <p className="text-[1rem] font-bold text-ortaq-ink">{qa.q}</p>
                <p className="mt-0.5 text-[0.5375rem] text-ortaq-ink-soft">{qa.qSub}</p>
              </div>

              {/* Right — the ORTAQ answer */}
              <div className="flex items-start gap-3 bg-white px-5 py-4">
                <div className="mt-1 shrink-0">
                  <span className={cn("h-2 w-2 rounded-full block", s.dot)} />
                </div>
                <div className="min-w-0">
                  <div className="mb-1 flex flex-wrap items-center gap-1.5">
                    <span className={cn("rounded-full px-2 py-0.5 text-[0.4375rem] font-bold", s.badge)}>
                      {qa.statusLabel}
                    </span>
                  </div>
                  <p className="text-[0.875rem] font-bold text-ortaq-ink">{qa.answer}</p>
                  <p className="mt-0.5 text-[0.5rem] leading-relaxed text-ortaq-ink-soft">{qa.answerSub}</p>
                  <p className="mt-1.5 text-[0.4375rem] font-semibold text-ortaq-trust">{qa.who}</p>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Footer — the payoff */}
      <div className="border-t border-ortaq-border bg-ortaq-trust/[0.04] px-5 py-3">
        <p className="text-[0.5375rem] text-ortaq-ink-soft">
          {isTR
            ? "Bu üç soruyu cevaplamak için kimseyi aramadınız, e-posta karıştırmadınız. Cevap kayıtta hazırdı."
            : "You did not call anyone or search through emails to answer these three questions. The answers were already in the record."}
        </p>
      </div>

    </div>
  );
}
