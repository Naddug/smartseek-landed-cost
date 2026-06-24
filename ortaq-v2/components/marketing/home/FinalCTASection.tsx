import Link from "next/link";
import { Plus } from "lucide-react";
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
      <div className="pointer-events-none absolute -right-24 bottom-0 h-64 w-64 rounded-full bg-blue-600/10 blur-3xl" aria-hidden />

      <AppContainer className="relative">
        <div className="mx-auto max-w-3xl text-center">
          {/* Two sides converge — the whole product in one line. */}
          <div className="mx-auto mb-10 flex max-w-xl items-stretch gap-3">
            <div className="flex-1 rounded-xl border border-ortaq-dark-border bg-ortaq-dark-elevated px-4 py-3 text-left">
              <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-ortaq-dark-text-muted">
                Bir tarafta
              </p>
              <p className="mt-1 text-sm font-semibold text-ortaq-dark-text">
                Zemini olan iş
              </p>
            </div>
            <div className="flex flex-col items-center justify-center">
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-blue-400/40 bg-blue-600/20 text-blue-300">
                <Plus className="h-4 w-4" strokeWidth={2.5} />
              </span>
            </div>
            <div className="flex-1 rounded-xl border border-blue-500/30 bg-blue-500/10 px-4 py-3 text-left">
              <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-blue-300/90">
                Diğer tarafta
              </p>
              <p className="mt-1 text-sm font-semibold text-white">
                Doğru ortak
              </p>
            </div>
          </div>

          <h2 className="font-heading text-3xl font-semibold leading-[1.1] tracking-tight text-ortaq-dark-text md:text-[2.75rem]">
            {ORTAQ_COPY.finalCta.headline}
          </h2>
          <p className="type-body-on-dark mx-auto mt-5 max-w-lg leading-relaxed">
            {ORTAQ_COPY.finalCta.subhead}
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link href="/kayit/yol-secimi">
              <Button size="lg" className="h-11 bg-blue-600 px-6 hover:bg-blue-700">
                {ORTAQ_COPY.ctas.createDossier}
              </Button>
            </Link>
            <Link href="/firsatlar">
              <Button size="lg" variant="outlineOnDark" className="h-11 px-6">
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
