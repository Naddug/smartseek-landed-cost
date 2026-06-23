import { cn } from "@/lib/utils";

interface FilterChipProps {
  label: string;
  active: boolean;
  onClick: () => void;
  className?: string;
}

export function FilterChip({ label, active, onClick, className }: FilterChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "shrink-0 rounded-md border px-2.5 py-1.5 text-xs font-medium transition-colors",
        active
          ? "border-ortaq-navy bg-ortaq-navy text-white shadow-ortaq-sm"
          : "border-ortaq-line bg-ortaq-surface text-ortaq-text-secondary hover:border-ortaq-line-strong hover:bg-ortaq-surface-alt",
        className
      )}
    >
      {label}
    </button>
  );
}
