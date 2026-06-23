import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  eyebrow?: string;
  action?: React.ReactNode;
  className?: string;
  align?: "left" | "center";
}

export function PageHeader({
  title,
  description,
  eyebrow,
  action,
  className,
  align = "left",
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        "mb-8 flex flex-col gap-4 border-b border-ortaq-line pb-6 md:mb-10 md:flex-row md:items-end md:justify-between",
        align === "center" && "items-center text-center md:flex-col md:items-center",
        className
      )}
    >
      <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
        {eyebrow && (
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-ortaq-text-muted">
            {eyebrow}
          </p>
        )}
        <h1 className="font-heading text-3xl font-semibold tracking-tight text-ortaq-navy md:text-4xl">
          {title}
        </h1>
        {description && (
          <p className="mt-2 text-base leading-relaxed text-ortaq-text-muted">
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </header>
  );
}
