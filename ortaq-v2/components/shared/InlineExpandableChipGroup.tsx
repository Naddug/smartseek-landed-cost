"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { ChipSelect, type ChipOption } from "./ChipSelect";

interface InlineExpandableChipGroupProps {
  label: string;
  options: ChipOption[];
  value?: string[];
  onChange?: (value: string[]) => void;
  defaultExpanded?: boolean;
  className?: string;
}

export function InlineExpandableChipGroup({
  label,
  options,
  value = [],
  onChange,
  defaultExpanded = false,
  className,
}: InlineExpandableChipGroupProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <div className={cn("rounded-xl border border-ortaq-line bg-ortaq-surface", className)}>
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between px-4 py-3 text-left"
      >
        <span className="text-sm font-medium text-ortaq-navy">{label}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-ortaq-text-muted transition-transform",
            expanded && "rotate-180"
          )}
        />
      </button>
      {expanded && (
        <div className="border-t border-ortaq-line px-4 py-3">
          <ChipSelect options={options} value={value} onChange={onChange} multiple />
        </div>
      )}
    </div>
  );
}
