"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { PublicShell } from "@/components/layout/PublicShell";
import { Container, Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";

type LegalPageViewProps = {
  type: "privacy" | "terms";
};

export function LegalPageView({ type }: LegalPageViewProps) {
  const { t } = useTranslation();
  const prefix = `legal.${type}`;

  return (
    <PublicShell stickyCta={false}>
      <Section spacing="hero">
        <Container narrow>
          <p className="text-xs text-ortaq-ink-soft">{t(`${prefix}.updated`)}</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-[-0.02em] text-ortaq-ink">{t(`${prefix}.title`)}</h1>
          <div className="mt-8 space-y-4 text-base leading-relaxed text-ortaq-ink-muted">
            <p>{t(`${prefix}.p1`)}</p>
            <p>{t(`${prefix}.p2`)}</p>
            <p>{t(`${prefix}.p3`)}</p>
          </div>
          <Link href="/" className="mt-10 inline-block">
            <Button variant="secondary">{t("legal.back")}</Button>
          </Link>
        </Container>
      </Section>
    </PublicShell>
  );
}
