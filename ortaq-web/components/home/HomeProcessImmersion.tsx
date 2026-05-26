"use client";

import { useTranslation } from "react-i18next";
import { FadeIn } from "@/components/ui/FadeIn";
import { Container, Section } from "@/components/ui/Section";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

const stepKeys = ["1", "2", "3", "4", "5"] as const;

/** Step 7 — participation process, editorial pacing */
export function HomeProcessImmersion() {
  const { t } = useTranslation();

  return (
    <Section tone="warm" id="nasil-calisir" spacing="stage">
      <Container wide>
        <FadeIn className="max-w-xl">
          <p className={typography.kicker}>{t("process.label")}</p>
          <h2 className={cn(typography.editorial, "mt-4")}>{t("process.title")}</h2>
          <p className={cn(typography.prose, "mt-6 editorial-rhythm")}>{t("process.intro")}</p>
        </FadeIn>

        <ol className="mt-12 sm:mt-16">
          {stepKeys.map((key, i) => (
            <FadeIn key={key} delay={i * 50}>
              <li className="grid grid-cols-[2.5rem_1fr] gap-x-5 border-t border-ortaq-border py-7 sm:grid-cols-[3.5rem_1fr] sm:gap-x-10 sm:py-9">
                <span
                  className="font-heading text-xl tabular-nums text-ortaq-gold sm:text-2xl"
                  aria-hidden
                >
                  {key.padStart(2, "0")}
                </span>
                <div>
                  <h3 className={typography.h3}>{t(`process.steps.${key}.title`)}</h3>
                  <p className={cn(typography.prose, "mt-3 max-w-prose editorial-rhythm")}>
                    {t(`process.steps.${key}.text`)}
                  </p>
                </div>
              </li>
            </FadeIn>
          ))}
        </ol>
      </Container>
    </Section>
  );
}
