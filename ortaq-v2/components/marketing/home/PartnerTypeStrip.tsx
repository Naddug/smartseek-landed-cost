import Link from "next/link";
import { AppContainer } from "@/components/shared/AppContainer";
import { getPartnerTypeChips } from "@/data/marketing/home-dossiers";
import { ORTAQ_COPY } from "@/lib/copy/ortaq-lexicon";
import { cn } from "@/lib/utils";

export function PartnerTypeStrip() {
  const partnerTypeChips = getPartnerTypeChips();

  return (
    <section className="section-editorial-alt py-10 md:py-12">
      <AppContainer>
        <p className="type-eyebrow mb-4">{ORTAQ_COPY.positioning.categoryLabel}</p>
        <p className="mb-6 max-w-2xl text-sm leading-relaxed text-ortaq-text-secondary">
          {ORTAQ_COPY.archive.intro}
        </p>
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
      </AppContainer>
    </section>
  );
}
