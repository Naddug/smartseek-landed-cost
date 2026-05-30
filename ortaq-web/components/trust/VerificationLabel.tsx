"use client";

import { useTranslation } from "react-i18next";
import { cn } from "@/lib/cn";
import type { VerificationPublicLabel } from "@/lib/trust/types";
import { verificationLabelKey } from "@/lib/trust/api";

const styles: Record<VerificationPublicLabel, string> = {
  not_submitted: "border-ortaq-border text-ortaq-ink-soft", under_review: "border-ortaq-border-strong text-ortaq-ink-muted", approved: "border-ortaq-trust/40 text-ortaq-trust", approved_with_conditions: "border-ortaq-trust/30 text-ortaq-trust", rejected: "border-ortaq-risk/40 text-ortaq-risk", suspended: "border-ortaq-risk/50 text-ortaq-risk", withdrawn: "border-ortaq-border-strong text-ortaq-ink-soft", expired: "border-ortaq-border text-ortaq-ink-soft",
};

type VerificationLabelProps = {
  label: VerificationPublicLabel;
  className?: string;
};

/** Entity verification, not platform regulatory status */
export function VerificationLabel({ label, className }: VerificationLabelProps) {
  const { t } = useTranslation();
  return (
    <span
      className={cn(
        "inline-flex max-w-full shrink items-center border-l-2 pl-2 text-[10px] leading-snug tracking-[0.04em] sm:text-[11px]", styles[label], className, )}
    >
      {t(verificationLabelKey(label))}
    </span>
  );
}
