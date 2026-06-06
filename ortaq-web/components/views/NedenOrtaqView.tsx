"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Container } from "@/components/ui/Section";
import { PublicShell } from "@/components/layout/PublicShell";
import { StoryBar } from "@/components/layout/StoryBar";

/**
 * NedenOrtaqView — Why ORTAQ?
 *
 * Journey position: Homepage → Kimler İçin → Senaryolar → [Neden ORTAQ] → Demo
 *
 * Goal: Build credibility — not through founder bios or startup narrative,
 * but by showing that experienced trade people recognised a real problem and
 * built a specific solution for it.
 *
 * This page answers: "Why should I trust the people building this?"
 *
 * Tone requirements:
 *   - Practical. Humble. Credible.
 *   - Written like an experienced exporter talking to another business person.
 *   - NO startup language. NO vision statements. NO founder story.
 *   - If a sentence sounds like a LinkedIn post, delete it.
 *   - If a sentence sounds like something a factory owner would say, keep it.
 *
 * Banned words: platform, ecosystem, digital transformation, workflow,
 *   coordination, stakeholder, visibility, system of record, disrupting,
 *   passionate, mission, revolutionise, empower
 *
 * Use: SGS, LC, BL, sözleşme, ödeme, sevkiyat, alıcı, satıcı, tedarikçi
 */

