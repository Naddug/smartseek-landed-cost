import { AppContainer } from "@/components/shared/AppContainer";
import { Section } from "@/components/shared/Section";
import { PageShell } from "@/components/marketing/PageShell";

export default function KayitPage() {
  return (
    <Section>
      <AppContainer size="narrow">
        <PageShell
          title="Kayıt Ol"
          description="Hesap oluşturma akışı yol seçiminden başlayacak."
          emptyTitle="Kayıt formu henüz eklenmedi"
        />
      </AppContainer>
    </Section>
  );
}
