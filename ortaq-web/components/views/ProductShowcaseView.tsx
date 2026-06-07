"use client";

import { useState, useRef } from "react";
import { cn } from "@/lib/cn";
import { Container } from "@/components/ui/Section";
import { PublicShell } from "@/components/layout/PublicShell";

import { OperationalAct }            from "@/components/visuals/OperationalAct";
import { OperationalMemory }        from "@/components/visuals/OperationalMemory";
import { OrtaqPilot }              from "@/components/visuals/OrtaqPilot";
import { ScreenTransactionOverview } from "@/components/product-showcase/ScreenTransactionOverview";
import { ScreenDocumentCenter }      from "@/components/product-showcase/ScreenDocumentCenter";
import { ScreenCommunications }      from "@/components/product-showcase/ScreenCommunications";
import { ScreenApprovals }           from "@/components/product-showcase/ScreenApprovals";
import { ScreenPortfolioView }       from "@/components/product-showcase/ScreenPortfolioView";
import { ScreenCounterpartyView }    from "@/components/product-showcase/ScreenCounterpartyView";
import { ScreenAuditTrail }          from "@/components/product-showcase/ScreenAuditTrail";
import { ScreenMobileExperience }    from "@/components/product-showcase/ScreenMobileExperience";

/**
 * ProductShowcaseView — Phase 6
 *
 * 8 screens. Each screen is a full pixel-level product mockup.
 * Tab navigation selects the active screen.
 * Everything revolves around a transaction.
 *
 * Industry coverage:
 *  - Çelik (Steel)   — Transaction Overview, Counterparty View
 *  - Makine          — Communications
 *  - Tekstil         — Document Center
 *  - Gıda (Fındık)   — Approvals
 *  - Kimya           — Audit Trail
 *  - Karma           — Portfolio View, Mobile
 *
 * Visual quality references: Linear, Stripe, Mercury, Ramp, Notion.
 */

const TABS = [
  {
    id: "overview",
    label: "İşlem Özeti",
    sublabel: "Çelik · €840K",
    desc: "Tek işlemin tamamı — sonraki adım, belgeler, son mesajlar. Her şey tek ekranda.",
    component: ScreenTransactionOverview,
  },
  {
    id: "documents",
    label: "Belge Merkezi",
    sublabel: "Tekstil · €285K",
    desc: "Versiyonlu belge kayıtları. Hangisi geçerli, kim gördü, alıcıyla ne paylaşıldı.",
    component: ScreenDocumentCenter,
  },
  {
    id: "communications",
    label: "İletişim",
    sublabel: "Makine · €1.2M",
    desc: "Mesajlar işleme bağlı. Her konu bir belgeye veya aşamaya bağlanır. Genel inbox yok.",
    component: ScreenCommunications,
  },
  {
    id: "approvals",
    label: "Onaylar",
    sublabel: "Gıda · €520K",
    desc: "Resmi onay döngüsü. Onay bir kayıt — geri alınamaz. Red ve revizyon zorunlu not gerektirir.",
    component: ScreenApprovals,
  },
  {
    id: "portfolio",
    label: "Portföy",
    sublabel: "7 aktif işlem",
    desc: "Sabah 60 saniyede tüm işlemlerin durumu. 'Sıra kimde' kolonu — en kritik bilgi.",
    component: ScreenPortfolioView,
  },
  {
    id: "counterparty",
    label: "Karşı Taraf",
    sublabel: "Çelik · €840K",
    desc: "Alıcının tam olarak ne gördüğü. Dahili notlar gerçekten yok — bulanık değil, yok.",
    component: ScreenCounterpartyView,
  },
  {
    id: "audit",
    label: "Denetim İzi",
    sublabel: "Kimya · €390K",
    desc: "Her olayın kalıcı kaydı. Kim ne zaman ne yaptı — her iki taraf için aynı zaman çizelgesi.",
    component: ScreenAuditTrail,
  },
  {
    id: "mobile",
    label: "Mobil",
    sublabel: "Tüm sektörler",
    desc: "Kontrol etmek için — çalışmak için değil. 30 saniyede son durum. Onay mobilden tamamlanır.",
    component: ScreenMobileExperience,
  },
] as const;

