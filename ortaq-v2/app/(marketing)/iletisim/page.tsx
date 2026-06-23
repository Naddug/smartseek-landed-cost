import { AppContainer } from "@/components/shared/AppContainer";
import { Section } from "@/components/shared/Section";
import { PageShell } from "@/components/marketing/PageShell";

export default function IletisimPage() {
  return (
    <Section>
      <AppContainer size="narrow">
        <PageShell title="İletişim" description="İletişim formu ve bilgileri burada yer alacak." />
      </AppContainer>
    </Section>
  );
}