export function NedenOrtaqView() {
  const { i18n } = useTranslation();
  const isTR = (i18n.language ?? "tr").startsWith("tr");

  return (
    <PublicShell stickyCta={false}>
      <StoryBar />

      <div className="bg-ortaq-surface">

        {/* ─── HEADER ─────────────────────────────────────────── */}
        <div className="border-b border-ortaq-border bg-white">
          <Container wide>
            <div className="py-10 sm:py-14">
              <p className="text-[0.6875rem] font-bold uppercase tracking-[0.1em] text-ortaq-trust">
                {isTR ? "Neden ORTAQ" : "Why ORTAQ"}
              </p>
              <h1 className="mt-3 max-w-xl text-[2rem] font-bold tracking-[-0.03em] text-ortaq-ink sm:text-[2.5rem] leading-[1.05]">
                {isTR
                  ? <>Bu sorunu bilen insanlar<br /><span className="text-ortaq-trust">yazdı.</span></>
                  : <>Written by people who<br /><span className="text-ortaq-trust">know this problem.</span></>
                }
              </h1>
              <p className="mt-4 max-w-lg text-[0.9375rem] leading-relaxed text-ortaq-ink-muted">
                {isTR
                  ? "Dış ticaret, satın alma ve üretim alanında yıllarca çalışmış insanlar bu eksikliği bizzat yaşadı. Bir yazılım şirketi olarak değil, bu sorunu çözme ihtiyacıyla başladılar."
                  : "People who spent years in international trade, procurement, and manufacturing experienced this gap first-hand. They started not as a software company, but out of a need to solve this specific problem."}
              </p>
            </div>
          </Container>
        </div>

        {/* ─── SECTION 1: Where information scatters ──────────── */}
        <div className="border-b border-ortaq-border">
          <Container wide>
            <div className="py-10 sm:py-14">
              <SectionLabel isTR={isTR} tr="Bir işlemin bilgisi nerede dağılıyor?" en="Where does a deal's information scatter?" />

              <p className="mb-8 max-w-lg text-[0.875rem] leading-relaxed text-ortaq-ink-muted">
                {isTR
                  ? "Tek bir satış işleminde bilgi ortalama beş farklı yerden yürüyor. Hiçbiri birbirleriyle konuşmuyor."
                  : "In a single sales deal, information typically runs through five separate places. None of them talk to each other."}
              </p>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {(isTR ? [
                  {
                    tool: "WhatsApp",
                    color: "bg-[#25D366]/10 border-[#25D366]/30",
                    dot: "bg-[#25D366]",
                    items: ["Son fiyat pazarlığı", "Sevkiyat güncellemesi", "\"SGS geldi mi?\" sorusu", "Acil müdahale mesajları"],
                  },
                  {
                    tool: "E-posta",
                    color: "bg-blue-50 border-blue-200",
                    dot: "bg-blue-500",
                    items: ["Sözleşme taslakları (v1, v2, v3…)", "SGS raporu", "BL taslağı", "Alıcı yazışmaları"],
                  },
                  {
                    tool: "Excel",
                    color: "bg-emerald-50 border-emerald-200",
                    dot: "bg-emerald-500",
                    items: ["Sözleşme versiyon takibi", "Maliyet hesabı", "Sevkiyat takip tablosu", "Ödeme takvimi"],
                  },
                  {
                    tool: "PDF",
                    color: "bg-red-50 border-red-200",
                    dot: "bg-red-400",
                    items: ["İmzalı sözleşme", "Proforma fatura", "Packing list", "SGS raporu (ayrı dosya)"],
                  },
                  {
                    tool: "ERP",
                    color: "bg-orange-50 border-orange-200",
                    dot: "bg-orange-400",
                    items: ["Stok bilgisi", "Fatura kaydı", "Muhasebe girişi"],
                  },
                  {
                    tool: "Telefon",
                    color: "bg-slate-100 border-slate-200",
                    dot: "bg-slate-400",
                    items: ["Alıcı görüşmesi", "Banka güncellemesi", "\"Son durum ne?\" sorusu"],
                  },
                ] : [
                  {
                    tool: "WhatsApp",
                    color: "bg-[#25D366]/10 border-[#25D366]/30",
                    dot: "bg-[#25D366]",
                    items: ["Last price negotiation", "Shipment update", "\"Has SGS arrived?\" question", "Urgent messages"],
                  },
                  {
                    tool: "Email",
                    color: "bg-blue-50 border-blue-200",
                    dot: "bg-blue-500",
                    items: ["Contract drafts (v1, v2, v3…)", "SGS report", "BL draft", "Buyer correspondence"],
                  },
                  {
                    tool: "Excel",
                    color: "bg-emerald-50 border-emerald-200",
                    dot: "bg-emerald-500",
                    items: ["Contract version tracking", "Cost calculation", "Shipment tracking table", "Payment schedule"],
                  },
                  {
                    tool: "PDF",
                    color: "bg-red-50 border-red-200",
                    dot: "bg-red-400",
                    items: ["Signed contract", "Proforma invoice", "Packing list", "SGS report (separate file)"],
                  },
                  {
                    tool: "ERP",
                    color: "bg-orange-50 border-orange-200",
                    dot: "bg-orange-400",
                    items: ["Inventory data", "Invoice record", "Accounting entry"],
                  },
                  {
                    tool: "Phone",
                    color: "bg-slate-100 border-slate-200",
                    dot: "bg-slate-400",
                    items: ["Buyer call", "Bank update", "\"What is the latest status?\" question"],
                  },
                ]).map((t) => (
                  <div key={t.tool} className={`rounded-xl border p-4 ${t.color}`}>
                    <div className="mb-3 flex items-center gap-2">
                      <span className={`h-2.5 w-2.5 rounded-full ${t.dot}`} />
                      <span className="text-[0.5625rem] font-bold text-ortaq-ink">{t.tool}</span>
                    </div>
                    <ul className="space-y-1">
                      {t.items.map((item) => (
                        <li key={item} className="flex items-start gap-1.5">
                          <span className="mt-[5px] h-1 w-1 shrink-0 rounded-full bg-ortaq-ink-soft/40" />
                          <span className="text-[0.4375rem] leading-snug text-ortaq-ink-soft">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-xl border border-ortaq-ink/10 bg-ortaq-ink/[0.04] px-6 py-4">
                <p className="text-[0.875rem] font-semibold leading-snug text-ortaq-ink">
                  {isTR
                    ? "Kimse tam resmi görmüyor. Herkes kendi parçasını biliyor."
                    : "Nobody sees the full picture. Everyone knows their own piece."}
                </p>
                <p className="mt-1.5 text-[0.5375rem] leading-relaxed text-ortaq-ink-soft">
                  {isTR
                    ? "Bu bir insan hatası değil. Bunun için tasarlanmış bir araç yok çünkü."
                    : "This is not a human error. There was simply no tool built for this."}
                </p>
              </div>
            </div>
          </Container>
        </div>

        {/* ─── SECTION 2: Consequences ────────────────────────── */}
        <div className="border-b border-ortaq-border bg-white">
          <Container wide>
            <div className="py-10 sm:py-14">
              <SectionLabel isTR={isTR} tr="Bunun sonucu ne oluyor?" en="What are the consequences?" />

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {(isTR ? [
                  {
                    number: "01",
                    heading: "Sözleşme versiyonu çakışıyor.",
                    body: "Alıcı v10 diyerek ödeme yapıyor. Siz v12 geçerli diyorsunuz. İkisi de elindeki PDF'e bakıyor. Kimin elinde hangisi — belli değil.",
                  },
                  {
                    number: "02",
                    heading: "SGS onayı belirsiz kalıyor.",
                    body: "SGS bekleniyor mu, geldi mi, alıcı açtı mı? Kesin cevap için herkesi aramak gerekiyor. Gemi kalkıyor.",
                  },
                  {
                    number: "03",
                    heading: "Genel müdür sabah dört kişiyi arıyor.",
                    body: "\"Son durum ne?\" sorusunu yanıtlamak için finans, satış, operasyon ve lojistiği ayrı ayrı aramak zorunda kalıyor.",
                  },
                ] : [
                  {
                    number: "01",
                    heading: "Contract version conflict.",
                    body: "Buyer pays referencing v10. You say v12 is current. Both are looking at the PDF they have. Which one has which version — not clear.",
                  },
                  {
                    number: "02",
                    heading: "SGS approval stays unclear.",
                    body: "Is SGS pending, has it arrived, did the buyer open it? Getting a definitive answer means calling everyone. Vessel is departing.",
                  },
                  {
                    number: "03",
                    heading: "GM calls four people every morning.",
                    body: "To answer \"What is the latest status?\" they need to call finance, sales, operations and logistics separately.",
                  },
                ]).map((c) => (
                  <div key={c.number} className="rounded-xl border border-red-100 bg-red-50/60 p-5">
                    <span className="font-mono text-[0.4375rem] font-bold text-red-400">{c.number}</span>
                    <h3 className="mt-2 text-[1rem] font-bold leading-snug text-ortaq-ink">{c.heading}</h3>
                    <p className="mt-2 text-[0.5375rem] leading-relaxed text-ortaq-ink-soft">{c.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </div>

        {/* ─── SECTION 3: Who built this ──────────────────────── */}
        <div className="border-b border-ortaq-border">
          <Container wide>
            <div className="py-10 sm:py-14">
              <SectionLabel
                isTR={isTR}
                tr="Bunu bir yazılımcı değil, ticaret yapan insanlar yazdı."
                en="This was written by trade people, not software people."
              />

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-ortaq-border bg-white p-6">
                  <p className="text-[0.5625rem] leading-relaxed text-ortaq-ink">
                    {isTR
                      ? "Dış ticaret, satın alma ve üretim alanında çalışmış insanlar bu eksikliği bizzat gördü. Hangi belgenin nerede olduğunu bulmak için günde kaç saat harcandığını bildiler. SGS taslak versiyonunu, BL'nin ne zaman kesilmesi gerektiğini, LC sürecinin nasıl işlediğini bildiler."
                      : "People who had worked in international trade, procurement, and manufacturing saw this gap first-hand. They knew how many hours a day were spent finding which document was where. They knew what an SGS draft version means, when a BL needs to be cut, how the LC process works."}
                  </p>
                  <p className="mt-4 text-[0.5625rem] leading-relaxed text-ortaq-ink">
                    {isTR
                      ? "Bir yazılım şirketi olarak başlamadılar. Bu sorunu yaşadıktan sonra çözüm yazmaya karar verdiler."
                      : "They did not start as a software company. They decided to write a solution after experiencing this problem themselves."}
                  </p>
                </div>

                <div className="space-y-3">
                  {(isTR ? [
                    { label: "SGS taslak versiyonu ne demek — biliyorlar.", icon: "✓" },
                    { label: "BL'nin ne zaman kesilmesi gerektiği — biliyorlar.", icon: "✓" },
                    { label: "LC'nin neden geciktiği ve ne sorulması gerektiği — biliyorlar.", icon: "✓" },
                    { label: "Alıcı ile satıcının aynı sözleşmeye bakmamasının ne anlama geldiği — biliyorlar.", icon: "✓" },
                    { label: "Sözleşme v10 mu v12 mi tartışmasının nasıl çıktığı — biliyorlar.", icon: "✓" },
                  ] : [
                    { label: "What an SGS draft version means — they know.", icon: "✓" },
                    { label: "When a BL needs to be cut — they know.", icon: "✓" },
                    { label: "Why an LC is delayed and what to ask — they know.", icon: "✓" },
                    { label: "What it means when buyer and seller are not looking at the same contract — they know.", icon: "✓" },
                    { label: "How the v10 vs v12 contract dispute starts — they know.", icon: "✓" },
                  ]).map((item) => (
                    <div key={item.label} className="flex items-start gap-3 rounded-lg border border-emerald-100 bg-emerald-50/60 px-4 py-3">
                      <span className="mt-[1px] text-emerald-500 font-bold text-[0.75rem]">{item.icon}</span>
                      <span className="text-[0.5375rem] leading-snug text-ortaq-ink">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Container>
        </div>

        {/* ─── SECTION 4: What ORTAQ does / does not do ──────── */}
        <div className="border-b border-ortaq-border bg-white">
          <Container wide>
            <div className="py-10 sm:py-14">
              <SectionLabel
                isTR={isTR}
                tr="ORTAQ ne yapar — ne yapmaz."
                en="What ORTAQ does — and does not do."
              />

              <p className="mb-8 max-w-lg text-[0.875rem] leading-relaxed text-ortaq-ink-muted">
                {isTR
                  ? "Her şeyi yapan bir yazılım değil. Bir işlemin tüm parçalarını bir arada tutan kayıt."
                  : "Not a software that does everything. A record that holds all parts of a deal together."}
              </p>

              <div className="grid gap-6 sm:grid-cols-2">

                {/* Does */}
                <div>
                  <p className="mb-4 text-[0.4375rem] font-bold uppercase tracking-[0.09em] text-emerald-700">
                    {isTR ? "Ne yapar" : "What it does"}
                  </p>
                  <div className="space-y-3">
                    {(isTR ? [
                      "Bir işlemin belgelerini, onaylarını ve mesajlarını tek kayda toplar.",
                      "Alıcı ve satıcı aynı kaydı görür — iki ayrı uygulama değil, aynı kayıt.",
                      "Sıranın kimde olduğunu gösterir: alıcı mı, satıcı mı, banka mı bekliyor.",
                      "Genel müdür işleme bakarak son durumu görür — aramadan.",
                      "Hangi sözleşme versiyonunun geçerli olduğu tartışmasızdır.",
                    ] : [
                      "Brings a deal's documents, approvals and messages into one record.",
                      "Buyer and seller see the same record — not two separate apps, the same record.",
                      "Shows whose turn it is: is the buyer, seller, or bank waiting.",
                      "GM sees the latest status by looking at the deal — without calling anyone.",
                      "Which contract version is current is beyond dispute.",
                    ]).map((item) => (
                      <div key={item} className="flex items-start gap-2.5 rounded-lg border border-emerald-100 bg-emerald-50/50 px-4 py-3">
                        <span className="mt-[1px] h-2 w-2 shrink-0 rounded-full bg-emerald-400" />
                        <span className="text-[0.5375rem] leading-snug text-ortaq-ink">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Does NOT */}
                <div>
                  <p className="mb-4 text-[0.4375rem] font-bold uppercase tracking-[0.09em] text-ortaq-ink-soft">
                    {isTR ? "Ne yapmaz" : "What it does not do"}
                  </p>
                  <div className="space-y-3">
                    {(isTR ? [
                      { heading: "ERP değil.", body: "Muhasebe, stok ve fatura ORTAQ'a taşınmaz. ERP'niz değişmez." },
                      { heading: "CRM değil.", body: "Müşteri adayı takibi, satış hunisi, e-posta kampanyası yoktur." },
                      { heading: "Mesajlaşma uygulaması değil.", body: "WhatsApp'ın yerini almaz. Mesajlaşma orada olur, belge ve onay burada." },
                      { heading: "Her işi yapan süper uygulama değil.", body: "Ticari işlemin kaydını tutar. Hepsini değiştirmeye çalışmaz." },
                    ] : [
                      { heading: "Not an ERP.", body: "Accounting, inventory and invoicing do not move into ORTAQ. Your ERP does not change." },
                      { heading: "Not a CRM.", body: "No lead tracking, sales funnel or email campaigns." },
                      { heading: "Not a messaging app.", body: "Does not replace WhatsApp. Messaging happens there; documents and approvals happen here." },
                      { heading: "Not a super-app that does everything.", body: "It keeps the record of a commercial deal. It does not try to replace everything." },
                    ]).map((item) => (
                      <div key={item.heading} className="rounded-lg border border-ortaq-border bg-ortaq-surface px-4 py-3">
                        <p className="text-[0.5375rem] font-bold text-ortaq-ink">{item.heading}</p>
                        <p className="mt-1 text-[0.4375rem] leading-snug text-ortaq-ink-soft">{item.body}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </div>

        {/* ─── SECTION 5: The honest summary ─────────────────── */}
        <div className="border-b border-ortaq-border">
          <Container wide>
            <div className="py-10 sm:py-14">
              <SectionLabel
                isTR={isTR}
                tr="Dürüst bir özet."
                en="An honest summary."
              />

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {(isTR ? [
                  {
                    q: "Neden güvenilir?",
                    a: "Çünkü bu sistemi yazanlar SGS muayene sürecini, LC gecikmesini ve BL taslak tartışmasını bizzat yaşadı. Bir teknoloji şirketinin dışarıdan bakıp kurguladığı bir çözüm değil.",
                  },
                  {
                    q: "Neden şimdi?",
                    a: "Bu bilgi parçalanmışlığı 20 yıldır var. ERP'ler çözmedi. CRM'ler çözmedi. Kimse iki şirket arasındaki işlem kaydına odaklanmadı.",
                  },
                  {
                    q: "Neden ORTAQ?",
                    a: "Çünkü bir ihracat işleminde alıcı ve satıcı aynı kaydı görmeliydi. Bunu sağlayan bir araç yoktu. Şimdi var.",
                  },
                ] : [
                  {
                    q: "Why is it credible?",
                    a: "Because the people who wrote this system personally experienced SGS inspection processes, LC delays and BL draft disputes. It is not a solution designed by a technology company looking in from the outside.",
                  },
                  {
                    q: "Why now?",
                    a: "This information fragmentation has existed for 20 years. ERPs did not solve it. CRMs did not solve it. Nobody focused on the transaction record between two companies.",
                  },
                  {
                    q: "Why ORTAQ?",
                    a: "Because in an export deal, the buyer and seller should be looking at the same record. There was no tool that enabled this. Now there is.",
                  },
                ]).map((item) => (
                  <div key={item.q} className="rounded-xl border border-ortaq-border bg-white p-5">
                    <p className="text-[0.5625rem] font-bold text-ortaq-trust">{item.q}</p>
                    <p className="mt-3 text-[0.5375rem] leading-relaxed text-ortaq-ink">{item.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </div>

        {/* ─── FINAL CTA ──────────────────────────────────────── */}
        <div className="bg-ortaq-ink">
          <Container wide>
            <div className="py-12 sm:py-16">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[1.25rem] font-bold tracking-[-0.025em] text-ortaq-cream leading-tight">
                    {isTR
                      ? "Aktif bir işleminizi getirin. 30 dakika yeter."
                      : "Bring one active deal. 30 minutes is enough."}
                  </p>
                  <p className="mt-2 text-[0.875rem] text-ortaq-cream/60">
                    {isTR
                      ? "Genel bir demo değil. Sizin gerçek işleminizi birlikte inceleriz."
                      : "Not a generic demo. We look at your real deal together."}
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/senaryolar"
                    className="inline-flex min-h-11 items-center justify-center rounded-lg border border-ortaq-cream/20 px-5 text-[0.9375rem] font-medium text-ortaq-cream/80 transition-colors hover:border-ortaq-cream/40 hover:text-ortaq-cream"
                  >
                    {isTR ? "← Senaryolar" : "← Use Cases"}
                  </Link>
                  <Link
                    href="/demo"
                    className="inline-flex min-h-11 items-center justify-center rounded-lg bg-ortaq-trust px-7 text-[0.9375rem] font-bold text-white shadow-sm transition-all hover:bg-ortaq-trust-soft active:scale-[0.98]"
                  >
                    {isTR ? "Demo İsteyin" : "Request Demo"}
                  </Link>
                </div>
              </div>
            </div>
          </Container>
        </div>

      </div>
    </PublicShell>
  );
}

/* ── Shared section label ─────────────────────────────────────────────────── */

function SectionLabel({ isTR, tr, en }: { isTR: boolean; tr: string; en: string }) {
  return (
    <h2 className="text-[1.125rem] font-bold tracking-[-0.025em] text-ortaq-ink sm:text-[1.375rem] leading-snug">
      {isTR ? tr : en}
    </h2>
  );
}
