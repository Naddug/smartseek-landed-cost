"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FirsatlarimFilter, PanelDossier } from "@/types/panel";
import { filterMatchesStatus } from "@/lib/panel/dossier-status";
import { PanelDossierListRow } from "@/components/panel/PanelDossierSummaryRow";
import { PanelEmptyState } from "@/components/panel/PanelEmptyState";
import { Button } from "@/components/ui/button";
import { ORTAQ_COPY } from "@/lib/copy/ortaq-lexicon";

const TABS: { id: FirsatlarimFilter; label: string }[] = [
  { id: "all", label: "Tümü" },
  { id: "published", label: "Yayında" },
  { id: "under_review", label: "İncelemede" },
  { id: "draft", label: "Taslak" },
  { id: "rejected", label: "Reddedildi" },
];

interface FirsatlarimListProps {
  dossiers: PanelDossier[];
}

export function FirsatlarimList({ dossiers }: FirsatlarimListProps) {
  const [filter, setFilter] = useState<FirsatlarimFilter>("all");

  const filtered = useMemo(
    () => dossiers.filter((d) => filterMatchesStatus(d.status, filter)),
    [dossiers, filter]
  );

  if (dossiers.length === 0) {
    return (
      <PanelEmptyState
        title="Henüz bir fırsat dosyanız yok."
        description={ORTAQ_COPY.panel.dossierEmptyDescription}
        primaryAction={
          <Link href="/panel/dosya-olustur">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4" />
              Yeni Dosya Oluştur
            </Button>
          </Link>
        }
        secondaryAction={
          <Link href="/firsatlar" className="text-sm font-medium text-blue-600 hover:underline">
            Örnek dosyaları incele →
          </Link>
        }
      />
    );
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-1 border-b border-stone-200">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setFilter(tab.id)}
            className={cn(
              "border-b-2 px-3 py-2 text-sm font-medium transition-colors",
              filter === tab.id
                ? "border-stone-950 text-stone-950"
                : "border-transparent text-stone-500 hover:text-stone-800"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-xl border border-stone-200 bg-white px-4 py-8 text-center text-sm text-stone-600">
          Bu filtrede dosya bulunmuyor.
        </p>
      ) : (
        <div className="overflow-hidden rounded-xl border border-stone-200 bg-white">
          {filtered.map((dossier) => (
            <PanelDossierListRow key={dossier.id} dossier={dossier} />
          ))}
        </div>
      )}
    </div>
  );
}
