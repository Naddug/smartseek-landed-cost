"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Container } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

const steps = ["1", "2", "3"] as const;

export function ProductCtaSection() {
  const { t } = useTranslation();

  return (
    <section className="product-section bg-ortaq-bg">
      <Container wide>
        <div className="product-card grid gap-6 p-5 sm:p-6 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-8">
          <div>
            <p className={typography.label}>{t("homeProduct.cta.eyebrow")}</p>
            <h2 className={cn(typography.h1, "mt-1")}>{t("homeProduct.cta.title")}</h2>
            <p className={cn(typography.body, "mt-2 max-w-xl")}>{t("homeProduct.cta.text")}</p>

            <ol className="mt-4 grid gap-2 sm:grid-cols-3">
              {steps.map((key) => (
                <li key={key} className="rounded-ortaq-sm border border-ortaq-border bg-ortaq-bg-alt/50 px-3 py-2">
                  <p className={cn(typography.caption, "font-medium text-ortaq-trust-muted")}>
                    {t(`homeProduct.process.home.${key}.title`)}
                  </p>
                  <p className={cn(typography.caption, "mt-0.5 text-ortaq-ink-muted")}>
                    {t(`homeProduct.process.home.${key}.text`)}
                  </p>
                </li>
              ))}
            </ol>

            <p className={cn(typography.caption, "mt-4")}>{t("homeProduct.cta.note")}</p>
          </div>

          <div className="flex flex-col gap-2 sm:items-stretch lg:items-end">
            <Link href="#dosyalar">
              <Button variant="primary" size="lg" className="w-full min-w-[220px] lg:w-auto">
                {t("homeProduct.cta.primary")}
              </Button>
            </Link>
            <Link href="/guven" className={cn(typography.bodySm, typography.link, "text-center lg:text-right")}>
              {t("homeProduct.verification.link")} →
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
