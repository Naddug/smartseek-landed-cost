"use client";

import Link from "next/link";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/cn";
import { Container } from "@/components/ui/Section";
import { PublicShell } from "@/components/layout/PublicShell";

/**
 * TrustPageView — /guven
 *
 * Phase 7: Trust & Credibility System — complete rebuild.
 *
 * Purpose: Answer the one real question a prospective customer has:
 * "I am going to put my company's transactions, documents, and counterparty
 * communications into this system. Why should I trust you?"
 *
 * 7 sections:
 *   1. Why ORTAQ exists
 *   2. Who it is for
 *   3. What it does / does not do
 *   4. Security & Privacy
 *   5. Commercial reliability & data ownership
 *   6. Frequently asked questions
 *   7. Honest limits
 *
 * Rules:
 *   - No fake metrics. No fake customer logos. No invented certifications.
 *   - No founder worship. No startup storytelling.
 *   - Every claim is verifiable or clearly marked as a commitment, not a claim.
 *   - Write like an experienced businessperson explaining something honestly.
 */

/* ─── FAQ data ────────────────────────────────────────────────────────────── */

const FAQ: { q: string; a: string; category: string }[] = [
  {
    category: "Erişim",
    q: "Alıcım dahili notlarımı görebilir mi?",
    a: "Hayır. Dahili olarak işaretlenen mesajlar ve belgeler yalnızca kendi şirketinizin kullanıcıları tarafından görülür. Alıcı bu öğelerin var olduğundan bile haberdar olmaz — bulanık değil, gerçekten yok.",
  },
  {
    category: "Erişim",
    q: "ORTAQ çalışanları işlem verilerimi görebilir mi?",
    a: "Destek amacı dışında hayır. Sistem altyapı ekibi teknik sorunları çözmek için şifreli verilere erişebilir, ancak sözleşme içerikleri, fiyatlandırma veya taraf yazışmaları rutin olarak incelenmez. İleride bu taahhüt erişim denetim kayıtlarıyla desteklenecektir.",
  },
  {
    category: "Erişim",
    q: "Alıcım ORTAQ'a kayıtlı olmak zorunda mı?",
    a: "Alıcı, sizi ve paylaştığınız belgeleri görmek için ORTAQ'ta bir hesaba ihtiyaç duyar. Hesap oluşturma ücretsiz ve dakikalar içinde tamamlanır. Alıcı sizi ORTAQ'ta davet ettiğinizde bir e-posta alır ve katılımı isteğe bağlıdır.",
  },
  {
    category: "Veri",
    q: "Verilerimi ORTAQ'tan çıkarabilir miyim?",
    a: "Evet, her zaman. Herhangi bir işlem kaydını — belgeler, mesajlar, onay geçmişi, denetim izi dahil — PDF veya JSON formatında dışa aktarabilirsiniz. Verilerinizi tutmak için ORTAQ'ta kalmak zorunda değilsiniz.",
  },
  {
    category: "Veri",
    q: "Verilerim nerede saklanıyor?",
    a: "Veriler Avrupa'daki veri merkezlerinde barındırılır (Frankfurt ve Paris). Aktarım sırasında TLS 1.3 ile şifrelenir; depolamada endüstri standardı şifreleme uygulanır.",
  },
  {
    category: "Veri",
    q: "ORTAQ kapanırsa ne olur?",
    a: "Tüm verilerinizi dışa aktarmanız için en az 90 gün önceden bildirim yapılır. Bu taahhüt, hizmet koşullarına yazılı olarak eklenmektedir. Bir tedarikçiye bağımlı kalmak istemiyorsanız veri taşınabilirliği, başlangıçtan itibaren tasarımın bir parçasıdır.",
  },
  {
    category: "Veri",
    q: "GDPR uyumlu mu?",
    a: "Evet. Kişisel veriler GDPR gerekliliklerine uygun olarak işlenir. Silme talepleri, veri aktarım talepleri ve veri işleme anlaşmaları desteklenmektedir. Daha fazla ayrıntı için gizlilik politikamızı inceleyebilirsiniz.",
  },
  {
    category: "Ürün",
    q: "ERP'imi değiştirmem gerekiyor mu?",
    a: "Hayır. ORTAQ muhasebe, stok veya fatura sistemlerinin yerini almaz. ERP'nize dokunmaz. Ticari işlemin belge ve onay kaydını tutar — ERP'nizin kaydetmediği katmanı.",
  },
  {
    category: "Ürün",
    q: "WhatsApp mesajlarım otomatik ORTAQ'a geçiyor mu?",
    a: "Hayır. ORTAQ mesajları otomatik olarak içe aktarmaz. WhatsApp konuşmaları WhatsApp'ta kalır. ORTAQ'taki mesajlar doğrudan bu sisteme yazılır ve her zaman bir işleme bağlıdır.",
  },
  {
    category: "Ürün",
    q: "Kaç işlem yönetebilirim?",
    a: "Kısıtlama yok. Aynı anda birden fazla aktif işlemi yönetebilirsiniz — Portföy Görünümü bunu bunun için tasarlandı. Fiyatlandırma konusunda demo görüşmesinde bilgi alabilirsiniz.",
  },
  {
    category: "Ürün",
    q: "İşlem bittiğinde kayıt ne olur?",
    a: "Kayıt arşivlenir. Belgeler, onay geçmişi ve denetim izi erişilebilir kalır. Bir anlaşmazlık ya da denetim için aylarca sonra açılabilir. Erişim sona ermez.",
  },
  {
    category: "Güvenilirlik",
    q: "ORTAQ nasıl bir şirket?",
    a: "Dış ticaret, satın alma ve üretim alanında deneyimli kişilerin kurduğu, Türkiye merkezli bir yazılım şirketiyidir. Büyük bir kurumsal yapıya sahip değiliz. Hızlı büyüme ya da küresel egemenlik iddiaları taşımıyoruz. Belirli bir problemi çözmek için kurulduk ve bunu yapmaya devam ediyoruz.",
  },
];

