"use client";

import { ArrowRight, CheckCircle2, Circle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

const partnerKeys = ["1", "2", "3"] as const;
const partnerVerified: Record<(typeof partnerKeys)[number], boolean> = {
  "1": true,
  "2": false,
  "3": true,
};

/**
 * Product-shaped hero anchor: producer → match → verified counterparty.
 * Illustrative structure only; no fabricated metrics or company names.
 */
export function HeroProductPreview() {
  const { t } = useTranslation();

  return (
    <div
      className="landing-depth relative overflow-hidden rounded-ortaq-lg border border-ortaq-border-strong bg-ortaq-surface shadow-[var(--shadow-intel)]"
      aria-label={t("homeLanding.hero.preview.aria")}
    >
      <div className="border-b border-ortaq-border bg-ortaq-bg-alt/80 px-4 py-3">
        <p className={typography.label}>{t("homeLanding.hero.preview.panelLabel")}</p>
        <p className={cn(typography.bodySm, "mt-1 font-medium text-ortaq-ink")}>
          {t("homeLanding.hero.preview.panelTitle")}
        </p>
      </div>

      <div className="grid gap-0 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
        <div className="border-b border-ortaq-border p-4 sm:border-b-0 sm:border-r">
          <p className={typography.caption}>{t("homeLanding.hero.preview.producerLabel")}</p>
          <p className={cn(typography.bodySm, "mt-1 font-medium text-ortaq-ink")}>
            {t("homeLanding.hero.preview.producerName")}
          </p>
          <p className={cn(typography.caption, "mt-0.5")}>{t("homeLanding.hero.preview.producerMeta")}</p>
        </div>

        <div className="flex items-center justify-center border-b border-ortaq-border bg-ortaq-trust-soft/40 px-3 py-3 sm:border-b-0 sm:py-8">
          <div className="text-center">
            <p className={cn(typography.caption, "font-medium text-ortaq-trust")}>
              {t("homeLanding.hero.preview.matchLabel")}
            </p>
            <ArrowRight className="mx-auto mt-1 h-4 w-4 text-ortaq-trust-muted sm:rotate-0" aria-hidden />
          </div>
        </div>

        <div className="p-4">
          <p className={typography.caption}>{t("homeLanding.hero.preview.targetLabel")}</p>
          <p className={cn(typography.bodySm, "mt-1 font-medium text-ortaq-ink")}>
            {t("homeLanding.hero.preview.targetName")}
          </p>
          <p className={cn(typography.caption, "mt-0.5 text-ortaq-trust-muted")}>
            {t("homeLanding.hero.preview.targetMeta")}
          </p>
        </div>
      </div>

      <ul className="divide-y divide-ortaq-border border-t border-ortaq-border">
        {partnerKeys.map((key) => (
          <li key={key} className="flex items-start gap-3 px-4 py-3">
            {partnerVerified[key] ? (
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-ortaq-trust" strokeWidth={1.5} aria-hidden />
            ) : (
              <Circle className="mt-0.5 h-4 w-4 shrink-0 text-ortaq-ink-soft" strokeWidth={1.5} aria-hidden />
            )}
            <div className="min-w-0 flex-1">
              <p className={cn(typography.bodySm, "font-medium text-ortaq-ink")}>
                {t(`homeLanding.hero.preview.partners.${key}.role`)}
              </p>
              <p className={cn(typography.caption, "mt-0.5")}>
                {t(`homeLanding.hero.preview.partners.${key}.note`)}
              </p>
            </div>
            <span
              className={cn(
                "shrink-0 rounded-ortaq-sm px-2 py-0.5 text-[0.625rem] font-medium uppercase tracking-wide",
                partnerVerified[key]
                  ? "bg-ortaq-trust-soft text-ortaq-trust"
                  : "bg-ortaq-bg-alt text-ortaq-ink-soft",
              )}
            >
              {t(`homeLanding.hero.preview.partners.${key}.chip`)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
