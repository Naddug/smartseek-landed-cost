"use client";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/cn";

export type TrustStatus = "verified" | "illustrative" | "planned" | "pending";

/** Editorial metadata label — not a fintech status pill */
const styles: Record<TrustStatus, string> = {
  verified: "border-ortaq-trust/30 text-ortaq-trust",
  illustrative: "border-ortaq-border-strong text-ortaq-ink-soft",
  planned: "border-ortaq-border text-ortaq-ink-soft",
  pending: "border-ortaq-border-strong text-ortaq-ink-muted",
};

type StatusBadgeProps = {
  status: TrustStatus;
  className?: string;
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const { t } = useTranslation();
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center border-l-2 pl-2 text-[11px] leading-snug tracking-[0.04em]",
        styles[status],
        className,
      )}
    >
      {t(`trust.status.${status}`)}
    </span>
  );
}
