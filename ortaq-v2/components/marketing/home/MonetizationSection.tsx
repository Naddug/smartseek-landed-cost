import { Check } from "lucide-react";
import { AppContainer } from "@/components/shared/AppContainer";
import { MonetizationTiers } from "@/components/marketing/MonetizationTiers";
import { ORTAQ_COPY } from "@/lib/copy/ortaq-lexicon";

export function MonetizationSection() {
  return (
    <section className="section-editorial-alt py-20 md:py-24">
      <AppContainer>
        <div className="mb-10 max-w-3xl">
          <p className="type-eyebrow">{ORTAQ_COPY.monetization.sectionEyebrow}</p>
          <h2 className="type-section mt-3 text-balance">
            {ORTAQ_COPY.monetization.sectionTitle}
          </h2>
          <p className="type-body-secondary mt-4 leading-relaxed md:text-base">
            {ORTAQ_COPY.monetization.sectionDescription}
          </p>
        </div>

        <div className="mb-8 flex flex-col gap-3 rounded-xl border border-ortaq-line bg-ortaq-surface px-5 py-4 shadow-ortaq-sm sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-2.5 text-sm font-medium text-ortaq-navy">
            <Check className="h-4 w-4 shrink-0 text-emerald-600" strokeWidth={2.75} />
            Fırsat açmak, dosya yayınlamak ve başvurmak ücretsizdir.
          </p>
          <p className="text-sm text-ortaq-text-muted">
            Aşağıdaki katmanlar yalnızca doğru eşleşmeye daha hızlı ulaşmak için.
          </p>
        </div>

        <MonetizationTiers layout="homepage" />
      </AppContainer>
    </section>
  );
}
