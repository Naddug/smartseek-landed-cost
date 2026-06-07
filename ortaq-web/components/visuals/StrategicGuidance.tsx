"use client";

import { useTranslation } from "react-i18next";
import { Container } from "@/components/ui/Section";

const SCENARIOS_TR = [
  {
    situation: "Karşı taraf 6 gündür yanıt vermiyor.",
    riskLabel: "İletişim riski",
    riskLevel: "Orta",
    guidance: [
      "Son email'in takibini yapın — doğrudan bir soru ile.",
      "Yanıt gelmezse alternatif iletişim kanalını deneyin.",
      "Son iletişim tarihini ve içeriğini kayıt altına alın.",
    ],
  },
  {
    situation: "Sözleşme revizyonu 10 gündür çözüme kavuşmadı.",
    riskLabel: "Belge riski",
    riskLevel: "Yüksek",
    guidance: [
      "Revizyon sahibini ve son tarihi netleştirin.",
      "Karşılıklı anlaşılan değişiklikleri yazılı hale getirin.",
      "Ödeme aşaması bu adım tamamlanmadan başlamamalı.",
    ],
  },
  {
    situation: "Muayene son tarihi yaklaşıyor — henüz onay yok.",
    riskLabel: "Zamanlama riski",
    riskLevel: "Kritik",
    guidance: [
      "Muayene talebini bugün netleştirin — sorumlu tarafı belirleyin.",
      "Onay olmadan sevkiyat başlayamaz — ödeme takvimi etkilenir.",
      "3 gün içinde aksiyon alınmazsa operasyonu yeniden takvimleyin.",
    ],
  },
];

const SCENARIOS_EN = [
  {
    situation: "Counterparty has not responded for 6 days.",
    riskLabel: "Communication risk",
    riskLevel: "Medium",
    guidance: [
      "Follow up on the last email — with a direct question.",
      "If no response, try an alternative contact channel.",
      "Record the last communication date and content.",
    ],
  },
  {
    situation: "Contract revision has been unresolved for 10 days.",
    riskLabel: "Document risk",
    riskLevel: "High",
    guidance: [
      "Clarify the revision owner and the deadline.",
      "Put mutually agreed changes in writing.",
      "Payment stage should not begin until this step is complete.",
    ],
  },
  {
    situation: "Inspection deadline approaching — no approval yet.",
    riskLabel: "Timeline risk",
    riskLevel: "Critical",
    guidance: [
      "Clarify the inspection request today — identify the responsible party.",
      "Without approval, shipment cannot proceed — payment timeline affected.",
      "If no action in 3 days, reschedule the operation.",
    ],
  },
];

const RISK_COLOR: Record<string, string> = {
  Orta:    "bg-amber-50 text-amber-700 border-amber-200",
  Yüksek:  "bg-orange-50 text-orange-700 border-orange-200",
  Kritik:  "bg-red-50 text-red-700 border-red-200",
  Medium:  "bg-amber-50 text-amber-700 border-amber-200",
  High:    "bg-orange-50 text-orange-700 border-orange-200",
  Critical: "bg-red-50 text-red-700 border-red-200",
};

export function StrategicGuidance() {
  const { i18n } = useTranslation();
  const isTR = (i18n.language ?? "tr").startsWith("tr");
  const scenarios = isTR ? SCENARIOS_TR : SCENARIOS_EN;

  return (
    <section className="border-b border-ortaq-border bg-white">
      <Container wide>
        <div className="py-14 sm:py-18">

          <div className="mb-10">
            <p className="text-[0.625rem] font-bold uppercase tracking-[0.1em] text-ortaq-ink/40">
              {isTR ? "Stratejik Rehberlik" : "Strategic Guidance"}
            </p>
            <h2 className="mt-2 text-[1.5rem] font-bold tracking-[-0.03em] text-ortaq-ink leading-[1.15] sm:text-[1.875rem]">
              {isTR ? (
                <>
                  Riski bulmak yetmez.<br />
                  <span className="text-ortaq-trust">Çözüm yolunu görmek daha önemli.</span>
                </>
              ) : (
                <>
                  Finding the risk is not enough.<br />
                  <span className="text-ortaq-trust">Seeing the path to resolution matters more.</span>
                </>
              )}
            </h2>
            <p className="mt-3 max-w-xl text-[0.9375rem] leading-relaxed text-ortaq-ink-muted">
              {isTR
                ? "ORTAQ sadece 'işte risk' demiyor. Ekibinizin doğru bilgiyle daha hızlı karar vermesine yardımcı oluyor."
                : "ORTAQ doesn't just say 'here is the risk.' It helps your team decide faster with the right information."}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {scenarios.map((s, i) => (
              <div
                key={i}
                className="flex flex-col gap-4 rounded-xl border border-ortaq-border bg-[#faf9f7] px-5 py-5"
              >
                <div>
                  <p className="text-[0.4375rem] font-bold uppercase tracking-[0.08em] text-ortaq-ink/40 mb-1.5">
                    {isTR ? "Durum" : "Situation"}
                  </p>
                  <p className="text-[0.875rem] font-bold text-ortaq-ink leading-snug">{s.situation}</p>
                </div>

                <span className={`inline-block self-start rounded border px-2 py-0.5 text-[0.4375rem] font-bold ${RISK_COLOR[s.riskLevel] ?? ""}`}>
                  {s.riskLabel} · {s.riskLevel}
                </span>

                <div className="border-t border-ortaq-border pt-4">
                  <p className="text-[0.4375rem] font-bold uppercase tracking-[0.08em] text-ortaq-trust mb-2">
                    {isTR ? "ORTAQ'ın önerisi" : "ORTAQ suggests"}
                  </p>
                  <div className="space-y-1.5">
                    {s.guidance.map((line, j) => (
                      <div key={j} className="flex items-start gap-2">
                        <span className="mt-[0.2rem] shrink-0 text-[0.5rem] text-ortaq-trust">→</span>
                        <p className="text-[0.5625rem] leading-relaxed text-ortaq-ink-muted">{line}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Honest disclaimer */}
          <div className="mt-8 rounded-xl border border-ortaq-border bg-[#faf9f7] px-5 py-4">
            <p className="text-[0.5625rem] leading-relaxed text-ortaq-ink-muted">
              <span className="font-bold text-ortaq-ink">
                {isTR
                  ? "Bu rehberlik, özerk karar alma değil. "
                  : "This is guidance, not autonomous decision making. "}
              </span>
              {isTR
                ? "ORTAQ ekibinizin doğru bilgiye sahip olarak daha hızlı karar vermesine yardımcı olur. Son kararı her zaman siz verirsiniz. Sistem hiçbir zaman sizin adınıza aksiyon almaz."
                : "ORTAQ helps your team decide faster by having the right information available. You always make the final decision. The system never takes action on your behalf."}
            </p>
          </div>

        </div>
      </Container>
    </section>
  );
}
