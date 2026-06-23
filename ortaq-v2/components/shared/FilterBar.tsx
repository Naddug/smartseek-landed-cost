"use client";

import { cn } from "@/lib/utils";
import { ChipSelect, type ChipOption } from "./ChipSelect";

interface FilterBarProps {
  searchPlaceholder?: string;
  filters?: { id: string; label: string; options: ChipOption[] }[];
  className?: string;
}

export function FilterBar({
  searchPlaceholder = "Ara…",
  filters = [],
  className,
}: FilterBarProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-ortaq-line bg-ortaq-surface p-4",
        className
      )}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <input
          type="search"
          placeholder={searchPlaceholder}
          className="h-10 w-full max-w-sm rounded-lg border border-ortaq-line bg-ortaq-bg px-3 text-sm text-ortaq-text-main placeholder:text-ortaq-text-muted focus:border-ortaq-action focus:outline-none focus:ring-2 focus:ring-ortaq-action/20"
          disabled
          aria-label="Arama"
        />
        {/* TODO: Connect search and filter state to API */}
      </div>
      {filters.length > 0 && (
        <div className="mt-4 space-y-3 border-t border-ortaq-line pt-4">
          {filters.map((filter) => (
            <div key={filter.id}>
              <p className="mb-2 text-xs font-medium text-ortaq-text-muted">
                {filter.label}
              </p>
              <ChipSelect options={filter.options} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
