"use client";

import { useTranslation } from "react-i18next";
import { Container } from "@/components/ui/Section";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

/** Single-line operator credibility below movement feed. */
export function OperatorTrustLine() {
  const { t } = useTranslation();

  return (
    <div className="border-b border-ortaq-border bg-ortaq-bg-alt" aria-label={t("discovery.home.operator.aria")}>
      <Container wide className="py-3 sm:py-3.5">
        <p className={cn(typography.bodySm, "text-ortaq-ink-muted")}>{t("discovery.home.operator.trustLine")}</p>
      </Container>
    </div>
  );
}
