import Link from "next/link";
import { StatusBadge } from "@/components/shared/StatusBadge";
import type { PanelMatch } from "@/types/panel";
import { formatRelativeTimeTr } from "@/lib/panel/format-relative-time";

interface PanelMatchCardProps {
  match: PanelMatch;
}

export function PanelMatchCard({ match }: PanelMatchCardProps) {
  return (
    <div className="rounded-lg border border-stone-200 bg-stone-50/50 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <StatusBadge
            label={match.status === "pending" ? "Bekliyor" : "Aktif"}
            variant={match.status === "pending" ? "warning" : "success"}
          />
          <p className="mt-2 text-sm font-medium text-stone-950">{match.dossierTitle}</p>
          {match.counterpartName && (
            <p className="mt-1 text-xs text-stone-600">
              {match.counterpartName}
              {match.counterpartType ? ` · ${match.counterpartType}` : ""}
            </p>
          )}
          <p className="mt-1 text-xs text-stone-500">
            {formatRelativeTimeTr(match.createdAt)}
          </p>
        </div>
        <Link
          href={
            match.dossierSlug
              ? `/firsatlar/${match.dossierSlug}`
              : `/panel/eslesmelerim?match=${match.id}`
          }
          className="shrink-0 text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          Görüntüle
        </Link>
      </div>
    </div>
  );
}
