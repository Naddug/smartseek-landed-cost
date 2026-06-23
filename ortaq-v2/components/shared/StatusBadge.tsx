import { cn } from "@/lib/utils";
import type { ReadinessStatus } from "@/types";

type StatusVariant = ReadinessStatus | "default" | "success" | "warning" | "danger";

interface StatusBadgeProps {
  label: string;
  variant?: StatusVariant;
  className?: string;
}

const variantClasses: Record<StatusVariant, string> = {
  draft: "bg-ortaq-surface-alt text-ortaq-text-muted",
  incomplete: "bg-ortaq-warning/10 text-ortaq-warning",
  review_pending: "bg-ortaq-accent/15 text-ortaq-action",
  published: "bg-ortaq-success/10 text-ortaq-success",
  paused: "bg-ortaq-surface-alt text-ortaq-text-muted",
  default: "bg-ortaq-surface-alt text-ortaq-text-muted",
  success: "bg-ortaq-success/10 text-ortaq-success",
  warning: "bg-ortaq-warning/10 text-ortaq-warning",
  danger: "bg-ortaq-danger/10 text-ortaq-danger",
};

export function StatusBadge({
  label,
  variant = "default",
  className,
}: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variantClasses[variant],
        className
      )}
    >
      {label}
    </span>
  );
}
