"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/cn";
import { Container } from "@/components/ui/Section";
import { PublicShell } from "@/components/layout/PublicShell";

import { TransformationHero } from "@/components/visuals/TransformationHero";
import { DayInLife }          from "@/components/visuals/DayInLife";
import { DealJourney }        from "@/components/visuals/DealJourney";
import { FourScreens }        from "@/components/visuals/FourScreens";
import { RiskBoard }          from "@/components/visuals/RiskBoard";

/**
 * OrtaqHomeView — V8: Two-company positioning throughout.
 *
 * Category: Şirketler Arası İşlem Kaydı
 * (Company-to-Company Transaction Record)
 *
 * POSITIONING RULE: every sentence must name BOTH sides of the deal.
 * The counterparty (BestBuild, the buyer, the supplier) is not a data point.
 * The counterparty is the whole point of the product.
 *
 * Section 1 — "BestBuild hangi sözleşmeyi görüyorsa, siz de aynısını görüyorsunuz."
 * Section 2 — "Siz v12 diyorsunuz. BestBuild v10 diyor." (two-company conflict)
 * Section 3 — "Aynı işlem. İki taraf. Tek kayıt." (shared deal record)
 * Section 4 — "İstanbul ne biliyorsa Hamburg da biliyor." (shared visibility)
 * Section 5 — "Bugün kimin elinde?" (risk board with counterparty column)
 * Section 6 — "BestBuild'e de artık 'son durum ne?' diye e-posta atmıyorsunuz."
 *
 * Language rules — NEVER:
 *   platform · workflow · dashboard · koordinasyon · ekosistem
 * ALWAYS:
 *   her iki taraf · BestBuild · karşı taraf · alıcı · satıcı
 *   SGS · BL · LC · sözleşme · sevkiyat · ödeme
 */

