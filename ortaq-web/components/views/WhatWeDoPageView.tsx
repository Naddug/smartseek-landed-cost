"use client";

import { useTranslation } from "react-i18next";
import { PublicShell } from "@/components/layout/PublicShell";
import { Container, SectionHeader } from "@/components/ui/Section";
import { OperatorProcessSteps } from "@/components/home/operator/OperatorProcessSteps";
import { ActiveCategoryBand } from "@/components/home/operator/ActiveCategoryBand";
import { CategoryRoadmap } from "@/components/home/operator/CategoryRoadmap";
import { TrustLayerLinks } from "@/components/trust/TrustLayerLinks";

export function WhatWeDoPageView() {
  const { t } = useTranslation();

  return (
    <PublicShell stickyCta>
      <section className="border-b border-ortaq-border bg-ortaq-surface">
        <Container wide>
          <div className="py-12 sm:py-14">
            <SectionHeader
              title={t("whatWeDo.headline")}
              description={t("whatWeDo.subheadline")}
              titleAs="h1"
            />
          </div>
        </Container>
      </section>
      <OperatorProcessSteps sectionId="process" />
      <ActiveCategoryBand />
      <CategoryRoadmap />
      <TrustLayerLinks />
    </PublicShell>
  );
}
