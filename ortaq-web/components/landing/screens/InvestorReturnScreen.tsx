"use client";

import { useTranslation } from "react-i18next";
import { AppScreenFrame } from "@/components/landing/AppScreenFrame";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

export function InvestorReturnScreen() {
  const { t } = useTranslation();

  return (
    <AppScreenFrame
      title={t("homeLanding.screens.investor.frameTitle")}
      subtitle={t("homeLanding.screens.investor.frameSubtitle")}
    >
      <div className="mb-3 flex gap-2">
        <span className="rounded-ortaq-sm bg-ortaq-ink px-2.5 py-1 text-[0.6875rem] font-medium text-ortaq-cream">
          {t("homeLanding.screens.investor.tabRevenue")}
        </span>
        <span className="rounded-ortaq-sm border border-ortaq-border px-2.5 py-1 text-[0.6875rem] font-medium text-ortaq-ink-muted">
          {t("homeLanding.screens.investor.tabEquity")}
        </span>
      </div>

      <div className="space-y-2">
        {(["flow1", "flow2", "flow3"] as const).map((key, i) => (
          <div key={key}>
            <div className="flex items-center gap-2 rounded-ortaq-sm border border-ortaq-border bg-ortaq-bg-alt/60 px-3 py-2">
              <span
                className={cn(
                  typography.caption,
                  "flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ortaq-trust-soft font-semibold text-ortaq-trust",
                )}
              >
                {i + 1}
              </span>
              <p className={cn(typography.bodySm, "text-ortaq-ink")}>{t(`homeLanding.screens.investor.${key}`)}</p>
            </div>
            {i < 2 && (
              <p className={cn(typography.caption, "py-1 pl-6 text-ortaq-ink-soft")} aria-hidden>
                ↓
              </p>
            )}
          </div>
        ))}
      </div>

      <p className={cn(typography.caption, "mt-3 border-t border-ortaq-border pt-3 text-ortaq-ink-soft")}>
        {t("homeLanding.screens.investor.footnote")}
      </p>
    </AppScreenFrame>
  );
}
