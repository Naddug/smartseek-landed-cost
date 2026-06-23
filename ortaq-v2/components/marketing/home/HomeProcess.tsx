import { AppContainer } from "@/components/shared/AppContainer";

const steps = [
  {
    num: "01",
    title: "Dosyayı aç",
    description: "Varlık, aşama, eksik parça — dosyada.",
  },
  {
    num: "02",
    title: "Ortak ihtiyacını tanımla",
    description: "Aranan ortak türü net yazılır.",
  },
  {
    num: "03",
    title: "Eşleş ve görüş",
    description: "Eşleşme görünür; görüşme başlar.",
  },
];

export function HomeProcess() {
  return (
    <section className="relative overflow-hidden bg-ortaq-navy py-20 md:py-24">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" aria-hidden />

      <AppContainer>
        <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="type-eyebrow-light">Çalışma modeli</p>
            <h2 className="type-section-light mt-3">Üç adımda dosya mantığı</h2>
          </div>
          <p className="max-w-xs text-sm text-white/50">
            Fırsatı yapılandır, eşleş, görüş.
          </p>
        </div>

        <div className="grid gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10 md:grid-cols-3">
          {steps.map((step) => (
            <div
              key={step.num}
              className="bg-[#0f1a30] px-6 py-8 md:px-8"
            >
              <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ortaq-accent">
                Adım {step.num}
              </span>
              <h3 className="mt-4 font-heading text-lg font-semibold tracking-[-0.02em] text-white md:text-xl">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-white/55">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </AppContainer>
    </section>
  );
}
