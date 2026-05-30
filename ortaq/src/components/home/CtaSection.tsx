import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { Button } from "@ortaq/components/ui/Button";
import { Container, Section } from "@ortaq/components/ui/Section";
import { EditorialRule } from "@ortaq/components/ui/EditorialRule";
import { typography } from "@ortaq/design/typography";
import { cn } from "@ortaq/lib/cn";

export function CtaSection() {
  const { t } = useTranslation();

  return (
    <Section spacing="quiet">
      <Container narrow>
        <EditorialRule className="mb-10 sm:mb-12" />
        <h2 className={typography.h2}>{t("cta.title")}</h2>
        <p className={cn(typography.body, "mt-4 max-w-lg")}>{t("cta.text")}</p>
        <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:gap-4">
          <Link href="/#nasil-calisir">
            <Button variant="secondary" size="default">
              {t("cta.primary")}
            </Button>
          </Link>
          <Link href="/guven">
            <Button variant="ghost" size="default">
              {t("cta.secondary")}
            </Button>
          </Link>
        </div>
        <p className="mt-6">
          <Link href="/basla" className={cn(typography.bodySm, typography.link)}>
            {t("cta.firstTime")}
          </Link>
        </p>
      </Container>
    </Section>
  );
}
