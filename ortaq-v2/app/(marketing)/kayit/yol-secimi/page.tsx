import { Briefcase, Handshake } from "lucide-react";
import { AppContainer } from "@/components/shared/AppContainer";
import { Section } from "@/components/shared/Section";
import { PageHeader } from "@/components/shared/PageHeader";
import { PathChoiceCard } from "@/components/marketing/PathChoiceCard";

export default function YolSecimiPage() {
  return (
    <Section className="py-12 md:py-20">
      <AppContainer>
        <PageHeader
          align="center"
          title="Nereden başlamak istersiniz?"
          description="ORTAQ'ta iki rol vardır. Size uygun olanı seçin — kayıt sonrası profilinizi güncelleyebilirsiniz."
          className="mx-auto max-w-2xl border-none pb-4"
        />

        <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
          <PathChoiceCard
            title="Bir fırsat dosyası oluşturmak istiyorum"
            description="Elinizde ilerlemeye değer bir iş fırsatı, lokasyon, ürün, kapasite veya yarım kalmış proje var. Doğru ortağı arıyorsunuz."
            ctaLabel="Fırsat Sahibi Olarak Devam Et"
            href="/onboarding/firsat-sahibi"
            icon={<Briefcase className="h-6 w-6" />}
          />
          <PathChoiceCard
            title="Fırsatlara ortak olmak istiyorum"
            description="Bir fırsata sermaye, teknik bilgi, operasyon, satış gücü veya sektör deneyimiyle ortak olmak istiyorsunuz."
            ctaLabel="Ortak Olarak Devam Et"
            href="/onboarding/ortak"
            icon={<Handshake className="h-6 w-6" />}
          />
        </div>

        <p className="mx-auto mt-10 max-w-lg text-center text-sm leading-relaxed text-ortaq-text-muted">
          Hangisinin size daha uygun olduğundan emin değil misiniz? Kayıt
          olduktan sonra profilinizi değiştirebilirsiniz.
        </p>
      </AppContainer>
    </Section>
  );
}
