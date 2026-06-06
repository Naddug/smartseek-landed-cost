"use client";

import { cn } from "@/lib/cn";
import { WindowChrome } from "./shared";

/* ─── 7 active deals across industries ────────────────────────────────── */

const DEALS = [
  {
    name: "Çelik Tedariki",
    ref: "SPA-2024-047",
    sector: "Çelik",
    buyer: { flag: "🇩🇪", co: "Hamburg Steel" },
    seller: { flag: "🇹🇷", co: "Kartal Çelik" },
    amount: "€ 840.000",
    stage: "Muayene",
    stageIdx: 2,
    urgency: "acil" as const,
    blocker: "Alıcı",
    blockerCls: "text-blue-600",
    critical: "15 Haz.",
    criticalUrgent: true,
    lastAction: "SGS muayene randevusu alındı",
  },
  {
    name: "CNC Makine Satışı",
    ref: "MCH-2024-018",
    sector: "Makine",
    buyer: { flag: "🇩🇪", co: "Bosch Production" },
    seller: { flag: "🇹🇷", co: "Tosyalı Makine" },
    amount: "€ 1.200.000",
    stage: "Sevkiyat",
    stageIdx: 3,
    urgency: "ilerliyor" as const,
    blocker: "Beklemiyor",
    blockerCls: "text-ortaq-ink-soft",
    critical: "22 Haz.",
    criticalUrgent: false,
    lastAction: "BL taslak v2 alıcıya gönderildi",
  },
  {
    name: "Pamuk Kumaş",
    ref: "TEX-2024-093",
    sector: "Tekstil",
    buyer: { flag: "🇬🇧", co: "M&S Distribution" },
    seller: { flag: "🇹🇷", co: "Şanlıurfa Tekstil" },
    amount: "€ 285.000",
    stage: "Sözleşme",
    stageIdx: 1,
    urgency: "bekliyor" as const,
    blocker: "Satıcı",
    blockerCls: "text-emerald-600",
    critical: "14 Haz.",
    criticalUrgent: true,
    lastAction: "SPA v5 müzakeresine satıcı yanıtı bekleniyor",
  },
  {
    name: "Fındık İhracatı",
    ref: "AGR-2024-071",
    sector: "Gıda",
    buyer: { flag: "🇱🇺", co: "Ferrero Trading" },
    seller: { flag: "🇹🇷", co: "Giresun Tarım" },
    amount: "€ 520.000",
    stage: "Muayene",
    stageIdx: 2,
    urgency: "acil" as const,
    blocker: "Alıcı",
    blockerCls: "text-blue-600",
    critical: "15 Haz.",
    criticalUrgent: true,
    lastAction: "SGS raporu Ferrero onayı bekliyor · 47 sa kaldı",
  },
  {
    name: "Polipropilen Granül",
    ref: "CHM-2024-031",
    sector: "Kimya",
    buyer: { flag: "🇩🇪", co: "BASF Polymers" },
    seller: { flag: "🇹🇷", co: "Petkim" },
    amount: "€ 390.000",
    stage: "Ödeme",
    stageIdx: 4,
    urgency: "ilerliyor" as const,
    blocker: "Banka",
    blockerCls: "text-amber-600",
    critical: "18 Haz.",
    criticalUrgent: false,
    lastAction: "LC HSBC Dubai'den açıldı",
  },
  {
    name: "Mermer Plaka",
    ref: "STN-2024-052",
    sector: "Ham Madde",
    buyer: { flag: "🇺🇸", co: "MSI Stone USA" },
    seller: { flag: "🇹🇷", co: "İzmir Mermer" },
    amount: "€ 180.000",
    stage: "Teklif",
    stageIdx: 0,
    urgency: "yeni" as const,
    blocker: "Beklemiyor",
    blockerCls: "text-ortaq-ink-soft",
    critical: "—",
    criticalUrgent: false,
    lastAction: "SPA taslağı hazırlanıyor",
  },
  {
    name: "Buğday İhracatı",
    ref: "GRN-2024-089",
    sector: "Gıda",
    buyer: { flag: "🇪🇬", co: "Cargill Egypt" },
    seller: { flag: "🇹🇷", co: "TMO" },
    amount: "€ 670.000",
    stage: "Sevkiyat",
    stageIdx: 3,
    urgency: "bekliyor" as const,
    blocker: "Satıcı",
    blockerCls: "text-emerald-600",
    critical: "17 Haz.",
    criticalUrgent: false,
    lastAction: "Gemi 22 Haz. · Phytosanitary eksik",
  },
];

