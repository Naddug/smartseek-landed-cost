"use client";

import { useTranslation } from "react-i18next";
import { Container } from "@/components/ui/Section";

const QUESTIONS_TR = [
  { q: "Ne oldu?",             note: "Üç kişi aynı cevabı arıyor." },
  { q: "Ne değişti?",          note: "Değişiklik bir WhatsApp'ta kaldı." },
  { q: "Kim bekliyor?",        note: "Müşteri bekliyor. Kimse fark etmedi." },
  { q: "Risk ne?",             note: "Nedeni bir email'in içinde saklı." },
];

const QUESTIONS_EN = [
  { q: "What happened?",       note: "Three people are searching for the same answer." },
  { q: "What changed?",        note: "The change is buried in a WhatsApp message." },
  { q: "Who is waiting?",      note: "The customer is waiting. Nobody noticed." },
  { q: "What is at risk?",     note: "The reason is hidden inside an email." },
];

export function UniversalProblem() {
  const { i18n } = useTranslation();
  const isTR = (i18n.language ?? "tr").startsWith("tr");
  const questions = isTR ? QUESTIONS_TR : QUESTIONS_EN;

  return (
    <section className="border-b border-ortaq-border bg-ortaq-ink">
      <Container wide>
        <div className="py-16 sm:py-20">

          {/* Overline */}
          <p className="mb-10 text-[0.625rem] font-bold uppercase tracking-[0.1em] text-ortaq-cream/30">
            {isTR ? "Her gün, her operasyonda." : "Every day, every operation."}
          </p>

          {/* Large typographic questions — no cards */}
          <div className="divide-y divide-ortaq-cream/[0.07]">
            {questions.map((item, i) => (
              <div
                key={i}
                className="flex flex-col gap-1 py-5 sm:flex-row sm:items-baseline sm:gap-8 sm:py-6"
              >
                <p className="flex-1 text-[1.875rem] font-bold tracking-[-0.03em] text-ortaq-cream leading-tight sm:text-[2.25rem]">
                  {item.q}
                </p>
                <p className="shrink-0 text-[0.75rem] leading-snug text-ortaq-cream/30 sm:text-right sm:max-w-[16rem]">
                  {item.note}
                </p>
              </div>
            ))}
          </div>

          {/* Thin divider before pivot question */}
          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-ortaq-cream/[0.08]" />
          </div>

          {/* 5th question — pivot to ORTAQ */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:gap-8">
            <p className="flex-1 text-[1.875rem] font-bold tracking-[-0.03em] text-ortaq-trust leading-tight sm:text-[2.25rem]">
              {isTR ? "Şimdi ne yapmalıyız?" : "What should we do now?"}
            </p>
            <p className="shrink-0 text-[0.875rem] font-medium text-ortaq-trust/60 sm:text-right">
              {isTR ? "→ ORTAQ yanıtlar." : "→ ORTAQ answers."}
            </p>
          </div>

        </div>
      </Container>
    </section>
  );
}
