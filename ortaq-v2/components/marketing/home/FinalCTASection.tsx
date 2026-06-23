import Link from "next/link";
import { AppContainer } from "@/components/shared/AppContainer";
import { Button } from "@/components/ui/button";
import { ORTAQ_COPY } from "@/lib/copy/ortaq-lexicon";

export function FinalCTASection() {
  return (
    <section className="surface-dark relative overflow-hidden py-20 md:py-28">
      <div
        className="pointer-events-none absolute inset-0 opacity-25"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />
      <div className="pointer-events-none absolute -left-24 top-0 h-64 w-64 rounded-full bg-blue-600/20 blur-3xl" aria-hidden />

      <AppContainer className="relative">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-3xl font-semibold tracking-tight text-ortaq-dark-text md:text-4xl">
            {ORTAQ_COPY.finalCta.headline}
          </h2>
          <p className="type-body-on-dark mx-auto mt-4 max-w-lg">
            {ORTAQ_COPY.finalCta.subhead}
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link href="/kayit/yol-secimi">
              <Button size="lg" className="h-11 bg-blue-600 px-6 hover:bg-blue-700">
                {ORTAQ_COPY.ctas.createDossier}
              </Button>
            </Link>
            <Link href="/firsatlar">
              <Button size="lg" variant="outline" className="btn-on-dark-outline h-11 px-6">
                {ORTAQ_COPY.ctas.browseDossiers}
              </Button>
            </Link>
          </div>
          <p className="type-meta-on-dark mt-8">{ORTAQ_COPY.trust.trustFooter}</p>
          <p className="mt-3 text-xs font-medium text-ortaq-dark-text-muted">
            {ORTAQ_COPY.finalCta.footerLine}
          </p>
        </div>
      </AppContainer>
    </section>
  );
}