/** Recommended starting path — Sprint 2 */
const QUICK_NAV = [
  { id: "counterparty" as const, label: "Karşı Taraf görünümü" },
  { id: "portfolio"    as const, label: "Portföy"               },
  { id: "overview"    as const, label: "İşlem Özeti"            },
] satisfies { id: typeof TABS[number]["id"]; label: string }[];

export function ProductShowcaseView() {
  const [activeId, setActiveId] = useState<typeof TABS[number]["id"]>("overview");
  const active = TABS.find(t => t.id === activeId)!;
  const ActiveScreen = active.component;
  const tabsRef = useRef<HTMLElement>(null);

  function handleQuickNav(id: typeof TABS[number]["id"]) {
    setActiveId(id);
    // Scroll tabs into view after React re-renders
    requestAnimationFrame(() => {
      tabsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  return (
    <PublicShell stickyCta={false}>

      {/* ── PAGE HEADER ─────────────────────────────────────────────────── */}
      <section className="border-b border-ortaq-border bg-ortaq-surface">
        <Container wide>
          <div className="py-12 sm:py-16">
            <div className="max-w-2xl">
              <p className="text-[0.625rem] font-bold uppercase tracking-[0.1em] text-ortaq-ink-soft">
                Ürün
              </p>
              <h1 className="mt-2 text-[2rem] font-bold tracking-[-0.03em] text-ortaq-ink leading-[1.05] sm:text-[2.625rem]">
                ORTAQ nasıl düşünüyor?<br />
                <span className="text-ortaq-trust">Ham bilgiden operasyonel anlayışa.</span>
              </h1>
              <p className="mt-4 max-w-xl text-[0.9375rem] leading-relaxed text-ortaq-ink-muted">
                Önce ham girdiyi görün. Sonra ORTAQ&apos;ın ne hatırladığını. Sonra ne anladığını. Sonra ne sorabileceğinizi. Modüller en sona — çünkü yetenekler sürecin sonucudur, kendisi değil.
              </p>
            </div>

            {/* Industry pills */}
            <div className="mt-6 flex flex-wrap gap-2">
              {["Çelik", "Makine", "Tekstil", "Gıda", "Kimya", "Ham Madde"].map(s => (
                <span key={s} className="rounded-full border border-ortaq-border bg-white px-3 py-1 text-[0.625rem] font-semibold text-ortaq-ink-soft">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ── STEP 1→2→3: Input → Understanding → Briefing ─────────────────────
          Act 1: Raw fragmented inputs (emails, messages, PDFs, notes)
          Act 2: ORTAQ processing (extract, connect, detect, understand)
          Act 3: Operational briefing output                               */}
      <OperationalAct />

      {/* ── STEP 2: MEMORY — What ORTAQ builds and keeps ────────────────────
          Context that would otherwise disappear is held here.
          Not a feature — it is the foundation that makes Pilot possible.  */}
      <OperationalMemory />

      {/* ── STEP 4: PILOT — Ask ORTAQ about your operation ──────────────────
          Static concept. No live AI needed. Shows the Q&A interface.
          Visitor should understand: "I can ask this thing about my work." */}
      <OrtaqPilot variant="product" />

      {/* ── STEP 5: CAPABILITIES — Module tabs ──────────────────────────────
          Only here do modules appear. Tabs are supporting evidence.
          Not the story. The story was above.                              */}

      {/* ── GUIDANCE STRIP — recommended starting path ──────────────────────
          Position: between sector pills and module tabs.
          Goal: give first-time visitors a starting point and reduce
          decision paralysis from 8 equal-weight tabs.                     */}
      <div className="border-b border-ortaq-border bg-white">
        <Container wide>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 py-2.5">
            <span className="text-[0.5625rem] font-medium text-ortaq-ink-soft/70 shrink-0">
              İlk kez mi bakıyorsunuz?
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {QUICK_NAV.map((item, i) => (
                <button
                  key={item.id}
                  onClick={() => handleQuickNav(item.id)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-full border px-3 py-1 text-[0.5625rem] font-semibold transition-colors",
                    activeId === item.id
                      ? "border-ortaq-trust/40 bg-ortaq-trust/8 text-ortaq-trust"
                      : "border-ortaq-border bg-white text-ortaq-ink-soft hover:border-ortaq-trust/40 hover:text-ortaq-trust",
                  )}
                >
                  <span className="font-mono text-[0.4375rem] text-ortaq-ink-soft/40">{i + 1}</span>
                  {item.label}
                </button>
              ))}
            </div>
            <span className="ml-auto hidden text-[0.5rem] text-ortaq-ink-soft/40 sm:inline">
              Tüm sekizini görmek için aşağıdaki sekme satırını kullanın
            </span>
          </div>
        </Container>
      </div>

      {/* ── TAB NAVIGATION ──────────────────────────────────────────────── */}
      <section ref={tabsRef} className="sticky top-[48px] z-30 border-b border-ortaq-border bg-white shadow-[0_1px_0_0_rgb(20_19_16/0.06)]">
        <Container wide>
          <div className="flex overflow-x-auto" style={{ scrollbarWidth: "none" }}>
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveId(tab.id)}
                className={cn(
                  "group flex shrink-0 flex-col items-start border-b-2 px-4 py-3 text-left transition-colors",
                  activeId === tab.id
                    ? "border-ortaq-trust text-ortaq-trust"
                    : "border-transparent text-ortaq-ink-soft hover:border-ortaq-border-strong hover:text-ortaq-ink",
                )}
              >
                <span className={cn(
                  "text-[0.75rem] font-semibold leading-tight transition-colors",
                  activeId === tab.id ? "text-ortaq-trust" : "text-ortaq-ink",
                )}>
                  {tab.label}
                </span>
                <span className="text-[0.5rem] font-medium text-ortaq-ink-soft leading-none mt-0.5">
                  {tab.sublabel}
                </span>
              </button>
            ))}
          </div>
        </Container>
      </section>

      {/* ── ACTIVE SCREEN ───────────────────────────────────────────────── */}
      <section className="border-b border-ortaq-border bg-[#f0efed]">
        <Container wide>
          <div className="py-8">

            {/* Screen description */}
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-[1.25rem] font-bold tracking-[-0.02em] text-ortaq-ink">
                    {active.label}
                  </h2>
                  <span className="rounded-full border border-ortaq-border bg-white px-2.5 py-0.5 text-[0.5625rem] font-semibold text-ortaq-ink-soft">
                    {active.sublabel}
                  </span>
                </div>
                <p className="mt-1 max-w-lg text-[0.8125rem] leading-relaxed text-ortaq-ink-muted">
                  {active.desc}
                </p>
              </div>

              {/* Screen counter */}
              <div className="shrink-0 text-right">
                <p className="font-mono text-[0.5rem] text-ortaq-ink-soft">
                  {String(TABS.findIndex(t => t.id === activeId) + 1).padStart(2, "0")} / {String(TABS.length).padStart(2, "0")}
                </p>
              </div>
            </div>

            {/* The screen */}
            <ActiveScreen />

            {/* Tab dots navigation */}
            <div className="mt-6 flex items-center justify-center gap-2">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveId(tab.id)}
                title={tab.label}
                className={cn(
                    "rounded-full transition-all",
                    activeId === tab.id
                      ? "h-2 w-6 bg-ortaq-trust"
                      : "h-2 w-2 bg-ortaq-border hover:bg-ortaq-border-strong",
                  )}
                />
              ))}
            </div>

            {/* Prev / Next */}
            <div className="mt-4 flex items-center justify-between">
              <button
                onClick={() => {
                  const idx = TABS.findIndex(t => t.id === activeId);
                  if (idx > 0) setActiveId(TABS[idx - 1].id);
                }}
                className={cn(
                  "flex items-center gap-2 rounded-lg border border-ortaq-border bg-white px-4 py-2 text-[0.75rem] font-medium text-ortaq-ink transition-colors hover:bg-ortaq-bg",
                  TABS.findIndex(t => t.id === activeId) === 0 && "invisible",
                )}
              >
                ← {TABS[Math.max(0, TABS.findIndex(t => t.id === activeId) - 1)].label}
              </button>
              <button
                onClick={() => {
                  const idx = TABS.findIndex(t => t.id === activeId);
                  if (idx < TABS.length - 1) setActiveId(TABS[idx + 1].id);
                }}
                className={cn(
                  "flex items-center gap-2 rounded-lg border border-ortaq-border bg-white px-4 py-2 text-[0.75rem] font-medium text-ortaq-ink transition-colors hover:bg-ortaq-bg",
                  TABS.findIndex(t => t.id === activeId) === TABS.length - 1 && "invisible",
                )}
              >
                {TABS[Math.min(TABS.length - 1, TABS.findIndex(t => t.id === activeId) + 1)].label} →
              </button>
            </div>
          </div>
        </Container>
      </section>

      {/* ── DESIGN PRINCIPLES ───────────────────────────────────────────── */}
      <section className="border-b border-ortaq-border bg-white">
        <Container wide>
          <div className="py-12">
            <h3 className="mb-8 text-[1.125rem] font-bold text-ortaq-ink">
              Tasarım ilkeleri
            </h3>
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
              {[
                {
                  title: "İşlem merkezdedir",
                  body: "ORTAQ, Slack değil — genel mesajlaşma yok. CRM değil — bağımsız iletişim kaydı yok. İşlem yoksa kayıt da yok.",
                },
                {
                  title: "Mesajlar işleme bağlıdır",
                  body: "Her mesaj bir işleme, her konu bir belgeye veya aşamaya bağlanır. 'Genel inbox' yoktur. Bağlamı kayıp mesaj olmaz.",
                },
                {
                  title: "İki taraf aynı kaydı görür",
                  body: "Alıcı ve satıcı aynı belgeyi, aynı durumu görür. Dahili notlar gerçekten yok — bulanık değil, var olmaz.",
                },
                {
                  title: "Durum bir kişi adını içerir",
                  body: "'SGS: Bekliyor' değil — 'SGS: Hamburg Steel onayı bekleniyor.' Kim beklediğini bilmeden durum anlamsızdır.",
                },
              ].map(p => (
                <div key={p.title}>
                  <div className="mb-2 h-0.5 w-8 bg-ortaq-trust" />
                  <h4 className="mb-1.5 text-[0.8125rem] font-bold text-ortaq-ink">{p.title}</h4>
                  <p className="text-[0.75rem] leading-relaxed text-ortaq-ink-muted">{p.body}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────────── */}
      <section className="border-b border-ortaq-border bg-ortaq-ink">
        <Container wide>
          <div className="py-14 text-center sm:py-18">
            <h2 className="text-[1.75rem] font-bold tracking-[-0.03em] text-ortaq-cream leading-[1.1] sm:text-[2.25rem]">
              Kendi işleminizde görün.
            </h2>
            <p className="mx-auto mt-3 max-w-md text-[0.9375rem] leading-relaxed text-ortaq-cream/60">
              Aktif bir işleminizi seçin. Belgelerini, onaylarını ve iletişimini birlikte görün.
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <a
                href="/demo"
                className="inline-flex min-h-11 items-center justify-center rounded-lg bg-ortaq-trust px-8 text-[0.9375rem] font-bold text-white shadow-sm transition-all hover:bg-ortaq-trust-muted active:scale-[0.98]"
              >
                Demo İsteyin
              </a>
              <a
                href="/nasil-calisir"
                className="inline-flex min-h-11 items-center justify-center rounded-lg border border-ortaq-cream/20 px-6 text-[0.9375rem] font-medium text-ortaq-cream/80 transition-colors hover:border-ortaq-cream/40 hover:text-ortaq-cream"
              >
                Nasıl çalışır →
              </a>
            </div>
          </div>
        </Container>
      </section>

    </PublicShell>
  );
}
