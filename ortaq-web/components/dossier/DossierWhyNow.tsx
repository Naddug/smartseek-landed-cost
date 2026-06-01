"use client";

import { useTranslation } from "react-i18next";
import type { SimulatedCampaign } from "@/lib/campaigns/types";
import { getWhyNowBriefing } from "@/lib/product/why-now";
import { Container } from "@/components/ui/Section";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

type DossierWhyNowProps = {
  campaign: SimulatedCampaign;
};

export function DossierWhyNow({ campaign: c }: DossierWhyNowProps) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === "tr" ? "tr-TR" : "en-GB";
  const b = getWhyNowBriefing(c, locale);

  const rows = [
    b.recentChange && { label: t("discovery.profile.whyNow.recent"), value: b.recentChange },
    b.challenge && { label: t("discovery.profile.whyNow.challenge"), value: b.challenge },
    b.exportDevelopment && { label: t("discovery.profile.whyNow.export"), value: b.exportDevelopment },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <section
      id="why-now"
      aria-label={t("discovery.profile.whyNow.aria")}
      className="border-b border-ortaq-border bg-ortaq-bg-alt scroll-mt-[7.5rem] sm:scroll-mt-24"
    >
      <Container wide className="py-5 sm:py-6">
        <p className={typography.label}>{t("discovery.profile.whyNow.label")}</p>
        <p className="mt-2 max-w-3xl text-[1.125rem] font-semibold leading-snug tracking-[-0.02em] text-ortaq-ink sm:text-[1.25rem]">
          {b.headline}
        </p>
        {b.lastActivityWhen ? (
          <p className={cn(typography.caption, "mt-2 text-ortaq-ink-soft")}>
            {t("discovery.profile.whyNow.activity", { when: b.lastActivityWhen })}
          </p>
        ) : null}

        {rows.length > 0 ? (
          <dl className="mt-4 grid gap-3 sm:grid-cols-3">
            {rows.map((row) => (
              <div key={row.label} className="border border-ortaq-border bg-ortaq-surface px-3 py-2.5">
                <dt className={typography.caption}>{row.label}</dt>
                <dd className={cn(typography.bodySm, "mt-1 leading-relaxed text-ortaq-ink-muted")}>{row.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}
      </Container>
    </section>
  );
}
