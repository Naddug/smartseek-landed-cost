"use client";

import { useTranslation } from "react-i18next";
import { cn } from "@/lib/cn";
import { typography } from "@/design/typography";
import { Container } from "@/components/ui/Section";

const TOOLS = ["whatsapp", "email", "excel", "pdf"] as const;

const TOOL_ICONS: Record<string, React.ReactNode> = {
  whatsapp: (
    <svg className="h-7 w-7" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  ),
  email: (
    <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path strokeLinecap="round" d="M2 7l10 7 10-7" />
    </svg>
  ),
  excel: (
    <svg className="h-7 w-7" viewBox="0 0 24 24" fill="currentColor">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" opacity={0.3} />
      <path d="M14 2v6h6M8 13h8M8 17h5" stroke="currentColor" fill="none" strokeWidth={1.5} strokeLinecap="round" />
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinejoin="round" />
    </svg>
  ),
  pdf: (
    <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinejoin="round" d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
      <path strokeLinecap="round" d="M14 2v6h6" />
      <path strokeLinecap="round" d="M9 13h1.5a1.5 1.5 0 0 1 0 3H9v-3zm0 0v-1m5 4h2m-2-2h2" />
    </svg>
  ),
};

export function ProblemStrip() {
  const { t } = useTranslation();

  return (
    <section className="bg-ortaq-bg-alt border-y border-ortaq-border">
      <Container wide>
        <div className="py-14 sm:py-18 lg:py-20">
          {/* Header */}
          <div className="mb-10 max-w-2xl">
            <p className={cn(typography.label, "mb-3 text-ortaq-accent")}>
              {t("trade.problem.label")}
            </p>
            <h2 className={cn(typography.display, "mb-3")}>
              {t("trade.problem.headline")}
            </h2>
            <p className={cn(typography.body, "max-w-xl")}>
              {t("trade.problem.sub")}
            </p>
          </div>

          {/* Tool cards */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {TOOLS.map((tool) => (
              <div
                key={tool}
                className="rounded-ortaq-lg border border-ortaq-border bg-ortaq-surface p-5 shadow-[var(--shadow-product)]"
              >
                <div className="mb-4 text-ortaq-ink-soft">
                  {TOOL_ICONS[tool]}
                </div>
                <p className={cn(typography.h3, "mb-2")}>
                  {t(`trade.problem.tools.${tool}.name`)}
                </p>
                <p className={cn(typography.bodySm, "leading-relaxed")}>
                  {t(`trade.problem.tools.${tool}.problem`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
