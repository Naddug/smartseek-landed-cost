"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { listRegistrySignals } from "@/lib/intelligence/tension";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

type SignalRegistryProps = {
  variant?: "panel" | "strip";
  tone?: "light" | "dark";
  limit?: number;
  className?: string;
};

export function SignalRegistry({
  variant = "panel",
  tone = "light",
  limit,
  className,
}: SignalRegistryProps) {
  const { t } = useTranslation();
  const signals = listRegistrySignals().slice(0, limit ?? undefined);
  const dark = tone === "dark";

  if (variant === "strip") {
    return (
      <div className={cn(dark ? "intel-signal-strip-dark" : "intel-signal-strip", className)}>
        {signals.map((s, i) => (
          <Link
            key={s.slug}
            href={`/sirket/${s.slug}`}
            className={cn("intel-signal-row group px-3.5 py-3 sm:px-4", dark && "intel-signal-row-dark")}
          >
            <span
              className={cn(
                typography.meta,
                "w-6 shrink-0 tabular-nums",
                dark ? "text-ortaq-cream/40" : "text-ortaq-ink-soft",
              )}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <span
              className={cn(
                typography.bodySm,
                "w-[7.5rem] shrink-0 font-medium sm:w-[8.5rem]",
                dark ? "text-ortaq-cream" : "text-ortaq-ink",
              )}
            >
              {s.tradeName}
            </span>
            <span
              className={cn(
                typography.bodySm,
                "min-w-0 flex-1 truncate",
                dark ? "text-ortaq-cream/65 group-hover:text-ortaq-cream" : "text-ortaq-ink-muted group-hover:text-ortaq-ink",
              )}
            >
              {s.tension}
            </span>
          </Link>
        ))}
      </div>
    );
  }

  return (
    <div className={cn(dark ? "intel-signal-panel-dark" : "intel-signal-panel", className)}>
      <div className={cn("intel-signal-header", dark && "intel-signal-header-dark")}>
        <p className={cn(typography.label, dark && "text-ortaq-cream/55")}>{t("homeProduct.signals.label")}</p>
        <p className={cn(typography.meta, "intel-live-dot", dark && "intel-live-dot-dark text-ortaq-cream/55")}>
          {t("homeProduct.signals.live")}
        </p>
      </div>
      <ul>
        {signals.map((s, i) => (
          <li key={s.slug}>
            <Link
              href={`/sirket/${s.slug}`}
              className={cn(
                "intel-signal-row group block px-3.5 py-3 sm:px-4 sm:py-3.5",
                dark && "intel-signal-row-dark",
              )}
            >
              <div className="flex items-baseline gap-2">
                <span className={cn(typography.meta, "tabular-nums", dark ? "text-ortaq-cream/45" : "text-ortaq-trust-muted")}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className={cn(typography.bodySm, "font-medium", dark ? "text-ortaq-cream" : "text-ortaq-ink")}>
                  {s.tradeName}
                </span>
                <span className={cn(typography.meta, "ml-auto", dark ? "text-ortaq-cream/45" : "text-ortaq-ink-soft")}>
                  {s.city}
                </span>
              </div>
              <p
                className={cn(
                  typography.bodySm,
                  "mt-1.5 line-clamp-2 pl-6",
                  dark ? "text-ortaq-cream/65 group-hover:text-ortaq-cream/90" : "text-ortaq-ink-muted group-hover:text-ortaq-ink",
                )}
              >
                {s.tension}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
