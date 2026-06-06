"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/cn";
import { Container } from "@/components/ui/Section";
import { PublicShell } from "@/components/layout/PublicShell";

/**
 * KimlerIcinView — Who uses ORTAQ?
 *
 * Goal: self-identification in under 10 seconds.
 * A visitor reads the list and thinks: "Bu benim."
 *
 * Language rules:
 *   - Real Turkish business language. Not startup. Not consultant.
 *   - Write like someone who has run international trade operations
 *     is explaining the product to another business person.
 *   - Banned: platform, görünürlük, koordinasyon, ekosistem, paydaş,
 *             dijital dönüşüm, iş akışı, süreç yönetimi
 *   - Use: sözleşme, SGS, ödeme, sevkiyat, alıcı, satıcı, tedarikçi
 *
 * 7 profiles:
 *   1. İhracat yapan üreticiler
 *   2. İthalat yapan şirketler
 *   3. Satın alma ekipleri
 *   4. Dış ticaret ekipleri
 *   5. Traderlar / komisyon acenteleri
 *   6. Distribütör yöneten şirketler
 *   7. Birden fazla aktif işlemi aynı anda yöneten firmalar
 */

interface Profile {
  icon: string;
  title: string;
  sub: string;
  problem: string;
  tools: string[];
  withOrtaq: string[];
  quote: string;
}

