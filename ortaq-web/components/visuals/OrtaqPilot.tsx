"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { useTranslation } from "react-i18next";
import { Container } from "@/components/ui/Section";

interface QA {
  q: string;
  answers: string[];
  source: string;
}

const QA_TR: QA[] = [
  {
    q: "En büyük risk nedir?",
    answers: [
      "Onay süreci 3 gündür beklemede. Onay olmadan sonraki aşama başlayamıyor.",
      "Kritik tarihe 5 gün kaldı. Bugün aksiyon alınmazsa operasyon risk altına giriyor.",
      "Karşı taraf 2 gündür yanıt vermiyor — takip gerekiyor.",
    ],
    source: "4 email · 2 belge · toplantı notu",
  },
  {
    q: "Bu hafta ne değişti?",
    answers: [
      "Teslim tarihi 22 Haz'dan 25 Haz'a taşındı — sözlü mutabakat, henüz yazılı değil.",
      "Revize teklif alındı — henüz incelenmedi.",
      "Karşı taraf muayene son tarihinde uzatma talep etti.",
    ],
    source: "8–14 Haziran arası kayıtlar",
  },
  {
    q: "Kim bizden bekliyor?",
    answers: [
      "Karşı taraf: Revize teslimat tarihi onayı (3 gündür bekleniyor).",
      "Karşı taraf: Revize teklif yanıtı (2 gündür bekleniyor).",
      "Lojistik ekibi: Nihai paketleme listesi (20 Haz son tarihi).",
    ],
    source: "İletişim kaydı · taahhüt takibi",
  },
  {
    q: "Şimdi ne yapmalıyız?",
    answers: [
      "Revize teslimat tarihini (25 Haz) karşı tarafa yazılı olarak bildirin — bugün.",
      "Revize teklifi inceleyin ve yanıt verin.",
      "Sözleşmeyi güncelleyin — ödeme aşamasından önce 25 Haz teslimatını yansıtın.",
    ],
    source: "Risk motoru · taahhüt kaydı · bağımlılık zinciri",
  },
];

const QA_EN: QA[] = [
  {
    q: "What is the biggest risk?",
    answers: [
      "Approval has been pending for 3 days. Without approval, the next stage cannot begin.",
      "5 days to the critical deadline. If no action today, the operation enters risk.",
      "Counterparty has not responded for 2 days — follow-up required.",
    ],
    source: "4 emails · 2 documents · meeting note",
  },
  {
    q: "What changed this week?",
    answers: [
      "Delivery date moved from Jun 22 to Jun 25 — verbal agreement, not yet in writing.",
      "Revised proposal received — not yet reviewed.",
      "Counterparty requested extension on the inspection deadline.",
    ],
    source: "Records from June 8–14",
  },
  {
    q: "Who is waiting for us?",
    answers: [
      "Counterparty: Revised delivery date confirmation (waiting 3 days).",
      "Counterparty: Response on revised proposal (waiting 2 days).",
      "Logistics team: Final packing list (deadline Jun 20).",
    ],
    source: "Communication record · commitment tracking",
  },
  {
    q: "What should happen next?",
    answers: [
      "Notify counterparty of revised delivery date (Jun 25) in writing — today.",
      "Review and respond to the revised proposal.",
      "Update the contract — reflect Jun 25 delivery before the payment stage.",
    ],
    source: "Risk engine · commitment record · dependency chain",
  },
];

interface OrtaqPilotProps {
  variant?: "homepage" | "product";
}

