"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { PublicShell } from "@/components/layout/PublicShell";
import { Container, Section, SectionHeader } from "@/components/ui/Section";
import { ProseBlock } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { RelatedLinks } from "@/components/seo/RelatedLinks";

const sectionKeys = ["1", "2", "3", "4", "5", "6", "7"] as const;

export function RiskPageView() {
  const { t } = useTranslation();

  return (
    <PublicShell stickyCta={false}>
      <Section spacing="hero">
        <Container narrow>
          <SectionHeader titleAs="h1" title={t("riskPage.title")} description={t("riskPage.subtitle")} />
          <p className="-mt-4 text-sm leading-[1.65] text-ortaq-ink-soft">{t("riskPage.notAdvice")}</p>
        </Container>
      </Section>

      <Section tone="alt" spacing="compact">
        <Container narrow>
          <div className="space-y-3">
            {sectionKeys.map((key) => (
              <ProseBlock
                key={key}
                title={t(`riskPage.sections.${key}.title`)}
                description={t(`riskPage.sections.${key}.text`)}
              />
            ))}
          </div>

          <div className="product-card mt-6 p-4 sm:p-5">
            <h2 className="text-base font-semibold text-ortaq-ink">{t("riskPage.help.title")}</h2>
            <p className="mt-2 text-sm leading-[1.65] text-ortaq-ink-muted">{t("riskPage.help.text")}</p>
            <p className="mt-3 text-sm text-ortaq-ink-soft">{t("riskPage.help.email")}</p>
          </div>

          <div className="mt-8">
            <RelatedLinks route="riskler" />
          </div>

          <div className="mt-8 text-center">
            <Link href="/">
              <Button variant="secondary">{t("riskPage.back")}</Button>
            </Link>
          </div>
        </Container>
      </Section>
    </PublicShell>
  );
}
