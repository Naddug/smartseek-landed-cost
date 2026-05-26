"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Section";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

export function InvestCta() {
  const { t } = useTranslation();

  return (
    <section className="invest-cta product-section border-t border-ortaq-border bg-gradient-to-b from-ortaq-surface via-ortaq-bg to-ortaq-trust-deep/[0.08] pb-0">
      <Container wide className="pb-10 sm:pb-12">
        <div className="rounded-ortaq-lg border border-ortaq-trust/25 bg-gradient-to-br from-ortaq-trust-deep via-ortaq-trust to-ortaq-trust-muted px-6 py-10 text-center text-ortaq-cream shadow-[var(--shadow-elevated)] transition-shadow duration-200 hover:shadow-[var(--shadow-elevated-hover)] sm:px-10 sm:py-12">
          <h2 className="font-body text-[1.625rem] font-semibold leading-tight tracking-[-0.02em] sm:text-[2rem]">
            {t("homeProduct.invest.cta.title")}
          </h2>
          <p className={cn(typography.body, "mx-auto mt-3 max-w-lg text-ortaq-cream/80")}>{t("homeProduct.invest.cta.lead")}</p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center">
            <Link href="#firsatlar" className="w-full sm:w-auto">
              <Button variant="light" size="lg" fullWidth className="sm:min-w-[220px] sm:w-auto">
                {t("homeProduct.invest.cta.primary")}
              </Button>
            </Link>
            <Link href="/nasil-calisir" className="w-full sm:w-auto">
              <Button variant="outlineLight" size="lg" fullWidth className="sm:w-auto">
                {t("homeProduct.invest.hero.ctaSecondary")}
              </Button>
            </Link>
          </div>
          <p className={cn(typography.caption, "mt-4 text-ortaq-cream/50")}>{t("homeProduct.cta.note")}</p>
        </div>
      </Container>
    </section>
  );
}
