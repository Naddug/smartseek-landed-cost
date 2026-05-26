"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { FadeIn } from "@/components/ui/FadeIn";
import { Container, Section } from "@/components/ui/Section";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

/** Step 3 — why productive ownership matters */
export function HomeWhyMatters() {
  const { t } = useTranslation();

  return (
    <Section spacing="stage" tone="warm">
      <Container narrow>
        <FadeIn>
          <p className={typography.kicker}>{t("homeWhy.label")}</p>
          <h2 className={cn(typography.editorial, "mt-4")}>{t("homeWhy.title")}</h2>
        </FadeIn>

        <FadeIn delay={120} className="mt-10 space-y-7 sm:mt-12">
          <p className={cn(typography.prose, "max-w-prose editorial-rhythm")}>{t("homeWhy.p1")}</p>
          <p className={cn(typography.prose, "max-w-prose editorial-rhythm")}>{t("homeWhy.p2")}</p>
          <p className={cn(typography.body, "max-w-prose text-ortaq-ink-soft")}>{t("homeWhy.p3")}</p>
        </FadeIn>

        <FadeIn delay={200}>
          <blockquote
            className={cn(
              typography.body,
              "mt-12 border-l border-ortaq-gold/60 pl-5 text-ortaq-ink-muted sm:pl-6",
            )}
          >
            {t("homeWhy.quote")}
          </blockquote>
          <Link
            href="/nasil-calisir"
            className={cn(typography.bodySm, typography.link, "mt-8 inline-flex min-h-11 items-center")}
          >
            {t("homeWhy.link")}
          </Link>
        </FadeIn>
      </Container>
    </Section>
  );
}
