import { cn } from "@/lib/utils";

interface StickySummaryCardProps {
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export function StickySummaryCard({
  title,
  children,
  footer,
  className,
}: StickySummaryCardProps) {
  return (
    <aside
      className={cn(
        "sticky top-24 rounded-xl border border-ortaq-line bg-ortaq-surface p-5 shadow-sm",
        className
      )}
    >
      <h3 className="font-heading text-sm font-semibold text-ortaq-navy">
        {title}
      </h3>
      <div className="mt-4 space-y-3 text-sm text-ortaq-text-muted">
        {children}
      </div>
      {footer && (
        <div className="mt-5 border-t border-ortaq-line pt-4">{footer}</div>
      )}
    </aside>
  );
}
