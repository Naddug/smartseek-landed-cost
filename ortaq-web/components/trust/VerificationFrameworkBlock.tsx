"use client";

import { useTranslation } from "react-i18next";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

type VerificationFrameworkBlockProps = {
  className?: string;
  dark?: boolean;
};

const AREAS = ["1", "2", "3", "4"] as const;

export function VerificationFrameworkBlock({ className, dark = false }: VerificationFrameworkBlockProps) {
  const { t } = useTranslation();

  return (
    <div
      className={cn(
        "rounded-ortaq-lg border px-4 py-5 sm:px-6 sm:py-6",
        dark ? "border-ortaq-cream/15 bg-ortaq-cream/[0.04]" : "border-ortaq-border bg-ortaq-surface",
        className,
      )}
      aria-labelledby="verification-framework-title"
    >
      <p className={cn(typography.label, dark ? "text-ortaq-cream/55" : "text-ortaq-ink-soft")}>{t("trustFramework.label")}</p>
      <h2
        id="verification-framework-title"
        className={cn("mt-2 text-[1.125rem] font-semibold leading-snug sm:text-[1.25rem]", dark ? "text-ortaq-cream" : "text-ortaq-ink")}
      >
        {t("trustFramework.title")}
      </h2>
      <p className={cn(typography.bodySm, "mt-2 max-w-2xl", dark ? "text-ortaq-cream/75" : "text-ortaq-ink-muted")}>
        {t("trustFramework.intro")}
      </p>
      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        {AREAS.map((k) => (
          <li
            key={k}
            className={cn(
              "flex items-start gap-2 rounded-ortaq-md border px-3 py-2.5 text-[0.8125rem] leading-snug",
              dark ? "border-ortaq-cream/10 text-ortaq-cream/85" : "border-ortaq-border bg-ortaq-bg text-ortaq-ink-muted",
            )}
          >
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ortaq-trust-muted" aria-hidden />
            {t(`trustFramework.areas.${k}`)}
          </li>
        ))}
      </ul>
      <p className={cn(typography.caption, "mt-4 max-w-2xl leading-relaxed", dark ? "text-ortaq-cream/55" : "text-ortaq-ink-soft")}>
        {t("trustFramework.disclaimer")}
      </p>
    </div>
  );
}
