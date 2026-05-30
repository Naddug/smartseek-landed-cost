"use client";

import { Link } from "wouter";
import { useTranslation } from "react-i18next";

type RiskEducationStepProps = {
  acknowledged: boolean;
  onAckChange: (value: boolean) => void;
};

export function RiskEducationStep({ acknowledged, onAckChange }: RiskEducationStepProps) {
  const { t } = useTranslation();
  const itemKeys = ["1", "2", "3", "4", "5"] as const;

  return (
    <div>
      <p className="mb-4 text-sm leading-[1.65] text-ortaq-ink-muted">{t("onboarding.steps.risk.intro")}</p>
      <ul className="space-y-2">
        {itemKeys.map((key) => (
          <li key={key} className="flex gap-2 text-sm leading-[1.6] text-ortaq-ink">
            <span className="text-ortaq-ink-soft">{key}.</span>
            <span>{t(`risk.items.${key}`)}</span>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-sm leading-[1.65] text-ortaq-ink-muted">{t("risk.cooling")}</p>
      <Link
        href="/riskler"
        className="mt-3 inline-block text-sm text-ortaq-ink underline-offset-2 hover:underline"
      >
        {t("onboarding.navigation.readRisks")}
      </Link>
      <label className="mt-5 flex cursor-pointer gap-3 rounded-ortaq-md border border-ortaq-border bg-ortaq-bg px-4 py-3">
        <input
          type="checkbox"
          checked={acknowledged}
          onChange={(e) => onAckChange(e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 accent-ortaq-trust"
        />
        <span className="text-sm leading-[1.55] text-ortaq-ink">{t("onboarding.steps.risk.ack")}</span>
      </label>
    </div>
  );
}
