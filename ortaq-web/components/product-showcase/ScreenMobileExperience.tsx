"use client";

import { cn } from "@/lib/cn";

/* ─── Mobile screen — all industries ──────────────────────────────────── */

const MOBILE_DEALS = [
  { name: "Çelik Tedariki",    amount: "€ 840K",  status: "SGS onayı bekleniyor",  blocker: "Alıcı",   urgency: "acil",      sector: "🔩", daysLeft: 2 },
  { name: "Fındık İhracatı",   amount: "€ 520K",  status: "SGS onayı bekleniyor",  blocker: "Alıcı",   urgency: "acil",      sector: "🌰", daysLeft: 2 },
  { name: "Pamuk Kumaş",       amount: "€ 285K",  status: "SPA v5 müzakerede",     blocker: "Satıcı",  urgency: "bekliyor",  sector: "🧵", daysLeft: null },
  { name: "Buğday İhracatı",   amount: "€ 670K",  status: "Phytosanitary eksik",   blocker: "Satıcı",  urgency: "bekliyor",  sector: "🌾", daysLeft: 5 },
  { name: "CNC Makine",        amount: "€ 1.2M",  status: "BL alıcıda incelemede", blocker: "—",       urgency: "ilerliyor", sector: "⚙️", daysLeft: null },
];

const NOTIFICATIONS = [
  { icon: "✓", text: "Hamburg Steel SGS raporunu onayladı",   time: "2 dk önce",  color: "text-emerald-600" },
  { icon: "📄", text: "Fındık işleminde yeni mesaj: Ferrero",  time: "15 dk önce", color: "text-ortaq-ink"   },
  { icon: "⏰", text: "SGS Raporu deadline: 2 gün kaldı",       time: "1 sa önce",  color: "text-amber-600"   },
  { icon: "📋", text: "Packing List v3 onayı bekleniyor",       time: "3 sa önce",  color: "text-ortaq-ink"   },
];

function PhoneFrame({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <p className="mb-2 text-[0.5rem] font-bold uppercase tracking-[0.08em] text-ortaq-ink-soft">{label}</p>
      <div className="w-[160px] overflow-hidden rounded-[24px] border-[3px] border-ortaq-ink bg-white shadow-[0_12px_40px_rgb(20_19_16/0.15)]">
        {/* Notch */}
        <div className="flex items-center justify-center bg-ortaq-ink py-1.5">
          <div className="h-1 w-12 rounded-full bg-ortaq-ink-muted" />
        </div>
        {/* Screen */}
        <div className="overflow-hidden" style={{ minHeight: 340 }}>
          {children}
        </div>
        {/* Home indicator */}
        <div className="flex justify-center bg-white py-1.5">
          <div className="h-1 w-8 rounded-full bg-ortaq-border" />
        </div>
      </div>
    </div>
  );
}

