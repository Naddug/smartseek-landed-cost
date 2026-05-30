import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { PublicShell } from "@ortaq/components/layout/PublicShell";
import { Container, Section, SectionHeader } from "@ortaq/components/ui/Section";
import { ProseBlock } from "@ortaq/components/ui/Card";
import { LicenseBadge } from "@ortaq/components/trust/LicenseBadge";
import { ClaimRow } from "@ortaq/components/trust/ClaimRow";
import { StatusBadge } from "@ortaq/components/trust/StatusBadge";
import { Button } from "@ortaq/components/ui/Button";

const layerKeys = ["1", "2", "3", "4", "5"] as const;
const layerStatus = ["verified", "verified", "verified", "planned", "planned"] as const;
const roleKeys = ["1", "2", "3"] as const;

const infrastructureClaims = [
  { titleKey: "trustPage.claims.1.title", textKey: "trustPage.claims.1.text", status: "pending" as const },
  { titleKey: "trustPage.claims.2.title", textKey: "trustPage.claims.2.text", status: "planned" as const },
  { titleKey: "trustPage.claims.3.title", textKey: "trustPage.claims.3.text", status: "planned" as const },
] as const;

export default function TrustPage() {
  const { t } = useTranslation();

  return (
    <PublicShell stickyCta={false}>
      <Section spacing="hero">
        <Container narrow>
          <LicenseBadge className="mb-6" />
          <SectionHeader title={t("trustPage.title")} description={t("trustPage.subtitle")} />
        </Container>
      </Section>

      <Section tone="alt" spacing="compact">
        <Container narrow>
          <SectionHeader title={t("trustPage.infrastructure.title")} description={t("trustPage.infrastructure.intro")} />
          <div className="space-y-3">
            {infrastructureClaims.map((c) => (
              <ClaimRow key={c.titleKey} {...c} />
            ))}
          </div>
        </Container>
      </Section>

      <Section spacing="compact">
        <Container narrow>
          <SectionHeader title={t("trustPage.layersTitle")} />
          <div className="space-y-3">
            {layerKeys.map((key, i) => (
              <ProseBlock
                key={key}
                title={t(`trustPage.layers.${key}.title`)}
                description={t(`trustPage.layers.${key}.text`)}
                badge={<StatusBadge status={layerStatus[i]} />}
              />
            ))}
          </div>
        </Container>
      </Section>

      <Section tone="alt" spacing="compact">
        <Container narrow>
          <SectionHeader title={t("trustPage.committee.title")} description={t("trustPage.committee.intro")} />
          <div className="space-y-3">
            {roleKeys.map((key) => (
              <ProseBlock
                key={key}
                title={t(`trustPage.committee.roles.${key}.role`)}
                description={t(`trustPage.committee.roles.${key}.desc`)}
                badge={<StatusBadge status="planned" />}
              />
            ))}
          </div>
          <p className="mt-5 text-xs leading-[1.55] text-ortaq-ink-soft">{t("trustPage.committee.note")}</p>
        </Container>
      </Section>

      <Section spacing="compact">
        <Container narrow>
          <SectionHeader title={t("trustPage.support.title")} description={t("trustPage.support.intro")} />
          <div className="space-y-3">
            <ProseBlock title={t("trustPage.support.contact.title")} description={t("trustPage.support.contact.text")} />
            <ProseBlock title={t("trustPage.support.dispute.title")} description={t("trustPage.support.dispute.text")} />
            <ProseBlock title={t("trustPage.support.response.title")} description={t("trustPage.support.response.text")} />
          </div>
          <div className="mt-8 text-center">
            <Link href="/">
              <Button variant="secondary">{t("trustPage.back")}</Button>
            </Link>
          </div>
        </Container>
      </Section>
    </PublicShell>
  );
}
