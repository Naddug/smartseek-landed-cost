"use client";

import { cn } from "@/lib/cn";
import { WindowChrome, StatusBadge } from "./shared";

/* ─── Textile deal — Pamuk Kumaş Tedariki ─────────────────────────────── */

export function ScreenDocumentCenter() {
  return (
    <WindowChrome title="ORTAQ · Pamuk Kumaş Tedariki — TEX-2024-093 · Belgeler" tab="Belge Merkezi">
      <div className="flex divide-x divide-ortaq-border" style={{ minHeight: 480 }}>

        {/* ── LEFT — Document Navigator ────────────────────────────────── */}
        <div className="flex w-[220px] shrink-0 flex-col divide-y divide-ortaq-border bg-[#faf9f7] overflow-auto">

          {[
            {
              category: "Sözleşmeler",
              count: 3,
              pending: 0,
              docs: [
                { name: "SPA", ver: "v4", status: "confirmed" as const, label: "GEÇERLİ",  visibility: "İki taraf", struck: false },
                { name: "SPA", ver: "v3", status: "internal"  as const, label: "GEÇERSİZ", visibility: "—",         struck: true  },
                { name: "SPA", ver: "v2", status: "internal"  as const, label: "GEÇERSİZ", visibility: "—",         struck: true  },
              ],
            },
            {
              category: "Muayene Belgeleri",
              count: 2,
              pending: 1,
              docs: [
                { name: "SGS Raporu",    ver: "—",  status: "pending"   as const, label: "BEKLIYOR",  visibility: "Alıcı sorumlu", struck: false },
                { name: "Phytosanitary", ver: "v1", status: "confirmed" as const, label: "ONAYLANDI", visibility: "İki taraf",     struck: false },
              ],
            },
            {
              category: "Taşıma Belgeleri",
              count: 2,
              pending: 1,
              docs: [
                { name: "Packing List", ver: "v2", status: "confirmed" as const, label: "GEÇERLİ",      visibility: "İki taraf",    struck: false },
                { name: "BL Taslak",    ver: "v1", status: "internal"  as const, label: "YALNIZCA BİZ", visibility: "Paylaşılmadı", struck: false },
              ],
            },
            {
              category: "Finansal Belgeler",
              count: 2,
              pending: 0,
              docs: [
                { name: "Proforma Fatura",       ver: "v2", status: "confirmed" as const, label: "GEÇERLİ",  visibility: "İki taraf", struck: false },
                { name: "Certificate of Origin", ver: "v1", status: "confirmed" as const, label: "ONAYLANDI", visibility: "İki taraf", struck: false },
              ],
            },
          ].map(cat => (
            <div key={cat.category}>
              <div className="flex items-center justify-between px-3 py-2">
                <span className="text-[0.5625rem] font-bold uppercase tracking-[0.07em] text-ortaq-ink-soft">
                  {cat.category}
                </span>
                {cat.pending > 0 && (
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-amber-400 text-[0.45rem] font-bold text-white">
                    {cat.pending}
                  </span>
                )}
              </div>
              {cat.docs.map((doc, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex cursor-pointer items-start gap-2 border-t border-ortaq-border/50 px-3 py-2 transition-colors hover:bg-white",
                    i === 0 && cat.category === "Belgeler" && "bg-white",
                    doc.status === "internal" && doc.label === "YALNIZCA BİZ" && "bg-amber-50/50",
                  )}
                >
                  <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded bg-ortaq-border/50 text-[0.45rem] text-ortaq-ink-soft">
                    {doc.status === "confirmed" ? "✓" : doc.status === "pending" ? "…" : "○"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      "text-[0.6rem] font-semibold leading-tight",
                      doc.struck ? "text-ortaq-ink-soft/50 line-through" : "text-ortaq-ink",
                    )}>{doc.name} <span className="font-mono text-[0.55rem]">{doc.ver}</span></p>
                    <p className="text-[0.5rem] text-ortaq-ink-soft">{doc.visibility}</p>
                  </div>
                  <StatusBadge type={doc.status} label={doc.label} size="xs" />
                </div>
              ))}
              <div className="px-3 py-1.5">
                <button className="flex w-full items-center gap-1 rounded text-[0.5rem] font-medium text-ortaq-ink-soft hover:text-ortaq-trust transition-colors">
                  <span className="text-[0.625rem]">+</span> Belge ekle
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* ── RIGHT — Document Viewer ──────────────────────────────────── */}
        <div className="flex flex-1 flex-col">

          {/* Document toolbar */}
          <div className="flex items-center gap-3 border-b border-ortaq-border bg-white px-4 py-2.5">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[0.8125rem] font-semibold text-ortaq-ink">BL Taslak</span>
                <span className="rounded bg-ortaq-border/50 px-1.5 py-px text-[0.5rem] font-mono">v1</span>
                <StatusBadge type="internal" label="YALNIZCA BİZ" size="xs" />
              </div>
              <p className="text-[0.5625rem] text-ortaq-ink-soft">
                Yükleme: Kartal Çelik · M. Kaya · 12 Haz. 14:20
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button className="rounded-lg border border-ortaq-border px-3 py-1.5 text-[0.6875rem] font-medium text-ortaq-ink hover:bg-ortaq-bg transition-colors">
                İndir
              </button>
              <button className="rounded-lg bg-ortaq-trust px-3 py-1.5 text-[0.6875rem] font-semibold text-white hover:bg-ortaq-trust-deep transition-colors">
                Alıcıyla Paylaş
              </button>
            </div>
          </div>

          <div className="flex flex-1 divide-x divide-ortaq-border overflow-hidden">

            {/* PDF preview area */}
            <div className="flex flex-1 flex-col bg-[#f0efed] p-4">
              <div className="mx-auto w-full max-w-xs rounded-lg border border-ortaq-border bg-white shadow-sm overflow-hidden">

                {/* BL document mock */}
                <div className="border-b border-ortaq-border bg-[#1e3a5f] px-4 py-3 text-center">
                  <p className="text-[0.5rem] font-bold uppercase tracking-[0.1em] text-white/60">
                    BILL OF LADING — DRAFT
                  </p>
                  <p className="text-[0.75rem] font-bold text-white">BL-TEX-2024-093</p>
                  <div className="mt-1 inline-flex items-center gap-1 rounded-full bg-amber-400/20 px-2 py-0.5">
                    <span className="h-1 w-1 rounded-full bg-amber-400" />
                    <span className="text-[0.45rem] font-bold text-amber-200">TASLAK — ONAYSIZ</span>
                  </div>
                </div>

                <div className="p-3 space-y-3">
                  {[
                    ["Shipper",       "Şanlıurfa Tekstil A.Ş."],
                    ["Consignee",     "M&S Distribution UK Ltd."],
                    ["Port of Loading","Mersin, Turkey"],
                    ["Port of Discharge","Felixstowe, UK"],
                    ["Description",   "Cotton Fabric — 18,500 kg"],
                    ["Gross Weight",  "18,742 kg"],
                    ["Freight",       "Prepaid"],
                    ["BL Date",       "— (SGS onayı bekleniyor)"],
                  ].map(([key, val]) => (
                    <div key={key} className="grid grid-cols-2 gap-1 border-b border-ortaq-border/30 pb-1">
                      <span className="text-[0.5rem] font-bold uppercase text-ortaq-ink-soft/60">{key}</span>
                      <span className={cn(
                        "text-[0.5625rem]",
                        val.includes("bekleniyor") ? "text-amber-600 font-semibold" : "text-ortaq-ink",
                      )}>{val}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-ortaq-border bg-amber-50 px-3 py-2">
                  <div className="flex items-start gap-1.5">
                    <span className="text-amber-500 text-sm">⚠</span>
                    <div>
                      <p className="text-[0.5rem] font-bold text-amber-700">BL henüz paylaşılmadı</p>
                      <p className="text-[0.475rem] text-amber-600">SGS onayı alındıktan sonra alıcıya gönderilebilir.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Version history strip */}
            <div className="w-[160px] shrink-0 overflow-auto bg-[#faf9f7]">
              <div className="border-b border-ortaq-border px-3 py-2">
                <p className="text-[0.5625rem] font-bold uppercase tracking-[0.07em] text-ortaq-ink-soft">
                  Versiyon Geçmişi
                </p>
              </div>

              {[
                { ver: "v1",      date: "12 Haz. 14:20", by: "M. Kaya", company: "Kartal Çelik", flag: "🇹🇷", note: "İlk taslak",       current: true,  reviewed: false },
              ].map((v) => (
                <div key={v.ver} className={cn(
                  "border-b border-ortaq-border/50 px-3 py-2",
                  v.current && "bg-blue-50/60",
                )}>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className={cn(
                      "rounded px-1 py-px font-mono text-[0.5rem] font-bold",
                      v.current ? "bg-blue-100 text-blue-700" : "bg-ortaq-border text-ortaq-ink-soft line-through",
                    )}>{v.ver}</span>
                    {v.current && (
                      <span className="rounded-full bg-blue-100 px-1 py-px text-[0.45rem] font-bold text-blue-700">
                        Güncel
                      </span>
                    )}
                  </div>
                  <p className="text-[0.5rem] text-ortaq-ink-soft">{v.note}</p>
                  <p className="mt-0.5 text-[0.5rem] text-ortaq-ink-soft">
                    {v.flag} {v.company}
                  </p>
                  <p className="text-[0.475rem] text-ortaq-ink-soft/70">{v.by} · {v.date}</p>
                  {!v.reviewed && (
                    <p className="mt-0.5 text-[0.45rem] text-amber-600 font-medium">İncelenmedi</p>
                  )}
                </div>
              ))}

              {/* Tip */}
              <div className="px-3 py-2">
                <p className="text-[0.5rem] text-ortaq-ink-soft/60 leading-relaxed">
                  Yeni versiyon yüklendiğinde önceki otomatik olarak geçersiz sayılır.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </WindowChrome>
  );
}
