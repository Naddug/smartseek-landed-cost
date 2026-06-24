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
  const viewer = buildDossierViewerContext(session, dossier);
  const related = getRelatedDossiers(dossier);

  return (
    <Section className="pb-16 md:pb-24">
      <AppContainer>
        <DossierDetailBackLink />

        <div className="grid gap-10 lg:grid-cols-[1fr_320px] lg:items-start">
          <div className="min-w-0 space-y-8">
            <DossierDetailHero dossier={dossier} />
            <DossierStructuredSummary dossier={dossier} />
            <RelatedDossiers dossiers={related} />
          </div>

          <aside className="space-y-4 lg:sticky lg:top-20">
            <DossierCTABox
              dossier={dossier}
              viewer={viewer}
              applyIntent={searchParams.intent === "apply"}
            />
            <DossierTrustPanel dossier={dossier} />
          </aside>
        </div>
      </AppContainer>
    </Section>
  );
}
