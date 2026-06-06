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
    ? { name: "Çelik Tedariki", amount: "€840.000", buyer: "Alman alıcı", seller: "Türk üretici" }
    : { name: "Steel Supply",   amount: "€840,000", buyer: "German buyer", seller: "Turkish producer" };

  const qas: QA[] = isTR ? [
    {
      q: "SGS geldi mi?",
      qSub: "Muayene raporu onaylandı mı?",
      status: "waiting",
      statusLabel: "Bekleniyor",
      answer: "TÜV Thailand · alıcı tarafta",
      answerSub: "Muayene talebi gönderildi. Alıcı onayı bekleniyor. Tahmini tarih: Pazartesi.",
      who: "Alıcı sorumlu",
    },
    {
      q: "Ödeme çıktı mı?",
      qSub: "Akreditif açıldı mı?",
      status: "active",
      statusLabel: "Hazırlanıyor",
      answer: "HSBC Dubai · LC açılıyor",
      answerSub: "SGS onayı alındıktan sonra LC açılacak. Banka 2 iş günü belirtiyor.",
      who: "Banka sürecinde",
    },
    {
      q: "Sıra kimde?",
      qSub: "Şu an kim ne yapmalı?",
      status: "waiting",
      statusLabel: "Aksiyon gerekli",
      answer: "Alıcı taraf · SGS onayı",
      answerSub: "Sevkiyat için SGS raporu onaylanmayı bekliyor. Gemi 28 Haziran'da kalkıyor.",
      who: "Alıcı sorumlu",
    },
  ] : [
    {
      q: "Has SGS arrived?",
      qSub: "Has the inspection report been approved?",
      status: "waiting",
      statusLabel: "Pending",
      answer: "TÜV Thailand · at buyer side",
      answerSub: "Inspection request sent. Awaiting buyer approval. Estimated: Monday.",
      who: "Buyer responsible",
    },
    {
      q: "Has payment gone out?",
      qSub: "Has the letter of credit been opened?",
      status: "active",
      statusLabel: "In Progress",
      answer: "HSBC Dubai · LC being opened",
      answerSub: "LC will be opened after SGS approval. Bank indicates 2 business days.",
      who: "In bank process",
    },
    {
      q: "Whose turn is it?",
      qSub: "Who needs to act right now?",
      status: "waiting",
      statusLabel: "Action Required",
      answer: "Buyer side · SGS approval",
      answerSub: "SGS report awaiting approval before shipment. Vessel departs June 28.",
      who: "Buyer responsible",
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
            ? "Bu sorular WhatsApp, e-posta ve telefon arasında değil — ORTAQ kaydında yanıtlanıyor."
            : "These questions are not answered across WhatsApp, email and phone — they are answered in the ORTAQ record."}
        </p>
      </div>

    </div>
  );
}
