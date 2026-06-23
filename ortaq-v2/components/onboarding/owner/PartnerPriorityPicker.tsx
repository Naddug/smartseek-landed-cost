"use client";

import { cn } from "@/lib/utils";
import { PARTNER_TYPE_OPTIONS } from "@/data/onboarding/owner-options";

interface PartnerPriorityPickerProps {
  priorities: string[];
  onChange: (priorities: string[]) => void;
  max?: number;
  className?: string;
}

const rankLabels = ["1. öncelik", "2. öncelik", "3. öncelik"];

export function PartnerPriorityPicker({
  priorities,
  onChange,
  max = 3,
  className,
}: PartnerPriorityPickerProps) {
  const toggle = (value: string) => {
    if (priorities.includes(value)) {
      onChange(priorities.filter((p) => p !== value));
      return;
    }
    if (priorities.length >= max) return;
    onChange([...priorities, value]);
  };

  return (
    <div className={cn("grid gap-3 sm:grid-cols-2", className)}>
      {PARTNER_TYPE_OPTIONS.map((option) => {
        const rankIndex = priorities.indexOf(option.value);
        const selected = rankIndex >= 0;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => toggle(option.value)}
            disabled={!selected && priorities.length >= max}
            className={cn(
              "relative rounded-xl border p-4 text-left transition-all",
              selected
                ? "border-ortaq-action bg-ortaq-action/5 ring-1 ring-ortaq-action/20"
                : "border-ortaq-line bg-ortaq-surface hover:border-ortaq-accent disabled:opacity-50"
            )}
          >
            {selected && (
              <span className="absolute right-3 top-3 rounded-full bg-ortaq-action px-2 py-0.5 text-xs font-medium text-white">
                {rankLabels[rankIndex]}
              </span>
            )}
            <p className="pr-16 text-sm font-medium text-ortaq-navy">{option.label}</p>
            {!selected && priorities.length >= max && (
              <p className="mt-1 text-xs text-ortaq-text-muted">
                En fazla {max} seçim yapabilirsiniz
              </p>
            )}
          </button>
        );
      })}
      <p className="sm:col-span-2 text-xs text-ortaq-text-muted">
        Seçmek için tıklayın. Tekrar tıklayarak kaldırabilirsiniz. Sıra, seçim
        sırasına göre belirlenir.
      </p>
    </div>
  );
}
