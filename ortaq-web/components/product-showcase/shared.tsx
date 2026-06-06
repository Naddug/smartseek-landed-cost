"use client";

import { cn } from "@/lib/cn";

/* ─── Status badge ─────────────────────────────────────────────────────────
   Every status in ORTAQ names the responsible party, not just a color.    */

type StatusType = "confirmed" | "pending" | "blocked" | "internal" | "new";

const STATUS_MAP: Record<StatusType, { label: string; cls: string }> = {
  confirmed: { label: "Onaylandı",    cls: "bg-emerald-50 text-emerald-700 border border-emerald-200" },
  pending:   { label: "Bekleniyor",   cls: "bg-amber-50 text-amber-700 border border-amber-200"       },
  blocked:   { label: "Engellenmiş",  cls: "bg-red-50 text-red-700 border border-red-200"             },
  internal:  { label: "Yalnızca biz", cls: "bg-slate-100 text-slate-600 border border-slate-200"      },
  new:       { label: "Yeni",         cls: "bg-blue-50 text-blue-700 border border-blue-200"           },
};

export function StatusBadge({ type, label, size = "sm" }: {
  type: StatusType;
  label?: string;
  size?: "xs" | "sm";
}) {
  const s = STATUS_MAP[type];
  return (
    <span className={cn(
      "inline-flex items-center rounded-full font-semibold whitespace-nowrap",
      size === "xs" ? "px-1.5 py-px text-[0.6rem]" : "px-2 py-0.5 text-[0.6875rem]",
      s.cls,
    )}>
      {label ?? s.label}
    </span>
  );
}

/* ─── Party badge ─────────────────────────────────────────────────────────
   Shows flag + company name. Seller = green tint, buyer = blue tint.      */

type PartyRole = "seller" | "buyer" | "bank" | "inspector";

const PARTY_CLS: Record<PartyRole, string> = {
  seller:    "bg-emerald-50 text-emerald-800 border-emerald-200",
  buyer:     "bg-blue-50 text-blue-800 border-blue-200",
  bank:      "bg-amber-50 text-amber-800 border-amber-200",
  inspector: "bg-purple-50 text-purple-800 border-purple-200",
};

export function PartyBadge({ flag, company, role, size = "sm" }: {
  flag: string;
  company: string;
  role: PartyRole;
  size?: "xs" | "sm";
}) {
  return (
    <span className={cn(
      "inline-flex items-center gap-1 rounded-full border font-medium whitespace-nowrap",
      size === "xs" ? "px-1.5 py-px text-[0.6rem]" : "px-2 py-0.5 text-[0.6875rem]",
      PARTY_CLS[role],
    )}>
      <span>{flag}</span>
      <span>{company}</span>
    </span>
  );
}

/* ─── Stage stepper ───────────────────────────────────────────────────────
   5-step deal lifecycle. Compact horizontal variant for screen headers.   */

const STAGES = ["Teklif", "Sözleşme", "Muayene", "Sevkiyat", "Ödeme"] as const;

