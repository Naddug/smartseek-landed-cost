import { AppContainer } from "@/components/shared/AppContainer";
import { MonetizationTiers } from "@/components/marketing/MonetizationTiers";
import { ORTAQ_COPY } from "@/lib/copy/ortaq-lexicon";

export function MonetizationSection() {
  return (
    <section className="border-b border-stone-200 bg-white py-20 md:py-24">
      <AppContainer>
        <div className="mb-10 max-w-2xl">
          <p className="type-eyebrow">{ORTAQ_COPY.monetization.sectionEyebrow}</p>
          <h2 className="type-section mt-3">{ORTAQ_COPY.monetization.sectionTitle}</h2>
          <p className="mt-3 text-sm leading-relaxed text-stone-600 md:text-base">
            {ORTAQ_COPY.monetization.sectionDescription}
          </p>
        </div>
        <MonetizationTiers />
      </AppContainer>
    </section>
  );
}
