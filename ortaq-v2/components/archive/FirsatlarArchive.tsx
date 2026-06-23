"use client";

import { useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { MarketingDossier } from "@/types/marketing-dossier";
import type { ArchiveFilterState } from "@/types/archive";
import {
  applyArchivePipeline,
  DEFAULT_ARCHIVE_FILTERS,
  getArchiveStats,
  getCuratedDossiers,
  parseArchiveSearchParams,
  serializeArchiveFilters,
} from "@/lib/archive/archive-filters";
import { CuratedRail } from "@/components/archive/CuratedRail";
import { ArchiveFilterBar } from "@/components/archive/ArchiveFilterBar";
import { DossierGrid, DossierList } from "@/components/archive/DossierGrid";
import { ArchiveEmptyState } from "@/components/archive/ArchiveEmptyState";

interface FirsatlarArchiveProps {
  dossiers: MarketingDossier[];
}

export function FirsatlarArchive({ dossiers }: FirsatlarArchiveProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const filters = useMemo(
    () => parseArchiveSearchParams(searchParams),
    [searchParams]
  );

  const published = useMemo(
    () => dossiers.filter((d) => d.status === "published"),
    [dossiers]
  );

  const stats = useMemo(() => getArchiveStats(published), [published]);
  const curated = useMemo(
    () => getCuratedDossiers(published, filters),
    [published, filters]
  );
  const results = useMemo(
    () => applyArchivePipeline(published, filters),
    [published, filters]
  );

  const updateFilters = useCallback(
    (patch: Partial<ArchiveFilterState>) => {
      const next = { ...filters, ...patch };
      const params = serializeArchiveFilters(next);
      const qs = params.toString();
      router.replace(qs ? `/firsatlar?${qs}` : "/firsatlar", { scroll: false });
    },
    [filters, router]
  );

  const resetFilters = useCallback(() => {
    router.replace("/firsatlar", { scroll: false });
  }, [router]);

  return (
    <>
      <CuratedRail dossiers={curated} />

      <ArchiveFilterBar
        filters={filters}
        stats={stats}
        onFilterChange={updateFilters}
      />

      <div className="mt-8">
        {results.length === 0 ? (
          <ArchiveEmptyState onReset={resetFilters} />
        ) : filters.view === "list" ? (
          <DossierList dossiers={results} />
        ) : (
          <DossierGrid dossiers={results} />
        )}
      </div>
    </>
  );
}

export { DEFAULT_ARCHIVE_FILTERS };
