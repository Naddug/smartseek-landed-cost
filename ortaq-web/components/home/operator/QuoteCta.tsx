"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Container } from "@/components/ui/Section";

export function QuoteCta() {
  const { t } = useTranslation();

  return (
    <section className="border-t border-ortaq-border bg-ortaq-ink">
      <Container wide>
        <div className="py-14 text-center sm:py-16">
          <h2 className="mx-auto max-w-xl text-[1.75rem] font-bold tracking-[-0.03em] text-ortaq-cream sm:text-[2rem]">
            {t("home.operator.closingCta.headline")}
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-[0.9375rem] leading-relaxed text-ortaq-cream/65">
            {t("home.operator.closingCta.subheadline")}
          </p>
          <div className="mt-8">
            <Link
              href="/teklif"
              className="inline-flex min-h-12 items-center justify-center rounded-xl bg-ortaq-trust px-8 text-[1rem] font-bold text-white shadow-sm transition-all hover:bg-ortaq-trust-deep active:scale-[0.98]"
            >
              {t("home.operator.closingCta.cta")}
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
