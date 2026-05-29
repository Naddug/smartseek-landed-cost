"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Container } from "@/components/ui/Section";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

const pointKeys = ["1", "2", "3"] as const;

export function HomepageRegulatoryFrame() {
  const { t } = useTranslation();

  return (
    <section
      id="uyum"
      className="border-b border-ortaq-border bg-ortaq-bg-alt scroll-mt-20"
      aria-label={t("homeLanding.regulatory.aria")}
    >
      <Container wide className="py-9 sm:py-10">
        <p className={typography.label}>{t("homeLanding.regulatory.label")}</p>
        <p className={cn(typography.body, "mt-2 max-w-2xl font-medium text-ortaq-ink")}>
          {t("homeLanding.regulatory.title")}
        </p>
        <ul className="mt-4 max-w-2xl space-y-2">
          {pointKeys.map((key) => (
            <li key={key} className={typography.bodySm}>
              {t(`homeLanding.regulatory.points.${key}`)}
            </li>
          ))}
        </ul>
        <div className="mt-5 flex flex-wrap gap-4">
          <Link href="/guven" className={cn(typography.bodySm, typography.link, "font-medium")}>
            {t("homeLanding.regulatory.links.trust")} →
          </Link>
          <Link href="/riskler" className={cn(typography.bodySm, typography.link, "font-medium")}>
            {t("homeLanding.regulatory.links.risk")} →
          </Link>
        </div>
      </Container>
    </section>
  );
}
