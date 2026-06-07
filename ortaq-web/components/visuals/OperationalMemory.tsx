"use client";

import { useTranslation } from "react-i18next";
import { Container } from "@/components/ui/Section";

const ITEMS_TR = [
  {
    label: "Ne oldu",
    title: "Hafıza kaybetmez.",
    body: "Email'ler silinir. WhatsApp mesajları kaybolur. Çalışanlar ayrılır. ORTAQ tüm operasyonel geçmişi — hangi kanaldan geldiğinden bağımsız — tutar.",
  },
  {
    label: "Ne kararlaştırıldı",
    title: "Her taahhüt kayıt altında.",
    body: "\"Cuma gönderim onaylandı.\" \"25 Haziran teslim.\" \"Revize fiyat kabul edildi.\" Email'de, mesajda veya toplantıda söylendi — ORTAQ hepsini taahhüt olarak kaydeder.",
  },
  {
    label: "Ne değişti",
    title: "Orijinalden sapma görünür.",
    body: "Başlangıçta kararlaştırılan ile bugünkü durum arasındaki fark sürekli izlenir. Tarih kaydı, fiyat revizyonu, sorumluluk değişikliği — ORTAQ bilir.",
  },
  {
    label: "Kim bekliyor",
    title: "Sorumluluk takip edilir.",
    body: "Sıra ekibinizde mi, karşı tarafta mı? Kaç gündür bekleniyor? Her an kimin ne beklediği ve ne zamandır beklediği kayıt altındadır.",
  },
];

const ITEMS_EN = [
  {
    label: "What happened",
    title: "Memory doesn't forget.",
    body: "Emails get deleted. WhatsApp messages disappear. People leave. ORTAQ maintains the complete operational history, regardless of which channel it came from.",
  },
  {
    label: "What was agreed",
    title: "Every commitment on record.",
    body: "\"Approval confirmed Friday.\" \"Delivery June 25.\" \"Revised price accepted.\" Said in email, message, or a meeting — ORTAQ records it as a commitment.",
  },
  {
    label: "What changed",
    title: "Drift from the original is visible.",
    body: "The gap between what was initially agreed and current state is continuously tracked. Date change, price revision, responsibility shift — ORTAQ knows.",
  },
  {
    label: "Who is waiting",
    title: "Responsibility is tracked.",
    body: "Is the queue with your team or the counterparty? How many days? At every moment, who is waiting for what and since when — on record.",
  },
];

export function OperationalMemory() {
  const { i18n } = useTranslation();
  const isTR = (i18n.language ?? "tr").startsWith("tr");
  const items = isTR ? ITEMS_TR : ITEMS_EN;

  return (
    <section className="border-b border-ortaq-border bg-[#faf9f7]">
      <Container wide>
        <div className="py-14 sm:py-18">

          <div className="mb-10">
            <p className="text-[0.625rem] font-bold uppercase tracking-[0.1em] text-ortaq-ink/40">
              {isTR ? "Operasyonel Hafıza" : "Operational Memory"}
            </p>
            <h2 className="mt-2 text-[1.5rem] font-bold tracking-[-0.03em] text-ortaq-ink leading-[1.15] sm:text-[1.875rem]">
              {isTR ? (
                <>
                  ORTAQ unutmaz.<br />
                  <span className="text-ortaq-trust">Ekibinizin hatırlaması gerekmez.</span>
                </>
              ) : (
                <>
                  ORTAQ doesn&apos;t forget.<br />
                  <span className="text-ortaq-trust">Your team doesn&apos;t have to remember.</span>
                </>
              )}
            </h2>
            <p className="mt-3 max-w-xl text-[0.9375rem] leading-relaxed text-ortaq-ink-muted">
              {isTR
                ? "Operasyonel bilgi doğası gereği dağınıktır. Email, mesaj, toplantı, belge — hiçbiri diğeriyle konuşmaz. ORTAQ hepsini okur ve her operasyon için ayrı bir hafıza oluşturur."
                : "Operational information is inherently scattered. Email, message, meeting, document — none of them talk to each other. ORTAQ reads all of it and builds a separate memory for each operation."}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((item) => (
              <div
                key={item.label}
                className="flex flex-col gap-3 rounded-xl border border-ortaq-border bg-white px-5 py-5"
              >
                <p className="text-[0.5rem] font-bold uppercase tracking-[0.08em] text-ortaq-trust">
                  {item.label}
                </p>
                <p className="text-[0.9375rem] font-bold text-ortaq-ink leading-snug">
                  {item.title}
                </p>
                <p className="text-[0.625rem] leading-relaxed text-ortaq-ink-muted">
                  {item.body}
                </p>
              </div>
            ))}
          </div>

        </div>
      </Container>
    </section>
  );
}
