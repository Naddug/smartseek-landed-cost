"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { PublicShell } from "@/components/layout/PublicShell";
import { Container } from "@/components/ui/Section";
import { cn } from "@/lib/cn";

/**
 * HowItWorksView — V8: Two-company story. No paragraphs.
 *
 * Category: Şirketler Arası İşlem Kaydı
 * (Company-to-Company Transaction Record)
 *
 * POSITIONING REWRITE: This page explains ONE transaction between TWO companies.
 * Not a product. Not a workflow. The buyer and seller are always named.
 *
 * STEP 1: "Alıcı v10 diyor. Siz v12 diyorsunuz."
 *   The two-company gap: same deal, two different realities.
 *   Visual: messages flying between the two companies, out of sync.
 *
 * STEP 2: "ORTAQ, iki tarafın paylaştığı tek kayıttır."
 *   The record is created. Both companies write to it and read from it.
 *   Visual: Alıcı + your team both connected to the same deal card.
 *
 * STEP 3: "Alıcı ne görüyorsa, siz de aynısını görüyorsunuz."
 *   The shared visibility: same SGS status, same BL draft, same payment step.
 *   Visual: two screens side by side — perfectly mirrored.
 *
 * STEP 4: "Alıcıya artık 'son durum ne?' diye e-posta atmıyorsunuz."
 *   The elimination of the status-check email — between companies, not inside.
 *   Visual: the cross-company email disappears. The ORTAQ record answers it.
 *
 * Design rules:
 *   - BUYER and SELLER named in every step. "Her iki taraf" is not enough.
 *   - Use generic trade terms: alıcı, satıcı, Alman alıcı.
 *   - No paragraph longer than 15 words.
 *   - Trade terms only: SGS, BL, LC, sözleşme, ödeme.
 *   - No startup/software language.
 */

