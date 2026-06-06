"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/cn";
import { Container } from "@/components/ui/Section";
import { PublicShell } from "@/components/layout/PublicShell";

import { TransformationHero } from "@/components/visuals/TransformationHero";
import { RealExample }        from "@/components/visuals/RealExample";
import { DealJourney }        from "@/components/visuals/DealJourney";
import { RiskBoard }          from "@/components/visuals/RiskBoard";
import { RoleView }           from "@/components/visuals/RoleView";

/**
 * OrtaqHomeView — V9: Maximum clarity. Six sections. Nothing extra.
 *
 * RULE: Visitor must understand in under 10 seconds.
 * RULE: No BestBuild, Acme, or fictional names. Use: alıcı, satıcı, Alman alıcı.
 * RULE: Not a dashboard. Not a CRM. Not a task manager.
 *       ORTAQ manages commercial transactions.
 *
 * Section 1 — Hero: "Sözleşme, SGS, sevkiyat ve ödeme. Tek yerde."
 *   Visual: TransformationHero — left chaos, right ORTAQ record.
 *
 * Section 2 — Real Example: Çelik Tedariki · €840.000
 *   Three questions. Three instant answers. No reading required.
 *
 * Section 3 — Transaction Lifecycle: Teklif → Sözleşme → Muayene → Sevkiyat → Ödeme
 *   The actual business process, not software features.
 *
 * Section 4 — Portfolio: Multiple active deals. Which need attention today?
 *
 * Section 5 — Who uses it: CEO, Satın Alma, Finans, Operasyon.
 *   What each person actually checks. Real questions.
 *
 * Section 6 — CTA: Simple. No startup language.
 *
 * Banned words: platform · workflow · ecosystem · visibility ·
 *               stakeholder · coordination · digital transformation ·
 *               company-to-company · commercial infrastructure
 */

