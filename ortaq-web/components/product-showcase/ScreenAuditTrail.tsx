"use client";

import { cn } from "@/lib/cn";
import { WindowChrome, AuditEvent } from "./shared";

/* ─── Chemicals deal — Polipropilen Granül ─────────────────────────────── */

const EVENTS = [
  { time: "5 Haz. 10:00 (UTC+3)", company: "TÜV SÜD", flag: "🌐", actor: "Muayene Ekibi", role: "SGS", action: "Muayene tamamlandı. SGS_TUV_PP_v2.pdf raporu yüklendi.", type: "upload" as const },
  { time: "4 Haz. 16:20 (UTC+2)", company: "BASF Polymers", flag: "🇩🇪", actor: "L. Wagner", role: "Procurement", action: "SPA v2 onaylandı. Sözleşme imzalandı.", type: "approve" as const },
  { time: "4 Haz. 09:45 (UTC+3)", company: "Petkim",  flag: "🇹🇷", actor: "C. Arslan", role: "Dış Ticaret", action: "SPA v2 yüklendi. Madde 7 revizyon talebi doğrultusunda güncellendi.", type: "upload" as const },
  { time: "3 Haz. 11:00 (UTC+2)", company: "BASF Polymers", flag: "🇩🇪", actor: "L. Wagner", role: "Procurement", action: "SPA v1 incelendi. 'Madde 7 revizyon gerekiyor — teslim şartı belirsiz.' notu eklendi.", type: "pending" as const },
  { time: "2 Haz. 14:30 (UTC+2)", company: "BASF Polymers", flag: "🇩🇪", actor: "L. Wagner", role: "Procurement", action: "SPA v1 görüntülendi. (İlk erişim)", type: "access" as const },
  { time: "2 Haz. 09:15 (UTC+3)", company: "Petkim", flag: "🇹🇷", actor: "C. Arslan",  role: "Dış Ticaret", action: "SPA v1 yüklendi ve BASF Polymers ile paylaşıldı.", type: "upload" as const },
  { time: "1 Haz. 14:00 (UTC+3)", company: "Petkim", flag: "🇹🇷", actor: "O. Kılıç",   role: "Genel Müdür", action: "İşlem kaydı oluşturuldu. Polipropilen Granül — EUR 390.000.", type: "approve" as const },
] as const;

