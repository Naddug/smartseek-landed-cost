import { AppContainer } from "@/components/shared/AppContainer";

const ownerSignals = [
  "Ürün, lokasyon, müşteri tabanı veya üretim kapasitesi mevcut",
  "İlerleme operatör, teknik tamamlama veya büyüme ortağı eksikliğinde durdu",
  "Ortak ayrılığı, operasyon tıkanması veya satış kanalı yokluğu",
  "Varlık var; eksik parça doğru ortak türü",
];

const partnerSignals = [
  "Sıfırdan kurmak yerine yapılandırılmış fırsata katılmak istiyor",
  "Sermaye, operasyon, teknik, büyüme veya sektör gücü getiriyor",
  "Dosyada varlık, eksik ve aranan ortak net tanımlı",
  "Gerçek iş fırsatına katkı sağlayacak kapasite arıyor",
];

function OwnerPanel() {
  return (
    <div className="relative overflow-hidden rounded-xl border border-ortaq-line bg-[#FAFBFD]">
      <div className="absolute inset-y-0 left-0 w-1 bg-ortaq-action" aria-hidden />
      <div className="border-b border-ortaq-line/80 bg-white px-6 py-4 md:px-8">
        <p className="type-eyebrow">Fırsat sahibi</p>
        <h3 className="mt-1.5 font-heading text-xl font-semibold tracking-[-0.02em] text-ortaq-navy md:text-[1.35rem]">
          Varlık var, ilerleme durdu
        </h3>
      </div>
      <div className="px-6 py-6 md:px-8 md:py-7">
        <p className="text-sm leading-relaxed text-ortaq-text-muted">
          Gerçek bir iş fırsatı, ürün, lokasyon veya operasyon elinizde — ancak
          tek başınıza ilerleyemiyorsunuz.
        </p>
        <ul className="mt-5 space-y-0 border-t border-ortaq-line">
          {ownerSignals.map((item) => (
            <li
              key={item}
              className="border-b border-ortaq-line/70 py-3 text-sm leading-snug text-ortaq-navy/80 last:border-b-0"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function PartnerPanel() {
  return (
    <div className="relative overflow-hidden rounded-xl border border-ortaq-navy/80 bg-ortaq-navy shadow-[0_16px_48px_-20px_rgba(20,33,61,0.5)]">
      <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-ortaq-action/25 blur-3xl" aria-hidden />
      <div className="relative border-b border-white/10 bg-white/[0.04] px-6 py-4 md:px-8">
        <p className="type-eyebrow text-ortaq-accent/90">Ortak tarafı</p>
        <h3 className="mt-1.5 font-heading text-xl font-semibold tracking-[-0.02em] text-white md:text-[1.35rem]">
          Hazır fırsata katkı sağla
        </h3>
      </div>
      <div className="relative px-6 py-6 md:px-8 md:py-7">
        <p className="text-sm leading-relaxed text-white/60">
          Sıfırdan başlamak değil — varlığı olan, eksik parçası tanımlı bir
          fırsata ortak olmak.
        </p>
        <ul className="mt-5 space-y-0 border-t border-white/10">
          {partnerSignals.map((item) => (
            <li
              key={item}
              className="border-b border-white/[0.08] py-3 text-sm leading-snug text-white/82 last:border-b-0"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function DualAudience() {
  return (
    <section className="border-b border-ortaq-line bg-white py-20 md:py-24">
      <AppContainer>
        <div className="mb-12 max-w-2xl">
          <p className="type-eyebrow">Kimler için</p>
          <h2 className="type-section mt-3">İki taraf, tek dosya mantığı</h2>
          <p className="mt-3 text-base leading-relaxed text-ortaq-text-muted">
            ORTAQ, gerçek varlığı olan fırsat sahipleri ile sermaye, operasyon,
            teknik, büyüme, sektör veya üretim gücü getiren ortakları aynı
            yapılandırılmış dosya üzerinden buluşturur.
          </p>
        </div>
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
          <OwnerPanel />
          <PartnerPanel />
        </div>
      </AppContainer>
    </section>
  );
}
