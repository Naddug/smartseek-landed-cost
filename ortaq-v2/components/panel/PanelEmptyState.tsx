import Link from "next/link";
import { cn } from "@/lib/utils";

interface PanelEmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  primaryAction?: React.ReactNode;
  secondaryAction?: React.ReactNode;
  className?: string;
}

export function PanelEmptyState({
  icon,
  title,
  description,
  primaryAction,
  secondaryAction,
  className,
}: PanelEmptyStateProps) {
  return (
    <div
      className={cn(
        "mx-auto flex max-w-lg flex-col items-center rounded-xl border border-stone-200 bg-white px-6 py-12 text-center",
        className
      )}
    >
      {icon && (
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-stone-100 text-stone-600">
          {icon}
        </div>
      )}
      <h2 className="font-heading text-xl font-semibold text-stone-950">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-stone-600">{description}</p>
      {primaryAction && <div className="mt-6">{primaryAction}</div>}
      {secondaryAction && <div className="mt-3">{secondaryAction}</div>}
    </div>
  );
}

interface PanelSectionHeaderProps {
  title: string;
  href?: string;
  linkLabel?: string;
}

export function PanelSectionHeader({
  title,
  href,
  linkLabel = "Tümünü gör →",
}: PanelSectionHeaderProps) {
  return (
    <div className="mb-3 flex items-center justify-between gap-3">
      <h2 className="font-heading text-base font-semibold text-stone-950">{title}</h2>
      {href && (
        <Link
          href={href}
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          {linkLabel}
        </Link>
      )}
    </div>
  );
}
