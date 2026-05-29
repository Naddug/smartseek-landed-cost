"use client";

import { useTranslation } from "react-i18next";
import { AppScreenFrame } from "@/components/landing/AppScreenFrame";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

const itemKeys = ["1", "2", "3", "4"] as const;

export function ExportTrackScreen() {
  const { t } = useTranslation();

  return (
    <AppScreenFrame
      title={t("homeLanding.screens.export.frameTitle")}
      subtitle={t("homeLanding.screens.export.frameSubtitle")}
    >
      <ul className="space-y-2">
        {itemKeys.map((key) => {
          const done = key !== "4";
          return (
            <li
              key={key}
              className={cn(
                "flex items-start gap-2.5 rounded-ortaq-sm border px-3 py-2.5",
                done ? "border-ortaq-trust/25 bg-ortaq-trust-soft/30" : "border-ortaq-border bg-ortaq-bg-alt/50",
              )}
            >
              <span
                className={cn(
                  "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[0.625rem] font-bold",
                  done ? "bg-ortaq-trust text-ortaq-cream" : "border border-ortaq-border-strong text-ortaq-ink-soft",
                )}
                aria-hidden
              >
                {done ? "✓" : "·"}
              </span>
              <div>
                <p className={cn(typography.bodySm, "font-medium text-ortaq-ink")}>
                  {t(`homeLanding.screens.export.items.${key}.title`)}
                </p>
                <p className={cn(typography.caption, "mt-0.5")}>
                  {t(`homeLanding.screens.export.items.${key}.meta`)}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </AppScreenFrame>
  );
}
