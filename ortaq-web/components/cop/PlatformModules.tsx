"use client";

import { cn } from "@/lib/cn";
import { typography } from "@/design/typography";
import { Container } from "@/components/ui/Section";

const MODULES = [
  {
    name: "Commercial Workspace",
    desc: "One room per transaction. Both parties, all documents, full history.",
    tier: "core",
  },
  {
    name: "Document Management",
    desc: "Version control, diff tracking, approval states. No more v_FINAL_2.",
    tier: "core",
  },
  {
    name: "Approval Flows",
    desc: "Route any document or decision for structured, auditable sign-off.",
    tier: "core",
  },
  {
    name: "Inspection Management",
    desc: "Schedule, track and receive third-party inspection reports.",
    tier: "core",
  },
  {
    name: "Shipment Tracking",
    desc: "B/L, AWB, ETA. All shipping milestones in the deal timeline.",
    tier: "core",
  },
  {
    name: "Task Coordination",
    desc: "Assign tasks across your team. Deadlines. Accountability.",
    tier: "core",
  },
  {
    name: "Communication Timeline",
    desc: "Structured deal thread. Not a chat. Auditable. Searchable.",
    tier: "core",
  },
  {
    name: "Counterparty Management",
    desc: "Company profiles, contact records, deal history. All linked.",
    tier: "core",
  },
  {
    name: "WhatsApp Integration",
    desc: "Capture WhatsApp conversations into the deal record automatically.",
    tier: "integration",
  },
  {
    name: "Email Integration",
    desc: "Pull deal-related emails into the workspace. Nothing missed.",
    tier: "integration",
  },
  {
    name: "AI Assistant",
    desc: "Reads the deal. Flags unusual clauses, timeline risks and missing documents.",
    tier: "coming",
  },
  {
    name: "ERP Integration",
    desc: "Sync deal data with your ERP. Eliminate double-entry.",
    tier: "coming",
  },
] as const;

const TIER_LABELS: Record<string, string> = {
  core: "Core",
  integration: "Integration",
  coming: "Coming soon",
};

export function PlatformModules() {
  return (
    <section className="border-b border-ortaq-border bg-ortaq-bg">
      <Container wide>
        <div className="py-14 sm:py-16 lg:py-20">
          {/* Header */}
          <div className="mb-10 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className={cn(typography.label, "mb-3 text-ortaq-ink-soft")}>Platform modules</p>
              <h2
                className={cn(
                  "font-body font-bold tracking-[-0.03em] text-ortaq-ink leading-[1.1]",
                  "text-[1.75rem] sm:text-[2.125rem]",
                )}
              >
                Everything a commercial<br className="hidden sm:block" /> operation needs.
              </h2>
            </div>
            <p className={cn(typography.body, "max-w-xs sm:text-right")}>
              Built as integrated modules — not a collection of disconnected tools.
            </p>
          </div>

          {/* Module grid */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {MODULES.map((mod) => (
              <div
                key={mod.name}
                className={cn(
                  "rounded-xl border p-4 transition-shadow",
                  mod.tier === "coming"
                    ? "border-ortaq-border bg-ortaq-surface/50 opacity-60"
                    : "border-ortaq-border bg-ortaq-surface hover:shadow-[var(--shadow-product-hover)]",
                )}
              >
                <div className="mb-2 flex items-center justify-between gap-2">
                  <p className="text-[0.8125rem] font-semibold text-ortaq-ink leading-tight">
                    {mod.name}
                  </p>
                  {mod.tier !== "core" && (
                    <span
                      className={cn(
                        "shrink-0 rounded-full px-1.5 py-0.5 text-[0.5rem] font-semibold",
                        mod.tier === "coming" && "bg-ortaq-bg-warm text-ortaq-ink-soft",
                        mod.tier === "integration" && "bg-blue-50 text-blue-600",
                      )}
                    >
                      {TIER_LABELS[mod.tier]}
                    </span>
                  )}
                </div>
                <p className={cn(typography.caption, "leading-relaxed")}>{mod.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
