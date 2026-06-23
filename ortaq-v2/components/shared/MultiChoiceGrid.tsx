"use client";

import { ChoiceCard } from "./ChoiceCard";
import type { ChoiceOption } from "./SingleChoiceGrid";

interface MultiChoiceGridProps {
  options: ChoiceOption[];
  value?: string[];
  onChange?: (value: string[]) => void;
  columns?: 1 | 2 | 3;
  max?: number;
}

export function MultiChoiceGrid({
  options,
  value = [],
  onChange,
  columns = 2,
  max,
}: MultiChoiceGridProps) {
  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  };

  const toggle = (optionValue: string) => {
    if (!onChange) return;

    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue));
    } else if (!max || value.length < max) {
      onChange([...value, optionValue]);
    }
  };

  return (
    <div className={`grid gap-3 ${gridCols[columns]}`}>
      {options.map((option) => (
        <ChoiceCard
          key={option.value}
          title={option.title}
          description={option.description}
          icon={option.icon}
          selected={value.includes(option.value)}
          onSelect={() => toggle(option.value)}
        />
      ))}
    </div>
  );
}
