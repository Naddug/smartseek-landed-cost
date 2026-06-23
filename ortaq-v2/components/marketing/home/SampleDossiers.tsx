import Link from "next/link";
import { AppContainer } from "@/components/shared/AppContainer";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { OpportunityCard } from "@/components/opportunity/OpportunityCard";
import { mockOpportunities } from "@/data/mock-opportunities";
import { Button } from "@/components/ui/button";

export function SampleDossiers() {
  return (
    <section className="border-y border-ortaq-line bg-ortaq-surface-alt py-16 md:py-20">
      <AppContainer>
        <SectionHeader
          eyebrow="Örnek dosyalar"
          title="Platformda nasıl fırsat dosyaları görünür?"
          description="Her dosya kategori, konum, engel ve aranan ortak türüyle yapılandırılır. Aşağıdakiler örnek kabuktur."
          action={
            <Link href="/firsatlar" className="hidden md:block">
              <Button variant="outline" size="sm">
                Tümünü gör
              </Button>
            </Link>
          }
        />
        <div className="grid gap-4 sm:grid-cols-2">
          {mockOpportunities.map((opportunity) => (
            <OpportunityCard
              key={opportunity.id}
              opportunity={opportunity}
              variant="public"
            />
          ))}
        </div>
        <div className="mt-6 text-center md:hidden">
          <Link href="/firsatlar">
            <Button variant="outline" size="sm">
              Tümünü gör
            </Button>
          </Link>
        </div>
      </AppContainer>
    </section>
  );
}
