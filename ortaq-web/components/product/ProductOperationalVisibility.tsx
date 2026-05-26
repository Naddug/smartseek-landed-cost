"use client";

import { useTranslation } from "react-i18next";
import { Container } from "@/components/ui/Section";
import { SignalRegistry } from "@/components/intelligence/SignalRegistry";
import { IntelReveal } from "@/components/intelligence/IntelReveal";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

export function ProductOperationalVisibility() {
  const { t } = useTranslation();

  return (
    <section className="intel-band-ink product-section product-divider">
      <Container wide>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,0.85fr)_1.15fr] lg:items-start lg:gap-10">
          <IntelReveal className="relative min-w-0">
            <span className="intel-section-mark absolute -top-2 right-0 hidden lg:block" aria-hidden>
              02
            </span>
            <p className={cn(typography.label, "text-ortaq-cream/50")}>{t("homeProduct.visibility.label")}</p>
            <h2
              className={cn(
                typography.h1,
                "mt-1 max-w-[13ch] text-ortaq-cream text-[1.5rem] sm:text-[1.625rem] lg:text-[1.75rem]",
              )}
            >
              {t("homeProduct.visibility.title")}
            </h2>
            <p className={cn(typography.bodySm, "mt-4 max-w-sm text-ortaq-cream/65")}>{t("homeProduct.visibility.lead")}</p>
          </IntelReveal>

          <IntelReveal delay={90}>
            <SignalRegistry variant="strip" tone="dark" />
          </IntelReveal>
        </div>
      </Container>
    </section>
  );
}
