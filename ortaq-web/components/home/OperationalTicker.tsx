"use client";

import { useTranslation } from "react-i18next";
import { economicTraces } from "@/lib/operations/traces";
import { operationalPulse } from "@/lib/operations/pulse";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

type OperationalTickerProps = {
  variant?: "light" | "dark";
};

/** Living economic traces — quiet operational motion */
export function OperationalTicker({ variant = "light" }: OperationalTickerProps) {
  const { t } = useTranslation();

  const items = [
    ...economicTraces.global.slice(0, 5).map((trace) => ({
      id: trace.id,
      text: `${trace.date.slice(5).replace("-", ".")} ${trace.time} · ${t(`traces.global.${trace.key}`)}`,
    })),
    ...operationalPulse.logs.map((log) => ({
      id: log.id,
      text: `${log.date.slice(5).replace("-", ".")} · ${t(`homeOps.logs.${log.key}`)}`,
    })),
  ];

  return (
    <div
      className={cn(
        "overflow-hidden border-t",
        variant === "light" ? "border-white/10 bg-ortaq-dark/50" : "border-ortaq-border bg-ortaq-bg-alt/90",
      )}
      aria-live="polite"
    >
      <div className="ticker-track flex gap-12 whitespace-nowrap px-4 py-2.5 sm:px-6 sm:py-3">
        {[...items, ...items].map((item, i) => (
          <span
            key={`${item.id}-${i}`}
            className={cn(
              typography.caption,
              variant === "light" ? "text-ortaq-cream/40" : "text-ortaq-ink-soft",
            )}
          >
            {item.text}
          </span>
        ))}
      </div>
    </div>
  );
}
