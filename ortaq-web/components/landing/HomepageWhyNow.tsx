"use client";

import { useTranslation } from "react-i18next";
import { Container } from "@/components/ui/Section";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

export function HomepageWhyNow() {
  const { t } = useTranslation();

  return (
    <section
      className="border-b border-ortaq-border bg-ortaq-bg-alt"
      aria-label={t("homeLanding.whyNow.aria")}
    >
      <Container wide className="py-6 sm:py-7">
        <p className={typography.label}>{t("homeLanding.whyNow.label")}</p>
        <p className={cn(typography.body, "mt-2 max-w-3xl font-medium text-ortaq-ink")}>
          {t("homeLanding.whyNow.text")}
        </p>
      </Container>
    </section>
  );
}
