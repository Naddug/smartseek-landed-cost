"use client";

import { useTranslation } from "react-i18next";
import { Container } from "@/components/ui/Section";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

export function MarketInfrastructureBar() {
  const { t } = useTranslation();

  return (
    <div className="border-b border-ortaq-border bg-ortaq-bg-alt">
      <Container wide className="py-4 sm:py-5">
        <p className={cn(typography.bodySm, "text-ortaq-ink-muted")}>{t("market.infrastructure.role")}</p>
        <p className={cn(typography.caption, "mt-2 text-ortaq-ink-soft")}>{t("market.infrastructure.operator")}</p>
      </Container>
    </div>
  );
}
