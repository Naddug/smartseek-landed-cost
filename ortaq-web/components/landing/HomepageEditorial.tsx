"use client";

import { useTranslation } from "react-i18next";
import { Container } from "@/components/ui/Section";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

const lineKeys = ["1", "2", "3", "4"] as const;

export function HomepageEditorial() {
  const { t } = useTranslation();

  return (
    <section
      className="border-b border-ortaq-border bg-ortaq-bg"
      aria-label={t("homeLanding.editorial.aria")}
    >
      <Container wide className="py-10 sm:py-12">
        <h2 className={cn(typography.h1, "text-[1.375rem] sm:text-[1.5rem]")}>
          {t("homeLanding.editorial.title")}
        </h2>
        <div className="mt-5 max-w-[40rem] space-y-3">
          {lineKeys.map((key) => (
            <p key={key} className={cn(typography.body, "text-ortaq-ink-muted")}>
              {t(`homeLanding.editorial.lines.${key}`)}
            </p>
          ))}
        </div>
      </Container>
    </section>
  );
}
