"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/Button";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

export function MobileStickyCta() {
  const { t } = useTranslation();

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-ortaq-border bg-ortaq-surface/95 backdrop-blur-md safe-bottom md:hidden">
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <div className="min-w-0">
          <p className={cn(typography.bodySm, "truncate font-medium text-ortaq-ink")}>
            {t("mobileCta.label")}
          </p>
          <p className={cn(typography.caption, "truncate text-ortaq-ink-muted")}>
            {t("mobileCta.sublabel")}
          </p>
        </div>
        <Link href="/sirketler" className="shrink-0">
          <Button variant="primary" size="sm">
            {t("nav.explore")}
          </Button>
        </Link>
      </div>
    </div>
  );
}
