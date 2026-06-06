"use client";

import Link from "next/link";
import { cn } from "@/lib/cn";
import { typography } from "@/design/typography";
import { Container } from "@/components/ui/Section";
import { PublicShell } from "@/components/layout/PublicShell";
import { CommercialDashboard } from "@/components/cop/CommercialDashboard";
import { ProblemComparison } from "@/components/cop/ProblemComparison";
import { WorkflowSteps } from "@/components/cop/WorkflowSteps";
import { PlatformModules } from "@/components/cop/PlatformModules";

export function CommercialOpsHomeView() {
  return (
    <PublicShell stickyCta={false}>

      {/* ══ HERO ══════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden border-b border-ortaq-border bg-ortaq-surface">
        <Container wide>
          <div className="grid min-h-[calc(100dvh-3.75rem)] grid-cols-1 items-center gap-10 py-14 lg:grid-cols-[1fr_1.2fr] lg:gap-12 lg:py-16 xl:gap-16 xl:py-20">

            {/* Left — copy */}
            <div className="flex flex-col">
              <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-ortaq-border bg-ortaq-bg px-3 py-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-ortaq-trust" />
                <span className={cn(typography.caption, "font-medium text-ortaq-ink-muted")}>
                  Commercial Operations Platform
                </span>
              </div>

              <h1
                className={cn(
                  "font-body font-bold tracking-[-0.04em] text-ortaq-ink",
                  "text-[2.5rem] leading-[1.04] sm:text-[3rem] lg:text-[3.25rem] xl:text-[3.75rem]",
                )}
              >
                The Control Center<br />
                <span className="text-ortaq-trust">For B2B Commerce.</span>
              </h1>

              <p
                className={cn(
                  "mt-5 max-w-md leading-relaxed text-ortaq-ink-muted",
                  "text-[1rem] sm:text-[1.0625rem]",
                )}
              >
                Manage negotiations, documents, approvals, inspections, shipments
                and payments from one operational workspace.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/demo"
                  className="inline-flex min-h-12 items-center justify-center rounded-lg bg-ortaq-ink px-7 text-[0.9375rem] font-semibold leading-none text-ortaq-cream shadow-[var(--shadow-product)] transition-all hover:bg-ortaq-ink-muted active:scale-[0.98]"
                >
                  Request Demo
                </Link>
                <Link
                  href="/nasil-calisir"
                  className="inline-flex min-h-12 items-center justify-center rounded-lg border border-ortaq-border-strong bg-transparent px-6 text-[0.9375rem] font-medium text-ortaq-ink transition-colors hover:bg-ortaq-bg"
                >
                  See How It Works
                </Link>
              </div>

              {/* Trust line */}
              <p className={cn(typography.caption, "mt-8 text-ortaq-ink-soft")}>
                Founded by operators with experience at LEGO Group, Petlas and Yi&#287;it Ak&#252;.
              </p>
            </div>

            {/* Right — live dashboard */}
            <div className="relative">
              <CommercialDashboard />
            </div>
          </div>
        </Container>
      </section>

      {/* ══ SOCIAL PROOF BAR ══════════════════════════════════════════ */}
      <section className="border-b border-ortaq-border bg-ortaq-bg">
        <Container wide>
          <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-4 py-4">
            <p className={cn(typography.caption, "text-ortaq-ink-soft")}>
              Designed for companies managing complex B2B deals globally
            </p>
            <div className="flex flex-wrap items-center gap-6">
              {[
                "International Trade",
                "Manufacturing",
                "Distribution",
                "Procurement",
                "Export",
              ].map((label) => (
                <span key={label} className="text-[0.75rem] font-medium text-ortaq-ink-muted">
                  {label}
                </span>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ══ PROBLEM ═══════════════════════════════════════════════════ */}
      <ProblemComparison />

      {/* ══ WORKFLOW ══════════════════════════════════════════════════ */}
      <WorkflowSteps />

      {/* ══ MODULES ═══════════════════════════════════════════════════ */}
      <PlatformModules />

      {/* ══ TRUST ═════════════════════════════════════════════════════ */}
      <section className="border-b border-ortaq-border bg-ortaq-surface">
        <Container wide>
          <div className="py-12 sm:py-14">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
              <div className="max-w-xl">
                <p className={cn(typography.label, "mb-3 text-ortaq-ink-soft")}>
                  Built by operators, not consultants
                </p>
                <h2
                  className={cn(
                    "font-body font-bold tracking-[-0.025em] text-ortaq-ink leading-[1.15]",
                    "text-[1.5rem] sm:text-[1.75rem]",
                  )}
                >
                  We ran the deals before we built the software.
                </h2>
                <p className={cn(typography.body, "mt-3 max-w-lg")}>
                  ORTAQ was founded by a team with hands-on experience in international
                  sales, export, manufacturing and distribution across Europe, the Gulf
                  and ASEAN. We built the tool that did not exist.
                </p>
              </div>

              <div className="grid shrink-0 grid-cols-3 gap-3 sm:grid-cols-3">
                {["LEGO Group", "Petlas", "Yiğit Akü"].map((company) => (
                  <div
                    key={company}
                    className="flex min-h-[4.5rem] items-center justify-center rounded-xl border border-ortaq-border bg-ortaq-bg px-4 py-3 text-center"
                  >
                    <p className="text-[0.8125rem] font-semibold text-ortaq-ink leading-tight">{company}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ══ FINAL CTA ═════════════════════════════════════════════════ */}
      <section className="bg-ortaq-dark">
        <Container wide>
          <div className="py-16 sm:py-20 lg:py-24">
            <div className="mx-auto max-w-2xl text-center">
              <h2
                className={cn(
                  "font-body font-bold tracking-[-0.035em] text-ortaq-cream leading-[1.08]",
                  "text-[2rem] sm:text-[2.5rem]",
                )}
              >
                Take Control of Your<br />Commercial Operations.
              </h2>
              <p className={cn(typography.body, "mx-auto mt-4 max-w-md text-ortaq-cream/70")}>
                Request a demo. We will walk you through a live workspace in 30 minutes.
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/demo"
                  className="inline-flex min-h-12 items-center justify-center rounded-lg bg-ortaq-cream px-8 text-[0.9375rem] font-semibold text-ortaq-ink transition-colors hover:bg-white active:scale-[0.98]"
                >
                  Request Demo
                </Link>
                <Link
                  href="/ekip"
                  className="inline-flex min-h-12 items-center justify-center rounded-lg border border-white/20 bg-transparent px-6 text-[0.9375rem] font-medium text-ortaq-cream/80 transition-colors hover:border-white/40 hover:text-ortaq-cream"
                >
                  Talk to the team →
                </Link>
              </div>

              <p className={cn(typography.caption, "mx-auto mt-10 text-ortaq-cream/30")}>
                ORTAQ is operated by a team with backgrounds at LEGO Group, Petlas and Yi&#287;it Ak&#252;.
              </p>
            </div>
          </div>
        </Container>
      </section>

    </PublicShell>
  );
}
