import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PartnerOnboardingWizard } from "@/components/onboarding/partner/PartnerOnboardingWizard";
import { getStoredUserProfile } from "@/lib/profile/repository";
import { registerPathChoiceHref, sanitizeNextPath } from "@/lib/auth/routes";

interface PageProps {
  searchParams: { next?: string };
}

export default async function OrtakOnboardingPage({ searchParams }: PageProps) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/giris?next=/onboarding/ortak");
  }

  if (session.user.sideSelected === false) {
    redirect(
      registerPathChoiceHref(
        searchParams.next ? sanitizeNextPath(searchParams.next) : "/panel"
      )
    );
  }

  if (session.user.role === "opportunity_owner") {
    redirect("/onboarding/firsat-sahibi");
  }

  const profile = await getStoredUserProfile(session.user.id, session.user.role);

  if (session.user.onboardingCompleted) {
    redirect(
      searchParams.next ? sanitizeNextPath(searchParams.next) : "/panel/profilim"
    );
  }

  const initialStep = profile.onboardingStep
    ? Math.min(Number(profile.onboardingStep) || 1, 4)
    : 1;

  return (
    <PartnerOnboardingWizard
      initialDraft={profile.partner}
      initialStep={Number.isFinite(initialStep) && initialStep >= 1 ? initialStep : 1}
      returnPath={searchParams.next ? sanitizeNextPath(searchParams.next) : undefined}
    />
  );
}
