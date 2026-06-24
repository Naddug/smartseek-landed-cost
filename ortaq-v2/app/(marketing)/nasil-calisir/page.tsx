import { AppContainer } from "@/components/shared/AppContainer";
import { PageHeader } from "@/components/shared/PageHeader";
import { Section } from "@/components/shared/Section";
import { FlowSteps } from "@/components/marketing/FlowSteps";
import { VisibilityExplainer } from "@/components/marketing/VisibilityExplainer";
import { PremiumPackagesSection } from "@/components/marketing/PremiumPackagesSection";
import { ORTAQ_COPY } from "@/lib/copy/ortaq-lexicon";
import {
  ClipboardList,
  FileCheck,
  Handshake,
  UserCircle,
  Target,
  Link2,
  Shield,
} from "lucide-react";

const ownerSteps = [
  {
    icon: ClipboardList,
    title: ORTAQ_COPY.process.step1Title,
    description: ORTAQ_COPY.process.step1Description,
  },
  {
    icon: FileCheck,
    title: ORTAQ_COPY.process.step2Title,
    description: ORTAQ_COPY.process.reviewStepDescription,
  },
  {
    icon: Handshake,
    title: ORTAQ_COPY.process.step3Title,
    description: ORTAQ_COPY.process.step3Description,
  },
];

const partnerStepIcons = [UserCircle, Target, Link2, Shield] as const;

const partnerSteps = ORTAQ_COPY.process.partnerSteps.map((step, index) => ({
  icon: partnerStepIcons[index] ?? UserCircle,
  title: step.title,
  description: step.description,
}));

export default function NasilCalisirPage() {
  const copy = ORTAQ_COPY.pages.nasilCalisir;

  return (
    <>
      <Section variant="surface">
        <AppContainer size="narrow">
          <PageHeader
            eyebrow="Süreç"
            title={ORTAQ_COPY.process.sectionTitle}
            description={copy.description}
          />
        </AppContainer>
      </Section>

      <Section>
        <AppContainer>
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 className="mb-6 font-heading text-xl font-semibold text-ortaq-navy">
                {copy.ownerSectionTitle}
              </h2>
              <FlowSteps steps={ownerSteps} numbered layout="stack" />
            </div>
            <div>
              <h2 className="mb-6 font-heading text-xl font-semibold text-ortaq-navy">
                {copy.partnerSectionTitle}
              </h2>
              <FlowSteps steps={partnerSteps} numbered layout="stack" />
            </div>
          </div>
        </AppContainer>
      </Section>

      <Section variant="alt">
        <AppContainer size="narrow">
          <h2 className="font-heading text-2xl font-semibold text-ortaq-navy">
            {copy.privacyTitle}
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-ortaq-text-muted">
            {copy.privacyBody}
          </p>
          <VisibilityExplainer className="mt-8" />
        </AppContainer>
      </Section>

      <Section id="premium">
        <AppContainer>
          <PageHeader
            eyebrow={ORTAQ_COPY.monetization.sectionEyebrow}
            title={ORTAQ_COPY.monetization.sectionTitle}
            description={ORTAQ_COPY.monetization.sectionDescription}
            className="border-none pb-6"
          />
          <PremiumPackagesSection showCtas layout="homepage" />
        </AppContainer>
      </Section>
    </>
  );
}
