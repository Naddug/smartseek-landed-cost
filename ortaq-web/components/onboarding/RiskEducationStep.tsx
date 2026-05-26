"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

const itemKeys = ["1", "2", "3"] as const;

type RiskEducationStepProps = {
  acknowledged: boolean;
  onAckChange: (value: boolean) => void;
};

export function RiskEducationStep({ acknowledged, onAckChange }: RiskEducationStepProps) {
  const { t } = useTranslation();

  return (
    <div>
      <ul className="space-y-3 border-y border-ortaq-border py-4">
        {itemKeys.map((key) => (
          <li key={key} className={typography.body}>
            {t(`risk.items.${key}`)}
          </li>
        ))}
      </ul>
      <Link href="/riskler" className={cn(typography.bodySm, typography.link, "mt-4 inline-block min-h-11 leading-[2.75rem]")}>
        {t("onboarding.navigation.readRisks")}
      </Link>
      <label className="mt-6 flex min-h-12 cursor-pointer items-start gap-3 border border-ortaq-border px-4 py-4">
        <input
          type="checkbox"
          checked={acknowledged}
          onChange={(e) => onAckChange(e.target.checked)}
          className="mt-1 h-5 w-5 shrink-0 accent-ortaq-trust"
        />
        <span className={typography.body}>{t("onboarding.steps.risk.ack")}</span>
      </label>
    </div>
  );
}
