import { AppContainer } from "@/components/shared/AppContainer";
import { Section } from "@/components/shared/Section";
import { PageShell } from "@/components/marketing/PageShell";

export default function GirisPage() {
  return (
    <Section>
      <AppContainer size="narrow">
        <PageShell
          title="Giriş Yap"
          description="Kimlik doğrulama bir sonraki sprintte tamamlanacak."
          emptyTitle="Giriş formu henüz eklenmedi"
          emptyDescription="NextAuth yapısı hazır; provider ve form Sprint 2'de bağlanacak."
        />
      </AppContainer>
    </Section>
  );
}