export function HowItWorksView() {
  const { t, i18n } = useTranslation();
  const isTR = (i18n.language ?? "tr").startsWith("tr");

  return (
    <PublicShell stickyCta={false}>
      <div className="bg-ortaq-surface">

        {/* Page header */}
        <div className="border-b border-ortaq-border bg-white">
          <Container wide>
            <div className="py-10 sm:py-14">
              <p className="text-[0.6875rem] font-bold uppercase tracking-[0.1em] text-ortaq-trust">
                {isTR ? "Nasıl Çalışır" : "How It Works"}
              </p>
              <h1 className="mt-3 text-[2rem] font-bold tracking-[-0.03em] text-ortaq-ink sm:text-[2.5rem] leading-[1.05]">
                {isTR
                  ? <>Bir ticari işlem.<br /><span className="text-ortaq-trust">Tek kayıt.</span></>
                  : <>One commercial transaction.<br /><span className="text-ortaq-trust">One record.</span></>
                }
              </h1>
              <p className="mt-4 max-w-lg text-[0.9375rem] leading-relaxed text-ortaq-ink-muted">
                {isTR
                  ? "Teklif, sözleşme, SGS, BL, sevkiyat ve ödeme — hepsi aynı işlem kaydında. WhatsApp, e-posta ve PDF'lerde değil."
                  : "Offer, contract, SGS, BL, shipment and payment — all in the same deal record. Not in WhatsApp, email and PDFs."
                }
              </p>
            </div>
          </Container>
        </div>

        {/* Steps */}
        <div className="divide-y divide-ortaq-border">

          {/* ══ STEP 1: The problem ════════════════════════════════ */}
          <Step
            number="01"
            question={isTR
              ? "Bir işlem. Birden fazla uygulama. Sıfır netlik."
              : "One deal. Multiple apps. Zero clarity."}
            answer={isTR
              ? "Fiyat WhatsApp'ta. Sözleşme Outlook'ta. SGS raporu PDF'te. Son karar belirsiz."
              : "Price on WhatsApp. Contract in Outlook. SGS report in a PDF. Latest decision unclear."}
          >
            <Step1Visual isTR={isTR} />
          </Step>

          {/* ══ STEP 2: ORTAQ collects ═════════════════════════════ */}
          <Step
            number="02"
            question={isTR
              ? "ORTAQ her şeyi tek işlem kaydında toplar."
              : "ORTAQ gathers everything into one deal record."}
            answer={isTR
              ? "Sözleşme, SGS, BL taslağı, mesajlar ve onaylar — hepsi aynı işlem kaydına bağlanır."
              : "Contract, SGS, BL draft, messages and approvals — all linked to the same deal record."}
            reverse
          >
            <Step2Visual isTR={isTR} />
          </Step>

          {/* ══ STEP 3: Every party sees the same ════════════════════ */}
          <Step
            number="03"
            question={isTR
              ? "Tedarikçi, alıcı, lojistik ve finans aynı durumu görüyor."
              : "Supplier, buyer, logistics and finance see the same status."}
            answer={isTR
              ? "Farklı PDF yok. Farklı Excel yok. Herkes aynı kayda bakıyor, aynı anda."
              : "No different PDF. No different Excel. Everyone looks at the same record, at the same time."}
          >
            <Step3Visual isTR={isTR} />
          </Step>

          {/* ══ STEP 4: No more asking ════════════════════════════════ */}
          <Step
            number="04"
            question={isTR
              ? "'SGS geldi mi?' artık sorulmuyor."
              : "'Has SGS arrived?' is no longer asked."}
            answer={isTR
              ? "Cevap her zaman ekranda. SGS, BL, LC durumu — kimseye sormadan görünüyor."
              : "The answer is always on screen. SGS, BL, LC status — visible without asking anyone."}
            reverse
          >
            <Step4Visual isTR={isTR} />
          </Step>

        </div>

        {/* CTA */}
        <div className="border-t border-ortaq-border bg-white">
          <Container wide>
            <div className="py-12 text-center sm:py-16">
              <h2 className="text-[1.625rem] font-bold tracking-[-0.03em] text-ortaq-ink sm:text-[2rem]">
                {isTR
                  ? "Aktif işlemlerinizden biriyle deneyin."
                  : "Try it with one of your active deals."}
              </h2>
              <p className="mt-3 text-[0.9375rem] text-ortaq-ink-muted">
                {isTR
                  ? "Demo isteyin. Aktif bir işleminizi getirin. Karşı tarafınızı da ekleyin. 30 dakika."
                  : "Request a demo. Bring one active deal. Add your counterparty. 30 minutes."}
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link
                  href="/demo"
                  className="inline-flex min-h-11 items-center justify-center rounded-lg bg-ortaq-ink px-7 text-[0.9375rem] font-semibold text-ortaq-cream shadow-sm transition-all hover:bg-ortaq-ink-muted"
                >
                  {isTR ? "Demo İsteyin" : "Request Demo"}
                </Link>
                <Link
                  href="/"
                  className="inline-flex min-h-11 items-center justify-center rounded-lg border border-ortaq-border-strong px-5 text-[0.9375rem] font-medium text-ortaq-ink transition-colors hover:bg-ortaq-bg"
                >
                  {isTR ? "Ana Sayfaya Dön" : "Back to Home"} →
                </Link>
              </div>
            </div>
          </Container>
        </div>

      </div>
    </PublicShell>
  );
}

/* ── Step layout ──────────────────────────────────────────────────────────── */

function Step({
  number, question, answer, children, reverse,
}: {
  number: string;
  question: string;
  answer: string;
  children: React.ReactNode;
  reverse?: boolean;
}) {
  return (
    <div className="bg-white">
      <Container wide>
        <div className={cn(
          "grid gap-8 py-12 sm:py-16 lg:grid-cols-2 lg:items-center lg:gap-16",
          reverse && "lg:[&>*:first-child]:order-2",
        )}>
          {/* Text side */}
          <div>
            <span className="font-mono text-[3rem] font-bold tabular-nums text-ortaq-border sm:text-[4rem] leading-none">
              {number}
            </span>
            <h2 className="mt-4 text-[1.375rem] font-bold tracking-[-0.025em] text-ortaq-ink sm:text-[1.625rem] leading-[1.15]">
              {question}
            </h2>
            <p className="mt-3 text-[0.9375rem] leading-relaxed text-ortaq-ink-muted">
              {answer}
            </p>
          </div>
          {/* Visual side */}
          <div>{children}</div>
        </div>
      </Container>
    </div>
  );
}

