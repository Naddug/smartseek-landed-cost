import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { PublicShell } from "@ortaq/components/layout/PublicShell";
import { Container, Section } from "@ortaq/components/ui/Section";
import { Button } from "@ortaq/components/ui/Button";

export default function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <PublicShell stickyCta={false}>
      <Section spacing="hero">
        <Container narrow>
          <div className="text-center">
            <h1 className="font-heading text-4xl text-ortaq-ink">{t("notFound.title")}</h1>
            <Link href="/" className="mt-8 inline-block">
              <Button variant="secondary">{t("notFound.back")}</Button>
            </Link>
          </div>
        </Container>
      </Section>
    </PublicShell>
  );
}
