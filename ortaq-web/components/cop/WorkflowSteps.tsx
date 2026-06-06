"use client";

import { cn } from "@/lib/cn";
import { typography } from "@/design/typography";
import { Container } from "@/components/ui/Section";

const STEPS = [
  {
    name: "Lead",
    desc: "Capture and qualify incoming opportunities. Assign counterparty.",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
  },
  {
    name: "Quotation",
    desc: "Issue and version-control commercial offers. Track all responses.",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v8a2 2 0 002 2h6a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h0a2 2 0 002-2M9 5a2 2 0 012-2h0a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
  },
  {
    name: "Negotiation",
    desc: "Manage term revisions. Comment on specific clauses. Log every change.",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M7 16l-4 1 1-4a8 8 0 1114-14A8 8 0 017 16z" />
      </svg>
    ),
  },
  {
    name: "Contract",
    desc: "Finalize and sign the sales or distribution agreement. Route for approval.",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    name: "Inspection",
    desc: "Schedule third-party inspection. Attach report. Track milestone status.",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v8a2 2 0 002 2h6a2 2 0 002-2V7a2 2 0 00-2-2h-2m-4 4h4m4-4h0M7 13l2 2 4-4" />
      </svg>
    ),
  },
  {
    name: "Shipment",
    desc: "Log B/L, AWB, packing list. Track ETA. Alert on delays.",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
      </svg>
    ),
  },
  {
    name: "Payment",
    desc: "Confirm LC, TT or SWIFT receipt. Close the deal. Archive the record.",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
  },
] as const;

export function WorkflowSteps() {
  return (
    <section className="border-b border-ortaq-border bg-ortaq-surface">
      <Container wide>
        <div className="py-14 sm:py-16 lg:py-20">
          {/* Header */}
          <div className="mb-12 max-w-2xl">
            <p className={cn(typography.label, "mb-3 text-ortaq-ink-soft")}>The workflow</p>
            <h2
              className={cn(
                "font-body font-bold tracking-[-0.03em] text-ortaq-ink leading-[1.1]",
                "text-[1.75rem] sm:text-[2.125rem]",
              )}
            >
              Every Transaction. One Workspace.
            </h2>
            <p className={cn(typography.body, "mt-3 max-w-lg")}>
              From first contact to final payment — every step tracked, documented
              and visible to both parties.
            </p>
          </div>

          {/* Steps — vertical on mobile, 7-column grid on large */}
          <div className="flex flex-col gap-0 sm:grid sm:grid-cols-7 sm:gap-0">
            {STEPS.map((step, i) => {
              const isLast = i === STEPS.length - 1;
              const isCompleted = i < 4; // show first 4 as "done" for illustration

              return (
                <div key={step.name} className="relative flex sm:flex-col sm:items-center">
                  {/* Mobile: left-rail layout */}
                  <div className="flex flex-1 flex-row items-start gap-4 pb-6 sm:flex-col sm:items-center sm:gap-2 sm:pb-0">
                    {/* Step node */}
                    <div className="relative flex flex-col items-center">
                      <div
                        className={cn(
                          "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2",
                          isCompleted
                            ? "border-ortaq-trust bg-ortaq-trust text-ortaq-cream"
                            : "border-ortaq-border bg-ortaq-surface text-ortaq-ink-soft",
                        )}
                      >
                        {step.icon}
                      </div>
                      {/* Mobile vertical connector */}
                      {!isLast && (
                        <div className={cn("mt-0 h-full w-[2px] flex-1 sm:hidden", isCompleted ? "bg-ortaq-trust/30" : "bg-ortaq-border")} style={{ minHeight: 16 }} />
                      )}
                    </div>

                    <div className="flex-1 pb-2 sm:flex-none sm:pb-0 sm:text-center sm:px-1">
                      <p
                        className={cn(
                          "text-[0.8125rem] font-semibold",
                          isCompleted ? "text-ortaq-ink" : "text-ortaq-ink-soft",
                        )}
                      >
                        {step.name}
                      </p>
                      <p className="mt-1 hidden text-[0.625rem] leading-snug text-ortaq-ink-soft sm:block">
                        {step.desc.split(".")[0]}.
                      </p>
                    </div>
                  </div>

                  {/* Desktop horizontal connector */}
                  {!isLast && (
                    <div
                      className={cn(
                        "absolute left-[calc(50%+1.25rem)] top-5 hidden h-[2px] w-[calc(100%-2.5rem)] sm:block",
                        isCompleted ? "bg-ortaq-trust/40" : "bg-ortaq-border",
                      )}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Mobile descriptions */}
          <div className="mt-4 grid gap-3 sm:hidden">
            {STEPS.map((step) => (
              <div key={step.name} className="flex items-start gap-3 rounded-lg border border-ortaq-border bg-ortaq-bg px-4 py-3">
                <p className="w-20 shrink-0 text-[0.75rem] font-semibold text-ortaq-ink">{step.name}</p>
                <p className="text-[0.6875rem] leading-snug text-ortaq-ink-muted">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