export function OrtaqHomeView() {
  const { t, i18n } = useTranslation();
  const isTR = (i18n.language ?? "tr").startsWith("tr");

  return (
    <PublicShell stickyCta={false}>

      {/* ══ SECTION 1 — HERO ══════════════════════════════════════════════
          Visitor must immediately understand: this is where my transaction lives.
          The visual does the work. The headline names what ORTAQ holds.     */}
      <section className="border-b border-ortaq-border bg-ortaq-surface">
        <Container wide>
          <div className="py-12 sm:py-16">

            <div className="mb-8 text-center">
              <h1 className="mx-auto max-w-2xl font-body font-bold tracking-[-0.04em] text-ortaq-ink leading-[1.02] text-[2.25rem] sm:text-[3rem]">
                {t("home.hero.h1a")}<br />
                <span className="text-ortaq-trust">{t("home.hero.h1b")}</span>
              </h1>
              <p className="mx-auto mt-5 max-w-[32rem] text-[0.9375rem] leading-[1.75] text-ortaq-ink-muted">
                {t("home.hero.sub")}
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/demo"
                  className="inline-flex min-h-11 items-center justify-center rounded-lg bg-ortaq-trust px-7 text-[0.9375rem] font-bold text-white shadow-sm transition-all hover:bg-ortaq-trust-deep active:scale-[0.98]"
                >
                  {t("home.hero.cta")} →
                </Link>
                <Link
                  href="/nasil-calisir"
                  className="inline-flex min-h-11 items-center justify-center rounded-lg border border-ortaq-border px-5 text-[0.9375rem] font-medium text-ortaq-ink-muted transition-colors hover:border-ortaq-border-strong hover:text-ortaq-ink"
                >
                  {t("home.hero.ctaSecondary")}
                </Link>
              </div>
            </div>

            <TransformationHero />

          </div>
        </Container>
      </section>

      {/* ══ TRUST STRIP — between hero and section 2 ═════════════════════
          Three concrete signals. Not marketing. Not metrics.
          These reduce trust friction before the visitor reads further.        */}
      <TrustStrip isTR={isTR} />

      {/* ══ SECTION 2 — REAL EXAMPLE ══════════════════════════════════════
          One real transaction. Three real questions. Three real answers.
          The visitor should think: "These are exactly the questions I ask."   */}
      <S
        title={isTR ? "Şu an bir işleminiz var. Cevaplar hazır mı?" : "You have an active deal right now. Are the answers ready?"}
        sub={isTR
          ? "Bu üç soruyu cevaplamak için kaç farklı yere bakıyorsunuz?"
          : "How many different places do you check to answer these three questions?"}
        tone="white"
      >
        <RealExample />
      </S>

      {/* ══ MID-PAGE CTA — after real example ════════════════════════════
          Visitors who engaged with the real example are now qualified.
          Give them a conversion point before they scroll further.            */}
      <MidPageCta isTR={isTR} />

      {/* ══ SECTION 3 — TRANSACTION LIFECYCLE ════════════════════════════
          The actual business process. Not software features.
          Every exporter knows these stages.                                  */}
      <S
        title={isTR ? "Tekliften ödemeye — her adım kayıtta." : "From offer to payment — every step on record."}
        sub={isTR
          ? "Teklif, sözleşme, muayene, sevkiyat, ödeme. Her aşamada hangi belge var, kimin elinde, ne durumda."
          : "Offer, contract, inspection, shipment, payment. Which document at each stage, with whom, at what status."}
        tone="warm"
      >
        <DealJourney />
      </S>

      {/* ══ SECTION 4 — PORTFOLIO ═════════════════════════════════════════
          A company manages many deals at once.
          ORTAQ shows which deals need attention today.                       */}
      <S
        title={isTR ? "Hangi işlem ne durumda?" : "What is the status of each deal?"}
        sub={isTR
          ? "Birden fazla işlem yönetiyorsanız, bugün hangisine bakmanız gerekiyor?"
          : "If you manage multiple deals, which one needs your attention today?"}
        tone="white"
      >
        <RiskBoard />
      </S>

      {/* ══ SECTION 5 — WHO USES IT ═══════════════════════════════════════
          CEO, Satın Alma, Finans, Operasyon.
          What does each person actually check?                               */}
      <S
        title={isTR ? "Kim ne bakıyor?" : "Who checks what?"}
        sub={isTR
          ? "Her sabah dört farklı kişi, dört farklı soru soruyor. ORTAQ'ta dördü de yanıtlı."
          : "Every morning four different people ask four different questions. In ORTAQ, all four are answered."}
        tone="warm"
      >
        <RoleView />
      </S>

      {/* ══ SECTION 6 — CTA ═══════════════════════════════════════════════
          Simple. Outcome-driven. No marketing language.                      */}
      <section className="border-t border-ortaq-border bg-ortaq-ink">
        <Container wide>
          <div className="py-16 sm:py-20 text-center">

            <h2 className="mx-auto max-w-2xl text-[1.875rem] font-bold tracking-[-0.03em] text-ortaq-cream leading-[1.1] sm:text-[2.25rem]">
              {t("home.cta.h2a")}<br />
              <span className="text-ortaq-trust">{t("home.cta.h2b")}</span>
            </h2>

            <p className="mx-auto mt-4 max-w-md text-[0.9375rem] leading-relaxed text-ortaq-cream/70">
              {t("home.cta.sub")}
            </p>

            {/* What a demo looks like — concrete, not abstract */}
            <div className="mx-auto mt-8 max-w-sm overflow-hidden rounded-2xl border border-ortaq-cream/10 bg-ortaq-cream/5 text-left">
              <div className="border-b border-ortaq-cream/10 px-5 py-3">
                <p className="text-[0.4375rem] font-bold uppercase tracking-[0.09em] text-ortaq-cream/40">
                  {isTR ? "Demo nasıl ilerler?" : "What happens in a demo?"}
                </p>
              </div>
              <div className="divide-y divide-ortaq-cream/[0.07]">
                {(isTR ? [
                  "Aktif işlemlerinizden birini seçiyorsunuz.",
                  "O işlemin belgelerini, onaylarını ve durumunu birlikte görüyoruz.",
                  "ORTAQ'ın ne yapabileceğini gerçek bir işlem üzerinden anlıyorsunuz.",
                ] : [
                  "You choose one of your active deals.",
                  "We review that deal's documents, approvals and status together.",
                  "You see what ORTAQ can do on a real transaction.",
                ]).map((step, i) => (
                  <div key={i} className="flex items-start gap-3 px-5 py-3">
                    <span className="shrink-0 font-mono text-[0.4375rem] font-bold text-ortaq-cream/30">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="text-[0.5625rem] text-ortaq-cream/75">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/demo"
                className="inline-flex min-h-12 items-center justify-center rounded-xl bg-ortaq-trust px-8 text-[1rem] font-bold text-white shadow-sm transition-all hover:bg-ortaq-trust-deep active:scale-[0.98]"
              >
                {t("home.cta.primary")} →
              </Link>
              <Link
                href="/senaryolar"
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-ortaq-cream/20 px-6 text-[1rem] font-medium text-ortaq-cream/70 transition-colors hover:border-ortaq-cream/40 hover:text-ortaq-cream"
              >
                {isTR ? "15 Senaryo" : "15 Scenarios"}
              </Link>
            </div>

          </div>
        </Container>
      </section>

    </PublicShell>
  );
}

/* ── Section wrapper ─────────────────────────────────────────────────────── */

function S({
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
            <h2 className="text-[1.5rem] font-bold tracking-[-0.03em] text-ortaq-ink leading-[1.15] sm:text-[1.875rem]">
              {title}
            </h2>
            <p className="mt-2 max-w-xl text-[0.9375rem] leading-relaxed text-ortaq-ink-muted">
              {sub}
            </p>
          </div>
          {children}
        </div>
      </Container>
    </section>
  );
}

/* ── Trust strip — between hero and Section 2 ────────────────────────────── */

function TrustStrip({ isTR }: { isTR: boolean }) {
  const signals = isTR ? [
    {
      icon: "📄",
      label: "Alıcı ve satıcı aynı belgeyi görür.",
      note: "Farklı versiyonlar yok. Tek kayıt.",
    },
    {
      icon: "🔒",
      label: "Dahili notlar gerçekten özel.",
      note: "Karşı taraf görmez — bulanık değil, yok.",
    },
    {
      icon: "⏱",
      label: "Kurulum yok.",
      note: "Bugün başlayabilirsiniz. Ay değil, saat.",
    },
  ] : [
    {
      icon: "📄",
      label: "Buyer and seller see the same document.",
      note: "No different versions. One record.",
    },
    {
      icon: "🔒",
      label: "Internal notes are truly private.",
      note: "Counterparty can't see them — not blurred, not there.",
    },
    {
      icon: "⏱",
      label: "No setup required.",
      note: "Start today. Hours, not months.",
    },
  ];

  return (
    <div className="border-b border-ortaq-border bg-white">
      <Container wide>
        <div className="grid grid-cols-1 divide-y divide-ortaq-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {signals.map(s => (
            <div key={s.label} className="flex items-start gap-3 px-0 py-5 sm:px-6 sm:py-6 first:pl-0 last:pr-0">
              <span className="shrink-0 text-xl leading-none">{s.icon}</span>
              <div>
                <p className="text-[0.8125rem] font-semibold text-ortaq-ink leading-snug">{s.label}</p>
                <p className="mt-0.5 text-[0.6875rem] text-ortaq-ink-muted">{s.note}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}

/* ── Mid-page CTA — after Real Example ──────────────────────────────────── */

function MidPageCta({ isTR }: { isTR: boolean }) {
  return (
    <div className="border-b border-ortaq-border bg-ortaq-trust/[0.04]">
      <Container wide>
        <div className="flex flex-col gap-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:py-9">
          <div>
            <p className="text-[0.75rem] font-bold text-ortaq-trust uppercase tracking-[0.06em]">
              {isTR ? "Tanıdık geldi mi?" : "Did this sound familiar?"}
            </p>
            <p className="mt-1 text-[1rem] font-bold text-ortaq-ink leading-snug sm:text-[1.125rem]">
              {isTR
                ? "Aktif bir işleminizi getirin. 30 dakikada görelim."
                : "Bring one active deal. Let's look at it in 30 minutes."}
            </p>
          </div>
          <Link
            href="/demo"
            className="inline-flex shrink-0 min-h-10 items-center justify-center rounded-lg bg-ortaq-trust px-6 text-[0.875rem] font-bold text-white shadow-sm transition-all hover:bg-ortaq-trust-deep active:scale-[0.98]"
          >
            {isTR ? "Demo İsteyin →" : "Request Demo →"}
          </Link>
        </div>
      </Container>
    </div>
  );
}
