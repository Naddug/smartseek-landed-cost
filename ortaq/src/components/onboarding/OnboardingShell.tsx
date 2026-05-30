"use client";

import type { ReactNode } from "react";
import { PublicShell } from "@ortaq/components/layout/PublicShell";
import { Container, Section } from "@ortaq/components/ui/Section";
import { ReassuranceNote } from "@ortaq/components/onboarding/ReassuranceNote";

type OnboardingShellProps = {
  children: ReactNode;
  banner: string;
  footerNote?: string;
};

/** Onboarding layout: no sticky CTA, calm reassurance strip. */
export function OnboardingShell({ children, banner, footerNote }: OnboardingShellProps) {
  return (
    <PublicShell stickyCta={false}>
      <div className="border-b border-ortaq-border bg-ortaq-bg-alt">
        <Container narrow>
          <p className="py-3 text-center text-xs leading-[1.55] text-ortaq-ink-muted">{banner}</p>
        </Container>
      </div>
      {children}
      {footerNote && (
        <Section spacing="compact">
          <Container narrow>
            <ReassuranceNote className="text-center">{footerNote}</ReassuranceNote>
          </Container>
        </Section>
      )}
    </PublicShell>
  );
}