export function ScreenMobileExperience() {
  return (
    <div className="overflow-hidden rounded-xl border border-ortaq-border bg-[#faf9f7] shadow-[0_8px_40px_rgb(20_19_16/0.10)]">

      {/* Header */}
      <div className="flex items-center justify-between border-b border-ortaq-border bg-white px-5 py-3">
        <div>
          <h4 className="text-[0.8125rem] font-bold text-ortaq-ink">Mobil Deneyim</h4>
          <p className="text-[0.5625rem] text-ortaq-ink-soft">
            Kontrol etmek için — çalışmak için değil. 30 saniyede son durum.
          </p>
        </div>
        <div className="rounded-full bg-ortaq-trust/10 px-3 py-1 text-[0.5625rem] font-semibold text-ortaq-trust">
          iOS · Android
        </div>
      </div>

      {/* Three phone screens side by side */}
      <div className="flex items-start justify-center gap-8 px-6 py-8 flex-wrap">

        {/* Screen 1 — Deals list */}
        <PhoneFrame label="İşlemler">
          {/* Status bar */}
          <div className="flex items-center justify-between bg-white px-3 py-1">
            <span className="text-[0.45rem] font-semibold text-ortaq-ink">09:31</span>
            <div className="flex items-center gap-1">
              <span className="text-[0.5rem]">●●●</span>
              <span className="text-[0.45rem]">🔋</span>
            </div>
          </div>

          {/* App header */}
          <div className="flex items-center justify-between border-b border-ortaq-border bg-white px-3 pb-2">
            <div>
              <p className="text-[0.5rem] font-bold uppercase tracking-[0.08em] text-ortaq-ink-soft">ORTAQ</p>
              <p className="text-[0.75rem] font-bold text-ortaq-ink">İşlemlerim</p>
            </div>
            <div className="relative">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500">
                <span className="text-[0.45rem] font-bold text-white">2</span>
              </div>
            </div>
          </div>

          {/* Deal cards */}
          <div className="bg-[#f5f5f4] px-2 py-2 space-y-1.5">
            {MOBILE_DEALS.map(deal => (
              <div key={deal.name} className={cn(
                "cursor-pointer rounded-xl border bg-white p-2.5 shadow-sm",
                deal.urgency === "acil" ? "border-red-200" : "border-ortaq-border",
              )}>
                <div className="flex items-start justify-between gap-1">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="text-xs">{deal.sector}</span>
                      <p className="text-[0.5625rem] font-bold text-ortaq-ink truncate">{deal.name}</p>
                    </div>
                    <p className="text-[0.45rem] text-ortaq-ink-soft mt-0.5 leading-tight truncate">{deal.status}</p>
                  </div>
                  <p className="shrink-0 text-[0.5625rem] font-bold text-ortaq-trust">{deal.amount}</p>
                </div>
                <div className="mt-1.5 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <span className="text-[0.45rem] text-ortaq-ink-soft">Sıra:</span>
                    <span className={cn(
                      "text-[0.5rem] font-bold",
                      deal.blocker === "Alıcı"  ? "text-blue-600"    :
                      deal.blocker === "Satıcı" ? "text-emerald-600" : "text-ortaq-ink-soft",
                    )}>{deal.blocker}</span>
                  </div>
                  {deal.urgency === "acil" && (
                    <div className="flex items-center gap-1 rounded-full bg-red-50 px-1.5 py-px">
                      <span className="h-1 w-1 rounded-full bg-red-500 animate-pulse" />
                      <span className="text-[0.45rem] font-bold text-red-600">
                        {deal.daysLeft} gün
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom tab bar */}
          <div className="flex border-t border-ortaq-border bg-white">
            {[
              { label: "İşlemler", icon: "📋", active: true  },
              { label: "Onaylar",  icon: "✓",  active: false, badge: 1 },
              { label: "Bildir.",  icon: "🔔",  active: false, badge: 3 },
              { label: "Profil",   icon: "👤",  active: false },
            ].map(tab => (
              <button key={tab.label} className={cn(
                "relative flex flex-1 flex-col items-center py-1.5 gap-0.5",
                tab.active ? "text-ortaq-trust" : "text-ortaq-ink-soft",
              )}>
                <span className="text-[0.7rem]">{tab.icon}</span>
                <span className="text-[0.4rem] font-semibold">{tab.label}</span>
                {tab.badge && (
                  <div className="absolute right-2 top-0.5 flex h-3 w-3 items-center justify-center rounded-full bg-red-500">
                    <span className="text-[0.35rem] font-bold text-white">{tab.badge}</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </PhoneFrame>

        {/* Screen 2 — Deal detail */}
        <PhoneFrame label="İşlem Detayı">
          {/* Back + header */}
          <div className="flex items-center gap-1.5 border-b border-ortaq-border bg-white px-2 py-2">
            <button className="text-[0.6rem] text-ortaq-trust">← Geri</button>
          </div>

          <div className="bg-white px-3 py-2">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[0.5rem] font-bold uppercase tracking-[0.06em] text-ortaq-ink-soft">SPA-2024-047</p>
                <p className="text-[0.75rem] font-bold text-ortaq-ink">Çelik Tedariki</p>
                <p className="text-[0.5rem] text-ortaq-ink-soft">🇹🇷 Kartal Çelik → 🇩🇪 Hamburg Steel</p>
              </div>
              <p className="text-[0.625rem] font-bold text-ortaq-trust">€ 840K</p>
            </div>

            {/* Stage bar */}
            <div className="mt-2 flex items-center gap-0.5">
              {["T","S","M","Sv","Ö"].map((s, i) => (
                <div key={s} className={cn(
                  "flex-1 rounded-full h-1.5",
                  i < 2 ? "bg-ortaq-trust" : i === 2 ? "bg-amber-400" : "bg-ortaq-border",
                )} />
              ))}
            </div>
            <p className="mt-0.5 text-right text-[0.45rem] text-ortaq-ink-soft">Muayene • 78%</p>
          </div>

          {/* Next action */}
          <div className="mx-2 mb-2 rounded-xl border border-amber-200 bg-amber-50 p-2.5">
            <p className="text-[0.45rem] font-bold uppercase tracking-[0.07em] text-amber-600">Sıradaki</p>
            <p className="text-[0.5625rem] font-bold text-ortaq-ink">SGS raporu onayı</p>
            <p className="text-[0.45rem] text-amber-700">Hamburg Steel · 15 Haz. · 47 sa kaldı</p>
            <button className="mt-1.5 w-full rounded-lg bg-amber-400 py-1.5 text-[0.5rem] font-bold text-white">
              Hatırlatıcı Gönder
            </button>
          </div>

          {/* Documents (simplified) */}
          <div className="mx-2 mb-2">
            <p className="mb-1 text-[0.45rem] font-bold uppercase tracking-[0.07em] text-ortaq-ink-soft">Belgeler</p>
            <div className="space-y-0.5">
              {[
                { doc: "SPA v12",        status: "✓", cls: "text-emerald-600" },
                { doc: "SGS Raporu v1",  status: "⏳", cls: "text-amber-600"  },
                { doc: "BL Taslak v2",   status: "⏳", cls: "text-amber-600"  },
                { doc: "Packing List v3",status: "✓", cls: "text-emerald-600" },
              ].map(d => (
                <div key={d.doc} className="flex items-center justify-between rounded-lg border border-ortaq-border bg-white px-2 py-1.5">
                  <span className="text-[0.5rem] text-ortaq-ink">{d.doc}</span>
                  <span className={cn("text-[0.5625rem] font-bold", d.cls)}>{d.status}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom tabs */}
          <div className="flex border-t border-ortaq-border bg-white">
            {[
              { label: "İşlemler", icon: "📋", active: true  },
              { label: "Onaylar",  icon: "✓",  active: false, badge: 1 },
              { label: "Bildir.",  icon: "🔔",  active: false, badge: 3 },
              { label: "Profil",   icon: "👤",  active: false },
            ].map(tab => (
              <button key={tab.label} className={cn(
                "relative flex flex-1 flex-col items-center py-1.5 gap-0.5",
                tab.active ? "text-ortaq-trust" : "text-ortaq-ink-soft",
              )}>
                <span className="text-[0.7rem]">{tab.icon}</span>
                <span className="text-[0.4rem] font-semibold">{tab.label}</span>
                {tab.badge && (
                  <div className="absolute right-2 top-0.5 flex h-3 w-3 items-center justify-center rounded-full bg-red-500">
                    <span className="text-[0.35rem] font-bold text-white">{tab.badge}</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </PhoneFrame>

        {/* Screen 3 — Notifications */}
        <PhoneFrame label="Bildirimler">
          <div className="flex items-center justify-between border-b border-ortaq-border bg-white px-3 py-2">
            <p className="text-[0.75rem] font-bold text-ortaq-ink">Bildirimler</p>
            <button className="text-[0.45rem] text-ortaq-trust">Tümünü okundu işaretle</button>
          </div>

          <div className="bg-[#f5f5f4] px-2 py-2 space-y-1.5">
            {NOTIFICATIONS.map((n, i) => (
              <div key={i} className="cursor-pointer rounded-xl border border-ortaq-border bg-white p-2.5 shadow-sm">
                <div className="flex items-start gap-2">
                  <span className={cn("mt-0.5 text-sm shrink-0", n.color)}>{n.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[0.5625rem] text-ortaq-ink leading-snug">{n.text}</p>
                    <p className="mt-0.5 text-[0.45rem] text-ortaq-ink-soft">{n.time}</p>
                  </div>
                  <span className="text-[0.5625rem] text-ortaq-ink-soft shrink-0">→</span>
                </div>
              </div>
            ))}

            {/* Offline indicator */}
            <div className="rounded-xl border border-ortaq-border bg-white px-3 py-2.5 text-center">
              <p className="text-[0.5rem] font-bold text-emerald-600">● Çevrimiçi</p>
              <p className="text-[0.45rem] text-ortaq-ink-soft">Son senkronizasyon: 2 dk önce</p>
            </div>
          </div>

          {/* Bottom tabs */}
          <div className="flex border-t border-ortaq-border bg-white">
            {[
              { label: "İşlemler", icon: "📋", active: false },
              { label: "Onaylar",  icon: "✓",  active: false, badge: 1 },
              { label: "Bildir.",  icon: "🔔",  active: true  },
              { label: "Profil",   icon: "👤",  active: false },
            ].map(tab => (
              <button key={tab.label} className={cn(
                "relative flex flex-1 flex-col items-center py-1.5 gap-0.5",
                tab.active ? "text-ortaq-trust" : "text-ortaq-ink-soft",
              )}>
                <span className="text-[0.7rem]">{tab.icon}</span>
                <span className="text-[0.4rem] font-semibold">{tab.label}</span>
              </button>
            ))}
          </div>
        </PhoneFrame>
      </div>

      {/* Mobile principles footer */}
      <div className="border-t border-ortaq-border bg-white px-6 py-4">
        <div className="grid grid-cols-3 gap-4 sm:grid-cols-4">
          {[
            { icon: "👁", title: "Kontrol Et",  desc: "Son durum 30 saniyede. Belge detayları değil, bir tek 'sıra kimde.'" },
            { icon: "✓",  title: "Onayla",      desc: "Onay talepleri mobilde tamamlanır. Deadline geldiğinde masaüstünü beklemeyin." },
            { icon: "🔔", title: "Anlık Bildi.", desc: "Yalnızca önemli olaylar: Onay talebi, belge paylaşımı, kritik tarih." },
            { icon: "🚫", title: "Karmaşık İşlem Yok", desc: "Belge yükleme, yeni işlem açma → masaüstünde. Mobil sadece kontrol içindir." },
          ].map(p => (
            <div key={p.title} className="flex items-start gap-2">
              <span className="text-lg shrink-0">{p.icon}</span>
              <div>
                <p className="text-[0.5625rem] font-bold text-ortaq-ink">{p.title}</p>
                <p className="text-[0.5rem] text-ortaq-ink-soft leading-relaxed">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
