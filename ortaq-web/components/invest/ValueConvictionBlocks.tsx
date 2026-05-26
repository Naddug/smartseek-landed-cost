"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { ArrowRight } from "lucide-react";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

const chainKeys = ["1", "2", "3", "4", "5"] as const;
const timelineKeys = ["1", "2", "3", "4", "5", "6", "7", "8"] as const;
const mechanicsKeys = ["1", "2", "3", "4", "5", "6"] as const;
const convictionKeys = ["1", "2", "3"] as const;

/** Embedded in HowItWorks — ownership visualization, timeline, mechanics. Not a separate homepage section. */
export function ValueConvictionBlocks() {
  const { t } = useTranslation();

  return (
    <div className="mt-8 space-y-6 sm:space-y-8">
      {/* Capital → upside chain */}
      <div className="rounded-ortaq-lg border border-ortaq-trust/20 bg-gradient-to-br from-ortaq-trust-soft/40 via-ortaq-surface to-ortaq-surface p-5 shadow-[var(--shadow-product)] sm:p-6">
        <p className={typography.label}>{t("homeProduct.invest.valueChain.label")}</p>
        <h3 className={cn(typography.h1, "mt-1 text-[1.25rem] sm:text-[1.375rem]")}>
          {t("homeProduct.invest.valueChain.title")}
        </h3>
        <p className={cn(typography.bodySm, "mt-2 max-w-3xl text-ortaq-ink-muted")}>
          {t("homeProduct.invest.valueChain.lead")}
        </p>
        <ol className="product-scroll-row mt-5 flex gap-2 overflow-x-auto pb-1 sm:grid sm:grid-cols-5 sm:overflow-visible sm:pb-0">
          {chainKeys.map((key, i) => (
            <li
              key={key}
              className="relative min-w-[9.5rem] shrink-0 snap-start rounded-ortaq-md border border-ortaq-border/90 bg-ortaq-surface px-3 py-3 shadow-[var(--shadow-product)] sm:min-w-0"
            >
              {i < chainKeys.length - 1 && (
                <ArrowRight
                  className="absolute -right-3 top-1/2 z-[1] hidden h-3.5 w-3.5 -translate-y-1/2 text-ortaq-trust/50 sm:block"
                  strokeWidth={2}
                  aria-hidden
                />
              )}
              <span className={cn(typography.meta, "font-semibold text-ortaq-trust")}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className={cn(typography.h3, "mt-1.5 text-[0.875rem]")}>
                {t(`homeProduct.invest.valueChain.steps.${key}.title`)}
              </p>
              <p className={cn(typography.caption, "mt-1 leading-snug")}>
                {t(`homeProduct.invest.valueChain.steps.${key}.text`)}
              </p>
            </li>
          ))}
        </ol>
      </div>

      {/* Institutional value timeline */}
      <div className="rounded-ortaq-lg border border-ortaq-border bg-ortaq-surface p-5 shadow-[var(--shadow-product)] sm:p-6">
        <p className={typography.label}>{t("homeProduct.invest.valueTimeline.label")}</p>
        <h3 className={cn(typography.h1, "mt-1 text-[1.25rem] sm:text-[1.375rem]")}>
          {t("homeProduct.invest.valueTimeline.title")}
        </h3>
        <p className={cn(typography.bodySm, "mt-2 max-w-3xl text-ortaq-ink-muted")}>
          {t("homeProduct.invest.valueTimeline.lead")}
        </p>
        <ol className="mt-5 space-y-0 border-l border-ortaq-trust/25 pl-4 sm:pl-5">
          {timelineKeys.map((key) => (
            <li key={key} className="relative pb-5 last:pb-0">
              <span className="absolute -left-[1.125rem] top-1.5 h-2 w-2 rounded-full border-2 border-ortaq-trust bg-ortaq-surface sm:-left-[1.3125rem]" />
              <p className={cn(typography.caption, "font-semibold uppercase tracking-wide text-ortaq-trust-muted")}>
                {t(`homeProduct.invest.valueTimeline.phases.${key}.phase`)}
              </p>
              <p className={cn(typography.h3, "mt-0.5")}>
                {t(`homeProduct.invest.valueTimeline.phases.${key}.title`)}
              </p>
              <p className={cn(typography.bodySm, "mt-1 max-w-prose")}>
                {t(`homeProduct.invest.valueTimeline.phases.${key}.text`)}
              </p>
            </li>
          ))}
        </ol>
      </div>

      {/* Investment mechanics */}
      <div className="rounded-ortaq-lg border border-ortaq-border bg-ortaq-bg-alt/50 p-5 sm:p-6">
        <p className={typography.label}>{t("homeProduct.invest.mechanics.label")}</p>
        <h3 className={cn(typography.h1, "mt-1 text-[1.25rem] sm:text-[1.375rem]")}>
          {t("homeProduct.invest.mechanics.title")}
        </h3>
        <p className={cn(typography.bodySm, "mt-2 max-w-3xl")}>{t("homeProduct.invest.mechanics.lead")}</p>
        <dl className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {mechanicsKeys.map((key) => (
            <div key={key} className="rounded-ortaq-md border border-ortaq-border/80 bg-ortaq-surface p-4">
              <dt className={cn(typography.h3, "text-[0.9375rem]")}>
                {t(`homeProduct.invest.mechanics.items.${key}.title`)}
              </dt>
              <dd className={cn(typography.bodySm, "mt-1.5 text-ortaq-ink-muted")}>
                {t(`homeProduct.invest.mechanics.items.${key}.text`)}
              </dd>
            </div>
          ))}
        </dl>
        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
          <Link href="/guven" className={cn(typography.bodySm, "font-semibold text-ortaq-trust hover:underline")}>
            {t("homeProduct.verification.link")} →
          </Link>
          <Link href="/nasil-calisir" className={cn(typography.bodySm, "font-semibold text-ortaq-trust hover:underline")}>
            {t("homeProduct.process.link")} →
          </Link>
        </div>
      </div>

      {/* Financial conviction strip */}
      <div className="rounded-ortaq-lg border border-ortaq-trust/15 bg-ortaq-trust-deep/[0.04] px-5 py-5 sm:px-6 sm:py-6">
        <h3 className={cn(typography.h2, "text-[1.125rem] sm:text-[1.25rem]")}>
          {t("homeProduct.invest.conviction.title")}
        </h3>
        <ul className="mt-4 grid gap-4 sm:grid-cols-3">
          {convictionKeys.map((key) => (
            <li key={key} className="border-t border-ortaq-trust/15 pt-3 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-4 first:sm:pl-0 first:sm:border-l-0">
              <p className={cn(typography.h3, "text-[0.9375rem]")}>
                {t(`homeProduct.invest.conviction.items.${key}.title`)}
              </p>
              <p className={cn(typography.bodySm, "mt-1.5 text-ortaq-ink-muted")}>
                {t(`homeProduct.invest.conviction.items.${key}.text`)}
              </p>
            </li>
          ))}
        </ul>
        <p className={cn(typography.caption, "mt-4 font-medium text-ortaq-ink-soft")}>
          {t("homeProduct.invest.conviction.disclaimer")}
        </p>
      </div>
    </div>
  );
}
