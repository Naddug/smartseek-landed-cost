"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Container } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

export function AccessCta() {
  const { t } = useTranslation();

  return (
    <section className="authority-cta border-t border-black/20 bg-ortaq-trust-deep text-ortaq-cream">
      <Container wide>
        <div className="grid gap-8 py-10 sm:py-12 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-12">
          <div className="max-w-lg">
            <p className={cn(typography.label, "text-ortaq-cream/45")}>{t("homeProduct.discovery.access.label")}</p>
            <h2 className="mt-2 font-body text-[1.75rem] font-semibold leading-[1.08] tracking-[-0.025em] text-ortaq-cream sm:text-[2rem]">
              {t("homeProduct.discovery.access.title")}
            </h2>
            <p className={cn(typography.body, "mt-4 text-ortaq-cream/75")}>{t("homeProduct.discovery.access.lead")}</p>
            <p className={cn(typography.caption, "mt-4 text-ortaq-cream/40")}>{t("homeProduct.cta.note")}</p>
          </div>
          <div className="flex flex-col gap-3">
            <Link href="#dosyalar">
              <Button variant="light" size="lg" className="min-w-[240px]">
                {t("homeProduct.discovery.access.cta")}
              </Button>
            </Link>
            <Link
              href="/nasil-calisir"
              className={cn(typography.bodySm, "text-center font-medium text-ortaq-cream/65 hover:text-ortaq-cream hover:underline lg:text-right")}
            >
              {t("homeProduct.hero.ctaSecondary")} →
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
