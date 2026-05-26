"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Container, Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

export function HomeAccessSection() {
  const { t } = useTranslation();

  return (
    <Section spacing="stage" className="border-t border-ortaq-border">
      <Container narrow>
        <div className="text-center sm:text-left">
          <p className={typography.kicker}>{t("homeAccess.label")}</p>
          <h2 className={cn(typography.h2, "mt-3")}>{t("homeAccess.title")}</h2>
          <p className={cn(typography.body, "mx-auto mt-4 max-w-md sm:mx-0")}>
            {t("homeAccess.text")}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link href="/basla">
              <Button variant="dark" size="lg" fullWidth className="sm:w-auto sm:min-w-[13rem]">
                {t("homeAccess.primary")}
              </Button>
            </Link>
            <Link href="/alan" className={cn(typography.bodySm, typography.link, "min-h-11 inline-flex items-center justify-center sm:justify-start")}>
              {t("homeAccess.secondary")}
            </Link>
          </div>
        </div>
      </Container>
    </Section>
  );
}
