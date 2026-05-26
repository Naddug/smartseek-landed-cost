"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { PublicShell } from "@/components/layout/PublicShell";
import { Container, Section, SectionHeader } from "@/components/ui/Section";
import { ProseBlock } from "@/components/ui/Card";
import { StatusBadge } from "@/components/trust/StatusBadge";
import { VerificationLabel } from "@/components/trust/VerificationLabel";
import { DocumentaryImage } from "@/components/media/DocumentaryImage";
import { Button } from "@/components/ui/Button";
import { media } from "@/lib/media";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";
import { isCompanySaved, toggleSavedCompany } from "@/lib/member/storage";

const fieldKeys = ["company", "location", "activity", "useOfFunds"] as const;
const SLUG = "ornek";

export function CompanyDetailPageView() {
  const { t } = useTranslation();
  const m = media.warehouse;
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(isCompanySaved(SLUG));
  }, []);

  function handleSave() {
    const next = toggleSavedCompany(SLUG, t("companyPage.title"));
    setSaved(next);
  }

  return (
    <PublicShell stickyCta={false}>
      <Section spacing="hero">
        <Container narrow>
          <div className="mb-4 flex flex-wrap items-center gap-4">
            <StatusBadge status="illustrative" />
            <VerificationLabel label="not_submitted" />
          </div>
          <SectionHeader title={t("companyPage.title")} description={t("companyPage.intro")} className="mt-4" />
        </Container>
      </Section>

      <Section tone="alt" spacing="compact">
        <Container narrow>
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
            <div className="border-b border-ortaq-border px-5 py-4 sm:px-6">
              <p className={typography.bodySm}>{t("template.cardTitle")}</p>
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
          </div>

          <div className="mt-8 space-y-4">
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

          <p className={cn(typography.caption, "mt-8")}>{t("companyPage.footerNote")}</p>

          <div className="mt-8 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:justify-center">
            <Button
              type="button"
              variant={saved ? "primary" : "secondary"}
              fullWidth
              className="sm:w-auto sm:min-w-[11rem]"
              onClick={handleSave}
            >
              {saved ? t("companyPage.saved") : t("companyPage.save")}
            </Button>
            <Link href="/riskler">
              <Button variant="secondary" fullWidth className="sm:w-auto sm:min-w-[11rem]">
                {t("companyPage.riskLink")}
              </Button>
            </Link>
            <Link href="/">
              <Button variant="secondary" fullWidth className="sm:w-auto sm:min-w-[11rem]">
                {t("companyPage.back")}
              </Button>
            </Link>
          </div>
        </Container>
      </Section>
    </PublicShell>
  );
}
