"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Container } from "@/components/ui/Section";
import { listIntelligenceProfiles } from "@/lib/intelligence/discovery";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

const dimensions = [
  "exportExposure",
  "workforceDependency",
  "machineryMaturity",
  "operationalComplexity",
  "productionScale",
] as const;

export function IntelligenceComparison() {
  const { t } = useTranslation();
  const profiles = listIntelligenceProfiles();

  return (
    <section className="authority-compression product-divider border-y border-ortaq-border bg-ortaq-surface py-6 sm:py-8">
      <Container wide>
        <p className={typography.label}>{t("homeProduct.discovery.compare.label")}</p>
        <h2 className="mt-1 max-w-[20ch] font-body text-[1.625rem] font-semibold leading-[1.1] tracking-[-0.02em] text-ortaq-ink sm:text-[1.875rem]">
          {t("homeProduct.discovery.compare.title")}
        </h2>
        <p className={cn(typography.bodySm, "mt-2 max-w-xl")}>{t("homeProduct.discovery.compare.lead")}</p>

        <div className="mt-5 overflow-x-auto border-y border-ortaq-border-strong">
          <table className="authority-table w-full min-w-[42rem] text-left">
            <thead>
              <tr className="border-b border-ortaq-border bg-ortaq-bg-alt">
                <th className="px-4 py-2.5 text-[0.6875rem] font-medium uppercase tracking-[0.06em] text-ortaq-ink-soft">
                  {t("homeProduct.discovery.compare.company")}
                </th>
                {dimensions.map((dim) => (
                  <th
                    key={dim}
                    className="px-4 py-2.5 text-[0.6875rem] font-medium uppercase tracking-[0.06em] text-ortaq-ink-soft"
                  >
                    {t(`homeProduct.discovery.compare.${dim}`)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {profiles.map((p) => (
                <tr key={p.slug} className="authority-registry-row border-b border-ortaq-border last:border-0">
                  <td className="px-4 py-3 align-top">
                    <Link href={`/sirket/${p.slug}`} className={cn(typography.bodySm, "font-semibold text-ortaq-ink hover:text-ortaq-trust hover:underline")}>
                      {p.tradeName}
                    </Link>
                    <span className={cn(typography.caption, "block")}>{p.city}</span>
                  </td>
                  {dimensions.map((dim) => (
                    <td key={dim} className="px-4 py-3 align-top">
                      <span
                        className={cn(
                          typography.bodySm,
                          dim === "operationalComplexity" && p[dim] === "high" && "font-medium text-ortaq-accent",
                          dim === "operationalComplexity" && p[dim] === "moderate" && "font-medium text-ortaq-ink",
                        )}
                      >
                        {dim === "operationalComplexity"
                          ? t(`homeProduct.discovery.compare.level.${p[dim]}`)
                          : p[dim]}
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Container>
    </section>
  );
}
