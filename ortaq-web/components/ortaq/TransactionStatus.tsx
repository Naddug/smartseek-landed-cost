"use client";

import { cn } from "@/lib/cn";

/**
 * The core product visualization — answers the one question ORTAQ exists to answer:
 * "What is happening with this deal right now and what should happen next?"
 *
 * Three columns: What is Agreed | What is Pending | What Happens Next
 * No charts. No KPIs. Actual work in progress.
 */
export function TransactionStatus() {
  return (
    <div className="relative w-full overflow-hidden rounded-xl border border-ortaq-border bg-ortaq-surface shadow-[0_2px_24px_rgb(20_19_16/0.08),0_0_0_1px_rgb(20_19_16/0.05)]">

      {/* Window chrome */}
      <div className="flex items-center gap-2 border-b border-ortaq-border bg-[#f9f8f6] px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <div className="mx-3 flex-1 rounded border border-ortaq-border bg-white px-3 py-0.5 text-[0.625rem] font-mono text-ortaq-ink-soft">
          app.ortaq.biz/tx/OP-0391
        </div>
        <button className="rounded border border-ortaq-trust/30 bg-ortaq-trust/8 px-2.5 py-1 text-[0.5625rem] font-semibold text-ortaq-trust">
          + New
        </button>
      </div>

      {/* Transaction header */}
      <div className="border-b border-ortaq-border bg-white px-5 py-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-amber-400" />
              <p className="text-[0.6875rem] font-medium uppercase tracking-[0.07em] text-amber-600">
                In Progress — Negotiation
              </p>
            </div>
            <p className="mt-1 text-[0.9375rem] font-bold text-ortaq-ink leading-tight">
              Steel Supply Agreement — BestBuild GmbH
            </p>
            <div className="mt-1.5 flex items-center gap-2 text-[0.625rem] text-ortaq-ink-soft">
              <Avatar initials="YÇ" color="trust" />
              <span>Yılmaz Çelik</span>
              <span className="text-ortaq-border-strong">↔</span>
              <Avatar initials="BG" color="blue" />
              <span>BestBuild GmbH</span>
              <span className="mx-1 text-ortaq-border">·</span>
              <span className="tabular-nums font-medium text-ortaq-ink">€840,000</span>
              <span className="text-ortaq-border">·</span>
              <span>Closes June 30</span>
            </div>
          </div>
          <div className="hidden shrink-0 sm:block">
            <p className="text-right text-[0.5625rem] font-medium uppercase tracking-[0.06em] text-ortaq-ink-soft">Last updated</p>
            <p className="text-right text-[0.6875rem] font-medium text-ortaq-ink">2 hours ago</p>
          </div>
        </div>
      </div>

      {/* Three-column status board */}
      <div className="grid grid-cols-3 divide-x divide-ortaq-border bg-[#faf9f7]">

        {/* Column 1 — What is agreed */}
        <StatusColumn
          label="What is Agreed"
          accent="trust"
          count={4}
          items={[
            { text: "Price: €1,260/MT CIF Rotterdam", done: true },
            { text: "Quantity: 500 MT", done: true },
            { text: "Incoterm: CIF Rotterdam", done: true },
            { text: "LOI signed by both parties", done: true },
          ]}
        />

        {/* Column 2 — What is pending */}
        <StatusColumn
          label="Pending"
          accent="amber"
          count={3}
          items={[
            { text: "Contract revision — Clause 4.2", done: false, owner: "BestBuild" },
            { text: "Finance sign-off on payment terms", done: false, owner: "Internal" },
            { text: "Inspection date confirmation", done: false, owner: "SGS" },
          ]}
        />

        {/* Column 3 — What happens next */}
        <div className="flex flex-col bg-white p-3.5">
          <p className="mb-2.5 text-[0.5625rem] font-semibold uppercase tracking-[0.08em] text-ortaq-ink-soft">
            What Happens Next
          </p>
          <div className="space-y-2">
            {[
              { action: "Respond to Clause 4.2 revision", by: "You", urgent: true },
              { action: "Schedule SGS inspection", by: "You", urgent: true },
              { action: "Request finance approval", by: "Internal", urgent: false },
            ].map((item, i) => (
              <div
                key={i}
                className={cn(
                  "flex items-start gap-2 rounded-lg border px-2.5 py-2",
                  item.urgent
                    ? "border-ortaq-trust/20 bg-ortaq-trust/5"
                    : "border-ortaq-border bg-ortaq-bg",
                )}
              >
                <svg
                  className={cn("mt-0.5 h-3 w-3 shrink-0", item.urgent ? "text-ortaq-trust" : "text-ortaq-ink-soft")}
                  fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2 6h8M6 2l4 4-4 4" />
                </svg>
                <div className="min-w-0">
                  <p className="text-[0.625rem] font-medium leading-snug text-ortaq-ink">{item.action}</p>
                  <p className="text-[0.5rem] text-ortaq-ink-soft">Assigned to: {item.by}</p>
                </div>
              </div>
            ))}
          </div>

          {/* AI summary */}
          <div className="mt-3 rounded-lg border border-dashed border-ortaq-border bg-ortaq-bg/50 p-2.5">
            <p className="text-[0.5rem] font-semibold uppercase tracking-[0.07em] text-ortaq-ink-soft mb-1">
              AI Summary
            </p>
            <p className="text-[0.5625rem] leading-relaxed text-ortaq-ink-muted">
              Deal is 60% complete. Main blocker: Clause 4.2 response from your side. Estimated close: June 28 if resolved today.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom bar — progress */}
      <div className="flex items-center justify-between border-t border-ortaq-border bg-white px-5 py-2.5">
        <div className="flex items-center gap-4">
          {[
            { label: "Agreed", value: "4", color: "trust" },
            { label: "Pending", value: "3", color: "amber" },
            { label: "Next actions", value: "2 yours", color: "trust" },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-1.5">
              <span
                className={cn(
                  "h-1.5 w-1.5 rounded-full",
                  s.color === "trust" ? "bg-ortaq-trust" : "bg-amber-400",
                )}
              />
              <span className="text-[0.5625rem] text-ortaq-ink-soft">{s.label}</span>
              <span className={cn("text-[0.625rem] font-bold", s.color === "trust" ? "text-ortaq-trust" : "text-amber-600")}>
                {s.value}
              </span>
            </div>
          ))}
        </div>
        <div className="hidden items-center gap-1.5 sm:flex">
          <div className="h-1.5 w-24 overflow-hidden rounded-full bg-ortaq-border">
            <div className="h-full w-[58%] rounded-full bg-ortaq-trust" />
          </div>
          <span className="text-[0.5625rem] font-medium text-ortaq-ink-soft">58% complete</span>
        </div>
      </div>
    </div>
  );
}

