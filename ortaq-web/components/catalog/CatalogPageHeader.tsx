"use client";

import { useTranslation } from "react-i18next";
import { Container } from "@/components/ui/Section";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

export function CatalogPageHeader() {
  const { t } = useTranslation();

  return (
    <section className="border-b border-ortaq-border bg-ortaq-bg">
      <Container wide className="py-8 sm:py-10">
        <p className={cn(typography.label, "text-ortaq-ink-soft")}>{t("discovery.catalog.label")}</p>
        <h1 className="mt-2 text-[1.5rem] font-semibold tracking-[-0.02em] text-ortaq-ink sm:text-[1.75rem]">
          {t("discovery.catalog.title")}
        </h1>
        <p className={cn(typography.bodySm, "mt-3 max-w-2xl text-ortaq-ink-muted")}>{t("discovery.catalog.lead")}</p>
        <p className={cn(typography.caption, "mt-3 text-ortaq-ink-soft")}>{t("discovery.catalog.legalStrip")}</p>
      </Container>
    </section>
  );
}
