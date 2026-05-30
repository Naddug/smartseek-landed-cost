import { cn } from "@ortaq/lib/cn";

type EmptyStateBlockProps = {
  title: string;
  description: string;
  className?: string;
  children?: React.ReactNode;
};

/** Honest empty / waiting state. No skeleton, no fake loading. */
export function EmptyStateBlock({ title, description, className, children }: EmptyStateBlockProps) {
  return (
    <div className={cn("rounded-ortaq-lg border border-ortaq-border bg-ortaq-bg-alt px-5 py-5 sm:px-6", className)}>
      <p className="font-heading text-base text-ortaq-ink">{title}</p>
      <p className="mt-2 text-sm leading-[1.65] text-ortaq-ink-muted">{description}</p>
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}
