"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/Button";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

export function WaitingStep() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <p className={typography.body}>{t("onboarding.steps.wait.text")}</p>
      <p className={typography.bodySm}>{t("onboarding.steps.wait.emptyText")}</p>
      <div className="flex flex-col gap-3 pt-2">
        <Link href="/alan">
          <Button fullWidth className="min-h-12 sm:w-auto">
            {t("onboarding.navigation.openArea")}
          </Button>
        </Link>
        <Link href="/">
          <Button variant="secondary" fullWidth className="min-h-12 sm:w-auto">
            {t("onboarding.navigation.exit")}
          </Button>
        </Link>
        <Link href="/riskler" className={cn(typography.bodySm, typography.link, "min-h-11 leading-[2.75rem]")}>
          {t("onboarding.navigation.readRisks")}
        </Link>
      </div>
    </div>
  );
}