export function KimlerIcinView() {
  const { i18n } = useTranslation();
  const isTR = (i18n.language ?? "tr").startsWith("tr");

  const profiles: Profile[] = isTR ? [
    {
      icon: "🏭",
      title: "İhracat yapan üreticiler",
      sub: "Tekstil, gıda, metal, kimya, mobilya — üretip dışarıya satan firmalar",
      problem:
        "Müşteriden teklif isteği geliyor. Sonrasında müzakere e-postayla, sözleşme PDF'le, SGS onayı WhatsApp'la, sevkiyat belgesi kuryeyle. Herkes ayrı bir yerden takip ediyor. Muhasebe ödemenin çıkıp çıkmadığını biliyor mu? Lojistik SGS'nin onaylandığını biliyor mu?",
      tools: ["WhatsApp", "E-posta", "Excel", "PDF", "Telefon"],
      withOrtaq: [
        "Müşterinin hangi sözleşme versiyonunu gördüğünü biliyorsunuz.",
        "SGS onayı geldiğinde herkes aynı anda görüyor.",
        "BL kesildi mi, LC açıldı mı — tek ekrandan.",
        "Lojistik ve muhasebe aynı işlem kaydına bakıyor.",
      ],
      quote: "\"Müşteriye 'hangi versiyon sizde?' diye sormak zorunda kalmıyorsunuz.\"",
    },
    {
      icon: "📦",
      title: "İthalat yapan şirketler",
      sub: "Yurt dışından hammadde, ürün veya ekipman satın alan firmalar",
      problem:
        "Tedarikçiden teklif alındı, fiyat pazarlığı e-postayla gitti geldi, sözleşme imzalandı. Ama SGS raporu ne zaman gelecek? Ödeme zamanında yapıldı mı? Gemi ne zaman yola çıkıyor? Bu soruları cevaplamak için kaç kişiyi aramak gerekiyor?",
      tools: ["WhatsApp", "E-posta", "Excel", "Telefon"],
      withOrtaq: [
        "Tedarikçinin hangi aşamada olduğunu anlık görüyorsunuz.",
        "SGS raporu yüklenince anında bilginiz oluyor.",
        "Sevkiyat tarihi değişirse kayıtta görünüyor.",
        "Ödemeyi yapacak finans ekibi de aynı kaydı görüyor.",
      ],
      quote: "\"Tedarikçimi aramadan son durumu biliyorum.\"",
    },
    {
      icon: "📋",
      title: "Satın alma ekipleri",
      sub: "Birden fazla tedarikçiyle aynı anda çalışan satın alma departmanları",
      problem:
        "Onlarca tedarikçi, onlarca aktif sipariş. Her biri farklı kanaldan yazıyor. Kimi WhatsApp'tan, kimi e-postadan, kimi iş arkadaşınızın telefonundan. Hangi siparişin hangi aşamada olduğunu takip edebilmek için neredeyse tam zamanlı bir asistan gerekiyor.",
      tools: ["E-posta", "WhatsApp", "Excel", "ERP"],
      withOrtaq: [
        "Hangi tedarikçi ne bekliyor — tek listeden.",
        "Fiyat revizyonu hangi versiyonda kaldı — kayıtta.",
        "Sözleşme imzalandı mı, onay bekleniyor mu — görünüyor.",
        "Yeni biri ekibe katılsa, kayda bakarak bilgi sahibi olabiliyor.",
      ],
      quote: "\"Hangi sipariş nerede kalmış aramak yerine sabah bir ekrana bakıyorum.\"",
    },
    {
      icon: "🌍",
      title: "Dış ticaret ekipleri",
      sub: "Şirket içinde ihracat ve ithalatı koordine eden departmanlar",
      problem:
        "Aynı anda birden fazla ülkeyle iş yapılıyor. Müşteriler farklı zaman dilimlerinde. Yazışmalar farklı dillerde. İçeride satış, lojistik, finans ve hukuk ayrı ayrı iletişim kuruyor. Aynı işlemle ilgili iç yazışmalar ile dış yazışmalar birbirine karışıyor.",
      tools: ["E-posta", "WhatsApp", "WeChat", "Excel", "PDF"],
      withOrtaq: [
        "Bir işleme ait tüm belgeler ve yazışmalar aynı yerde.",
        "İç ekip ile müşteri arasındaki sorumluluklar ayrı görünüyor.",
        "Dil ne olursa olsun, belge statüsü net.",
        "Hangi ülkedeki müşteri ne aşamada — tek bakışta.",
      ],
      quote: "\"İç koordinasyon toplantısına gerek kalmıyor. Herkes aynı ekrana bakıyor.\"",
    },
    {
      icon: "🤝",
      title: "Traderlar ve aracılar",
      sub: "Alıcı ve satıcı arasında köprü kuran ticaret acenteleri ve komisyoncular",
      problem:
        "Bir taraftan tedarikçi yazıyor, öbür taraftan müşteri. İkisi de sizi arıyor çünkü tek bilgi kaynağı sizsiniz. SGS onayı geldi mi? Fiyat netleşti mi? Sözleşmeyi imzaladılar mı? Tüm bu soruları sürekli karşılıklı aktarmak yorucu ve hatalı olabiliyor.",
      tools: ["WhatsApp", "E-posta", "Telefon", "Excel"],
      withOrtaq: [
        "Alıcı ve satıcı aynı işlem kaydını görebiliyor.",
        "Siz her ikisine de ayrı ayrı aktarmak zorunda kalmıyorsunuz.",
        "SGS, BL, sözleşme — her şey kayıtta, iki taraf için.",
        "Bir anlaşmazlık çıktığında hangisi doğru belli — kayıtta.",
      ],
      quote: "\"İki taraf arasında bilgi taşımakla zaman kaybetmiyorum artık.\"",
    },
    {
      icon: "🏢",
      title: "Distribütör yöneten şirketler",
      sub: "Farklı ülkelerde distribütörlerle çalışan üreticiler ve markalı ürün sahipleri",
      problem:
        "Her distribütörle fiyat, sözleşme, minimum sipariş şartları farklı. Yıllık kontratlar, kampanya anlaşmaları, özel koşullar. Kimin hangi versiyonu aldığı zaman içinde belirsizleşiyor. Birinde yapılan revizyon diğerine yansımadı mı yansıdı mı?",
      tools: ["E-posta", "Excel", "PDF", "ERP"],
      withOrtaq: [
        "Her distribütörün sözleşmesi ayrı işlem kaydında.",
        "Hangi versiyon imzalı — hangisi eski, açık görünüyor.",
        "Revizyon gönderdiniz mi? Onayladı mı? Kayıtta.",
        "Hangi distribütörde hangi ürün hangi fiyatta — takip edilebilir.",
      ],
      quote: "\"Hangi distribütöre hangi versiyonu gönderdim artık araştırmak zorunda değilim.\"",
    },
    {
      icon: "⚡",
      title: "Birden fazla işlemi aynı anda yönetenler",
      sub: "Aynı anda 5, 10, 20 aktif işlem yürüten şirketler veya bireyler",
      problem:
        "Her sabah: hangi işlem nerede kalmış? SGS bekleniyor muydu, alıcı onayı mı? Ödeme bu hafta çıkacak mıydı? Gemi kalkış tarihi değişti mi? Bu soruları cevaplamak için ya excel açılıyor, ya WhatsApp karıştırılıyor, ya birinin aranması gerekiyor.",
      tools: ["Excel", "WhatsApp", "E-posta", "Telefon", "PDF"],
      withOrtaq: [
        "Tüm aktif işlemlerin durumu tek ekranda.",
        "Hangisi bekliyor, hangisi ilerliyor, hangisi takılmış — görünüyor.",
        "Bir işlemi başka birine devredeceksiniz? Kayıt zaten orada.",
        "Sabah 5 dakikada günü planlayabiliyorsunuz.",
      ],
      quote: "\"20 işlemi aynı anda takip etmek artık bir excel sorunu değil.\"",
    },
  ] : [
    {
      icon: "🏭",
      title: "Manufacturers who export",
      sub: "Textile, food, metal, chemicals, furniture — companies that produce and sell abroad",
      problem:
        "A customer sends an inquiry. Then negotiation is by email, contract by PDF, SGS approval by WhatsApp, shipping documents by courier. Everyone tracks from a different place. Does accounting know whether payment arrived? Does logistics know SGS was approved?",
      tools: ["WhatsApp", "Email", "Excel", "PDF", "Phone"],
      withOrtaq: [
        "You know which contract version your customer is looking at.",
        "When SGS approval arrives, everyone sees it at the same time.",
        "BL issued? LC opened? — from one screen.",
        "Logistics and accounting look at the same deal record.",
      ],
      quote: "\"You no longer need to ask the customer 'which version do you have?'\"",
    },
    {
      icon: "📦",
      title: "Companies that import",
      sub: "Companies purchasing raw materials, products or equipment from abroad",
      problem:
        "Got an offer from a supplier, price negotiation went back and forth by email, contract was signed. But when will the SGS report arrive? Was payment made on time? When does the vessel depart? How many people do you need to call to answer these questions?",
      tools: ["WhatsApp", "Email", "Excel", "Phone"],
      withOrtaq: [
        "You see in real time where your supplier is in the process.",
        "When the SGS report is uploaded, you know instantly.",
        "If the shipment date changes, it appears in the record.",
        "Your finance team that will make payment sees the same record.",
      ],
      quote: "\"I know the latest status without calling my supplier.\"",
    },
    {
      icon: "📋",
      title: "Procurement teams",
      sub: "Purchasing departments working with multiple suppliers simultaneously",
      problem:
        "Dozens of suppliers, dozens of active orders. Each communicating through a different channel. Some on WhatsApp, some by email, some through a colleague's phone. Tracking which order is at which stage requires practically a full-time assistant.",
      tools: ["Email", "WhatsApp", "Excel", "ERP"],
      withOrtaq: [
        "Which supplier is waiting for what — from one list.",
        "Which version did the price revision stop at — in the record.",
        "Contract signed? Approval pending? — visible.",
        "A new team member can get up to speed by looking at the record.",
      ],
      quote: "\"Instead of searching for where each order is, I look at one screen every morning.\"",
    },
    {
      icon: "🌍",
      title: "International trade teams",
      sub: "Departments inside companies coordinating imports and exports",
      problem:
        "Working with multiple countries at the same time. Customers in different time zones. Correspondence in different languages. Sales, logistics, finance and legal each communicating separately internally. Internal and external correspondence about the same deal gets mixed up.",
      tools: ["Email", "WhatsApp", "WeChat", "Excel", "PDF"],
      withOrtaq: [
        "All documents and correspondence for a deal are in the same place.",
        "Responsibilities between the internal team and customer are visibly separate.",
        "Whatever the language, document status is clear.",
        "Which country's customer is at which stage — at a glance.",
      ],
      quote: "\"No need for internal coordination meetings. Everyone looks at the same screen.\"",
    },
    {
      icon: "🤝",
      title: "Traders and intermediaries",
      sub: "Trade agents and brokers who bridge buyers and sellers",
      problem:
        "The supplier writes from one side, the customer from the other. Both call you because you are the only source of information. Has SGS been approved? Has the price been finalised? Have they signed the contract? Constantly relaying all these back and forth is exhausting and prone to errors.",
      tools: ["WhatsApp", "Email", "Phone", "Excel"],
      withOrtaq: [
        "Buyer and seller can see the same deal record.",
        "You no longer have to relay information to each separately.",
        "SGS, BL, contract — everything on record, for both parties.",
        "If a dispute arises, which is correct is clear — it is in the record.",
      ],
      quote: "\"I no longer waste time carrying information between two parties.\"",
    },
    {
      icon: "🏢",
      title: "Companies managing distributors",
      sub: "Manufacturers and brand owners working with distributors in different countries",
      problem:
        "Different prices, contracts and minimum order conditions with each distributor. Annual contracts, campaign agreements, special terms. Over time it becomes unclear who received which version. Did a revision made for one get applied to another?",
      tools: ["Email", "Excel", "PDF", "ERP"],
      withOrtaq: [
        "Each distributor's contract is in a separate deal record.",
        "Which version is signed — which is old, clearly visible.",
        "Did you send a revision? Did they approve? In the record.",
        "Which distributor, which product, which price — trackable.",
      ],
      quote: "\"I no longer need to research which version I sent to which distributor.\"",
    },
    {
      icon: "⚡",
      title: "Managing multiple deals simultaneously",
      sub: "Companies or individuals running 5, 10, 20 active deals at the same time",
      problem:
        "Every morning: where did each deal stop? Was SGS pending, or was it buyer approval? Was payment going out this week? Has the vessel departure date changed? Answering these questions means opening Excel, scrolling through WhatsApp, or calling someone.",
      tools: ["Excel", "WhatsApp", "Email", "Phone", "PDF"],
      withOrtaq: [
        "Status of all active deals on one screen.",
        "Which is waiting, which is moving, which is stuck — visible.",
        "Handing a deal to someone else? The record is already there.",
        "You can plan your day in 5 minutes each morning.",
      ],
      quote: "\"Managing 20 deals at once is no longer an Excel problem.\"",
    },
  ];

  return (
    <PublicShell stickyCta={false}>
      <div className="bg-ortaq-surface">

        {/* Page header */}
        <div className="border-b border-ortaq-border bg-white">
          <Container wide>
            <div className="py-10 sm:py-14">
              <p className="text-[0.6875rem] font-bold uppercase tracking-[0.1em] text-ortaq-trust">
                {isTR ? "Kimler İçin" : "Who Is It For"}
              </p>
              <h1 className="mt-3 max-w-xl text-[2rem] font-bold tracking-[-0.03em] text-ortaq-ink sm:text-[2.5rem] leading-[1.05]">
                {isTR
                  ? <>Sizi tanımlayan bir profil<br /><span className="text-ortaq-trust">aşağıda var mı?</span></>
                  : <>Is there a profile below<br /><span className="text-ortaq-trust">that describes you?</span></>
                }
              </h1>
              <p className="mt-4 max-w-lg text-[0.9375rem] leading-relaxed text-ortaq-ink-muted">
                {isTR
                  ? "ORTAQ belirli bir sektör için değil. Aktif ticari işlem yöneten herkes için. Hangi grupta olduğunuza bakın."
                  : "ORTAQ is not for a specific industry. It is for anyone managing active commercial transactions. See which group applies to you."}
              </p>
            </div>
          </Container>
        </div>

        {/* Profile grid */}
        <Container wide>
          <div className="py-10 sm:py-14">
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {profiles.map((p, i) => (
                <ProfileCard key={i} profile={p} isTR={isTR} />
              ))}
            </div>
          </div>
        </Container>

        {/* Common denominator */}
        <div className="border-t border-ortaq-border bg-ortaq-ink">
          <Container wide>
            <div className="py-12 sm:py-16">
              <p className="mb-6 text-[0.5625rem] font-bold uppercase tracking-[0.1em] text-ortaq-cream/40">
                {isTR ? "Hepsinin ortak sorunu" : "The common problem in all of them"}
              </p>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {(isTR ? [
                  { q: "Hangi belge güncel?",     a: "Doğru versiyonu bulmak için arama yapıyorsunuz." },
                  { q: "Sıra kimde?",              a: "Alıcı mı bekliyor, siz mi? Belli değil." },
                  { q: "Son durum ne?",            a: "Birine sormadan öğrenemiyorsunuz." },
                  { q: "Ödeme ne zaman çıkacak?", a: "Finans başka, operasyon başka bir şey biliyor." },
                ] : [
                  { q: "Which document is current?", a: "You search to find the correct version." },
                  { q: "Whose turn is it?",           a: "Is the buyer waiting, or are you? Not clear." },
                  { q: "What is the latest status?",  a: "You cannot find out without asking someone." },
                  { q: "When is payment going out?",  a: "Finance knows one thing, operations another." },
                ]).map((item, i) => (
                  <div key={i} className="rounded-xl border border-ortaq-cream/10 bg-ortaq-cream/5 p-4">
                    <p className="text-[0.875rem] font-bold text-ortaq-cream">{item.q}</p>
                    <p className="mt-1.5 text-[0.5375rem] leading-relaxed text-ortaq-cream/60">{item.a}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 border-t border-ortaq-cream/10 pt-8 text-center">
                <p className="text-[1.125rem] font-bold text-ortaq-cream">
                  {isTR
                    ? "Bu soruların cevabı ORTAQ kaydında hazır."
                    : "The answers to these questions are ready in the ORTAQ record."}
                </p>
                <p className="mt-2 text-[0.875rem] text-ortaq-cream/60">
                  {isTR
                    ? "Araştırmadan. Aramadan. Kimseye sormadan."
                    : "Without searching. Without calling. Without asking anyone."}
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <Link
                    href="/demo"
                    className="inline-flex min-h-11 items-center justify-center rounded-lg bg-ortaq-trust px-7 text-[0.9375rem] font-bold text-white shadow-sm transition-all hover:bg-ortaq-trust-soft active:scale-[0.98]"
                  >
                    {isTR ? "Demo İsteyin" : "Request Demo"}
                  </Link>
                  <Link
                    href="/senaryolar"
                    className="inline-flex min-h-11 items-center justify-center rounded-lg border border-ortaq-cream/20 px-5 text-[0.9375rem] font-medium text-ortaq-cream/80 transition-colors hover:border-ortaq-cream/40 hover:text-ortaq-cream"
                  >
                    {isTR ? "Kullanım Senaryoları →" : "Use Cases →"}
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

/* ── Profile card ─────────────────────────────────────────────────────────── */

function ProfileCard({ profile, isTR }: { profile: Profile; isTR: boolean }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-ortaq-border bg-white">

      {/* Header */}
      <div className="border-b border-ortaq-border bg-ortaq-surface px-5 py-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl leading-none">{profile.icon}</span>
          <div>
            <p className="text-[0.9375rem] font-bold text-ortaq-ink">{profile.title}</p>
            <p className="mt-0.5 text-[0.5rem] leading-relaxed text-ortaq-ink-soft">{profile.sub}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col divide-y divide-ortaq-border">

        {/* The problem — in plain language */}
        <div className="px-5 py-4">
          <p className="mb-2 text-[0.4375rem] font-bold uppercase tracking-[0.08em] text-red-500">
            {isTR ? "Şu an yaşanan problem" : "Current problem"}
          </p>
          <p className="text-[0.5375rem] leading-relaxed text-ortaq-ink">{profile.problem}</p>
        </div>

        {/* Current tools */}
        <div className="px-5 py-3.5">
          <p className="mb-2 text-[0.4375rem] font-bold uppercase tracking-[0.08em] text-ortaq-ink-soft">
            {isTR ? "Şu an ne kullanıyorlar?" : "What they currently use"}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {profile.tools.map((tool) => (
              <span
                key={tool}
                className="rounded-md border border-ortaq-border bg-ortaq-surface px-2 py-0.5 text-[0.4375rem] font-semibold text-ortaq-ink-soft"
              >
                {tool}
              </span>
            ))}
          </div>
        </div>

        {/* With ORTAQ */}
        <div className="flex-1 px-5 py-4">
          <p className="mb-2 text-[0.4375rem] font-bold uppercase tracking-[0.08em] text-ortaq-trust">
            {isTR ? "ORTAQ ile ne kolaylaşır?" : "What becomes easier with ORTAQ"}
          </p>
          <ul className="space-y-1.5">
            {profile.withOrtaq.map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-[3px] h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                <span className="text-[0.5rem] leading-relaxed text-ortaq-ink">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Quote */}
        <div className="bg-ortaq-trust/[0.04] px-5 py-3.5">
          <p className="text-[0.5rem] italic leading-relaxed text-ortaq-trust">{profile.quote}</p>
        </div>

      </div>
    </div>
  );
}
