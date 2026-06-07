"use client";

import { useTranslation } from "react-i18next";
import { Container } from "@/components/ui/Section";

const QUESTIONS_TR = [
  { q: "Ne oldu?",             note: "Son baktığından bu yana operasyonda ne değişti?" },
  { q: "Ne değişti?",          note: "Kararlaştırılan ile şu anki durum arasında ne fark var?" },
  { q: "Kim bekliyor?",        note: "Ekip mi, karşı taraf mı, banka mı — hangi taraf sıraya girdi?" },
  { q: "Risk ne?",             note: "Bugün aksiyon alınmazsa bu operasyona ne olur?" },
  { q: "Şimdi ne yapmalıyız?", note: "Sıradaki doğru adım nedir ve kimin sorumluluğunda?" },
];

const QUESTIONS_EN = [
  { q: "What happened?",        note: "What changed in the operation since you last checked?" },
  { q: "What changed?",         note: "What is different between what was agreed and current state?" },
  { q: "Who is waiting?",       note: "Your team, the counterparty, or the bank — whose queue is it?" },
  { q: "What is at risk?",      note: "What happens to this operation if no action is taken today?" },
  { q: "What should we do?",    note: "What is the next right action, and who owns it?" },
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
                ? "Her gün aynı sorular yeniden soruluyor."
                : "The same questions are asked again every day."}
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-[0.9375rem] leading-relaxed text-ortaq-cream/55">
              {isTR
                ? "Bu sorulara cevap bulmak için her seferinde yeniden başlamak zorunda kalıyorsunuz. Email'leri tarıyorsunuz, birisini arıyorsunuz, bir yerlerde yazan bir şeyi hatırlamaya çalışıyorsunuz."
                : "You have to start from scratch every time to answer these questions. You search through emails, call someone, try to remember something written somewhere."}
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
                ? "Bu soruların cevapları zaten mevcut — dağınık ama mevcut. Kimse onları bir araya getirmiyor."
                : "The answers to these questions already exist — scattered but present. Nobody is pulling them together."}
            </p>
          </div>

        </div>
      </Container>
    </section>
  );
}
