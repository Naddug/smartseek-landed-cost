import { cn } from "@/lib/utils";

interface MetaItem {
  icon?: React.ReactNode;
  label: string;
}

interface OpportunityMetaRowProps {
  items: MetaItem[];
  className?: string;
}

export function OpportunityMetaRow({ items, className }: OpportunityMetaRowProps) {
  return (
    <div className={cn("flex flex-wrap items-center gap-x-4 gap-y-1", className)}>
      {items.map((item, index) => (
        <span
          key={`${item.label}-${index}`}
          className="inline-flex items-center gap-1.5 text-xs text-ortaq-text-muted"
        >
          {item.icon}
          {item.label}
        </span>
      ))}
    </div>
  );
}
