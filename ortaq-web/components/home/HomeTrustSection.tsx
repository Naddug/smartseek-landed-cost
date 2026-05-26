"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Container, Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

const items = ["1", "2", "3"] as const;

/** Trust through precision — not fear-first */
export function HomeTrustSection() {
  const { t } = useTranslation();

  return (
    <Section tone="dark" spacing="stage">
      <Container narrow>
        <p className={typography.kickerLight}>{t("homeTrust.label")}</p>
        <h2 className={cn(typography.h1, "mt-4 text-ortaq-cream")}>{t("homeTrust.title")}</h2>
        <p className={cn(typography.leadLight, "mt-5 max-w-prose")}>{t("homeTrust.lead")}</p>

        <ul className="mt-10 divide-y divide-white/10 border-y border-white/10">
          {items.map((key) => (
            <li key={key} className="py-5 sm:py-6">
              <h3 className={cn(typography.h3, "text-ortaq-cream")}>
                {t(`homeTrust.items.${key}.title`)}
              </h3>
              <p className={cn(typography.bodySm, "mt-2 text-ortaq-cream/70")}>
                {t(`homeTrust.items.${key}.text`)}
              </p>
            </li>
          ))}
        </ul>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link href="/guven">
            <Button variant="light" size="lg" fullWidth className="sm:w-auto">
              {t("homeTrust.ctaTrust")}
            </Button>
          </Link>
          <Link href="/riskler" className={cn(typography.bodySm, typography.linkLight, "min-h-11 inline-flex items-center px-1")}>
            {t("homeTrust.ctaRisk")}
          </Link>
        </div>
      </Container>
    </Section>
  );
}
