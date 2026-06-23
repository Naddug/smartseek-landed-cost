import Link from "next/link";
import { AppContainer } from "@/components/shared/AppContainer";
import { partnerTypeChips } from "@/data/marketing/home-dossiers";
import { cn } from "@/lib/utils";

export function PartnerTypeStrip() {
  return (
    <section className="border-b border-stone-200 bg-stone-50 py-10 md:py-12">
      <AppContainer>
        <p className="type-eyebrow mb-4">Ortak türleri</p>
        <p className="mb-6 max-w-2xl text-sm text-stone-600">
          Her dosyada aranan ortak türü net tanımlıdır. Ekosistemdeki başlıca
          eşleşme alanları:
        </p>
        <div className="flex flex-wrap gap-2">
          {partnerTypeChips.map((chip) => (
            <Link
              key={chip.id}
              href={`/firsatlar?ortak=${chip.filterParam}`}
              className={cn(
                "inline-flex items-center gap-2 rounded-lg border border-stone-200 bg-white px-3.5 py-2",
                "text-sm text-stone-800 transition-colors hover:border-stone-400 hover:bg-stone-100"
              )}
            >
              <span>{chip.label}</span>
              <span className="font-mono text-[10px] tabular-nums text-stone-500">
                {chip.count}
              </span>
            </Link>
          ))}
        </div>
      </AppContainer>
    </section>
  );
}
