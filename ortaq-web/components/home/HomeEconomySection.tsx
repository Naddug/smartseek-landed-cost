"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Container, Section } from "@/components/ui/Section";
import { DocumentaryImage } from "@/components/media/DocumentaryImage";
import { media } from "@/lib/media";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

export function HomeEconomySection() {
  const { t } = useTranslation();
  const m = media.workshop;

  return (
    <Section spacing="stage">
      <Container wide>
        <div className="lg:grid lg:grid-cols-12 lg:items-end lg:gap-x-10">
          <div className="lg:col-span-5 lg:pb-4">
            <p className={typography.kicker}>{t("homeEconomy.label")}</p>
            <h2 className={cn(typography.h1, "mt-4")}>{t("homeEconomy.title")}</h2>
            <p className={cn(typography.lead, "mt-5 max-w-prose")}>{t("homeEconomy.lead")}</p>
            <p className={cn(typography.body, "mt-4 max-w-prose")}>{t("homeEconomy.body")}</p>
            <Link
              href="/nasil-calisir"
              className={cn(typography.bodySm, typography.link, "mt-6 inline-flex min-h-11 items-center")}
            >
              {t("homeEconomy.link")}
            </Link>
          </div>
          <div className="mt-10 lg:col-span-7 lg:mt-0">
            <DocumentaryImage
              src={m.src}
              alt={t("media.workshop.alt")}
              credit={t("media.credit", { source: m.credit })}
              focalPoint={m.focalPoint}
              aspect="panorama"
              bleedMobile
              showStockLabel={false}
              caption={t("homeEconomy.caption")}
            />
          </div>
        </div>
      </Container>
    </Section>
  );
}
