export type FaqItem = {
  id: string;
  question: string;
  answer: string;
  links?: { href: string; label: string }[];
};

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: "ortaq-ne", question: "ORTAQ nedir?", answer: "ORTAQ bir büyüme sermayesi erişim ağıdır. Güçlü ama doğru sermayenin göremediği üretim şirketlerini yatırıma hazır ve görünür kılar, doğru sermaye partnerleriyle nitelikli biçimde buluşturur. Yatırım satmaz, fon değildir, para tutmaz.", links: [{ href: "/basla", label: "Başla" }], }, {
    id: "ne-degil", question: "ORTAQ ne değildir?", answer: "Crowdfunding platformu, yatırım platformu, aracı kurum, fon veya danışmanlık şirketi değildir. ORTAQ yalnızca doğrulama, hazırlık ve nitelikli tanıştırma katmanıdır; sermaye piyasası faaliyeti yürütmez.", links: [{ href: "/guven", label: "Güven ve uyum" }], }, {
    id: "nasil-kazanir", question: "ORTAQ nasıl kazanır?", answer: "Gelir erişim ve zekâ aboneliklerinden gelir: şirketler hazırlık ve görünürlük için, sermaye partnerleri nitelikli fırsat erişimi için öder. Yatırımdan komisyon almaz, para toplamaz.", links: [{ href: "/nasil-calisir", label: "Nasıl çalışır" }], }, {
    id: "sirket-ne-kazanir", question: "Bir şirket ne kazanır?", answer: "Standart, yatırımcı-dostu bir profille görünür olur; readiness skoruyla yatırıma hazırlığını ve eksiklerini görür; doğru sermaye partnerleriyle nitelikli tanıştırma alır. Acele al-sat değil, doğru sermayeye yapılandırılmış erişimdir.", links: [{ href: "/nasil-calisir", label: "Süreç" }], }, {
    id: "sermaye-ne-kazanir", question: "Sermaye partneri ne kazanır?", answer: "Ağının verimli ulaşamadığı bir segmente erişir: doğrulanmış, yatırıma hazır büyüme şirketleri. Her fırsat standart veri ve readiness skoruyla gelir; sıfırdan inceleme yükü düşer, keşif maliyeti azalır.", links: [{ href: "/sirketler", label: "Şirketler" }], }, {
    id: "readiness", question: "Readiness Score nedir?", answer: "Bir şirketin yatırıma hazırlığını ölçen skorlama sistemidir; büyüme, sermaye, belge ve operasyonel hazırlık ile yatırımcı uyumunu değerlendirir. Elle yazılan danışmanlık raporu değil, ölçeklenebilir bir sistemdir.", links: [{ href: "/degerlendirme", label: "Nasıl seçiyoruz" }], }, {
    id: "neden-gorunmez", question: "Bu şirketler neden zaten görünür değil?", answer: "Güçlü ihracatçıların çoğu fon bulmaya değil üretime odaklanır; geleneksel yatırım ağları bölge ve ilişkiyle sınırlıdır ve bu segmenti kapsamaz. Görünür olmak ile sermayeye hazır olmak aynı şey değildir. ORTAQ bu boşluğu kapatır.", links: [{ href: "/nasil-calisir", label: "Nasıl çalışır" }], }, {
    id: "para-tutuyor-mu", question: "ORTAQ para tutuyor mu?", answer: "Hayır. ORTAQ para tutmaz, transfer etmez ve menkul kıymet faaliyeti yürütmez. Bir finansman gerçekleştiğinde işlem, lisanslı yapı üzerinden ilgili taraflar arasında yürür; ORTAQ doğrulama ve tanıştırma katmanıdır.", links: [{ href: "/guven", label: "Güven" }], }, {
    id: "crowdfunding-mi", question: "Bu crowdfunding mi?", answer: "Hayır. Bireysel yatırımcıdan para toplanmaz, halka kampanya açılmaz. ORTAQ, doğrulanmış şirketleri kurumsal ve nitelikli sermaye partnerleriyle nitelikli biçimde tanıştırır.", links: [{ href: "/guven", label: "Güven ve uyum" }], }, {
    id: "tavsiye-mi", question: "ORTAQ yatırım tavsiyesi veriyor mu?", answer: "Hayır. ORTAQ yatırım tavsiyesi vermez, getiri taahhüt etmez. Doğrulama ve hazırlık verisi sunar; kararı taraflar kendi değerlendirmesiyle verir.", links: [{ href: "/riskler", label: "Riskler" }], }, {
    id: "tanistirma-nasil", question: "Tanıştırma nasıl olur?", answer: "Çift taraflı ilgi oluştuğunda nitelikli tanıştırma yapılır. Şirket profili ve readiness verisi sermaye partnerinin tezine uyduğunda taraflar buluşturulur; ardından süreç taraflar arasında ilerler.", links: [{ href: "/nasil-calisir", label: "Süreç" }], }, {
    id: "neden-simdi", question: "Neden şimdi?", answer: "Tedarik zincirleri yeniden kuruluyor; alıcılar ve sermaye üretimi tek ülkeye bağlamak istemiyor ve gözler Türkiye'ye çevriliyor. Bu pencerede doğru konumlanan üretici ve erken erişen sermaye avantaj yakalar.", links: [{ href: "/basla", label: "Başla" }], }, {
    id: "asama", question: "ORTAQ hangi aşamada?", answer: "Şu anda ilk üretici grubuyla pilot görüşmeler yürütülüyor. Erken kayıt, ilk kohortta yer almak ve doğrulanmış sicili erkenden biriktirmek demektir.", links: [{ href: "/basla", label: "Başla" }], }, {
    id: "uygunluk", question: "Hangi şirketler uygundur?", answer: "İhracat siparişi veya net büyüme potansiyeli olan, üretim yapan ve doğrulanabilir ticari geçmişi olan şirketler. Her başvuru kabul edilmez; seçim doğrulama ve hazırlık temellidir.", links: [{ href: "/degerlendirme", label: "Nasıl seçiyoruz" }], }, {
    id: "veri-gizlilik", question: "Verilerim nasıl korunur?", answer: "Şirket ve sermaye tarafı bilgileri rıza temelinde işlenir; tanıştırma çift taraflı onayla yapılır. Detaylar gizlilik politikasında yer alır.", links: [{ href: "/gizlilik", label: "Gizlilik" }], }, {
    id: "iletisim", question: "Nasıl başlarım?", answer: "Şirketseniz değerlendirme için, sermaye partneriyseniz erişim için başvurun. Sorularınız için destek@ortaq.biz adresine yazabilirsiniz.", links: [{ href: "/#basvuru", label: "Başvur" }], },
];

export function getFaqById(id: string): FaqItem | undefined {
  return FAQ_ITEMS.find((f) => f.id === id);
}
