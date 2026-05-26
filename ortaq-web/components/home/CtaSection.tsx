"use client";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/Button";
import { Container, Section } from "@/components/ui/Section";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

export function CtaSection() {
  const { t } = useTranslation();

  return (
    <Section spacing="quiet" tone="alt">
      <Container narrow>
        <h2 className={typography.h2}>{t("cta.title")}</h2>
        <p className={cn(typography.body, "mt-3 max-w-prose")}>{t("cta.text")}</p>
        <div className="mt-7 flex flex-col gap-3">
          <Link href="/basla">
            <Button size="lg" fullWidth className="sm:w-auto sm:min-w-[12rem]">
              {t("cta.primary")}
            </Button>
          </Link>
          <Link
            href="/alan"
            className={cn(typography.bodySm, typography.link, "min-h-11 inline-flex items-center")}
          >
            {t("cta.memberArea")}
          </Link>
        </div>
      </Container>
    </Section>
  );
}
