"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { BadgeCheck, FileCheck, Lock, Scale } from "lucide-react";
import { Container } from "@/components/ui/Section";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

const items = [
  { key: "1", icon: Lock },
  { key: "2", icon: BadgeCheck },
  { key: "3", icon: FileCheck },
  { key: "4", icon: Scale },
] as const;

export function TrustBand() {
  const { t } = useTranslation();

  return (
    <section className="invest-trust-band border-y border-ortaq-trust/15 bg-ortaq-trust-soft/40 py-8 sm:py-10">
      <Container wide>
        <div className="mb-6 text-center sm:mb-8">
          <p className={typography.label}>{t("homeProduct.invest.trust.label")}</p>
          <h2 className={cn(typography.h1, "mt-1")}>{t("homeProduct.invest.trust.title")}</h2>
          <p className={cn(typography.bodySm, "mx-auto mt-2 max-w-xl text-ortaq-ink-muted")}>
            {t("homeProduct.invest.trust.lead")}
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(({ key, icon: Icon }) => (
            <div key={key} className="rounded-ortaq-lg border border-ortaq-trust/15 bg-ortaq-surface p-5 text-center shadow-[var(--shadow-product)] transition-[box-shadow,border-color] duration-200 hover:border-ortaq-trust/25 hover:shadow-[var(--shadow-product-hover)]">
              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-ortaq-trust-soft text-ortaq-trust">
                <Icon className="h-5 w-5" strokeWidth={1.75} />
              </div>
              <h3 className={cn(typography.h2, "mt-3")}>{t(`homeProduct.trust.items.${key}.title`)}</h3>
              <p className={cn(typography.bodySm, "mt-1.5 text-ortaq-ink-muted")}>{t(`homeProduct.trust.items.${key}.text`)}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          <Link href="/guven" className={cn(typography.bodySm, "font-semibold text-ortaq-trust hover:underline")}>
            {t("homeProduct.verification.link")} →
          </Link>
          <Link href="/degerlendirme" className={cn(typography.bodySm, "font-semibold text-ortaq-trust hover:underline")}>
            {t("homeProduct.trust.evalLink")} →
          </Link>
        </div>
      </Container>
    </section>
  );
}
