"use client";

import { useTranslation } from "react-i18next";
import { Container } from "@/components/ui/Section";
import { IntelReveal } from "@/components/intelligence/IntelReveal";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

export function ProductAccessTension() {
  const { t } = useTranslation();

  return (
    <section className="intel-band-trust border-b border-black/10">
      <Container wide>
        <IntelReveal>
          <div className="grid gap-6 py-7 sm:grid-cols-[1fr_auto_1.15fr] sm:items-center sm:py-8">
            <div className="sm:pr-4">
              <p className={cn(typography.label, "text-ortaq-cream/45")}>{t("homeProduct.access.openLabel")}</p>
              <p className={cn(typography.bodySm, "mt-1.5 text-ortaq-cream/60")}>{t("homeProduct.access.open")}</p>
            </div>

            <div className="hidden h-14 w-px bg-ortaq-cream/15 sm:block" aria-hidden />

            <div className="border-l-2 border-ortaq-cream/35 pl-5 sm:border-l-0 sm:pl-0">
              <p className={cn(typography.label, "text-ortaq-cream/70")}>{t("homeProduct.access.closedLabel")}</p>
              <p className="mt-2 max-w-md font-body text-[1.0625rem] font-semibold leading-snug tracking-[-0.02em] text-ortaq-cream sm:text-[1.1875rem]">
                {t("homeProduct.access.closed")}
              </p>
            </div>
          </div>
        </IntelReveal>
      </Container>
    </section>
  );
}
