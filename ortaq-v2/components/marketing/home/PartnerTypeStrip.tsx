import Link from "next/link";
import { AppContainer } from "@/components/shared/AppContainer";
import { getPartnerTypeChips } from "@/data/marketing/home-dossiers";
import { ORTAQ_COPY } from "@/lib/copy/ortaq-lexicon";
import { cn } from "@/lib/utils";

export function PartnerTypeStrip() {
  const partnerTypeChips = getPartnerTypeChips();

  return (
    <section className="section-editorial-alt border-b border-ortaq-line py-12 md:py-14">
      <AppContainer>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,18rem)_1fr] lg:items-end lg:gap-10">
          <div>
            <p className="type-eyebrow">{ORTAQ_COPY.productClarity.eyebrow}</p>
            <h2 className="mt-2 font-heading text-lg font-semibold text-ortaq-navy">
              Aranan ortak türüne göre inceleyin
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ortaq-text-secondary">
              {ORTAQ_COPY.archive.intro}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
          {partnerTypeChips.map((chip) => (
            <Link
              key={chip.id}
              href={`/firsatlar?ortak=${chip.filterParam}`}
              className={cn(
                "inline-flex items-center gap-2 rounded-lg border border-ortaq-line bg-ortaq-surface px-3.5 py-2 shadow-ortaq-sm",
                "text-sm font-medium text-ortaq-navy transition-all hover:border-ortaq-line-strong hover:shadow-ortaq-md"
              )}
            >
              <span>{chip.label}</span>
              <span className="font-mono text-[10px] tabular-nums text-ortaq-text-muted">
                {chip.count}
              </span>
            </Link>
          ))}
          </div>
        </div>
      </AppContainer>
    </section>
  );
}
