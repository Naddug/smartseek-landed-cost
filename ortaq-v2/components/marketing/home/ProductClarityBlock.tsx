import { X } from "lucide-react";
import { AppContainer } from "@/components/shared/AppContainer";
import { ORTAQ_COPY } from "@/lib/copy/ortaq-lexicon";

export function ProductClarityBlock() {
  const copy = ORTAQ_COPY.productClarity;

  return (
    <section className="border-b border-ortaq-line bg-white py-12 md:py-14">
      <AppContainer>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,26rem)_1fr] lg:items-start lg:gap-12 xl:gap-14">
          <div>
            <p className="type-eyebrow">{copy.eyebrow}</p>
            <h2 className="type-section mt-2 text-balance">{copy.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-ortaq-text-secondary md:text-base">
              {copy.lead}
            </p>
            <div className="mt-6">
              <p className="type-meta text-ortaq-text-muted">{copy.notLabel}</p>
              <ul className="mt-2.5 flex flex-wrap gap-2">
                {copy.notItems.map((item) => (
                  <li
                    key={item}
                    className="inline-flex items-center gap-1.5 rounded-full border border-red-100 bg-red-50/90 px-3 py-1 text-xs font-medium text-red-900/90"
                  >
                    <X className="h-3 w-3 shrink-0" strokeWidth={2.5} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {copy.pillars.map((pillar) => (
              <div
                key={pillar.title}
                className="card-editorial flex h-full flex-col p-5 md:p-6"
              >
                <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-ortaq-text-muted">
                  {pillar.kicker}
                </p>
                <h3 className="mt-2 font-heading text-base font-semibold text-ortaq-navy">
                  {pillar.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-ortaq-text-secondary">
                  {pillar.body}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-4 rounded-xl border border-ortaq-line bg-ortaq-surface-alt/70 p-5 md:grid-cols-[auto_1fr] md:items-center md:gap-6 md:p-6">
          <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-ortaq-text-muted md:max-w-[8rem]">
            {copy.dossierLabel}
          </p>
          <p className="text-sm leading-relaxed text-ortaq-navy md:text-[0.9375rem]">
            {copy.dossierDefinition}
          </p>
        </div>
      </AppContainer>
    </section>
  );
}
