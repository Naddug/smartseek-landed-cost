import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { Container, Section, SectionHeader } from "@ortaq/components/ui/Section";
import { typography } from "@ortaq/design/typography";
import { cn } from "@ortaq/lib/cn";

const itemKeys = ["1", "2", "3", "4", "5"] as const;

export function RiskDisclosure() {
  const { t } = useTranslation();

  return (
    <Section tone="warm" id="riskler" spacing="default">
      <Container narrow>
        <SectionHeader label={t("risk.label")} title={t("risk.title")} description={t("risk.intro")} />

        <div className="border-t border-ortaq-border pt-6">
          <p className={typography.body}>{t("risk.preface")}</p>

          <ol className="mt-6 space-y-0 border-y border-ortaq-border">
            {itemKeys.map((key) => (
              <li
                key={key}
                className="flex gap-4 border-b border-ortaq-border py-4 last:border-b-0 sm:py-5"
              >
                <span className="w-5 shrink-0 font-heading text-sm tabular-nums text-ortaq-ink-soft">
                  {key}
                </span>
                <span className={typography.bodySm}>{t(`risk.items.${key}`)}</span>
              </li>
            ))}
          </ol>

          <p className={cn(typography.bodySm, "mt-6 border-t border-ortaq-border pt-6")}>
            {t("risk.cooling")}
          </p>

          <Link href="/riskler" className={cn(typography.bodySm, typography.link, "mt-4 inline-block")}>
            {t("risk.fullPageLink")}
          </Link>
        </div>
      </Container>
    </Section>
  );
}
