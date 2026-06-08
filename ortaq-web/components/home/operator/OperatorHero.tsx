"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Container } from "@/components/ui/Section";

export function OperatorHero() {
  const { t } = useTranslation();

  return (
    <section className="border-b border-ortaq-border bg-ortaq-surface">
      <Container wide>
        <div className="py-12 text-center sm:py-16">
          <h1 className="mx-auto max-w-3xl font-body text-[2rem] font-bold leading-[1.1] tracking-[-0.04em] text-ortaq-ink sm:text-[2.75rem]">
            {t("home.operator.hero.headline")}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-[0.9375rem] leading-[1.75] text-ortaq-ink-muted sm:text-[1rem]">
            {t("home.operator.hero.subheadline")}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/teklif"
              className="inline-flex min-h-11 items-center justify-center rounded-lg bg-ortaq-trust px-7 text-[0.9375rem] font-bold text-white shadow-sm transition-all hover:bg-ortaq-trust-deep active:scale-[0.98]"
            >
              {t("home.operator.hero.ctaPrimary")}
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex min-h-11 items-center justify-center rounded-lg border border-ortaq-border px-5 text-[0.9375rem] font-medium text-ortaq-ink-muted transition-colors hover:border-ortaq-border-strong hover:text-ortaq-ink"
            >
              {t("home.operator.hero.ctaSecondary")}
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
