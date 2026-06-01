"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { PublicShell } from "@/components/layout/PublicShell";
import { TeamGridSection } from "@/components/team/TeamGrid";
import { Container, Section, SectionHeader } from "@/components/ui/Section";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

export function TeamPageView() {
  const { t } = useTranslation();

  return (
    <PublicShell stickyCta={false}>
      <Section spacing="compact">
        <Container narrow>
          <SectionHeader titleAs="h1" title={t("teamPage.title")} description={t("teamPage.subtitle")} />
          <p className={cn(typography.bodySm, "mt-6 max-w-prose leading-relaxed text-ortaq-ink-muted")}>
            {t("teamPage.principle")}
          </p>
        </Container>
      </Section>

      <section className="border-t border-ortaq-border bg-ortaq-bg-alt pb-12 sm:pb-16 lg:pb-20">
        <div className="pt-10 sm:pt-12">
          <TeamGridSection />
        </div>
        <Container wide className="mt-10 border-t border-ortaq-border pt-8">
          <p className={cn(typography.bodySm, "max-w-2xl text-ortaq-ink-muted")}>{t("teamPage.closing")}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/#basvuru"
              className="inline-flex min-h-11 items-center justify-center rounded-ortaq-md bg-ortaq-ink px-5 text-[0.875rem] font-semibold text-ortaq-cream transition-opacity hover:opacity-90"
            >
              {t("teamPage.ctaProducer")}
            </Link>
            <Link
              href="/nasil-calisir"
              className="inline-flex min-h-11 items-center justify-center rounded-ortaq-md border border-ortaq-border-strong px-5 text-[0.875rem] font-semibold text-ortaq-ink transition-colors hover:bg-ortaq-bg-alt"
            >
              {t("teamPage.ctaProcess")}
            </Link>
          </div>
        </Container>
      </section>
    </PublicShell>
  );
}
