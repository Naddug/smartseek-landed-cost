"use client";

import { cn } from "@/lib/cn";
import { typography } from "@/design/typography";
import { Container } from "@/components/ui/Section";

export function ProblemComparison() {
  return (
    <section className="border-b border-ortaq-border bg-ortaq-bg-alt">
      <Container wide>
        <div className="py-14 sm:py-16 lg:py-20">
          {/* Header */}
          <div className="mb-12 max-w-2xl">
            <p className={cn(typography.label, "mb-3 text-ortaq-accent")}>The problem</p>
            <h2
              className={cn(
                "font-body font-bold tracking-[-0.03em] text-ortaq-ink leading-[1.1]",
                "text-[1.75rem] sm:text-[2.125rem]",
              )}
            >
              Your commercial operations are running on chaos.
            </h2>
            <p className={cn(typography.body, "mt-3 max-w-lg")}>
              Every deal runs across six disconnected tools. Nothing is in one place.
              Nothing is traceable. Nothing is under control.
            </p>
          </div>

          {/* Comparison */}
          <div className="grid gap-4 lg:grid-cols-2">
            {/* Today */}
            <div className="rounded-xl border border-ortaq-border bg-ortaq-surface p-6">
              <div className="mb-5 flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-ortaq-accent" />
                <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-ortaq-accent">
                  Today
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                {[
                  { name: "WhatsApp", icon: "💬" },
                  { name: "Email", icon: "📧" },
                  { name: "Excel", icon: "📊" },
                  { name: "PDFs", icon: "📄" },
                  { name: "Phone calls", icon: "📞" },
                  { name: "Shared folders", icon: "🗂" },
                ].map((tool) => (
                  <div
                    key={tool.name}
                    className="flex items-center gap-2 rounded-lg border border-ortaq-border bg-ortaq-bg px-3 py-2.5"
                  >
                    <span className="text-sm" aria-hidden>{tool.icon}</span>
                    <span className="text-[0.75rem] font-medium text-ortaq-ink-muted">{tool.name}</span>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex items-start gap-2.5 rounded-lg border border-red-100 bg-red-50 px-4 py-3">
                <svg className="mt-0.5 h-4 w-4 shrink-0 text-red-400" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 5.5v3m0 2h.01M2.93 13h10.14a1.5 1.5 0 001.3-2.25L9.3 3.25a1.5 1.5 0 00-2.6 0L1.63 10.75A1.5 1.5 0 002.93 13z" />
                </svg>
                <div>
                  <p className="text-[0.75rem] font-semibold text-red-700">Result</p>
                  <p className="mt-0.5 text-[0.6875rem] text-red-600">
                    Confusion. Delays. Lost information. Version problems. Deals that close late — or don&apos;t close.
                  </p>
                </div>
              </div>
            </div>

            {/* ORTAQ */}
            <div className="rounded-xl border border-ortaq-trust/25 bg-ortaq-trust-soft/30 p-6">
              <div className="mb-5 flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-ortaq-trust" />
                <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-ortaq-trust">
                  ORTAQ
                </p>
              </div>

              <div className="flex flex-col gap-2.5">
                {[
                  { label: "One workspace", desc: "Every deal, every party, every document — in one place." },
                  { label: "One timeline", desc: "The complete deal history. Auditable. Searchable. Permanent." },
                  { label: "One source of truth", desc: "No more v_FINAL_2.pdf. The current version is always current." },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-3 rounded-lg border border-ortaq-trust/15 bg-white px-4 py-3">
                    <div className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-ortaq-trust/15">
                      <svg className="h-2.5 w-2.5 text-ortaq-trust" fill="none" viewBox="0 0 10 10" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2 5l2 2.5 4-4" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[0.8125rem] font-semibold text-ortaq-ink">{item.label}</p>
                      <p className="mt-0.5 text-[0.6875rem] text-ortaq-ink-muted">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex items-start gap-2.5 rounded-lg border border-ortaq-trust/20 bg-ortaq-trust/8 px-4 py-3">
                <svg className="mt-0.5 h-4 w-4 shrink-0 text-ortaq-trust" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 8l2.5 2.5 4-4M14 8A6 6 0 112 8a6 6 0 0112 0z" />
                </svg>
                <div>
                  <p className="text-[0.75rem] font-semibold text-ortaq-trust">Result</p>
                  <p className="mt-0.5 text-[0.6875rem] text-ortaq-trust-muted">
                    Every deal tracked, controlled and closed. On time.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
