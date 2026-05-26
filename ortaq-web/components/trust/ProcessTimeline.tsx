"use client";
import { useTranslation } from "react-i18next";
import { Container, Section } from "@/components/ui/Section";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

const stepKeys = ["1", "2", "3", "4", "5"] as const;

type ProcessTimelineProps = {
  showAnchor?: boolean;
  spacing?: "default" | "stage" | "compact";
};

export function ProcessTimeline({ showAnchor = true, spacing = "default" }: ProcessTimelineProps) {
  const { t } = useTranslation();

  return (
    <Section tone="warm" id={showAnchor ? "nasil-calisir" : undefined} spacing={spacing}>
      <Container wide>
        <div className="max-w-2xl">
          <p className={typography.kicker}>{t("process.label")}</p>
          <h2 className={cn(typography.h1, "mt-3")}>{t("process.title")}</h2>
          {t("process.intro") && (
            <p className={cn(typography.lead, "mt-4")}>{t("process.intro")}</p>
          )}
        </div>

        <ol className="mt-10 border-t border-ortaq-border sm:mt-12">
          {stepKeys.map((key) => (
            <li
              key={key}
              className="grid grid-cols-[3rem_1fr] gap-x-5 border-b border-ortaq-border py-6 sm:grid-cols-[4rem_1fr] sm:gap-x-8 sm:py-7"
            >
              <span
                className="font-heading text-2xl tabular-nums text-ortaq-gold sm:text-3xl"
                aria-hidden
              >
                {key.padStart(2, "0")}
              </span>
              <div>
                <h3 className={typography.h3}>{t(`process.steps.${key}.title`)}</h3>
                <p className={cn(typography.body, "mt-2 max-w-prose")}>
                  {t(`process.steps.${key}.text`)}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  );
}
