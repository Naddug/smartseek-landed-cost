import { AppContainer } from "@/components/shared/AppContainer";
import { PageHeader } from "@/components/shared/PageHeader";
import { Section } from "@/components/shared/Section";
import { OrtaqBulusmalariSection } from "@/components/marketing/OrtaqBulusmalariSection";
import { ORTAQ_COPY } from "@/lib/copy/ortaq-lexicon";

export default function BulusmalarPage() {
  const copy = ORTAQ_COPY.bulusmalar;

  return (
    <>
      <Section variant="surface">
        <AppContainer size="narrow">
          <PageHeader
            eyebrow="Güven & topluluk"
            title={copy.eyebrow}
            description={copy.pageDescription}
          />
        </AppContainer>
      </Section>

      <Section>
        <AppContainer>
          <OrtaqBulusmalariSection variant="full" />
        </AppContainer>
      </Section>
    </>
  );
}
