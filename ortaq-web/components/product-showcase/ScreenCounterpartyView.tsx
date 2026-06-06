"use client";

import { cn } from "@/lib/cn";
import { WindowChrome, StatusBadge } from "./shared";

/* ─── Steel deal split-screen ─────────────────────────────────────────── */

const DOCS = [
  { name: "SPA",             ver: "v12", sellerStatus: "confirmed" as const, buyerStatus: "confirmed" as const, sellerLabel: "Onaylandı",  buyerLabel: "Onaylandı",    sharedWithBuyer: true  },
  { name: "SGS Raporu",      ver: "v1",  sellerStatus: "pending"   as const, buyerStatus: "pending"   as const, sellerLabel: "Bekliyor",   buyerLabel: "Bekliyor",     sharedWithBuyer: true  },
  { name: "BL Taslak",       ver: "v2",  sellerStatus: "internal"  as const, buyerStatus: null,                 sellerLabel: "Yalnızca biz", buyerLabel: null,          sharedWithBuyer: false },
  { name: "LC",              ver: "—",   sellerStatus: "pending"   as const, buyerStatus: "pending"   as const, sellerLabel: "Hazırlanıyor", buyerLabel: "Hazırlanıyor", sharedWithBuyer: true  },
  { name: "Packing List",    ver: "v3",  sellerStatus: "confirmed" as const, buyerStatus: "confirmed" as const, sellerLabel: "Onaylandı",  buyerLabel: "Onaylandı",    sharedWithBuyer: true  },
];

const MSGS = [
  { from: "Hamburg Steel", flag: "🇩🇪", text: "SGS muayene randevusunu onaylıyoruz.", time: "Bugün 09:15", internal: false, visibleToBuyer: true  },
  { from: "Kartal Çelik",  flag: "🇹🇷", text: "TÜV SÜD randevusu 15 Haziran'da alındı.", time: "Dün 16:42", internal: false, visibleToBuyer: true  },
  { from: "Kartal Çelik",  flag: "🇹🇷", text: "Alıcı SGS konusunda titiz. Türkçe yerine orijinal rapor isteyelim.", time: "Dün 16:50", internal: true, visibleToBuyer: false },
];

