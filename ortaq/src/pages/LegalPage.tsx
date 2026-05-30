import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { PublicShell } from "@ortaq/components/layout/PublicShell";
import { Container, Section } from "@ortaq/components/ui/Section";
import { Button } from "@ortaq/components/ui/Button";

type LegalPageProps = {
  type: "privacy" | "terms";
};

export function LegalPage({ type }: LegalPageProps) {
  const { t } = useTranslation();
  const prefix = `legal.${type}`;

  return (
    <PublicShell stickyCta={false}>
      <Section spacing="hero">
        <Container narrow>
          <p className="text-xs text-ortaq-ink-soft">{t(`${prefix}.updated`)}</p>
          <h1 className="mt-2 font-heading text-4xl text-ortaq-ink">{t(`${prefix}.title`)}</h1>
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

export default function PrivacyPage() {
  return <LegalPage type="privacy" />;
}