export function OrtaqHomeView() {
  const { t, i18n } = useTranslation();
  const isTR = (i18n.language ?? "tr").startsWith("tr");

  return (
    <PublicShell stickyCta={false}>

      {/* ══ SECTION 1 ════════════════════════════════════════════════════════
          Positioning statement: ORTAQ is the shared transaction record.
          Both sides see the same version. That is the category definition.  */}
      <section className="relative border-b border-ortaq-border bg-ortaq-surface">
        <Container wide>
          <div className="py-12 sm:py-16">

            <div className="mb-8 text-center">
              {/* Eyebrow — names both sides immediately */}
              <div className="mb-4 flex justify-center">
                <div className="inline-flex items-center gap-2 rounded-full border border-ortaq-trust/30 bg-ortaq-trust/6 px-3 py-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-ortaq-trust" />
                  <span className="text-[0.6875rem] font-semibold text-ortaq-trust">
                    {t("home.hero.eyebrow")}
                  </span>
                </div>
              </div>

              {/* Hero headline — the category claim, not the pain cry */}
              <h1 className="mx-auto max-w-3xl font-body font-bold tracking-[-0.04em] text-ortaq-ink leading-[1.02] text-[2.25rem] sm:text-[3rem]">
                {t("home.hero.h1a")}<br />
                <span className="text-ortaq-trust">{t("home.hero.h1b")}</span>
              </h1>

              {/* Sub — names the shared record explicitly */}
              <p className="mx-auto mt-5 max-w-[34rem] text-[1rem] leading-[1.7] text-ortaq-ink-muted">
                {t("home.hero.sub")}
              </p>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/demo"
                  className="inline-flex min-h-11 items-center justify-center rounded-lg bg-ortaq-ink px-7 text-[0.9375rem] font-semibold text-ortaq-cream shadow-sm transition-all hover:bg-ortaq-ink-muted active:scale-[0.98]"
                >
                  {t("home.hero.cta")}
                </Link>
                <Link
                  href="/nasil-calisir"
                  className="inline-flex min-h-11 items-center justify-center rounded-lg border border-ortaq-border-strong px-5 text-[0.9375rem] font-medium text-ortaq-ink transition-colors hover:bg-ortaq-bg"
                >
                  {t("home.hero.ctaSecondary")} →
                </Link>
              </div>
            </div>

            {/* The transformation — both panels show the same deal identity */}
            <TransformationHero />
          </div>
        </Container>
      </section>

      {/* ══ SECTION 2 ════════════════════════════════════════════════════════
          The two-company problem. Not internal team confusion.
          Siz v12 diyorsunuz. BestBuild v10 diyor. Hangisi doğru?            */}
      <SectionWrap
        title={isTR
          ? "Siz v12 diyorsunuz. BestBuild v10 diyor."
          : "You say v12. BestBuild says v10."}
        sub={isTR
          ? "İki şirket aynı işlemi yönetiyor ama her taraf farklı bir belgeye, farklı bir versiyona bakıyor. Bu problem her aktif işlemde var."
          : "Two companies managing the same deal, each looking at a different document and a different version. This problem exists in every active deal."}
        tone="white"
      >
        <DayInLife />
      </SectionWrap>

      {/* ══ SECTION 3 ════════════════════════════════════════════════════════
          One deal. Two parties. One record.
          Show the deal journey with both sides' responsibility at each stage. */}
      <SectionWrap
        title={isTR
          ? "Aynı işlem. İki taraf. Tek kayıt."
          : "Same deal. Two parties. One record."}
        sub={isTR
          ? "Tekliften ödemeye, her adımda hangi belge var, kimin elinde ve ne durumda — her iki taraf aynı anda görüyor."
          : "From offer to payment, which document exists at each stage, with whom, at what status — both parties see this at the same time."}
        tone="warm"
      >
        <DealJourney />
      </SectionWrap>

      {/* ══ SECTION 4 ════════════════════════════════════════════════════════
          The shared visibility claim.
          İstanbul ne biliyorsa Hamburg da biliyor. Aynı anda.               */}
      <SectionWrap
        title={isTR
          ? "İstanbul ne biliyorsa Hamburg da biliyor."
          : "What Istanbul knows, Hamburg knows too."}
        sub={isTR
          ? "Tedarikçi, alıcı, lojistik ve finans — aynı işlemi, aynı anda, aynı ekranda görüyor. Farklı PDF yok. Farklı versiyon yok."
          : "Supplier, buyer, logistics and finance — all seeing the same deal at the same time on the same screen. No different PDF. No different version."}
        tone="white"
      >
        <FourScreens />
      </SectionWrap>

      {/* ══ SECTION 5 ════════════════════════════════════════════════════════
          Risk board — names which SIDE each blocker is on.
          "5 gündür cevap yok" → "5 gündür cevap yok · BestBuild'de"         */}
      <SectionWrap
        title={isTR
          ? "Bugün kimin elinde?"
          : "Whose turn is it today?"}
        sub={isTR
          ? "Hangi işlem sizde bekliyor, hangi işlem karşı tarafta — sabah 08:30'da, hiç kimseye sormadan."
          : "Which deal is waiting on your side, which is waiting on your counterparty — at 08:30, without asking anyone."}
        tone="warm"
      >
        <RiskBoard />
      </SectionWrap>

      {/* ══ SECTION 6 — CTA ══════════════════════════════════════════════════
          The emotional close names the counterparty explicitly.
          Both sides. Same screen. No more asking each other.                 */}
      <section className="border-t border-ortaq-border bg-ortaq-ink">
        <Container wide>
          <div className="py-16 sm:py-20">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">

              {/* Left: the cross-company messages that disappear */}
              <div>
                <p className="mb-4 text-[0.5rem] font-bold uppercase tracking-[0.1em] text-ortaq-cream/40">
                  {isTR ? "Şu an böyle oluyor" : "This is what happens now"}
                </p>
                <div className="space-y-2">
                  {(isTR ? [
                    { app: "Email",    from: "siz → BestBuild", text: "SPA'nın hangi versiyonu bizde? v12 mi v10 mu?" },
                    { app: "WhatsApp", from: "CEO → Ops",        text: "BestBuild'den SGS haberi var mı?" },
                    { app: "Email",    from: "BestBuild → siz",  text: "BL taslağını gönderdik, onayladınız mı?" },
                    { app: "WhatsApp", from: "Finans → Satış",   text: "LC için hangi BL'yi kullanacağız?" },
                    { app: "Email",    from: "siz → BestBuild",  text: "Son durum ne? Sevkiyat tarihi değişti mi?" },
                  ] : [
                    { app: "Email",    from: "you → BestBuild", text: "Which version of the SPA do we have? v12 or v10?" },
                    { app: "WhatsApp", from: "CEO → Ops",        text: "Any news from BestBuild on the SGS?" },
                    { app: "Email",    from: "BestBuild → you",  text: "We sent the BL draft, did you approve it?" },
                    { app: "WhatsApp", from: "Finance → Sales",  text: "Which BL do we use for the LC?" },
                    { app: "Email",    from: "you → BestBuild",  text: "What is the latest status? Has shipment date changed?" },
                  ]).map((msg, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 rounded-xl border border-ortaq-cream/10 bg-ortaq-cream/5 px-4 py-3"
                      style={{ opacity: Math.max(0.35, 1 - i * 0.14) }}
                    >
                      <AppBadge app={msg.app} />
                      <div className="min-w-0">
                        <p className="text-[0.4rem] font-bold text-ortaq-cream/40 italic">{msg.from}</p>
                        <p className="text-[0.5625rem] text-ortaq-cream/75">{msg.text}</p>
                      </div>
                    </div>
                  ))}
                  <p className="pt-2 text-[0.5rem] font-semibold text-red-400/80">
                    {isTR
                      ? "İki şirket. Aynı işlem. Her gün ayrı ayrı soruluyor."
                      : "Two companies. Same deal. Asked separately every day."}
                  </p>
                </div>
              </div>

              {/* Right: CTA — clean, outcome-first */}
              <div className="text-center lg:text-left">
                <p className="mb-3 text-[0.5rem] font-bold uppercase tracking-[0.1em] text-ortaq-trust">
                  {isTR ? "ORTAQ ile" : "With ORTAQ"}
                </p>

                <h2 className="text-[1.875rem] font-bold tracking-[-0.03em] text-ortaq-cream leading-[1.1] sm:text-[2.25rem]">
                  {t("home.cta.h2a")}<br />
                  <span className="text-ortaq-trust">{t("home.cta.h2b")}</span>
                </h2>

                <p className="mt-4 text-[0.9375rem] leading-relaxed text-ortaq-cream/70">
                  {t("home.cta.sub")}
                </p>

                {/* The shared record — shown with both companies' perspective */}
                <div className="mt-6 overflow-hidden rounded-2xl border border-ortaq-cream/10 bg-ortaq-cream/5">
                  <div className="flex items-center justify-between border-b border-ortaq-cream/10 px-4 py-2.5">
                    <p className="text-[0.4375rem] font-bold uppercase tracking-[0.07em] text-ortaq-cream/50">
                      {isTR ? "Çelik Tedariki · BestBuild GmbH · €840.000" : "Steel Supply · BestBuild GmbH · €840,000"}
                    </p>
                    <div className="flex items-center gap-1">
                      <span className="h-1 w-1 rounded-full bg-emerald-400" />
                      <span className="text-[0.375rem] font-semibold text-emerald-400">
                        {isTR ? "Her iki taraf görüyor" : "Both parties see this"}
                      </span>
                    </div>
                  </div>
                  <div className="divide-y divide-ortaq-cream/[0.06]">
                    {(isTR ? [
                      { label: "Sözleşme", value: "SPA v12 · İmzalı · Her iki taraf",      color: "text-emerald-400" },
                      { label: "SGS",      value: "Bekleniyor · BestBuild'de",              color: "text-amber-400" },
                      { label: "BL",       value: "28 Haziran · SGS onayı sonrası",          color: "text-sky-400" },
                      { label: "Ödeme",    value: "LC hazırlanıyor · HSBC Dubai",           color: "text-amber-400" },
                      { label: "Sıradaki", value: "SGS · BestBuild sorumlu",                color: "text-ortaq-trust" },
                    ] : [
                      { label: "Contract", value: "SPA v12 · Signed · Both parties",        color: "text-emerald-400" },
                      { label: "SGS",      value: "Pending · With BestBuild",                color: "text-amber-400" },
                      { label: "BL",       value: "June 28 · After SGS approval",           color: "text-sky-400" },
                      { label: "Payment",  value: "LC being prepared · HSBC Dubai",         color: "text-amber-400" },
                      { label: "Next",     value: "SGS · BestBuild responsible",            color: "text-ortaq-trust" },
                    ]).map((row) => (
                      <div key={row.label} className="flex items-center justify-between gap-3 px-4 py-2.5">
                        <span className="text-[0.4375rem] font-semibold text-ortaq-cream/50">{row.label}</span>
                        <span className={cn("text-right text-[0.5rem] font-bold", row.color)}>{row.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap justify-center gap-3 lg:justify-start">
                  <Link
                    href="/demo"
                    className="inline-flex min-h-11 items-center justify-center rounded-lg bg-ortaq-trust px-7 text-[0.9375rem] font-bold text-white shadow-sm transition-all hover:bg-ortaq-trust-soft active:scale-[0.98]"
                  >
                    {t("home.cta.primary")}
                  </Link>
                  <Link
                    href="/nasil-calisir"
                    className="inline-flex min-h-11 items-center justify-center rounded-lg border border-ortaq-cream/20 px-5 text-[0.9375rem] font-medium text-ortaq-cream/80 transition-colors hover:border-ortaq-cream/40 hover:text-ortaq-cream"
                  >
                    {t("home.cta.secondary")} →
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </Container>
      </section>

    </PublicShell>
  );
}

/* ── Section wrapper ──────────────────────────────────────────────────────── */

function SectionWrap({
  title, sub, tone, children,
}: {
  title: string;
  sub: string;
  tone: "white" | "warm";
  children: React.ReactNode;
}) {
  return (
    <section className={cn(
      "border-b border-ortaq-border",
      tone === "warm" ? "bg-[#faf9f7]" : "bg-white",
    )}>
      <Container wide>
        <div className="py-14 sm:py-18">
          <div className="mb-8">
            <h2 className="text-[1.5rem] font-bold tracking-[-0.03em] text-ortaq-ink sm:text-[1.875rem] leading-[1.1]">
              {title}
            </h2>
            <p className="mt-2 max-w-2xl text-[0.9375rem] leading-relaxed text-ortaq-ink-muted">
              {sub}
            </p>
          </div>
          {children}
        </div>
      </Container>
    </section>
  );
}

/* ── App badge ────────────────────────────────────────────────────────────── */

const APP_COLORS: Record<string, string> = {
  WhatsApp: "bg-[#075E54]",
  WeChat:   "bg-[#07C160]",
  Email:    "bg-[#0078D4]",
  Tel:      "bg-gray-600",
  Phone:    "bg-gray-600",
  Outlook:  "bg-[#0078D4]",
};

function AppBadge({ app }: { app: string }) {
  return (
    <span className={cn(
      "shrink-0 rounded px-1.5 py-0.5 text-[0.35rem] font-bold text-white whitespace-nowrap",
      APP_COLORS[app] ?? "bg-gray-600",
    )}>
      {app}
    </span>
  );
}