export function OrtaqPilot({ variant = "homepage" }: OrtaqPilotProps) {
  const { i18n } = useTranslation();
  const isTR = (i18n.language ?? "tr").startsWith("tr");
  const qa = isTR ? QA_TR : QA_EN;
  const [activeIdx, setActiveIdx] = useState<number>(0);

  return (
    <section id="ortaq-pilot" className="border-b border-ortaq-border bg-ortaq-ink">
      <Container wide>
        <div className="py-14 sm:py-18">

          {/* Header */}
          <div className="mb-10">
            <p className="text-[0.625rem] font-bold uppercase tracking-[0.1em] text-ortaq-trust/70">
              ORTAQ Pilot
            </p>
            <h2 className="mt-2 text-[1.5rem] font-bold tracking-[-0.03em] text-ortaq-cream leading-[1.15] sm:text-[1.875rem]">
              {isTR ? (
                <>
                  ORTAQ&apos;a sor.<br />
                  <span className="text-ortaq-trust">Cevap zaten hazır.</span>
                </>
              ) : (
                <>
                  Ask ORTAQ.<br />
                  <span className="text-ortaq-trust">The answer is already there.</span>
                </>
              )}
            </h2>
            <p className="mt-3 max-w-xl text-[0.9375rem] leading-relaxed text-ortaq-cream/55">
              {isTR
                ? "ORTAQ, operasyonunuzla ilgili her email'i, belgeyi ve görüşmeyi okudu. Bağlamı siz vermenize gerek yok — ORTAQ zaten bağlamın kendisi."
                : "ORTAQ has read every email, document, and conversation about your operation. You don't need to provide context — ORTAQ already is the context."}
            </p>
          </div>

          {/* Fake input */}
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-ortaq-cream/15 bg-ortaq-cream/5 px-5 py-4">
            <span className="shrink-0 text-[0.5rem] font-bold uppercase tracking-[0.08em] text-ortaq-trust/60">
              {isTR ? "ORTAQ'a sor" : "Ask ORTAQ"}
            </span>
            <div className="h-4 w-px shrink-0 bg-ortaq-cream/20" />
            <p className="text-[0.875rem] italic text-ortaq-cream/30">
              {isTR
                ? "Operasyonunuz hakkında bir soru sorun..."
                : "Ask a question about your operation..."}
            </p>
          </div>

          {/* Question pills */}
          <div className="mb-6 flex flex-wrap gap-2">
            {qa.map((item, i) => (
              <button
                key={i}
                onClick={() => setActiveIdx(i)}
                className={cn(
                  "rounded-full border px-4 py-2 text-[0.8125rem] font-medium transition-all",
                  activeIdx === i
                    ? "border-ortaq-trust bg-ortaq-trust/15 text-ortaq-trust"
                    : "border-ortaq-cream/20 bg-transparent text-ortaq-cream/55 hover:border-ortaq-cream/40 hover:text-ortaq-cream/80",
                )}
              >
                {item.q}
              </button>
            ))}
          </div>

          {/* Answer area */}
          <div className="overflow-hidden rounded-2xl border border-ortaq-trust/25 bg-ortaq-trust/[0.05]">
            <div className="flex items-center gap-3 border-b border-ortaq-trust/20 px-6 py-3">
              <span className="inline-block h-2 w-2 rounded-full bg-ortaq-trust/60" />
              <p className="text-[0.5rem] font-bold uppercase tracking-[0.1em] text-ortaq-trust/60">
                {isTR ? "ORTAQ yanıtı" : "ORTAQ answer"}
              </p>
            </div>
            <div className="px-6 py-5">
              <div className="space-y-3">
                {qa[activeIdx].answers.map((line, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="mt-[0.15rem] flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ortaq-trust/20 text-[0.4375rem] font-bold text-ortaq-trust">
                      {i + 1}
                    </span>
                    <p className="text-[0.875rem] leading-relaxed text-ortaq-cream/85">{line}</p>
                  </div>
                ))}
              </div>
              <div className="mt-5 border-t border-ortaq-cream/[0.07] pt-4">
                <p className="text-[0.5rem] text-ortaq-cream/30">
                  {isTR ? "Kaynak: " : "Source: "}
                  <span className="italic">{qa[activeIdx].source}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <p className="mt-5 max-w-lg text-[0.5625rem] leading-relaxed text-ortaq-cream/30">
            {isTR
              ? "Bu yanıtlar, ORTAQ'ın operasyonunuzla ilgili tüm iletişimi okumasıyla oluşur. Bağlamı siz eklemek zorunda değilsiniz. Pilot şu an konsept aşamasındadır — yakında kullanıma açılıyor."
              : "These answers are formed from ORTAQ reading all communications about your operation. You don't need to add context. Pilot is currently in concept phase — coming soon."}
          </p>

          {variant === "homepage" && (
            <div className="mt-8">
              <Link
                href="/demo"
                className="inline-flex min-h-11 items-center justify-center rounded-lg bg-ortaq-trust px-7 text-[0.9375rem] font-bold text-white shadow-sm transition-all hover:bg-ortaq-trust-deep active:scale-[0.98]"
              >
                {isTR ? "Kendi operasyonunuzda görün →" : "See it on your own operation →"}
              </Link>
            </div>
          )}

        </div>
      </Container>
    </section>
  );
}
