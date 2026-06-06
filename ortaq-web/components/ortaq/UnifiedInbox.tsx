"use client";

import { cn } from "@/lib/cn";

/**
 * The hero visual — shows a realistic ORTAQ workspace.
 *
 * Three panels:
 *   LEFT  — Deal sidebar (company-level scope, multiple deals)
 *   CENTER — Unified activity feed (WhatsApp + Email + Docs + Approvals)
 *   RIGHT  — Deal context (parties, status, pending actions)
 *
 * Each feed item has a clearly distinct visual identity by source:
 *   WhatsApp → green bubble, WA badge
 *   Email    → envelope icon, white card
 *   Document → file icon, version tag
 *   Approval → colored status badge
 *   Task     → checkbox icon, deadline chip
 *
 * Design: Linear/Slack/Notion density. No ERP aesthetics.
 */

type FeedItem =
  | { type: "whatsapp"; sender: string; text: string; time: string; incoming?: boolean }
  | { type: "email"; from: string; subject: string; preview: string; time: string; hasAttachment?: boolean }
  | { type: "document"; name: string; version: string; uploader: string; time: string; status?: "signed" | "draft" | "revised" }
  | { type: "approval"; request: string; requestedBy: string; status: "approved" | "pending" | "rejected"; approver?: string; time: string }
  | { type: "task"; title: string; assignee: string; deadline: string; time: string }
  | { type: "note"; author: string; text: string; time: string };

const FEED: FeedItem[] = [
  {
    type: "whatsapp",
    sender: "Selim K. (BestBuild)",
    text: "Fiyatı inceledim, €1.260/MT CIF Rotterdam kabul edilebilir. Sözleşme taslağı ne zaman hazır?",
    time: "09:14",
    incoming: true,
  },
  {
    type: "task",
    title: "Sözleşme taslağını hazırla ve gönder",
    assignee: "Yılmaz Ç.",
    deadline: "Yarın",
    time: "09:15",
  },
  {
    type: "email",
    from: "selim@bestbuild.de",
    subject: "Re: Steel Supply Q2 — Contract Draft",
    preview: "Please find attached the revised clause 4.2 regarding payment terms…",
    time: "10:33",
    hasAttachment: true,
  },
  {
    type: "document",
    name: "SteelSupply_Contract_v2.pdf",
    version: "v2",
    uploader: "Selim K.",
    time: "10:35",
    status: "revised",
  },
  {
    type: "approval",
    request: "Ödeme koşullarını onayla — Net 30, LC at sight",
    requestedBy: "Yılmaz Ç.",
    status: "approved",
    approver: "Mehmet K. (Finans)",
    time: "11:20",
  },
  {
    type: "whatsapp",
    sender: "Yılmaz Ç.",
    text: "Finans onayı geldi. Madde 4.2 revizyonuna bakıyorum, bugün cevaplayacağım.",
    time: "11:45",
    incoming: false,
  },
  {
    type: "document",
    name: "SteelSupply_Contract_v3_FINAL.pdf",
    version: "v3 — İmzalı",
    uploader: "Yılmaz Ç.",
    time: "14:02",
    status: "signed",
  },
  {
    type: "approval",
    request: "SGS muayene tarihini onayla — 20 Haziran",
    requestedBy: "Yılmaz Ç.",
    status: "pending",
    time: "14:10",
  },
];

const DEALS = [
  { name: "Çelik Tedariki", counterparty: "BestBuild GmbH", pct: 78, active: true, stage: "Sözleşme" },
  { name: "Kahve İhracatı", counterparty: "Dubai Trading", pct: 45, active: false, stage: "İnceleme" },
  { name: "Pamuklu Kumaş", counterparty: "Jakarta Mills", pct: 30, active: false, stage: "Teklif" },
];

