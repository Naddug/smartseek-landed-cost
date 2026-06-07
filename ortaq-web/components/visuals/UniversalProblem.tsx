"use client";

import { useTranslation } from "react-i18next";
import { Container } from "@/components/ui/Section";

const QUESTIONS_TR = [
  { q: "Ne oldu?",             note: "Üç kişi aynı cevabı arıyor. Kimse birbirini aramadan aramadı." },
  { q: "Ne değişti?",          note: "Müşteri orijinal takvimi bekliyor. Değişiklik bir WhatsApp'ta kaldı." },
  { q: "Kim bekliyor?",        note: "Müşteri bekliyor. Kimse fark etmedi." },
  { q: "Risk ne?",             note: "Sevkiyat gecikti. Nedeni bir email'in içinde saklı." },
  { q: "Şimdi ne yapmalıyız?", note: "Karar telefonda verildi. Kimse yazmadı." },
];

const QUESTIONS_EN = [
  { q: "What happened?",        note: "Three people are searching for the same answer. Nobody checked with each other first." },
  { q: "What changed?",         note: "The customer is still expecting the original timeline. The change is buried in a WhatsApp message." },
  { q: "Who is waiting?",       note: "The customer is waiting. Nobody realized it." },
  { q: "What is at risk?",      note: "The shipment is delayed. The reason is hidden in an email." },
  { q: "What should we do?",    note: "The decision was made on a call. Nobody wrote it down." },
];

export function UniversalProblem() {
  const { i18n } = useTranslation();
  const isTR = (i18n.language ?? "tr").startsWith("tr");
  const questions = isTR ? QUESTIONS_TR : QUESTIONS_EN;

  return (
    <section className="border-b border-ortaq-border bg-ortaq-ink">
      <Container wide>
        <div className="py-14 sm:py-18">

          <div className="mb-10 text-center">
            <p className="text-[0.625rem] font-bold uppercase tracking-[0.1em] text-ortaq-cream/40">
              {isTR ? "Tanıdık mı?" : "Does this sound familiar?"}
            </p>
            <h2 className="mt-2 text-[1.5rem] font-bold tracking-[-0.03em] text-ortaq-cream leading-[1.15] sm:text-[1.875rem]">
              {isTR
                ? "Her gün, her operasyonda, her takımda."
                : "Every day, every operation, every team."}
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-[0.9375rem] leading-relaxed text-ortaq-cream/55">
              {isTR
                ? "Bu anlar küçük görünür. Ama bir araya geldiklerinde işin büyük kısmını yiyorlar: aramalar, aramalar, ve yeniden aramalar."
                : "These moments seem small. Together they consume most of the working day: searching, asking, and searching again."}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-5">
            {questions.map((item, i) => (
              <div
                key={i}
                className="flex flex-col gap-3 rounded-xl border border-ortaq-cream/10 bg-ortaq-cream/[0.04] px-5 py-6"
              >
                <p className="text-[1.25rem] font-bold tracking-[-0.02em] text-ortaq-cream leading-tight">
                  {item.q}
                </p>
                <p className="text-[0.625rem] leading-relaxed text-ortaq-cream/45">
                  {item.note}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="text-[0.875rem] text-ortaq-cream/45">
              {isTR
                ? "Cevaplar zaten var. Bir email'de, bir mesajda, bir belgede. Kimse onları bir araya getirmiyor."
                : "The answers already exist. In an email, a message, a document. Nobody is pulling them together."}
            </p>
          </div>

        </div>
      </Container>
    </section>
  );
}
