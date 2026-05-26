"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Container } from "@/components/ui/Section";
import { SignalRegistry } from "@/components/intelligence/SignalRegistry";
import { IntelReveal } from "@/components/intelligence/IntelReveal";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

const openKeys = ["1", "2", "3", "4"] as const;
const closedKeys = ["1", "2", "3", "4"] as const;

export function ProductGatewayBrief() {
  const { t } = useTranslation();

  return (
    <section className="product-section product-divider bg-ortaq-bg-alt">
      <Container wide>
        <IntelReveal>
          <div className="mb-5 sm:mb-6">
            <p className={typography.label}>{t("homeProduct.why.label")}</p>
            <h2 className={cn(typography.h1, "mt-1 max-w-2xl")}>{t("homeProduct.why.title")}</h2>
            <p className={cn(typography.bodySm, "mt-2 max-w-2xl")}>{t("homeProduct.why.lead")}</p>
          </div>
        </IntelReveal>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-5">
          <IntelReveal delay={40} className="product-card p-4 sm:p-5">
            <p className={cn(typography.label, "text-ortaq-trust-muted")}>{t("homeProduct.access.openLabel")}</p>
            <ul className="mt-3 space-y-2">
              {openKeys.map((key) => (
                <li key={key} className={cn(typography.bodySm, "text-ortaq-ink-muted")}>
                  {t(`homeProduct.why.most.${key}`)}
                </li>
              ))}
            </ul>
          </IntelReveal>

          <IntelReveal delay={80} className="product-card border-ortaq-trust/25 bg-ortaq-trust-soft/40 p-4 sm:p-5">
            <p className={cn(typography.label, "text-ortaq-trust")}>{t("homeProduct.access.closedLabel")}</p>
            <ul className="mt-3 space-y-2">
              {closedKeys.map((key) => (
                <li key={key} className={cn(typography.bodySm, "font-medium text-ortaq-ink")}>
                  {t(`homeProduct.why.few.${key}`)}
                </li>
              ))}
            </ul>
            <p className={cn(typography.caption, "mt-4 border-t border-ortaq-trust/15 pt-3 text-ortaq-ink-muted")}>
              {t("homeProduct.why.barrier")}
            </p>
          </IntelReveal>

          <IntelReveal delay={120} className="min-w-0">
            <div className="mb-2 flex items-baseline justify-between gap-3">
              <p className={typography.label}>{t("homeProduct.signals.label")}</p>
              <Link href="#dosyalar" className={cn(typography.caption, typography.link)}>
                {t("homeProduct.companies.viewAll")} →
              </Link>
            </div>
            <SignalRegistry variant="panel" />
            <p className={cn(typography.caption, "mt-2")}>{t("homeProduct.why.ortaq")}</p>
          </IntelReveal>
        </div>
      </Container>
    </section>
  );
}
