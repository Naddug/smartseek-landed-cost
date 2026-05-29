"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Container } from "@/components/ui/Section";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

const roleKeys = ["ortaq", "partner", "investor"] as const;
const pointKeys = ["1", "2", "3", "4", "5"] as const;

export function HomepageRegulatoryFrame() {
  const { t } = useTranslation();

  return (
    <section
      id="uyum"
      className="border-b border-ortaq-border bg-ortaq-ink-panel scroll-mt-20"
      aria-label={t("homeLanding.regulatory.aria")}
    >
      <Container wide className="py-10 sm:py-12">
        <header className="max-w-3xl">
          <p className={cn(typography.label, "text-ortaq-cream/50")}>{t("homeLanding.regulatory.label")}</p>
          <h2 className={cn(typography.h1, "mt-2 text-[1.375rem] text-ortaq-cream sm:text-[1.5rem]")}>
            {t("homeLanding.regulatory.title")}
          </h2>
          <p className={cn(typography.bodySm, "mt-3 text-ortaq-cream/80")}>{t("homeLanding.regulatory.lead")}</p>
        </header>

        <div className="mt-8 overflow-hidden rounded-ortaq-lg border border-white/10">
          <table className="w-full text-left text-[0.8125rem]">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className={cn(typography.caption, "px-4 py-3 font-semibold text-ortaq-cream/60")} scope="col">
                  {t("homeLanding.regulatory.table.role")}
                </th>
                <th className={cn(typography.caption, "px-4 py-3 font-semibold text-ortaq-cream/60")} scope="col">
                  {t("homeLanding.regulatory.table.duty")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {roleKeys.map((key) => (
                <tr key={key} className="bg-white/[0.02]">
                  <td className="px-4 py-3 font-medium text-ortaq-cream">{t(`homeLanding.regulatory.roles.${key}.role`)}</td>
                  <td className="px-4 py-3 text-ortaq-cream/75">{t(`homeLanding.regulatory.roles.${key}.duty`)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <ul className="mt-6 space-y-2">
          {pointKeys.map((key) => (
            <li key={key} className={cn(typography.bodySm, "text-ortaq-cream/80")}>
              <span className="text-ortaq-trust-muted" aria-hidden>
                ✓{" "}
              </span>
              {t(`homeLanding.regulatory.points.${key}`)}
            </li>
          ))}
        </ul>

        <p className={cn(typography.caption, "mt-6 max-w-3xl text-ortaq-cream/60")}>
          {t("homeLanding.regulatory.disclaimer")}
        </p>

        <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2">
          <Link href="/guven" className={cn(typography.bodySm, "font-medium text-ortaq-cream underline-offset-2 hover:underline")}>
            {t("homeLanding.regulatory.links.trust")} →
          </Link>
          <Link href="/riskler" className={cn(typography.bodySm, "font-medium text-ortaq-cream underline-offset-2 hover:underline")}>
            {t("homeLanding.regulatory.links.risk")} →
          </Link>
          <Link href="/nasil-calisir" className={cn(typography.bodySm, "font-medium text-ortaq-cream underline-offset-2 hover:underline")}>
            {t("homeLanding.regulatory.links.process")} →
          </Link>
        </div>
      </Container>
    </section>
  );
}
