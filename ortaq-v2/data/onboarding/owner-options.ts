import type { ChoiceOption } from "@/components/shared/SingleChoiceGrid";

export const CATEGORY_OPTIONS: ChoiceOption[] = [
  { value: "digital", title: "Dijital Ürün / Uygulama" },
  { value: "ecommerce", title: "E-Ticaret" },
  { value: "physical_location", title: "Fiziksel Mağaza / Lokasyon" },
  { value: "manufacturing", title: "Üretim / Atölye" },
  { value: "services", title: "Hizmet İşletmesi" },
  { value: "food_cafe", title: "Gıda & Kafe" },
  { value: "health", title: "Sağlık & Klinik" },
  { value: "education", title: "Eğitim & Kurs" },
  { value: "logistics", title: "Lojistik & Depo" },
  { value: "agriculture", title: "Tarım" },
  { value: "tourism", title: "Turizm" },
  { value: "other", title: "Diğer" },
];

export const STAGE_OPTIONS: ChoiceOption[] = [
  {
    value: "not_started",
    title: "Bir şey var, ama henüz başlanmadı",
    description: "Varlık veya fikir mevcut; operasyon henüz kurulmadı.",
  },
  {
    value: "stuck",
    title: "Başlandı ama bir yerde takıldı",
    description: "İş veya proje yarıda; net bir engel var.",
  },
  {
    value: "cant_grow",
    title: "Çalışıyor ama büyüyemiyor",
    description: "Temel yapı var; büyüme veya yapılandırma eksik.",
  },
  {
    value: "needs_structure",
    title: "Büyüyor, yapılandırma gerekiyor",
    description: "Talep var; süreç, ekip veya ortaklık yapısı net değil.",
  },
  {
    value: "ready_for_partner",
    title: "Hazır, doğru ortak bekleniyor",
    description: "Dosya olgun; uygun ortakla hızlanmaya hazır.",
  },
];

export const ASSET_OPTIONS = [
  { value: "company", label: "Şirket / tüzel kişilik" },
  { value: "location", label: "Fiziksel lokasyon" },
  { value: "website", label: "Web sitesi / uygulama" },
  { value: "customers", label: "Müşteri tabanı" },
  { value: "brand", label: "Marka / trademark" },
  { value: "equipment", label: "Ekipman / makine" },
  { value: "inventory", label: "Stok / envanter" },
  { value: "revenue", label: "Gelir / ciro" },
  { value: "supplier", label: "Tedarikçi anlaşması" },
  { value: "prototype", label: "Prototip / MVP" },
  { value: "team", label: "Çalışan / ekip" },
  { value: "patent", label: "Patent / lisans" },
];

export const BLOCKER_OPTIONS = [
  { value: "technical", label: "Teknik tamamlama sorunu var" },
  { value: "operations", label: "Operasyon yürütecek biri yok" },
  { value: "growth", label: "Büyüme / satış yolu bulunamıyor" },
  { value: "capital", label: "Sermayem yetersiz" },
  { value: "concept", label: "Konsept / iş modeli belirsiz" },
  { value: "partner_left", label: "Ortağım ayrıldı" },
  { value: "productization", label: "Ürünleştirme yapılamıyor" },
  { value: "legal", label: "Yasal / lisans sorunu var" },
  { value: "supply", label: "Tedarik / üretim kısmı eksik" },
  { value: "go_to_market", label: "Pazara açılma yolu yok" },
];

export const PARTNER_TYPE_OPTIONS = [
  { value: "capital", label: "Sermaye Ortağı" },
  { value: "operator", label: "İşletme Ortağı" },
  { value: "technical", label: "Teknik Ortak" },
  { value: "growth", label: "Büyüme Ortağı" },
  { value: "industry", label: "Sektör Ortağı" },
  { value: "production", label: "Üretim / Tedarik Ortağı" },
];

export const TIME_COMMITMENT_OPTIONS = [
  { value: "full_time", label: "Tam zamanlı" },
  { value: "part_time", label: "Yarı zamanlı" },
  { value: "advisor", label: "Danışman düzeyi" },
  { value: "as_needed", label: "Gerektiğinde" },
];

export const CONTRIBUTION_OPTIONS = [
  { value: "management", label: "Genel yönetim" },
  { value: "technical", label: "Teknik geliştirme" },
  { value: "sales", label: "Satış & pazarlama" },
  { value: "supply", label: "Tedarik yönetimi" },
  { value: "finance", label: "Finans kontrolü" },
  { value: "crm", label: "Müşteri ilişkileri" },
  { value: "team_lead", label: "Ekip yönetimi" },
];

export const RETURN_MODEL_OPTIONS: ChoiceOption[] = [
  { value: "equity", title: "Hisse / ortaklık" },
  { value: "profit_share", title: "Kâr payı" },
  { value: "revenue_share", title: "Gelir paylaşımı" },
  { value: "salary_equity", title: "Maaş + hisse" },
  { value: "operating_rights", title: "İşletme hakkı" },
  { value: "negotiable", title: "Tamamen görüşmeye açık" },
];

export const VISIBILITY_OPTIONS: ChoiceOption[] = [
  {
    value: "public",
    title: "Herkese Açık",
    description:
      "Temel bilgiler platformda görünür. Hassas detaylar yine kontrollü paylaşılır.",
  },
  {
    value: "restricted",
    title: "Kısıtlı",
    description:
      "Dosya listelenir; belgeler ve detaylar yalnızca uygun eşleşmelere açılır.",
  },
  {
    value: "private",
    title: "Tamamen Gizli",
    description:
      "Genel listede görünmez. ORTAQ uygun ortaklara yönlendirme yapar.",
  },
];

export const EVIDENCE_TAGS = [
  { value: "location_photo", label: "Lokasyon fotoğrafı" },
  { value: "product_demo", label: "Ürün demosu" },
  { value: "revenue_data", label: "Ciro verisi" },
  { value: "contract", label: "Sözleşme" },
  { value: "lease", label: "Kira belgesi" },
  { value: "other", label: "Diğer" },
];

export const TURKISH_CITIES = [
  "Adana",
  "Ankara",
  "Antalya",
  "Bursa",
  "Denizli",
  "Eskişehir",
  "Gaziantep",
  "İstanbul",
  "İzmir",
  "Kayseri",
  "Kocaeli",
  "Konya",
  "Mersin",
  "Samsun",
  "Trabzon",
  "Diğer",
];

export const REVENUE_RANGES = [
  { value: "0-50k", label: "0 – 50.000 TL / ay" },
  { value: "50k-200k", label: "50.000 – 200.000 TL / ay" },
  { value: "200k+", label: "200.000 TL+ / ay" },
];

export const TEAM_SIZES = [
  { value: "1-3", label: "1–3 kişi" },
  { value: "4-10", label: "4–10 kişi" },
  { value: "11+", label: "11+ kişi" },
];

export const LOCATION_TENURE = [
  { value: "tenant", label: "Kiracı" },
  { value: "owner", label: "Malik" },
];

export function labelFor(
  options: { value: string; label?: string; title?: string }[],
  value: string
): string {
  const found = options.find((o) => o.value === value);
  return found?.label ?? found?.title ?? value;
}
