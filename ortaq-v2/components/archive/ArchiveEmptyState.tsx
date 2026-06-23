"use client";

import { Button } from "@/components/ui/button";

interface ArchiveEmptyStateProps {
  onReset: () => void;
}

export function ArchiveEmptyState({ onReset }: ArchiveEmptyStateProps) {
  return (
    <div className="rounded-xl border border-dashed border-stone-300 bg-stone-50 px-6 py-14 text-center">
      <h2 className="font-heading text-lg font-semibold text-stone-950">
        Bu filtrelerle eşleşen dosya yok
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-stone-600">
        Kategori, ortak türü veya aşama filtrelerini genişleterek arşivdeki diğer
        fırsat dosyalarını inceleyebilirsiniz.
      </p>
      <Button variant="outline" className="mt-6" onClick={onReset}>
        Filtreleri temizle
      </Button>
    </div>
  );
}
