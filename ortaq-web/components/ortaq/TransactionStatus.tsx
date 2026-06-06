"use client";

import { cn } from "@/lib/cn";

/**
 * Live deal action board — the visual answers the question every second:
 * "What needs to happen next — and who needs to do it?"
 *
 * Framing: YOUR TURN / THEIR TURN / BLOCKERS / AI INSIGHT
 * NOT: document storage, file lists, or organized archives.
 * Progress is the product.
 */
export function TransactionStatus() {
  return (
    <div className="relative w-full overflow-hidden rounded-xl border border-ortaq-border bg-white shadow-[0_4px_32px_rgb(20_19_16/0.10),0_0_0_1px_rgb(20_19_16/0.05)]">

      {/* Window chrome */}
      <div className="flex items-center gap-2 border-b border-ortaq-border bg-[#f9f8f6] px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <div className="mx-3 flex-1 rounded border border-ortaq-border bg-white px-3 py-0.5 text-[0.625rem] font-mono text-ortaq-ink-soft">
          app.ortaq.biz/tx/OP-0391
        </div>
      </div>

      {/* Deal header */}
      <div className="border-b border-ortaq-border bg-white px-5 py-3.5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[0.9375rem] font-bold text-ortaq-ink leading-tight">
              Steel Supply — BestBuild GmbH
            </p>
            <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[0.625rem] text-ortaq-ink-soft">
              <Avatar initials="YÇ" color="trust" />
              <span>Yılmaz Çelik</span>
              <span className="text-ortaq-border">↔</span>
              <Avatar initials="BG" color="blue" />
              <span>BestBuild GmbH</span>
              <span className="text-ortaq-border">·</span>
              <span className="font-medium text-ortaq-ink tabular-nums">€840,000</span>
              <span className="text-ortaq-border">·</span>
              <span>Closes June 30</span>
            </div>
          </div>
          {/* Progress ring */}
          <div className="hidden shrink-0 flex-col items-center sm:flex">
            <svg className="h-9 w-9 -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="14" fill="none" stroke="#e8e5df" strokeWidth="4" />
              <circle cx="18" cy="18" r="14" fill="none" stroke="var(--color-ortaq-trust)" strokeWidth="4"
                strokeDasharray="87.96" strokeDashoffset="37" strokeLinecap="round" />
            </svg>
            <span className="mt-0.5 text-[0.5rem] font-bold text-ortaq-ink">58%</span>
          </div>
        </div>

        {/* Milestone strip */}
        <div className="mt-3 flex items-center gap-0">
          {[
            { label: "LOI", done: true },
            { label: "Price", done: true },
            { label: "Contract", done: false, active: true },
            { label: "Inspect", done: false },
            { label: "Ship", done: false },
            { label: "Payment", done: false },
          ].map((m, i) => (
            <div key={m.label} className="flex flex-1 items-center">
              <div className="flex flex-col items-center gap-0.5">
                <div
                  className={cn(
                    "flex h-4 w-4 items-center justify-center rounded-full text-[0.4375rem] font-bold",
                    m.done
                      ? "bg-ortaq-trust text-white"
                      : m.active
                        ? "border-2 border-ortaq-trust bg-white text-ortaq-trust"
                        : "border border-ortaq-border bg-[#f5f3ef] text-ortaq-ink-soft",
                  )}
                >
                  {m.done ? "✓" : i + 1}
                </div>
                <span
                  className={cn(
                    "text-[0.4375rem] font-medium",
                    m.done ? "text-ortaq-trust" : m.active ? "text-ortaq-ink font-bold" : "text-ortaq-ink-soft",
                  )}
                >
                  {m.label}
                </span>
              </div>
              {i < 5 && (
                <div
                  className={cn(
                    "mb-3.5 h-px flex-1",
                    m.done ? "bg-ortaq-trust/40" : "bg-ortaq-border",
                  )}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* YOUR TURN / THEIR TURN — the core concept */}
      <div className="grid grid-cols-2 divide-x divide-ortaq-border bg-[#faf9f7]">

        {/* YOUR TURN */}
        <div className="p-4">
          <div className="mb-3 flex items-center gap-1.5">
            <span className="h-2 w-2 animate-pulse rounded-full bg-ortaq-trust" />
            <p className="text-[0.625rem] font-bold uppercase tracking-[0.08em] text-ortaq-trust">
              Your Turn · 2 actions
            </p>
          </div>
          <div className="space-y-2">
            {[
              {
                action: "Respond to Clause 4.2 revision",
                deadline: "Tomorrow",
                tag: "Contract",
                urgent: true,
              },
              {
                action: "Confirm SGS inspection date",
                deadline: "June 15",
                tag: "Logistics",
                urgent: true,
              },
            ].map((item, i) => (
              <div
                key={i}
                className="rounded-lg border border-ortaq-trust/20 bg-ortaq-trust/5 p-2.5"
              >
                <p className="text-[0.625rem] font-semibold leading-snug text-ortaq-ink">
                  {item.action}
                </p>
                <div className="mt-1 flex items-center gap-1.5">
                  <span className="rounded bg-ortaq-trust/10 px-1 py-0.5 text-[0.4375rem] font-semibold uppercase text-ortaq-trust">
                    {item.tag}
                  </span>
                  <span className="text-[0.5rem] text-ortaq-accent">
                    Due: {item.deadline}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* THEIR TURN */}
        <div className="p-4">
          <div className="mb-3 flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-ortaq-border-strong" />
            <p className="text-[0.625rem] font-bold uppercase tracking-[0.08em] text-ortaq-ink-soft">
              Their Turn · 1 action
            </p>
          </div>
          <div className="space-y-2">
            <div className="rounded-lg border border-ortaq-border bg-ortaq-bg p-2.5">
              <p className="text-[0.625rem] font-semibold leading-snug text-ortaq-ink-muted">
                Finance sign-off on payment terms
              </p>
              <div className="mt-1 flex items-center gap-1.5">
                <span className="rounded bg-ortaq-bg px-1 py-0.5 text-[0.4375rem] font-semibold uppercase text-ortaq-ink-soft border border-ortaq-border">
                  Finance
                </span>
                <span className="text-[0.5rem] text-ortaq-ink-soft">
                  Waiting · BestBuild internal
                </span>
              </div>
            </div>
          </div>

          {/* What's been decided */}
          <div className="mt-3">
            <p className="mb-1.5 text-[0.5rem] font-semibold uppercase tracking-[0.07em] text-ortaq-ink-soft">
              Decided
            </p>
            <div className="space-y-1">
              {[
                "Price: €1,260/MT CIF Rotterdam",
                "500 MT quantity",
                "LOI signed — both parties",
              ].map((item) => (
                <div key={item} className="flex items-center gap-1.5">
                  <svg className="h-3 w-3 shrink-0 text-ortaq-trust" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2 6l3 3 5-5" />
                  </svg>
                  <p className="text-[0.5625rem] text-ortaq-ink-muted">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* AI insight bar */}
      <div className="border-t border-ortaq-border bg-white px-4 py-3">
        <div className="flex items-start gap-2.5">
          <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-ortaq-ink">
            <svg className="h-2.5 w-2.5 text-ortaq-cream" fill="currentColor" viewBox="0 0 10 10">
              <circle cx="5" cy="5" r="2" />
              <path d="M5 1v1M5 8v1M1 5h1M8 5h1M2.5 2.5l.7.7M6.8 6.8l.7.7M2.5 7.5l.7-.7M6.8 3.2l.7-.7" stroke="currentColor" strokeWidth="0.75" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="min-w-0">
            <p className="text-[0.5rem] font-semibold uppercase tracking-[0.07em] text-ortaq-ink-soft mb-0.5">
              AI Insight
            </p>
            <p className="text-[0.5625rem] leading-relaxed text-ortaq-ink-muted">
              Main blocker is on your side. Respond to Clause 4.2 before June 12
              to stay on track for the June 30 close. Both parties have agreed on
              all financial terms.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Avatar({ initials, color }: { initials: string; color: "trust" | "blue" }) {
  return (
    <span
      className={cn(
        "inline-flex h-4 w-4 items-center justify-center rounded-full text-[0.4375rem] font-bold",
        color === "trust" ? "bg-ortaq-trust/15 text-ortaq-trust" : "bg-blue-100 text-blue-700",
      )}
    >
      {initials}
    </span>
  );
}
