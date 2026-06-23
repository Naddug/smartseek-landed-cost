import { AppContainer } from "@/components/shared/AppContainer";
import { Section } from "@/components/shared/Section";
import { PageShell } from "@/components/marketing/PageShell";

export default function SssPage() {
  return (
    <Section>
      <AppContainer size="narrow">
        <PageShell title="Sık Sorulan Sorular" description="SSS içeriği bir sonraki sprintte eklenecek." />
      </AppContainer>
    </Section>
  );
}
