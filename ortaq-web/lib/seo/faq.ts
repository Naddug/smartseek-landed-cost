import { getCategoryPath, getPrimaryLiveCategory } from "@/lib/categories/registry";

/**
 * FAQ_ITEMS — canonical FAQ for operator-site public pages.
 */

const primaryCategory = getPrimaryLiveCategory();
const primaryCategoryLink = primaryCategory
  ? { href: getCategoryPath(primaryCategory.slug), label: "Aktif kategori programı" }
  : { href: "/ne-yapiyoruz", label: "Ne yapıyoruz" };

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
  category: "Hizmet" | "Süreç" | "Fiyat" | "Güven";
  links?: { href: string; label: string }[];
};

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: "kimler-icin",
    category: "Hizmet",
    question: "Bu hizmet kimler için?",
    answer:
      "Kendi ürün hattını başlatmak isteyen distribütörler, ithalatçılar, toptancılar, perakendeciler ve marka sahipleri — üretim minimumlarını karşılayabilenler.",
    links: [{ href: "/ne-yapiyoruz", label: "Ne yapıyoruz" }],
  },
  {
    id: "ortaq-ne",
    category: "Hizmet",
    question: "ORTAQ tam olarak ne yapar?",
    answer:
      "Ürünü kaynaklarız, üretimi yönetiriz, ihracat ve teslimatı üstleniriz; sonuçtan sorumlu kalırız. Marka ve müşteriler sizin.",
    links: [{ href: "/nasil-calisir", label: "Nasıl çalışır" }],
  },
  {
    id: "ne-degil",
    category: "Hizmet",
    question: "ORTAQ ne değildir?",
    answer:
      "Pazar yeri değil, yazılım demosu değil, yatırım aracı değil. Fabrika bulmak, üretimi koordine etmek ve ürünü deponuza teslim etmek için tek sorumlu ortağınız.",
    links: [{ href: "/neden-ortaq", label: "Neden ORTAQ" }],
  },
  {
    id: "hangi-urunler",
    category: "Hizmet",
    question: "Bugün hangi ürünleri yapabilirsiniz?",
    answer:
      "Aktif kategoriler kayıtta listelenir. Zamanla aynı süreçle yeni kategoriler ekliyoruz.",
    links: [primaryCategoryLink],
  },
  {
    id: "marka-kime",
    category: "Hizmet",
    question: "Marka kime ait?",
    answer: "Size. İsim, ürün ve müşteriler sizin. ORTAQ arka planda kaynaklama ve üretimi yürütür.",
    links: [],
  },
  {
    id: "nasil-calisir",
    category: "Süreç",
    question: "Süreç nasıl işler?",
    answer:
      "Fabrika kaynağı, ürün spesifikasyonu, numune onayı, üretim takibi, ihracat evrakları ve teslimat — tek ortakta. Önemli kararları siz onaylarsınız.",
    links: [{ href: "/nasil-calisir", label: "Adım adım süreç" }],
  },
  {
    id: "numune",
    category: "Süreç",
    question: "Numune süreci nasıl işler?",
    answer:
      "Üretime geçmeden önce gerçek ürünü ve ambalajı onaylarsınız. Numune koordinasyonunu biz yürütürüz.",
    links: [{ href: "/teklif", label: "Teklif alın" }],
  },
  {
    id: "kalite",
    category: "Süreç",
    question: "Kalite kontrolü nasıl yapılır?",
    answer:
      "Her parti sevkiyattan önce kontrol edilir. Üretim, kilit referansa göre yönetilir.",
    links: [{ href: "/guven", label: "Güven ve uyum" }],
  },
  {
    id: "pazarlar",
    category: "Süreç",
    question: "Hangi pazarlara hizmet veriyorsunuz?",
    answer:
      "Rekabetçi teslimat yapabildiğimiz pazarlar. Uygun değilse açıkça söyleriz.",
    links: [],
  },
  {
    id: "ucret",
    category: "Fiyat",
    question: "Maliyet nasıl belirlenir?",
    answer:
      "Ürün, hacim ve pazara göre teklif formunda netleşir. Kilometre taşı bazlı ödeme; tam tutarı peşin ödemezsiniz.",
    links: [{ href: "/teklif", label: "Teklif alın" }],
  },
  {
    id: "odeme",
    category: "Fiyat",
    question: "Ödemeler nasıl işler?",
    answer:
      "Kilometre taşı bazlı. Numune, üretim ve sevkiyat aşamalarına göre planlanır.",
    links: [],
  },
  {
    id: "ilk-adim",
    category: "Fiyat",
    question: "İlk adım ne?",
    answer:
      "Teklif formunu doldurun veya destek@ortaq.biz adresine yazın. 48 saat içinde uygunluk ve maliyet aralığı paylaşırız.",
    links: [{ href: "/teklif", label: "Teklif formu" }],
  },
  {
    id: "guven",
    category: "Güven",
    question: "Neden ORTAQ'a güvenebilirim?",
    answer:
      "LEGO Group, Petlas ve Yiğit Akü geçmişine sahip ekip tarafından yürütülür. Her siparişin arkasında gerçek fabrika ilişkileri ve gerçek üretim yönetimi vardır.",
    links: [{ href: "/neden-ortaq", label: "Neden ORTAQ" }, { href: "/ekip", label: "Ekip" }],
  },
  {
    id: "para-tutmaz",
    category: "Güven",
    question: "ORTAQ para tutar mı veya yatırım satar mı?",
    answer:
      "Hayır. ORTAQ yatırım tavsiyesi vermez, fonlama veya getiri garanti etmez. Kaynaklama ve üretim operatörü olarak çalışır.",
    links: [{ href: "/guven", label: "Güven ve uyum" }],
  },
  {
    id: "veri",
    category: "Güven",
    question: "Paylaştığım bilgiler nasıl kullanılır?",
    answer:
      "Teklif talebiniz ve program planlaması için kullanılır. KVKK kapsamında işlenir; detaylar gizlilik politikasında.",
    links: [{ href: "/gizlilik", label: "Gizlilik" }],
  },
];

export const FAQ_CATEGORIES = ["Tümü", "Hizmet", "Süreç", "Fiyat", "Güven"] as const;

export function getFaqById(id: string): FaqItem | undefined {
  return FAQ_ITEMS.find((f) => f.id === id);
}