export function ScreenCounterpartyView() {
  return (
    <WindowChrome title="ORTAQ · Çelik Tedariki — SPA-2024-047 · Karşı Taraf Görünümü" tab="Karşı Taraf">
      <div className="flex flex-col" style={{ minHeight: 480 }}>

        {/* Top banner explaining the view */}
        <div className="flex items-center justify-between border-b border-ortaq-border bg-slate-50 px-4 py-2">
          <p className="text-[0.5625rem] text-ortaq-ink-soft">
            Bu ekran size alıcının tam olarak ne gördüğünü gösterir.
            <span className="font-semibold text-ortaq-ink"> Alıcı bu ayrımı görmez.</span>
          </p>
          <div className="flex items-center gap-2">
            <span className="text-[0.5rem] text-ortaq-ink-soft">Fark Modu:</span>
            <button className="rounded border border-ortaq-trust bg-ortaq-trust/10 px-2 py-0.5 text-[0.5rem] font-bold text-ortaq-trust">
              Aktif
            </button>
          </div>
        </div>

        {/* Split header */}
        <div className="grid grid-cols-2 divide-x divide-ortaq-border border-b border-ortaq-border">
          <div className="bg-emerald-50 px-4 py-2.5">
            <div className="flex items-center gap-2">
              <span className="text-sm">🇹🇷</span>
              <span className="text-[0.6875rem] font-bold text-emerald-800">Kartal Çelik</span>
              <span className="rounded-full bg-emerald-100 px-1.5 py-px text-[0.45rem] font-bold text-emerald-700">SİZİN GÖRÜNÜMÜNÜZ</span>
            </div>
            <p className="text-[0.5rem] text-emerald-700/70 mt-0.5">Tüm belgeler, dahili notlar dahil</p>
          </div>
          <div className="bg-blue-50 px-4 py-2.5">
            <div className="flex items-center gap-2">
              <span className="text-sm">🇩🇪</span>
              <span className="text-[0.6875rem] font-bold text-blue-800">Hamburg Steel</span>
              <span className="rounded-full bg-blue-100 px-1.5 py-px text-[0.45rem] font-bold text-blue-700">ALICININ GÖRÜNÜMÜ</span>
            </div>
            <p className="text-[0.5rem] text-blue-700/70 mt-0.5">Paylaşılan belgeler ve mesajlar</p>
          </div>
        </div>

        {/* Split content */}
        <div className="grid flex-1 grid-cols-2 divide-x divide-ortaq-border overflow-auto">

          {/* ── SELLER SIDE ─────────────────────────────────────────── */}
          <div>

            {/* Documents */}
            <div className="border-b border-ortaq-border bg-[#f5f5f4] px-3 py-1.5">
              <p className="text-[0.5rem] font-bold uppercase tracking-[0.07em] text-ortaq-ink-soft">Belgeler</p>
            </div>
            {DOCS.map(doc => (
              <div key={doc.name} className={cn(
                "flex items-center gap-2 border-b border-ortaq-border/30 px-3 py-2",
                !doc.sharedWithBuyer && "bg-amber-50/60",
              )}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[0.6rem] font-semibold text-ortaq-ink">{doc.name}</span>
                    <span className="font-mono text-[0.5rem] text-ortaq-ink-soft">{doc.ver}</span>
                  </div>
                </div>
                <StatusBadge
                  type={doc.sellerStatus}
                  label={doc.sellerLabel}
                  size="xs"
                />
                {!doc.sharedWithBuyer && (
                  <button className="shrink-0 rounded border border-amber-300 bg-white px-1.5 py-px text-[0.45rem] font-semibold text-amber-700 hover:bg-amber-50 transition-colors">
                    Paylaş
                  </button>
                )}
              </div>
            ))}

            {/* Messages */}
            <div className="border-b border-ortaq-border bg-[#f5f5f4] px-3 py-1.5">
              <p className="text-[0.5rem] font-bold uppercase tracking-[0.07em] text-ortaq-ink-soft">Mesajlar</p>
            </div>
            {MSGS.map((msg, i) => (
              <div key={i} className={cn(
                "border-b border-ortaq-border/20 px-3 py-2",
                msg.internal && "bg-amber-50/80 border-l-2 border-l-amber-300",
              )}>
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span>{msg.flag}</span>
                  <span className="text-[0.5625rem] font-semibold text-ortaq-ink">{msg.from}</span>
                  {msg.internal && (
                    <span className="rounded-full bg-amber-100 px-1.5 py-px text-[0.45rem] font-bold text-amber-700">
                      Yalnızca biz
                    </span>
                  )}
                  <span className="ml-auto text-[0.45rem] text-ortaq-ink-soft">{msg.time}</span>
                </div>
                <p className="text-[0.5625rem] text-ortaq-ink leading-snug">{msg.text}</p>
              </div>
            ))}
          </div>

          {/* ── BUYER SIDE ──────────────────────────────────────────── */}
          <div>

            {/* Documents */}
            <div className="border-b border-ortaq-border bg-[#f5f5f4] px-3 py-1.5">
              <p className="text-[0.5rem] font-bold uppercase tracking-[0.07em] text-ortaq-ink-soft">Belgeler</p>
            </div>
            {DOCS.map(doc => (
              <div key={doc.name} className={cn(
                "flex items-center gap-2 border-b border-ortaq-border/30 px-3 py-2",
                !doc.sharedWithBuyer && "bg-slate-50",
              )}>
                {doc.sharedWithBuyer ? (
                  <>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[0.6rem] font-semibold text-ortaq-ink">{doc.name}</span>
                        <span className="font-mono text-[0.5rem] text-ortaq-ink-soft">{doc.ver}</span>
                      </div>
                    </div>
                    <StatusBadge
                      type={doc.buyerStatus!}
                      label={doc.buyerLabel!}
                      size="xs"
                    />
                  </>
                ) : (
                  /* ABSENT — not blurred, truly not there */
                  <div className="flex w-full items-center gap-2 rounded border border-dashed border-slate-200 px-2 py-1">
                    <div className="h-3 flex-1 rounded bg-slate-100" />
                    <span className="text-[0.45rem] text-slate-400 font-medium">Bu belge alıcıya görünmüyor</span>
                  </div>
                )}
              </div>
            ))}

            {/* Messages */}
            <div className="border-b border-ortaq-border bg-[#f5f5f4] px-3 py-1.5">
              <p className="text-[0.5rem] font-bold uppercase tracking-[0.07em] text-ortaq-ink-soft">Mesajlar</p>
            </div>
            {MSGS.map((msg, i) => (
              msg.visibleToBuyer ? (
                <div key={i} className="border-b border-ortaq-border/20 px-3 py-2">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span>{msg.flag}</span>
                    <span className="text-[0.5625rem] font-semibold text-ortaq-ink">{msg.from}</span>
                    <span className="ml-auto text-[0.45rem] text-ortaq-ink-soft">{msg.time}</span>
                  </div>
                  <p className="text-[0.5625rem] text-ortaq-ink leading-snug">{msg.text}</p>
                </div>
              ) : (
                /* Absent in buyer view */
                <div key={i} className="border-b border-ortaq-border/10 px-3 py-2">
                  <div className="flex items-center gap-2 rounded border border-dashed border-slate-200 px-2 py-1.5">
                    <div className="h-3 flex-1 rounded bg-slate-100" />
                    <span className="shrink-0 text-[0.45rem] text-slate-400">Alıcıya görünmüyor</span>
                  </div>
                </div>
              )
            ))}
          </div>
        </div>

        {/* Bottom note */}
        <div className="border-t border-ortaq-border bg-emerald-50/30 px-4 py-2">
          <p className="text-[0.5rem] text-emerald-700">
            <strong>Diff Modu aktif:</strong> Turuncu kenarlıklar yalnızca sizde olan öğeleri gösterir.
            Sağ sütundaki kesik çizgili alanlar alıcıda gerçekten görünmeyen öğelerdir.
          </p>
        </div>
      </div>
    </WindowChrome>
  );
}
