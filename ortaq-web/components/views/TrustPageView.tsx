"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { PublicShell } from "@/components/layout/PublicShell";
import { Container, Section, SectionHeader } from "@/components/ui/Section";
import { LicenseBadge } from "@/components/trust/LicenseBadge";
import { ClaimRow } from "@/components/trust/ClaimRow";
import { ComplaintForm } from "@/components/trust/ComplaintForm";
import { TransparencySection } from "@/components/trust/TransparencySection";
import { RelatedLinks } from "@/components/seo/RelatedLinks";
import { Button } from "@/components/ui/Button";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

const infrastructureClaims = [
  { titleKey: "trustPage.claims.1.title", textKey: "trustPage.claims.1.text", status: "pending" as const },
  { titleKey: "trustPage.claims.2.title", textKey: "trustPage.claims.2.text", status: "planned" as const },
  { titleKey: "trustPage.claims.3.title", textKey: "trustPage.claims.3.text", status: "planned" as const },
] as const;

export function TrustPageView() {
  const { t } = useTranslation();

  return (
    <PublicShell stickyCta={false}>
      <Section spacing="compact">
        <Container narrow>
          <LicenseBadge className="mb-5" compact />
          <SectionHeader titleAs="h1" title={t("trustPage.title")} description={t("trustPage.subtitle")} />
          <p className={cn(typography.bodySm, "mt-4 max-w-prose font-medium text-ortaq-trust-muted")}>{t("trustPage.journeyNote")}</p>
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
            <Link href="/degerlendirme" className={cn(typography.bodySm, "font-semibold text-ortaq-trust hover:underline")}>
              {t("journey.evaluationLink")} →
            </Link>
            <Link href="/nasil-calisir" className={cn(typography.bodySm, "font-semibold text-ortaq-trust hover:underline")}>
              {t("journey.processLink")} →
            </Link>
            <Link href="/riskler" className={cn(typography.bodySm, "font-semibold text-ortaq-trust hover:underline")}>
              {t("journey.riskLink")} →
            </Link>
          </div>
        </Container>
      </Section>

      <Section tone="alt" spacing="compact">
        <Container narrow>
          <div className="border-t border-ortaq-border pt-2">
            {infrastructureClaims.map((c) => (
              <ClaimRow key={c.titleKey} {...c} />
            ))}
          </div>
          <p className={`${typography.bodySm} mt-6`}>{t("trustPage.committee.note")}</p>
        </Container>
      </Section>

      <TransparencySection />

      <Section spacing="compact">
        <Container narrow>
          <SectionHeader title={t("trustPage.support.title")} description={t("trustPage.support.intro")} />
          <p className={typography.body}>{t("trustPage.support.contact.text")}</p>
          <ComplaintForm />
          <div className="mt-8">
            <RelatedLinks route="guven" />
          </div>
          <div className="mt-8">
            <Link href="/">
              <Button variant="secondary">{t("trustPage.back")}</Button>
            </Link>
          </div>
        </Container>
      </Section>
    </PublicShell>
  );
}
