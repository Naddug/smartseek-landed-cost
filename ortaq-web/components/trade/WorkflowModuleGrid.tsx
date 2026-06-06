"use client";

import { useTranslation } from "react-i18next";
import { cn } from "@/lib/cn";
import { typography } from "@/design/typography";
import { Container } from "@/components/ui/Section";

const MODULES = ["offers", "contracts", "inspection", "logistics", "payment"] as const;
type Module = (typeof MODULES)[number];

const MODULE_ICONS: Record<Module, React.ReactNode> = {
  offers: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v8a2 2 0 002 2h6a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h0a2 2 0 002-2M9 5a2 2 0 012-2h0a2 2 0 012 2m-6 8l2 2 4-4" />
    </svg>
  ),
  contracts: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  inspection: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v8a2 2 0 002 2h6a2 2 0 002-2V7a2 2 0 00-2-2h-2m-4 0a2 2 0 104 0m-4 0h4m-2 4v4" />
    </svg>
  ),
  logistics: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
    </svg>
  ),
  payment: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
  ),
};

export function WorkflowModuleGrid() {
  const { t } = useTranslation();

  return (
    <section className="bg-ortaq-surface border-b border-ortaq-border">
      <Container wide>
        <div className="py-14 sm:py-18 lg:py-20">
          {/* Header */}
          <div className="mb-10">
            <p className={cn(typography.label, "mb-3 text-ortaq-ink-soft")}>
              {t("trade.modules.label")}
            </p>
            <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
              <h2 className={cn(typography.display, "max-w-lg")}>
                {t("trade.modules.headline")}
              </h2>
              <p className={cn(typography.body, "max-w-sm sm:text-right")}>
                {t("trade.modules.sub")}
              </p>
            </div>
          </div>

          {/* Module grid */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {MODULES.slice(0, 4).map((mod, i) => (
              <ModuleCard key={mod} mod={mod} index={i} t={t} />
            ))}
            {/* Payment spans full bottom row */}
            <div className="sm:col-span-2 lg:col-span-1">
              <ModuleCard mod="payment" index={4} t={t} />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

function ModuleCard({
  mod,
  index,
  t,
}: {
  mod: Module;
  index: number;
  t: (key: string) => string;
}) {
  const items: string[] = JSON.parse(JSON.stringify(t(`trade.modules.${mod}.items`))) as unknown as string[];

  return (
    <div className="group rounded-ortaq-lg border border-ortaq-border bg-ortaq-bg p-5 transition-shadow hover:shadow-[var(--shadow-product-hover)]">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-ortaq-md border border-ortaq-border bg-ortaq-surface text-ortaq-ink shadow-[var(--shadow-product)]">
          {MODULE_ICONS[mod]}
        </div>
        <div>
          <span className={cn(typography.caption, "text-ortaq-ink-soft")}>
            {String(index + 1).padStart(2, "0")}
          </span>
          <p className={cn(typography.h3)}>{t(`trade.modules.${mod}.name`)}</p>
        </div>
      </div>

      <p className={cn(typography.bodySm, "mb-4 leading-relaxed")}>
        {t(`trade.modules.${mod}.desc`)}
      </p>

      <ul className="space-y-1.5">
        {(Array.isArray(items) ? items : [items]).map((item: string) => (
          <li key={item} className="flex items-center gap-2 text-[0.75rem] text-ortaq-ink-muted">
            <span className="h-1 w-1 shrink-0 rounded-full bg-ortaq-trust" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
