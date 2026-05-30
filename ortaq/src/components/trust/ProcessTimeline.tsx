import { useTranslation } from "react-i18next";
import { Container, Section, SectionHeader } from "@ortaq/components/ui/Section";
import { typography } from "@ortaq/design/typography";
import { cn } from "@ortaq/lib/cn";

const stepKeys = ["1", "2", "3", "4", "5"] as const;

export function ProcessTimeline() {
  const { t } = useTranslation();

  return (
    <Section tone="alt" id="nasil-calisir" spacing="default">
      <Container narrow>
        <SectionHeader label={t("process.label")} title={t("process.title")} description={t("process.intro")} />

        <ol className="border-t border-ortaq-border">
          {stepKeys.map((key) => (
            <li
              key={key}
              className="grid grid-cols-[2.75rem_1fr] gap-x-5 border-b border-ortaq-border py-6 sm:grid-cols-[3.5rem_1fr] sm:gap-x-6 sm:py-7"
            >
              <span
                className="font-heading text-2xl tabular-nums leading-none text-ortaq-ink-soft sm:text-3xl"
                aria-hidden
              >
                {key.padStart(2, "0")}
              </span>
              <div>
                <h3 className={typography.h3}>{t(`process.steps.${key}.title`)}</h3>
                <p className={cn(typography.bodySm, "mt-2")}>{t(`process.steps.${key}.text`)}</p>
              </div>
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  );
}
