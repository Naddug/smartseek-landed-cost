"use client";

import { useTranslation } from "react-i18next";
import { Container, Section } from "@/components/ui/Section";
import { DocumentaryImage } from "@/components/media/DocumentaryImage";
import { media } from "@/lib/media";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

/** Quiet editorial pause — real economy context between process and risk */
export function HomeEditorialBreak() {
  const { t } = useTranslation();
  const m = media.workshop;

  return (
    <Section tone="warm" spacing="default">
      <Container narrow>
        <p className={cn(typography.kicker, "mb-4")}>{t("homeEditorial.label")}</p>
        <blockquote className={cn(typography.lead, "max-w-prose text-ortaq-ink")}>
          {t("homeEditorial.quote")}
        </blockquote>
        <p className={cn(typography.bodySm, "mt-3 max-w-prose")}>
          {t("homeEditorial.context")}
        </p>
      </Container>
      <Container className="mt-8">
        <DocumentaryImage
          src={m.src}
          alt={t("media.workshop.alt")}
          credit={t("media.credit", { source: m.credit })}
          focalPoint={m.focalPoint}
          aspect={m.aspect}
          bleedMobile
          stockLabel={t("trust.status.illustrative")}
          caption={t("homeEditorial.caption")}
        />
      </Container>
    </Section>
  );
}
