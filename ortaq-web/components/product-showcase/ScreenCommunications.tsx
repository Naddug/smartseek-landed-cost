"use client";

import { cn } from "@/lib/cn";
import { WindowChrome, MsgBubble } from "./shared";

/* ─── Machinery deal — CNC Makine Satışı ──────────────────────────────── */

export function ScreenCommunications() {
  return (
    <WindowChrome title="ORTAQ · CNC Makine Satışı — MCH-2024-018 · Mesajlar" tab="İletişim">
      <div className="flex divide-x divide-ortaq-border" style={{ minHeight: 480 }}>

        {/* ── LEFT — Thread Navigator ──────────────────────────────────── */}
        <div className="flex w-[200px] shrink-0 flex-col divide-y divide-ortaq-border bg-[#faf9f7]">

          {/* New thread button */}
          <div className="px-3 py-2.5">
            <button className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-ortaq-border bg-white px-3 py-2 text-[0.6875rem] font-semibold text-ortaq-ink hover:bg-ortaq-bg transition-colors">
              <span>+</span> Konu Başlat
            </button>
          </div>

          {/* Thread list */}
          {[
            { id: "sgs",   label: "SGS Muayenesi",    anchor: "Muayene Belgeleri", count: 4, internal: 2, time: "2 sa önce", active: true,  resolved: false },
            { id: "bl",    label: "BL Taslak Onayı",  anchor: "Taşıma Belgeleri", count: 2, internal: 0, time: "1 gün önce", active: false, resolved: false },
            { id: "fiyat", label: "Fiyat Revizyonu",  anchor: "Sözleşmeler",       count: 7, internal: 1, time: "5 gün önce", active: false, resolved: true  },
            { id: "genel", label: "Genel",             anchor: "—",                 count: 1, internal: 0, time: "1 hf önce",  active: false, resolved: false },
          ].map(thread => (
            <div key={thread.id} className={cn(
              "cursor-pointer px-3 py-2.5 transition-colors hover:bg-white",
              thread.active && "bg-white border-l-2 border-l-ortaq-trust",
            )}>
              <div className="flex items-center gap-1.5">
                <p className={cn(
                  "flex-1 text-[0.6875rem] font-semibold leading-tight",
                  thread.resolved ? "text-ortaq-ink-soft line-through" : "text-ortaq-ink",
                )}>
                  {thread.label}
                </p>
                {!thread.resolved && (
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-ortaq-trust text-[0.45rem] font-bold text-white">
                    {thread.count}
                  </span>
                )}
              </div>
              <div className="mt-0.5 flex items-center gap-1.5">
                <span className="text-[0.5rem] text-ortaq-ink-soft/60 rounded bg-ortaq-border/50 px-1 py-px">{thread.anchor}</span>
              </div>
              <div className="mt-0.5 flex items-center gap-1.5">
                {thread.internal > 0 && (
                  <span className="rounded-full bg-amber-100 px-1 py-px text-[0.45rem] font-bold text-amber-700">
                    {thread.internal} dahili
                  </span>
                )}
                {thread.resolved && (
                  <span className="rounded-full bg-emerald-100 px-1 py-px text-[0.45rem] font-bold text-emerald-700">
                    Kapatıldı
                  </span>
                )}
                <span className="ml-auto text-[0.5rem] text-ortaq-ink-soft">{thread.time}</span>
              </div>
            </div>
          ))}
        </div>

        {/* ── CENTER — Message Thread ──────────────────────────────────── */}
        <div className="flex flex-1 flex-col">

          {/* Thread header */}
          <div className="border-b border-ortaq-border bg-white px-4 py-2.5">
            <div className="flex items-center gap-2">
              <div>
                <h4 className="text-[0.8125rem] font-bold text-ortaq-ink">SGS Muayenesi</h4>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[0.5rem] text-ortaq-ink-soft">Bağlantılı:</span>
                  <span className="rounded bg-purple-50 border border-purple-200 px-1.5 py-px text-[0.5rem] font-medium text-purple-700">
                    Muayene Belgeleri
                  </span>
                  <span className="text-[0.5rem] text-ortaq-ink-soft">·</span>
                  <span className="text-[0.5rem] text-ortaq-ink-soft">4 mesaj · 2 dahili</span>
                </div>
              </div>
              <div className="ml-auto flex gap-2">
                <button className="rounded border border-ortaq-border px-2.5 py-1 text-[0.5625rem] font-medium text-ortaq-ink-soft hover:text-ortaq-ink transition-colors">
                  Konuyu Kapat
                </button>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-auto space-y-4 p-4">

            {/* Date separator */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-ortaq-border" />
              <span className="text-[0.5rem] text-ortaq-ink-soft">Dün, 12 Haziran</span>
              <div className="flex-1 h-px bg-ortaq-border" />
            </div>

            <MsgBubble
              flag="🇹🇷" company="Tosyalı Makine" from="E. Demir · Satış"
              text="SGS muayene randevusu 15 Haziran'da TÜV SÜD Thailand'dan alındı. Onaylıyor musunuz?"
              time="Dün 14:30"
              align="right"
            />

            <MsgBubble
              flag="🇩🇪" company="Bosch Production" from="H. Schmidt · Procurement"
              text="Randevuyu onaylıyoruz. SGS raporu tarafımıza gönderildiğinde inceleyeceğiz. BL için yeterli olacak mı?"
              time="Dün 16:15"
            />

            <MsgBubble
              flag="🇹🇷" company="Tosyalı Makine" from="E. Demir · Satış"
              text="Alıcı SGS konusunda çok titiz. TÜV'ün Türkçe versiyon yerine orijinal raporu göndermesini isteyelim. Müzakere etmeye gerek yok."
              time="Dün 16:50"
              internal
              align="right"
            />

            {/* Date separator */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-ortaq-border" />
              <span className="text-[0.5rem] text-ortaq-ink-soft">Bugün, 13 Haziran</span>
              <div className="flex-1 h-px bg-ortaq-border" />
            </div>

            <MsgBubble
              flag="🇹🇷" company="Tosyalı Makine" from="E. Demir · Satış"
              text="SGS raporu BL için yeterli olacak. Ek belge gerekmeyecek. Muayene tamamlanır tamamlanmaz paylaşacağım."
              time="Bugün 09:42"
              align="right"
            />

            {/* File chip inside a bubble */}
            <div className="flex gap-2">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ortaq-border text-[0.5rem] font-bold text-ortaq-ink-soft">🇩🇪</div>
              <div className="max-w-[80%]">
                <div className="mb-0.5 flex items-center gap-1.5">
                  <span className="text-[0.5625rem] font-semibold text-ortaq-ink">Bosch Production</span>
                  <span className="text-[0.5rem] text-ortaq-ink-soft">· H. Schmidt · Procurement</span>
                </div>
                <div className="rounded-xl bg-[#f5f5f4] px-3 py-2 text-[0.6875rem] leading-snug text-ortaq-ink">
                  <p>Teşekkürler. SGS raporuna şu belgeye referans olarak bakıyoruz:</p>
                  <div className="mt-1.5 flex items-center gap-2 rounded-lg border border-ortaq-border bg-white px-2 py-1.5 cursor-pointer hover:bg-ortaq-bg/30 transition-colors">
                    <span className="text-sm">📄</span>
                    <div>
                      <p className="text-[0.5625rem] font-semibold text-ortaq-ink">@SGS_TUV_Spec_v1.pdf</p>
                      <p className="text-[0.5rem] text-ortaq-ink-soft">1.2 MB · Muayene Belgeleri</p>
                    </div>
                    <span className="ml-auto rounded-full bg-amber-100 px-1 py-px text-[0.45rem] font-bold text-amber-700">BEKLENİYOR</span>
                  </div>
                </div>
                <span className="mt-0.5 block text-[0.5rem] text-ortaq-ink-soft">Bugün 10:05</span>
              </div>
            </div>

          </div>

          {/* Compose area */}
          <div className="border-t border-ortaq-border bg-white p-3">
            <div className="rounded-xl border border-ortaq-border bg-[#faf9f7] p-2">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[0.5625rem] font-medium text-ortaq-ink-soft">Konu:</span>
                <span className="rounded bg-purple-50 border border-purple-200 px-1.5 py-px text-[0.5rem] font-medium text-purple-700">
                  SGS Muayenesi
                </span>
                <div className="ml-auto flex items-center gap-2">
                  <span className="text-[0.5rem] text-ortaq-ink-soft">Görünürlük:</span>
                  <div className="flex rounded border border-ortaq-border overflow-hidden">
                    <button className="bg-ortaq-trust px-2 py-1 text-[0.5rem] font-semibold text-white">
                      İki taraf
                    </button>
                    <button className="bg-white px-2 py-1 text-[0.5rem] text-ortaq-ink-soft hover:bg-amber-50 hover:text-amber-700 transition-colors">
                      Dahili
                    </button>
                  </div>
                </div>
              </div>
              <div className="min-h-[40px] w-full text-[0.6875rem] text-ortaq-ink-soft">
                Mesaj yaz…
              </div>
              <div className="flex items-center justify-between mt-1">
                <button className="text-[0.5625rem] font-medium text-ortaq-ink-soft hover:text-ortaq-ink transition-colors">
                  @ Belge ekle
                </button>
                <button className="rounded-lg bg-ortaq-trust px-3 py-1.5 text-[0.625rem] font-semibold text-white hover:bg-ortaq-trust-deep transition-colors">
                  Gönder
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT — Context Pane ─────────────────────────────────────── */}
        <div className="w-[180px] shrink-0 bg-[#faf9f7]">
          <div className="border-b border-ortaq-border px-3 py-2.5">
            <p className="text-[0.5625rem] font-bold uppercase tracking-[0.07em] text-ortaq-ink-soft">
              Bu konu
            </p>
          </div>

          {/* Anchored document status */}
          <div className="px-3 py-3">
            <div className="rounded-lg border border-amber-200 bg-amber-50/60 p-2.5">
              <p className="text-[0.5rem] font-bold uppercase tracking-[0.07em] text-amber-600">Muayene Belgeleri</p>
              <div className="mt-2 space-y-1.5">
                {[
                  { doc: "SGS Raporu", status: "pending" as const, party: "Alıcı onayı bekleniyor" },
                ].map(d => (
                  <div key={d.doc}>
                    <div className="flex items-center justify-between">
                      <span className="text-[0.5625rem] font-semibold text-ortaq-ink">{d.doc}</span>
                    </div>
                    <p className="text-[0.5rem] text-amber-700 font-medium">{d.party}</p>
                  </div>
                ))}
              </div>
              <button className="mt-2 w-full rounded border border-amber-300 bg-white px-2 py-1 text-[0.5625rem] font-semibold text-amber-700 hover:bg-amber-50 transition-colors">
                Onay İste
              </button>
            </div>

            <div className="mt-3 rounded-lg border border-ortaq-border bg-white p-2">
              <p className="text-[0.5rem] text-ortaq-ink-soft">Bu konu</p>
              <p className="text-[0.5625rem] font-semibold text-ortaq-ink">Muayene aşamasını etkiliyor</p>
              <p className="mt-1 text-[0.5rem] text-ortaq-ink-soft leading-relaxed">
                SGS raporu tamamlandığında bu işlem Sevkiyat aşamasına geçebilir.
              </p>
            </div>
          </div>

          {/* Thread stats */}
          <div className="border-t border-ortaq-border px-3 py-2.5">
            <p className="text-[0.5625rem] font-bold uppercase tracking-[0.07em] text-ortaq-ink-soft mb-1.5">
              Bu konuda
            </p>
            <div className="space-y-1">
              <p className="text-[0.5625rem] text-ortaq-ink-soft">4 mesaj</p>
              <p className="text-[0.5625rem] text-ortaq-ink-soft">2 dahili not</p>
              <p className="text-[0.5625rem] text-ortaq-ink-soft">1 belge referansı</p>
              <p className="text-[0.5625rem] text-ortaq-ink-soft">2 taraf katıldı</p>
            </div>
          </div>
        </div>
      </div>
    </WindowChrome>
  );
}
