import Link from "next/link";
import { AppContainer } from "@/components/shared/AppContainer";
import { ORTAQ_COPY } from "@/lib/copy/ortaq-lexicon";
import { Button } from "@/components/ui/button";

export function StandardsBlock() {
  return (
    <section className="section-editorial py-16 md:py-20">
      <AppContainer>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,22rem)_1fr] lg:items-start lg:gap-14 xl:gap-16">
          <div>
            <div className="border-b border-ortaq-line-strong pb-6">
              <p className="type-eyebrow">{ORTAQ_COPY.sections.standards}</p>
              <h2 className="type-section mt-2 text-balance">
                {ORTAQ_COPY.standards.sectionTitle}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-ortaq-text-secondary md:text-base">
                {ORTAQ_COPY.standards.sectionIntro}
              </p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="card-editorial overflow-hidden">
              <div className="border-b border-ortaq-line bg-ortaq-surface-alt px-5 py-3">
                <p className="type-meta text-ortaq-navy">{ORTAQ_COPY.labels.publishCriteria}</p>
              </div>
              <ul className="divide-y divide-ortaq-line">
                {ORTAQ_COPY.standards.publishCriteriaItems.map((item) => (
                  <li key={item.label} className="px-5 py-4">
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="text-sm font-semibold text-ortaq-navy">{item.label}</p>
                      <span className="type-meta text-ortaq-text-muted">{item.tag}</span>
                    </div>
                    <p className="mt-1 text-sm text-ortaq-text-secondary">{item.detail}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="overflow-hidden rounded-xl border border-red-200/90 bg-ortaq-surface shadow-ortaq-sm">
              <div className="border-b border-red-100 bg-red-50 px-5 py-3">
                <p className="type-meta text-red-800">{ORTAQ_COPY.labels.rejectedCriteria}</p>
              </div>
              <ul className="divide-y divide-ortaq-line px-5 py-2">
                {ORTAQ_COPY.standards.rejectedPatterns.map((item) => (
                  <li key={item} className="py-3 text-sm text-ortaq-text-secondary">
                    <span className="mr-2 font-medium text-ortaq-danger">—</span>
                    {item}
                  </li>
                ))}
              </ul>
              <div className="border-t border-ortaq-line px-5 py-4">
                <Link href="/guven-kalite">
                  <Button variant="outline" size="sm" className="w-full text-xs">
                    ORTAQ standardının tamamı
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </AppContainer>
    </section>
  );
}
