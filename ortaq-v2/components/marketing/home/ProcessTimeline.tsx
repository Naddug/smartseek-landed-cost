import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AppContainer } from "@/components/shared/AppContainer";
import { ORTAQ_COPY } from "@/lib/copy/ortaq-lexicon";

const steps = [
  {
    num: "01",
    title: ORTAQ_COPY.process.step1Title,
    description: ORTAQ_COPY.process.step1Description,
  },
  {
    num: "02",
    title: ORTAQ_COPY.process.step2Title,
    description: ORTAQ_COPY.process.reviewStepDescription,
  },
  {
    num: "03",
    title: ORTAQ_COPY.process.step3Title,
    description: ORTAQ_COPY.process.step3Description,
  },
];

export function ProcessTimeline() {
  return (
    <section className="section-editorial py-16 md:py-20">
      <AppContainer>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,22rem)_1fr] lg:items-start lg:gap-14 xl:gap-16">
          <div className="lg:sticky lg:top-24">
            <p className="type-eyebrow">{ORTAQ_COPY.process.sectionEyebrow}</p>
            <h2 className="type-section mt-3">{ORTAQ_COPY.process.sectionTitle}</h2>
            <p className="mt-3 text-sm leading-relaxed text-ortaq-text-secondary md:text-base">
              {ORTAQ_COPY.process.sectionLead}
            </p>
            <Link
              href="/nasil-calisir"
              className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              Tüm süreci incele
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
            {steps.map((step) => (
              <li
                key={step.num}
                className="card-editorial flex h-full flex-col px-5 py-5 md:px-6 md:py-6"
              >
                <span className="type-meta text-ortaq-text-muted">Adım {step.num}</span>
                <h3 className="mt-2 font-heading text-lg font-semibold leading-snug text-ortaq-navy md:text-xl">
                  {step.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-ortaq-text-secondary">
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </AppContainer>
    </section>
  );
}
