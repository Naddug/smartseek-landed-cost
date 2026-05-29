"use client";

import { useTranslation } from "react-i18next";
import { Container } from "@/components/ui/Section";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

const pointKeys = ["1", "2", "3"] as const;

export function HomepageCompliance() {
  const { t } = useTranslation();

  return (
    <section
      id="uyum"
      className="border-b border-ortaq-border bg-ortaq-ink-panel scroll-mt-20"
      aria-label={t("homeLanding.compliance.aria")}
    >
      <Container wide className="py-8 sm:py-9">
        <p className={cn(typography.label, "text-ortaq-cream/50")}>{t("homeLanding.compliance.label")}</p>
        <p className={cn(typography.bodySm, "mt-2 max-w-2xl font-medium text-ortaq-cream")}>
          {t("homeLanding.compliance.title")}
        </p>
        <ul className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-x-8">
          {pointKeys.map((key) => (
            <li key={key} className={cn(typography.caption, "text-ortaq-cream/75")}>
              · {t(`homeLanding.compliance.points.${key}`)}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
