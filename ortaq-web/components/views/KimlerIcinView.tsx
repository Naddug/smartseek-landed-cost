"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/cn";
import { Container } from "@/components/ui/Section";
import { PublicShell } from "@/components/layout/PublicShell";
import { StoryBar } from "@/components/layout/StoryBar";

/**
 * KimlerIcinView — Who uses ORTAQ?
 *
 * Journey position: Homepage → [Kimler İçin] → Senaryolar → Neden ORTAQ → Demo
 *
 * Goal: self-identification. Visitor reads one card and thinks "Bu benim."
 *
 * Design: each profile is framed around the DAILY FRUSTRATION, not the feature.
 *   Not: "You can track documents."
 *   But: "Sabah hangi sözleşme versiyonunun geçerli olduğunu bulmak 20 dakika alıyor."
 *
 * Language rules:
 *   - Real Turkish business language. Written like someone who has done international
 *     trade is explaining the product to another business person.
 *   - Banned: platform, görünürlük, koordinasyon, ekosistem, paydaş,
 *             dijital dönüşüm, iş akışı
 *   - Use: sözleşme, SGS, ödeme, sevkiyat, alıcı, satıcı, tedarikçi
 */

interface Profile {
  icon: string;
  title: string;
  sub: string;
  day: string;          // what their day looks like
  chasing: string[];   // what info they constantly chase
  easier: string[];    // what becomes easier with ORTAQ
  quote: string;
  tools: string[];
}

