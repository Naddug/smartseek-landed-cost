import type { ChoiceOption } from "@/components/shared/SingleChoiceGrid";
import type { ChipOption } from "@/components/shared/ChipSelect";
import { TURKISH_CITIES } from "@/data/onboarding/owner-options";

export const PARTNER_CONTRIBUTION_OPTIONS: ChoiceOption[] = [
  { value: "capital", title: "Sermaye", description: "Yatırım veya finansman katkısı" },
  { value: "operations", title: "Operasyon", description: "Günlük işletme ve süreç yönetimi" },
  { value: "technical", title: "Teknik", description: "Yazılım, altyapı, ürün geliştirme" },
  { value: "growth", title: "Büyüme / Satış", description: "Pazarlama, kanal, büyüme" },
  { value: "production", title: "Üretim", description: "Üretim hattı, tedarik, kapasite" },
  { value: "industry", title: "Sektörel uzmanlık", description: "Deneyim, network, yönlendirme" },
];

export const PARTNER_CATEGORY_OPTIONS: ChipOption[] = [
  { value: "ecommerce", label: "E-Ticaret" },
  { value: "hospitality", label: "Yeme-İçme / Lokasyon" },
  { value: "manufacturing", label: "Üretim" },
  { value: "healthcare", label: "Sağlık" },
  { value: "services", label: "Hizmet" },
  { value: "logistics", label: "Lojistik" },
  { value: "digital", label: "Dijital ürün" },
  { value: "tourism", label: "Turizm" },
];

export const PARTNER_CITY_OPTIONS: ChipOption[] = TURKISH_CITIES.slice(0, 12).map(
  (city) => ({ value: city, label: city })
);

export const PARTNER_EXPERIENCE_OPTIONS: ChipOption[] = [
  { value: "startup", label: "Startup deneyimi" },
  { value: "sme", label: "KOBİ / aile işletmesi" },
  { value: "corporate", label: "Kurumsal geçmiş" },
  { value: "sector", label: "Sektör derinliği" },
  { value: "export", label: "İhracat / büyüme" },
  { value: "ops", label: "Operasyon kurma" },
];

export const ENGAGEMENT_MODE_OPTIONS: ChoiceOption[] = [
  {
    value: "active_operator",
    title: "Aktif operatör",
    description: "Günlük işin içinde, uygulayıcı rol.",
  },
  {
    value: "passive_investor",
    title: "Pasif yatırımcı",
    description: "Sermaye ve strateji; operasyonel günlük katkı sınırlı.",
  },
  {
    value: "both",
    title: "Hibrit",
    description: "Hem sermaye hem belirli alanlarda aktif katkı.",
  },
];

export const CAPITAL_RANGE_OPTIONS: ChipOption[] = [
  { value: "under_250k", label: "250 bin ₺ altı" },
  { value: "250k_1m", label: "250 bin – 1 milyon ₺" },
  { value: "1m_5m", label: "1 – 5 milyon ₺" },
  { value: "5m_plus", label: "5 milyon ₺ üzeri" },
  { value: "non_capital", label: "Sermaye değil, katkı odaklı" },
];

export const PARTNER_STEP_LABELS = [
  { id: "1", label: "Katkı" },
  { id: "2", label: "Sektör" },
  { id: "3", label: "Lokasyon" },
  { id: "4", label: "Özet" },
];