export function StageStepper({ active }: { active: number }) {
  return (
    <div className="flex items-center gap-0">
      {STAGES.map((stage, i) => {
        const done   = i < active;
        const isAct  = i === active;
        const last   = i === STAGES.length - 1;
        return (
          <div key={stage} className="flex items-center">
            <div className="flex flex-col items-center gap-0.5">
              <div className={cn(
                "flex h-5 w-5 items-center justify-center rounded-full text-[0.5rem] font-bold",
                done  ? "bg-ortaq-trust text-white"                         :
                isAct ? "bg-amber-400 text-white ring-2 ring-amber-200"    :
                        "bg-ortaq-border text-ortaq-ink-soft"
              )}>
                {done ? "✓" : i + 1}
              </div>
              <span className={cn(
                "text-[0.55rem] font-medium whitespace-nowrap",
                done  ? "text-ortaq-trust"   :
                isAct ? "text-amber-700"     :
                        "text-ortaq-ink-soft"
              )}>{stage}</span>
            </div>
            {!last && (
              <div className={cn(
                "mb-[0.8rem] mx-0.5 h-px w-6",
                done ? "bg-ortaq-trust" : "bg-ortaq-border",
              )} />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ─── Window chrome ──────────────────────────────────────────────────────
   macOS-style window frame wrapping each product screen.                  */

export function WindowChrome({
  title,
  children,
  tab,
  className,
}: {
  title: string;
  children: React.ReactNode;
  tab?: string;
  className?: string;
}) {
  return (
    <div className={cn(
      "overflow-hidden rounded-xl border border-ortaq-border bg-white",
      "shadow-[0_8px_40px_rgb(20_19_16/0.10),0_1px_3px_rgb(20_19_16/0.06)]",
      className,
    )}>
      {/* Title bar */}
      <div className="flex items-center gap-2 border-b border-ortaq-border bg-[#f5f5f4] px-3 py-2">
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <div className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <div className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        </div>
        <div className="flex-1 text-center">
          <span className="text-[0.6875rem] font-medium text-ortaq-ink-soft">
            {title}
          </span>
        </div>
        {tab && (
          <span className="text-[0.5rem] font-bold uppercase tracking-[0.08em] text-ortaq-ink-soft/50">
            {tab}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

/* ─── Row ─────────────────────────────────────────────────────────────── */

export function DataRow({
  label,
  value,
  badge,
  party,
  muted,
}: {
  label: string;
  value?: string;
  badge?: React.ReactNode;
  party?: React.ReactNode;
  muted?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-3 px-3 py-2 hover:bg-ortaq-bg/30 transition-colors">
      <span className={cn(
        "text-[0.6875rem] leading-snug",
        muted ? "text-ortaq-ink-soft" : "font-medium text-ortaq-ink",
      )}>
        {label}
      </span>
      <div className="flex shrink-0 items-center gap-1.5">
        {party}
        {badge}
        {value && !badge && (
          <span className="text-[0.6875rem] text-ortaq-ink-muted">{value}</span>
        )}
      </div>
    </div>
  );
}

/* ─── Section label ─────────────────────────────────────────────────────
   Thin uppercase label above a group of rows.                             */

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-b border-ortaq-border bg-[#faf9f7] px-3 py-1">
      <span className="text-[0.5625rem] font-bold uppercase tracking-[0.08em] text-ortaq-ink-soft">
        {children}
      </span>
    </div>
  );
}

/* ─── Activity dot ──────────────────────────────────────────────────────*/

export function ActivityDot({ type }: { type: "green" | "amber" | "red" | "gray" }) {
  const cls = {
    green: "bg-emerald-500",
    amber: "bg-amber-400",
    red:   "bg-red-500",
    gray:  "bg-slate-300",
  }[type];
  return <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", cls)} />;
}

/* ─── Urgency row (for portfolio) ──────────────────────────────────────*/

export function UrgencyChip({ level }: { level: "acil" | "bekliyor" | "ilerliyor" | "yeni" }) {
  const map = {
    acil:      { label: "ACİL",      cls: "bg-red-50 text-red-700 border-red-200"       },
    bekliyor:  { label: "BEKLİYOR",  cls: "bg-amber-50 text-amber-700 border-amber-200" },
    ilerliyor: { label: "İLERLİYOR", cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    yeni:      { label: "YENİ",      cls: "bg-blue-50 text-blue-700 border-blue-200"    },
  }[level];
  return (
    <span className={cn(
      "inline-flex items-center rounded border px-1.5 py-px text-[0.5625rem] font-bold",
      map.cls,
    )}>
      {map.label}
    </span>
  );
}

/* ─── Message bubble ──────────────────────────────────────────────────── */

export function MsgBubble({
  from,
  company,
  flag,
  text,
  time,
  internal,
  align = "left",
}: {
  from: string;
  company: string;
  flag: string;
  text: string;
  time: string;
  internal?: boolean;
  align?: "left" | "right";
}) {
  return (
    <div className={cn("flex gap-2", align === "right" && "flex-row-reverse")}>
      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ortaq-border text-[0.5rem] font-bold text-ortaq-ink-soft">
        {flag}
      </div>
      <div className={cn("max-w-[80%]", internal && "border-l-2 border-amber-400 pl-2")}>
        <div className="mb-0.5 flex items-center gap-1.5">
          <span className="text-[0.5625rem] font-semibold text-ortaq-ink">{company}</span>
          <span className="text-[0.5rem] text-ortaq-ink-soft">·</span>
          <span className="text-[0.5rem] text-ortaq-ink-soft">{from}</span>
          {internal && (
            <span className="rounded-full bg-amber-100 px-1.5 py-px text-[0.5rem] font-bold text-amber-700">
              Yalnızca biz
            </span>
          )}
        </div>
        <div className={cn(
          "rounded-xl px-3 py-2 text-[0.6875rem] leading-snug",
          internal
            ? "bg-amber-50 text-amber-900"
            : align === "right"
              ? "bg-ortaq-trust text-white"
              : "bg-[#f5f5f4] text-ortaq-ink",
        )}>
          {text}
        </div>
        <span className="mt-0.5 block text-[0.5rem] text-ortaq-ink-soft">{time}</span>
      </div>
    </div>
  );
}

/* ─── Audit event ─────────────────────────────────────────────────────── */

export function AuditEvent({
  time,
  company,
  flag,
  actor,
  role,
  action,
  type,
}: {
  time: string;
  company: string;
  flag: string;
  actor: string;
  role: string;
  action: string;
  type: "upload" | "approve" | "pending" | "reject" | "access";
}) {
  const dotCls = {
    upload:  "bg-blue-400",
    approve: "bg-emerald-500",
    pending: "bg-amber-400",
    reject:  "bg-red-500",
    access:  "bg-slate-300",
  }[type];

  const lineCls = {
    upload:  "border-blue-200",
    approve: "border-emerald-200",
    pending: "border-amber-200",
    reject:  "border-red-200",
    access:  "border-slate-100",
  }[type];

  return (
    <div className="flex gap-3">
      {/* Timeline spine */}
      <div className="flex flex-col items-center">
        <div className={cn("h-2.5 w-2.5 rounded-full shrink-0 mt-0.5", dotCls)} />
        <div className={cn("mt-0.5 flex-1 border-l", lineCls)} />
      </div>
      {/* Content */}
      <div className="pb-3 flex-1">
        <div className="flex items-baseline gap-1.5 flex-wrap">
          <span className="text-[0.5rem] font-mono text-ortaq-ink-soft">{time}</span>
          <span className="text-[0.5rem]">{flag}</span>
          <span className="text-[0.6rem] font-semibold text-ortaq-ink">{company}</span>
          <span className="text-[0.5625rem] text-ortaq-ink-soft">·</span>
          <span className="text-[0.5625rem] text-ortaq-ink-soft">{actor}</span>
          <span className="text-[0.5rem] text-ortaq-ink-soft">({role})</span>
        </div>
        <p className="text-[0.6875rem] text-ortaq-ink leading-snug">{action}</p>
      </div>
    </div>
  );
}