export function KimlerIcinView() {
  const { i18n } = useTranslation();
  const isTR = (i18n.language ?? "tr").startsWith("tr");

  const profiles: Profile[] = isTR ? [
    {
      icon: "🏭",
      title: "İhracat yapan üreticiler",
      sub: "Tekstil, gıda, metal, kimya, mobilya — üretip dışarıya satan firmalar",
      day: "Müşteriden sipariş geldi. Fiyat WhatsApp'ta pazarlık edildi. Sözleşme e-postayla gidip geldi, üç versiyonda. SGS için alıcı ayrı firma atadı. BL için başka birine ulaşılıyor. Her aşama farklı kanalda, farklı kişide.",
      chasing: [
        "Alıcının elindeki sözleşme versiyonu doğru mu?",
        "SGS onayı geldi mi, kimde bekliyor?",
        "BL'yi kim kesiyor, ne zaman hazır?",
        "Ödeme bu haftaki bütçeye girecek mi?",
      ],
      easier: [
        "Müşteriye hangi versiyonun geçerli olduğunu sormuyorsunuz.",
        "SGS onayı geldiğinde herkes aynı anda görüyor.",
        "Yeni ekip üyesi kayda bakarak işlemi anlıyor.",
      ],
      quote: "\"Müşteriye 'bizde v12 var, sizde hangisi var?' diye sormak zorunda kalmıyorum.\"",
      tools: ["WhatsApp", "E-posta", "Excel", "PDF", "Telefon"],
    },
    {
      icon: "📦",
      title: "İthalat yapan şirketler",
      sub: "Yurt dışından hammadde, ürün veya ekipman satın alan firmalar",
      day: "Tedarikçiyle fiyat anlaştınız. Sözleşme imzalandı. Şimdi bekleyiş başlıyor: SGS muayenesi ne zaman yapılacak? Gemi ne zaman kalkıyor? Ödeme zamanında çıktı mı? Bu sorulara cevap bulmak için herkesi tek tek aramak gerekiyor.",
      chasing: [
        "Tedarikçi SGS için randevu aldı mı?",
        "Sevkiyat belgelerini sağladılar mı?",
        "Gemi kalkış tarihi değişti mi?",
        "Ödeme teyidi geldi mi?",
      ],
      easier: [
        "Tedarikçinizi aramadan nerede olduğunu görüyorsunuz.",
        "Sevkiyat tarihi değişirse kayıtta görünüyor.",
        "Finans ekibi de aynı kaydı görüyor, size sormak zorunda kalmıyor.",
      ],
      quote: "\"Tedarikçimi aramadan son durumu biliyorum.\"",
      tools: ["WhatsApp", "E-posta", "Excel", "Telefon"],
    },
    {
      icon: "📋",
      title: "Satın alma ekipleri",
      sub: "Aynı anda birden fazla tedarikçiyle çalışan satın alma departmanları",
      day: "Onlarca tedarikçi var. Kimi WhatsApp'tan yazıyor, kimi e-postayla, kimi iş arkadaşınızın telefonundan aradı. Hangi siparişin hangi aşamada olduğunu takip etmek için neredeyse tam zamanlı bir asistana ihtiyaç var. Sabah masanıza oturduğunuzda nereden başlayacağınızı bilmiyorsunuz.",
      chasing: [
        "Hangi tedarikçi ne için bekliyor?",
        "Hangi sözleşme son revizyon bekleniyor?",
        "Sipariş onayı gönderildi mi?",
        "Fiyat revizyonu kabul edildi mi?",
      ],
      easier: [
        "Hangi tedarikçi sizden bekliyor, hangisi kendi tarafında — tek bakışta.",
        "Yeni siparişi kim işleyecek — kayıtta atanmış görünüyor.",
        "Onay geçmişi takip edilebilir, kim ne zaman ne dedi.",
      ],
      quote: "\"Hangi sipariş nerede kalmış diye aramak yerine sabah bir ekrana bakıyorum.\"",
      tools: ["E-posta", "WhatsApp", "Excel", "ERP"],
    },
    {
      icon: "🌍",
      title: "Dış ticaret ekipleri",
      sub: "Şirket içinde ihracat ve ithalatı koordine eden departmanlar",
      day: "Almanya'dan alıcı yazıyor, Tayland'dan tedarikçi, içeriden finans soruyor. Hepsi aynı gün, hepsi farklı kanaldan. Bir işlem için dışarıda alıcıyla e-posta yazışması, içeride lojistikle WhatsApp yazışması, muhasemeyle telefon görüşmesi aynı anda yürüyor.",
      chasing: [
        "İçerideki ekip ile alıcı farklı mı biliyor?",
        "Hangi yazışma hangisi için geçerli?",
        "Dış sözleşme iç ekibe iletildi mi?",
        "Sevkiyat güncellemesi alıcıya ulaştı mı?",
      ],
      easier: [
        "Bir işleme ait tüm yazışmalar aynı yerde — iç ve dış ayrı.",
        "Hangi ülkedeki alıcı ne aşamada — tek bakışta.",
        "Dil ne olursa olsun belge statüsü net.",
      ],
      quote: "\"İç koordinasyon toplantısına gerek kalmıyor. Herkes aynı ekrana bakıyor.\"",
      tools: ["E-posta", "WhatsApp", "WeChat", "Excel", "PDF"],
    },
    {
      icon: "🤝",
      title: "Traderlar ve aracılar",
      sub: "Alıcı ve satıcı arasında köprü kuran ticaret acenteleri ve komisyoncular",
      day: "Bir taraftan tedarikçi yazıyor. Öbür taraftan alıcı soruyor. İkisi de sizi arıyor çünkü tek bilgi kaynağı sizsiniz. SGS onayı geldi mi? Fiyat netleşti mi? Hangi sözleşme versiyonu geçerli? Tüm bu soruları sürekli iki tarafa aktarmak iş vaktinizin yarısını alıyor.",
      chasing: [
        "Alıcı son fiyatı onayladı mı?",
        "Tedarikçi SGS randevusunu aldı mı?",
        "İki taraf aynı sözleşme versiyonunu görüyor mu?",
        "Ödeme hangi tarafa gitti, kim ne zaman alacak?",
      ],
      easier: [
        "İki tarafa ayrı ayrı aktarmak zorunda kalmıyorsunuz.",
        "SGS, BL, sözleşme — her şey kayıtta, herkes görüyor.",
        "Anlaşmazlık olursa hangisi doğru kayıtta tartışmasız.",
      ],
      quote: "\"İki taraf arasında bilgi taşımakla zaman kaybetmiyorum artık.\"",
      tools: ["WhatsApp", "E-posta", "Telefon", "Excel"],
    },
    {
      icon: "🏢",
      title: "Distribütör yöneten şirketler",
      sub: "Farklı ülkelerde distribütörlerle çalışan üreticiler ve marka sahipleri",
      day: "Her distribütörün farklı sözleşmesi, farklı fiyat şartları, farklı minimum sipariş miktarı var. Zaman içinde kimin hangi versiyonu aldığı belirsizleşiyor. Bir distribütöre yapılan revizyon diğerine yansıtıldı mı? İmzalı sözleşmeyi bulmak için arşiv karıştırılıyor.",
      chasing: [
        "Hangi distribütörde hangi sözleşme versiyonu imzalı?",
        "Fiyat revizyonu hepsine gönderildi mi?",
        "Hangi distribütör ne aşamada?",
        "Kimin onayı hâlâ eksik?",
      ],
      easier: [
        "Her distribütörün sözleşmesi ayrı işlem kaydında.",
        "Revizyon gönderildi mi, onayladı mı — kayıtta.",
        "Hangi distribütörde hangi ürün hangi fiyatta — takip edilebilir.",
      ],
      quote: "\"Kime hangi versiyonu gönderdim diye araştırmak zorunda değilim artık.\"",
      tools: ["E-posta", "Excel", "PDF", "ERP"],
    },
  ] : [
    {
      icon: "🏭",
      title: "Manufacturers who export",
      sub: "Textile, food, metal, chemicals, furniture — companies that produce and sell abroad",
      day: "An order arrived from a customer. Price was negotiated on WhatsApp. The contract went back and forth by email in three versions. The buyer assigned a separate company for SGS. Someone else handles the BL. Every stage is on a different channel, with a different person.",
      chasing: [
        "Is the contract version the buyer has correct?",
        "Has SGS approval arrived, with whom is it pending?",
        "Who is cutting the BL, when will it be ready?",
        "Will payment land in this week's budget?",
      ],
      easier: [
        "You no longer ask the customer which version is current.",
        "When SGS approval arrives, everyone sees it at the same time.",
        "A new team member understands the deal by reading the record.",
      ],
      quote: "\"I no longer have to ask the customer 'we have v12, which one do you have?'\"",
      tools: ["WhatsApp", "Email", "Excel", "PDF", "Phone"],
    },
    {
      icon: "📦",
      title: "Companies that import",
      sub: "Companies purchasing raw materials, products or equipment from abroad",
      day: "You agreed on a price with the supplier. Contract was signed. Now the waiting begins: when will the SGS inspection be done? When does the vessel depart? Did payment go out on time? Finding answers to these questions means calling everyone one by one.",
      chasing: [
        "Has the supplier booked the SGS appointment?",
        "Have they provided the shipping documents?",
        "Has the vessel departure date changed?",
        "Has payment confirmation arrived?",
      ],
      easier: [
        "You can see where your supplier is without calling them.",
        "If the shipment date changes, it appears in the record.",
        "Your finance team also sees the same record — they do not need to ask you.",
      ],
      quote: "\"I know the latest status without calling my supplier.\"",
      tools: ["WhatsApp", "Email", "Excel", "Phone"],
    },
    {
      icon: "📋",
      title: "Procurement teams",
      sub: "Purchasing departments working with multiple suppliers simultaneously",
      day: "There are dozens of suppliers. Some write on WhatsApp, some by email, some called a colleague's phone. Tracking which order is at which stage requires nearly a full-time assistant. When you sit down at your desk in the morning, you do not know where to begin.",
      chasing: [
        "Which supplier is waiting for what?",
        "Which contract is waiting for the latest revision?",
        "Has the order confirmation been sent?",
        "Has the price revision been accepted?",
      ],
      easier: [
        "Which supplier is waiting on you versus their own side — at a glance.",
        "Who will handle the new order — assigned visibly in the record.",
        "Approval history is traceable — who said what and when.",
      ],
      quote: "\"Instead of calling around to find where each order is, I look at one screen every morning.\"",
      tools: ["Email", "WhatsApp", "Excel", "ERP"],
    },
    {
      icon: "🌍",
      title: "International trade teams",
      sub: "Departments inside companies coordinating imports and exports",
      day: "A buyer writes from Germany, a supplier from Thailand, finance asks from inside the company. All on the same day, all through different channels. For one deal: email correspondence with the buyer outside, WhatsApp with logistics inside, a phone call with accounting — all happening at the same time.",
      chasing: [
        "Is the internal team and the buyer working from the same information?",
        "Which correspondence applies to which deal?",
        "Was the external contract communicated to the internal team?",
        "Did the shipment update reach the buyer?",
      ],
      easier: [
        "All correspondence for a deal in one place — internal and external separated.",
        "Which country's buyer is at which stage — at a glance.",
        "Whatever the language, document status is clear.",
      ],
      quote: "\"No need for internal coordination meetings. Everyone looks at the same screen.\"",
      tools: ["Email", "WhatsApp", "WeChat", "Excel", "PDF"],
    },
    {
      icon: "🤝",
      title: "Traders and intermediaries",
      sub: "Trade agents and brokers who bridge buyers and sellers",
      day: "The supplier writes from one side, the buyer asks from the other. Both call you because you are the only source of information. Has SGS approval arrived? Is the price finalised? Which contract version is current? Relaying all these back and forth takes up half your working day.",
      chasing: [
        "Has the buyer approved the latest price?",
        "Has the supplier booked the SGS appointment?",
        "Are both parties looking at the same contract version?",
        "Which side received payment, who gets it and when?",
      ],
      easier: [
        "You no longer need to relay information to each side separately.",
        "SGS, BL, contract — everything on record, everyone sees it.",
        "If a dispute arises, which is correct is clear and undisputable in the record.",
      ],
      quote: "\"I no longer waste half my day carrying information between two parties.\"",
      tools: ["WhatsApp", "Email", "Phone", "Excel"],
    },
    {
      icon: "🏢",
      title: "Companies managing distributors",
      sub: "Manufacturers and brand owners working with distributors in different countries",
      day: "Each distributor has different contract terms, different pricing, different minimum order quantities. Over time it becomes unclear who received which version. Was the revision made for one distributor applied to the others? Finding the signed contract means searching the archive.",
      chasing: [
        "Which signed contract version does each distributor have?",
        "Was the price revision sent to all of them?",
        "Which distributor is at which stage?",
        "Whose approval is still missing?",
      ],
      easier: [
        "Each distributor's contract is in a separate deal record.",
        "Was the revision sent? Did they approve? — in the record.",
        "Which distributor, which product, which price — trackable.",
      ],
      quote: "\"I no longer need to research which version I sent to which distributor.\"",
      tools: ["Email", "Excel", "PDF", "ERP"],
    },
  ];

  return (
    <PublicShell stickyCta={false}>
      <StoryBar />

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
                  ? <>Sizin gününüz de<br /><span className="text-ortaq-trust">böyle geçiyor mu?</span></>
                  : <>Does your day<br /><span className="text-ortaq-trust">look like this?</span></>
                }
              </h1>
              <p className="mt-4 max-w-lg text-[0.9375rem] leading-relaxed text-ortaq-ink-muted">
                {isTR
                  ? "ORTAQ belirli bir sektör için değil. Aktif ticari işlem yöneten herkes için. Altı profilden hangisindesiniz?"
                  : "ORTAQ is not for a specific sector. It is for anyone managing active commercial transactions. Which of the six profiles are you?"}
              </p>

              {/* Quick-jump */}
              <div className="mt-5 flex flex-wrap gap-2">
                {profiles.map((p, i) => (
                  <a
                    key={i}
                    href={`#p${i}`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-ortaq-border bg-ortaq-surface px-3 py-1.5 text-[0.5rem] font-semibold text-ortaq-ink-soft transition-colors hover:border-ortaq-trust/40 hover:text-ortaq-trust"
                  >
                    <span>{p.icon}</span>
                    <span>{p.title}</span>
                  </a>
                ))}
              </div>
            </div>
          </Container>
        </div>

        {/* Profiles */}
        <Container wide>
          <div className="divide-y divide-ortaq-border">
            {profiles.map((p, i) => (
              <ProfileBlock key={i} profile={p} index={i} isTR={isTR} />
            ))}
          </div>
        </Container>

        {/* Bottom — four universal questions + CTA to next page */}
        <div className="border-t border-ortaq-border bg-ortaq-ink">
          <Container wide>
            <div className="py-12 sm:py-16">

              <p className="mb-6 text-[0.6875rem] font-bold uppercase tracking-[0.1em] text-ortaq-cream/40">
                {isTR ? "Bu profillerin hepsinde ortak olan dört soru" : "Four questions common to all these profiles"}
              </p>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {(isTR ? [
                  { q: "Hangi belge güncel?",       note: "Doğru versiyonu bulmak için arama yapıyorsunuz." },
                  { q: "Sıra kimde?",               note: "Alıcı mı bekliyor, siz mi? Belli değil." },
                  { q: "Son durum ne?",             note: "Birine sormadan öğrenemiyorsunuz." },
                  { q: "Ödeme ne zaman çıkacak?",  note: "Finans başka, operasyon başka bir şey biliyor." },
                ] : [
                  { q: "Which document is current?", note: "You search to find the correct version." },
                  { q: "Whose turn is it?",           note: "Buyer waiting or you? Not clear." },
                  { q: "What is the latest status?",  note: "You cannot find out without asking someone." },
                  { q: "When is payment going out?",  note: "Finance knows one thing, operations another." },
                ]).map((item, i) => (
                  <div key={i} className="rounded-xl border border-ortaq-cream/10 bg-ortaq-cream/5 p-4">
                    <p className="text-[0.9375rem] font-bold text-ortaq-cream leading-snug">{item.q}</p>
                    <p className="mt-2 text-[0.75rem] leading-relaxed text-ortaq-cream/55">{item.note}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 border-t border-ortaq-cream/10 pt-8">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-[1rem] font-bold text-ortaq-cream">
                      {isTR
                        ? "Bu soruların cevabı ORTAQ kaydında hazır."
                        : "The answers to these questions are ready in the ORTAQ record."}
                    </p>
                    <p className="mt-1.5 text-[0.875rem] text-ortaq-cream/60">
                      {isTR
                        ? "Araştırmadan. Aramadan. Kimseye sormadan."
                        : "Without searching. Without calling. Without asking anyone."}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Link
                      href="/senaryolar"
                      className="inline-flex min-h-11 items-center justify-center rounded-lg border border-ortaq-cream/20 px-5 text-[0.9375rem] font-medium text-ortaq-cream/80 transition-colors hover:border-ortaq-cream/40 hover:text-ortaq-cream"
                    >
                      {isTR ? "Senaryolara bakın →" : "See Use Cases →"}
                    </Link>
                    <Link
                      href="/demo"
                      className="inline-flex min-h-11 items-center justify-center rounded-lg bg-ortaq-trust px-7 text-[0.9375rem] font-bold text-white shadow-sm transition-all hover:bg-ortaq-trust-deep active:scale-[0.98]"
                    >
                      {isTR ? "Demo İsteyin" : "Request Demo"}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </div>

      </div>
    </PublicShell>
  );
}

/* ── Profile block ────────────────────────────────────────────────────────── */

function ProfileBlock({ profile, index, isTR }: { profile: Profile; index: number; isTR: boolean }) {
  return (
    <div id={`p${index}`} className="py-10 sm:py-14 scroll-mt-24">
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">

        {/* Left — who they are + daily life */}
        <div>
          <div className="mb-4 flex items-start gap-3">
            <span className="text-3xl leading-none">{profile.icon}</span>
            <div>
              <h2 className="text-[1.25rem] font-bold text-ortaq-ink">{profile.title}</h2>
              <p className="mt-0.5 text-[0.5625rem] text-ortaq-ink-soft">{profile.sub}</p>
            </div>
          </div>

          {/* The day — plain description */}
          <div className="rounded-xl border border-ortaq-border bg-white p-5">
            <p className="mb-2 text-[0.625rem] font-bold uppercase tracking-[0.09em] text-ortaq-ink-soft">
              {isTR ? "Günleri böyle geçiyor" : "Their day looks like this"}
            </p>
            <p className="text-[0.8125rem] leading-relaxed text-ortaq-ink">{profile.day}</p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {profile.tools.map((tool) => (
                <span
                  key={tool}
                  className="rounded border border-ortaq-border bg-ortaq-surface px-2 py-0.5 text-[0.625rem] font-semibold text-ortaq-ink-soft"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right — what they chase + what gets easier */}
        <div className="space-y-4">

          {/* What they constantly chase */}
          <div className="rounded-xl border border-red-100 bg-red-50/60 p-5">
            <p className="mb-3 text-[0.625rem] font-bold uppercase tracking-[0.09em] text-red-600">
              {isTR ? "Sürekli peşinde oldukları bilgi" : "Information they constantly chase"}
            </p>
            <ul className="space-y-2">
              {profile.chasing.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full bg-red-400" />
                  <span className="text-[0.8125rem] leading-snug text-ortaq-ink">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* What becomes easier */}
          <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-5">
            <p className="mb-3 text-[0.625rem] font-bold uppercase tracking-[0.09em] text-emerald-700">
              {isTR ? "ORTAQ ile ne kolaylaşır?" : "What becomes easier with ORTAQ"}
            </p>
            <ul className="space-y-2">
              {profile.easier.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                  <span className="text-[0.8125rem] leading-snug text-ortaq-ink">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Quote */}
          <div className="rounded-xl border border-ortaq-trust/15 bg-ortaq-trust/[0.04] px-5 py-3.5">
            <p className="text-[0.875rem] italic leading-relaxed text-ortaq-trust">{profile.quote}</p>
          </div>

        </div>
      </div>
    </div>
  );
}
