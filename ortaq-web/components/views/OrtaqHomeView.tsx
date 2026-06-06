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
 * OrtaqHomeView — V7: Narrative-first homepage.
 *
 * Built around ONE real transaction: Çelik Tedariki · BestBuild GmbH · €840.000
 *
 * Every section is a scene from that transaction's life.
 * Not a product tour. A story the visitor already lives every day.
 *
 * Section 1  — The questions every exporter asks every morning (hero)
 * Section 2  — "Bir gününüz böyle geçiyor mu?" (pain recognition)
 * Section 3  — "Bir işlemin tüm hikayesi" (deal journey, real docs)
 * Section 4  — "Kim ne görüyor?" (4 parties, identical status)
 * Section 5  — "Bugün müdahale etmeniz gereken işlemler" (risk board)
 * Section 6  — "Artık kimse 'son durum ne?' diye sormaz" (CTA)
 *
 * Language rules:
 *   Never: platform, visibility, workflow, ecosystem, coordination
 *   Always: SGS, BL, LC, sevkiyat, sözleşme, ödeme, imza, revizyon
 *   No em dashes. No startup language. No SaaS marketing.
 *   Write like a trader. Write like an operations manager.
 */

export function OrtaqHomeView() {
  const { t, i18n } = useTranslation();
  const isTR = (i18n.language ?? "tr").startsWith("tr");

  return (
    <PublicShell stickyCta={false}>

      {/* ══ SECTION 1 — THE DAILY QUESTIONS ══════════════════════════════
          Visitor must feel: "Yes. These are exactly the questions I ask every morning."
          Not: "Here is a product."                                          */}
      <section className="relative border-b border-ortaq-border bg-ortaq-surface">
        <Container wide>
          <div className="py-12 sm:py-16">

            {/* Eyebrow */}
            <div className="mb-5 flex justify-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-ortaq-trust/30 bg-ortaq-trust/6 px-3 py-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-ortaq-trust" />
                <span className="text-[0.6875rem] font-semibold text-ortaq-trust">
                  {t("home.hero.eyebrow")}
                </span>
              </div>
            </div>

            {/* Headline — the pain, not the software */}
            <div className="mb-8 text-center">
              <h1 className="mx-auto max-w-2xl font-body font-bold tracking-[-0.04em] text-ortaq-ink leading-[1.02] text-[2.25rem] sm:text-[3rem]">
                {t("home.hero.h1a")}<br />
                <span className="text-ortaq-trust">{t("home.hero.h1b")}</span>
              </h1>
              <p className="mx-auto mt-5 max-w-[32rem] text-[1rem] leading-[1.7] text-ortaq-ink-muted">
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

            {/* The transformation visual — left: chaos / right: ORTAQ */}
            <TransformationHero />
          </div>
        </Container>
      </section>

      {/* ══ SECTION 2 — DAY IN LIFE ═══════════════════════════════════════
          Visitor must feel: "This is my team. This is what happens every day."
          Three situations. Three questions. Three answers.                  */}
      <SectionWrap
        sectionLabel={isTR ? "Günlük Gerçeklik" : "Daily Reality"}
        title={isTR ? "Bir gününüz böyle geçiyor mu?" : "Does your day look like this?"}
        sub={isTR
          ? "Bir soru sorulur. Herkes farklı bir yere bakar. Cevap geç gelir."
          : "A question is asked. Everyone looks in a different place. The answer comes late."
        }
        tone="white"
      >
        <DayInLife />
      </SectionWrap>

      {/* ══ SECTION 3 — DEAL JOURNEY ══════════════════════════════════════
          Visitor must see: a real commercial transaction from start to finish.
          Real documents. Real stages. Real artifacts. Not a product feature list. */}
      <SectionWrap
        sectionLabel={isTR ? "Tek İşlem" : "Single Deal"}
        title={isTR ? "Bir işlemin tüm hikayesi" : "The full story of one deal"}
        sub={isTR
          ? "Tekliften ödemeye. Her adımda hangi belge var, kimin elinde, ne durumda."
          : "From offer to payment. Which document exists at each stage, with whom, at what status."
        }
        tone="warm"
      >
        <DealJourney />
      </SectionWrap>

      {/* ══ SECTION 4 — FOUR SCREENS ══════════════════════════════════════
          Visitor must understand: nobody is working from different information.
          The same deal. The same status. Four cities.                       */}
      <SectionWrap
        sectionLabel={isTR ? "Her Taraf" : "Every Party"}
        title={isTR ? "Kim ne görüyor?" : "What does each party see?"}
        sub={isTR
          ? "Türkiye, Almanya, Tayland ve Japonya aynı işlemi aynı anda görüyor."
          : "Turkey, Germany, Thailand and Japan see the same deal at the same time."
        }
        tone="white"
      >
        <FourScreens />
      </SectionWrap>

      {/* ══ SECTION 5 — RISK BOARD ════════════════════════════════════════
          Visitor must feel: "This is why I would open this every morning."
          Risk, not analytics. Urgency, not size.                            */}
      <SectionWrap
        sectionLabel={isTR ? "Sabah Görünümü" : "Morning View"}
        title={isTR ? "Bugün müdahale etmeniz gereken işlemler" : "Deals that need your attention today"}
        sub={isTR
          ? "5 gündür cevap yok. SGS bekleniyor. LC eksik. Sıra kimde?"
          : "No response for 5 days. SGS pending. LC missing. Whose turn is it?"
        }
        tone="warm"
      >
        <RiskBoard />
      </SectionWrap>

      {/* ══ SECTION 6 — NOBODY ASKS ═══════════════════════════════════════
          The emotional close. Contrast the old pain against the new reality.
          Then: one clear CTA. No vague language.                            */}
      <section className="border-t border-ortaq-border bg-ortaq-ink">
        <Container wide>
          <div className="py-16 sm:py-20">

            <div className="grid gap-10 lg:grid-cols-2 lg:items-center">

              {/* Left: the messages fading out */}
              <div>
                <p className="mb-4 text-[0.5625rem] font-bold uppercase tracking-[0.1em] text-ortaq-cream/50">
                  {isTR ? "Eskiden" : "Before"}
                </p>
                <div className="space-y-2">
                  {(isTR ? [
                    { app: "WhatsApp", who: "CEO",    text: "Sıra kimde, ne bekliyoruz?" },
                    { app: "Email",    who: "Finans", text: "SGS onaylandı mı? LC açamıyoruz." },
                    { app: "WhatsApp", who: "Ops",    text: "BL ne zaman kesilecek?" },
                    { app: "Tel",      who: "Satış",  text: "3 kez aradım, kimse cevaplamıyor" },
                    { app: "Email",    who: "Hukuk",  text: "Hangi sözleşme versiyonu geçerli?" },
                  ] : [
                    { app: "WhatsApp", who: "CEO",    text: "Whose turn is it, what are we waiting for?" },
                    { app: "Email",    who: "Finance", text: "Has SGS been approved? We cannot open LC." },
                    { app: "WhatsApp", who: "Ops",    text: "When will BL be issued?" },
                    { app: "Phone",    who: "Sales",  text: "Called 3 times, nobody answers" },
                    { app: "Email",    who: "Legal",  text: "Which contract version is current?" },
                  ]).map((msg, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 rounded-xl border border-ortaq-cream/10 bg-ortaq-cream/5 px-4 py-3"
                      style={{ opacity: 1 - i * 0.12 }}
                    >
                      <AppBadge app={msg.app} />
                      <div className="min-w-0">
                        <p className="text-[0.45rem] font-bold text-ortaq-cream/50">{msg.who}</p>
                        <p className="text-[0.5625rem] text-ortaq-cream/75">{msg.text}</p>
                      </div>
                    </div>
                  ))}
                  <p className="pt-1 text-[0.5rem] font-semibold text-red-400/80">
                    {isTR ? "Cevap yok. Kimse bilmiyor. Her gün." : "No answers. Nobody knows. Every day."}
                  </p>
                </div>
              </div>

              {/* Right: the CTA + new reality */}
              <div className="text-center lg:text-left">
                <p className="mb-2 text-[0.5625rem] font-bold uppercase tracking-[0.1em] text-ortaq-trust">
                  {isTR ? "ORTAQ ile" : "With ORTAQ"}
                </p>
                <h2 className="text-[1.875rem] font-bold tracking-[-0.03em] text-ortaq-cream leading-[1.1] sm:text-[2.25rem]">
                  {t("home.cta.h2a")}<br />
                  <span className="text-ortaq-trust">{t("home.cta.h2b")}</span>
                </h2>
                <p className="mt-4 text-[0.9375rem] leading-relaxed text-ortaq-cream/70">
                  {t("home.cta.sub")}
                </p>

                {/* Live status mini-board */}
                <div className="mt-6 overflow-hidden rounded-2xl border border-ortaq-cream/10 bg-ortaq-cream/5">
                  <div className="border-b border-ortaq-cream/10 px-4 py-3">
                    <p className="text-[0.5rem] font-bold uppercase tracking-[0.08em] text-ortaq-cream/50">
                      {isTR ? "Çelik Tedariki · Anlık Durum" : "Steel Supply · Current Status"}
                    </p>
                  </div>
                  <div className="divide-y divide-ortaq-cream/[0.06]">
                    {(isTR ? [
                      { label: "Sözleşme", value: "SPA v12 · İmzalı",          color: "text-emerald-400" },
                      { label: "SGS",      value: "Bekleniyor · BestBuild",    color: "text-amber-400"  },
                      { label: "BL",       value: "28 Haziran · SGS sonrası",   color: "text-sky-400"    },
                      { label: "Ödeme",    value: "LC hazırlanıyor · HSBC",    color: "text-amber-400"  },
                      { label: "Sıradaki", value: "SGS · BestBuild sorumlu",  color: "text-ortaq-trust" },
                    ] : [
                      { label: "Contract", value: "SPA v12 · Signed",          color: "text-emerald-400" },
                      { label: "SGS",      value: "Pending · BestBuild",        color: "text-amber-400"  },
                      { label: "BL",       value: "June 28 · After SGS",        color: "text-sky-400"    },
                      { label: "Payment",  value: "LC being prepared · HSBC",   color: "text-amber-400"  },
                      { label: "Next",     value: "SGS · BestBuild responsible", color: "text-ortaq-trust" },
                    ]).map((row) => (
                      <div key={row.label} className="flex items-center justify-between gap-3 px-4 py-2.5">
                        <span className="text-[0.4375rem] font-semibold text-ortaq-cream/50">{row.label}</span>
                        <span className={cn("text-[0.5rem] font-bold", row.color)}>{row.value}</span>
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
  sectionLabel,
  title,
  sub,
  tone,
  children,
}: {
  sectionLabel: string;
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
            <p className="mb-2 text-[0.5rem] font-bold uppercase tracking-[0.1em] text-ortaq-trust">
              {sectionLabel}
            </p>
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

/* ── App badge (for "nobody asks" section) ────────────────────────────────── */

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
      "shrink-0 rounded px-1.5 py-0.5 text-[0.35rem] font-bold text-white",
      APP_COLORS[app] ?? "bg-gray-600",
    )}>
      {app}
    </span>
  );
}

/* ── Grid background (unused, kept for future) ────────────────────────────── */
function GridPattern() {
  return (
    <div
      className="pointer-events-none absolute inset-0 opacity-[0.015]"
      style={{
        backgroundImage: `linear-gradient(var(--color-ortaq-ink) 1px, transparent 1px),
                          linear-gradient(90deg, var(--color-ortaq-ink) 1px, transparent 1px)`,
        backgroundSize: "40px 40px",
      }}
    />
  );
}
