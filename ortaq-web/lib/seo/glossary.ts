export type GlossaryTerm = {
  id: string;
  term: string;
  definition: string;
  related?: string[];
};

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    id: "spk",
    term: "SPK",
    definition:
      "Sermaye Piyasası Kurulu. Paya dayalı kitle fonlaması SPK düzenlemesi altında yürür. Platformlar SPK listesinde yer alır.",
    related: ["lisansli-platform"],
  },
  {
    id: "lisansli-platform",
    term: "Lisanslı platform",
    definition:
      "SPK listesindeki kitle fonlama platformu. Bireysel ortaklık işlemleri bu platform üzerinden yapılır.",
    related: ["spk"],
  },
  {
    id: "mkk",
    term: "MKK",
    definition:
      "Merkezi Kayıt Kuruluşu. Sermaye artırımı sonrası payınız MKK kayıtlarında adınıza görünür.",
    related: ["pay", "sermaye-artirimi"],
  },
  {
    id: "emanet",
    term: "Emanet hesabı",
    definition:
      "Kampanya süresince paranızın tutulduğu hesap. Para bu sürede şirkete gitmez.",
    related: ["kampanya"],
  },
  {
    id: "bilgi-formu",
    term: "Bilgi formu (izahname)",
    definition:
      "Şirket, faaliyet, riskler ve paranın kullanımını anlatan zorunlu belge. Karar öncesi okunmalıdır.",
    related: ["risk-bildirimi"],
  },
  {
    id: "risk-bildirimi",
    term: "Risk bildirimi",
    definition:
      "Para kaybı, geri alamama ve limitler hakkında bilgilendirme. Onaylanmadan işlem yapılamaz.",
    related: ["bilgi-formu"],
  },
  {
    id: "sermaye-artirimi",
    term: "Sermaye artırımı",
    definition:
      "Kampanya hedefi tutunca şirketin paylarının artırılması. Ortaklık hakkınız bu süreçle doğar.",
    related: ["mkk", "pay"],
  },
  {
    id: "pay",
    term: "Pay",
    definition:
      "Şirketteki ortaklık hakkını temsil eden sermaye payı. Halka açık borsada işlem görmeyebilir.",
    related: ["mkk"],
  },
  {
    id: "kampanya",
    term: "Kampanya",
    definition:
      "Belirli bir sürede hedef tutar toplanmaya çalışılan ortaklık dönemi. Bitince hedef tutmazsa iade süreci işler.",
    related: ["emanet"],
  },
  {
    id: "cayma",
    term: "Cayma hakkı",
    definition:
      "Kampanya süresince belirli koşullarda katılımdan dönme hakkı. Süre bilgi formunda yazar.",
    related: ["risk-bildirimi"],
  },
  {
    id: "kitle-fonlama",
    term: "Paya dayalı kitle fonlama",
    definition:
      "Bireylerin gerçek şirketlerde pay sahibi olmak için katıldığı, SPK düzenlemesine tabi model.",
    related: ["spk", "lisansli-platform"],
  },
];

export function getTermById(id: string): GlossaryTerm | undefined {
  return GLOSSARY_TERMS.find((t) => t.id === id);
}
