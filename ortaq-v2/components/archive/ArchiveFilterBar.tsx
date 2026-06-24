"use client";

import type { ArchiveFilterState } from "@/types/archive";
import type { ArchiveMeta } from "@/types/marketing-dossier";
import {
  CATEGORY_FILTER_OPTIONS,
  PARTNER_FILTER_OPTIONS,
  SORT_OPTIONS,
  STAGE_FILTER_OPTIONS,
} from "@/lib/archive/archive-filters";
import { FilterChip } from "@/components/archive/FilterChip";
import { GridListToggle } from "@/components/archive/GridListToggle";

interface ArchiveFilterBarProps {
  filters: ArchiveFilterState;
  stats: ArchiveMeta;
  onFilterChange: (patch: Partial<ArchiveFilterState>) => void;
}

function FilterRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-start sm:gap-3">
      <span className="shrink-0 pt-1.5 type-meta sm:w-24">
        {label}
      </span>
      <div className="scrollbar-hide flex gap-1.5 overflow-x-auto pb-0.5">{children}</div>
    </div>
  );
}

export function ArchiveFilterBar({
  filters,
  stats,
  onFilterChange,
}: ArchiveFilterBarProps) {
  return (
    <div className="sticky top-14 z-40 -mx-4 border-b border-ortaq-line bg-ortaq-surface/98 px-4 py-5 backdrop-blur-md md:-mx-0 md:px-0">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="type-meta text-ortaq-text-secondary">
          {stats.activeCount} Aktif Dosya · {stats.newThisWeek} Yeni Bu Hafta
        </p>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-xs text-ortaq-text-secondary">
            <span className="hidden sm:inline">Sırala</span>
            <select
              value={filters.sort}
              onChange={(e) =>
                onFilterChange({
                  sort: e.target.value as ArchiveFilterState["sort"],
                })
              }
              className="rounded-md border border-stone-200 bg-white px-2 py-1.5 text-xs text-stone-800 focus:border-stone-400 focus:outline-none"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>
          <GridListToggle
            view={filters.view}
            onChange={(view) => onFilterChange({ view })}
          />
        </div>
      </div>

      <div className="space-y-3">
        <FilterRow label="Kategori">
          {CATEGORY_FILTER_OPTIONS.map((opt) => (
            <FilterChip
              key={opt.value}
              label={opt.label}
              active={filters.category === opt.value}
              onClick={() => onFilterChange({ category: opt.value })}
            />
          ))}
        </FilterRow>
        <FilterRow label="Ortak türü">
          {PARTNER_FILTER_OPTIONS.map((opt) => (
            <FilterChip
              key={opt.value}
              label={opt.label}
              active={filters.partnerType === opt.value}
              onClick={() => onFilterChange({ partnerType: opt.value })}
            />
          ))}
        </FilterRow>
        <FilterRow label="Aşama">
          {STAGE_FILTER_OPTIONS.map((opt) => (
            <FilterChip
              key={opt.value}
              label={opt.label}
              active={filters.stage === opt.value}
              onClick={() => onFilterChange({ stage: opt.value })}
            />
          ))}
        </FilterRow>
      </div>
    </div>
  );
}
