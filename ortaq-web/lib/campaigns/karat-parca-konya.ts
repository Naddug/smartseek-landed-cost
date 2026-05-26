import type { SimulatedCampaign } from "./types";

/** Simulated dossier — Konya industrial parts manufacturer. Not a live investment offer. */
export const karatParcaKonya: SimulatedCampaign = {
  slug: "karat-parca-konya",
  simulated: true,
  legalName: "Karat Parça Makina Sanayi ve Ticaret A.Ş.",
  tradeName: "Karat Parça Makina",
  sector: "Tarım ve iş makinesi yedek parça üretimi",
  city: "Konya",
  region: "Organize Sanayi Bölgesi, Selçuklu",
  founded: 2008,
  employees: 47,
  exportMarkets: ["Almanya", "Irak", "Kazakistan", "Azerbaycan", "Romanya", "Bulgaristan"],
  annualRevenueNote: "2024 yönetim raporu — bağımsız denetim yapılmamış",
  productionNote: "Ayda ~12.000 adet işlenmiş parça kapasitesi (mevcut hat)",
  verificationLabel: "under_review",
  reviewStatus: "field_verification",
  seoTitle: "Karat Parça Makina | Değerlendirme dosyası",
  seoDescription:
    "Konya merkezli tarım ve iş makinesi yedek parça üreticisi. Değerlendirme dosyası — yatırım teklifi değildir.",
  story: {
    origin:
      "2008'de Konya'da tek atölye ve üç torna tezgâhıyla başladı. Kurucu Mehmet Karat, tarım makinesi tamiri yaparken yedek parça tedarikindeki boşluğu gördü.",
    today:
      "Bugün 4.200 m² kapalı alanda CNC torna, freze ve kaynak hatlarıyla OEM ve yedek parça üretiyor. Müşterilerin %60'ı Türkiye içi, %40'ı ihracat.",
    production:
      "Ham alüminyum ve çelik bloklar tedarik edilir → CNC işleme → yüzey kaplama → kalite kontrol → sevkiyat. Kritik tolerans parçalarında %100 ölçüm.",
  },
  founder: {
    name: "Mehmet Karat",
    role: "Kurucu ortak · Genel müdür",
    note:
      "18 yıldır aynı fabrikada. Ortaklık modelini araştırıyoruz çünkü büyüme için makine yatırımı gerekiyor — banka kredisi tek başına yetmiyor. ORTAQ sürecindeyiz; henüz kampanya açık değil.",
  },
  funding: {
    purpose:
      "İkinci CNC işleme hattı ve bağlı kalite ölçüm ünitesi. Hedef: ihracat siparişlerindeki teslim süresini 6 haftadan 4 haftaya indirmek.",
    targetTry: 8_500_000,
    lines: [
      { label: "CNC işleme hattı (2 tezgâh + otomasyon)", amountTry: 4_200_000, percent: 49 },
      { label: "Kalite laboratuvarı ve ölçüm ekipmanı", amountTry: 1_100_000, percent: 13 },
      { label: "Ham malzeme stoku (6 aylık)", amountTry: 1_800_000, percent: 21 },
      { label: "Lojistik ve ambalaj iyileştirmesi", amountTry: 650_000, percent: 8 },
      { label: "İşletme sermayesi tamponu", amountTry: 750_000, percent: 9 },
    ],
  },
  risks: [
    {
      title: "İhracat talebi",
      text: "Avrupa pazarındaki yavaşlama sipariş hacmini düşürebilir. Şirket gelirinin önemli kısmı ihracata bağlı.",
    },
    {
      title: "Ham madde fiyatı",
      text: "Çelik ve alüminyum fiyat dalgalanması marjı etkileyebilir. Şirketin fiyat güncelleme politikası sözleşmelerle sınırlı.",
    },
    {
      title: "Makine yatırımı gecikmesi",
      text: "Tezgâh teslimatı 8–12 ay sürebilir. Yatırım getirisi gecikebilir.",
    },
    {
      title: "Ortaklık çıkışı",
      text: "Payınız halka açık olmayan bir şirkette kalır. Satış veya geri alım yıllar sürebilir.",
    },
  ],
  process: [
    { label: "Ön başvuru ve sektör uygunluğu", status: "done", date: "2026-01-10" },
    { label: "Belge paketi (ticaret sicili, vergi, finansal tablo)", status: "done", date: "2026-02-04" },
    { label: "Saha ziyareti — üretim hattı", status: "active", date: "2026-05-18" },
    { label: "Finansal ve hukuk incelemesi", status: "pending" },
    { label: "Yatırım komitesi", status: "pending" },
    { label: "Lisanslı platform onayı", status: "pending" },
    { label: "Bilgi formu yayını ve ortaklık", status: "pending" },
  ],
  documents: [
    { id: "memorandum", title: "Bilgi formu (izahname)", status: "pending", note: "Komite onayı sonrası" },
    { id: "registry", title: "Ticaret sicil gazetesi", status: "review" },
    { id: "financials", title: "2023–2024 yönetim raporları", status: "review" },
    { id: "export", title: "İhracat faturaları özeti (2024)", status: "available" },
    { id: "photos", title: "Fabrika ve üretim hattı fotoğrafları", status: "available" },
    { id: "field", title: "Saha ziyareti tutanağı", status: "pending", note: "Ziyaret tamamlanınca" },
  ],
  economics: [
    { label: "Kuruluş", value: "2008" },
    { label: "Çalışan", value: "47 kişi" },
    { label: "Kapalı alan", value: "4.200 m²" },
    { label: "İhracat pazarları", value: "6 ülke" },
    { label: "Ana müşteri tipi", value: "OEM + yedek parça distribütörleri" },
    { label: "Sertifikasyon", value: "ISO 9001:2015 (2023 yenileme)" },
  ],
  operations: {
    signals: [
      { label: "Aylık kapasite", value: "~12.000 parça" },
      { label: "CNC hatları", value: "2 aktif · 1 planlanan" },
      { label: "Vardiya", value: "2 vardiya, 6 gün" },
      { label: "İhracat payı", value: "Gelirin ~%40'ı" },
      { label: "Makine parkı", value: "14 tezgâh" },
      { label: "Son saha ziyareti", value: "18 Mayıs 2026" },
    ],
    processes: ["CNC torna", "CNC freze", "TIG kaynak", "Yüzey kaplama", "Kalite ölçüm"],
    materials: ["6061 alüminyum", "4140 çelik", "Dökme demir"],
    shifts: "2 vardiya · 06:00–22:00",
  },
  timeline: [
    { year: 2008, event: "Tek atölye, 3 torna tezgâhı — tarım makinesi yedek parça" },
    { year: 2014, event: "OSB'ye taşınma, ilk CNC hattı devreye" },
    { year: 2018, event: "İlk ihracat siparişi — Almanya distribütörü" },
    { year: 2022, event: "Kapalı alan 4.200 m²'ye genişledi, ISO 9001 yenilendi" },
    { year: 2026, event: "ORTAQ değerlendirme sürecine başvuru — ikinci hat yatırımı" },
  ],
  access: {
    status: "field_verification",
    nextGate: "Finansal ve hukuk incelemesi",
  },
  machines: [
    {
      id: "cnc-t1",
      name: "Doosan Lynx 220",
      role: "CNC torna",
      year: 2019,
      note: "İhracat parçalarının tahmini %70'i bu hattan çıkıyor. 2 vardiya.",
    },
    {
      id: "cnc-t2",
      name: "Mazak Quick Turn 250",
      role: "CNC torna",
      year: 2016,
      note: "Yüksek hacimli yurtiçi siparişler. Bakım periyodu: 6 ay.",
    },
    {
      id: "cnc-f1",
      name: "Haas VF-2",
      role: "CNC freze",
      year: 2021,
      note: "Tek freze hattı — mevcut darboğaz. Kuyruk ~3 hafta.",
    },
    {
      id: "weld-1",
      name: "ESAB kaynak ünitesi ×4",
      role: "TIG / MIG",
      year: 2017,
      note: "Kaynak sonrası 100% görsel + örnekleme kontrol.",
    },
  ],
  bottlenecks: [
    {
      label: "Freze kapasitesi",
      note: "Tek freze tezgâhı. İhracat siparişlerinde teslim süresi 6 haftaya uzuyor.",
    },
    {
      label: "Ham malzeme stoku",
      note: "4140 çelik tedarik süresi 4–5 hafta. Stok alanı doluluk ~%85.",
    },
    {
      label: "Kalite ölçüm",
      note: "Kritik tolerans parçalarında tek koordinat ölçüm cihazı — hat beklemesi oluyor.",
    },
  ],
  facilityNotes: [
    { zone: "Hat A · CNC torna", note: "6 operatör · yağ buharı · havalandırma yetersiz" },
    { zone: "Hat B · Freze + kaynak", note: "Dar alan · forklift geçişi kısıtlı" },
    { zone: "Sevkiyat rampası", note: "Tek rampa · öğleden sonra yoğunluk" },
    { zone: "Kalite odası", note: "12 m² · sıcaklık kontrolü yok" },
  ],
  fieldJournal: [
    {
      date: "2026-05-18",
      time: "14:32",
      author: "ORTAQ saha",
      type: "observation",
      text: "Hat A'da 4 CNC eşzamanlı çalışıyor. Operatör başına ~2,5 parça/saat verim gözlemlendi.",
    },
    {
      date: "2026-05-18",
      time: "15:10",
      author: "ORTAQ saha",
      type: "inspection",
      text: "Kalite odasında 3 numune parça incelendi. Tolerans dışı 1 parça — hurda kutusuna ayrıldı.",
    },
    {
      date: "2026-05-18",
      time: "16:05",
      author: "ORTAQ saha",
      type: "logistics",
      text: "Sevkiyat alanında 2 palet Almanya etiketli. Ambalaj standardı yeterli, ancak nem bariyeri eksik.",
    },
    {
      date: "2026-05-17",
      time: "11:20",
      author: "M. Karat",
      type: "founder",
      text: "İkinci freze hattı olmadan Avrupa siparişlerini büyütemeyiz. Mevcut kuyruk bizi sınırlıyor.",
    },
    {
      date: "2026-05-16",
      time: "09:45",
      author: "ORTAQ saha",
      type: "capacity",
      text: "Kapasite raporu alındı. Mevcut hat ayda ~12.000 parça — ikinci hat +%60 kapasite potansiyeli.",
    },
  ],
  inspectionLayers: [
    { layer: "Belge paketi", status: "partial", note: "2024 yönetim raporu inceleniyor" },
    { layer: "Saha doğrulama", status: "partial", note: "Üretim hattı ziyareti tamamlandı, tutanak yazılıyor" },
    { layer: "Kalite protokolü", status: "partial", note: "İlk ölçüm prosedürü doğrulandı" },
    { layer: "Finansal inceleme", status: "pending", note: "Saha sonrası başlayacak" },
    { layer: "Hukuk", status: "pending", note: "Ortaklık yapısı taslağı bekleniyor" },
  ],
  exportEvolution: [
    { year: 2018, market: "Almanya", note: "İlk distribütör sözleşmesi — tarım makinesi yedek parça" },
    { year: 2020, market: "Irak", note: "İş makinesi parçaları — Irak distribütör ağı" },
    { year: 2022, market: "Kazakistan", note: "OEM tedarik anlaşması — 2 yıllık çerçeve" },
    { year: 2024, market: "Romanya · Bulgaristan", note: "Avrupa doğu pazarları genişlemesi" },
  ],
  operationalUpdates: [
    { date: "2026-05-22", time: "10:15", text: "Kapasite raporu dosyaya eklendi." },
    { date: "2026-05-20", time: "16:40", text: "İhracat fatura özeti (2024) doğrulandı." },
    { date: "2026-05-19", time: "09:02", text: "Fabrika fotoğrafları arşive alındı — 23 kare." },
    { date: "2026-05-18", time: "17:30", text: "Saha ziyareti tamamlandı. Tutanağın taslağı hazırlanıyor." },
  ],
  marketMix: {
    domesticShare: "~%60",
    exportShare: "~%40",
    segments: [
      { label: "OEM tedarik", share: "~%35", note: "Türkiye içi tarım ve iş makinesi üreticileri" },
      { label: "Yedek parça distribütörleri", share: "~%45", note: "Yurtiçi bayi ağı + ihracat kanalları" },
      { label: "Doğrudan ihracat", share: "~%20", note: "Almanya, Irak ve Kazakistan ağırlıklı" },
    ],
  },
  operationalFriction: [
    {
      label: "4140 çelik tedarik gecikmesi",
      category: "supply",
      note: "Tedarikçi teslimatı 4–5 hafta. Stok alanı doluluk ~%85 — acil siparişlerde gecikme riski.",
    },
    {
      label: "Vardiya geçiş kaybı",
      category: "workforce",
      note: "Operatör değişiminde ~15 dk hat duruşu. Usta operatör bağımlılığı — 3 kişi kritik.",
    },
    {
      label: "Avrupa teslim baskısı",
      category: "export",
      note: "Almanya siparişlerinde 6 haftalık lead time. Tek freze hattı kuyruğu ihracat büyümesini sınırlıyor.",
    },
    {
      label: "Doosan torna bakım penceresi",
      category: "equipment",
      note: "6 aylık periyodik bakım Haziran sonu planlandı — 3 gün kapasite kaybı bekleniyor.",
    },
  ],
  gateway: {
    hook: "Konya OSB'de CNC yedek parça üretimi — gelirin ~%40'ı Almanya ve Orta Doğu'ya gidiyor.",
    scale: "47 çalışan · 4.200 m² · ayda ~12.000 parça · 6 ihracat pazarı",
    tension: "Tek freze hattı kuyruğu ihracat büyümesini sınırlıyor — ikinci hat yatırımı gerekçesi.",
  },
};
