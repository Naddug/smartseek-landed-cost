"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Container } from "@/components/ui/Section";
import { listOpportunityClusters } from "@/lib/intelligence/discovery";
import { getCampaignTensionLine } from "@/lib/intelligence/tension";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

export function HiddenOpportunities() {
  const { t } = useTranslation();
  const clusters = listOpportunityClusters();

  return (
    <section className="product-section bg-ortaq-bg-alt">
      <Container wide>
        <p className={typography.label}>{t("homeProduct.discovery.opportunities.label")}</p>
        <h2 className="mt-1 max-w-[22ch] font-body text-[1.625rem] font-semibold leading-[1.1] tracking-[-0.02em] text-ortaq-ink sm:text-[1.875rem]">
          {t("homeProduct.discovery.opportunities.title")}
        </h2>
        <p className={cn(typography.bodySm, "mt-2 max-w-xl")}>{t("homeProduct.discovery.opportunities.lead")}</p>

        <div className="mt-5 overflow-x-auto border-y border-ortaq-border-strong bg-ortaq-surface">
          <table className="authority-table w-full min-w-[36rem] text-left">
            <thead>
              <tr className="border-b border-ortaq-border bg-ortaq-bg-alt">
                <th className="px-4 py-2.5 text-[0.6875rem] font-medium uppercase tracking-[0.06em] text-ortaq-ink-soft">
                  {t("homeProduct.discovery.opportunities.pattern")}
                </th>
                <th className="px-4 py-2.5 text-[0.6875rem] font-medium uppercase tracking-[0.06em] text-ortaq-ink-soft">
                  {t("homeProduct.discovery.compare.company")}
                </th>
                <th className="px-4 py-2.5 text-[0.6875rem] font-medium uppercase tracking-[0.06em] text-ortaq-ink-soft">
                  {t("homeProduct.activity.colNote")}
                </th>
              </tr>
            </thead>
            <tbody>
              {clusters.flatMap((cluster) =>
                cluster.campaigns.map((c) => (
                  <tr key={`${cluster.tag}-${c.slug}`} className="authority-registry-row border-b border-ortaq-border last:border-0">
                    <td className="whitespace-nowrap px-4 py-3 align-top">
                      <span className={cn(typography.caption, "font-semibold uppercase tracking-wide text-ortaq-trust")}>
                        {t(`homeProduct.discovery.opportunities.tags.${cluster.tag}`)}
                      </span>
                    </td>
                    <td className="px-4 py-3 align-top">
                      <Link href={`/sirket/${c.slug}`} className={cn(typography.bodySm, "font-semibold text-ortaq-ink hover:text-ortaq-trust hover:underline")}>
                        {c.tradeName}
                      </Link>
                      <span className={cn(typography.caption, "block")}>{c.city}</span>
                    </td>
                    <td className="px-4 py-3 align-top">
                      <p className={cn(typography.bodySm, "font-medium text-ortaq-ink-muted")}>{getCampaignTensionLine(c)}</p>
                    </td>
                  </tr>
                )),
              )}
            </tbody>
          </table>
        </div>
      </Container>
    </section>
  );
}
