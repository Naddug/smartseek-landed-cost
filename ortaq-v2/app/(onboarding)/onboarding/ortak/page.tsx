import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PartnerOnboardingWizard } from "@/components/onboarding/partner/PartnerOnboardingWizard";
import { getStoredUserProfile } from "@/lib/profile/repository";

export default async function OrtakOnboardingPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/giris?next=/onboarding/ortak");
  }

  const profile = await getStoredUserProfile(session.user.id, session.user.role);
  const initialStep = profile.onboardingStep
    ? Math.min(Number(profile.onboardingStep) || 1, 4)
    : 1;

  return (
    <PartnerOnboardingWizard
      initialDraft={profile.partner}
      initialStep={Number.isFinite(initialStep) && initialStep >= 1 ? initialStep : 1}
    />
  );
}