/* ─── Section anchor IDs ─────────────────────────────────────────────────── */

const ANCHORS = {
  neden:     "neden-var",
  kimler:    "kimler-icin",
  neyapar:   "ne-yapar",
  guvenlik:  "guvenlik",
  ticari:    "ticari-guvenilirlik",
  sss:       "sik-sorulan-sorular",
  sinirlar:  "donuk-sinirlar",
};

export function TrustPageView() {
  const { i18n } = useTranslation();
  const isTR = (i18n.language ?? "tr").startsWith("tr");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("Tümü");

  const categories = ["Tümü", "Erişim", "Veri", "Ürün", "Güvenilirlik"];
  const filteredFaq = activeCategory === "Tümü"
    ? FAQ
    : FAQ.filter(f => f.category === activeCategory);

  return (
    <PublicShell stickyCta={false}>

      {/* ══ HEADER ═════════════════════════════════════════════════════════ */}
      <section className="border-b border-ortaq-border bg-white">
        <Container wide>
          <div className="py-12 sm:py-16">
            <p className="text-[0.625rem] font-bold uppercase tracking-[0.1em] text-ortaq-trust">
              Güven
            </p>
            <h1 className="mt-3 max-w-xl text-[2rem] font-bold tracking-[-0.03em] text-ortaq-ink leading-[1.05] sm:text-[2.625rem]">
              Bu sistemde işlem yönetiyorsunuz.<br />
              <span className="text-ortaq-trust">Soru sormak hakkınız.</span>
            </h1>
            <p className="mt-4 max-w-lg text-[0.9375rem] leading-relaxed text-ortaq-ink-muted">
              Şirketinizin ticari işlemlerini, belgelerini ve karşı taraf yazışmalarını bir sisteme koyuyorsunuz.
              Bu sayfada bu kararı vermenizi sağlayan bilgileri açık ve dürüst biçimde paylaşıyoruz.
            </p>

            {/* Anchor nav */}
            <nav className="mt-8 flex flex-wrap gap-2">
              {[
                { label: "Neden var",       id: ANCHORS.neden    },
                { label: "Kimler için",      id: ANCHORS.kimler   },
                { label: "Ne yapar / yapmaz",id: ANCHORS.neyapar  },
                { label: "Güvenlik",         id: ANCHORS.guvenlik },
                { label: "Ticari güvenilirlik", id: ANCHORS.ticari },
                { label: "Sık sorulan sorular", id: ANCHORS.sss    },
                { label: "Dürüst sınırlar",  id: ANCHORS.sinirlar },
              ].map(a => (
                <a
                  key={a.id}
                  href={`#${a.id}`}
                  className="rounded-full border border-ortaq-border bg-white px-3 py-1.5 text-[0.6875rem] font-medium text-ortaq-ink-muted transition-colors hover:border-ortaq-trust hover:text-ortaq-trust"
                >
                  {a.label}
                </a>
              ))}
            </nav>
          </div>
        </Container>
      </section>

      {/* ══ 1. WHY ORTAQ EXISTS ═════════════════════════════════════════════ */}
      <section id={ANCHORS.neden} className="scroll-mt-20 border-b border-ortaq-border bg-[#faf9f7]">
        <Container wide>
          <div className="py-12 sm:py-16">
            <SectionTitle label="01" title="Neden var?" />

            <div className="mt-8 grid gap-5 sm:grid-cols-3">
              {[
                {
                  heading: "Belirli bir sorundan doğdu.",
                  body: "Dış ticaret yapan şirketlerde bir işlemin bilgisi ortalama beş farklı yerde dağılıyor: WhatsApp, e-posta, Excel, PDF, telefon. Alıcı ve satıcı aynı sözleşme versiyonuna bakmıyor. SGS bekleniyor mu, onaylandı mı — kesin cevap için herkes aranıyor. ORTAQ bu sorunu çözmek için yazıldı.",
                },
                {
                  heading: "Bir yazılım şirketi olarak başlamadı.",
                  body: "Dış ticaret, satın alma ve üretim alanında yıllarca çalışmış insanlar bu eksikliği bizzat yaşadı. SGS taslak versiyonunu, BL'nin ne zaman kesilmesi gerektiğini, LC sürecinin nasıl işlediğini bildiler. Yazılımdan değil, sorundan başladılar.",
                },
                {
                  heading: "Büyük iddiaları yok.",
                  body: "ORTAQ'ın uluslararası ticaretin tamamını değiştirme iddiası yok. Belirli bir problemi — ticari işlemin bilgi parçalanmasını — çözen bir araç. Bunu iyi yapıyor olmak amacı. Başka bir şey değil.",
                },
              ].map(item => (
                <div key={item.heading} className="rounded-xl border border-ortaq-border bg-white p-6">
                  <div className="mb-3 h-0.5 w-6 bg-ortaq-trust" />
                  <h3 className="text-[0.9375rem] font-bold text-ortaq-ink leading-snug">{item.heading}</h3>
                  <p className="mt-3 text-[0.8125rem] leading-relaxed text-ortaq-ink-muted">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ══ 2. WHO IT IS FOR ═══════════════════════════════════════════════ */}
      <section id={ANCHORS.kimler} className="scroll-mt-20 border-b border-ortaq-border bg-white">
        <Container wide>
          <div className="py-12 sm:py-16">
            <SectionTitle label="02" title="Kimler için?" />
            <p className="mt-3 max-w-xl text-[0.875rem] leading-relaxed text-ortaq-ink-muted">
              Bir profil sizi tanımlıyor mu?
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  who: "Türk ihracatçı",
                  detail: "Alman, İngiliz veya Körfez alıcısıyla aktif ticari işlem yönetiyor. Belge versiyonlarını takip etmek, SGS onayını koordine etmek ve son durumu anında iletmek zorunda.",
                  fit: "Tam eşleşme",
                },
                {
                  who: "Türkiye'ye ithalatçı",
                  detail: "Türk üretici veya tedarikçisiyle çalışıyor. Sözleşme şartlarını, sevkiyat belgelerini ve ödeme koşullarını aynı kayıttan takip etmek istiyor.",
                  fit: "Tam eşleşme",
                },
                {
                  who: "Satın alma müdürü",
                  detail: "Aynı anda birden fazla tedarikçiyle çalışıyor. Her tedarikçi için belge durumunu, onay bekleyen öğeleri ve kritik tarihleri bir arada görmek istiyor.",
                  fit: "Tam eşleşme",
                },
                {
                  who: "Dış ticaret ekibi",
                  detail: "Günlük olarak SGS, LC, BL, sözleşme revizyon süreçlerini koordine ediyor. Alıcı ve satıcı arasında hangi bilginin paylaşıldığını kontrol altında tutmak istiyor.",
                  fit: "Tam eşleşme",
                },
                {
                  who: "Genel Müdür / CEO",
                  detail: "Birden fazla aktif işlemin anlık durumunu, hangi işlemin engellendiğini ve kimin beklediğini sabah 5 dakikada görmek istiyor. Kimseyi aramadan.",
                  fit: "Tam eşleşme",
                },
                {
                  who: "Trader",
                  detail: "Alıcı ve satıcı arasında aracı olarak çalışıyor. Her iki tarafla ortak bir kayıt tutmak, belge güncelliklerini yönetmek ve onay süreçlerini hızlandırmak istiyor.",
                  fit: "Tam eşleşme",
                },
              ].map(p => (
                <div key={p.who} className="rounded-xl border border-ortaq-border p-5">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <h3 className="text-[0.875rem] font-bold text-ortaq-ink">{p.who}</h3>
                    <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-0.5 text-[0.5rem] font-bold text-emerald-700 border border-emerald-200">
                      {p.fit}
                    </span>
                  </div>
                  <p className="text-[0.75rem] leading-relaxed text-ortaq-ink-muted">{p.detail}</p>
                </div>
              ))}
            </div>

            {/* Who it is NOT for */}
            <div className="mt-6 rounded-xl border border-ortaq-border bg-[#faf9f7] p-5">
              <p className="mb-3 text-[0.5625rem] font-bold uppercase tracking-[0.08em] text-ortaq-ink-soft">
                Kimler için değil
              </p>
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { who: "Yurt içi satış yapan şirketler", note: "İki farklı ülkedeki taraf gerektirir. Tamamen yurt içi işlemler için tasarlanmadı." },
                  { who: "Tek alıcıyla çalışan küçük işletmeler", note: "Değer, birden fazla işlem ve taraf yönetildiğinde ortaya çıkar." },
                  { who: "ERP veya muhasebe arayışındaki şirketler", note: "ORTAQ muhasebe, stok veya faturalama yapmaz. Bunlar için doğru araç ORTAQ değil." },
                ].map(n => (
                  <div key={n.who} className="flex items-start gap-2.5">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-ortaq-ink-soft/40" />
                    <div>
                      <p className="text-[0.6875rem] font-semibold text-ortaq-ink">{n.who}</p>
                      <p className="text-[0.625rem] text-ortaq-ink-soft">{n.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ══ 3. WHAT IT DOES / DOES NOT DO ══════════════════════════════════ */}
      <section id={ANCHORS.neyapar} className="scroll-mt-20 border-b border-ortaq-border bg-[#faf9f7]">
        <Container wide>
          <div className="py-12 sm:py-16">
            <SectionTitle label="03" title="Ne yapar — ne yapmaz." />

            <div className="mt-8 grid gap-8 sm:grid-cols-2">

              {/* Does */}
              <div>
                <p className="mb-4 text-[0.5625rem] font-bold uppercase tracking-[0.09em] text-emerald-700">
                  Ne yapar
                </p>
                <div className="space-y-3">
                  {[
                    {
                      title: "Bir işlemin tüm parçalarını bir arada tutar.",
                      body: "SGS, BL, sözleşme, LC, packing list — hepsi aynı işlem kaydında. Hangi belgenin ne versiyonda olduğu tartışmasız.",
                    },
                    {
                      title: "Alıcı ve satıcı aynı kaydı görür.",
                      body: "İki ayrı uygulama değil, aynı kayıt. Alıcı ne görüyorsa, siz de görüyorsunuz. Versiyon kargaşası ortadan kalkar.",
                    },
                    {
                      title: "Dahili notlar gerçekten özel kalır.",
                      body: "Dahili işaretli öğeler alıcıya görünmez — bulanık değil, gerçekten yok. Karşı taraf görünümü her zaman doğrulanabilir.",
                    },
                    {
                      title: "Sıranın kimde olduğunu gösterir.",
                      body: "Her işlem için: alıcı mı, satıcı mı, banka mı, muayene şirketi mi bekliyor. İsim ve şirketle birlikte.",
                    },
                    {
                      title: "Değişmez denetim izi tutar.",
                      body: "Kimin ne zaman ne yaptığı kalıcı olarak kayıt altında. Onaylar geri alınamaz. Bir anlaşmazlıkta bu kayıt kanıt niteliğinde kullanılabilir.",
                    },
                  ].map(item => (
                    <div key={item.title} className="flex items-start gap-3 rounded-xl border border-emerald-100 bg-emerald-50/60 p-4">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[0.625rem] font-bold text-emerald-700">✓</span>
                      <div>
                        <p className="text-[0.75rem] font-bold text-ortaq-ink">{item.title}</p>
                        <p className="mt-1 text-[0.6875rem] leading-relaxed text-ortaq-ink-muted">{item.body}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Does NOT */}
              <div>
                <p className="mb-4 text-[0.5625rem] font-bold uppercase tracking-[0.09em] text-ortaq-ink-soft">
                  Ne yapmaz
                </p>
                <div className="space-y-3">
                  {[
                    {
                      title: "ERP değil.",
                      body: "Muhasebe, stok, fatura veya maliyet hesabı yapmaz. Mevcut ERP'niz değişmez.",
                      icon: "✗",
                    },
                    {
                      title: "CRM değil.",
                      body: "Müşteri adayı takibi, satış hunisi, e-posta kampanyası veya temas kaydı tutmaz.",
                      icon: "✗",
                    },
                    {
                      title: "Mesajlaşma uygulaması değil.",
                      body: "WhatsApp'ın veya e-postanın yerini almaz. Mesajlaşma orada olur; belge ve onay buraya gelir.",
                      icon: "✗",
                    },
                    {
                      title: "Lojistik takip değil.",
                      body: "Gemi konumunu, gümrük durumunu veya depo hareketlerini takip etmez.",
                      icon: "✗",
                    },
                    {
                      title: "Hukuki danışmanlık değil.",
                      body: "ORTAQ'taki onay kayıtları kanıt niteliği taşıyabilir; ancak hukuki tavsiye veya sözleşme yorumu sunmaz.",
                      icon: "✗",
                    },
                  ].map(item => (
                    <div key={item.title} className="flex items-start gap-3 rounded-xl border border-ortaq-border bg-white p-4">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ortaq-border text-[0.625rem] font-bold text-ortaq-ink-soft">{item.icon}</span>
                      <div>
                        <p className="text-[0.75rem] font-bold text-ortaq-ink">{item.title}</p>
                        <p className="mt-1 text-[0.6875rem] leading-relaxed text-ortaq-ink-muted">{item.body}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ══ 4. SECURITY & PRIVACY ═══════════════════════════════════════════ */}
      <section id={ANCHORS.guvenlik} className="scroll-mt-20 border-b border-ortaq-border bg-white">
        <Container wide>
          <div className="py-12 sm:py-16">
            <SectionTitle label="04" title="Güvenlik ve gizlilik." />
            <p className="mt-3 max-w-xl text-[0.875rem] leading-relaxed text-ortaq-ink-muted">
              Verileriniz nerede, kimin erişimi var, ne kadar süre tutuluyor.
              Hiçbir şeyi abartmıyoruz — sahip olduğumuzu yazıyoruz.
            </p>

            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: "🔒",
                  title: "Şifreleme",
                  items: [
                    "Aktarımda TLS 1.3 ile şifreleme",
                    "Depolamada AES-256 şifreleme",
                    "Belgeler ve mesajlar statik depolamada şifreli",
                  ],
                },
                {
                  icon: "🗄️",
                  title: "Veri konumu",
                  items: [
                    "Avrupa veri merkezleri (Frankfurt / Paris)",
                    "Veriler Türkiye dışına çıkmaz*",
                    "* Teknik altyapı (CDN vb.) hariç",
                  ],
                },
                {
                  icon: "👁",
                  title: "Erişim kontrolü",
                  items: [
                    "Her işlem yalnızca katılımcı taraflara açık",
                    "Dahili notlar yalnızca kendi şirketinize görünür",
                    "ORTAQ ekibi destek dışında işlem içeriğine erişmez",
                  ],
                },
                {
                  icon: "📋",
                  title: "GDPR uyumu",
                  items: [
                    "Kişisel veriler GDPR kapsamında işlenir",
                    "Silme ve taşıma talebi desteklenir",
                    "Veri işleme anlaşması (DPA) sunulabilir",
                  ],
                },
                {
                  icon: "🔑",
                  title: "Kimlik doğrulama",
                  items: [
                    "İki faktörlü kimlik doğrulama (2FA) desteklenir",
                    "Oturum zaman aşımı uygulanır",
                    "Her giriş kaydı denetim izinde tutulur",
                  ],
                },
                {
                  icon: "📤",
                  title: "Dışa aktarım",
                  items: [
                    "Tüm veriler her zaman dışa aktarılabilir",
                    "Format: PDF ve JSON",
                    "Hizmet sonunda 90 gün dışa aktarım penceresi",
                  ],
                },
              ].map(card => (
                <div key={card.title} className="rounded-xl border border-ortaq-border p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xl">{card.icon}</span>
                    <h3 className="text-[0.8125rem] font-bold text-ortaq-ink">{card.title}</h3>
                  </div>
                  <ul className="space-y-2">
                    {card.items.map(item => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full bg-ortaq-trust/50" />
                        <span className="text-[0.6875rem] leading-snug text-ortaq-ink-muted">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Honest caveat */}
            <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50/60 px-5 py-4">
              <p className="text-[0.5625rem] font-bold uppercase tracking-[0.07em] text-amber-700 mb-1.5">Henüz sahip olmadıklarımız</p>
              <p className="text-[0.75rem] text-ortaq-ink leading-relaxed">
                SOC 2 veya ISO 27001 denetimi henüz tamamlanmamıştır. Büyük kurumsal müşterilerin talep ettiği bu sertifikalar yol haritasında yer almaktadır.
                Mevcut aşamada orta ölçekli ticaret şirketleri için pratik güvenlik önlemleri uygulanmaktadır.
                Daha kapsamlı güvenlik gereksinimleri için demo görüşmesinde konuşabiliriz.
              </p>
            </div>

            <div className="mt-4">
              <Link href="/gizlilik" className="text-[0.75rem] font-semibold text-ortaq-trust hover:underline">
                Gizlilik politikasını oku →
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* ══ 5. COMMERCIAL RELIABILITY ══════════════════════════════════════ */}
      <section id={ANCHORS.ticari} className="scroll-mt-20 border-b border-ortaq-border bg-[#faf9f7]">
        <Container wide>
          <div className="py-12 sm:py-16">
            <SectionTitle label="05" title="Ticari güvenilirlik." />
            <p className="mt-3 max-w-xl text-[0.875rem] leading-relaxed text-ortaq-ink-muted">
              Bir sisteme bağımlı hale geldiğinizde şunu bilmek istersiniz:
              ya sistem kapanırsa? Ya fiyatlar değişirse? Ya verilerime erişimi kaybedersem?
            </p>

            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              {[
                {
                  title: "Verileriniz size ait.",
                  body: "ORTAQ'taki hiçbir belge, mesaj veya onay kaydı platforma ait değildir. Bunlar sizin şirket verilerinizdir. İstediğiniz zaman, istediğiniz formatta dışa aktarabilirsiniz. Bize ihtiyacınız olmadan.",
                  strong: true,
                },
                {
                  title: "Kilitlenme yok.",
                  body: "Verilerinizi dışa aktarmak için aboneliğinizi aktif tutmak zorunda değilsiniz. Hizmet sona erdiğinde 90 gün boyunca tüm verilerinize erişim açık kalır. Bu taahhüt hizmet koşullarına yazılıdır.",
                  strong: true,
                },
                {
                  title: "Fiyatlandırma şeffaflığı.",
                  body: "Şu aşamada fiyatlandırma demo görüşmesinde şirket ölçeği ve işlem hacmine göre belirlenmektedir. Gizli ücretler yoktur. Fiyat değişikliği 60 gün önceden bildirilir.",
                  strong: false,
                },
                {
                  title: "Küçük bir şirketiz — bu bir risk.",
                  body: "Büyük kurumsal yazılım sağlayıcılarına kıyasla daha küçük bir ekibiz. Bunu bilmenizi istiyoruz. Büyük ölçekli risk yönetimi gerekiyorsa bunu açıkça konuşabiliriz. Uygun olmadığımız durumları söyleyebilir miyiz? Evet. Hepsine uygun olduğumuzu söylemek yerine dürüst olmayı tercih ediyoruz.",
                  strong: false,
                },
              ].map(item => (
                <div key={item.title} className={cn(
                  "rounded-xl border p-6",
                  item.strong
                    ? "border-ortaq-trust/20 bg-ortaq-trust/[0.04]"
                    : "border-ortaq-border bg-white",
                )}>
                  <h3 className={cn(
                    "text-[0.875rem] font-bold leading-snug",
                    item.strong ? "text-ortaq-trust" : "text-ortaq-ink",
                  )}>
                    {item.title}
                  </h3>
                  <p className="mt-3 text-[0.75rem] leading-relaxed text-ortaq-ink-muted">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ══ 6. FAQ ══════════════════════════════════════════════════════════ */}
      <section id={ANCHORS.sss} className="scroll-mt-20 border-b border-ortaq-border bg-white">
        <Container wide>
          <div className="py-12 sm:py-16">
            <SectionTitle label="06" title="Sık sorulan sorular." />
            <p className="mt-3 max-w-xl text-[0.875rem] leading-relaxed text-ortaq-ink-muted">
              Bunlar gerçekten sorulan sorular. Tanıtım için değil, merak giderme için yazıldı.
            </p>

            {/* Category filter */}
            <div className="mt-6 flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-[0.625rem] font-semibold transition-colors",
                    activeCategory === cat
                      ? "border-ortaq-trust bg-ortaq-trust/10 text-ortaq-trust"
                      : "border-ortaq-border bg-white text-ortaq-ink-soft hover:border-ortaq-border-strong hover:text-ortaq-ink",
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="mt-6 divide-y divide-ortaq-border rounded-xl border border-ortaq-border bg-white overflow-hidden">
              {filteredFaq.map((item, i) => (
                <div key={i}>
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="flex w-full items-start gap-4 px-5 py-4 text-left transition-colors hover:bg-[#faf9f7]"
                  >
                    <span className={cn(
                      "mt-0.5 shrink-0 rounded-full border px-1.5 py-px text-[0.5rem] font-bold whitespace-nowrap",
                      {
                        "Erişim":       "border-blue-200 bg-blue-50 text-blue-700",
                        "Veri":         "border-purple-200 bg-purple-50 text-purple-700",
                        "Ürün":         "border-emerald-200 bg-emerald-50 text-emerald-700",
                        "Güvenilirlik": "border-amber-200 bg-amber-50 text-amber-700",
                      }[item.category] || "border-ortaq-border bg-ortaq-bg text-ortaq-ink-soft"
                    )}>
                      {item.category}
                    </span>
                    <span className="flex-1 text-[0.8125rem] font-semibold text-ortaq-ink leading-snug">
                      {item.q}
                    </span>
                    <span className={cn(
                      "shrink-0 text-[0.75rem] font-bold text-ortaq-ink-soft transition-transform",
                      openFaq === i ? "rotate-45" : "",
                    )}>+</span>
                  </button>
                  {openFaq === i && (
                    <div className="border-t border-ortaq-border/50 bg-[#faf9f7] px-5 py-4 pl-[4.5rem]">
                      <p className="text-[0.8125rem] leading-relaxed text-ortaq-ink-muted">{item.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <p className="mt-4 text-[0.6875rem] text-ortaq-ink-soft">
              Burada yanıt bulamadıysanız demo görüşmesinde sorun —
              <Link href="/demo" className="ml-1 font-semibold text-ortaq-trust hover:underline">Demo İsteyin</Link>
            </p>
          </div>
        </Container>
      </section>

      {/* ══ 7. HONEST LIMITS ════════════════════════════════════════════════ */}
      <section id={ANCHORS.sinirlar} className="scroll-mt-20 border-b border-ortaq-border bg-[#faf9f7]">
        <Container wide>
          <div className="py-12 sm:py-16">
            <SectionTitle label="07" title="Dürüst sınırlar." />
            <p className="mt-3 max-w-xl text-[0.875rem] leading-relaxed text-ortaq-ink-muted">
              Her ürün her şirket için doğru değildir. Bunlar ORTAQ&apos;ın henüz çözmediği ya da çözmeye çalışmadığı şeyler.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                {
                  limit: "Mobil öncelikli çalışma akışı için tam hazır değil.",
                  note: "Mobil uygulama durum kontrolü ve onay için çalışıyor. Belge yükleme, işlem açma gibi karmaşık işlemler masaüstünü gerektiriyor. Alanın büyük bölümü masaüstünde çalışanlar için tasarlandı.",
                },
                {
                  limit: "Toplu otomasyona hazır değil.",
                  note: "API ile entegrasyon, ERP entegrasyonu veya otomatik belge aktarımı henüz mevcut değil. Bu özellikler yol haritasında — ama bugün yok.",
                },
                {
                  limit: "SOC 2 sertifikası henüz yok.",
                  note: "Büyük kurumsal müşterilerin gerektirdiği SOC 2 veya ISO 27001 denetimi henüz tamamlanmadı. Bu aşamada orta ölçekli ticaret şirketleri için pratik güvenlik önlemleri yeterli.",
                },
                {
                  limit: "Lojistik takip yok.",
                  note: "Gemi konumu, gümrük durumu, depo hareketi — bunlar ORTAQ'ın kapsamında değil. Bu bilgileri başka sistemlerden almanız gerekiyor.",
                },
              ].map(item => (
                <div key={item.limit} className="rounded-xl border border-ortaq-border bg-white p-5">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 h-4 w-4 shrink-0 rounded-full border border-ortaq-border-strong bg-white flex items-center justify-center text-[0.5rem] font-bold text-ortaq-ink-soft">×</span>
                    <div>
                      <p className="text-[0.75rem] font-bold text-ortaq-ink">{item.limit}</p>
                      <p className="mt-2 text-[0.6875rem] leading-relaxed text-ortaq-ink-muted">{item.note}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Final honest statement */}
            <div className="mt-6 rounded-xl border border-ortaq-border bg-ortaq-ink px-6 py-5">
              <p className="text-[0.875rem] font-semibold text-ortaq-cream leading-snug">
                Uygun olmadığımız durumu söyleyebilir miyiz?
              </p>
              <p className="mt-2 text-[0.75rem] text-ortaq-cream/70 leading-relaxed">
                Evet. Demo görüşmesinde ihtiyacınızı dinleriz — eğer ORTAQ doğru araç değilse,
                bunu açıkça söylüyoruz. Birkaç müşteri kazanmak için yanlış beklenti yaratmak istemiyoruz.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* ══ CTA ════════════════════════════════════════════════════════════ */}
      <section className="border-b border-ortaq-border bg-white">
        <Container wide>
          <div className="py-12 sm:py-16">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-[1.375rem] font-bold tracking-[-0.025em] text-ortaq-ink leading-tight">
                  Sorusu olan varsa — en iyi yanıt<br />
                  <span className="text-ortaq-trust">gerçek bir işlem üzerinden gelir.</span>
                </h2>
                <p className="mt-2 text-[0.875rem] text-ortaq-ink-muted">
                  Aktif bir işleminizi getirin. 30 dakika yeter.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 shrink-0">
                <Link
                  href="/senaryolar"
                  className="inline-flex min-h-11 items-center justify-center rounded-lg border border-ortaq-border px-5 text-[0.875rem] font-medium text-ortaq-ink transition-colors hover:border-ortaq-border-strong"
                >
                  Senaryolara bak →
                </Link>
                <Link
                  href="/demo"
                  className="inline-flex min-h-11 items-center justify-center rounded-lg bg-ortaq-trust px-7 text-[0.875rem] font-bold text-white shadow-sm transition-all hover:bg-ortaq-trust-deep active:scale-[0.98]"
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

/* ─── Section title component ────────────────────────────────────────────── */

function SectionTitle({ label, title }: { label: string; title: string }) {
  return (
    <div className="flex items-baseline gap-4">
      <span className="font-mono text-[0.5625rem] font-bold text-ortaq-ink-soft/50">{label}</span>
      <h2 className="text-[1.375rem] font-bold tracking-[-0.025em] text-ortaq-ink sm:text-[1.75rem] leading-snug">
        {title}
      </h2>
    </div>
  );
}
