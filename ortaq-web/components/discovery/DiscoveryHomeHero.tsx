"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Container } from "@/components/ui/Section";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

export function DiscoveryHomeHero() {
  const { t } = useTranslation();

  return (
    <section className="border-b border-ortaq-border bg-ortaq-bg">
      <Container wide className="py-8 sm:py-10">
        <div className="max-w-2xl">
          <h1 className="text-[1.625rem] font-semibold leading-[1.12] tracking-[-0.03em] text-ortaq-ink sm:text-[2rem]">
            {t("discovery.home.headline")}
          </h1>
          <p className={cn(typography.bodySm, "mt-3 text-ortaq-ink-muted")}>{t("discovery.home.sub")}</p>
          <p className={cn(typography.bodySm, "mt-3 text-ortaq-ink")}>{t("discovery.home.accessLine")}</p>
          <div className="mt-5 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
            <Link
              href="/kesfet"
              className="inline-flex min-h-11 items-center justify-center rounded-ortaq-md bg-ortaq-ink px-5 text-[0.875rem] font-semibold text-ortaq-cream transition-opacity hover:opacity-90"
            >
              {t("discovery.home.ctaPrimary")}
            </Link>
          </div>
          <p className={cn(typography.caption, "mt-4 text-ortaq-ink-soft")}>
            {t("discovery.home.legalLine1")} {t("discovery.home.legalLine2")}
          </p>
        </div>
      </Container>
    </section>
  );
}
