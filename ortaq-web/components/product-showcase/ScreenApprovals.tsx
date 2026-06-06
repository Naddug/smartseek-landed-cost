"use client";

import { cn } from "@/lib/cn";
import { WindowChrome, StatusBadge } from "./shared";

/* ─── Food deal — Fındık İhracatı ─────────────────────────────────────── */

const APPROVALS = [
  {
    id: "sgs",
    doc: "SGS Raporu",
    ver: "v1",
    from: "Giresun Tarım",
    fromFlag: "🇹🇷",
    to: "Ferrero Trading",
    toFlag: "🇱🇺",
    sent: "12 Haz. 09:00",
    deadline: "15 Haz. EOD",
    hoursLeft: 47,
    status: "pending" as const,
    urgent: true,
  },
  {
    id: "packing",
    doc: "Packing List",
    ver: "v3",
    from: "Giresun Tarım",
    fromFlag: "🇹🇷",
    to: "Sevk Departmanı",
    toFlag: "🇹🇷",
    sent: "11 Haz. 11:00",
    deadline: "13 Haz. 17:00",
    hoursLeft: 0,
    status: "confirmed" as const,
    urgent: false,
  },
  {
    id: "bl",
    doc: "BL Taslak",
    ver: "v1",
    from: "Giresun Tarım",
    fromFlag: "🇹🇷",
    to: "Armatör",
    toFlag: "🌐",
    sent: "11 Haz. 14:00",
    deadline: "16 Haz. EOD",
    hoursLeft: 120,
    status: "blocked" as const,
    urgent: false,
    revisionNote: "BL'de konteynır numaraları eksik. Düzeltilmesi gerekiyor.",
  },
];

