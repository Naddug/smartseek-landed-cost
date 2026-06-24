"use client";

import { Button } from "@/components/ui/button";
import { ORTAQ_COPY } from "@/lib/copy/ortaq-lexicon";

interface ArchiveEmptyStateProps {
  onReset: () => void;
}

export function ArchiveEmptyState({ onReset }: ArchiveEmptyStateProps) {
  return (
    <div className="rounded-xl border border-dashed border-stone-300 bg-stone-50 px-6 py-14 text-center">
      <h2 className="font-heading text-lg font-semibold text-stone-950">
        {ORTAQ_COPY.archive.emptyTitle}
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-stone-600">
        {ORTAQ_COPY.archive.emptyDescription}
      </p>
      <Button variant="outline" className="mt-6" onClick={onReset}>
        {ORTAQ_COPY.archive.emptyReset}
      </Button>
    </div>
  );
}
