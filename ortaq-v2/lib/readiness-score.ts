import type { OwnerOnboardingState } from "@/types/opportunity-dossier";

/**
 * Lightweight MVP readiness score — capped at 100.
 * Narrative is optional and does not affect score.
 */
export function calculateReadinessScore(state: Partial<OwnerOnboardingState>): number {
  let score = 0;

  if (state.category) score += 5;
  if (state.stage) score += 5;
  if ((state.selectedAssets?.length ?? 0) >= 3) score += 10;
  if ((state.selectedBlockers?.length ?? 0) >= 1) score += 10;
  if ((state.partnerPriorities?.length ?? 0) >= 1) score += 10;
  if (state.returnModel) score += 10;
  if (state.locationCity) score += 5;
  if ((state.evidenceFiles?.length ?? 0) >= 1) score += 10;
  if (state.title?.trim() && state.summary?.trim()) score += 10;

  if ((state.selectedAssets?.length ?? 0) >= 5) score += 10;
  if ((state.partnerPriorities?.length ?? 0) >= 2) score += 10;
  if ((state.expectedContributions?.length ?? 0) >= 1) score += 5;

  return Math.min(100, score);
}

export interface ScoreChecklistItem {
  id: string;
  label: string;
  done: boolean;
}

export function getScoreImprovementChecklist(
  state: Partial<OwnerOnboardingState>
): ScoreChecklistItem[] {
  return [
    {
      id: "evidence",
      label: "En az bir kanıt ekleyin",
      done: (state.evidenceFiles?.length ?? 0) >= 1,
    },
    {
      id: "partners",
      label: "Ortak önceliklerinizi netleştirin (en az 2)",
      done: (state.partnerPriorities?.length ?? 0) >= 2,
    },
    {
      id: "title",
      label: "Başlık ve özeti güçlendirin",
      done: Boolean(state.title?.trim() && state.summary?.trim()),
    },
    {
      id: "assets",
      label: "En az 5 varlık seçin",
      done: (state.selectedAssets?.length ?? 0) >= 5,
    },
    {
      id: "contributions",
      label: "Ortaktan beklentilerinizi işaretleyin",
      done: (state.expectedContributions?.length ?? 0) >= 1,
    },
  ].filter((item) => !item.done);
}