function StatusColumn({
  label,
  accent,
  count,
  items,
}: {
  label: string;
  accent: "trust" | "amber";
  count: number;
  items: { text: string; done: boolean; owner?: string }[];
}) {
  return (
    <div className="p-3.5">
      <div className="mb-2.5 flex items-center justify-between">
        <p className="text-[0.5625rem] font-semibold uppercase tracking-[0.08em] text-ortaq-ink-soft">
          {label}
        </p>
        <span
          className={cn(
            "rounded-full px-1.5 py-0.5 text-[0.5rem] font-bold",
            accent === "trust" ? "bg-ortaq-trust/10 text-ortaq-trust" : "bg-amber-50 text-amber-600",
          )}
        >
          {count}
        </span>
      </div>
      <div className="space-y-1.5">
        {items.map((item, i) => (
          <div key={i} className="flex items-start gap-2">
            <span
              className={cn(
                "mt-0.5 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full",
                item.done
                  ? "bg-ortaq-trust/15 text-ortaq-trust"
                  : "border border-amber-300 bg-amber-50",
              )}
            >
              {item.done ? (
                <svg className="h-2 w-2" fill="none" viewBox="0 0 8 8" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M1.5 4l2 2 3-3" />
                </svg>
              ) : (
                <span className="h-1 w-1 rounded-full bg-amber-400" />
              )}
            </span>
            <div className="min-w-0">
              <p className="text-[0.625rem] leading-snug text-ortaq-ink-muted">{item.text}</p>
              {item.owner && (
                <p className="text-[0.5rem] text-ortaq-ink-soft">→ {item.owner}</p>
              )}
            </div>
          </div>
        ))}
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
