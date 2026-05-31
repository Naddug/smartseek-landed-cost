"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { PublicShell } from "@/components/layout/PublicShell";
import { Container, Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";
import { RelatedLinks } from "@/components/seo/RelatedLinks";

const stageKeys = ["1", "2", "3", "4", "5", "6"] as const;

export function EvaluationPageView() {
  const { t } = useTranslation();

  return (
    <PublicShell stickyCta={false}>
      <Section spacing="hero">
        <Container narrow>
          <p className={typography.label}>{t("evaluationPage.label")}</p>
          <h1 className={cn(typography.h1, "mt-3")}>{t("evaluationPage.title")}</h1>
          <p className={cn(typography.body, "mt-5 max-w-prose")}>{t("evaluationPage.lead")}</p>
          <p className={cn(typography.body, "mt-4 max-w-prose text-ortaq-ink-muted")}>{t("evaluationPage.leadSecondary")}</p>
          <p className={cn(typography.bodySm, "mt-3 max-w-prose font-medium text-ortaq-trust-muted")}>{t("evaluationPage.journeyContext")}</p>
          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
            <Link href="/nasil-calisir" className={cn(typography.bodySm, "font-semibold text-ortaq-trust hover:underline")}>
              {t("journey.processLink")} →
            </Link>
            <Link href="/guven" className={cn(typography.bodySm, "font-semibold text-ortaq-trust hover:underline")}>
              {t("journey.trustLink")} →
            </Link>
            <Link href="/riskler" className={cn(typography.bodySm, "font-semibold text-ortaq-trust hover:underline")}>
              {t("journey.riskLink")} →
            </Link>
          </div>
        </Container>
      </Section>

      <Section tone="alt" spacing="stage">
        <Container narrow>
          <ol className="space-y-8">
            {stageKeys.map((key) => (
              <li key={key} className="border-l-2 border-ortaq-gold/50 pl-5">
                <span className={typography.caption}>{t("evaluationPage.stageLabel", { key })}</span>
                <h2 className={cn(typography.h3, "mt-1")}>{t(`evaluationPage.stages.${key}.title`)}</h2>
                <p className={cn(typography.body, "mt-3")}>{t(`evaluationPage.stages.${key}.text`)}</p>
                <p className={cn(typography.bodySm, "mt-3 text-ortaq-ink-soft")}>
                  <span className="font-medium text-ortaq-ink">{t("evaluationPage.rejectLabel")}</span>{" "}
                  {t(`evaluationPage.stages.${key}.reject`)}
                </p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <Section spacing="compact" className="border-t border-ortaq-border">
        <Container narrow>
          <p className={typography.body}>
            {t("evaluationPage.exampleLabel")}{" "}
            <Link href="/demo/sirket/karat-parca-konya" className={typography.link}>
              {t("evaluationPage.exampleLink")}
            </Link>{" "}
            · {t("evaluationPage.exampleMeta")}
          </p>
          <Link href="/demo/sirket/karat-parca-konya" className="mt-6 inline-block">
            <Button variant="dark">{t("evaluationPage.cta")}</Button>
          </Link>
          <div className="mt-10">
            <RelatedLinks route="degerlendirme" />
          </div>
        </Container>
      </Section>
    </PublicShell>
  );
}
