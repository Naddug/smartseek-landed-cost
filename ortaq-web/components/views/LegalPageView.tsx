"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { PublicShell } from "@/components/layout/PublicShell";
import { Container, Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

type LegalPageViewProps = {
  type: "privacy" | "terms";
};

export function LegalPageView({ type }: LegalPageViewProps) {
  const { t } = useTranslation();
  const prefix = `legal.${type}`;
  const sectionKeys = t(`${prefix}.sections`, { returnObjects: true }) as Record<string, { title: string; body: string }> | string;
  const sections =
    typeof sectionKeys === "object"
      ? Object.keys(sectionKeys)
          .sort((a, b) => Number(a) - Number(b))
          .map((key) => sectionKeys[key])
      : [];

  return (
    <PublicShell stickyCta={false}>
      <Section spacing="hero">
        <Container narrow>
          <p className="text-xs text-ortaq-ink-soft">{t(`${prefix}.updated`)}</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-[-0.02em] text-ortaq-ink">{t(`${prefix}.title`)}</h1>
          {t(`${prefix}.intro`, { defaultValue: "" }) && (
            <p className={cn(typography.body, "mt-4 text-ortaq-ink-muted")}>{t(`${prefix}.intro`)}</p>
          )}
          <div className="mt-8 space-y-8">
            {sections.map((section) => (
              <section key={section.title}>
                <h2 className={cn(typography.h3, "text-ortaq-ink")}>{section.title}</h2>
                <p className={cn(typography.body, "mt-2 leading-relaxed text-ortaq-ink-muted")}>{section.body}</p>
              </section>
            ))}
          </div>
          <p className={cn(typography.caption, "mt-10 text-ortaq-ink-soft")}>
            {t(`${prefix}.contact`, { defaultValue: "Sorularınız için destek@ortaq.biz" })}
          </p>
          <Link href="/" className="mt-6 inline-block">
            <Button variant="secondary">{t("legal.back")}</Button>
          </Link>
        </Container>
      </Section>
    </PublicShell>
  );
}
