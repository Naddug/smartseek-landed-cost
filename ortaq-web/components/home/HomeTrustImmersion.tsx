"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { FadeIn } from "@/components/ui/FadeIn";
import { Container, Section } from "@/components/ui/Section";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

const items = ["1", "2", "3", "4"] as const;

/** Step 6 — trust as operational layers, not fear */
export function HomeTrustImmersion() {
  const { t } = useTranslation();

  return (
    <Section spacing="stage">
      <Container wide>
        <FadeIn className="max-w-2xl">
          <p className={typography.kicker}>{t("homeTrust.label")}</p>
          <h2 className={cn(typography.editorial, "mt-4")}>{t("homeTrust.title")}</h2>
          <p className={cn(typography.prose, "mt-6 max-w-prose editorial-rhythm")}>
            {t("homeTrust.lead")}
          </p>
        </FadeIn>

        <div className="mt-14 space-y-0 sm:mt-16">
          {items.map((key, i) => (
            <FadeIn key={key} delay={i * 60}>
              <article className="grid gap-4 border-t border-ortaq-border py-8 sm:grid-cols-[1fr_2fr] sm:gap-x-12 sm:py-10">
                <h3 className={cn(typography.h3, "text-ortaq-ink")}>
                  {t(`homeTrust.layers.${key}.title`)}
                </h3>
                <p className={cn(typography.prose, "text-ortaq-ink-muted editorial-rhythm")}>
                  {t(`homeTrust.layers.${key}.text`)}
                </p>
              </article>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={200} className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
          <Link
            href="/guven"
            className={cn(
              typography.bodySm,
              "inline-flex min-h-11 items-center bg-ortaq-ink px-5 text-ortaq-cream transition-opacity hover:opacity-90",
            )}
          >
            {t("homeTrust.ctaTrust")}
          </Link>
          <Link href="/riskler" className={cn(typography.bodySm, typography.link, "min-h-11 inline-flex items-center")}>
            {t("homeTrust.ctaRisk")}
          </Link>
        </FadeIn>
      </Container>
    </Section>
  );
}
