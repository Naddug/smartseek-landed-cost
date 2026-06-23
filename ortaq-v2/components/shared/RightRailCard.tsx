import { cn } from "@/lib/utils";

interface RightRailCardProps {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export function RightRailCard({
  title,
  children,
  action,
  className,
}: RightRailCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-ortaq-line bg-ortaq-surface-alt/50 p-5",
        className
      )}
    >
      <div className="mb-4 flex items-center justify-between gap-2">
        <h3 className="font-heading text-sm font-semibold text-ortaq-navy">
          {title}
        </h3>
        {action}
      </div>
      {children}
    </div>
  );
}
