"use client";

import { useTranslation } from "react-i18next";
import { cn } from "@/lib/cn";
import { typography } from "@/design/typography";

type SidebarStep = {
  key: string;
  done: boolean;
  active?: boolean;
};

const SIDEBAR_STEPS: SidebarStep[] = [
  { key: "loi", done: true },
  { key: "sco", done: true },
  { key: "fco", done: false, active: true },
  { key: "spa", done: false },
  { key: "inspection", done: false },
  { key: "shipment", done: false },
  { key: "payment", done: false },
];

export function TradeRoomPreview() {
  const { t } = useTranslation();

  return (
    <div className="relative mx-auto w-full max-w-3xl">
      {/* Browser chrome */}
      <div className="rounded-ortaq-lg border border-ortaq-border bg-ortaq-surface shadow-[var(--shadow-elevated)] overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center gap-2 border-b border-ortaq-border bg-ortaq-bg px-4 py-3">
          <div className="flex gap-1.5">
            <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
            <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
            <span className="h-3 w-3 rounded-full bg-[#28c840]" />
          </div>
          <div className="flex-1 mx-4">
            <div className="rounded-ortaq-sm bg-ortaq-surface border border-ortaq-border px-3 py-1 text-[0.6875rem] text-ortaq-ink-soft font-mono">
              ortaq.biz/trade/TR-2024-0847
            </div>
          </div>
        </div>

        {/* App shell */}
        <div className="flex min-h-[22rem] divide-x divide-ortaq-border">
          {/* Sidebar */}
          <div className="w-36 shrink-0 bg-ortaq-bg py-4">
            <div className="px-3 pb-3">
              <p className={cn(typography.label, "text-ortaq-ink-soft")}>İşlem #0847</p>
              <p className="mt-0.5 text-[0.8125rem] font-semibold text-ortaq-ink leading-tight">
                Fındık İhracatı — Dubai
              </p>
            </div>

            <div className="border-t border-ortaq-border pt-3">
              {SIDEBAR_STEPS.map((step) => (
                <div
                  key={step.key}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 text-[0.75rem] font-medium",
                    step.active && "bg-ortaq-trust/8 text-ortaq-trust font-semibold",
                    step.done && "text-ortaq-ink-muted",
                    !step.done && !step.active && "text-ortaq-ink-soft",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[0.5625rem] font-bold",
                      step.done && "bg-ortaq-trust text-ortaq-cream",
                      step.active && "border-2 border-ortaq-trust text-ortaq-trust bg-transparent",
                      !step.done && !step.active && "border border-ortaq-border text-ortaq-ink-soft",
                    )}
                  >
                    {step.done ? (
                      <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 10 10" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2 5l2.5 2.5 3.5-4" />
                      </svg>
                    ) : (
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                    )}
                  </span>
                  {t(`trade.workflow.steps.${step.key}.name`)}
                </div>
              ))}
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 bg-ortaq-surface p-5">
            {/* Step header */}
            <div className="mb-5 flex items-start justify-between">
              <div>
                <p className={cn(typography.label, "text-ortaq-trust mb-1")}>Aktif Adım</p>
                <h3 className="text-[1rem] font-semibold text-ortaq-ink leading-tight">
                  {t("trade.product.roomTitle")}
                </h3>
              </div>
              <span className="rounded-ortaq-sm bg-ortaq-status-soft px-2 py-1 text-[0.6875rem] font-semibold text-ortaq-status">
                İnceleme Bekliyor
              </span>
            </div>

            {/* Field rows */}
            <div className="space-y-3 rounded-ortaq-md border border-ortaq-border bg-ortaq-bg p-4">
              {(
                [
                  ["commodity", "commodityValue"],
                  ["quantity", "quantityValue"],
                  ["price", "priceValue"],
                  ["validity", "validityValue"],
                ] as const
              ).map(([labelKey, valueKey]) => (
                <div key={labelKey} className="flex items-start gap-3">
                  <span className="w-24 shrink-0 text-[0.75rem] text-ortaq-ink-soft pt-px">
                    {t(`trade.product.fields.${labelKey}`)}
                  </span>
                  <span className="text-[0.8125rem] font-medium text-ortaq-ink">
                    {t(`trade.product.fields.${valueKey}`)}
                  </span>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="mt-5 flex gap-2.5">
              <button className="inline-flex items-center gap-1.5 rounded-ortaq-sm bg-ortaq-trust px-4 py-2.5 text-[0.8125rem] font-semibold text-ortaq-cream shadow-[var(--shadow-product)] transition-colors hover:bg-ortaq-trust-deep">
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 14 14" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2 7l4 4 6-6" />
                </svg>
                {t("trade.product.ctaAccept")}
              </button>
              <button className="inline-flex items-center rounded-ortaq-sm border border-ortaq-border bg-transparent px-4 py-2.5 text-[0.8125rem] font-medium text-ortaq-ink-muted transition-colors hover:bg-ortaq-bg">
                {t("trade.product.ctaRevise")}
              </button>
            </div>

            {/* Timeline annotation */}
            <div className="mt-5 border-t border-ortaq-border pt-4">
              <p className={cn(typography.caption, "text-ortaq-ink-soft mb-2")}>İşlem zaman çizelgesi</p>
              <div className="flex items-center gap-1.5 text-[0.6875rem] text-ortaq-ink-soft">
                {["LOI", "SCO", "FCO", "SPA", "Denetim", "Sevkiyat", "Ödeme"].map((s, i) => (
                  <span key={s} className="flex items-center gap-1.5">
                    <span
                      className={cn(
                        "rounded px-1.5 py-0.5 font-medium",
                        i < 2 ? "bg-ortaq-trust/15 text-ortaq-trust" : i === 2 ? "bg-ortaq-status-soft text-ortaq-status font-bold" : "text-ortaq-ink-soft",
                      )}
                    >
                      {s}
                    </span>
                    {i < 6 && <span className="text-ortaq-border-strong">→</span>}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Caption */}
      <p className={cn(typography.caption, "mt-3 text-center text-ortaq-ink-soft")}>
        {t("trade.product.previewLabel")}
      </p>
    </div>
  );
}
