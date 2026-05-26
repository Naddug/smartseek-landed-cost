import { cn } from "@/lib/cn";
import { typography } from "@/design/typography";
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
        "sm:rounded-ortaq-sm",
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

/** Text block — editorial, no decorative icons */
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
