"use client";

import { cn } from "@/lib/utils";

export interface ChipOption {
  value: string;
  label: string;
}

interface ChipSelectProps {
  options: ChipOption[];
  value?: string[];
  onChange?: (value: string[]) => void;
  multiple?: boolean;
  max?: number;
  className?: string;
}

export function ChipSelect({
  options,
  value = [],
  onChange,
  multiple = false,
  max,
  className,
}: ChipSelectProps) {
  const toggle = (optionValue: string) => {
    if (!onChange) return;

    if (multiple) {
      if (value.includes(optionValue)) {
        onChange(value.filter((v) => v !== optionValue));
      } else if (!max || value.length < max) {
        onChange([...value, optionValue]);
      }
    } else {
      onChange([optionValue]);
    }
  };

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {options.map((option) => {
        const selected = value.includes(option.value);
        const disabled = multiple && !selected && max !== undefined && value.length >= max;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => toggle(option.value)}
            disabled={disabled}
            className={cn(
              "rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
              selected
                ? "border-ortaq-action bg-ortaq-action/10 text-ortaq-action"
                : "border-ortaq-line bg-ortaq-surface text-ortaq-text-muted hover:border-ortaq-accent hover:text-ortaq-navy",
              disabled && "cursor-not-allowed opacity-40"
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
