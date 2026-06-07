"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/cn";
import { Container } from "@/components/ui/Section";

/**
 * CounterpartyPreview — Homepage Sprint 1
 *
 * Position: after TrustStrip, before Real Example / "Son durum ne?" section.
 *
 * Data source: exact entity names, documents, statuses, and internal note
 * from ScreenCounterpartyView (/urun Karşı Taraf module). No new data introduced.
 *
 * Entities: Kartal Çelik 🇹🇷 (seller) ↔ Hamburg Steel 🇩🇪 (buyer)
 * Key row: BL Taslak v2 — not shared with buyer (the visual anchor)
 * Internal note: "Alıcı SGS konusunda titiz…"
 */

const DOCS_TR = [
  { name: "SPA",          ver: "v12", sellerLabel: "Onaylandı",    buyerLabel: "Onaylandı",    shared: true  },
  { name: "SGS Raporu",   ver: "v1",  sellerLabel: "Bekliyor",     buyerLabel: "Bekliyor",     shared: true  },
  { name: "BL Taslak",    ver: "v2",  sellerLabel: "Yalnızca biz", buyerLabel: null,            shared: false },
  { name: "LC",           ver: "—",   sellerLabel: "Hazırlanıyor", buyerLabel: "Hazırlanıyor", shared: true  },
  { name: "Packing List", ver: "v3",  sellerLabel: "Onaylandı",    buyerLabel: "Onaylandı",    shared: true  },
] as const;

const DOCS_EN = [
  { name: "SPA",          ver: "v12", sellerLabel: "Approved",     buyerLabel: "Approved",     shared: true  },
  { name: "SGS Report",   ver: "v1",  sellerLabel: "Pending",      buyerLabel: "Pending",      shared: true  },
  { name: "BL Draft",     ver: "v2",  sellerLabel: "Only us",      buyerLabel: null,            shared: false },
  { name: "LC",           ver: "—",   sellerLabel: "In progress",  buyerLabel: "In progress",  shared: true  },
  { name: "Packing List", ver: "v3",  sellerLabel: "Approved",     buyerLabel: "Approved",     shared: true  },
] as const;

const statusStyle = (label: string) => {
  if (label.includes("Onay") || label === "Approved")    return "bg-emerald-100 text-emerald-700";
  if (label.includes("Bekli") || label === "Pending")    return "bg-amber-100  text-amber-700";
  if (label.includes("Hazır") || label === "In progress") return "bg-sky-100   text-sky-700";
  if (label.includes("Yalnız") || label === "Only us")   return "bg-amber-100  text-amber-700";
  return "bg-gray-100 text-gray-500";
};

