"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Container, Section } from "@/components/ui/Section";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

export function HomeMissionSection() {
  const { t } = useTranslation();

  return (
    <Section tone="dark" spacing="stage">
      <Container narrow>
        <p className={typography.kickerLight}>{t("homeMission.label")}</p>
        <h2 className={cn(typography.h1, "mt-4 text-ortaq-cream")}>{t("homeMission.title")}</h2>
        <div className="mt-8 space-y-5">
          <p className={cn(typography.leadLight, "max-w-prose")}>{t("homeMission.p1")}</p>
          <p className={cn(typography.body, "max-w-prose text-ortaq-cream/75")}>{t("homeMission.p2")}</p>
          <p className={cn(typography.body, "max-w-prose text-ortaq-cream/75")}>{t("homeMission.p3")}</p>
        </div>
        <blockquote className={cn(typography.bodySm, "mt-10 border-l-2 border-ortaq-gold/50 pl-5 text-ortaq-cream/80")}>
          {t("homeMission.founderNote")}
          <footer className={cn(typography.caption, "mt-3 text-ortaq-cream/50")}>
            {t("homeMission.founderSign")}
          </footer>
        </blockquote>
        <Link href="/degerlendirme" className={cn(typography.bodySm, typography.linkLight, "mt-8 inline-block")}>
          {t("homeMission.link")}
        </Link>
      </Container>
    </Section>
  );
}
