"use client";

import { useTranslation } from "react-i18next";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

const NOT_KEYS = ["1", "2", "3"] as const;
const IS_KEYS = ["1", "2", "3"] as const;

type CategoryClarityBlockProps = {
  className?: string;
  dark?: boolean;
};

export function CategoryClarityBlock({ className, dark = false }: CategoryClarityBlockProps) {
  const { t } = useTranslation();

  return (
    <div
      className={cn(
        "grid gap-4 sm:grid-cols-2",
        className,
      )}
      aria-labelledby="category-clarity-title"
    >
      <div className={cn("rounded-ortaq-md border px-4 py-4", dark ? "border-ortaq-cream/12 bg-ortaq-cream/[0.03]" : "border-ortaq-border bg-ortaq-bg")}>
        <p className={cn(typography.label, dark ? "text-ortaq-cream/50" : "text-ortaq-ink-soft")}>{t("categoryClarity.notLabel")}</p>
        <ul className="mt-2 space-y-1.5">
          {NOT_KEYS.map((k) => (
            <li key={k} className={cn(typography.bodySm, dark ? "text-ortaq-cream/70" : "text-ortaq-ink-muted")}>
              — {t(`categoryClarity.not.${k}`)}
            </li>
          ))}
        </ul>
      </div>
      <div className={cn("rounded-ortaq-md border px-4 py-4", dark ? "border-ortaq-trust/30 bg-ortaq-trust/10" : "border-ortaq-trust/25 bg-ortaq-trust-soft")}>
        <p className={cn(typography.label, "text-ortaq-trust-muted")} id="category-clarity-title">
          {t("categoryClarity.isLabel")}
        </p>
        <ul className="mt-2 space-y-1.5">
          {IS_KEYS.map((k) => (
            <li key={k} className={cn(typography.bodySm, "font-medium text-ortaq-trust-muted")}>
              {t(`categoryClarity.is.${k}`)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
