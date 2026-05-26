"use client";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/cn";
import type { TrustStatus } from "@/components/trust/StatusBadge";
import { StatusBadge } from "@/components/trust/StatusBadge";
import { typography } from "@/design/typography";

type ClaimRowProps = {
  titleKey: string;
  textKey: string;
  status: TrustStatus;
  href?: string;
  linkKey?: string;
  className?: string;
};

export function ClaimRow({ titleKey, textKey, status, href, linkKey, className }: ClaimRowProps) {
  const { t } = useTranslation();

  return (
    <article className={cn("border-t border-ortaq-border py-6 first:border-t-0 first:pt-0 sm:py-7", className)}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h3 className={typography.h3}>{t(titleKey)}</h3>
        <StatusBadge status={status} />
      </div>
      <p className={cn(typography.bodySm, "mt-3")}>{t(textKey)}</p>
      {href && linkKey && (
        <Link href={href} className={cn(typography.bodySm, typography.link, "mt-4 inline-block")}>
          {t(linkKey)}
        </Link>
      )}
    </article>
  );
}
