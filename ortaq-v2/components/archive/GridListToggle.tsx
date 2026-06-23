"use client";

import { LayoutGrid, List } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ArchiveViewMode } from "@/types/archive";

interface GridListToggleProps {
  view: ArchiveViewMode;
  onChange: (view: ArchiveViewMode) => void;
}

export function GridListToggle({ view, onChange }: GridListToggleProps) {
  return (
    <div className="flex rounded-lg border border-stone-200 p-0.5">
      <button
        type="button"
        aria-label="Izgara görünümü"
        aria-pressed={view === "grid"}
        onClick={() => onChange("grid")}
        className={cn(
          "rounded-md p-1.5 transition-colors",
          view === "grid" ? "bg-stone-900 text-white" : "text-stone-500 hover:text-stone-800"
        )}
      >
        <LayoutGrid className="h-4 w-4" />
      </button>
      <button
        type="button"
        aria-label="Liste görünümü"
        aria-pressed={view === "list"}
        onClick={() => onChange("list")}
        className={cn(
          "rounded-md p-1.5 transition-colors",
          view === "list" ? "bg-stone-900 text-white" : "text-stone-500 hover:text-stone-800"
        )}
      >
        <List className="h-4 w-4" />
      </button>
    </div>
  );
}
