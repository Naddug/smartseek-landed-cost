"use client";

import { useTranslation } from "react-i18next";
import type { TraceKey } from "@/lib/operations/traces";
import { formatTraceTimestamp } from "@/lib/operations/traces";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

type EconomicTraceProps = {
  traceKey: TraceKey;
  date: string;
  time: string;
  variant?: "stamp" | "margin" | "ghost" | "overlay";
  align?: "left" | "right";
  className?: string;
};

const variantClass = {
  stamp:
    "border border-ortaq-border/80 bg-ortaq-cream/92 px-3 py-2.5 shadow-[2px_3px_0_rgb(15_14_12_/0.06)] backdrop-blur-[2px]",
  margin: "border-l border-ortaq-gold/40 pl-3 py-0.5",
  ghost: "opacity-70",
  overlay:
    "border border-white/15 bg-ortaq-dark/75 px-3 py-2 backdrop-blur-sm [&_p]:text-ortaq-cream/80 [&_p:first-child]:text-ortaq-cream/45",
};

/** Single discovered operational fragment */
export function EconomicTrace({
  traceKey,
  date,
  time,
  variant = "stamp",
  align = "left",
  className,
}: EconomicTraceProps) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === "en" ? "en-GB" : "tr-TR";

  return (
    <aside
      className={cn(
        "max-w-[16rem] sm:max-w-xs",
        align === "right" && "ml-auto text-right",
        variantClass[variant],
        variant === "margin" && align === "right" && "border-l-0 border-r border-ortaq-gold/40 pl-0 pr-3",
        className,
      )}
    >
      <p className={cn(typography.caption, "tabular-nums text-ortaq-ink-soft")}>
        {formatTraceTimestamp(date, time, locale)}
      </p>
      <p className={cn(typography.bodySm, "mt-1 leading-snug text-ortaq-ink-muted")}>
        {t(`traces.global.${traceKey}`)}
      </p>
    </aside>
  );
}
