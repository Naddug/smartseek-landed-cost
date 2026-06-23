import { AppContainer } from "@/components/shared/AppContainer";
import { Section } from "@/components/shared/Section";
import { PageShell } from "@/components/marketing/PageShell";

export default function HakkimizdaPage() {
  return (
    <Section>
      <AppContainer size="narrow">
        <PageShell title="Hakkımızda" description="ORTAQ hakkında bilgiler burada yer alacak." />
      </AppContainer>
    </Section>
  );
}
