"use client";

import { ReadinessRing } from "@/components/shared/ReadinessRing";
import { calculateReadinessScore } from "@/lib/readiness-score";
import {
  labelFor,
  CATEGORY_OPTIONS,
  STAGE_OPTIONS,
  BLOCKER_OPTIONS,
  PARTNER_TYPE_OPTIONS,
  RETURN_MODEL_OPTIONS,
  VISIBILITY_OPTIONS,
  TIME_COMMITMENT_OPTIONS,
  CONTRIBUTION_OPTIONS,
} from "@/data/onboarding/owner-options";
import type { OwnerOnboardingState } from "@/types/opportunity-dossier";

interface OwnerDraftSummarySidebarProps {
  draft: OwnerOnboardingState;
  currentStep: number;
  totalSteps: number;
}

export function OwnerDraftSummarySidebar({
  draft,
  currentStep,
  totalSteps,
}: OwnerDraftSummarySidebarProps) {
  const score = calculateReadinessScore(draft);

  const locationDisplay = draft.locationCity
    ? draft.hideDistrict || !draft.locationDistrict
      ? draft.locationCity
      : `${draft.locationCity}, ${draft.locationDistrict}`
    : undefined;

  const items = [
    { label: "Kategori", value: draft.category ? labelFor(CATEGORY_OPTIONS, draft.category) : undefined },
    { label: "Aşama", value: draft.stage ? labelFor(STAGE_OPTIONS, draft.stage) : undefined },
    {
      label: "Varlıklar",
      value: draft.selectedAssets.length
        ? `${draft.selectedAssets.length} seçildi`
        : undefined,
    },
    {
      label: "Engeller",
      value: draft.selectedBlockers.length
        ? draft.selectedBlockers
            .map((b) => labelFor(BLOCKER_OPTIONS, b))
            .join(", ")
        : undefined,
    },
    {
      label: "Aranan ortak",
      value: draft.partnerPriorities.length
        ? draft.partnerPriorities
            .map((p, i) => `${i + 1}. ${labelFor(PARTNER_TYPE_OPTIONS, p)}`)
            .join(" · ")
        : undefined,
    },
    {
      label: "Karşılık",
      value: draft.returnModel
        ? labelFor(RETURN_MODEL_OPTIONS, draft.returnModel)
        : undefined,
    },
    { label: "Konum", value: locationDisplay },
    {
      label: "Görünürlük",
      value: draft.visibilityLevel
        ? labelFor(VISIBILITY_OPTIONS, draft.visibilityLevel)
        : undefined,
    },
    {
      label: "Zaman",
      value: draft.expectedTimeCommitment
        ? labelFor(TIME_COMMITMENT_OPTIONS, draft.expectedTimeCommitment)
        : undefined,
    },
    {
      label: "Beklentiler",
      value: draft.expectedContributions.length
        ? draft.expectedContributions
            .map((c) => labelFor(CONTRIBUTION_OPTIONS, c))
            .slice(0, 2)
            .join(", ") + (draft.expectedContributions.length > 2 ? "…" : "")
        : undefined,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-ortaq-line bg-ortaq-surface p-5">
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-sm font-semibold text-ortaq-navy">
            Fırsat dosyası özeti
          </h3>
          <ReadinessRing score={score} size={40} />
        </div>
        <p className="mt-2 text-xs text-ortaq-text-muted">
          Adım {currentStep} / {totalSteps}
        </p>
        <dl className="mt-4 space-y-2.5">
          {items.map((item) => (
            <div key={item.label}>
              <dt className="text-xs text-ortaq-text-muted">{item.label}</dt>
              <dd className="mt-0.5 text-sm font-medium text-ortaq-navy">
                {item.value ?? (
                  <span className="font-normal text-ortaq-text-muted/60">—</span>
                )}
              </dd>
            </div>
          ))}
        </dl>
        {(draft.title || draft.summary) && (
          <div className="mt-4 border-t border-ortaq-line pt-4">
            {draft.title && (
              <p className="text-sm font-medium text-ortaq-navy">{draft.title}</p>
            )}
            {draft.summary && (
              <p className="mt-1 text-xs text-ortaq-text-muted">{draft.summary}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
