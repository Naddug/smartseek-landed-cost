import { cn } from "@/lib/utils";

interface StatPillProps {
  label: string;
  value: string | number;
  className?: string;
}

export function StatPill({ label, value, className }: StatPillProps) {
  return (
    <div
      className={cn(
        "inline-flex flex-col rounded-lg border border-ortaq-line bg-ortaq-surface px-3 py-2",
        className
      )}
    >
      <span className="text-xs text-ortaq-text-muted">{label}</span>
      <span className="font-heading text-sm font-semibold text-ortaq-navy">
        {value}
      </span>
    </div>
  );
}
