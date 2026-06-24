"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { WizardLayout } from "@/components/shared/WizardLayout";
import { WizardStepHeader } from "@/components/shared/WizardStepHeader";
import { ProgressHeader } from "@/components/shared/ProgressHeader";
import { SingleChoiceGrid } from "@/components/shared/SingleChoiceGrid";
import { ChipSelect } from "@/components/shared/ChipSelect";
import { Button } from "@/components/ui/button";
import { ReadinessRing } from "@/components/shared/ReadinessRing";
import { OwnerDraftSummarySidebar } from "./OwnerDraftSummarySidebar";
import { AssetSelector } from "./AssetSelector";
import { PartnerPriorityPicker } from "./PartnerPriorityPicker";
import { EvidenceUploader } from "./EvidenceUploader";
import { useOwnerOnboardingDraft } from "@/hooks/useOwnerOnboardingDraft";
import { saveOpportunityDossier } from "@/lib/actions/opportunity-dossier";
import { saveOwnerOnboardingProgress } from "@/lib/actions/profile-onboarding";
import { calculateReadinessScore } from "@/lib/readiness-score";
import {
  CATEGORY_OPTIONS,
  STAGE_OPTIONS,
  BLOCKER_OPTIONS,
  TIME_COMMITMENT_OPTIONS,
  CONTRIBUTION_OPTIONS,
  RETURN_MODEL_OPTIONS,
  VISIBILITY_OPTIONS,
  TURKISH_CITIES,
  labelFor,
  ASSET_OPTIONS,
  PARTNER_TYPE_OPTIONS,
} from "@/data/onboarding/owner-options";
import type { OwnerOnboardingState } from "@/types/opportunity-dossier";

const TOTAL_STEPS = 12;

const PROGRESS_STEPS = [
  { id: "1", label: "Alan" },
  { id: "2", label: "Aşama" },
  { id: "3", label: "Varlık" },
  { id: "4", label: "Engel" },
  { id: "5", label: "Ortak" },
  { id: "6", label: "Beklenti" },
  { id: "7", label: "Karşılık" },
  { id: "8", label: "Konum" },
  { id: "9", label: "Gizlilik" },
  { id: "10", label: "Kanıt" },
  { id: "11", label: "Not" },
  { id: "12", label: "Özet" },
];

const STEP_META: { title: string; description?: string }[] = [
  { title: "Fırsatınız hangi alanda?" },
  {
    title: "Fırsatınız şu an hangi aşamada?",
    description: "Durumu doğru seçmek, dosyanızın yapılandırılmasına yardımcı olur.",
  },
  { title: "Şu an elinizde ne var? Tümünü seçin." },
  {
    title: "Bu fırsat neden henüz ilerleyemedi? En fazla 3 seçim yapın.",
  },
  {
    title: "Bu fırsatı ilerletmek için hangi tür ortak arıyorsunuz?",
    description: "En fazla 3 öncelik belirleyebilirsiniz.",
  },
  { title: "Ortağınızdan ne bekliyorsunuz?" },
  { title: "Ortağınıza ne sunuyorsunuz?" },
  { title: "Fırsatınız nerede?" },
  { title: "Bu fırsatı kimlerin görmesini istiyorsunuz?" },
  {
    title: "Fırsatın gerçekliğini destekleyen bir şey eklemek ister misiniz?",
    description: "İsteğe bağlı. Bu adımı atlayabilirsiniz.",
  },
  {
    title: "Eklemek istediğiniz kısa bir not var mı?",
    description: "İsteğe bağlı, en fazla 400 karakter.",
  },
  { title: "Dosyanıza bir başlık verin." },
];

function canProceed(step: number, draft: OwnerOnboardingState): boolean {
  switch (step) {
    case 1:
      return Boolean(draft.category);
    case 2:
      return Boolean(draft.stage);
    case 3:
      return draft.selectedAssets.length >= 1;
    case 4:
      return draft.selectedBlockers.length >= 1;
    case 5:
      return draft.partnerPriorities.length >= 1;
    case 6:
      return (
        Boolean(draft.expectedTimeCommitment) &&
        draft.expectedContributions.length >= 1
      );
    case 7:
      return Boolean(draft.returnModel);
    case 8:
      return Boolean(draft.locationCity);
    case 9:
      return Boolean(draft.visibilityLevel);
    case 10:
    case 11:
      return true;
    case 12:
      return Boolean(draft.title.trim() && draft.summary.trim());
    default:
      return false;
  }
}

