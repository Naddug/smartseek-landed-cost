"use client";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

export function MobileStickyCta() {
  const { t } = useTranslation();

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-ortaq-border bg-ortaq-ink/95 text-ortaq-cream backdrop-blur-md safe-bottom md:hidden">
      <div className="flex items-center justify-between gap-4 px-4 py-3">
        <Link href="/nasil-calisir" className={cn(typography.bodySm, "font-medium text-ortaq-cream")}>
          {t("mobileCta.label")}
        </Link>
        <span className={cn(typography.caption, "shrink-0 text-ortaq-cream/50")}>
          {t("mobileCta.sublabel")}
        </span>
      </div>
    </div>
  );
}
