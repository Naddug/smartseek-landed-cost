import Link from "next/link";
import { AppContainer } from "@/components/shared/AppContainer";
import { Button } from "@/components/ui/button";
import { Check, Minus, Shield } from "lucide-react";
import { ORTAQ_COPY } from "@/lib/copy/ortaq-lexicon";

export function ModerationBlock() {
  return (
    <section className="border-y border-ortaq-line bg-[#F3F5F9] py-20 md:py-24">
      <AppContainer>
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 flex items-start gap-3 border-b border-ortaq-navy/15 pb-6">
            <Shield className="mt-0.5 h-5 w-5 shrink-0 text-ortaq-navy" strokeWidth={1.5} />
            <div>
              <p className="type-eyebrow">{ORTAQ_COPY.sections.standards}</p>
              <h2 className="type-section mt-2 text-balance">
                {ORTAQ_COPY.standards.sectionTitle}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-ortaq-text-secondary">
                {ORTAQ_COPY.standards.sectionIntro}
              </p>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
            <div className="rounded-lg border border-ortaq-line bg-white">
              <div className="border-b border-ortaq-line px-5 py-3">
                <p className="type-meta text-ortaq-navy">{ORTAQ_COPY.labels.publishCriteria}</p>
              </div>
              <ul className="divide-y divide-ortaq-line">
                {ORTAQ_COPY.standards.publishCriteriaItems.map((item) => (
                  <li key={item.label} className="flex gap-4 px-5 py-4">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-ortaq-success" strokeWidth={2} />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <p className="text-sm font-medium text-ortaq-navy">{item.label}</p>
                        <span className="font-mono text-[10px] uppercase tracking-wider text-ortaq-text-muted">
                          {item.tag}
                        </span>
                      </div>
                      <p className="mt-1 text-sm leading-relaxed text-ortaq-text-muted">
                        {item.detail}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-lg border border-ortaq-danger/20 bg-white">
              <div className="border-b border-ortaq-danger/15 bg-ortaq-danger/[0.04] px-5 py-3">
                <p className="type-meta text-ortaq-danger">{ORTAQ_COPY.labels.rejectedCriteria}</p>
              </div>
              <ul className="divide-y divide-ortaq-line/80 px-5 py-2">
                {ORTAQ_COPY.standards.rejectedPatterns.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 py-3 text-sm text-ortaq-text-muted"
                  >
                    <Minus className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ortaq-danger" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="border-t border-ortaq-line px-5 py-4">
                <Link href="/guven-kalite">
                  <Button variant="outline" size="sm" className="w-full text-xs">
                    Tam standart metni
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