export function ScreenAuditTrail() {
  return (
    <WindowChrome title="ORTAQ · Polipropilen Granül — CHM-2024-031 · Denetim İzi" tab="Denetim İzi">
      <div className="flex flex-col" style={{ minHeight: 480 }}>

        {/* Toolbar */}
        <div className="flex items-center gap-3 border-b border-ortaq-border bg-[#faf9f7] px-4 py-2.5">
          <div className="flex items-center gap-2">
            <span className="text-[0.5625rem] font-medium text-ortaq-ink-soft">Olay türü:</span>
            {["Tümü", "Onay", "Yükleme", "Erişim"].map((f, i) => (
              <button key={f} className={cn(
                "rounded border px-2.5 py-1 text-[0.5625rem] font-medium transition-colors",
                i === 0
                  ? "border-ortaq-trust bg-ortaq-trust/10 text-ortaq-trust"
                  : "border-ortaq-border bg-white text-ortaq-ink-soft hover:text-ortaq-ink",
              )}>{f}</button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[0.5625rem] font-medium text-ortaq-ink-soft">Taraf:</span>
            <button className="rounded border border-ortaq-border bg-white px-2.5 py-1 text-[0.5625rem] text-ortaq-ink-soft hover:text-ortaq-ink transition-colors">
              Tüm taraflar ▾
            </button>
          </div>

          <div className="flex-1" />

          <button className="flex items-center gap-1.5 rounded-lg border border-ortaq-border bg-white px-3 py-1.5 text-[0.5625rem] font-semibold text-ortaq-ink hover:bg-ortaq-bg transition-colors">
            <span>↓</span>
            PDF olarak dışa aktar
          </button>
        </div>

        <div className="flex flex-1 divide-x divide-ortaq-border overflow-hidden">

          {/* Timeline */}
          <div className="flex-1 overflow-auto px-5 py-4">

            {/* Deal context */}
            <div className="mb-4 rounded-lg border border-ortaq-border bg-white px-4 py-3">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[0.5rem] font-bold uppercase tracking-[0.07em] text-ortaq-ink-soft">İşlem</p>
                  <p className="text-[0.8125rem] font-bold text-ortaq-ink">Polipropilen Granül · CHM-2024-031</p>
                  <p className="text-[0.5625rem] text-ortaq-ink-muted">🇹🇷 Petkim Petrokimya → 🇩🇪 BASF Polymers GmbH · EUR 390.000</p>
                </div>
                <div className="flex items-center gap-4">
                  {[
                    { label: "Toplam Olay", value: "18" },
                    { label: "Onay", value: "3" },
                    { label: "Yükleme", value: "6" },
                    { label: "Erişim", value: "9" },
                  ].map(s => (
                    <div key={s.label} className="text-center">
                      <p className="text-[0.75rem] font-bold text-ortaq-ink">{s.value}</p>
                      <p className="text-[0.45rem] text-ortaq-ink-soft">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="mb-3 flex items-center gap-3 flex-wrap">
              {[
                { color: "bg-emerald-500", label: "Onay/Teyit" },
                { color: "bg-amber-400",   label: "Talep/Bekleme" },
                { color: "bg-blue-400",    label: "Yükleme/Paylaşım" },
                { color: "bg-slate-300",   label: "Erişim/Görüntüleme" },
                { color: "bg-red-500",     label: "Red/Blokaj" },
              ].map(l => (
                <div key={l.label} className="flex items-center gap-1">
                  <div className={cn("h-2 w-2 rounded-full shrink-0", l.color)} />
                  <span className="text-[0.5rem] text-ortaq-ink-soft">{l.label}</span>
                </div>
              ))}
            </div>

            {/* Events */}
            <div>
              {EVENTS.map((ev, i) => (
                <AuditEvent key={i} {...ev} />
              ))}
              {/* Older events collapsed */}
              <div className="flex items-center gap-3 py-2">
                <div className="flex-1 h-px bg-ortaq-border/50" />
                <button className="rounded border border-ortaq-border bg-white px-3 py-1 text-[0.5625rem] text-ortaq-ink-soft hover:text-ortaq-ink transition-colors">
                  + 11 önceki olay göster
                </button>
                <div className="flex-1 h-px bg-ortaq-border/50" />
              </div>
            </div>
          </div>

          {/* Right — export preview + info */}
          <div className="w-[200px] shrink-0 bg-[#faf9f7]">
            <div className="border-b border-ortaq-border px-3 py-2.5">
              <p className="text-[0.5625rem] font-bold uppercase tracking-[0.07em] text-ortaq-ink-soft">
                Dışa Aktarma Önizlemesi
              </p>
            </div>
            <div className="p-3">
              <div className="rounded-lg border border-ortaq-border bg-white p-3 shadow-sm">
                <div className="mb-2 flex items-center gap-1.5">
                  <div className="h-4 w-4 rounded bg-ortaq-trust flex items-center justify-center">
                    <span className="text-[0.4rem] font-bold text-white">O</span>
                  </div>
                  <span className="text-[0.5rem] font-bold text-ortaq-ink">ORTAQ Denetim Raporu</span>
                </div>
                <div className="space-y-1 border-t border-ortaq-border pt-2">
                  {[
                    ["İşlem",   "CHM-2024-031"],
                    ["Taraflar", "Petkim / BASF"],
                    ["Dönem",   "1 Haz. — Bugün"],
                    ["Olay",    "18 kayıt"],
                    ["Format",  "PDF / CSV"],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between">
                      <span className="text-[0.475rem] text-ortaq-ink-soft">{k}</span>
                      <span className="text-[0.475rem] font-medium text-ortaq-ink">{v}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-2 border-t border-ortaq-border pt-2">
                  <p className="text-[0.45rem] text-ortaq-ink-soft/70 leading-relaxed">
                    ORTAQ sunucu zaman damgasıyla imzalanır.
                    Hukuki geçerliliği için kullanılabilir.
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-ortaq-border px-3 py-2.5">
              <p className="mb-1.5 text-[0.5625rem] font-bold uppercase tracking-[0.07em] text-ortaq-ink-soft">
                Neden önemli
              </p>
              <p className="text-[0.5rem] text-ortaq-ink-soft leading-relaxed">
                Denetim izi, bir anlaşmazlıkta kimin ne zaman neyi gördüğünü kanıtlar.
                Tüm tarafların eylemleri tek zaman çizelgesinde.
              </p>
            </div>
          </div>
        </div>
      </div>
    </WindowChrome>
  );
}
