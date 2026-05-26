"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { PublicShell } from "@/components/layout/PublicShell";
import { Container, Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <PublicShell stickyCta={false}>
      <Section spacing="hero">
        <Container narrow>
          <div className="text-center">
            <h1 className="text-3xl font-semibold tracking-[-0.02em] text-ortaq-ink">{t("notFound.title")}</h1>
            <Link href="/" className="mt-8 inline-block">
              <Button variant="secondary">{t("notFound.back")}</Button>
            </Link>
          </div>
        </Container>
      </Section>
    </PublicShell>
  );
}
