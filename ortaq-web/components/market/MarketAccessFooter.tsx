"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Container } from "@/components/ui/Section";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

export function MarketAccessFooter() {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-ortaq-border bg-ortaq-bg">
      <Container wide className="py-6 sm:py-8">
        <p className={cn(typography.bodySm, "text-ortaq-ink-muted")}>{t("market.access.operator")}</p>
        <Link href="/nasil-calisir" className={cn(typography.caption, "mt-3 inline-block font-medium text-ortaq-ink-soft hover:text-ortaq-ink hover:underline")}>
          {t("market.access.how")} →
        </Link>
      </Container>
    </footer>
  );
}
