import { AppContainer } from "@/components/shared/AppContainer";
import { ORTAQ_COPY } from "@/lib/copy/ortaq-lexicon";

const steps = [
  {
    num: "01",
    title: "Dosyayı yapılandır",
    description:
      "Varlık, eksik parça ve aranan ortak türünü yapılandırılmış dosyaya işleyin.",
    align: "left" as const,
  },
  {
    num: "02",
    title: "ORTAQ inceleyip yayınlar",
    description: ORTAQ_COPY.process.reviewStepDescription,
    align: "right" as const,
  },
  {
    num: "03",
    title: "Eşleşme ve görüşme",
    description:
      "Uygun profiller görünür; görüşme ORTAQ paneli üzerinden ilerler.",
    align: "left" as const,
  },
];

export function ProcessTimeline() {
  return (
    <section className="section-editorial py-20 md:py-24">
      <AppContainer>
        <div className="mb-14 max-w-xl">
          <p className="type-eyebrow">Dosya akışı</p>
          <h2 className="type-section mt-3">Fırsat dosyası nasıl ilerler?</h2>
        </div>

        <div className="relative mx-auto max-w-3xl">
          <div
            className="absolute left-4 top-0 hidden h-full w-px bg-stone-300 md:left-1/2 md:block md:-translate-x-px"
            aria-hidden
          />

          <ol className="space-y-12 md:space-y-16">
            {steps.map((step, index) => {
              const isRight = step.align === "right";
              return (
                <li
                  key={step.num}
                  className={`relative md:grid md:grid-cols-2 md:gap-12 ${
                    isRight ? "" : ""
                  }`}
                >
                  <div
                    className={`${
                      isRight ? "md:order-2 md:pl-8" : "md:pr-8 md:text-right"
                    }`}
                  >
                    <span className="type-meta text-ortaq-text-muted">
                      Adım {step.num}
                    </span>
                    <h3 className="mt-2 font-heading text-xl font-semibold text-ortaq-navy">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-ortaq-text-secondary">
                      {step.description}
                    </p>
                  </div>

                  <div
                    className={`hidden md:block ${isRight ? "md:order-1" : ""}`}
                    aria-hidden
                  />

                  <span
                    className="absolute left-4 top-1 flex h-3 w-3 -translate-x-1/2 rounded-full border-2 border-stone-950 bg-stone-50 md:left-1/2"
                    aria-hidden
                  />

                  {index < steps.length - 1 && (
                    <span
                      className="absolute left-4 top-4 block h-full w-px bg-stone-200 md:hidden"
                      aria-hidden
                    />
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </AppContainer>
    </section>
  );
}
