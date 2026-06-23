import { AlertCircle } from "lucide-react";
import type { PublicDossierDetail } from "@/types/dossier-detail";

interface ModerationNoteCardProps {
  dossier: PublicDossierDetail;
}

export function ModerationNoteCard({ dossier }: ModerationNoteCardProps) {
  if (!dossier.moderationNote && dossier.status !== "rejected") {
    return null;
  }

  const isRejected = dossier.status === "rejected";

  return (
    <div
      className={
        isRejected
          ? "rounded-lg border border-red-200 bg-red-50 p-4"
          : "rounded-lg border border-amber-200 bg-amber-50 p-4"
      }
    >
      <div className="flex items-start gap-2">
        <AlertCircle
          className={
            isRejected
              ? "mt-0.5 h-4 w-4 shrink-0 text-red-600"
              : "mt-0.5 h-4 w-4 shrink-0 text-amber-600"
          }
        />
        <div>
          <p
            className={
              isRejected
                ? "text-sm font-medium text-red-900"
                : "text-sm font-medium text-amber-900"
            }
          >
            {isRejected ? "Moderasyon notu — red" : "Moderasyon notu"}
          </p>
          {dossier.moderationNote && (
            <p
              className={
                isRejected
                  ? "mt-1 text-xs leading-relaxed text-red-800/90"
                  : "mt-1 text-xs leading-relaxed text-amber-800/90"
              }
            >
              {dossier.moderationNote}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
