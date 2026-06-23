"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface ChoiceCardProps {
  title: string;
  description?: string;
  selected?: boolean;
  onSelect?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

export function ChoiceCard({
  title,
  description,
  selected = false,
  onSelect,
  icon,
  className,
}: ChoiceCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "relative flex w-full flex-col rounded-xl border p-5 text-left transition-all",
        selected
          ? "border-ortaq-action bg-ortaq-action/5 ring-1 ring-ortaq-action/20"
          : "border-ortaq-line bg-ortaq-surface hover:border-ortaq-accent",
        className
      )}
    >
      {selected && (
        <span className="absolute right-4 top-4 flex h-5 w-5 items-center justify-center rounded-full bg-ortaq-action text-white">
          <Check className="h-3 w-3" />
        </span>
      )}
      {icon && (
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-ortaq-surface-alt text-ortaq-navy">
          {icon}
        </div>
      )}
      <h3 className="font-heading text-base font-semibold text-ortaq-navy">
        {title}
      </h3>
      {description && (
        <p className="mt-1.5 text-sm leading-relaxed text-ortaq-text-muted">
          {description}
        </p>
      )}
    </button>
  );
}
