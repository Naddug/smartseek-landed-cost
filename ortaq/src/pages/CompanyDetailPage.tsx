import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { PublicShell } from "@ortaq/components/layout/PublicShell";
import { Container, Section, SectionHeader } from "@ortaq/components/ui/Section";
import { ProseBlock } from "@ortaq/components/ui/Card";
import { StatusBadge } from "@ortaq/components/trust/StatusBadge";
import { DocumentaryImage } from "@ortaq/components/media/DocumentaryImage";
import { Button } from "@ortaq/components/ui/Button";
import { media } from "@ortaq/lib/media";

const fieldKeys = ["company", "location", "activity", "useOfFunds"] as const;

/**
 * Illustrative campaign page — no invented company, metrics, or live state.
 */
export default function CompanyDetailPage() {
  const { t } = useTranslation();
  const m = media.warehouse;

  return (
    <PublicShell stickyCta={false}>
      <Section spacing="hero">
        <Container narrow>
          <div className="mb-4">
            <StatusBadge status="illustrative" />
          </div>
          <SectionHeader title={t("companyPage.title")} description={t("companyPage.intro")} />
        </Container>
      </Section>

      <Section tone="alt" spacing="compact">
        <Container narrow>
          <DocumentaryImage
            src={m.src}
            alt={t("media.warehouse.alt")}
            credit={t("media.credit", { source: m.credit })}
            caption={t("template.imageCaption")}
            className="mb-6"
          />

          <div className="rounded-ortaq-xl border border-ortaq-border bg-white">
            <div className="border-b border-ortaq-border px-5 py-4 sm:px-6">
              <p className="text-sm font-medium text-ortaq-ink">{t("template.cardTitle")}</p>
            </div>
            <dl className="divide-y divide-ortaq-border">
              {fieldKeys.map((key) => (
                <div key={key} className="px-5 py-4 sm:px-6 sm:py-5">
                  <dt className="text-xs text-ortaq-ink-soft">{t(`template.fields.${key}.label`)}</dt>
                  <dd className="mt-1 text-sm leading-relaxed text-ortaq-ink-muted">
                    {t(`template.fields.${key}.placeholder`)}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="mt-6 space-y-3">
            <ProseBlock
              title={t("companyPage.memorandum.title")}
              description={t("companyPage.memorandum.text")}
              badge={<StatusBadge status="planned" />}
            />
            <ProseBlock
              title={t("companyPage.committee.title")}
              description={t("companyPage.committee.text")}
              badge={<StatusBadge status="planned" />}
            />
            <ProseBlock
              title={t("companyPage.risk.title")}
              description={t("companyPage.risk.text")}
              badge={<StatusBadge status="verified" />}
            />
          </div>

          <p className="mt-6 text-xs leading-[1.55] text-ortaq-ink-soft">{t("companyPage.footerNote")}</p>

          <div className="mt-8 flex flex-col gap-2.5 sm:flex-row sm:justify-center">
            <Link href="/riskler">
              <Button variant="secondary" fullWidth className="sm:w-auto sm:min-w-[200px]">
                {t("companyPage.riskLink")}
              </Button>
            </Link>
            <Link href="/">
              <Button variant="secondary" fullWidth className="sm:w-auto sm:min-w-[200px]">
                {t("companyPage.back")}
              </Button>
            </Link>
          </div>
        </Container>
      </Section>
    </PublicShell>
  );
}
