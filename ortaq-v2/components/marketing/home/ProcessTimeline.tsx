import { AppContainer } from "@/components/shared/AppContainer";
import { ORTAQ_COPY } from "@/lib/copy/ortaq-lexicon";

const steps = [
  {
    num: "01",
    title: ORTAQ_COPY.process.step1Title,
    description: ORTAQ_COPY.process.step1Description,
    align: "left" as const,
  },
  {
    num: "02",
    title: ORTAQ_COPY.process.step2Title,
    description: ORTAQ_COPY.process.reviewStepDescription,
    align: "right" as const,
  },
  {
    num: "03",
    title: ORTAQ_COPY.process.step3Title,
    description: ORTAQ_COPY.process.step3Description,
    align: "left" as const,
  },
];

export function ProcessTimeline() {
  return (
    <section className="section-editorial py-20 md:py-24">
      <AppContainer>
        <div className="mb-14 max-w-xl">
          <p className="type-eyebrow">{ORTAQ_COPY.process.sectionEyebrow}</p>
          <h2 className="type-section mt-3">{ORTAQ_COPY.process.sectionTitle}</h2>
          <p className="mt-3 text-sm leading-relaxed text-ortaq-text-secondary md:text-base">
            {ORTAQ_COPY.process.sectionLead}
          </p>
        </div>

        <div className="relative mx-auto max-w-3xl">
          <div
            className="absolute left-4 top-0 hidden h-full w-px bg-ortaq-line-strong md:left-1/2 md:block md:-translate-x-px"
            aria-hidden
          />

          <ol className="space-y-12 md:space-y-16">
            {steps.map((step, index) => {
              const isRight = step.align === "right";
              return (
                <li
                  key={step.num}
                  className="relative md:grid md:grid-cols-2 md:gap-12"
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
                    className="absolute left-4 top-1 flex h-3 w-3 -translate-x-1/2 rounded-full border-2 border-ortaq-navy bg-ortaq-surface md:left-1/2"
                    aria-hidden
                  />

                  {index < steps.length - 1 && (
                    <span
                      className="absolute left-4 top-4 block h-full w-px bg-ortaq-line md:hidden"
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
