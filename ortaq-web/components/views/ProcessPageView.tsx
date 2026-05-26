"use client";

import { PublicShell } from "@/components/layout/PublicShell";
import { Container, Section, SectionHeader } from "@/components/ui/Section";
import { ProcessTimeline } from "@/components/trust/ProcessTimeline";
import { RelatedLinks } from "@/components/seo/RelatedLinks";

export function ProcessPageView() {
  return (
    <PublicShell stickyCta={false}>
      <Section spacing="compact">
        <Container narrow>
          <SectionHeader
            label="Süreç"
            title="Paya dayalı ortaklık nasıl işler?"
            description="Beş adım. SPK düzenlemesine uygun özet."
          />
        </Container>
      </Section>
      <ProcessTimeline showAnchor={false} />
      <Section spacing="compact">
        <Container narrow>
          <RelatedLinks route="nasilCalisir" />
        </Container>
      </Section>
    </PublicShell>
  );
}
