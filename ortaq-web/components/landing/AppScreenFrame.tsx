import type { ReactNode } from "react";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

type AppScreenFrameProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
};

/** Product UI chrome — reads like an in-app screen, not marketing copy. */
export function AppScreenFrame({ title, subtitle, children, className }: AppScreenFrameProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-ortaq-lg border border-ortaq-border-strong bg-ortaq-surface shadow-[var(--shadow-intel)]",
        className,
      )}
    >
      <div className="flex items-center gap-1.5 border-b border-ortaq-border bg-ortaq-bg-alt px-3 py-2">
        <span className="h-2 w-2 rounded-full bg-ortaq-border-strong" aria-hidden />
        <span className="h-2 w-2 rounded-full bg-ortaq-border-strong" aria-hidden />
        <span className="h-2 w-2 rounded-full bg-ortaq-border-strong" aria-hidden />
        <span className={cn(typography.caption, "ml-2 truncate font-medium text-ortaq-ink-muted")}>{title}</span>
      </div>
      {subtitle && (
        <div className="border-b border-ortaq-border px-3 py-2">
          <p className={cn(typography.bodySm, "font-medium text-ortaq-ink")}>{subtitle}</p>
        </div>
      )}
      <div className="p-3 sm:p-4">{children}</div>
    </div>
  );
}
