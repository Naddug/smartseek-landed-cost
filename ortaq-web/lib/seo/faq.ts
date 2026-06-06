/**
 * FAQ_ITEMS — the canonical FAQ list for ORTAQ.
 *
 * Phase 7: Completely replaced — previous items were for the old capital
 * marketplace product. These questions reflect ORTAQ as a B2B commercial
 * transaction record system.
 *
 * Rules:
 *   - Real questions. Direct answers.
 *   - No promotional language. No startup jargon.
 *   - If the answer is "no", say "no" first.
 *   - Sorted by category: Ürün, Erişim, Veri, Fiyatlandırma, Güvenilirlik
 */

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
  links?: { href: string; label: string }[];
};

export const FAQ_ITEMS: FaqItem[] = [
  /* ── ÜRÜN ─────────────────────────────────────────────────────────── */
  {
    id: "ortaq-ne",
    question: "ORTAQ nedir?",
    answer:
      "ORTAQ, iki şirket arasındaki ticari işlemin ortak kaydıdır. Sözleşme, SGS raporu, BL, proforma fatura gibi belgeler; onay adımları ve taraflar arası mesajlar tek işlem kaydında bir araya gelir. Alıcı ve satıcı aynı kaydı görür — iki ayrı sistem değil, aynı kayıt.",
    links: [{ href: "/nasil-calisir", label: "Nasıl çalışır" }, { href: "/urun", label: "Ürün ekranları" }],
  },
  {
    id: "ne-degil",
    question: "ORTAQ ne değildir?",
    answer:
      "ERP değil: muhasebe, stok ve fatura yapmaz. CRM değil: müşteri adayı, satış hunisi veya e-posta kampanyası yok. Mesajlaşma uygulaması değil: WhatsApp'ın yerini almaz. Lojistik takip değil: gemi konumu veya gümrük durumu göstermez. Ticari işlemin belge ve onay kaydını tutar — bunun dışında değil.",
    links: [{ href: "/guven#ne-yapar", label: "Ne yapar / yapmaz" }],
  },
  {
    id: "nasil-calisir",
    question: "Sistemde bir işlem nasıl açılır?",
    answer:
      "Bir işlem açtığınızda alıcı ve satıcı tarafını, işlem tutarını ve para birimini girersiniz. Ardından belgeleri yükler, onay adımlarını tanımlar ve karşı tarafı sisteme davet edersiniz. Alıcı daveti kabul ettiğinde aynı işlem kaydını görür — siz neyi paylaşmak istediğinizi kontrol edersiniz.",
    links: [{ href: "/nasil-calisir", label: "Süreç detayı" }],
  },
  {
    id: "hangi-belgeler",
    question: "Hangi belgeler yüklenebilir?",
    answer:
      "Herhangi bir belge. SGS muayene raporu, BL taslağı, imzalı sözleşme, proforma fatura, packing list, LC belgesi, sigorta poliçesi — dosya türü ve içerik kısıtlaması yoktur. Her belge versiyonlanır; en güncel versiyon açıkça işaretlenir.",
    links: [{ href: "/urun", label: "Belge Merkezi ekranı" }],
  },
  {
    id: "alici-olmadan",
    question: "Alıcım ORTAQ'a kayıtlı olmak zorunda mı?",
    answer:
      "Alıcı, paylaştığınız belgeleri ve işlem kaydını görmek için ORTAQ'ta ücretsiz bir hesap oluşturmalıdır. Hesap açma dakikalar içinde tamamlanır. Alıcı daveti e-posta yoluyla alır ve katılım isteğe bağlıdır — size de, alıcıya da zorunlu değildir.",
    links: [],
  },
  {
    id: "kac-islem",
    question: "Aynı anda kaç işlem yönetebilirim?",
    answer:
      "Kısıtlama yoktur. Çelik, tekstil, makine, gıda gibi farklı kategorilerde aynı anda onlarca aktif işlem yönetilebilir. Portföy Görünümü ekranı tüm işlemleri, durumlarını ve bekleyen adımlarını bir arada gösterir.",
    links: [{ href: "/urun", label: "Portföy Görünümü" }],
  },

  /* ── ERİŞİM ───────────────────────────────────────────────────────── */
  {
    id: "alici-notlari-gorur-mu",
    question: "Alıcım dahili notlarımı görebilir mi?",
    answer:
      "Hayır. Dahili olarak işaretlenen mesajlar ve belgeler yalnızca kendi şirketinizin kullanıcılarına görünür. Alıcı bu öğelerin var olduğundan bile haberdar olmaz. Bulanık değil — gerçekten yok. Alıcı görünümü her zaman ayrı bir ekranla doğrulanabilir.",
    links: [{ href: "/urun", label: "Karşı Taraf Görünümü ekranı" }],
  },
  {
    id: "ortaq-calisanlar-gorur-mu",
    question: "ORTAQ çalışanları işlem verilerimi görebilir mi?",
    answer:
      "Destek amacı dışında hayır. Teknik ekip altyapı sorunlarını çözmek için şifreli verilere erişebilir, ancak sözleşme içerikleri, fiyatlandırma veya taraf yazışmaları rutin olarak incelenmez. Bu taahhüt erişim denetim kayıtlarıyla desteklenmektedir.",
    links: [{ href: "/guven#guvenlik", label: "Güvenlik ve gizlilik" }],
  },
  {
    id: "kim-ne-gorur",
    question: "Bir işlemde kimin neyi göreceğini nasıl belirlerim?",
    answer:
      "Her belge ve mesaj için görünürlük ayarlanabilir: yalnızca kendi şirketiniz (dahili) veya her iki taraf (paylaşılan). Onay adımlarında hangi tarafın beklediği açıkça gösterilir. Karşı taraf görünümü ayrı bir ekranda her zaman doğrulanabilir.",
    links: [{ href: "/urun", label: "Ürün ekranları" }],
  },
  {
    id: "kullanici-sayisi",
    question: "Şirketimden kaç kullanıcı ekleyebilirim?",
    answer:
      "Kullanıcı sayısı fiyatlandırma planına göre değişir. Tipik olarak dış ticaret ekibi, satın alma müdürü ve genel müdür aynı anda aynı işlem kaydını görebilir — farklı erişim seviyeleriyle. Detaylar demo görüşmesinde netleştirilir.",
    links: [{ href: "/demo", label: "Demo İsteyin" }],
  },

  /* ── VERİ ─────────────────────────────────────────────────────────── */
  {
    id: "veri-nerede",
    question: "Verilerim nerede saklanıyor?",
    answer:
      "Tüm veriler Avrupa'daki veri merkezlerinde barındırılır (Frankfurt ve Paris). Aktarımda TLS 1.3, depolamada AES-256 şifreleme uygulanır. Veriler Türkiye dışına çıkmaz — teknik altyapı hizmetleri (CDN vb.) hariç.",
    links: [{ href: "/guven#guvenlik", label: "Güvenlik detayı" }, { href: "/gizlilik", label: "Gizlilik politikası" }],
  },
  {
    id: "verilerimi-cikararim",
    question: "Verilerimi ORTAQ'tan dışa aktarabilir miyim?",
    answer:
      "Evet, her zaman. Herhangi bir işlem kaydını — belgeler, mesajlar, onay geçmişi, denetim izi dahil — PDF veya JSON formatında dışa aktarabilirsiniz. Aboneliğiniz aktif olmasa bile 90 gün boyunca dışa aktarım penceresi açık kalır.",
    links: [{ href: "/guven#ticari-guvenilirlik", label: "Ticari güvenilirlik" }],
  },
  {
    id: "ortaq-kapanirsa",
    question: "ORTAQ kapanırsa ne olur?",
    answer:
      "Hizmet kapanmadan en az 90 gün önce bildirim yapılır ve tüm verilerinizi dışa aktarmanız için pencere açık tutulur. Bu taahhüt hizmet koşullarına yazılıdır. Verilerinizi tutmak için sistemi kullanmaya devam etmek zorunda değilsiniz.",
    links: [{ href: "/guven#ticari-guvenilirlik", label: "Ticari güvenilirlik" }],
  },
  {
    id: "gdpr",
    question: "GDPR uyumlu mu?",
    answer:
      "Evet. Kişisel veriler GDPR kapsamında işlenir. Silme talebi, veri taşıma talebi ve veri işleme anlaşması (DPA) desteklenmektedir.",
    links: [{ href: "/gizlilik", label: "Gizlilik politikası" }],
  },
  {
    id: "islem-bittikten-sonra",
    question: "İşlem tamamlandıktan sonra kayıt ne olur?",
    answer:
      "Kayıt arşivlenir ve erişilebilir kalır. Belgeler, onay geçmişi ve denetim izi silinmez. Aylar sonra bir anlaşmazlık veya denetim için yeniden açılabilir.",
    links: [],
  },

  /* ── FİYATLANDIRMA ────────────────────────────────────────────────── */
  {
    id: "ucret",
    question: "ORTAQ'ın maliyeti nedir?",
    answer:
      "Fiyatlandırma şirket ölçeği ve işlem hacmine göre demo görüşmesinde belirlenir. Gizli ücret yoktur. Fiyat değişikliği 60 gün önceden bildirilir. Bağlayıcı uzun vadeli sözleşme zorunluluğu yoktur.",
    links: [{ href: "/demo", label: "Demo İsteyin" }],
  },
  {
    id: "deneme",
    question: "Satın almadan önce deneyebilir miyim?",
    answer:
      "Demo görüşmesinde aktif bir işleminizi sistemde birlikte inceleriz. Bu genel bir tanıtım değil — kendi verilerinizle, kendi iş akışınızla bakarsınız. Demo ücretsizdir.",
    links: [{ href: "/demo", label: "Demo İsteyin" }],
  },

  /* ── GÜVENİLİRLİK ─────────────────────────────────────────────────── */
  {
    id: "erp-degisir-mi",
    question: "ERP veya muhasebe sistemimi değiştirmem gerekiyor mu?",
    answer:
      "Hayır. ORTAQ mevcut sistemlerinize dokunmaz. ERP'niz, muhasebe yazılımınız ve WhatsApp kullanımınız değişmez. ORTAQ yalnızca ticari işlemin belge ve onay kaydını tutar — zaten mevcut olan araçların yerini almaz.",
    links: [],
  },
  {
    id: "whatsapp",
    question: "WhatsApp mesajlarım otomatik ORTAQ'a aktarılıyor mu?",
    answer:
      "Hayır. ORTAQ mesajları otomatik olarak içe aktarmaz. WhatsApp konuşmaları WhatsApp'ta kalır. ORTAQ'taki mesajlar doğrudan bu sisteme yazılır ve her zaman bir işleme bağlıdır.",
    links: [],
  },
  {
    id: "kucuk-sirket-miyiz",
    question: "ORTAQ küçük bir şirket mi?",
    answer:
      "Evet. Büyük kurumsal yazılım sağlayıcılarına kıyasla daha küçük bir ekibiz. Bunu açıkça söylüyoruz. Bu bir risk faktörüdür ve karar verirken göz önünde bulundurulmalıdır. Büyük ölçekli kurumsal risk gereksinimleri için şu aşamada uygun olmayabiliriz.",
    links: [{ href: "/guven#donuk-sinirlar", label: "Dürüst sınırlar" }],
  },
  {
    id: "denetim-izi",
    question: "Onay kayıtları hukuki süreçlerde kullanılabilir mi?",
    answer:
      "ORTAQ'taki denetim izi değiştirilemez. Kimin ne zaman neyi onayladığı kalıcı olarak kayıt altındadır. Bu kayıt bir anlaşmazlıkta kanıt niteliğinde kullanılabilir. Ancak ORTAQ hukuki tavsiye sunmaz — bu değerlendirmeyi hukuk danışmanınızla yapmanız gerekir.",
    links: [{ href: "/urun", label: "Denetim İzi ekranı" }],
  },
];

export function getFaqById(id: string): FaqItem | undefined {
  return FAQ_ITEMS.find((f) => f.id === id);
}
