"use client";

import { useTranslation } from "react-i18next";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

export function DemoPreviewBanner() {
  const { t } = useTranslation();
  return (
    <p className={cn(typography.caption, "mb-6 rounded-ortaq-md border border-ortaq-border bg-ortaq-surface px-3 py-2.5 leading-relaxed text-ortaq-ink-muted")}>
      {t("demo.previewNotice")}
    </p>
  );
}
