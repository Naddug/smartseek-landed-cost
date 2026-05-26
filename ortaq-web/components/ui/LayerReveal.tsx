"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { typography } from "@/design/typography";

type LayerRevealProps = {
  depth: string;
  label?: string;
  children: ReactNode;
  className?: string;
  overlap?: boolean;
};

/** Progressive depth marker — entering deeper economic layers */
export function LayerReveal({ depth, label, children, className, overlap }: LayerRevealProps) {
  return (
    <div className={cn(overlap && "layer-overlap", className)}>
      <div className="flex items-baseline gap-3 px-4 sm:px-6 lg:px-8">
        <span className={cn(typography.caption, "tabular-nums text-ortaq-gold/70")}>{depth}</span>
        {label && <span className={cn(typography.caption, "text-ortaq-ink-soft")}>{label}</span>}
      </div>
      {children}
    </div>
  );
}
