"use client";

import { cn } from "@/lib/cn";

/** Static Deal Room preview card — shown in the hero right panel.
 *  Shows a generic B2B deal (not trade-specific jargon) with bilateral context. */
export function DealRoomCard() {
  return (
    <div className="relative w-full overflow-hidden rounded-ortaq-lg border border-ortaq-border bg-ortaq-surface shadow-[var(--shadow-elevated)]">
      {/* Window chrome */}
      <div className="flex items-center gap-2 border-b border-ortaq-border bg-ortaq-bg px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <div className="mx-3 flex-1 rounded bg-ortaq-surface border border-ortaq-border px-3 py-0.5 text-[0.625rem] font-mono text-ortaq-ink-soft">
          ortaq.biz/deal/room/SD-2026-0391
        </div>
      </div>

      {/* Deal header */}
      <div className="border-b border-ortaq-border bg-ortaq-surface px-5 py-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="truncate text-[0.8125rem] font-semibold text-ortaq-ink leading-tight">
              Çelik Tedarik Anlaşması — Q3 2026
            </p>
            <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
              <PartyBadge initials="YÇ" name="Yılmaz Çelik" role="Satıcı" color="trust" />
              <span className="text-[0.625rem] text-ortaq-border-strong">↔</span>
              <PartyBadge initials="BG" name="BestBuild GmbH" role="Alıcı" color="status" />
            </div>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-[0.625rem] text-ortaq-ink-soft uppercase tracking-[0.06em]">Anlaşma değeri</p>
            <p className="text-[0.9375rem] font-semibold text-ortaq-ink tabular-nums">€840,000</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <DealProgress stages={["Teklif", "Müzakere", "Sözleşme", "Yürütme", "Kapandı"]} current={1} />
        </div>
      </div>

      {/* Next Action banner */}
      <div className="border-b border-ortaq-status/20 bg-ortaq-status-soft px-5 py-2.5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-ortaq-status" />
            <p className="text-[0.75rem] font-medium text-ortaq-status leading-snug">
              BestBuild GmbH requested revision on Clause 4.2 — penalty terms
            </p>
          </div>
          <button className="shrink-0 rounded px-2.5 py-1 text-[0.6875rem] font-semibold bg-ortaq-status text-white transition-colors hover:bg-blue-700">
            İncele
          </button>
        </div>
      </div>

      {/* Activity feed */}
      <div className="px-5 py-3.5">
        <p className="mb-2.5 text-[0.625rem] font-medium uppercase tracking-[0.06em] text-ortaq-ink-soft">
          Son Aktivite
        </p>
        <div className="space-y-2.5">
          <ActivityRow
            actorInitials="BG"
            actorColor="status"
            text={<><strong>BestBuild GmbH</strong> Madde 4.2 için revizyon talep etti</>}
            time="2 saat önce"
            type="negotiation"
          />
          <ActivityRow
            actorInitials="YÇ"
            actorColor="trust"
            text={<><strong>Yılmaz Çelik</strong> Şartname v3.pdf yükledi</>}
            time="5 saat önce"
            type="document"
          />
          <ActivityRow
            actorInitials="✓"
            actorColor="neutral"
            text={<>Ödeme kilometre taşı onaylandı — %30 ön ödeme alındı</>}
            time="Dün"
            type="milestone"
          />
        </div>
      </div>

      {/* AI suggestion */}
      <div className="mx-5 mb-4 rounded-ortaq-md border border-ortaq-border bg-ortaq-bg p-3">
        <div className="flex items-start gap-2">
          <span className="mt-px text-[0.6875rem] font-bold text-ortaq-ink-soft">AI</span>
          <p className="text-[0.6875rem] leading-relaxed text-ortaq-ink-muted">
            Similar deals set Clause 4.2 penalties at 1.5%/week. Current draft uses 3%. Flag for review?
          </p>
        </div>
      </div>
    </div>
  );
}

function PartyBadge({
  initials,
  name,
  role,
  color,
}: {
  initials: string;
  name: string;
  role: string;
  color: "trust" | "status" | "neutral";
}) {
  const colorMap = {
    trust: "bg-ortaq-trust/10 text-ortaq-trust",
    status: "bg-ortaq-status-soft text-ortaq-status",
    neutral: "bg-ortaq-bg-alt text-ortaq-ink-soft",
  };
  return (
    <div className="flex items-center gap-1.5">
      <span
        className={cn(
          "flex h-5 w-5 items-center justify-center rounded-full text-[0.5rem] font-bold",
          colorMap[color],
        )}
      >
        {initials}
      </span>
      <div>
        <p className="text-[0.6875rem] font-semibold text-ortaq-ink leading-none">{name}</p>
        <p className="text-[0.5625rem] text-ortaq-ink-soft leading-none mt-0.5">{role}</p>
      </div>
    </div>
  );
}

function DealProgress({
  stages,
  current,
}: {
  stages: string[];
  current: number;
}) {
  return (
    <div>
      <div className="flex items-center">
        {stages.map((stage, i) => {
          const isDone = i < current;
          const isActive = i === current;
          const isLast = i === stages.length - 1;
          return (
            <div key={stage} className="flex flex-1 items-center">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[0.4375rem] font-bold",
                    isDone && "bg-ortaq-trust text-ortaq-cream",
                    isActive && "border-2 border-ortaq-trust bg-white",
                    !isDone && !isActive && "border border-ortaq-border bg-ortaq-bg",
                  )}
                >
                  {isDone ? (
                    <svg className="h-2 w-2" fill="none" viewBox="0 0 8 8" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M1.5 4l2 2 3-3" />
                    </svg>
                  ) : (
                    <span className={cn("h-1 w-1 rounded-full", isActive ? "bg-ortaq-trust" : "bg-ortaq-border")} />
                  )}
                </div>
                <p
                  className={cn(
                    "mt-1 text-[0.5625rem] font-medium whitespace-nowrap",
                    isActive ? "text-ortaq-trust" : isDone ? "text-ortaq-ink-muted" : "text-ortaq-ink-soft",
                  )}
                >
                  {stage}
                </p>
              </div>
              {!isLast && (
                <div className={cn("mb-4 h-[1px] flex-1 mx-0.5", isDone ? "bg-ortaq-trust" : "bg-ortaq-border")} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ActivityRow({
  actorInitials,
  actorColor,
  text,
  time,
  type,
}: {
  actorInitials: string;
  actorColor: "trust" | "status" | "neutral";
  text: React.ReactNode;
  time: string;
  type: "negotiation" | "document" | "milestone";
}) {
  const colorMap = {
    trust: "bg-ortaq-trust/10 text-ortaq-trust",
    status: "bg-ortaq-status-soft text-ortaq-status",
    neutral: "bg-ortaq-bg-alt text-ortaq-ink-soft",
  };
  const typeColors = {
    negotiation: "text-amber-600",
    document: "text-ortaq-ink-soft",
    milestone: "text-ortaq-trust",
  };
  return (
    <div className="flex items-start gap-2.5">
      <span
        className={cn(
          "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[0.5rem] font-bold",
          colorMap[actorColor],
        )}
      >
        {actorInitials}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[0.6875rem] leading-snug text-ortaq-ink-muted">{text}</p>
        <p className={cn("mt-0.5 text-[0.5625rem]", typeColors[type])}>{time}</p>
      </div>
    </div>
  );
}
