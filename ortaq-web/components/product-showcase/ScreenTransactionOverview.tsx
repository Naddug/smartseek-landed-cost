"use client";

import { cn } from "@/lib/cn";
import {
  WindowChrome, StatusBadge, SectionLabel, MsgBubble,
} from "./shared";

/* ─── Steel deal — Çelik Tedariki ─────────────────────────────────────── */

export function ScreenTransactionOverview() {
  return (
    <WindowChrome title="ORTAQ · Çelik Tedariki — SPA-2024-047" tab="İşlem Özeti">
      <div className="flex divide-x divide-ortaq-border" style={{ minHeight: 480 }}>

        {/* ── LEFT SIDEBAR ── Stage + Parties ──────────────────────────── */}
        <div className="flex w-[220px] shrink-0 flex-col divide-y divide-ortaq-border bg-[#faf9f7]">

          {/* Deal identity */}
          <div className="px-3 py-3">
            <p className="text-[0.625rem] font-bold uppercase tracking-[0.07em] text-ortaq-ink-soft">
              SPA-2024-047
            </p>
            <h3 className="mt-0.5 text-[0.875rem] font-bold text-ortaq-ink leading-tight">
              Çelik Tedariki
            </h3>
            <p className="text-[0.75rem] font-semibold text-ortaq-trust">€ 840.000</p>
            <div className="mt-1.5">
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[0.5625rem] font-bold text-amber-700">
                Muayene aşamasında
              </span>
            </div>
          </div>

          {/* Stage stepper (vertical) */}
          <div className="px-3 py-3">
            <p className="mb-2 text-[0.5625rem] font-bold uppercase tracking-[0.07em] text-ortaq-ink-soft">Aşama</p>
            {[
              { label: "Teklif",    state: "done",    date: "1 Haz." },
              { label: "Sözleşme", state: "done",    date: "5 Haz." },
              { label: "Muayene",  state: "active",  date: "15 Haz. bekleniyor" },
              { label: "Sevkiyat", state: "future",  date: "" },
              { label: "Ödeme",    state: "future",  date: "" },
            ].map((s, i) => (
              <div key={s.label} className="flex items-start gap-2">
                <div className="flex flex-col items-center">
                  <div className={cn(
                    "flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[0.45rem] font-bold",
                    s.state === "done"   ? "bg-ortaq-trust text-white"         :
                    s.state === "active" ? "bg-amber-400 text-white ring-2 ring-amber-100" :
                                          "bg-ortaq-border text-ortaq-ink-soft"
                  )}>
                    {s.state === "done" ? "✓" : i + 1}
                  </div>
                  {i < 4 && <div className={cn("h-5 w-px", s.state === "done" ? "bg-ortaq-trust/30" : "bg-ortaq-border")} />}
                </div>
                <div className="pb-1">
                  <p className={cn(
                    "text-[0.625rem] font-semibold leading-tight",
                    s.state === "done"   ? "text-ortaq-trust"   :
                    s.state === "active" ? "text-amber-700"     :
                                          "text-ortaq-ink-soft"
                  )}>{s.label}</p>
                  {s.date && (
                    <p className="text-[0.5rem] text-ortaq-ink-soft">{s.date}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Parties */}
          <div className="px-3 py-3">
            <p className="mb-2 text-[0.5625rem] font-bold uppercase tracking-[0.07em] text-ortaq-ink-soft">Taraflar</p>
            {[
              { flag: "🇹🇷", company: "Kartal Çelik", role: "Satıcı", contact: "A. Yılmaz · Müdür", last: "2 dk önce", color: "emerald" },
              { flag: "🇩🇪", company: "Hamburg Steel", role: "Alıcı", contact: "K. Müller · Procurement", last: "1 sa önce", color: "blue" },
            ].map(p => (
              <div key={p.company} className={cn(
                "mb-2 rounded-lg border p-2",
                p.color === "emerald" ? "border-emerald-200 bg-emerald-50/50" : "border-blue-200 bg-blue-50/50",
              )}>
                <div className="flex items-center gap-1">
                  <span className="text-sm">{p.flag}</span>
                  <span className="text-[0.6rem] font-bold text-ortaq-ink">{p.company}</span>
                  <span className={cn(
                    "ml-auto rounded-full px-1 py-px text-[0.45rem] font-bold",
                    p.color === "emerald" ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700",
                  )}>{p.role}</span>
                </div>
                <p className="mt-0.5 text-[0.5625rem] text-ortaq-ink-soft">{p.contact}</p>
                <p className="text-[0.5rem] text-ortaq-ink-soft/70">Son görülme: {p.last}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── MAIN PANE ─────────────────────────────────────────────────── */}
        <div className="flex-1 overflow-auto">

          {/* Next action — most prominent item */}
          <div className="border-b border-ortaq-border bg-amber-50 px-4 py-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[0.5625rem] font-bold uppercase tracking-[0.07em] text-amber-600">
                  Sıradaki Adım
                </p>
                <p className="mt-0.5 text-[0.875rem] font-bold text-ortaq-ink leading-tight">
                  SGS raporu onayı
                </p>
                <p className="text-[0.6875rem] text-ortaq-ink-muted">
                  Hamburg Steel sorumlu · Deadline: 15 Haziran
                </p>
              </div>
              <button className="shrink-0 rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-[0.6875rem] font-semibold text-amber-700 hover:bg-amber-50 transition-colors">
                Hatırlatıcı Gönder
              </button>
            </div>
          </div>

          {/* Progress bar */}
          <div className="border-b border-ortaq-border px-4 py-2.5">
            <div className="flex items-center gap-3">
              <div className="flex-1 h-1.5 overflow-hidden rounded-full bg-ortaq-border">
                <div className="h-full w-[78%] rounded-full bg-ortaq-trust transition-all" />
              </div>
              <span className="text-[0.625rem] font-bold text-ortaq-trust shrink-0">78%</span>
              <span className="text-[0.5625rem] text-ortaq-ink-soft shrink-0">tamamlandı</span>
            </div>
          </div>

          {/* Documents grid */}
          <SectionLabel>Belgeler</SectionLabel>
          <div className="divide-y divide-ortaq-border/50">
            {[
              { doc: "SPA",        ver: "v12", status: "confirmed" as const, label: "Onaylandı",          party: "İki taraf",             due: "—"           },
              { doc: "SGS Raporu", ver: "v1",  status: "pending"   as const, label: "Hamburg Steel onayı bekleniyor", party: "Alıcı sorumlu", due: "15 Haz."  },
              { doc: "BL Taslak",  ver: "v2",  status: "pending"   as const, label: "İncelemede",         party: "Kartal Çelik",          due: "16 Haz."     },
              { doc: "LC",         ver: "—",   status: "pending"   as const, label: "Hazırlanıyor",        party: "HSBC Dubai",            due: "14 Haz."     },
              { doc: "Packing List",ver:"v3",  status: "confirmed" as const, label: "Onaylandı",          party: "İki taraf",             due: "—"           },
            ].map(row => (
              <div key={row.doc} className="flex items-center gap-3 px-4 py-2.5 hover:bg-ortaq-bg/30 transition-colors group cursor-pointer">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[0.6875rem] font-semibold text-ortaq-ink">{row.doc}</span>
                    <span className="rounded bg-ortaq-border/50 px-1 py-px text-[0.5rem] font-mono text-ortaq-ink-soft">{row.ver}</span>
                  </div>
                  <p className="text-[0.5625rem] text-ortaq-ink-soft">{row.party}</p>
                </div>
                <StatusBadge type={row.status} label={row.label} size="xs" />
                <span className="min-w-[3rem] text-right text-[0.5625rem] text-ortaq-ink-soft">{row.due}</span>
                <span className="text-[0.5rem] text-ortaq-ink-soft/0 group-hover:text-ortaq-ink-soft/50 transition-opacity">→</span>
              </div>
            ))}
          </div>

          {/* Recent messages */}
          <SectionLabel>Son Mesajlar</SectionLabel>
          <div className="space-y-3 px-4 py-3">
            <MsgBubble
              flag="🇩🇪"
              company="Hamburg Steel"
              from="K. Müller · Procurement"
              text="SGS muayene randevusunu onaylıyoruz. Rapor hazır olduğunda bizim onayımıza sunulsun."
              time="Bugün 09:15"
            />
            <MsgBubble
              flag="🇹🇷"
              company="Kartal Çelik"
              from="A. Yılmaz · Satış"
              text="TÜV SÜD Thailand randevusu alındı. 15 Haziran saat 10:00."
              time="Dün 16:42"
              align="right"
            />
            <MsgBubble
              flag="🇹🇷"
              company="Kartal Çelik"
              from="M. Kaya · Dış Ticaret"
              text="BL taslak v2 yüklendi. Alıcı incelemesini bekliyor."
              time="Dün 14:20"
              align="right"
              internal
            />
          </div>
        </div>
      </div>
    </WindowChrome>
  );
}
