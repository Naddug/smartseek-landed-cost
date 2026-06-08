"use client";

import { useTranslation } from "react-i18next";
import { Container, SectionHeader } from "@/components/ui/Section";

export function ExecutionTrust() {
  const { t } = useTranslation();

  return (
    <section className="border-b border-ortaq-border bg-ortaq-surface">
      <Container wide>
        <div className="py-12 sm:py-14">
          <SectionHeader
            title={t("home.operator.trust.headline")}
            description={t("home.operator.trust.body")}
            align="center"
          />
        </div>
      </Container>
    </section>
  );
}
