"use client";

import { useTranslation } from "react-i18next";
import { AppScreenFrame } from "@/components/landing/AppScreenFrame";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

const rowKeys = ["1", "2", "3"] as const;

export function PartnerMatchScreen() {
  const { t } = useTranslation();

  return (
    <AppScreenFrame
      title={t("homeLanding.screens.match.frameTitle")}
      subtitle={t("homeLanding.screens.match.frameSubtitle")}
    >
      <div className="mb-3 rounded-ortaq-sm border border-ortaq-border bg-ortaq-bg-alt/80 px-3 py-2">
        <p className={cn(typography.caption, "text-ortaq-ink-soft")}>{t("homeLanding.screens.match.searchLabel")}</p>
        <p className={cn(typography.bodySm, "mt-0.5 text-ortaq-ink-muted")}>
          {t("homeLanding.screens.match.searchPlaceholder")}
        </p>
      </div>
      <ul className="space-y-2">
        {rowKeys.map((key) => (
          <li
            key={key}
            className="flex items-center justify-between gap-2 rounded-ortaq-sm border border-ortaq-border px-3 py-2.5"
          >
            <div className="min-w-0">
              <p className={cn(typography.bodySm, "truncate font-medium text-ortaq-ink")}>
                {t(`homeLanding.screens.match.rows.${key}.name`)}
              </p>
              <p className={cn(typography.caption, "truncate")}>
                {t(`homeLanding.screens.match.rows.${key}.meta`)}
              </p>
            </div>
            <span
              className={cn(
                "shrink-0 rounded-ortaq-sm px-2 py-0.5 text-[0.625rem] font-medium",
                key === "1"
                  ? "bg-ortaq-trust-soft text-ortaq-trust"
                  : key === "2"
                    ? "bg-ortaq-bg-warm text-ortaq-ink-muted"
                    : "bg-ortaq-status-soft text-ortaq-status",
              )}
            >
              {t(`homeLanding.screens.match.rows.${key}.status`)}
            </span>
          </li>
        ))}
      </ul>
    </AppScreenFrame>
  );
}
