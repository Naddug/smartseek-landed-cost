import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { Container, Section, SectionHeader } from "@ortaq/components/ui/Section";
import { Button } from "@ortaq/components/ui/Button";
import { StatusBadge } from "@ortaq/components/trust/StatusBadge";
import { DocumentaryImage } from "@ortaq/components/media/DocumentaryImage";
import { media } from "@ortaq/lib/media";
import { typography } from "@ortaq/design/typography";
import { cn } from "@ortaq/lib/cn";

const fieldKeys = ["company", "location", "activity", "useOfFunds"] as const;

export function CampaignTemplateSection() {
  const { t } = useTranslation();
  const m = media.warehouse;

  return (
    <Section id="sirketler" spacing="default">
      <Container narrow>
        <SectionHeader
          label={t("template.label")}
          title={t("template.title")}
          description={t("template.intro")}
        />

        <DocumentaryImage
          src={m.src}
          alt={t("media.warehouse.alt")}
          credit={t("media.credit", { source: m.credit })}
          caption={t("template.imageCaption")}
          focalPoint={m.focalPoint}
          aspect={m.aspect}
          bleedMobile
          stockLabel={t("trust.status.illustrative")}
          className="mb-8"
        />

        <div className="border border-ortaq-border bg-white sm:rounded-ortaq-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ortaq-border px-5 py-4 sm:px-6">
            <p className={typography.bodySm}>{t("template.cardTitle")}</p>
            <StatusBadge status="illustrative" />
          </div>
          <dl className="divide-y divide-ortaq-border">
            {fieldKeys.map((key) => (
              <div key={key} className="px-5 py-4 sm:px-6 sm:py-5">
                <dt className={typography.caption}>{t(`template.fields.${key}.label`)}</dt>
                <dd className={cn(typography.bodySm, "mt-1.5")}>
                  {t(`template.fields.${key}.placeholder`)}
                </dd>
              </div>
            ))}
          </dl>
          <div className="border-t border-ortaq-border bg-ortaq-bg-alt px-5 py-4 sm:px-6">
            <p className={typography.caption}>{t("template.footerNote")}</p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link href="/sirket/ornek">
            <Button variant="secondary">{t("template.viewFull")}</Button>
          </Link>
        </div>
      </Container>
    </Section>
  );
}