/* ── STEP 1: Chaos visual ─────────────────────────────────────────────────── */

function Step1Visual({ isTR }: { isTR: boolean }) {
  const apps = [
    {
      name: "WhatsApp", color: "#075E54", dot: "#25D366", icon: "💬",
      lines: [
        isTR ? "Son fiyat neydi?" : "What was the final price?",
        isTR ? "SGS geldi mi?" : "Has SGS arrived?",
      ],
    },
    {
      name: "WeChat", color: "#07C160", dot: "#07C160", icon: "💚",
      lines: ["Price OK. Waiting LC.", isTR ? "BL ne zaman?" : "When is BL?"],
    },
    {
      name: "Outlook", color: "#0078D4", dot: "#0078D4", icon: "📧",
      lines: ["Re: SPA_v12_final_FINAL.pdf", isTR ? "Hangi PDF güncel?" : "Which PDF is current?"],
    },
    {
      name: "Excel", color: "#217346", dot: "#217346", icon: "📊",
      lines: ["FIYAT_v4_REVIZE_SON.xlsx", "v3? v4? Hangisi?"],
    },
    {
      name: isTR ? "SGS Raporu" : "SGS Report", color: "#E31837", dot: "#E31837", icon: "🔬",
      lines: ["SGS_TASLAK_v1.pdf", isTR ? "ONAYSIZ - Taslak" : "UNAPPROVED - Draft"],
    },
    {
      name: "BL Draft", color: "#1e3a5f", dot: "#4a90d9", icon: "🚢",
      lines: [isTR ? "BL_TASLAK_v3.pdf" : "BL_DRAFT_v3.pdf", isTR ? "LC numarası eksik" : "LC number missing"],
    },
  ];

  const rotations = ["-3deg", "2deg", "-1.5deg", "2.5deg", "-2deg", "1.5deg"];
  const positions = [
    { top: "0%",  left: "0%",   width: "44%" },
    { top: "0%",  right: "2%",  width: "40%" },
    { top: "34%", left: "5%",   width: "46%" },
    { top: "30%", right: "0%",  width: "42%" },
    { bottom: "0%",left: "8%",  width: "38%" },
    { bottom: "0%",right: "4%", width: "40%" },
  ];

  return (
    <div className="relative mx-auto max-w-md overflow-visible" style={{ height: 340 }}>
      {apps.map((app, i) => (
        <div
          key={app.name}
          className="absolute overflow-hidden rounded-xl border border-black/[0.07] bg-white shadow-[0_4px_20px_rgb(0_0_0/0.13)]"
          style={{ ...positions[i], transform: `rotate(${rotations[i]})` }}
        >
          {/* App title bar */}
          <div className="flex items-center gap-1 border-b border-black/[0.05] bg-[#f7f7f7] px-2 py-1">
            <span className="h-2 w-2 rounded-full bg-[#ff5f57]" />
            <span className="h-2 w-2 rounded-full bg-[#febc2e]" />
            <span className="h-2 w-2 rounded-full" style={{ background: app.dot }} />
            <span className="ml-1.5 text-[0.45rem]">{app.icon}</span>
            <span className="text-[0.45rem] font-semibold" style={{ color: app.color }}>{app.name}</span>
          </div>
          {/* Content lines */}
          <div className="p-2 space-y-1">
            {app.lines.map((line, j) => (
              <p key={j} className={cn(
                "text-[0.5rem] leading-snug",
                j === 0 ? "font-semibold text-gray-800" : "text-gray-400",
              )}>
                {line}
              </p>
            ))}
          </div>
        </div>
      ))}

      {/* Central deal label — the one thing they all concern */}
      <div className="absolute inset-x-0 top-[42%] flex justify-center" style={{ zIndex: 20 }}>
        <div className="rounded-full border-2 border-red-300 bg-white px-3 py-1 shadow-lg">
          <p className="text-[0.5625rem] font-bold text-red-700">
            {isTR ? "Çelik Tedariki · €840.000 · Alman alıcı" : "Steel Supply · €840,000 · Alman alıcı"}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── STEP 2: ORTAQ collects ───────────────────────────────────────────────── */

function Step2Visual({ isTR }: { isTR: boolean }) {
  const stages = [
    { label: isTR ? "Teklif" : "Offer",     done: true },
    { label: isTR ? "Sözleşme" : "Contract", done: true },
    { label: isTR ? "Muayene" : "Inspection",done: false, active: true },
    { label: isTR ? "Sevkiyat" : "Shipment", done: false },
    { label: isTR ? "Ödeme" : "Payment",     done: false },
  ];

  const docs = [
    { icon: "📄", label: "SPA v12", status: isTR ? "İmzalı" : "Signed",   color: "emerald" },
    { icon: "🔬", label: "SGS",     status: isTR ? "Bekleniyor" : "Pending", color: "amber"   },
    { icon: "🚢", label: "BL Taslak",status: isTR ? "Taslak" : "Draft",    color: "sky"     },
    { icon: "💰", label: "LC",      status: isTR ? "Hazırlanıyor" : "Being prepared", color: "violet" },
  ];

  const items = [
    { who: "YÇ", text: isTR ? "SGS bekleniyor. alıcıya ilettim." : "SGS pending. Forwarded to buyer.", time: "14:32" },
    { who: "BB", text: isTR ? "Pazartesiye kadar gönderirim." : "I will send by Monday.", time: "15:10" },
  ];

  const colorMap: Record<string, string> = {
    emerald: "bg-emerald-100 text-emerald-700",
    amber:   "bg-amber-100 text-amber-700",
    sky:     "bg-sky-100 text-sky-700",
    violet:  "bg-violet-100 text-violet-700",
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-ortaq-border bg-white shadow-[0_4px_24px_rgb(0_0_0/0.08)]">
      {/* Deal header */}
      <div className="border-b border-ortaq-border bg-ortaq-surface px-5 py-3.5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[0.5rem] font-bold uppercase tracking-[0.08em] text-ortaq-ink-soft">
              {isTR ? "Aktif İşlem" : "Active Deal"}
            </p>
            <p className="text-[0.875rem] font-bold text-ortaq-ink">
              {isTR ? "Çelik Tedariki · Alman alıcı" : "Steel Supply · Alman alıcı"}
            </p>
          </div>
          <span className="rounded-full bg-ortaq-trust/10 px-3 py-1 text-[0.5rem] font-bold text-ortaq-trust">€840.000</span>
        </div>
        {/* Stage bar */}
        <div className="mt-3 flex items-center gap-1.5 overflow-x-auto pb-1">
          {stages.map((s, i) => (
            <div key={s.label} className="flex items-center gap-1.5 shrink-0">
              <div className={cn(
                "flex items-center gap-1 rounded-full px-2 py-0.5",
                s.done   ? "bg-ortaq-trust/15 text-ortaq-trust"  :
                s.active ? "bg-amber-100 text-amber-700 ring-1 ring-amber-300" :
                           "bg-gray-100 text-gray-400",
              )}>
                <span className="text-[0.375rem] font-bold">{s.done ? "✓" : s.active ? "►" : "○"}</span>
                <span className="text-[0.475rem] font-semibold whitespace-nowrap">{s.label}</span>
              </div>
              {i < stages.length - 1 && (
                <span className={cn("text-[0.5rem]", s.done ? "text-ortaq-trust" : "text-gray-200")}>→</span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 divide-x divide-ortaq-border">
        {/* Documents */}
        <div className="p-3">
          <p className="text-[0.475rem] font-bold uppercase tracking-[0.07em] text-ortaq-ink-soft mb-2">
            {isTR ? "Belgeler" : "Documents"}
          </p>
          <div className="space-y-1.5">
            {docs.map((d) => (
              <div key={d.label} className="flex items-center gap-1.5">
                <span className="text-[0.75rem]">{d.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-[0.5rem] font-semibold text-ortaq-ink">{d.label}</p>
                </div>
                <span className={cn("rounded-full px-1.5 py-0.5 text-[0.35rem] font-bold shrink-0", colorMap[d.color])}>
                  {d.status}
                </span>
              </div>
            ))}
          </div>
        </div>
        {/* Messages in context */}
        <div className="p-3">
          <p className="text-[0.475rem] font-bold uppercase tracking-[0.07em] text-ortaq-ink-soft mb-2">
            {isTR ? "Mesajlar" : "Messages"}
          </p>
          <div className="space-y-2">
            {items.map((item) => (
              <div key={item.time} className="flex items-start gap-1.5">
                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-ortaq-trust/15 text-[0.35rem] font-bold text-ortaq-trust">
                  {item.who}
                </span>
                <div className="min-w-0">
                  <p className="text-[0.475rem] text-ortaq-ink leading-snug">{item.text}</p>
                  <p className="text-[0.35rem] text-ortaq-ink-soft">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
          {/* Next action */}
          <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-2 py-1.5">
            <p className="text-[0.4rem] font-bold uppercase tracking-[0.06em] text-amber-600">
              {isTR ? "Sıradaki Adım" : "Next Step"}
            </p>
            <p className="mt-0.5 text-[0.5rem] font-semibold text-amber-900">
              {isTR ? "SGS onayı · Karşı taraf · Pazartesi" : "SGS approval · Counterparty · Monday"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── STEP 3: Shared status ────────────────────────────────────────────────── */

function Step3Visual({ isTR }: { isTR: boolean }) {
  const roles = [
    { code: "TR", flag: "🇹🇷", role: isTR ? "Tedarikçi · İstanbul" : "Supplier · Istanbul",     color: "border-ortaq-trust bg-ortaq-trust/5" },
    { code: "DE", flag: "🇩🇪", role: isTR ? "Alıcı · Hamburg"    : "Buyer · Hamburg",            color: "border-blue-300 bg-blue-50/50" },
    { code: "TH", flag: "🇹🇭", role: isTR ? "Lojistik · Bangkok"  : "Logistics · Bangkok",       color: "border-amber-300 bg-amber-50/50" },
    { code: "AE", flag: "🇦🇪", role: isTR ? "Finans · Dubai"      : "Finance · Dubai",           color: "border-violet-300 bg-violet-50/50" },
  ];

  const status = {
    stage:   isTR ? "Muayene Aşaması" : "Inspection Stage",
    pct:     "78%",
    sgs:     isTR ? "Bekleniyor" : "Pending",
    bl:      isTR ? "Taslak" : "Draft",
    ship:    isTR ? "28 Haziran" : "Jun 28",
    next:    isTR ? "SGS · Karşı taraf" : "SGS · Counterparty",
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      {roles.map((r) => (
        <div key={r.code} className={cn("overflow-hidden rounded-xl border", r.color)}>
          {/* Role header */}
          <div className="border-b border-current/10 px-3 py-2">
            <div className="flex items-center gap-1.5">
              <span className="text-[0.875rem]">{r.flag}</span>
              <p className="text-[0.4375rem] font-bold text-ortaq-ink leading-tight">{r.role}</p>
            </div>
          </div>
          {/* Status — IDENTICAL for all four */}
          <div className="px-3 py-2 space-y-1">
            <StatusLine label={isTR ? "Aşama" : "Stage"} value={status.stage} highlight />
            <StatusLine label={isTR ? "İlerleme" : "Progress"} value={status.pct} />
            <StatusLine label="SGS" value={status.sgs} warn />
            <StatusLine label="BL" value={status.bl} />
            <StatusLine label={isTR ? "Sevkiyat" : "Shipment"} value={status.ship} />
          </div>
          {/* Next action */}
          <div className="border-t border-current/10 bg-white/50 px-3 py-1.5">
            <p className="text-[0.38rem] text-ortaq-ink-soft">
              <span className="font-semibold text-ortaq-ink">{isTR ? "Sıradaki:" : "Next:"}</span>{" "}
              {status.next}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

function StatusLine({ label, value, highlight, warn }: { label: string; value: string; highlight?: boolean; warn?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-[0.375rem] font-semibold text-ortaq-ink-soft">{label}</span>
      <span className={cn(
        "text-[0.4375rem] font-bold",
        highlight ? "text-ortaq-ink" : warn ? "text-amber-600" : "text-ortaq-ink",
      )}>
        {value}
      </span>
    </div>
  );
}

/* ── STEP 4: No more asking ───────────────────────────────────────────────── */

function Step4Visual({ isTR }: { isTR: boolean }) {
  const before = [
    { icon: "📱", text: isTR ? "Ali Bey, SGS onaylandı mı?" : "Ali, has SGS been approved?", from: isTR ? "Siz" : "You" },
    { icon: "📞", text: isTR ? "3 kez aradım, ulaşamadım" : "Called 3 times, no answer", from: isTR ? "Asistan" : "Assistant" },
    { icon: "📱", text: isTR ? "BL ne zaman kesilecek?" : "When will BL be issued?", from: isTR ? "Finans" : "Finance" },
    { icon: "📱", text: isTR ? "Son fiyat onaylandı mı?" : "Was the final price approved?", from: isTR ? "Satış" : "Sales" },
  ];

  const answers = [
    { label: "SGS",                                      value: isTR ? "Bekleniyor · alıcı tarafta" : "Pending · buyer side",  type: "warn"    as const },
    { label: "BL",                                       value: isTR ? "28 Haziran · SGS sonrası" : "Jun 28 · After SGS", type: "info"    as const },
    { label: isTR ? "Fiyat" : "Price",                  value: "€1.260/MT · " + (isTR ? "Onaylandı" : "Approved"),       type: "confirm" as const },
    { label: isTR ? "Sevkiyat" : "Shipment",            value: isTR ? "28 Haziran · Planlandı" : "Jun 28 · Scheduled",   type: "confirm" as const },
  ];

  const typeStyle = {
    warn:    "bg-amber-100 text-amber-700",
    info:    "bg-sky-100 text-sky-700",
    confirm: "bg-emerald-100 text-emerald-700",
  } as const;

  return (
    <div className="grid grid-cols-2 gap-4 items-start">
      {/* Before */}
      <div>
        <p className="mb-2 text-center text-[0.5rem] font-bold uppercase tracking-[0.08em] text-red-500">
          {isTR ? "Eskiden" : "Before"}
        </p>
        <div className="space-y-2">
          {before.map((m, i) => (
            <div key={i} className="flex items-start gap-1.5 rounded-lg border border-red-100 bg-red-50 px-2 py-1.5">
              <span className="text-[0.75rem] shrink-0">{m.icon}</span>
              <div className="min-w-0">
                <p className="text-[0.38rem] font-semibold text-red-700 leading-snug">{m.text}</p>
                <p className="text-[0.32rem] text-red-400">{m.from}</p>
              </div>
            </div>
          ))}
          <p className="text-center text-[0.4375rem] text-red-400 font-medium">
            {isTR ? "Cevap yok. Kimse bilmiyor." : "No answer. Nobody knows."}
          </p>
        </div>
      </div>

      {/* Arrow */}
      <div className="flex flex-col gap-3">
        <p className="mb-2 text-center text-[0.5rem] font-bold uppercase tracking-[0.08em] text-emerald-600">
          {isTR ? "ORTAQ ile" : "With ORTAQ"}
        </p>
        {/* Status board — answers always visible */}
        <div className="overflow-hidden rounded-xl border border-ortaq-border bg-white shadow-sm">
          <div className="border-b border-ortaq-border bg-ortaq-surface px-3 py-1.5">
            <p className="text-[0.4375rem] font-bold text-ortaq-ink">
              {isTR ? "Çelik Tedariki · Durum" : "Steel Supply · Status"}
            </p>
          </div>
          <div className="divide-y divide-ortaq-border/50">
            {answers.map((a) => (
              <div key={a.label} className="flex items-center justify-between gap-2 px-3 py-1.5">
                <span className="text-[0.4375rem] font-semibold text-ortaq-ink">{a.label}</span>
                <span className={cn("rounded-full px-1.5 py-0.5 text-[0.35rem] font-bold whitespace-nowrap", typeStyle[a.type])}>
                  {a.value}
                </span>
              </div>
            ))}
          </div>
        </div>
        <p className="text-center text-[0.475rem] font-semibold text-emerald-600">
          {isTR ? "Soru sormaya gerek kalmaz." : "No need to ask."}
        </p>
      </div>
    </div>
  );
}
