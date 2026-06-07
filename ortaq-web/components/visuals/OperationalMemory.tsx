"use client";

import { useTranslation } from "react-i18next";
import { Container } from "@/components/ui/Section";

const ITEMS_TR = [
  {
    label: "Hafıza",
    title: "Kimse \"en son bu konuda ne konuşmuştuk?\" diye sormak zorunda kalmaz.",
    body: "Email'ler silinir. WhatsApp mesajları kaybolur. Çalışanlar ayrılır. Bağlam kaybolur. ORTAQ her konuşmayı, her kararı operasyona bağlı tutar.",
  },
  {
    label: "Taahhüt",
    title: "Kim ne söyledi asla kaybolmaz.",
    body: "\"Cuma gönderilir.\" \"28'inde teslim.\" \"Revize fiyat kabul.\" Email'de de olsa, mesajda da, toplantıda da — fark etmez.",
  },
  {
    label: "Değişim",
    title: "Ne değişti görünür — siz fark etmeden önce.",
    body: "Başlangıçta kararlaştırılan ile bugünkü durum arasındaki mesafe sürekli izlenir. Tarih kayması, fiyat revizyonu, sorumluluk değişimi.",
  },
  {
    label: "Sıra",
    title: "Sıranın kimde olduğu her an nettir.",
    body: "Ekibiniz mi bekliyor, karşı taraf mı? Kaç gündür? Kim ne için bekliyor — karanlıkta kalmaz.",
  },
];

const ITEMS_EN = [
  {
    label: "Memory",
    title: "Nobody has to ask \"where did we land on this?\"",
    body: "Emails get deleted. WhatsApp messages disappear. People leave. Context disappears. ORTAQ holds every conversation and decision connected to the operation.",
  },
  {
    label: "Commitment",
    title: "Who promised what is never lost.",
    body: "\"Ships Friday.\" \"Delivery on the 28th.\" \"Revised price accepted.\" In email, in a message, in a meeting — it doesn't matter.",
  },
  {
    label: "Change",
    title: "What shifted is visible — before you notice it.",
    body: "The gap between what was initially agreed and current state is continuously tracked. Date drift, price revision, responsibility change.",
  },
  {
    label: "Queue",
    title: "Whose turn it is remains clear at every moment.",
    body: "Is it your team waiting, or the counterparty? How many days? Who is waiting for what — never left in the dark.",
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
                  ORTAQ operasyonu hatırlar.<br />
                  <span className="text-ortaq-trust">Ekibinizin hatırlaması gerekmez.</span>
                </>
              ) : (
                <>
                  ORTAQ remembers the operation.<br />
                  <span className="text-ortaq-trust">Your team doesn&apos;t have to.</span>
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
