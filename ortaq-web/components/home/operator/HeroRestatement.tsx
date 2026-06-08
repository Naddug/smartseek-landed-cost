"use client";

import { useTranslation } from "react-i18next";
import { Container } from "@/components/ui/Section";

export function HeroRestatement() {
  const { t } = useTranslation();

  return (
    <section className="border-b border-ortaq-border bg-ortaq-bg-warm">
      <Container narrow>
        <p className="py-8 text-center text-[1rem] font-semibold leading-relaxed text-ortaq-ink sm:text-[1.0625rem]">
          {t("home.operator.restatement")}
        </p>
      </Container>
    </section>
  );
}
