import { AppContainer } from "@/components/shared/AppContainer";
import { Section } from "@/components/shared/Section";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { FilterBar } from "@/components/shared/FilterBar";
import { DossierCard } from "@/components/opportunity/DossierCard";
import { mockOpportunities } from "@/data/mock-opportunities";

export default function FirsatlarPage() {
  return (
    <Section>
      <AppContainer>
        <SectionHeader
          eyebrow="Keşfet"
          title="Fırsat Dosyaları"
          description="Yapılandırılmış, incelenmiş iş fırsatları. Her dosyada varlık, eksik parça ve aranan ortak türü netleştirilmiştir."
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
            <DossierCard
              key={opportunity.id}
              opportunity={opportunity}
              href="/firsatlar"
            />
          ))}
        </div>
      </AppContainer>
    </Section>
  );
}
