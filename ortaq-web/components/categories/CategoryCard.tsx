"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/cn";
import {
  getCategoryLocaleBase,
  getCategoryPath,
  type CategoryEntry,
  type CategoryStatus,
} from "@/lib/categories/registry";

type CategoryCardProps = {
  entry: CategoryEntry;
};

const statusStyles: Record<CategoryStatus, string> = {
  live: "border-ortaq-trust/30 bg-white font-semibold text-ortaq-ink",
  roadmap: "border-ortaq-border/80 bg-transparent text-ortaq-ink-muted",
  hidden: "border-ortaq-border/50 bg-transparent text-ortaq-ink-soft opacity-60",
};

export function CategoryCard({ entry }: CategoryCardProps) {
  const { t } = useTranslation();
  const name = t(`${getCategoryLocaleBase(entry.slug)}.name`);
  const statusLabel =
    entry.status === "live"
      ? t("categories.roadmap.liveLabel")
      : entry.status === "roadmap"
        ? t("categories.roadmap.roadmapLabel")
        : t("categories.roadmap.hiddenLabel");

  const className = cn(
    "flex items-center justify-between rounded-xl border px-5 py-4",
    statusStyles[entry.status],
    entry.status === "live" && "transition-colors hover:border-ortaq-trust/50",
  );

  const content = (
    <>
      <span className="text-[0.9375rem]">{name}</span>
      <span
        className={cn(
          "text-[0.6875rem] font-bold uppercase tracking-[0.06em]",
          entry.status === "live" ? "text-ortaq-trust" : "text-ortaq-ink-soft",
        )}
      >
        {statusLabel}
      </span>
    </>
  );

  return (
    <li>
      {entry.status === "live" ? (
        <Link href={getCategoryPath(entry.slug)} className={className}>
          {content}
        </Link>
      ) : (
        <div className={className}>{content}</div>
      )}
    </li>
  );
}
