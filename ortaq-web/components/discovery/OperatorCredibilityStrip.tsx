"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Container } from "@/components/ui/Section";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

const employers = ["lego", "petlas", "yigit"] as const;

export function OperatorCredibilityStrip() {
  const { t } = useTranslation();

  return (
    <section className="border-b border-ortaq-border bg-ortaq-surface" aria-label={t("discovery.home.operator.aria")}>
      <Container wide className="py-4 sm:py-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className={cn(typography.label, "text-ortaq-ink-soft")}>{t("discovery.home.operator.label")}</p>
            <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
              {employers.map((k) => (
                <li key={k} className={cn(typography.bodySm, "text-ortaq-ink")}>
                  {t(`discovery.home.operator.employers.${k}`)}
                </li>
              ))}
            </ul>
          </div>
          <Link href="/ekip" className={cn(typography.caption, typography.link, "shrink-0 font-medium")}>
            {t("discovery.home.operator.link")} →
          </Link>
        </div>
      </Container>
    </section>
  );
}
