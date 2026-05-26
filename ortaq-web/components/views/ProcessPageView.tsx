"use client";

import { PublicShell } from "@/components/layout/PublicShell";
import { Container, Section } from "@/components/ui/Section";
import { ProcessTimeline } from "@/components/trust/ProcessTimeline";
import { RelatedLinks } from "@/components/seo/RelatedLinks";

export function ProcessPageView() {
  return (
    <PublicShell stickyCta={false}>
      <ProcessTimeline showAnchor={false} spacing="compact" titleAs="h1" />
      <Section spacing="compact">
        <Container narrow>
          <RelatedLinks route="nasilCalisir" />
        </Container>
      </Section>
    </PublicShell>
  );
}
