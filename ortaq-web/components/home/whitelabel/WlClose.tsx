"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Container } from "@/components/ui/Section";

export function WlClose() {
  const { t } = useTranslation();

  return (
    <section className="bg-ortaq-trust-deep py-16 sm:py-20">
      <Container narrow className="text-center">
        <h2 className="font-heading text-[1.75rem] font-semibold tracking-[-0.03em] text-white sm:text-[2.25rem]">
          {t("home.whitelabel.close.headline")}
        </h2>
        <p className="mx-auto mt-4 max-w-md text-[1rem] leading-relaxed text-white/75">
          {t("home.whitelabel.close.subheadline")}
        </p>
        <Link
          href="/teklif"
          className="mt-8 inline-flex min-h-12 items-center justify-center rounded-md bg-white px-8 text-[0.9375rem] font-semibold text-ortaq-trust-deep transition-colors hover:bg-ortaq-cream"
        >
          {t("home.whitelabel.close.cta")}
        </Link>
      </Container>
    </section>
  );
}
