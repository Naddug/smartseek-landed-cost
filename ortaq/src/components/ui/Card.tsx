import { cn } from "@ortaq/lib/cn";
import type { HTMLAttributes, ReactNode } from "react";

type CardTone = "default" | "flat";

const toneClasses: Record<CardTone, string> = {
  default: "border border-ortaq-border bg-white",
  flat: "border border-ortaq-border bg-ortaq-bg",
};

type CardProps = HTMLAttributes<HTMLDivElement> & {
  tone?: CardTone;
  padding?: "default" | "lg" | "none";
};

export function Card({
  className,
  tone = "default",
  padding = "default",
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-ortaq-lg",
        toneClasses[tone],
        padding === "default" && "p-5 sm:p-6",
        padding === "lg" && "p-6 sm:p-8",
        padding === "none" && "",
        className,
      )}
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

/** Text-only block — no decorative icons. */
export function ProseBlock({ title, description, className, badge }: ProseBlockProps) {
  return (
    <Card tone="default" className={cn("h-full", className)}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h3 className="font-heading text-lg leading-snug text-ortaq-ink">{title}</h3>
        {badge}
      </div>
      <p className="mt-3 text-sm leading-[1.65] text-ortaq-ink-muted">{description}</p>
    </Card>
  );
}
