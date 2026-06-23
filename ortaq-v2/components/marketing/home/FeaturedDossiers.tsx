import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { AppContainer } from "@/components/shared/AppContainer";
import { DossierFilePanel } from "@/components/opportunity/DossierFilePanel";
import { featuredOpportunity } from "@/data/mock-opportunities";
import { ORTAQ_COPY } from "@/lib/copy/ortaq-lexicon";

export function FeaturedDossiers() {
  return (
    <section className="relative overflow-hidden bg-ortaq-navy py-20 md:py-28">
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.08) 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }}
      />
      <div className="pointer-events-none absolute -right-32 top-0 h-96 w-96 rounded-full bg-ortaq-action/10 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute -left-24 bottom-0 h-64 w-64 rounded-full bg-ortaq-accent/5 blur-3xl" aria-hidden />

      <AppContainer className="relative">
        <div className="mb-10 max-w-xl lg:mb-12">
          <p className="type-eyebrow-light">{ORTAQ_COPY.sections.featuredEyebrow}</p>
          <h2 className="type-section-light mt-3">
            {ORTAQ_COPY.sections.featuredDossierSpotlight}
          </h2>
        </div>

        <Link href="/firsatlar" className="group mx-auto block max-w-4xl">
          <div className="relative">
            <div className="absolute -inset-px rounded-xl bg-gradient-to-b from-white/15 to-transparent opacity-60" aria-hidden />
            <DossierFilePanel
              opportunity={featuredOpportunity}
              theme="spotlight"
              size="lg"
              showFooter
              className="relative rounded-xl"
            />
            <span className="absolute bottom-6 right-6 inline-flex items-center gap-1.5 text-sm font-medium text-ortaq-accent opacity-0 transition-opacity group-hover:opacity-100 md:bottom-8 md:right-8">
              Dosyayı aç
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </div>
        </Link>

        <dl className="mx-auto mt-8 grid max-w-4xl grid-cols-3 gap-4 border-t border-white/10 pt-8">
          {[
            { k: "Ref", v: featuredOpportunity.fileRef },
            { k: "Aşama", v: featuredOpportunity.stageLabel },
            { k: "Konum", v: featuredOpportunity.location },
          ].map((item) => (
            <div key={item.k}>
              <dt className="font-mono text-[10px] uppercase tracking-[0.12em] text-white/35">
                {item.k}
              </dt>
              <dd className="mt-1 text-sm font-medium text-white/80">{item.v}</dd>
            </div>
          ))}
        </dl>
      </AppContainer>
    </section>
  );
}
