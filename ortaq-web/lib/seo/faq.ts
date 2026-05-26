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
    answer:
      "ORTAQ, paya dayalı ortaklık sürecini sade anlatan bir arayüzdür. Banka değildir, yatırım tavsiyesi vermez, kazanç garantisi sunmaz.",
    links: [{ href: "/basla", label: "Okumaya başla" }],
  },
  {
    id: "spk-guven",
    question: "SPK düzenlemesi altında mı?",
    answer:
      "Paya dayalı kitle fonlaması SPK düzenlemesi altında yürür. ORTAQ, SPK listesindeki lisanslı bir platform ile anlaşma görüşmeleri sürdürüyor. Anlaşma tamamlanana kadar işlem kabul edilmez.",
    links: [{ href: "/guven", label: "Güven sayfası" }],
  },
  {
    id: "para-nereye",
    question: "Param nereye gider?",
    answer:
      "Katılım sırasında paranız emanet hesabına gider; kampanya bitene kadar şirkete aktarılmaz. Hedef tutmazsa iade süreci işler.",
    links: [
      { href: "/nasil-calisir", label: "Süreç" },
      { href: "/sozluk", label: "Sözlük" },
    ],
  },
  {
    id: "dolandiricilik",
    question: "Dolandırıcılıktan nasıl korunurum?",
    answer:
      "Lisanslı platform dışında para göndermeyin. Kazanç garantisi vaat eden kampanyalara itibar etmeyin. Bilgi formunu okuyun, risk bildirimini onaylayın, şüphe duyduğunuzda destek@ortaq.biz adresine yazın.",
    links: [{ href: "/riskler", label: "Riskler" }],
  },
  {
    id: "kazanc-garantisi",
    question: "Kazanç garantisi var mı?",
    answer: "Hayır. Ortaklıkta para kaybedebilirsiniz. ORTAQ hiçbir getiri vaat etmez.",
    links: [{ href: "/riskler", label: "Riskler" }],
  },
  {
    id: "mkk",
    question: "Payım nerede görünür?",
    answer:
      "Sermaye artırımı tamamlandığında payınız Merkezi Kayıt Kuruluşu (MKK) kayıtlarında adınıza görünür.",
    links: [{ href: "/sozluk", label: "MKK nedir?" }],
  },
  {
    id: "limit",
    question: "Yıllık limit var mı?",
    answer:
      "Evet. Bireysel katılımcılar için yıllık üst sınır kanunda belirlenir. Güncel tutar her kampanyanın bilgi formunda yazar.",
    links: [{ href: "/riskler", label: "Limitler" }],
  },
  {
    id: "fark-kripto",
    question: "Kripto veya borsadan farkı ne?",
    answer:
      "Paya dayalı ortaklık, gerçek şirketlerde pay sahibi olmayı hedefler; SPK düzenlemesi, bilgi formu ve emanet hesabı zorunludur. Kripto veya borsa işlemleri farklı risk ve kurallara tabidir.",
    links: [{ href: "/nasil-calisir", label: "Nasıl çalışır" }],
  },
  {
    id: "sirket-basvuru",
    question: "Şirketim kampanya açabilir mi?",
    answer:
      "ORTAQ henüz kampanya kabul etmiyor. Süreç lisanslı platform anlaşması tamamlandığında açıklanacak. Şimdilik destek@ortaq.biz üzerinden bilgi alabilirsiniz.",
  },
  {
    id: "islem-yok",
    question: "Neden şimdi işlem yapamıyorum?",
    answer:
      "Lisanslı platform anlaşması tamamlanmadan kimlik doğrulama veya ödeme alınmaz. Okumak için buradasınız; bu normal bir aşamadır.",
    links: [{ href: "/basla", label: "Okumaya başla" }],
  },
];

export function getFaqById(id: string): FaqItem | undefined {
  return FAQ_ITEMS.find((f) => f.id === id);
}
