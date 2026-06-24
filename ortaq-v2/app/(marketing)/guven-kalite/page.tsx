import { AppContainer } from "@/components/shared/AppContainer";
import { PageHeader } from "@/components/shared/PageHeader";
import { Section } from "@/components/shared/Section";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { ReadinessScoreExplainer } from "@/components/marketing/ReadinessScoreExplainer";
import { VisibilityExplainer } from "@/components/marketing/VisibilityExplainer";
import { PremiumPackagesSection } from "@/components/marketing/PremiumPackagesSection";
import { ORTAQ_COPY } from "@/lib/copy/ortaq-lexicon";
import { ShieldCheck, XCircle, Eye } from "lucide-react";

const rejectedExamples = [
  "Sadece fikir var; iş, lokasyon ya da kapasite zemini yok",
  "Aranan ortak türü belirsiz veya tanımsız",
  "Sunulan yapı veya kanıt yetersiz",
  "Aslında iş ilanı, emlak ilanı veya franchise başvurusu",
];

export default function GuvenKalitePage() {
  const copy = ORTAQ_COPY.pages.guvenKalite;

  return (
    <>
      <Section variant="surface">
        <AppContainer size="narrow">
          <PageHeader
            eyebrow="Güven"
            title="Güven & Kalite"
            description={copy.description}
          />
        </AppContainer>
      </Section>

      <Section>
        <AppContainer size="narrow">
          <div className="rounded-xl border border-ortaq-line bg-ortaq-surface p-6 md:p-8">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-ortaq-action/10">
              <ShieldCheck className="h-5 w-5 text-ortaq-action" />
            </div>
            <h2 className="font-heading text-xl font-semibold text-ortaq-navy">
              {copy.whyReviewTitle}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ortaq-text-secondary md:text-base">
              {copy.whyReviewBody}
            </p>
          </div>
        </AppContainer>
      </Section>

      <Section variant="alt">
        <AppContainer size="narrow">
          <SectionHeader title={copy.rejectedTitle} />
          <ul className="space-y-3">
            {rejectedExamples.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 rounded-lg border border-ortaq-line bg-ortaq-surface px-4 py-3"
              >
                <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-ortaq-danger" />
                <span className="text-sm leading-relaxed text-ortaq-text-muted">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </AppContainer>
      </Section>

      <Section>
        <AppContainer>
          <SectionHeader
            title={copy.readinessTitle}
            description={copy.readinessDescription}
          />
          <ReadinessScoreExplainer />
        </AppContainer>
      </Section>

      <Section variant="alt">
        <AppContainer size="narrow">
          <div className="mb-8 flex h-10 w-10 items-center justify-center rounded-lg bg-ortaq-action/10">
            <Eye className="h-5 w-5 text-ortaq-action" />
          </div>
          <SectionHeader title={copy.privacyTitle} />
          <p className="-mt-4 mb-8 max-w-2xl text-sm leading-relaxed text-ortaq-text-muted md:text-base">
            {copy.privacyIntro}
          </p>
          <VisibilityExplainer />
        </AppContainer>
      </Section>

      <Section id="premium">
        <AppContainer>
          <SectionHeader
            title={copy.premiumTitle}
            description={ORTAQ_COPY.monetization.sectionDescription}
          />
          <PremiumPackagesSection showCtas layout="homepage" />
        </AppContainer>
      </Section>
    </>
  );
}