export function UnifiedInbox() {
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-ortaq-border bg-white shadow-[0_8px_48px_rgb(20_19_16/0.13),0_0_0_1px_rgb(20_19_16/0.04)]">

      {/* Window chrome */}
      <div className="flex items-center gap-2 border-b border-ortaq-border bg-[#fafaf9] px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <div className="mx-3 flex-1 rounded border border-ortaq-border bg-white px-3 py-0.5 text-[0.6rem] font-mono text-ortaq-ink-soft">
          app.ortaq.biz / Yılmaz Çelik A.Ş.
        </div>
        <span className="hidden text-[0.5rem] font-semibold text-ortaq-ink-soft sm:inline">
          3 aktif anlaşma
        </span>
      </div>

      {/* Three-panel layout */}
      <div className="grid grid-cols-1 sm:grid-cols-[168px_1fr_156px]">

        {/* ── LEFT: Deal sidebar ─────────────────────────────────── */}
        <div className="hidden border-r border-ortaq-border sm:block">
          <div className="border-b border-ortaq-border px-3 py-2.5">
            <p className="text-[0.5rem] font-bold uppercase tracking-[0.1em] text-ortaq-ink-soft">
              Anlaşmalar
            </p>
          </div>
          <div>
            {DEALS.map((d) => (
              <div
                key={d.name}
                className={cn(
                  "cursor-default border-l-2 px-3 py-3",
                  d.active
                    ? "border-ortaq-trust bg-ortaq-trust/5"
                    : "border-transparent hover:bg-ortaq-bg/60",
                )}
              >
                <p className={cn("text-[0.5625rem] font-semibold leading-tight", d.active ? "text-ortaq-ink" : "text-ortaq-ink-muted")}>
                  {d.name}
                </p>
                <p className="mt-0.5 text-[0.4375rem] text-ortaq-ink-soft">{d.counterparty}</p>
                <div className="mt-1.5 flex items-center gap-1.5">
                  <div className="h-1 flex-1 overflow-hidden rounded-full bg-ortaq-border">
                    <div
                      className={cn("h-full rounded-full", d.active ? "bg-ortaq-trust" : "bg-ortaq-border-strong")}
                      style={{ width: `${d.pct}%` }}
                    />
                  </div>
                  <span className={cn("text-[0.4375rem] font-bold tabular-nums", d.active ? "text-ortaq-trust" : "text-ortaq-ink-soft")}>
                    {d.pct}%
                  </span>
                </div>
                <span className="mt-1 inline-block rounded bg-ortaq-bg border border-ortaq-border px-1 py-0.5 text-[0.375rem] font-medium text-ortaq-ink-soft">
                  {d.stage}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── CENTER: Unified feed ───────────────────────────────── */}
        <div className="flex min-h-[420px] flex-col border-r border-ortaq-border">
          {/* Feed header */}
          <div className="flex items-center justify-between border-b border-ortaq-border px-4 py-2.5">
            <div>
              <p className="text-[0.625rem] font-bold text-ortaq-ink">Çelik Tedariki — BestBuild GmbH</p>
              <div className="mt-0.5 flex items-center gap-2 text-[0.4375rem] text-ortaq-ink-soft">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                <span>Sözleşme aşaması</span>
                <span className="text-ortaq-border">·</span>
                <span className="font-semibold tabular-nums text-ortaq-ink">€840.000</span>
                <span className="text-ortaq-border">·</span>
                <span>30 Haz. kapanış</span>
              </div>
            </div>
            {/* Source legend */}
            <div className="hidden items-center gap-2 lg:flex">
              {[
                { label: "WA", bg: "bg-[#25D366]", text: "text-white" },
                { label: "Mail", bg: "bg-blue-100", text: "text-blue-700" },
                { label: "Belge", bg: "bg-ortaq-bg", text: "text-ortaq-ink-soft" },
              ].map((s) => (
                <span key={s.label} className={cn("rounded px-1 py-0.5 text-[0.375rem] font-bold", s.bg, s.text)}>
                  {s.label}
                </span>
              ))}
            </div>
          </div>

          {/* Feed items */}
          <div className="flex-1 overflow-y-auto px-3 py-3">
            <div className="space-y-2.5">
              {FEED.map((item, i) => (
                <FeedRow key={i} item={item} />
              ))}
            </div>
          </div>

          {/* Compose bar */}
          <div className="border-t border-ortaq-border px-3 py-2.5">
            <div className="flex items-center gap-2 rounded-lg border border-ortaq-border bg-ortaq-bg px-3 py-2">
              <span className="text-[0.5625rem] text-ortaq-ink-soft">Bu anlaşmaya bir not veya mesaj ekle…</span>
            </div>
          </div>
        </div>

        {/* ── RIGHT: Deal context ────────────────────────────────── */}
        <div className="hidden bg-[#fafaf9] sm:block">
          <div className="border-b border-ortaq-border px-3 py-2.5">
            <p className="text-[0.5rem] font-bold uppercase tracking-[0.1em] text-ortaq-ink-soft">Anlaşma Durumu</p>
          </div>
          <div className="px-3 py-3 space-y-3">
            {/* Progress */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[0.4375rem] font-semibold uppercase text-ortaq-ink-soft">İlerleme</span>
                <span className="text-[0.5625rem] font-bold text-ortaq-trust tabular-nums">78%</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-ortaq-border">
                <div className="h-full w-[78%] rounded-full bg-ortaq-trust" />
              </div>
            </div>

            {/* Parties */}
            <div>
              <p className="mb-1.5 text-[0.4375rem] font-semibold uppercase text-ortaq-ink-soft">Taraflar</p>
              <div className="space-y-1">
                {[
                  { initials: "YÇ", name: "Yılmaz Çelik A.Ş.", role: "Satıcı", color: "green" },
                  { initials: "BG", name: "BestBuild GmbH", role: "Alıcı", color: "blue" },
                ].map((p) => (
                  <div key={p.initials} className="flex items-center gap-1.5">
                    <span className={cn(
                      "inline-flex h-4 w-4 items-center justify-center rounded-full text-[0.375rem] font-bold",
                      p.color === "green" ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"
                    )}>
                      {p.initials}
                    </span>
                    <div>
                      <p className="text-[0.4375rem] font-semibold text-ortaq-ink leading-none">{p.name}</p>
                      <p className="text-[0.375rem] text-ortaq-ink-soft">{p.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pending */}
            <div>
              <p className="mb-1.5 text-[0.4375rem] font-semibold uppercase text-ortaq-ink-soft">Bekleyen</p>
              <div className="space-y-1">
                <div className="flex items-start gap-1.5 rounded border border-ortaq-trust/20 bg-ortaq-trust/5 p-1.5">
                  <span className="h-1.5 w-1.5 mt-0.5 shrink-0 rounded-full bg-ortaq-trust" />
                  <p className="text-[0.4375rem] leading-snug text-ortaq-ink">SGS muayene onayı — siz</p>
                </div>
                <div className="flex items-start gap-1.5 rounded border border-ortaq-border bg-ortaq-bg p-1.5">
                  <span className="h-1.5 w-1.5 mt-0.5 shrink-0 rounded-full bg-ortaq-border-strong" />
                  <p className="text-[0.4375rem] leading-snug text-ortaq-ink-muted">Yük planı — BestBuild</p>
                </div>
              </div>
            </div>

            {/* Confirmed */}
            <div>
              <p className="mb-1.5 text-[0.4375rem] font-semibold uppercase text-ortaq-ink-soft">Onaylı</p>
              <div className="space-y-0.5">
                {["Fiyat: €1.260/MT CIF", "500 MT miktar", "Ödeme koşulları", "Sözleşme (v3)"].map((c) => (
                  <div key={c} className="flex items-center gap-1">
                    <svg className="h-2.5 w-2.5 shrink-0 text-ortaq-trust" fill="none" viewBox="0 0 10 10" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2 5l2 2 4-4" />
                    </svg>
                    <p className="text-[0.4375rem] text-ortaq-ink-muted">{c}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeedRow({ item }: { item: FeedItem }) {
  if (item.type === "whatsapp") {
    const isIncoming = item.incoming !== false;
    return (
      <div className={cn("flex gap-2", isIncoming ? "flex-row" : "flex-row-reverse")}>
        <div className={cn(
          "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[0.375rem] font-bold",
          isIncoming ? "bg-[#25D366]/15 text-[#128C7E]" : "bg-ortaq-trust/15 text-ortaq-trust"
        )}>
          WA
        </div>
        <div className={cn("max-w-[80%]", isIncoming ? "" : "")}>
          <div className={cn(
            "rounded-xl px-2.5 py-1.5 text-[0.5625rem] leading-snug",
            isIncoming
              ? "rounded-tl-none bg-[#dcf8c6] text-[#1a1a1a]"
              : "rounded-tr-none bg-ortaq-ink text-ortaq-cream",
          )}>
            {item.text}
          </div>
          <p className={cn("mt-0.5 text-[0.4rem] text-ortaq-ink-soft", isIncoming ? "" : "text-right")}>
            {item.sender} · {item.time}
          </p>
        </div>
      </div>
    );
  }

  if (item.type === "email") {
    return (
      <div className="rounded-lg border border-blue-100 bg-blue-50/60 px-3 py-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <svg className="h-3 w-3 shrink-0 text-blue-500" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth={1.5}>
              <rect x="1" y="2.5" width="10" height="7" rx="1" />
              <path strokeLinecap="round" d="M1 4l5 3 5-3" />
            </svg>
            <p className="text-[0.5rem] font-bold text-blue-700">{item.from}</p>
          </div>
          <span className="shrink-0 text-[0.4rem] text-ortaq-ink-soft">{item.time}</span>
        </div>
        <p className="mt-1 text-[0.5625rem] font-semibold text-ortaq-ink leading-tight">{item.subject}</p>
        <p className="mt-0.5 text-[0.5rem] text-ortaq-ink-soft leading-snug">{item.preview}</p>
        {item.hasAttachment && (
          <div className="mt-1.5 flex items-center gap-1 rounded border border-blue-200 bg-white px-1.5 py-0.5 w-fit">
            <svg className="h-2.5 w-2.5 text-blue-500" fill="none" viewBox="0 0 10 10" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" d="M2 3h4l2 2v4H2V3z" />
              <path strokeLinecap="round" d="M6 3V5h2" />
            </svg>
            <span className="text-[0.4375rem] font-medium text-blue-700">Ek var</span>
          </div>
        )}
      </div>
    );
  }

  if (item.type === "document") {
    const statusStyle = {
      signed:  { bg: "bg-emerald-50 border-emerald-200", badge: "bg-emerald-100 text-emerald-700", label: "İmzalı" },
      draft:   { bg: "bg-ortaq-bg border-ortaq-border",  badge: "bg-ortaq-bg text-ortaq-ink-soft", label: "Taslak" },
      revised: { bg: "bg-amber-50 border-amber-200",     badge: "bg-amber-100 text-amber-700",     label: "Revize" },
    }[item.status ?? "draft"];

    return (
      <div className={cn("flex items-center gap-2.5 rounded-lg border px-3 py-2", statusStyle.bg)}>
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-white border border-ortaq-border/60">
          <svg className="h-3.5 w-3.5 text-ortaq-ink-muted" fill="none" viewBox="0 0 14 14" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 2h6l3 3v7H3V2z" />
            <path strokeLinecap="round" d="M9 2v3h3" />
            <path strokeLinecap="round" d="M5 7h4M5 9h2" />
          </svg>
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[0.5625rem] font-semibold text-ortaq-ink">{item.name}</p>
          <p className="text-[0.4375rem] text-ortaq-ink-soft">{item.uploader} · {item.time}</p>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <span className={cn("rounded px-1.5 py-0.5 text-[0.4375rem] font-bold", statusStyle.badge)}>
            {statusStyle.label}
          </span>
          <span className="rounded bg-white border border-ortaq-border px-1 py-0.5 text-[0.4375rem] font-mono text-ortaq-ink-soft">
            {item.version}
          </span>
        </div>
      </div>
    );
  }

  if (item.type === "approval") {
    const st = {
      approved: { bg: "bg-emerald-50 border-emerald-200", badge: "bg-emerald-100 text-emerald-700", icon: "✓", label: "Onaylandı" },
      pending:  { bg: "bg-amber-50 border-amber-200",     badge: "bg-amber-100 text-amber-700",     icon: "⏳", label: "Bekliyor" },
      rejected: { bg: "bg-red-50 border-red-200",         badge: "bg-red-100 text-red-700",         icon: "✕", label: "Reddedildi" },
    }[item.status];

    return (
      <div className={cn("rounded-lg border px-3 py-2.5", st.bg)}>
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span className="text-[0.625rem]">📋</span>
            <p className="text-[0.5rem] font-bold uppercase tracking-[0.05em] text-ortaq-ink-soft">Onay Talebi</p>
          </div>
          <span className={cn("shrink-0 rounded-full px-1.5 py-0.5 text-[0.4375rem] font-bold", st.badge)}>
            {st.icon} {st.label}
          </span>
        </div>
        <p className="mt-1 text-[0.5625rem] font-semibold leading-snug text-ortaq-ink">{item.request}</p>
        <p className="mt-0.5 text-[0.4375rem] text-ortaq-ink-soft">
          {item.requestedBy} tarafından talep edildi
          {item.approver && ` · ${item.approver} tarafından onaylandı`}
          {" · "}{item.time}
        </p>
      </div>
    );
  }

  if (item.type === "task") {
    return (
      <div className="flex items-center gap-2.5 rounded-lg border border-ortaq-trust/20 bg-ortaq-trust/5 px-3 py-2">
        <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded border-2 border-ortaq-trust/40 bg-white">
          <span className="h-1.5 w-1.5 rounded-sm bg-ortaq-trust/30" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[0.5625rem] font-semibold text-ortaq-ink">{item.title}</p>
          <p className="text-[0.4375rem] text-ortaq-ink-soft">{item.assignee} · {item.time}</p>
        </div>
        <span className="shrink-0 rounded-full bg-amber-50 border border-amber-200 px-1.5 py-0.5 text-[0.4375rem] font-semibold text-amber-700">
          {item.deadline}
        </span>
      </div>
    );
  }

  return null;
}
