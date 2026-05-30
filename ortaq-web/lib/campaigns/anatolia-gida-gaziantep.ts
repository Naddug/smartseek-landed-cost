import type { SimulatedCampaign } from "./types";

/**
 * Simulated dossier, Gaziantep food processor (bulgur, baklagil, salça).
 *
 * ASYMMETRY PROFILE: operationally strained, capacity-constrained.
 * Real export traction (Mid-East, Saudi, Iraq, Africa) but the factory
 * is at physical limit; refrigeration aged, packaging hand-fed, water
 * treatment under-spec'd for the volume being pushed through it.
 *
 * HUMAN-EDIT REQUIRED before publishing:
 *  - founder.name / role / note
 *  - machines[*].name (model numbers are plausible illustrative defaults)
 *  - funding.targetTry and amountTry per line
 *  - annualRevenueNote final wording
 */
export const anatoliaGidaGaziantep: SimulatedCampaign = {
  slug: "anatolia-gida-gaziantep",
  simulated: true,
  legalName: "Şahin Gıda Sanayi ve Ticaret A.Ş.",
  tradeName: "Şahin Gıda",
  sector: "Bulgur, baklagil ve salça · gıda işleme",
  city: "Gaziantep",
  region: "4. Organize Sanayi Bölgesi, Şehitkamil",
  founded: 2003,
  employees: 84,
  exportMarkets: ["Irak", "Suudi Arabistan", "Birleşik Arap Emirlikleri", "Cezayir", "Senegal", "Mısır"],
  annualRevenueNote: "2024 ciro raporu mevcut · bağımsız denetim yok · stok envanteri çeyreklik tutuluyor",
  productionNote: "Aylık ~1.450 ton bulgur · ~380 ton paketli baklagil · ~95 ton salça (mevcut hat doluluğu yaklaşık %95)",
  verificationLabel: "under_review",
  reviewStatus: "preliminary_review",
  seoTitle: "Şahin Gıda | Değerlendirme dosyası",
  seoDescription:
    "Gaziantep 4. OSB'de bulgur, baklagil ve salça üreticisi. Değerlendirme dosyası, yatırım teklifi değildir.",
  story: {
    origin:
      "2003'te Gaziantep'te üç aile ortağı tarafından kuruldu. Bölgenin tahıl ve baklagil tarımına yakınlığını kullanarak küçük ölçekli bulgur üretimiyle başladı; ilk yıllar yurtiçi toptancılar.",
    today:
      "4. OSB'de 9.200 m² kapalı alanda çalışıyor. Üretimin yaklaşık üçte ikisi ihracat, Irak ve Suudi Arabistan ağırlıklı, son üç yılda Kuzey Afrika pazarına genişleme başladı. Helal sertifikası ve BRC Food güvencesi mevcut.",
    production:
      "Tahıl alımı → temizleme ve eleme → ön pişirme (bulgur) / haşlama (baklagil) → kurutma → paketleme → ihracat sevkiyatı. Salça hattı ayrı binada: domates alımı → soyma → konsantre → konserve · 25 g - 4,5 kg ambalaj.",
  },
  founder: {
    name: "Halil Şahin",
    role: "Yönetici ortak · Operasyon direktörü",
    note:
      "Açık konuşayım: fabrika kapasitemiz üstünde çalışıyor. İhracat siparişlerini kaçırmamak için iki vardiyayı zorlama, üçüncü vardiyaya kısmi geçtik, sürdürülebilir değil. İkinci paketleme hattı ve yeni soğuk hava ünitesi olmadan büyüyemeyiz, sıkışırsak kaliteyi kaybetme riski var.",
  },
  funding: {
    purpose:
      "İkinci paketleme hattı (otomatik dolum + metal detektör + etiket), yeni soğuk hava ünitesi (salça stoku), ve atıksu arıtma tesisinin kapasite yükseltmesi. Hedef: günlük paketleme kapasitesini %55 artırmak, sezon-dışı salça stoğunu güvenli aralıkta tutmak.",
    targetTry: 14_800_000,
    lines: [
      { label: "İkinci paketleme hattı (otomatik dolum + metal dedektör)", amountTry: 5_400_000, percent: 36 },
      { label: "Soğuk hava ünitesi (salça stoğu · 600 m³)", amountTry: 3_200_000, percent: 22 },
      { label: "Atıksu arıtma kapasite artışı", amountTry: 2_100_000, percent: 14 },
      { label: "Ham tahıl ve baklagil stoku (4 ay)", amountTry: 2_400_000, percent: 16 },
      { label: "Forklift filosu yenileme (3 araç)", amountTry: 950_000, percent: 6 },
      { label: "İşletme sermayesi tamponu", amountTry: 750_000, percent: 5 },
    ],
  },
  risks: [
    {
      title: "Kapasite üstü çalışma",
      text: "Mevcut hat doluluğu %95 üstünde. Üretim arızası veya operatör eksikliği ihracat siparişlerini ciddi geciktirebilir. Yedek hat yok.",
    },
    {
      title: "İhracat pazar yoğunlaşması",
      text: "Gelirin yaklaşık %52'si Irak ve Suudi Arabistan'a bağlı. Sınır kapısı kapanması veya gümrük değişikliği nakit akışını sert etkileyebilir.",
    },
    {
      title: "Ham madde sezonsallığı",
      text: "Domates ve buğday alımları yılda 3-4 aylık pencerelerde yapılıyor. Stok yatırımı yüksek; depo kapasitesi bu hacme tam yeterli değil.",
    },
    {
      title: "Atıksu uyumluluğu",
      text: "Mevcut arıtma tesisi son ÇED denetiminde 'kapasite artışı gerekir' uyarısı aldı. Yatırım yapılmazsa idari ceza riski mevcut.",
    },
    {
      title: "Helal/BRC sertifikasyon devamlılığı",
      text: "İhracat müşterilerinin çoğu helal/BRC zorunlu. Sertifika yenilemelerinde denetim sonucu olumsuzsa pazar kaybı ani olur.",
    },
  ],
  process: [
    { label: "Ön başvuru ve sektör uygunluğu", status: "done", date: "2026-03-04" },
    { label: "Belge paketi (ticaret sicili, vergi, finansal tablo)", status: "done", date: "2026-04-10" },
    { label: "Saha ziyareti, üretim ve depo", status: "active", date: "2026-05-21" },
    { label: "Finansal ve hukuk incelemesi", status: "pending" },
    { label: "Yatırım komitesi", status: "pending" },
    { label: "Lisanslı platform onayı", status: "pending" },
    { label: "Bilgi formu yayını ve ortaklık", status: "pending" },
  ],
  documents: [
    { id: "registry", title: "Ticaret sicil gazetesi", status: "available" },
    { id: "tax", title: "Vergi levhası ve mukellef özeti", status: "available" },
    { id: "financials-2023", title: "2023 yönetim raporu", status: "available", note: "Mali müşavir onaylı · bağımsız denetim yok" },
    { id: "financials-2024", title: "2024 yönetim raporu", status: "review" },
    { id: "export-summary", title: "İhracat fatura özeti (2022-2024)", status: "available" },
    { id: "halal", title: "Helal sertifikası", status: "available", note: "GIMDES · 2025 yenileme süreci" },
    { id: "brc", title: "BRC Food sertifikası", status: "review", note: "Yıllık denetim Haziran 2026" },
    { id: "ced", title: "ÇED raporu ve atıksu uyumluluk yazısı", status: "review", note: "Kapasite artışı uyarısı dahil" },
    { id: "photos", title: "Fabrika ve hat fotoğrafları", status: "available" },
    { id: "field-report", title: "Saha ziyareti tutanağı", status: "pending", note: "Ziyaret tamamlanınca" },
    { id: "memorandum", title: "Bilgi formu (izahname)", status: "pending", note: "Komite onayı sonrası" },
  ],
  economics: [
    { label: "Kuruluş", value: "2003" },
    { label: "Çalışan", value: "84 kişi (mevsimsel +20)" },
    { label: "Kapalı alan", value: "9.200 m²" },
    { label: "İhracat pazarları", value: "6 ülke" },
    { label: "Ana müşteri tipi", value: "İthalat dağıtıcıları · büyük marketler · kurumsal toptan" },
    { label: "Sertifikasyon", value: "Helal · BRC Food · ISO 22000" },
  ],
  operations: {
    signals: [
      { label: "Aylık kapasite", value: "~1.450 t bulgur" },
      { label: "Hat doluluğu", value: "~%95 (kritik)" },
      { label: "Vardiya", value: "2 vardiya + kısmi 3. vardiya" },
      { label: "İhracat payı", value: "Gelirin ~%68'i" },
      { label: "Soğuk depo", value: "320 m³ (yetersiz)" },
      { label: "Son saha ziyareti", value: "21 Mayıs 2026" },
    ],
    processes: ["Tahıl alım", "Temizleme · eleme", "Ön pişirme · haşlama", "Kurutma", "Paketleme", "Sevkiyat"],
    materials: ["Sert buğday (Gaziantep, Şanlıurfa)", "Mercimek, nohut (Mersin, Gaziantep)", "Salçalık domates (sezon · Hatay, Gaziantep)"],
    shifts: "2 ana vardiya · 06:00-22:00 · sezonda 3. vardiya kısmi (22:00-02:00)",
  },
  timeline: [
    { year: 2003, event: "Tek hat bulgur üretimi, yurtiçi toptan" },
    { year: 2008, event: "Baklagil paketleme hattı eklendi" },
    { year: 2012, event: "İlk ihracat, Irak distribütörü" },
    { year: 2016, event: "Salça hattı devreye · ayrı bina" },
    { year: 2019, event: "BRC Food sertifikasyonu" },
    { year: 2022, event: "Suudi Arabistan büyük market zinciri sözleşmesi" },
    { year: 2024, event: "Hat kapasitesi kritik · ikinci paketleme yatırım kararı" },
    { year: 2026, event: "ORTAQ değerlendirme süreci" },
  ],
  access: {
    status: "preliminary",
    nextGate: "Finansal ve hukuk incelemesi",
  },
  machines: [
    {
      id: "cleaner-bank",
      name: "Bühler MTRC eleme sistemi",
      role: "Tahıl temizleme",
      year: 2014,
      note: "Sürekli çalışıyor · filtre değişimi 2 haftada bir · arıza geçmişi düşük.",
    },
    {
      id: "cooker-line-a",
      name: "Pavan haşlama kazanı ×3",
      role: "Bulgur ön pişirme",
      year: 2011,
      note: "Hat doluluğu kritik · paslanmaz çelik gövde durumu iyi · enerji verimi düşük (yatırım planında değil).",
    },
    {
      id: "dryer-line",
      name: "Bühler kuşak kurutma",
      role: "Kurutma · 2 hat",
      year: 2017,
      note: "Termal sensör 2024'te değişti · kalibrasyon iyi.",
    },
    {
      id: "packer-old",
      name: "Multivac otomatik paketleme",
      role: "Paketleme · 25g-5kg",
      year: 2012,
      note: "Tek hat · darboğaz · metal dedektör eski model · ikinci hat yatırım planının %36'sı.",
    },
    {
      id: "tomato-line",
      name: "Rossi & Catelli salça hattı",
      role: "Salça üretim · sezonluk",
      year: 2016,
      note: "Sadece Ağustos-Kasım çalışır · konserve dolum otomatik · kavanoz dolum yarı-otomatik.",
    },
    {
      id: "cold-room",
      name: "Daikin soğuk hava ünitesi",
      role: "Salça konserve stok",
      year: 2009,
      note: "320 m³ · sezonsalça stoğu için yetersiz · yatırım planında yeni 600 m³ ünite.",
    },
    {
      id: "wastewater",
      name: "Atıksu arıtma · kapasiteli",
      role: "Üretim atıksu",
      year: 2010,
      note: "ÇED kapasite artışı uyarısı 2024 · yatırım planının %14'ü bu kalem.",
    },
  ],
  bottlenecks: [
    {
      label: "Tek paketleme hattı",
      note: "Salça dahil tüm paketleme bu hattan geçiyor. Hat arızasında ihracat siparişleri durur, yedek yok.",
    },
    {
      label: "Soğuk depo kapasitesi",
      note: "Sezonsalça stoğu için 320 m³ yetersiz · sezon sonunda %110 doluluk yaşanıyor (ambar dışına geçici çıkarma).",
    },
    {
      label: "Atıksu arıtma",
      note: "Mevcut tesis kapasite artırımı uyarısı aldı. Yatırım yapılmazsa idari sorun riski.",
    },
    {
      label: "Sezon işgücü",
      note: "Sezonda +20 işçi alımı zor, bölge tarım hasadı ile çakışıyor. Vardiya boşlukları sık.",
    },
  ],
  facilityNotes: [
    { zone: "Bulgur hattı · ön pişirme", note: "Yüksek nem · buhar borularında ısı yalıtımı yıpranmış" },
    { zone: "Kurutma hattı", note: "Termal sensörler değişti · zemin kayma riski sezonda dikkat gerektiriyor" },
    { zone: "Paketleme alanı", note: "Tek hat · ikinci hat için zemin hazır · elektrik altyapısı yeterli" },
    { zone: "Soğuk depo (salça)", note: "Sezon sonunda doluluk %110 · paletler kapı önüne taşıyor" },
    { zone: "Atıksu arıtma", note: "ÇED uyarısı dosyada · kapasite artışı yatırım planında" },
    { zone: "İhracat sevkiyat", note: "İki rampa · Irak konteynerleri sabah, Suudi konteynerleri öğleden sonra" },
  ],
  fieldJournal: [
    {
      date: "2026-05-21",
      time: "08:30",
      author: "ORTAQ saha",
      type: "observation",
      text: "Sabah vardiyası başlangıcı. Bulgur hattı tam doluluk; operatör 4 dakika önce başlamış. Paketleme hattında 12 kişilik manuel besleme, otomasyon eksikliği belirgin.",
    },
    {
      date: "2026-05-21",
      time: "10:15",
      author: "ORTAQ saha",
      type: "inspection",
      text: "BRC denetim hazırlık dosyaları incelendi. Sıcaklık kayıt cetvelleri 14 günlük periyot eksik, sezon yoğunluğu sebebiyle vardiya kayıtları aksamış. Kalite müdürü farkında, plan dahilinde.",
    },
    {
      date: "2026-05-21",
      time: "13:40",
      author: "ORTAQ saha",
      type: "capacity",
      text: "Paketleme hattı önünde 4 paletlik tampon birikmiş. Hat hızı 24 paket/dk · sezon ortalaması 19. Operatör yorgunluk şikayetinde bulundu.",
    },
    {
      date: "2026-05-21",
      time: "15:25",
      author: "ORTAQ saha",
      type: "logistics",
      text: "İhracat rampasında 1 konteyner Irak yüklemesi yapılıyor · 1 konteyner Senegal hazırlığında. Şirket beyan ettiği sevkiyat sıklığı doğrulandı.",
    },
    {
      date: "2026-05-21",
      time: "16:50",
      author: "Şahin",
      type: "founder",
      text: "Görüyorsunuz, bu kapasiteyle bir yıl daha gidebiliriz ama hat arızasında çıkış yok. Komiteye en geç Eylül'de girmek istiyoruz.",
    },
    {
      date: "2026-05-21",
      time: "17:30",
      author: "ORTAQ saha",
      type: "inspection",
      text: "Atıksu arıtma çıkış pH ölçümü alındı, uyumlu sınırda · son ÇED uyarısı kapasite yetersizliğine vurgu yapıyor. Tutanağa eklendi.",
    },
  ],
  inspectionLayers: [
    { layer: "Belge paketi", status: "done", note: "2024 raporu inceleniyor; ana paket tam" },
    { layer: "Saha doğrulama", status: "partial", note: "Üretim ziyareti yapıldı; tutanak hazırlanıyor" },
    { layer: "Kalite protokolü", status: "partial", note: "BRC sıcaklık kayıt eksiği not edildi · kalite müdürü ile aksiyon planı yazıldı" },
    { layer: "Finansal inceleme", status: "pending", note: "Saha tamamlanınca başlayacak" },
    { layer: "Hukuk", status: "pending", note: "Ortaklık yapısı 3 ortaklı, devir prosedürü taslağı bekleniyor" },
    { layer: "Çevre / ÇED uyumluluk", status: "partial", note: "ÇED kapasite uyarısı dosyada · yatırım planı çözüyor" },
  ],
  exportEvolution: [
    { year: 2012, market: "Irak", note: "İlk ihracat, bulgur · distribütör ağı 12 şehir" },
    { year: 2015, market: "Birleşik Arap Emirlikleri", note: "Süpermarket zinciri · özel etiket dahil" },
    { year: 2019, market: "Mısır · Cezayir", note: "Sınırlı hacim · helal sertifikası anahtar oldu" },
    { year: 2022, market: "Suudi Arabistan", note: "Büyük marketler zinciri · 3 yıllık çerçeve anlaşma" },
    { year: 2024, market: "Senegal", note: "Yeni pazar açılışı · küçük hacim, marj iyi" },
  ],
  operationalUpdates: [
    { date: "2026-05-23", time: "11:30", text: "Saha ziyareti tutanağı taslağı kalite müdürüne paylaşıldı." },
    { date: "2026-05-21", time: "18:10", text: "Saha ziyareti tamamlandı. 6 kayıt fieldJournal'a aktarıldı." },
    { date: "2026-05-15", time: "09:45", text: "ÇED uyarısı ve atıksu yatırım planı detayları belgeye eklendi." },
    { date: "2026-05-09", time: "14:20", text: "İhracat fatura özeti 2022-2024 doğrulandı." },
    { date: "2026-04-28", time: "10:00", text: "BRC denetim takvimi alındı, Haziran 2026 yıllık denetim onaylı." },
  ],
  marketMix: {
    domesticShare: "~%32",
    exportShare: "~%68",
    segments: [
      { label: "İhracat · Irak", share: "~%28", note: "Distribütör ağı · 12 şehir · bulgur ve baklagil ağırlıklı" },
      { label: "İhracat · Suudi Arabistan", share: "~%24", note: "Büyük market zinciri · 3 yıllık çerçeve sözleşme" },
      { label: "İhracat · BAE + Kuzey Afrika", share: "~%16", note: "Mısır, Cezayir, Senegal · büyüyen kanal" },
      { label: "Yurtiçi marketler", share: "~%18", note: "Ulusal zincir markası · özel etiket dahil" },
      { label: "Yurtiçi toptan", share: "~%14", note: "Gaziantep, Mersin, Adana hali ağı" },
    ],
  },
  operationalFriction: [
    {
      label: "Paketleme hattı tek noktada darboğaz",
      category: "capacity",
      note: "Tek otomatik paketleme hattı tüm SKU'lara servis veriyor. Format değişikliği saatte ~25 dk kayıp. İkinci hat yatırımın temel kalemi.",
    },
    {
      label: "Soğuk depo doluluk %110 (sezon sonu)",
      category: "capacity",
      note: "Salça stoku sezon dışında müşteri talebine yetmiyor · ek depo kiralanması maliyet ve sertifikasyon zorluğu.",
    },
    {
      label: "Sezon işgücü dalgalanması",
      category: "workforce",
      note: "Ağustos-Kasım +20 işçi · tarım hasadıyla çakışıyor · son iki yıl iki kez vardiya açığı.",
    },
    {
      label: "Irak gümrük süre belirsizliği",
      category: "export",
      note: "Habur ve İbrahim Halil sınır kapılarında ortalama 36 saat · zaman zaman 4-5 güne çıkıyor. Sevkiyat planlamasını zorluyor.",
    },
    {
      label: "Eski paketleme metal dedektör",
      category: "equipment",
      note: "2012 model · son 6 ayda 3 yanlış pozitif · yedek parça stoğunda sınır.",
    },
  ],
  gateway: {
    hook: "Gaziantep'te bulgur ve salça, Ortadoğu ihracatı %95 doluluk hattı zorluyor.",
    scale: "84 çalışan · tek paketleme hattı · ~1.450 ton/ay bulgur",
    tension: "Salça dahil tüm paketleme tek hattan, arıza durumunda ihracat durur, yedek yok.",
  },
};