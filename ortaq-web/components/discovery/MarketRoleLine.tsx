"use client";

import { useTranslation } from "react-i18next";
import { Container } from "@/components/ui/Section";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

/** One sentence: what ORTAQ does in the market (not a process wall). */
export function MarketRoleLine() {
  const { t } = useTranslation();

  return (
    <div className="border-b border-ortaq-border bg-ortaq-bg-alt">
      <Container wide className="py-4 sm:py-5">
        <p className={cn(typography.bodySm, "max-w-3xl text-ortaq-ink-muted")}>{t("discovery.home.marketRole")}</p>
      </Container>
    </div>
  );
}
