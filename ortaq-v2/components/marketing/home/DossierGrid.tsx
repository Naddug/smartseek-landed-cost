import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AppContainer } from "@/components/shared/AppContainer";
import { DossierCard } from "@/components/opportunity/DossierCard";
import { featuredOpportunity, mockOpportunities } from "@/data/mock-opportunities";

/** Archive grid — all dossiers except homepage spotlight */
export function DossierGrid() {
  const items = mockOpportunities.filter((o) => o.id !== featuredOpportunity.id);
  if (items.length === 0) return null;

  return (
    <section className="border-b border-ortaq-line bg-white py-16 md:py-20">
      <AppContainer>
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="type-eyebrow">Dosya arşivi</p>
            <h2 className="type-section mt-3">Aktif fırsat dosyaları</h2>
            <p className="mt-2 max-w-lg text-sm text-ortaq-text-muted">
              Varlık, eksik parça ve aranan ortak — her satır bir kayıt.
            </p>
          </div>
          <Link
            href="/firsatlar"
            className="inline-flex items-center gap-2 text-sm font-medium text-ortaq-action hover:text-ortaq-navy"
          >
            Tümünü gör
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((opportunity) => (
            <DossierCard
              key={opportunity.id}
              opportunity={opportunity}
              href="/firsatlar"
            />
          ))}
        </div>
      </AppContainer>
    </section>
  );
}
