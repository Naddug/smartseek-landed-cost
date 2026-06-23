import Link from "next/link";
import { AppContainer } from "@/components/shared/AppContainer";
import { Section } from "@/components/shared/Section";
import { PageShell } from "@/components/marketing/PageShell";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";

export default function KayitPage() {
  return (
    <Section>
      <AppContainer size="narrow">
        <PageShell
          title="Kayıt Ol"
          description="Fırsat sahibi veya ortak olarak kayıt yolunuzu seçin."
        >
          <EmptyState
            title="Kayıt yolunu seçin"
            description="ORTAQ'a fırsat sahibi veya ortak olarak katılmak için yol seçimi ekranından devam edin."
            action={
              <Link href="/kayit/yol-secimi">
                <Button>Yol Seçimine Git</Button>
              </Link>
            }
          />
        </PageShell>
      </AppContainer>
    </Section>
  );
}
