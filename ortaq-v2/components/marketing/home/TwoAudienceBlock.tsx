import Link from "next/link";
import { ArrowRight, Check, Minus } from "lucide-react";
import { AppContainer } from "@/components/shared/AppContainer";
import { Button } from "@/components/ui/button";
import { ORTAQ_COPY } from "@/lib/copy/ortaq-lexicon";

export function TwoAudienceBlock() {
  return (
    <section className="section-editorial-alt py-20 md:py-24">
      <AppContainer>
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
          <div className="card-editorial relative overflow-hidden">
            <div className="absolute inset-y-0 left-0 w-1 bg-ortaq-navy" aria-hidden />
            <div className="border-b border-ortaq-line bg-ortaq-surface px-6 py-5 md:px-8">
              <div className="flex items-center justify-between gap-3">
                <p className="type-eyebrow">{ORTAQ_COPY.twoAudience.ownerLabel}</p>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-200">
                  <Check className="h-3 w-3" strokeWidth={3} />
                  Zemin sizde
                </span>
              </div>
              <h2 className="mt-2.5 font-heading text-xl font-semibold tracking-[-0.02em] text-ortaq-navy md:text-2xl">
                {ORTAQ_COPY.twoAudience.ownerTitle}
              </h2>
            </div>
            <div className="px-6 py-6 md:px-8 md:py-7">
              <p className="text-sm leading-relaxed text-ortaq-text-secondary">
                {ORTAQ_COPY.twoAudience.ownerBody}
              </p>
              <Link href="/kayit/yol-secimi" className="mt-6 inline-block">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  {ORTAQ_COPY.ctas.createDossier}
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-xl border border-ortaq-dark-border bg-ortaq-dark-bg shadow-ortaq-dark">
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-blue-600/25 blur-3xl" aria-hidden />
            <div className="relative border-b border-ortaq-dark-border bg-ortaq-dark-elevated px-6 py-5 md:px-8">
              <div className="flex items-center justify-between gap-3">
                <p className="type-eyebrow-light">{ORTAQ_COPY.twoAudience.partnerLabel}</p>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/15 px-2.5 py-1 text-[11px] font-semibold text-blue-200 ring-1 ring-blue-400/30">
                  <Minus className="h-3 w-3" strokeWidth={3} />
                  Eksik taraf sizsiniz
                </span>
              </div>
              <h2 className="mt-2.5 font-heading text-xl font-semibold tracking-[-0.02em] text-ortaq-dark-text md:text-2xl">
                {ORTAQ_COPY.twoAudience.partnerTitle}
              </h2>
            </div>
            <div className="relative px-6 py-6 md:px-8 md:py-7">
              <p className="text-sm leading-relaxed text-ortaq-dark-text-secondary">
                {ORTAQ_COPY.twoAudience.partnerBody}
              </p>
              <Link href="/firsatlar" className="mt-6 inline-block">
                <Button variant="outlineOnDark">
                  {ORTAQ_COPY.ctas.browseDossiers}
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </AppContainer>
    </section>
  );
}