interface OwnerOnboardingWizardProps {
  initialDraft?: OwnerOnboardingState;
  existingId?: string;
}

export function OwnerOnboardingWizard({
  initialDraft,
  existingId,
}: OwnerOnboardingWizardProps) {
  const router = useRouter();
  const { draft, updateDraft, resetDraft, hydrated } = useOwnerOnboardingDraft(initialDraft);
  const [step, setStep] = useState(1);
  const [evidenceTag, setEvidenceTag] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ortaq-bg text-sm text-ortaq-text-muted">
        Yükleniyor…
      </div>
    );
  }

  const meta = STEP_META[step - 1];
  const score = calculateReadinessScore(draft);

  const handleSave = (partial: boolean) => {
    setError(null);
    startTransition(async () => {
      try {
        const { id } = await saveOpportunityDossier(draft, {
          existingId,
          partial,
        });
        if (!partial) resetDraft();
        router.push(`/panel/firsatlarim/${id}`);
      } catch {
        setError("Kayıt sırasında bir sorun oluştu. Lütfen tekrar deneyin.");
      }
    });
  };

  const persistOwnerProgress = (nextStep: number) => {
    void saveOwnerOnboardingProgress({
      lastStep: nextStep,
      category: draft.category,
      stage: draft.stage,
      locationCity: draft.locationCity,
      selectedAssets: draft.selectedAssets,
      selectedBlockers: draft.selectedBlockers,
      partnerPriorities: draft.partnerPriorities,
    });
  };

  const goToNextStep = () => {
    const nextStep = step + 1;
    persistOwnerProgress(nextStep);
    setStep(nextStep);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <SingleChoiceGrid
            options={CATEGORY_OPTIONS}
            value={draft.category}
            onChange={(v) => updateDraft({ category: v })}
            columns={2}
          />
        );
      case 2:
        return (
          <SingleChoiceGrid
            options={STAGE_OPTIONS}
            value={draft.stage}
            onChange={(v) => updateDraft({ stage: v })}
            columns={1}
          />
        );
      case 3:
        return (
          <AssetSelector
            selected={draft.selectedAssets}
            followUps={draft.assetFollowUps}
            onChange={(selected, assetFollowUps) =>
              updateDraft({ selectedAssets: selected, assetFollowUps })
            }
          />
        );
      case 4:
        return (
          <ChipSelect
            options={BLOCKER_OPTIONS}
            value={draft.selectedBlockers}
            onChange={(v) => updateDraft({ selectedBlockers: v })}
            multiple
            max={3}
          />
        );
      case 5:
        return (
          <PartnerPriorityPicker
            priorities={draft.partnerPriorities}
            onChange={(v) => updateDraft({ partnerPriorities: v })}
          />
        );
      case 6:
        return (
          <div className="space-y-6">
            <div>
              <p className="mb-3 text-sm font-medium text-ortaq-navy">
                Zaman taahhüdü
              </p>
              <ChipSelect
                options={TIME_COMMITMENT_OPTIONS}
                value={draft.expectedTimeCommitment ? [draft.expectedTimeCommitment] : []}
                onChange={(v) =>
                  updateDraft({ expectedTimeCommitment: v[0] ?? "" })
                }
              />
            </div>
            <div>
              <p className="mb-3 text-sm font-medium text-ortaq-navy">
                Katkı alanları
              </p>
              <ChipSelect
                options={CONTRIBUTION_OPTIONS}
                value={draft.expectedContributions}
                onChange={(v) => updateDraft({ expectedContributions: v })}
                multiple
              />
            </div>
          </div>
        );
      case 7:
        return (
          <div className="space-y-4">
            <SingleChoiceGrid
              options={RETURN_MODEL_OPTIONS}
              value={draft.returnModel}
              onChange={(v) => updateDraft({ returnModel: v })}
              columns={2}
            />
            {draft.returnModel && (
              <div>
                <label className="mb-1.5 block text-sm text-ortaq-text-muted">
                  İsterseniz yaklaşık bir oran veya kısa not ekleyin
                </label>
                <input
                  type="text"
                  value={draft.returnModelNotes}
                  onChange={(e) =>
                    updateDraft({ returnModelNotes: e.target.value })
                  }
                  placeholder="Örn. %20 kâr payı, 2 yıl vesting…"
                  className="h-10 w-full rounded-lg border border-ortaq-line bg-ortaq-surface px-3 text-sm focus:border-ortaq-action focus:outline-none focus:ring-2 focus:ring-ortaq-action/20"
                />
              </div>
            )}
          </div>
        );
      case 8:
        return (
          <div className="space-y-4 max-w-md">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ortaq-navy">
                İl
              </label>
              <select
                value={draft.locationCity}
                onChange={(e) => updateDraft({ locationCity: e.target.value })}
                className="h-10 w-full rounded-lg border border-ortaq-line bg-ortaq-surface px-3 text-sm focus:border-ortaq-action focus:outline-none focus:ring-2 focus:ring-ortaq-action/20"
              >
                <option value="">Seçin</option>
                {TURKISH_CITIES.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ortaq-navy">
                İlçe
              </label>
              <input
                type="text"
                value={draft.locationDistrict}
                onChange={(e) =>
                  updateDraft({ locationDistrict: e.target.value })
                }
                placeholder="İlçe adı"
                className="h-10 w-full rounded-lg border border-ortaq-line bg-ortaq-surface px-3 text-sm focus:border-ortaq-action focus:outline-none focus:ring-2 focus:ring-ortaq-action/20"
              />
            </div>
            <label className="flex cursor-pointer items-center gap-2 text-sm text-ortaq-text-muted">
              <input
                type="checkbox"
                checked={draft.hideDistrict}
                onChange={(e) =>
                  updateDraft({ hideDistrict: e.target.checked })
                }
                className="h-4 w-4 rounded border-ortaq-line text-ortaq-action focus:ring-ortaq-action/20"
              />
              İlçeyi gizle
            </label>
          </div>
        );
      case 9:
        return (
          <SingleChoiceGrid
            options={VISIBILITY_OPTIONS}
            value={draft.visibilityLevel}
            onChange={(v) =>
              updateDraft({ visibilityLevel: v as OwnerOnboardingState["visibilityLevel"] })
            }
            columns={1}
          />
        );
      case 10:
        return (
          <EvidenceUploader
            files={draft.evidenceFiles}
            selectedTag={evidenceTag}
            onTagChange={setEvidenceTag}
            onAdd={(file) =>
              updateDraft({ evidenceFiles: [...draft.evidenceFiles, file] })
            }
            onRemove={(id) =>
              updateDraft({
                evidenceFiles: draft.evidenceFiles.filter((f) => f.id !== id),
              })
            }
          />
        );
      case 11:
        return (
          <textarea
            value={draft.narrative}
            onChange={(e) =>
              updateDraft({ narrative: e.target.value.slice(0, 400) })
            }
            rows={4}
            placeholder="Dosyada görünmesini istediğiniz kısa bir bağlam…"
            className="w-full rounded-xl border border-ortaq-line bg-ortaq-surface px-4 py-3 text-sm leading-relaxed focus:border-ortaq-action focus:outline-none focus:ring-2 focus:ring-ortaq-action/20"
          />
        );
      case 12:
        return (
          <div className="space-y-6">
            <div className="space-y-4 max-w-lg">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ortaq-navy">
                  Başlık
                </label>
                <input
                  type="text"
                  value={draft.title}
                  onChange={(e) =>
                    updateDraft({ title: e.target.value.slice(0, 80) })
                  }
                  placeholder="Fırsat dosyanıza net bir başlık verin"
                  className="h-10 w-full rounded-lg border border-ortaq-line bg-ortaq-surface px-3 text-sm focus:border-ortaq-action focus:outline-none focus:ring-2 focus:ring-ortaq-action/20"
                />
                <p className="mt-1 text-xs text-ortaq-text-muted">
                  {draft.title.length}/80
                </p>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ortaq-navy">
                  Tek cümlelik özet
                </label>
                <input
                  type="text"
                  value={draft.summary}
                  onChange={(e) =>
                    updateDraft({ summary: e.target.value.slice(0, 160) })
                  }
                  placeholder="Fırsatı bir cümlede anlatın"
                  className="h-10 w-full rounded-lg border border-ortaq-line bg-ortaq-surface px-3 text-sm focus:border-ortaq-action focus:outline-none focus:ring-2 focus:ring-ortaq-action/20"
                />
                <p className="mt-1 text-xs text-ortaq-text-muted">
                  {draft.summary.length}/160
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-ortaq-line bg-ortaq-surface-alt/50 p-5">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-heading text-sm font-semibold text-ortaq-navy">
                  Son gözden geçirme
                </h3>
                <ReadinessRing score={score} size={44} />
              </div>
              <dl className="grid gap-3 sm:grid-cols-2">
                {[
                  ["Kategori", labelFor(CATEGORY_OPTIONS, draft.category)],
                  ["Aşama", labelFor(STAGE_OPTIONS, draft.stage)],
                  [
                    "Varlıklar",
                    draft.selectedAssets
                      .map((a) => labelFor(ASSET_OPTIONS, a))
                      .join(", "),
                  ],
                  [
                    "Engeller",
                    draft.selectedBlockers
                      .map((b) => labelFor(BLOCKER_OPTIONS, b))
                      .join(", "),
                  ],
                  [
                    "Aranan ortak",
                    draft.partnerPriorities
                      .map((p) => labelFor(PARTNER_TYPE_OPTIONS, p))
                      .join(", "),
                  ],
                  ["Karşılık", labelFor(RETURN_MODEL_OPTIONS, draft.returnModel)],
                  [
                    "Konum",
                    draft.hideDistrict || !draft.locationDistrict
                      ? draft.locationCity
                      : `${draft.locationCity}, ${draft.locationDistrict}`,
                  ],
                  [
                    "Görünürlük",
                    labelFor(VISIBILITY_OPTIONS, draft.visibilityLevel),
                  ],
                ].map(([label, value]) => (
                  <div key={label}>
                    <dt className="text-xs text-ortaq-text-muted">{label}</dt>
                    <dd className="mt-0.5 text-sm font-medium text-ortaq-navy">
                      {value || "—"}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <WizardLayout
      header={
        <ProgressHeader
          title="Fırsat Dosyası Oluştur"
          steps={PROGRESS_STEPS}
          currentStep={step - 1}
        />
      }
      sidebar={
        <OwnerDraftSummarySidebar
          draft={draft}
          currentStep={step}
          totalSteps={TOTAL_STEPS}
        />
      }
    >
      <WizardStepHeader
        step={step}
        totalSteps={TOTAL_STEPS}
        title={meta.title}
        description={meta.description}
      />

      <div className="mb-8">{renderStep()}</div>

      {step === 4 && draft.selectedBlockers.length >= 3 && (
        <p className="mb-4 text-xs text-ortaq-warning">
          En fazla 3 engel seçebilirsiniz.
        </p>
      )}

      {error && (
        <p className="mb-4 text-sm text-ortaq-danger">{error}</p>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-ortaq-line pt-6">
        <div>
          {step === 1 ? (
            <Link href="/kayit/yol-secimi">
              <Button variant="outline" disabled={isPending}>
                Geri
              </Button>
            </Link>
          ) : (
            <Button
              variant="outline"
              disabled={isPending}
              onClick={() => setStep((s) => s - 1)}
            >
              Önceki
            </Button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {step === 12 && (
            <>
              <Button
                variant="outline"
                disabled={isPending}
                onClick={() => handleSave(true)}
              >
                Daha sonra tamamla
              </Button>
              <Button
                disabled={isPending || !canProceed(step, draft)}
                onClick={() => handleSave(false)}
              >
                {isPending ? "Kaydediliyor…" : "Taslak Olarak Kaydet"}
              </Button>
            </>
          )}
          {step < 12 && (
            <Button
              disabled={!canProceed(step, draft)}
              onClick={goToNextStep}
            >
              Devam
            </Button>
          )}
        </div>
      </div>
    </WizardLayout>
  );
}