export function ScreenApprovals() {

  return (
    <WindowChrome title="ORTAQ · Fındık İhracatı — AGR-2024-071 · Onaylar" tab="Onaylar">
      <div className="flex divide-x divide-ortaq-border" style={{ minHeight: 480 }}>

        {/* ── LEFT — Approval Queue ────────────────────────────────────── */}
        <div className="flex w-[220px] shrink-0 flex-col divide-y divide-ortaq-border bg-[#faf9f7]">

          {/* Filter tabs */}
          <div className="flex divide-x divide-ortaq-border">
            {["Benden Bekleniyor", "Bekletilenler", "Tümü"].map((tab, i) => (
              <button key={tab} className={cn(
                "flex-1 py-2 text-[0.5rem] font-bold",
                i === 1 ? "bg-white text-ortaq-trust" : "text-ortaq-ink-soft hover:text-ortaq-ink",
              )}>
                {tab}
              </button>
            ))}
          </div>

          {/* Queue items */}
          {APPROVALS.map(ap => (
            <div key={ap.id} className={cn(
              "cursor-pointer border-l-2 px-3 py-3 transition-colors hover:bg-white",
              ap.id === "sgs"
                ? "border-l-amber-400 bg-white"
                : ap.status === "confirmed"
                  ? "border-l-emerald-400"
                  : ap.status === "blocked"
                    ? "border-l-orange-400"
                    : "border-l-transparent",
            )}>
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-[0.6875rem] font-semibold text-ortaq-ink leading-tight truncate">
                    {ap.doc} <span className="font-mono text-[0.5625rem]">{ap.ver}</span>
                  </p>
                  <p className="mt-0.5 text-[0.5rem] text-ortaq-ink-soft">
                    {ap.fromFlag} → {ap.toFlag} {ap.to}
                  </p>
                </div>
                <StatusBadge
                  type={ap.status === "blocked" ? "blocked" : ap.status === "confirmed" ? "confirmed" : "pending"}
                  label={ap.status === "confirmed" ? "Onaylandı" : ap.status === "blocked" ? "Revizyon" : "Bekliyor"}
                  size="xs"
                />
              </div>
              {ap.status === "pending" && (
                <div className={cn(
                  "mt-1.5 flex items-center gap-1.5 rounded px-1.5 py-1",
                  ap.hoursLeft < 48 ? "bg-red-50" : "bg-amber-50",
                )}>
                  <span className={cn(
                    "h-1.5 w-1.5 rounded-full shrink-0",
                    ap.hoursLeft < 48 ? "bg-red-500 animate-pulse" : "bg-amber-400",
                  )} />
                  <span className={cn(
                    "text-[0.5rem] font-bold",
                    ap.hoursLeft < 48 ? "text-red-700" : "text-amber-700",
                  )}>
                    {ap.hoursLeft < 48 ? `${ap.hoursLeft} saat kaldı` : ap.deadline}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* ── MAIN — Approval Detail ───────────────────────────────────── */}
        <div className="flex flex-1 flex-col">

          {/* Approval request header */}
          <div className="border-b border-ortaq-border bg-white px-5 py-3.5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[0.5625rem] font-bold uppercase tracking-[0.07em] text-ortaq-ink-soft">
                  Onay Talebi
                </p>
                <h3 className="mt-0.5 text-[0.9375rem] font-bold text-ortaq-ink">
                  SGS Raporu <span className="font-mono text-[0.75rem] font-normal">v1</span>
                </h3>
                <div className="mt-1 flex items-center gap-2 flex-wrap">
                  <span className="text-[0.5625rem] text-ortaq-ink-soft">🇹🇷 Giresun Tarım → 🇱🇺 Ferrero Trading</span>
                  <span className="text-[0.5625rem] text-ortaq-ink-soft">·</span>
                  <span className="text-[0.5625rem] text-ortaq-ink-soft">Gönderildi: 12 Haz. 09:00</span>
                  <span className="text-[0.5625rem] text-ortaq-ink-soft">·</span>
                  <span className="text-[0.5625rem] font-semibold text-red-600">Deadline: 15 Haz. EOD · 47 saat kaldı</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-[0.6rem] font-bold text-red-700">ACİL</span>
              </div>
            </div>
          </div>

          <div className="flex flex-1 divide-x divide-ortaq-border overflow-hidden">

            {/* Document preview */}
            <div className="flex-1 overflow-auto bg-[#f0efed] p-4">
              <div className="mx-auto max-w-xs rounded-lg border border-ortaq-border bg-white shadow-sm overflow-hidden">

                {/* SGS document mock */}
                <div className="bg-[#E31837] px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white">
                      <span className="text-[0.5rem] font-bold text-[#E31837]">SGS</span>
                    </div>
                    <div>
                      <p className="text-[0.5rem] font-bold uppercase tracking-[0.08em] text-white/80">
                        Inspection Report
                      </p>
                      <p className="text-[0.4375rem] text-white/60">TÜV SÜD Thailand · 15 Haziran 2024</p>
                    </div>
                  </div>
                </div>

                <div className="p-3 space-y-2">
                  {[
                    ["Referans",       "SGS-TH-2024-07831"],
                    ["Ürün",           "Fındık (Hazelnut) — 22,400 kg"],
                    ["Müşteri",        "Giresun Tarım Kooperatifi"],
                    ["Alıcı",          "Ferrero Trading SA"],
                    ["Muayene Yeri",   "Giresun İhracat Deposu"],
                    ["Muayene Tarihi", "15 Haziran 2024"],
                    ["Aflatoxin",      "< 2 ppb (Limit: 4 ppb) ✓"],
                    ["Nem Oranı",      "%5.8 (Limit: %6.5) ✓"],
                    ["Sonuç",          "UYGUN — Sevkiyata Hazır"],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between border-b border-ortaq-border/30 pb-1">
                      <span className="text-[0.5rem] font-bold uppercase text-ortaq-ink-soft/60">{k}</span>
                      <span className={cn(
                        "text-[0.5625rem] text-right max-w-[55%]",
                        v.includes("✓") ? "text-emerald-700 font-semibold" : "text-ortaq-ink",
                      )}>{v}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-ortaq-border bg-emerald-50 px-3 py-2 text-center">
                  <p className="text-[0.5625rem] font-bold text-emerald-700">
                    Bu rapor SGS onaylıdır. Belge no: SGS-TH-2024-07831
                  </p>
                </div>
              </div>
            </div>

            {/* Response history + action */}
            <div className="flex w-[200px] shrink-0 flex-col divide-y divide-ortaq-border bg-white overflow-auto">

              {/* History */}
              <div className="px-3 py-2.5">
                <p className="text-[0.5625rem] font-bold uppercase tracking-[0.07em] text-ortaq-ink-soft mb-2">
                  Yanıt Geçmişi
                </p>
                <div className="space-y-2">
                  {[
                    { event: "Gönderildi",    actor: "🇹🇷 O. Karaduman · Dış Ticaret", time: "12 Haz. 09:00", color: "blue"    },
                    { event: "Görüntülendi",  actor: "🇱🇺 M. Rossi · Procurement",      time: "12 Haz. 11:30", color: "gray"    },
                    { event: "Onay Bekleniyor", actor: "Ferrero Trading",              time: "Aktif",         color: "amber"   },
                  ].map((ev, i) => (
                    <div key={i} className="flex gap-2">
                      <div className="flex flex-col items-center">
                        <div className={cn(
                          "h-2 w-2 rounded-full shrink-0 mt-0.5",
                          ev.color === "blue"  ? "bg-blue-400"    :
                          ev.color === "amber" ? "bg-amber-400"   : "bg-slate-300",
                        )} />
                        {i < 2 && <div className="flex-1 w-px bg-ortaq-border mt-0.5" />}
                      </div>
                      <div className="pb-2 flex-1">
                        <p className="text-[0.5625rem] font-semibold text-ortaq-ink">{ev.event}</p>
                        <p className="text-[0.5rem] text-ortaq-ink-soft">{ev.actor}</p>
                        <p className="text-[0.475rem] text-ortaq-ink-soft/70">{ev.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Approval action panel — only for the approving party */}
              <div className="p-3">
                <div className="rounded-lg border border-ortaq-border bg-[#faf9f7] p-2.5">
                  <p className="text-[0.5rem] font-bold uppercase tracking-[0.07em] text-ortaq-ink-soft mb-2">
                    Ferrero Trading Kararı
                  </p>
                  <p className="text-[0.5rem] text-ortaq-ink-soft mb-3 leading-relaxed">
                    Bu onay kalıcı olarak kayıt altına alınacak.
                  </p>
                  <button className="mb-1.5 w-full rounded-lg bg-ortaq-trust py-2 text-[0.6875rem] font-bold text-white hover:bg-ortaq-trust-deep transition-colors">
                    Onayla
                  </button>
                  <button className="mb-1.5 w-full rounded-lg border border-amber-300 bg-amber-50 py-2 text-[0.6875rem] font-semibold text-amber-700 hover:bg-amber-100 transition-colors">
                    Revizyon İste
                  </button>
                  <button className="w-full rounded-lg border border-red-200 bg-red-50 py-2 text-[0.6875rem] font-semibold text-red-600 hover:bg-red-100 transition-colors">
                    Reddet
                  </button>
                  <p className="mt-2 text-[0.45rem] text-ortaq-ink-soft/60 text-center leading-relaxed">
                    Revizyon veya red için not zorunludur.
                  </p>
                </div>
              </div>

              {/* Reminder */}
              <div className="px-3 py-2.5">
                <button className="flex w-full items-center gap-1.5 rounded border border-ortaq-border px-2 py-1.5 text-[0.5625rem] text-ortaq-ink-soft hover:text-ortaq-ink hover:bg-ortaq-bg transition-colors">
                  <span>🔔</span>
                  <span>Ferrero&apos;ya hatırlatıcı gönder</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </WindowChrome>
  );
}
