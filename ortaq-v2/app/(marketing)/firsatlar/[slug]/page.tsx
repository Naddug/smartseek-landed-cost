import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { AppContainer } from "@/components/shared/AppContainer";
import { Section } from "@/components/shared/Section";
import { DossierDetailBackLink } from "@/components/opportunity/DossierDetailHero";
import { DossierDetailHero } from "@/components/opportunity/DossierDetailHero";
import { DossierStructuredSummary } from "@/components/opportunity/DossierStructuredSummary";
import { DossierTrustPanel } from "@/components/opportunity/DossierTrustPanel";
import { DossierCTABox } from "@/components/opportunity/DossierCTABox";
import { RelatedDossiers } from "@/components/opportunity/RelatedDossiers";
import {
  getPublicDossierBySlug,
  getRelatedDossiers,
} from "@/data/dossier/public-dossier-details";
import { buildDossierViewerContext } from "@/lib/dossier/viewer-context";
import { authOptions } from "@/lib/auth";
import {
  getProfileApplyGate,
  getUserInterestState,
} from "@/lib/actions/marketplace";

interface PageProps {
  params: { slug: string };
  searchParams: { intent?: string };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const dossier = getPublicDossierBySlug(params.slug);
  if (!dossier) {
    return { title: "Fırsat bulunamadı | ORTAQ" };
  }
  return {
    title: `${dossier.title} | ORTAQ`,
    description: dossier.summary,
  };
}

export default async function FirsatDetayPublicPage({
  params,
  searchParams,
}: PageProps) {
  const dossier = getPublicDossierBySlug(params.slug);

  if (!dossier) {
    notFound();
  }

  if (dossier.status === "draft") {
    notFound();
  }

  const session = await getServerSession(authOptions);
  const applyGate = await getProfileApplyGate(params.slug);
  const interestState = await getUserInterestState(session?.user?.id, dossier.id);
  const viewer = buildDossierViewerContext(session, dossier, {
    applyGate: {
      canApply: applyGate.canApply,
      message: applyGate.message,
      onboardingHref: applyGate.onboardingHref,
      wrongRole: applyGate.wrongRole,
      continueHref: applyGate.continueHref,
    },
    interestState,
  });
  const related = getRelatedDossiers(dossier);

  return (
    <Section className="pb-16 md:pb-24">
      <AppContainer>
        <DossierDetailBackLink />

        <div className="grid gap-10 lg:grid-cols-[1fr_320px] lg:items-start">
          <div className="min-w-0 space-y-8">
            <DossierDetailHero dossier={dossier} />
            <DossierStructuredSummary dossier={dossier} />
            <div className="lg:hidden">
              <DossierTrustPanel dossier={dossier} />
            </div>
            <RelatedDossiers dossiers={related} />
          </div>

          <aside className="hidden space-y-4 lg:sticky lg:top-20 lg:block">
            <DossierCTABox
              dossier={dossier}
              viewer={viewer}
              applyIntent={searchParams.intent === "apply"}
            />
            <DossierTrustPanel dossier={dossier} />
          </aside>
        </div>

        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-ortaq-line bg-white/95 p-3 shadow-ortaq-lg backdrop-blur lg:hidden">
          <DossierCTABox
            dossier={dossier}
            viewer={viewer}
            applyIntent={searchParams.intent === "apply"}
            className="[&>*]:shadow-none"
          />
        </div>
        <div className="h-24 lg:hidden" aria-hidden />
      </AppContainer>
    </Section>
  );
}
