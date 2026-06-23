import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { StatusBadge } from "@/components/shared/StatusBadge";
import type { PanelDossier } from "@/types/panel";
import {
  panelStatusLabel,
  panelStatusVariant,
} from "@/lib/panel/dossier-status";

interface PanelDossierSummaryRowProps {
  dossier: PanelDossier;
}

export function PanelDossierSummaryRow({ dossier }: PanelDossierSummaryRowProps) {
  const updated = new Date(dossier.updatedAt).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "short",
  });

  return (
    <div className="flex items-center gap-3 border-b border-stone-100 px-4 py-3 last:border-b-0">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[10px] uppercase tracking-wide text-stone-500">
            {dossier.refCode}
          </span>
          <StatusBadge
            label={panelStatusLabel(dossier.status)}
            variant={panelStatusVariant(dossier.status)}
          />
        </div>
        <p className="mt-1 truncate text-sm font-medium text-stone-950">
          {dossier.title}
        </p>
        <p className="text-xs text-stone-500">Güncelleme · {updated}</p>
      </div>
      <Link
        href={`/panel/firsatlarim/${dossier.id}`}
        className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
      >
        Yönet
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}

interface PanelDossierListRowProps {
  dossier: PanelDossier;
}

export function PanelDossierListRow({ dossier }: PanelDossierListRowProps) {
  const updated = new Date(dossier.updatedAt).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="flex flex-col gap-3 border-b border-stone-100 px-4 py-4 last:border-b-0 sm:flex-row sm:items-center">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[10px] uppercase tracking-wide text-stone-500">
            {dossier.refCode}
          </span>
          <span className="text-xs text-stone-500">{dossier.category}</span>
          <StatusBadge
            label={panelStatusLabel(dossier.status)}
            variant={panelStatusVariant(dossier.status)}
          />
        </div>
        <p className="mt-1 text-sm font-medium text-stone-950">{dossier.title}</p>
      </div>
      <div className="flex items-center gap-4 sm:shrink-0">
        <span className="text-xs text-stone-500">{updated}</span>
        <Link
          href={`/panel/firsatlarim/${dossier.id}`}
          className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          Yönet
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
