"use client";

import { cn } from "@/lib/utils";
import { GripVertical } from "lucide-react";

export interface PriorityOption {
  value: string;
  label: string;
  description?: string;
}

interface PrioritySelectCardsProps {
  options: PriorityOption[];
  orderedValues?: string[];
  onReorder?: (values: string[]) => void;
  className?: string;
}

export function PrioritySelectCards({
  options,
  orderedValues = [],
  onReorder,
  className,
}: PrioritySelectCardsProps) {
  const ordered =
    orderedValues.length > 0
      ? orderedValues
          .map((v) => options.find((o) => o.value === v))
          .filter(Boolean)
      : options;

  const move = (index: number, direction: -1 | 1) => {
    if (!onReorder) return;
    const next = [...orderedValues.length ? orderedValues : options.map((o) => o.value)];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onReorder(next);
  };

  return (
    <div className={cn("space-y-2", className)}>
      {ordered.map((option, index) => {
        if (!option) return null;
        return (
          <div
            key={option.value}
            className="flex items-center gap-3 rounded-xl border border-ortaq-line bg-ortaq-surface p-4"
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ortaq-surface-alt text-xs font-semibold text-ortaq-navy">
              {index + 1}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-ortaq-navy">{option.label}</p>
              {option.description && (
                <p className="text-xs text-ortaq-text-muted">{option.description}</p>
              )}
            </div>
            <div className="flex shrink-0 flex-col gap-0.5">
              <button
                type="button"
                onClick={() => move(index, -1)}
                disabled={index === 0}
                className="rounded p-1 text-ortaq-text-muted hover:bg-ortaq-surface-alt disabled:opacity-30"
                aria-label="Yukarı taşı"
              >
                <GripVertical className="h-4 w-4 rotate-180" />
              </button>
              <button
                type="button"
                onClick={() => move(index, 1)}
                disabled={index === ordered.length - 1}
                className="rounded p-1 text-ortaq-text-muted hover:bg-ortaq-surface-alt disabled:opacity-30"
                aria-label="Aşağı taşı"
              >
                <GripVertical className="h-4 w-4" />
              </button>
            </div>
          </div>
        );
      })}
      {/* TODO: Replace with drag-and-drop when onboarding logic is built */}
    </div>
  );
}
