import Link from "next/link";
import { AlertTriangle, ArrowRight, Compass, User } from "lucide-react";
import type { PanelOverviewPayload } from "@/types/panel";
import { Button } from "@/components/ui/button";
import { ORTAQ_COPY } from "@/lib/copy/ortaq-lexicon";

interface PanelNextActionsProps {
  overview: PanelOverviewPayload;
}

export function PanelNextActions({ overview }: PanelNextActionsProps) {
  const { role, dossiers, matches, profileCompletion } = overview;
  const draftDossier = dossiers.find((d) => d.status === "draft");
  const pendingCount = matches.filter((m) => m.status === "pending").length;
  const showProfileCta = profileCompletion.percent < 80;

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-stone-200 bg-white p-4">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-medium text-stone-950">{ORTAQ_COPY.panel.profileCompletion}</p>
          <span className="text-sm font-semibold tabular-nums text-stone-700">
            %{profileCompletion.percent}
          </span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-stone-100">
          <div
            className="h-full rounded-full bg-blue-600 transition-all"
            style={{ width: `${profileCompletion.percent}%` }}
          />
        </div>
        {showProfileCta && (
          <Link
            href="/panel/profilim"
            className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            <User className="h-3.5 w-3.5" />
            Profili Tamamla
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>

      {draftDossier && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <div className="flex gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0 text-amber-700" />
            <div>
              <p className="text-sm font-medium text-amber-950">
                Taslak dosyan tamamlanmayı bekliyor
              </p>
              <p className="mt-1 text-xs text-amber-800/90">{draftDossier.title}</p>
              <Link
                href={`/panel/firsatlarim/${draftDossier.id}`}
                className="mt-2 inline-flex text-sm font-medium text-amber-900 underline-offset-2 hover:underline"
              >
                Dosyayı tamamla →
              </Link>
            </div>
          </div>
        </div>
      )}

      {pendingCount > 0 && (
        <div className="rounded-xl border border-stone-200 bg-white p-4">
          <p className="text-sm font-medium text-stone-950">
            {pendingCount} bekleyen eşleşme
          </p>
          <Link
            href="/panel/eslesmeler"
            className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            Eşleşmeleri incele
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}

      {(role === "partner" || role === "hybrid") && (
        <div className="rounded-xl border border-stone-200 bg-white p-4">
          <p className="text-sm font-medium text-stone-950">{ORTAQ_COPY.panel.browseSectionTitle}</p>
          <p className="mt-1 text-xs text-stone-600">
            {ORTAQ_COPY.panel.browseSectionDescription}
          </p>
          <Link href="/panel/kesfet" className="mt-3 block">
            <Button size="sm" variant="outline" className="w-full gap-2">
              <Compass className="h-3.5 w-3.5" />
              {ORTAQ_COPY.ctas.browseDossiers}
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
