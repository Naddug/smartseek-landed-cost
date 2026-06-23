import { ReadinessRing } from "@/components/shared/ReadinessRing";

const factors = [
  { label: "Mevcut varlıklar", weight: "Varlık netliği" },
  { label: "Net bloker", weight: "Engel tanımı" },
  { label: "Aranan ortak tipi", weight: "Eşleşme hedefi" },
  { label: "Karşılık modeli", weight: "Beklenti netliği" },
  { label: "Kanıt / doğrulama", weight: "Doğrulanabilirlik" },
];

export function ReadinessScoreExplainer() {
  return (
    <div className="grid gap-8 lg:grid-cols-[auto_1fr] lg:items-start">
      <div className="flex flex-col items-center rounded-xl border border-ortaq-line bg-ortaq-surface p-8">
        <ReadinessRing score={72} size={88} strokeWidth={6} />
        <p className="mt-4 text-center text-sm font-medium text-ortaq-navy">
          Örnek hazırlık skoru
        </p>
        <p className="mt-1 max-w-[180px] text-center text-xs text-ortaq-text-muted">
          Dosyanın ne kadar net ve eşleşmeye hazır olduğunu gösterir.
        </p>
      </div>
      <div className="space-y-3">
        {factors.map((factor) => (
          <div
            key={factor.label}
            className="flex items-center justify-between rounded-lg border border-ortaq-line bg-ortaq-surface px-4 py-3"
          >
            <span className="text-sm font-medium text-ortaq-navy">
              {factor.label}
            </span>
            <span className="text-xs text-ortaq-text-muted">{factor.weight}</span>
          </div>
        ))}
        <p className="pt-2 text-sm leading-relaxed text-ortaq-text-muted">
          Skor, dosyanın eksiklerini göstermek için kullanılır — yüksek skor
          otomatik onay anlamına gelmez. Moderasyon her dosyayı ayrıca inceler.
        </p>
      </div>
    </div>
  );
}
