import { cn } from "@/lib/cn";
import { typography } from "@/design/typography";
import type { HTMLAttributes, ReactNode } from "react";

/**
 * Card primitives.
 *
 * Both Card and ProseBlock render the canonical `.product-card` chrome
 * (defined once in globals.css), same radius, same border, same shadow.
 * Density differs at the padding/content level, not the shell.
 *
 * `tone="flat"` is intended only for low-emphasis cards nested inside another
 * card; it drops the shadow but keeps every other contract.
 */

type CardTone = "default" | "flat";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  tone?: CardTone;
  padding?: "default" | "lg" | "none";
};

export function Card({
  className, tone = "default", padding = "default", children, ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "product-card", tone === "flat" && "shadow-none bg-ortaq-bg-alt/40", padding === "default" && "p-4 sm:p-5", padding === "lg" && "p-5 sm:p-7", padding === "none" && "", className, )}
      {...props}
    >
      {children}
    </div>
  );
}

type ProseBlockProps = {
  title: string;
  description: string;
  className?: string;
  badge?: ReactNode;
};

export function ProseBlock({ title, description, className, badge }: ProseBlockProps) {
  return (
    <Card tone="default" className={cn("h-full", className)}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h3 className={typography.h3}>{title}</h3>
        {badge}
      </div>
      <p className={cn(typography.bodySm, "mt-3")}>{description}</p>
    </Card>
  );
}
