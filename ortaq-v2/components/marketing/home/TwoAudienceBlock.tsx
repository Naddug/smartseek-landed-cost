import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AppContainer } from "@/components/shared/AppContainer";
import { Button } from "@/components/ui/button";
import { ORTAQ_COPY } from "@/lib/copy/ortaq-lexicon";

export function TwoAudienceBlock() {
  return (
    <section className="section-editorial-alt py-20 md:py-24">
      <AppContainer>
        <div className="mb-12 max-w-2xl">
          <p className="type-eyebrow">{ORTAQ_COPY.twoAudience.eyebrow}</p>
          <h2 className="type-section mt-3">{ORTAQ_COPY.twoAudience.title}</h2>
        </div>

        <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
          <div className="card-editorial relative overflow-hidden">
            <div className="absolute inset-y-0 left-0 w-1 bg-ortaq-navy" aria-hidden />
            <div className="border-b border-ortaq-line bg-ortaq-surface px-6 py-5 md:px-8">
              <p className="type-eyebrow">Fırsat sahibi</p>
              <h3 className="mt-2 font-heading text-xl font-semibold tracking-[-0.02em] text-ortaq-navy md:text-2xl">
                {ORTAQ_COPY.twoAudience.ownerTitle}
              </h3>
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
              <p className="mt-3 text-xs text-ortaq-text-muted">
                {ORTAQ_COPY.monetization.ownerPremiumTitle} —{" "}
                <Link href="/guven-kalite#premium" className="font-medium text-blue-600 hover:underline">
                  detaylar
                </Link>
              </p>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-xl border border-ortaq-dark-border bg-ortaq-dark-bg shadow-ortaq-dark">
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-blue-600/25 blur-3xl" aria-hidden />
            <div className="relative border-b border-ortaq-dark-border bg-ortaq-dark-elevated px-6 py-5 md:px-8">
              <p className="type-eyebrow-light">Ortak tarafı</p>
              <h3 className="mt-2 font-heading text-xl font-semibold tracking-[-0.02em] text-ortaq-dark-text md:text-2xl">
                {ORTAQ_COPY.twoAudience.partnerTitle}
              </h3>
            </div>
            <div className="relative px-6 py-6 md:px-8 md:py-7">
              <p className="text-sm leading-relaxed text-ortaq-dark-text-secondary">
                {ORTAQ_COPY.twoAudience.partnerBody}
              </p>
              <Link href="/firsatlar" className="mt-6 inline-block">
                <Button variant="outline" className="btn-on-dark-outline">
                  {ORTAQ_COPY.ctas.browseDossiers}
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
              <p className="mt-3 text-xs text-ortaq-dark-text-muted">
                {ORTAQ_COPY.monetization.partnerPremiumTitle} —{" "}
                <Link href="/guven-kalite#premium" className="font-medium text-ortaq-dark-text hover:text-white">
                  detaylar
                </Link>
              </p>
            </div>
          </div>
        </div>
      </AppContainer>
    </section>
  );
}
