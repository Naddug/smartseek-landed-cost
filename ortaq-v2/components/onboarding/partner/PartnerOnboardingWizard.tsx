"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Coins,
  Cog,
  Code,
  TrendingUp,
  Factory,
  GraduationCap,
} from "lucide-react";
import { WizardLayout } from "@/components/shared/WizardLayout";
import { WizardStepHeader } from "@/components/shared/WizardStepHeader";
import { ProgressHeader } from "@/components/shared/ProgressHeader";
import { MultiChoiceGrid } from "@/components/shared/MultiChoiceGrid";
import { SingleChoiceGrid } from "@/components/shared/SingleChoiceGrid";
import { ChipSelect } from "@/components/shared/ChipSelect";
import { Button } from "@/components/ui/button";
import { usePartnerOnboardingDraft } from "@/hooks/usePartnerOnboardingDraft";
import { savePartnerOnboardingState } from "@/lib/actions/profile-onboarding";
import { sanitizeNextPath, registerPathChoiceHref } from "@/lib/auth/routes";
import {
  CAPITAL_RANGE_OPTIONS,
  ENGAGEMENT_MODE_OPTIONS,
  PARTNER_CATEGORY_OPTIONS,
  PARTNER_CITY_OPTIONS,
  PARTNER_CONTRIBUTION_OPTIONS,
  PARTNER_EXPERIENCE_OPTIONS,
  PARTNER_STEP_LABELS,
} from "@/data/onboarding/partner-options";
import type { PartnerOnboardingState } from "@/types/profile-onboarding";

const TOTAL_STEPS = 4;

const STEP_META = [
  {
    title: "Ne tür katkı sunabilirsiniz?",
    description: "Sermaye, operasyon, teknik, büyüme veya sektör deneyiminizi seçin.",
  },
  {
    title: "Hangi tür fırsatlar ilginizi çekiyor?",
    description: "Birden fazla sektör seçebilirsiniz.",
  },
  {
    title: "Lokasyon ve rol tercihiniz",
    description: "Nerede ve hangi rolde ortak olmak istediğinizi belirtin.",
  },
  {
    title: "Profilinizi gözden geçirin",
    description: "Bilgileriniz eşleşme önerilerinde kullanılır.",
  },
];

function canProceed(step: number, draft: PartnerOnboardingState): boolean {
  switch (step) {
    case 1:
      return draft.contributionTypes.length >= 1;
    case 2:
      return draft.preferredCategories.length >= 1;
    case 3:
      return draft.preferredCities.length >= 1 && Boolean(draft.engagementMode);
    case 4:
      return true;
    default:
      return false;
  }
}

function labelContribution(value: string): string {
  return PARTNER_CONTRIBUTION_OPTIONS.find((o) => o.value === value)?.title ?? value;
}

function labelCategory(value: string): string {
  return PARTNER_CATEGORY_OPTIONS.find((o) => o.value === value)?.label ?? value;
}

function labelEngagement(value: string): string {
  return ENGAGEMENT_MODE_OPTIONS.find((o) => o.value === value)?.title ?? value;
}

interface PartnerOnboardingWizardProps {
  initialDraft?: PartnerOnboardingState;
  initialStep?: number;
  returnPath?: string;
}

