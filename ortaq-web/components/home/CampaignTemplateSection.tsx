"use client";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Container, Section, SectionHeader } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/trust/StatusBadge";
import { VerificationLabel } from "@/components/trust/VerificationLabel";
import { DocumentaryImage } from "@/components/media/DocumentaryImage";
import { karatParcaKonya } from "@/lib/campaigns/karat-parca-konya";
import { media } from "@/lib/media";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

type CampaignTemplateSectionProps = {
  compact?: boolean;
  showImage?: boolean;
};

export function CampaignTemplateSection({
  compact = false,
  showImage = true,
}: CampaignTemplateSectionProps) {
  const { t } = useTranslation();
  const c = karatParcaKonya;
  const m = showImage ? media.industrialLine : null;

  const fields = compact
    ? [
        { label: t("template.fields.company.label"), value: c.tradeName },
        { label: t("template.fields.useOfFunds.label"), value: c.funding.purpose.slice(0, 120) + "…" },
      ]
    : [
        { label: t("template.fields.company.label"), value: c.legalName },
        { label: t("template.fields.location.label"), value: `${c.city}, ${c.region}` },
        { label: t("template.fields.activity.label"), value: c.sector },
        { label: t("template.fields.useOfFunds.label"), value: c.funding.purpose },
      ];

  return (
    <Section id="sirketler" spacing="stage">
      <Container wide>
        <div className="lg:grid lg:grid-cols-12 lg:gap-10">
          <div className={cn("lg:col-span-5", m && "lg:order-2")}>
            <p className={typography.kicker}>{t("template.label")}</p>
            <h2 className={cn(typography.h1, "mt-3")}>
              {compact ? t("template.titleShort") : t("template.title")}
            </h2>
            <p className={cn(typography.lead, "mt-4")}>
              {compact ? t("template.introShort") : t("template.intro")}
            </p>

            <div className="mt-8 border border-ortaq-border bg-ortaq-cream">
              <div className="flex flex-wrap items-center gap-2 border-b border-ortaq-border px-4 py-3.5 sm:px-5">
                <StatusBadge status="illustrative" />
                <VerificationLabel label={c.verificationLabel} />
              </div>
              <dl className="divide-y divide-ortaq-border">
                {fields.map((f) => (
                  <div key={f.label} className="px-4 py-4 sm:px-5">
                    <dt className={typography.caption}>{f.label}</dt>
                    <dd className={cn(typography.body, "mt-1.5 text-ortaq-ink")}>{f.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link href={`/sirket/${c.slug}`}>
                <Button variant="dark" fullWidth className="sm:w-auto">
                  {t("template.viewFull")}
                </Button>
              </Link>
              <Link href="/degerlendirme" className={cn(typography.bodySm, typography.link, "min-h-11 inline-flex items-center")}>
                {t("homeOps.link")}
              </Link>
            </div>
          </div>

          {m && (
            <div className="mt-10 lg:col-span-7 lg:order-1 lg:mt-0">
              <DocumentaryImage
                src={m.src}
                alt={t("media.industrialLine.alt")}
                credit={t("media.credit", { source: m.credit })}
                focalPoint={m.focalPoint}
                aspect="panorama"
                bleedMobile
                showStockLabel={false}
                className="lg:sticky lg:top-20"
              />
            </div>
          )}
        </div>
      </Container>
    </Section>
  );
}
