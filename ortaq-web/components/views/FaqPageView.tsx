"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/cn";
import { PublicShell } from "@/components/layout/PublicShell";
import { Container } from "@/components/ui/Section";
import { FAQ_ITEMS } from "@/lib/seo/faq";

const CATEGORIES = ["Tümü", "Ürün", "Erişim", "Veri", "Fiyatlandırma", "Güvenilirlik"];

function getCategory(item: (typeof FAQ_ITEMS)[number]): string {
  const id = item.id;
  if (["ortaq-ne", "ne-degil", "nasil-calisir", "hangi-belgeler", "alici-olmadan", "kac-islem"].includes(id))
    return "Ürün";
  if (["alici-notlari-gorur-mu", "ortaq-calisanlar-gorur-mu", "kim-ne-gorur", "kullanici-sayisi"].includes(id))
    return "Erişim";
  if (["veri-nerede", "verilerimi-cikararim", "ortaq-kapanirsa", "gdpr", "islem-bittikten-sonra"].includes(id))
    return "Veri";
  if (["ucret", "deneme"].includes(id)) return "Fiyatlandırma";
  return "Güvenilirlik";
}

const categoryColors: Record<string, string> = {
  "Ürün":          "border-blue-200 bg-blue-50 text-blue-700",
  "Erişim":        "border-purple-200 bg-purple-50 text-purple-700",
  "Veri":          "border-emerald-200 bg-emerald-50 text-emerald-700",
  "Fiyatlandırma": "border-amber-200 bg-amber-50 text-amber-700",
  "Güvenilirlik":  "border-ortaq-border bg-[#f5f5f3] text-ortaq-ink-soft",
};

export function FaqPageView() {
  const { i18n } = useTranslation();
  const isTR = (i18n.language ?? "tr").startsWith("tr");
  const [open, setOpen] = useState<string | null>(null);
  const [active, setActive] = useState("Tümü");

  const augmented = FAQ_ITEMS.map(f => ({ ...f, category: getCategory(f) }));
  const filtered = active === "Tümü" ? augmented : augmented.filter(f => f.category === active);

  return (
    <PublicShell stickyCta={false}>

      {/* ── HEADER ─────────────────────────────────────────────────── */}
      <section className="border-b border-ortaq-border bg-white">
        <Container wide>
          <div className="py-12 sm:py-16">
            <p className="text-[0.625rem] font-bold uppercase tracking-[0.1em] text-ortaq-trust">
              Sık Sorulan Sorular
            </p>
            <h1 className="mt-3 max-w-xl text-[2rem] font-bold tracking-[-0.03em] text-ortaq-ink leading-[1.05] sm:text-[2.625rem]">
              {isTR ? "Gerçek sorular." : "Real questions."}<br />
              <span className="text-ortaq-trust">
                {isTR ? "Doğrudan yanıtlar." : "Direct answers."}
              </span>
            </h1>
            <p className="mt-4 max-w-lg text-[0.9375rem] leading-relaxed text-ortaq-ink-muted">
              {isTR
                ? "Bu sorular gerçekten soruldu. Tanıtım için değil, merak gidermek için yazıldı."
                : "These questions were actually asked. Written to inform, not to promote."}
            </p>

            {/* Quick count */}
            <p className="mt-5 text-[0.6875rem] text-ortaq-ink-soft">
              {FAQ_ITEMS.length} soru · 5 kategori
            </p>
          </div>
        </Container>
      </section>

      {/* ── FAQ BODY ───────────────────────────────────────────────── */}
      <section className="bg-[#faf9f7]">
        <Container wide>
          <div className="py-10 sm:py-14">

            {/* Category filter */}
            <div className="flex flex-wrap gap-2 mb-8">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActive(cat)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-[0.6875rem] font-semibold transition-colors",
                    active === cat
                      ? "border-ortaq-trust bg-ortaq-trust/10 text-ortaq-trust"
                      : "border-ortaq-border bg-white text-ortaq-ink-soft hover:border-ortaq-border-strong hover:text-ortaq-ink",
                  )}
                >
                  {cat}
                  {cat !== "Tümü" && (
                    <span className="ml-1.5 text-[0.5rem] opacity-60">
                      {augmented.filter(f => f.category === cat).length}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* FAQ list */}
            <div className="divide-y divide-ortaq-border rounded-xl border border-ortaq-border bg-white overflow-hidden shadow-sm">
              {filtered.map((item) => (
                <div key={item.id} id={item.id}>
                  <button
                    onClick={() => setOpen(open === item.id ? null : item.id)}
                    className="group flex w-full items-start gap-4 px-5 py-5 text-left transition-colors hover:bg-[#faf9f7]"
                  >
                    {/* Category pill */}
                    <span className={cn(
                      "mt-[3px] shrink-0 rounded-full border px-1.5 py-px text-[0.5rem] font-bold whitespace-nowrap",
                      categoryColors[item.category] || categoryColors["Güvenilirlik"],
                    )}>
                      {item.category}
                    </span>

                    {/* Question */}
                    <span className="flex-1 text-[0.875rem] font-semibold text-ortaq-ink leading-snug group-hover:text-ortaq-trust transition-colors">
                      {item.question}
                    </span>

                    {/* Toggle icon */}
                    <span className={cn(
                      "mt-0.5 shrink-0 flex h-5 w-5 items-center justify-center rounded-full border border-ortaq-border text-[0.75rem] font-bold text-ortaq-ink-soft transition-all",
                      open === item.id ? "rotate-45 border-ortaq-trust bg-ortaq-trust/10 text-ortaq-trust" : "",
                    )}>+</span>
                  </button>

                  {open === item.id && (
                    <div className="border-t border-ortaq-border/50 bg-[#faf9f7] px-5 py-5">
                      <div className="pl-[5.5rem]">
                        <p className="text-[0.875rem] leading-relaxed text-ortaq-ink">
                          {item.answer}
                        </p>
                        {item.links && item.links.length > 0 && (
                          <div className="mt-4 flex flex-wrap gap-3">
                            {item.links.map(l => (
                              <Link
                                key={l.href}
                                href={l.href}
                                className="text-[0.75rem] font-semibold text-ortaq-trust hover:underline"
                              >
                                {l.label} →
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

          </div>
        </Container>
      </section>

      {/* ── CTA ────────────────────────────────────────────────────── */}
      <section className="border-t border-ortaq-border bg-white">
        <Container wide>
          <div className="py-10 sm:py-12">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[1rem] font-bold text-ortaq-ink">
                  {isTR ? "Burada yanıt bulamadıysanız:" : "Can't find your answer here?"}
                </p>
                <p className="mt-1 text-[0.8125rem] text-ortaq-ink-muted">
                  {isTR
                    ? "Demo görüşmesinde doğrudan sorun. Aktif bir işleminizi getirin — 30 dakika yeterli."
                    : "Ask directly in a demo. Bring one active deal — 30 minutes is enough."}
                </p>
              </div>
              <div className="flex flex-wrap gap-3 shrink-0">
                <Link
                  href="/guven"
                  className="inline-flex min-h-10 items-center justify-center rounded-lg border border-ortaq-border px-4 text-[0.8125rem] font-medium text-ortaq-ink transition-colors hover:border-ortaq-border-strong"
                >
                  Güven sayfası
                </Link>
                <Link
                  href="/demo"
                  className="inline-flex min-h-10 items-center justify-center rounded-lg bg-ortaq-trust px-6 text-[0.875rem] font-bold text-white shadow-sm transition-all hover:bg-ortaq-trust-deep active:scale-[0.98]"
                >
                  Demo İsteyin
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>

    </PublicShell>
  );
}