export function CounterpartyPreview() {
  const { i18n } = useTranslation();
  const isTR = (i18n.language ?? "tr").startsWith("tr");
  const docs = isTR ? DOCS_TR : DOCS_EN;

  return (
    <section className="border-b border-ortaq-border bg-[#faf9f7]">
      <Container wide>
        <div className="py-14 sm:py-18">

          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-[1.5rem] font-bold tracking-[-0.03em] text-ortaq-ink leading-[1.15] sm:text-[1.875rem]">
              {isTR ? (
                <>İki taraf. Tek kayıt.<br />
                  <span className="text-ortaq-trust">Ama herkes sadece görmesi gerekeni görür.</span>
                </>
              ) : (
                <>Two parties. One record.<br />
                  <span className="text-ortaq-trust">But each side sees only what they should.</span>
                </>
              )}
            </h2>
            <p className="mt-2 max-w-lg text-[0.9375rem] leading-relaxed text-ortaq-ink-muted">
              {isTR
                ? "Alıcınızın hangi belgeyi gördüğünü siz kontrol edersiniz. Dahili not alıcıya görünmez — bulanık değil, gerçekten yok."
                : "You control which documents your buyer sees. Internal notes are not blurred for the buyer — they are genuinely not there."}
            </p>
          </div>

          {/* Split table */}
          <div className="overflow-hidden rounded-2xl border border-ortaq-border bg-white shadow-sm">

            {/* Column headers */}
            <div className="grid grid-cols-2 divide-x divide-ortaq-border border-b border-ortaq-border">
              <div className="bg-emerald-50 px-5 py-3">
                <div className="flex items-center gap-2">
                  <span className="text-base">🇹🇷</span>
                  <span className="text-[0.75rem] font-bold text-emerald-800">Kartal Çelik</span>
                  <span className="rounded-full bg-emerald-100 px-2 py-px text-[0.5rem] font-bold tracking-[0.04em] text-emerald-700">
                    {isTR ? "SİZİN GÖRÜNÜMÜNÜZ" : "YOUR VIEW"}
                  </span>
                </div>
                <p className="mt-0.5 text-[0.5625rem] text-emerald-700/70">
                  {isTR ? "Tüm belgeler — dahili notlar dahil" : "All documents — including internal notes"}
                </p>
              </div>
              <div className="bg-slate-50 px-5 py-3">
                <div className="flex items-center gap-2">
                  <span className="text-base">🇩🇪</span>
                  <span className="text-[0.75rem] font-bold text-slate-600">Hamburg Steel</span>
                  <span className="rounded-full border border-slate-200 bg-white px-2 py-px text-[0.5rem] font-semibold tracking-[0.04em] text-slate-500">
                    {isTR ? "ALICININ GÖRÜNÜMÜ" : "BUYER'S VIEW"}
                  </span>
                </div>
                <p className="mt-0.5 text-[0.5625rem] text-slate-400">
                  {isTR ? "Yalnızca paylaşılan belgeler" : "Only shared documents"}
                </p>
              </div>
            </div>

            {/* Document rows */}
            <div className="divide-y divide-ortaq-border/40">
              {docs.map((doc) => (
                <div
                  key={doc.name}
                  className={cn(
                    "grid grid-cols-2 divide-x divide-ortaq-border/40",
                    !doc.shared && "border-l-[3px] border-l-amber-400",
                  )}
                >
                  {/* Seller cell */}
                  <div className={cn(
                    "flex items-center justify-between gap-3 px-5 py-3",
                    !doc.shared ? "bg-amber-50/60" : "bg-white",
                  )}>
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-[0.75rem] font-semibold text-ortaq-ink truncate">{doc.name}</span>
                      <span className="shrink-0 font-mono text-[0.5625rem] text-ortaq-ink-soft">{doc.ver}</span>
                    </div>
                    <span className={cn(
                      "shrink-0 rounded-full px-2 py-0.5 text-[0.5rem] font-bold whitespace-nowrap",
                      !doc.shared
                        ? "bg-amber-100 text-amber-700"
                        : statusStyle(doc.sellerLabel),
                    )}>
                      {doc.sellerLabel}
                    </span>
                  </div>

                  {/* Buyer cell */}
                  <div className="flex items-center justify-between gap-3 bg-white px-5 py-3">
                    {doc.shared ? (
                      <>
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-[0.75rem] font-semibold text-ortaq-ink truncate">{doc.name}</span>
                          <span className="shrink-0 font-mono text-[0.5625rem] text-ortaq-ink-soft">{doc.ver}</span>
                        </div>
                        <span className={cn(
                          "shrink-0 rounded-full px-2 py-0.5 text-[0.5rem] font-bold whitespace-nowrap",
                          statusStyle(doc.buyerLabel ?? ""),
                        )}>
                          {doc.buyerLabel}
                        </span>
                      </>
                    ) : (
                      /* KEY ROW — truly absent, not blurred */
                      <div className="flex w-full items-center gap-3">
                        <span className="text-[0.75rem] font-semibold text-ortaq-ink/20 line-through">
                          {doc.name} {doc.ver}
                        </span>
                        <span className="ml-auto shrink-0 text-[0.5625rem] text-ortaq-ink/30">
                          {isTR ? "Bu belge alıcıya görünmüyor" : "This document is not visible to the buyer"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Internal note row */}
            <div className="grid grid-cols-2 divide-x divide-ortaq-border/40 border-t border-ortaq-border/40">
              {/* Seller sees the internal note */}
              <div className="flex items-start gap-3 border-l-[3px] border-l-amber-400 bg-amber-50/60 px-5 py-3.5">
                <div className="min-w-0">
                  <p className="text-[0.5rem] font-bold uppercase tracking-[0.07em] text-amber-600">
                    {isTR ? "Dahili not" : "Internal note"}
                  </p>
                  <p className="mt-0.5 text-[0.6875rem] italic leading-snug text-amber-800">
                    {isTR
                      ? "Alıcı SGS konusunda titiz. Türkçe yerine orijinal rapor isteyelim."
                      : "Buyer is strict about SGS. Let's request the original report, not the Turkish translation."}
                  </p>
                </div>
              </div>
              {/* Buyer side — absent */}
              <div className="flex items-center justify-center bg-white px-5 py-3.5">
                <span className="text-[0.5625rem] text-ortaq-ink/25">
                  {isTR ? "— alıcıya görünmüyor —" : "— not visible to buyer —"}
                </span>
              </div>
            </div>

          </div>

          {/* CTA below */}
          <div className="mt-6 flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
            <Link
              href="/urun"
              className="inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-ortaq-border-strong px-4 text-[0.875rem] font-semibold text-ortaq-ink transition-colors hover:border-ortaq-trust hover:text-ortaq-trust"
            >
              {isTR ? "Üründe nasıl çalıştığını görün →" : "See how it works in the product →"}
            </Link>
            <p className="text-[0.75rem] text-ortaq-ink-muted">
              {isTR ? "8 modül, 6 farklı sektör" : "8 modules, 6 industries"}
            </p>
          </div>

        </div>
      </Container>
    </section>
  );
}
