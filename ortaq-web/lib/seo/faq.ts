export type FaqItem = {
  id: string;
  question: string;
  answer: string;
  links?: { href: string; label: string }[];
};

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: "ortaq-ne",
    question: "ORTAQ nedir?",
    answer: "ORTAQ, ihracat odaklı üreticiler için doğrulanmış bir sermaye erişim ağıdır. Şirketler belgelerini yükler; kanıt dosyalanır ve incelenir; profil keşfedilebilir olur; sermaye partnerleri kanıtı ve açık soruları görür; karşılıklı tanıştırma sonrası görüşme odası açılır. Yatırım satmaz, fonlama garanti etmez, para tutmaz.",
    links: [{ href: "/demo", label: "Ürün önizlemesi" }, { href: "/#basvuru", label: "Başvur" }],
  },
  {
    id: "ne-degil",
    question: "ORTAQ ne değildir?",
    answer: "Crowdfunding platformu, yatırım platformu, aracı kurum, fon, skorlama ürünü veya yatırım danışmanlığı değildir. ORTAQ kanıt düzenleme, keşif ve karşılıklı tanıştırma katmanıdır; sermaye piyasası faaliyeti yürütmez.",
    links: [{ href: "/guven", label: "Güven ve uyum" }],
  },
  {
    id: "belgeler",
    question: "Hangi belgeler gerekir?",
    answer: "Sektöre göre değişir; tipik set ihracat kaydı, üretim kapasitesi, tekrar eden alıcı talebi, finansal tablolar ve ilgili sözleşmeleri kapsar. Zorunlu belgeler dosyalanıp incelendikten sonra profil keşfedilebilir olur; eksik belgeler profilde açıkça gösterilir.",
    links: [{ href: "/demo/uretici", label: "Üretici profili örneği" }, { href: "/degerlendirme", label: "Nasıl seçiyoruz" }],
  },
  {
    id: "kim-gorur",
    question: "Profilimi kim görebilir?",
    answer: "Zorunlu belgeler incelenene kadar profil keşifte görünmez. Keşfedilebilir olduktan sonra yalnızca kayıtlı nitelikli sermaye partnerleri profili, dosyalanmış kanıtı ve açık soruları görür. Tanıştırma talebi karşılıklı onay gerektirir; tek taraflı erişim yoktur.",
    links: [{ href: "/gizlilik", label: "Gizlilik" }],
  },
  {
    id: "tanistirma",
    question: "Karşılıklı tanıştırma nedir?",
    answer: "Sermaye partneri ilgisini ve gerekçesini yazar; üretici kabul ederse tanıştırma açılır. Her iki taraf da reddedebilir. ORTAQ tarafları zorlamaz; yalnızca belgeler incelendikten sonra tanıştırma yolunu açar.",
    links: [{ href: "/demo/sermaye", label: "Keşif örneği" }, { href: "/nasil-calisir", label: "Süreç" }],
  },
  {
    id: "gorusme-odasi",
    question: "Görüşme odası nedir?",
    answer: "Karşılıklı kabul sonrası açılan yapılandırılmış görüşme ortamıdır. Taraflar kapasite planı, marj yapısı ve açık belge sorularını doğrudan sorar. ORTAQ görüşme içeriğine müdahale etmez; fonlama garanti etmez.",
    links: [{ href: "/demo", label: "Ürün önizlemesi" }],
  },
  {
    id: "acik-sorular",
    question: "Belgeler incelendikten sonra ne bilinmeden kalır?",
    answer: "Dosyalanmış kanıt değerlendirmeyi kolaylaştırır; tüm soruları kapatmaz. Eksik belgeler, bağımsız denetim, marj yapısı ve müşteri konsantrasyonu gibi konular profilde açık soru olarak gösterilir ve görüşme odasında netleştirilir.",
    links: [{ href: "/demo/sirket/karat-parca-konya", label: "Örnek profil" }],
  },
  {
    id: "fonlama-garantisi",
    question: "ORTAQ fonlama garanti eder mi?",
    answer: "Hayır. ORTAQ kanıt düzenler, keşfi açar ve karşılıklı tanıştırma sağlar; yatırım sonucu, getiri veya anlaşma garanti etmez. Karar ve koşullar taraflara aittir.",
    links: [{ href: "/riskler", label: "Riskler" }],
  },
  {
    id: "farkli-ne",
    question: "ORTAQ broker, referans, LinkedIn veya danışmandan nasıl farklı?",
    answer: "Broker ve referans ilişkiye dayanır; LinkedIn kanıt düzenlemez; danışman rapor her seferinde sıfırdan yazılır. ORTAQ belgeleri dosyalar, kanıtı standart profilde sunar, açık soruları gösterir ve yalnızca karşılıklı kabul sonrası görüşme odasını açar. Skor vermez, yatırım satmaz.",
    links: [{ href: "/demo", label: "Ürün önizlemesi" }],
  },
  {
    id: "sirket-ne-kazanir",
    question: "Bir şirket ne kazanır?",
    answer: "Dağınık belgeleri yatırımcının okuyabileceği tek profilde toplar; hangi kanıtın dosyalandığını ve neyin eksik kaldığını görür; nitelikli sermaye partnerlerinden karşılıklı tanıştırma talebi alır.",
    links: [{ href: "/demo/uretici", label: "Üretici tarafı" }],
  },
  {
    id: "sermaye-ne-kazanir",
    question: "Sermaye partneri ne kazanır?",
    answer: "Ağının ulaşamadığı ihracatçı üreticilere erişir; her profilde dosyalanmış kanıt, açık sorular ve tez uyumu görür; sıfırdan belge toplama yükü azalır; karşılıklı kabul sonrası yapılandırılmış görüşme odasına girer.",
    links: [{ href: "/demo/sermaye", label: "Keşif örneği" }],
  },
  {
    id: "nasil-kazanir",
    question: "ORTAQ nasıl kazanır?",
    answer: "Erişim abonelikleriyle: şirketler profil ve belge düzenleme için, sermaye partnerleri keşif ve tanıştırma erişimi için öder. Yatırımdan komisyon almaz, para toplamaz.",
    links: [{ href: "/nasil-calisir", label: "Nasıl çalışır" }],
  },
  {
    id: "neden-gorunmez",
    question: "Bu şirketler neden zaten görünür değil?",
    answer: "Güçlü ihracatçıların çoğu fon aramaya değil üretime odaklanır; geleneksel ağlar bölge ve ilişkiyle sınırlıdır. Görünür olmak ile kanıtı düzenlenmiş ve keşfedilebilir olmak aynı şey değildir.",
    links: [{ href: "/nasil-calisir", label: "Nasıl çalışır" }],
  },
  {
    id: "para-tutuyor-mu",
    question: "ORTAQ para tutuyor mu?",
    answer: "Hayır. ORTAQ para tutmaz, transfer etmez ve menkul kıymet faaliyeti yürütmez. Finansman gerçekleşirse işlem taraflar arasında yürür; ORTAQ kanıt ve tanıştırma katmanıdır.",
    links: [{ href: "/guven", label: "Güven" }],
  },
  {
    id: "crowdfunding-mi",
    question: "Bu crowdfunding mi?",
    answer: "Hayır. Bireysel yatırımcıdan para toplanmaz, halka kampanya açılmaz. ORTAQ, doğrulanmış şirketleri nitelikli sermaye partnerleriyle karşılıklı tanıştırır.",
    links: [{ href: "/guven", label: "Güven ve uyum" }],
  },
  {
    id: "tavsiye-mi",
    question: "ORTAQ yatırım tavsiyesi veriyor mu?",
    answer: "Hayır. ORTAQ yatırım tavsiyesi vermez, getiri taahhüt etmez. Dosyalanmış kanıt ve açık sorular sunar; kararı taraflar kendi değerlendirmesiyle verir.",
    links: [{ href: "/riskler", label: "Riskler" }],
  },
  {
    id: "uygunluk",
    question: "Hangi şirketler uygundur?",
    answer: "İhracat odaklı, üretim yapan ve doğrulanabilir ticari geçmişi olan şirketler. Her başvuru kabul edilmez; seçim belge ve kanıt temellidir.",
    links: [{ href: "/degerlendirme", label: "Nasıl seçiyoruz" }],
  },
  {
    id: "veri-gizlilik",
    question: "Verilerim nasıl korunur?",
    answer: "Şirket ve sermaye tarafı bilgileri rıza temelinde işlenir; tanıştırma çift taraflı onayla yapılır. Detaylar gizlilik politikasında yer alır.",
    links: [{ href: "/gizlilik", label: "Gizlilik" }],
  },
  {
    id: "iletisim",
    question: "Nasıl başlarım?",
    answer: "Şirketseniz değerlendirme için, sermaye partneriyseniz erişim için başvurun. Ürün akışını /demo adresinde görebilirsiniz.",
    links: [{ href: "/demo", label: "Ürün önizlemesi" }, { href: "/#basvuru", label: "Başvur" }],
  },
];

export function getFaqById(id: string): FaqItem | undefined {
  return FAQ_ITEMS.find((f) => f.id === id);
}
