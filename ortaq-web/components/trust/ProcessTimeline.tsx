"use client";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Container, Section } from "@/components/ui/Section";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

const stepKeys = ["1", "2", "3", "4", "5", "6"] as const;
const journeyKeys = ["1", "2", "3", "4", "5", "6"] as const;

type ProcessTimelineProps = {
  showAnchor?: boolean;
  spacing?: "default" | "stage" | "compact";
  titleAs?: "h1" | "h2";
};

export function ProcessTimeline({ showAnchor = true, spacing = "default", titleAs = "h2" }: ProcessTimelineProps) {
  const { t } = useTranslation();
  const TitleTag = titleAs;

  return (
    <Section tone="warm" id={showAnchor ? "nasil-calisir" : undefined} spacing={spacing}>
      <Container wide>
        <div className="max-w-2xl">
          <p className={typography.label}>{t("process.label")}</p>
          <TitleTag className={cn(typography.h1, "mt-3")}>{t("process.title")}</TitleTag>
          {t("process.intro") && (
            <p className={cn(typography.body, "mt-4")}>{t("process.intro")}</p>
          )}
        </div>

        <div className="mt-8 rounded-ortaq-lg border border-ortaq-trust/15 bg-ortaq-trust-soft/25 p-4 sm:p-5">
          <p className={cn(typography.label, "text-ortaq-trust-muted")}>{t("process.journeyLabel")}</p>
          <ol className="mt-3 flex flex-wrap gap-2">
            {journeyKeys.map((key, i) => (
              <li key={key} className="flex items-center gap-2">
                <span className={cn(typography.caption, "rounded-full bg-ortaq-surface px-2.5 py-1 font-semibold text-ortaq-trust shadow-[var(--shadow-product)]")}>
                  {t(`process.journey.${key}`)}
                </span>
                {i < journeyKeys.length - 1 && (
                  <span className="hidden text-ortaq-trust-muted sm:inline" aria-hidden>
                    →
                  </span>
                )}
              </li>
            ))}
          </ol>
          <p className={cn(typography.caption, "mt-3 font-medium text-ortaq-ink-muted")}>{t("process.journeyNote")}</p>
          <div className="mt-3 flex flex-wrap gap-3">
            <Link href="/degerlendirme" className={cn(typography.caption, "font-semibold text-ortaq-trust hover:underline")}>
              {t("homeProduct.trust.evalLink")} →
            </Link>
            <Link href="/guven" className={cn(typography.caption, "font-semibold text-ortaq-trust hover:underline")}>
              {t("homeProduct.verification.link")} →
            </Link>
            <Link href="/riskler" className={cn(typography.caption, "font-semibold text-ortaq-trust hover:underline")}>
              {t("journey.riskLink")} →
            </Link>
          </div>
        </div>

        <ol className="mt-10 border-t border-ortaq-border sm:mt-12">
          {stepKeys.map((key) => (
            <li
              key={key}
              className="grid grid-cols-[3rem_1fr] gap-x-5 border-b border-ortaq-border py-6 sm:grid-cols-[4rem_1fr] sm:gap-x-8 sm:py-7"
            >
              <span
                className="text-2xl font-semibold tabular-nums text-ortaq-ink-muted sm:text-3xl"
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
