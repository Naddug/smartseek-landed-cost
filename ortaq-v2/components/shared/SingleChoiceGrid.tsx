"use client";

import { ChoiceCard } from "./ChoiceCard";

export interface ChoiceOption {
  value: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
}

interface SingleChoiceGridProps {
  options: ChoiceOption[];
  value?: string;
  onChange?: (value: string) => void;
  columns?: 1 | 2 | 3;
}

export function SingleChoiceGrid({
  options,
  value,
  onChange,
  columns = 2,
}: SingleChoiceGridProps) {
  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  };

  return (
    <div className={`grid gap-3 ${gridCols[columns]}`}>
      {options.map((option) => (
        <ChoiceCard
          key={option.value}
          title={option.title}
          description={option.description}
          icon={option.icon}
          selected={value === option.value}
          onSelect={() => onChange?.(option.value)}
        />
      ))}
    </div>
  );
}