const STAGES_MINI = ["T", "S", "M", "Sv", "Ö"] as const;

export function ScreenPortfolioView() {
  const acilCount = DEALS.filter(d => d.urgency === "acil").length;
  const bekliyorCount = DEALS.filter(d => d.urgency === "bekliyor").length;
  const ilerCount = DEALS.filter(d => d.urgency === "ilerliyor").length;

  return (
    <WindowChrome title="ORTAQ · Portföy Görünümü — Tüm Aktif İşlemler" tab="Portföy">
      <div className="flex flex-col" style={{ minHeight: 480 }}>

        {/* ── Summary stats strip ─────────────────────────────────────── */}
        <div className="flex items-center divide-x divide-ortaq-border border-b border-ortaq-border bg-[#faf9f7]">
          {[
            { label: "Aktif İşlem",        value: DEALS.length,    cls: "text-ortaq-ink"    },
            { label: "Acil",               value: acilCount,       cls: "text-red-600"      },
            { label: "Bekliyor",           value: bekliyorCount,   cls: "text-amber-600"    },
            { label: "İlerliyor",          value: ilerCount,       cls: "text-emerald-600"  },
            { label: "Bu hafta deadline",  value: 4,               cls: "text-ortaq-trust"  },
          ].map(stat => (
            <button key={stat.label} className="flex cursor-pointer flex-col items-center px-5 py-3 hover:bg-white transition-colors">
              <span className={cn("text-[1.125rem] font-bold tabular-nums leading-none", stat.cls)}>
                {stat.value}
              </span>
              <span className="mt-0.5 text-[0.5rem] font-medium text-ortaq-ink-soft">{stat.label}</span>
            </button>
          ))}
          <div className="flex-1" />
          {/* View toggle */}
          <div className="flex items-center gap-2 px-4">
            <button className="rounded border border-ortaq-trust bg-ortaq-trust/10 px-2.5 py-1 text-[0.5625rem] font-semibold text-ortaq-trust">
              Tablo
            </button>
            <button className="rounded border border-ortaq-border px-2.5 py-1 text-[0.5625rem] text-ortaq-ink-soft hover:text-ortaq-ink transition-colors">
              Takvim
            </button>
          </div>
        </div>

        {/* ── Deal table ───────────────────────────────────────────────── */}
        <div className="flex-1 overflow-auto">

          {/* Table header */}
          <div className="sticky top-0 z-10 flex items-center border-b border-ortaq-border bg-[#faf9f7] text-[0.5rem] font-bold uppercase tracking-[0.07em] text-ortaq-ink-soft">
            <div className="w-6 shrink-0 px-2 py-2 text-center">&nbsp;</div>
            <div className="w-[180px] shrink-0 px-3 py-2">İşlem</div>
            <div className="w-[130px] shrink-0 px-2 py-2">Alıcı → Satıcı</div>
            <div className="w-[90px] shrink-0 px-2 py-2 text-right">Hacim</div>
            <div className="w-[90px] shrink-0 px-2 py-2">Aşama</div>
            <div className="w-[100px] shrink-0 px-2 py-2 font-black text-ortaq-trust">Sıra Kimde ↓</div>
            <div className="w-[80px] shrink-0 px-2 py-2">Kritik Tarih</div>
            <div className="flex-1 px-2 py-2">Son Eylem</div>
          </div>

          {/* Table rows */}
            {DEALS.map((deal) => (
            <div
              key={deal.ref}
              className={cn(
                "flex cursor-pointer items-center border-b border-ortaq-border/50 transition-colors hover:bg-ortaq-bg/40",
                deal.urgency === "acil" && "bg-red-50/30",
              )}
            >
              {/* Urgency indicator */}
              <div className="w-6 shrink-0 flex justify-center py-3">
                <div className={cn(
                  "h-4 w-1 rounded-full",
                  deal.urgency === "acil"      ? "bg-red-400"    :
                  deal.urgency === "bekliyor"  ? "bg-amber-400"  :
                  deal.urgency === "ilerliyor" ? "bg-emerald-400": "bg-blue-300",
                )} />
              </div>

              {/* Deal name + sector */}
              <div className="w-[180px] shrink-0 px-3 py-3">
                <p className="text-[0.6875rem] font-semibold text-ortaq-ink leading-tight">{deal.name}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[0.5rem] font-mono text-ortaq-ink-soft">{deal.ref}</span>
                  <span className="rounded bg-ortaq-border/60 px-1 py-px text-[0.45rem] font-medium text-ortaq-ink-soft">
                    {deal.sector}
                  </span>
                </div>
                {/* Mini stage indicator */}
                <div className="mt-1 flex items-center gap-0.5">
                  {STAGES_MINI.map((s, si) => (
                    <div key={s} className="flex items-center gap-0.5">
                      <div className={cn(
                        "h-1 w-4 rounded-full",
                        si < deal.stageIdx  ? "bg-ortaq-trust"  :
                        si === deal.stageIdx ? "bg-amber-400"    : "bg-ortaq-border",
                      )} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Buyer + Seller */}
              <div className="w-[130px] shrink-0 px-2 py-3">
                <p className="text-[0.5625rem] text-ortaq-ink leading-tight">
                  {deal.buyer.flag} {deal.buyer.co}
                </p>
                <p className="text-[0.5625rem] text-ortaq-ink-soft leading-tight mt-0.5">
                  {deal.seller.flag} {deal.seller.co}
                </p>
              </div>

              {/* Amount */}
              <div className="w-[90px] shrink-0 px-2 py-3 text-right">
                <span className="text-[0.6875rem] font-bold text-ortaq-ink tabular-nums">{deal.amount}</span>
              </div>

              {/* Stage */}
              <div className="w-[90px] shrink-0 px-2 py-3">
                <span className={cn(
                  "rounded-full px-2 py-0.5 text-[0.5625rem] font-semibold",
                  deal.stageIdx === 2 ? "bg-amber-100 text-amber-700" :
                  deal.stageIdx === 4 ? "bg-emerald-100 text-emerald-700" :
                  deal.stageIdx === 0 ? "bg-blue-100 text-blue-700" :
                                        "bg-slate-100 text-slate-600",
                )}>{deal.stage}</span>
              </div>

              {/* MOST IMPORTANT CELL — Sıra kimde */}
              <div className="w-[100px] shrink-0 cursor-pointer px-2 py-3">
                <span className={cn("text-[0.6875rem] font-bold", deal.blockerCls)}>
                  {deal.blocker}
                </span>
                {deal.urgency === "acil" && (
                  <span className="ml-1 text-[0.45rem] font-bold text-red-500 animate-pulse">●</span>
                )}
              </div>

              {/* Critical date */}
              <div className="w-[80px] shrink-0 px-2 py-3">
                <span className={cn(
                  "text-[0.6875rem] font-semibold tabular-nums",
                  deal.criticalUrgent ? "text-red-600" : "text-ortaq-ink-muted",
                )}>{deal.critical}</span>
              </div>

              {/* Last action */}
              <div className="flex-1 px-2 py-3">
                <p className="text-[0.5625rem] text-ortaq-ink-soft leading-snug line-clamp-2">{deal.lastAction}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </WindowChrome>
  );
}