export function PartnerOnboardingWizard({
  initialDraft,
  initialStep = 1,
  returnPath,
}: PartnerOnboardingWizardProps) {
  const router = useRouter();
  const { update: refreshSession } = useSession();
  const { draft, updateDraft, resetDraft, hydrated } = usePartnerOnboardingDraft(initialDraft);
  const [step, setStep] = useState(initialStep);
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

  const persistStep = (nextStep: number, complete = false) => {
    startTransition(async () => {
      try {
        await savePartnerOnboardingState(draft, { step: nextStep, complete });
        await refreshSession();
        if (complete) {
          resetDraft();
          const destination = returnPath
            ? sanitizeNextPath(returnPath)
            : "/panel/profilim";
          router.push(destination);
          router.refresh();
        }
      } catch {
        setError("Kayıt sırasında bir sorun oluştu. Lütfen tekrar deneyin.");
      }
    });
  };

  const handleNext = () => {
    setError(null);
    const nextStep = step + 1;
    persistStep(nextStep);
    setStep(nextStep);
  };

  const handleFinish = () => {
    setError(null);
    persistStep(TOTAL_STEPS, true);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <MultiChoiceGrid
            columns={2}
            value={draft.contributionTypes}
            onChange={(contributionTypes) => updateDraft({ contributionTypes })}
            options={PARTNER_CONTRIBUTION_OPTIONS.map((option) => ({
              ...option,
              icon:
                option.value === "capital" ? (
                  <Coins className="h-5 w-5" />
                ) : option.value === "operations" ? (
                  <Cog className="h-5 w-5" />
                ) : option.value === "technical" ? (
                  <Code className="h-5 w-5" />
                ) : option.value === "growth" ? (
                  <TrendingUp className="h-5 w-5" />
                ) : option.value === "production" ? (
                  <Factory className="h-5 w-5" />
                ) : (
                  <GraduationCap className="h-5 w-5" />
                ),
            }))}
          />
        );
      case 2:
        return (
          <div className="space-y-6">
            <ChipSelect
              multiple
              max={5}
              options={PARTNER_CATEGORY_OPTIONS}
              value={draft.preferredCategories}
              onChange={(preferredCategories) => updateDraft({ preferredCategories })}
            />
            <div>
              <p className="mb-2 text-sm font-medium text-ortaq-navy">
                Deneyim alanları (isteğe bağlı)
              </p>
              <ChipSelect
                multiple
                max={4}
                options={PARTNER_EXPERIENCE_OPTIONS}
                value={draft.experienceAreas}
                onChange={(experienceAreas) => updateDraft({ experienceAreas })}
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-8">
            <div>
              <p className="mb-3 text-sm font-medium text-ortaq-navy">
                Tercih ettiğiniz şehirler
              </p>
              <ChipSelect
                multiple
                max={5}
                options={PARTNER_CITY_OPTIONS}
                value={draft.preferredCities}
                onChange={(preferredCities) => updateDraft({ preferredCities })}
              />
            </div>
            <div>
              <p className="mb-3 text-sm font-medium text-ortaq-navy">
                Sermaye aralığı (varsa)
              </p>
              <ChipSelect
                options={CAPITAL_RANGE_OPTIONS}
                value={draft.capitalRange ? [draft.capitalRange] : []}
                onChange={(values) =>
                  updateDraft({ capitalRange: values[0] ?? "" })
                }
              />
            </div>
            <div>
              <p className="mb-3 text-sm font-medium text-ortaq-navy">
                Nasıl ortak olmak istiyorsunuz?
              </p>
              <SingleChoiceGrid
                value={draft.engagementMode}
                onChange={(engagementMode) =>
                  updateDraft({
                    engagementMode: engagementMode as PartnerOnboardingState["engagementMode"],
                  })
                }
                options={ENGAGEMENT_MODE_OPTIONS}
              />
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <div className="rounded-xl border border-ortaq-line bg-ortaq-surface-alt p-5 text-sm">
              <dl className="space-y-3">
                <div>
                  <dt className="text-ortaq-text-muted">Katkılar</dt>
                  <dd className="mt-1 font-medium text-ortaq-navy">
                    {draft.contributionTypes.map(labelContribution).join(" · ")}
                  </dd>
                </div>
                <div>
                  <dt className="text-ortaq-text-muted">Sektörler</dt>
                  <dd className="mt-1 font-medium text-ortaq-navy">
                    {draft.preferredCategories.map(labelCategory).join(" · ")}
                  </dd>
                </div>
                <div>
                  <dt className="text-ortaq-text-muted">Şehirler</dt>
                  <dd className="mt-1 font-medium text-ortaq-navy">
                    {draft.preferredCities.join(" · ")}
                  </dd>
                </div>
                <div>
                  <dt className="text-ortaq-text-muted">Rol tercihi</dt>
                  <dd className="mt-1 font-medium text-ortaq-navy">
                    {labelEngagement(draft.engagementMode)}
                  </dd>
                </div>
              </dl>
            </div>
            <div>
              <label htmlFor="bio" className="mb-2 block text-sm font-medium text-ortaq-navy">
                Kısa tanıtım (isteğe bağlı)
              </label>
              <textarea
                id="bio"
                rows={4}
                maxLength={400}
                value={draft.bio}
                onChange={(event) => updateDraft({ bio: event.target.value })}
                className="w-full rounded-lg border border-ortaq-line px-3 py-2 text-sm text-ortaq-navy outline-none ring-blue-600 focus:ring-2"
                placeholder="Deneyiminiz, güçlü yanlarınız ve aradığınız fırsat tipi…"
              />
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
          title="Ortak Profili"
          steps={PARTNER_STEP_LABELS}
          currentStep={step - 1}
        />
      }
      sidebar={
        <div className="rounded-xl border border-ortaq-line bg-ortaq-surface p-5 text-sm">
          <p className="font-medium text-ortaq-navy">Profil tamamlama</p>
          <p className="mt-2 text-ortaq-text-secondary">
            Tamamlanan profil, fırsatlara başvurduğunuzda ve eşleşme önerilerinde kullanılır.
          </p>
        </div>
      }
    >
      <WizardStepHeader
        step={step}
        totalSteps={TOTAL_STEPS}
        title={meta.title}
        description={meta.description}
      />

      <div className="mb-8">{renderStep()}</div>

      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-ortaq-line pt-6">
        <div>
          {step === 1 ? (
            <Link
              href={
                returnPath
                  ? registerPathChoiceHref(returnPath)
                  : "/kayit/yol-secimi"
              }
            >
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
          {step < TOTAL_STEPS ? (
            <Button disabled={!canProceed(step, draft) || isPending} onClick={handleNext}>
              {isPending ? "Kaydediliyor…" : "Devam"}
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                disabled={isPending}
                onClick={() => persistStep(step)}
              >
                Taslak kaydet
              </Button>
              <Button disabled={!canProceed(step, draft) || isPending} onClick={handleFinish}>
                {isPending ? "Tamamlanıyor…" : "Profili Tamamla"}
              </Button>
            </>
          )}
        </div>
      </div>
    </WizardLayout>
  );
}
