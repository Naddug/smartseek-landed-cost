import { AppContainer } from "@/components/shared/AppContainer";
import { Section } from "@/components/shared/Section";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { FilterBar } from "@/components/shared/FilterBar";
import { OpportunityCard } from "@/components/opportunity/OpportunityCard";
import { mockOpportunities } from "@/data/mock-opportunities";

export default function FirsatlarPage() {
  return (
    <Section>
      <AppContainer>
        <SectionHeader
          eyebrow="Keşfet"
          title="Fırsat Dosyaları"
          description="Gerçek varlığı olan, eksik kalmış iş fırsatları. Her dosya kategori, konum, engel ve aranan ortak türüyle yapılandırılır."
        />
        <FilterBar
          className="mb-8"
          filters={[
            {
              id: "category",
              label: "Kategori",
              options: [
                { value: "ecommerce", label: "E-ticaret" },
                { value: "hospitality", label: "Yeme-İçme" },
                { value: "manufacturing", label: "Üretim" },
                { value: "healthcare", label: "Sağlık Teknolojisi" },
              ],
            },
          ]}
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
          {mockOpportunities.map((opportunity) => (
            <OpportunityCard
              key={opportunity.id}
              opportunity={opportunity}
              variant="public"
            />
          ))}
        </div>
      </AppContainer>
    </Section>
  );
}
