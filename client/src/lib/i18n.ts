import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

const resources: Record<string, { translation: Record<string, string> }> = {};

// Top languages shown first (geo-popular + Turkish prominent)
export const TOP_LANGUAGES = ["tr", "en", "es", "zh", "de", "fr", "ru", "ar", "ja", "pt"];

// All supported languages (50+)
const ALL_LANG_CODES = [
  ...TOP_LANGUAGES,
  "ko", "it", "nl", "pl", "vi", "id", "hi", "bn", "uk", "cs", "el", "hu", "ro", "sv", "da", "fi", "no", "he", "fa",
  "ms", "ta", "te", "mr", "gu", "kn", "ml", "pa", "si", "my", "km", "lo", "ne", "ur", "sw",
  "am", "ha", "yo", "ig", "zu", "af", "sq", "hy", "az", "be", "bs", "bg", "hr", "ka", "mk",
  "sr", "sk", "sl", "et", "lv", "lt", "mt", "cy", "ga", "is", "lb", "jv", "su", "tl", "xh",
];
const LANGUAGES = Array.from(new Set(ALL_LANG_CODES));

// English (default)
const en: Record<string, string> = {
  "nav.howItWorks": "How It Works",
  "nav.suppliers": "Suppliers",
  "nav.rfq": "Request Quote",
  "nav.pricing": "Pricing",
  "nav.faq": "FAQ",
  "nav.integrations": "Integrations",
  "nav.login": "Log in",
  "nav.tryFree": "Try for Free",
  "nav.dashboard": "Go to Dashboard",
  "hero.badge": "The sourcing intelligence platform for serious buyers",
  "hero.title1": "Find Suppliers.",
  "hero.title2": "Know Costs. Move Fast.",
  "hero.cta": "Start Free Trial",
  "hero.calculator": "Try Free Calculator",
  "footer.tagline": "The AI-powered sourcing platform for professional buyers.",
  "footer.designedFor": "Designed for professional sourcing teams",
  "common.loading": "Loading...",
  "common.error": "Something went wrong",
};

// Turkish - full coverage
const tr: Record<string, string> = {
  "nav.howItWorks": "Nasıl Çalışır",
  "nav.suppliers": "Tedarikçiler",
  "nav.rfq": "Teklif İste",
  "nav.pricing": "Fiyatlandırma",
  "nav.faq": "SSS",
  "nav.integrations": "Entegrasyonlar",
  "nav.login": "Giriş Yap",
  "nav.tryFree": "Ücretsiz Dene",
  "nav.dashboard": "Panele Git",
  "hero.badge": "Dünyanın en güçlü tedarik istihbarat platformu",
  "hero.title1": "Tedarikçi Bulun.",
  "hero.title2": "Maliyetleri Bilin. Hızlı Hareket Edin.",
  "hero.cta": "Ücretsiz Denemeyi Başlat",
  "hero.calculator": "Ücretsiz Hesaplayıcı Dene",
  "footer.tagline": "Profesyonel alıcılar için yapay zeka destekli tedarik platformu.",
  "footer.designedFor": "Profesyonel tedarik ekipleri için tasarlandı",
  "common.loading": "Yükleniyor...",
  "common.error": "Bir şeyler yanlış gitti",
  "integrations.title": "SmartSeek'i Yığınınızla Bağlayın",
  "integrations.subtitle": "Tedarikçileri, RFQ'ları ve maliyetleri satın alma sistemlerinizle senkronize edin.",
  "integrations.supported": "Desteklenen Entegrasyonlar",
  "integrations.connect": "Bağlan",
  "integrations.connected": "Bağlı",
  "stats.suppliers": "Doğrulanmış Tedarikçi",
  "stats.volume": "Analiz Edilen Tedarik Hacmi",
  "stats.countries": "Ülke",
  "stats.uptime": "Platform Çalışma Süresi",
};

// Spanish
const es: Record<string, string> = {
  "nav.howItWorks": "Cómo Funciona",
  "nav.suppliers": "Proveedores",
  "nav.rfq": "Solicitar Cotización",
  "nav.pricing": "Precios",
  "nav.faq": "Preguntas Frecuentes",
  "nav.integrations": "Integraciones",
  "nav.login": "Iniciar Sesión",
  "nav.tryFree": "Probar Gratis",
  "hero.badge": "La plataforma de inteligencia de abastecimiento para compradores serios",
  "hero.title1": "Encuentra Proveedores.",
  "hero.title2": "Conoce Costos. Actúa Rápido.",
  "hero.cta": "Iniciar Prueba Gratuita",
  "hero.calculator": "Probar Calculadora Gratis",
  "footer.tagline": "La plataforma de abastecimiento con IA para compradores profesionales.",
  "footer.designedFor": "Diseñado para equipos de abastecimiento profesionales",
  "common.loading": "Cargando...",
  "common.error": "Algo salió mal",
};

// Russian
const ru: Record<string, string> = {
  "nav.howItWorks": "Как это работает",
  "nav.suppliers": "Поставщики",
  "nav.rfq": "Запросить предложение",
  "nav.pricing": "Цены",
  "nav.faq": "Частые вопросы",
  "nav.integrations": "Интеграции",
  "nav.login": "Войти",
  "nav.tryFree": "Попробовать бесплатно",
  "hero.badge": "Платформа закупочной разведки для серьёзных покупателей",
  "hero.title1": "Найдите поставщиков.",
  "hero.title2": "Знайте затраты. Действуйте быстро.",
  "hero.cta": "Начать бесплатный пробный период",
  "hero.calculator": "Попробовать бесплатный калькулятор",
  "footer.tagline": "Платформа закупок на базе ИИ для профессиональных покупателей.",
  "footer.designedFor": "Создано для профессиональных закупочных команд",
  "common.loading": "Загрузка...",
  "common.error": "Что-то пошло не так",
};

// Chinese
const zh: Record<string, string> = {
  "nav.howItWorks": "如何运作",
  "nav.suppliers": "供应商",
  "nav.rfq": "请求报价",
  "nav.pricing": "定价",
  "nav.faq": "常见问题",
  "nav.integrations": "集成",
  "nav.login": "登录",
  "nav.tryFree": "免费试用",
  "hero.badge": "面向专业买家的采购情报平台",
  "hero.title1": "寻找供应商。",
  "hero.title2": "了解成本。快速行动。",
  "hero.cta": "开始免费试用",
  "hero.calculator": "试用免费计算器",
  "footer.tagline": "面向专业买家的AI驱动采购平台。",
  "footer.designedFor": "为专业采购团队设计",
  "common.loading": "加载中...",
  "common.error": "出了点问题",
};

// Thai
const th: Record<string, string> = {
  "nav.howItWorks": "วิธีการทำงาน",
  "nav.suppliers": "ซัพพลายเออร์",
  "nav.rfq": "ขอใบเสนอราคา",
  "nav.pricing": "ราคา",
  "nav.faq": "คำถามที่พบบ่อย",
  "nav.integrations": "การเชื่อมต่อ",
  "nav.login": "เข้าสู่ระบบ",
  "nav.tryFree": "ลองฟรี",
  "hero.badge": "แพลตฟอร์มข่าวกรองการจัดซื้อสำหรับผู้ซื้อมืออาชีพ",
  "hero.title1": "ค้นหาซัพพลายเออร์",
  "hero.title2": "รู้ต้นทุน เคลื่อนไหวเร็ว",
  "hero.cta": "เริ่มทดลองใช้ฟรี",
  "hero.calculator": "ลองเครื่องคิดเลขฟรี",
  "footer.tagline": "แพลตฟอร์มการจัดซื้อด้วย AI สำหรับผู้ซื้อมืออาชีพ",
  "footer.designedFor": "ออกแบบสำหรับทีมจัดซื้อมืออาชีพ",
  "common.loading": "กำลังโหลด...",
  "common.error": "เกิดข้อผิดพลาด",
};

// French
const fr: Record<string, string> = {
  "nav.howItWorks": "Comment ça marche",
  "nav.suppliers": "Fournisseurs",
  "nav.rfq": "Demander un devis",
  "nav.pricing": "Tarifs",
  "nav.faq": "FAQ",
  "nav.integrations": "Intégrations",
  "nav.login": "Connexion",
  "nav.tryFree": "Essayer gratuitement",
  "hero.badge": "La plateforme d'intelligence d'approvisionnement pour acheteurs sérieux",
  "hero.title1": "Trouvez des fournisseurs.",
  "hero.title2": "Connaissez les coûts. Agissez vite.",
  "hero.cta": "Commencer l'essai gratuit",
  "hero.calculator": "Essayer le calculateur gratuit",
  "footer.tagline": "La plateforme d'approvisionnement IA pour acheteurs professionnels.",
  "footer.designedFor": "Conçu pour les équipes d'approvisionnement professionnelles",
  "common.loading": "Chargement...",
  "common.error": "Une erreur s'est produite",
};

// Arabic (RTL support handled via dir="rtl" on html)
const ar: Record<string, string> = {
  "nav.howItWorks": "كيف يعمل",
  "nav.suppliers": "الموردون",
  "nav.rfq": "طلب عرض سعر",
  "nav.pricing": "الأسعار",
  "nav.faq": "الأسئلة الشائعة",
  "nav.integrations": "التكاملات",
  "nav.login": "تسجيل الدخول",
  "nav.tryFree": "جرب مجاناً",
  "hero.badge": "منصة استخبارات التوريد للمشترين الجادين",
  "hero.title1": "اعثر على الموردين.",
  "hero.title2": "اعرف التكاليف. تحرك بسرعة.",
  "hero.cta": "ابدأ التجربة المجانية",
  "hero.calculator": "جرب الحاسبة المجانية",
  "footer.tagline": "منصة التوريد المدعومة بالذكاء الاصطناعي للمشترين المحترفين.",
  "footer.designedFor": "مصممة لفرق التوريد المحترفة",
  "common.loading": "جاري التحميل...",
  "common.error": "حدث خطأ ما",
};

// German
const de: Record<string, string> = {
  "nav.howItWorks": "So funktioniert's",
  "nav.suppliers": "Lieferanten",
  "nav.rfq": "Angebot anfordern",
  "nav.pricing": "Preise",
  "nav.faq": "FAQ",
  "nav.integrations": "Integrationen",
  "nav.login": "Anmelden",
  "nav.tryFree": "Kostenlos testen",
  "hero.badge": "Die Sourcing-Intelligence-Plattform für professionelle Einkäufer",
  "hero.title1": "Finden Sie Lieferanten.",
  "hero.title2": "Kennen Sie die Kosten. Handeln Sie schnell.",
  "hero.cta": "Kostenlose Testversion starten",
  "hero.calculator": "Kostenlosen Rechner testen",
  "footer.tagline": "Die KI-gestützte Sourcing-Plattform für professionelle Einkäufer.",
  "footer.designedFor": "Entwickelt für professionelle Sourcing-Teams",
  "common.loading": "Loading...",
  "common.error": "Etwas ist schiefgelaufen",
};

// Japanese
const ja: Record<string, string> = {
  "nav.howItWorks": "使い方",
  "nav.suppliers": "サプライヤー",
  "nav.rfq": "見積もり依頼",
  "nav.pricing": "料金",
  "nav.faq": "よくある質問",
  "nav.integrations": "連携",
  "nav.login": "ログイン",
  "nav.tryFree": "無料で試す",
  "hero.badge": "プロのバイヤー向け調達インテリジェンスプラットフォーム",
  "hero.title1": "サプライヤーを見つける。",
  "hero.title2": "コストを把握。迅速に行動。",
  "hero.cta": "無料トライアルを開始",
  "hero.calculator": "無料計算機を試す",
  "footer.tagline": "プロのバイヤー向けAI駆動調達プラットフォーム。",
  "footer.designedFor": "プロの調達チーム向けに設計",
  "common.loading": "読み込み中...",
  "common.error": "エラーが発生しました",
};

// Korean
const ko: Record<string, string> = {
  "nav.howItWorks": "작동 방식",
  "nav.suppliers": "공급업체",
  "nav.rfq": "견적 요청",
  "nav.pricing": "가격",
  "nav.faq": "자주 묻는 질문",
  "nav.integrations": "연동",
  "nav.login": "로그인",
  "nav.tryFree": "무료 체험",
  "hero.badge": "전문 구매자를 위한 소싱 인텔리전스 플랫폼",
  "hero.title1": "공급업체를 찾으세요.",
  "hero.title2": "비용을 파악하세요. 빠르게 행동하세요.",
  "hero.cta": "무료 체험 시작",
  "hero.calculator": "무료 계산기 사용",
  "footer.tagline": "전문 구매자를 위한 AI 기반 소싱 플랫폼.",
  "footer.designedFor": "전문 소싱 팀을 위해 설계되었습니다",
  "common.loading": "로딩 중...",
  "common.error": "오류가 발생했습니다",
};

// Portuguese
const pt: Record<string, string> = {
  "nav.howItWorks": "Como Funciona",
  "nav.suppliers": "Fornecedores",
  "nav.rfq": "Solicitar Cotação",
  "nav.pricing": "Preços",
  "nav.faq": "Perguntas Frequentes",
  "nav.integrations": "Integrações",
  "nav.login": "Entrar",
  "nav.tryFree": "Experimentar Grátis",
  "hero.badge": "A plataforma de inteligência de sourcing para compradores profissionais",
  "hero.title1": "Encontre Fornecedores.",
  "hero.title2": "Conheça os Custos. Aja Rápido.",
  "hero.cta": "Iniciar Teste Gratuito",
  "hero.calculator": "Experimentar Calculadora Gratuita",
  "footer.tagline": "A plataforma de sourcing com IA para compradores profissionais.",
  "footer.designedFor": "Projetado para equipes de sourcing profissionais",
  "common.loading": "Carregando...",
  "common.error": "Algo deu errado",
};

// Italian
const it: Record<string, string> = {
  "nav.howItWorks": "Come Funziona",
  "nav.suppliers": "Fornitori",
  "nav.rfq": "Richiedi Preventivo",
  "nav.pricing": "Prezzi",
  "nav.faq": "Domande Frequenti",
  "nav.integrations": "Integrazioni",
  "nav.login": "Accedi",
  "nav.tryFree": "Prova Gratis",
  "hero.badge": "La piattaforma di intelligence sourcing per acquirenti professionisti",
  "hero.title1": "Trova Fornitori.",
  "hero.title2": "Conosci i Costi. Agisci Velocemente.",
  "hero.cta": "Inizia Prova Gratuita",
  "hero.calculator": "Prova Calcolatrice Gratuita",
  "footer.tagline": "La piattaforma di sourcing con IA per acquirenti professionisti.",
  "footer.designedFor": "Progettata per team di sourcing professionali",
  "common.loading": "Caricamento...",
  "common.error": "Qualcosa è andato storto",
};

// Dutch
const nl: Record<string, string> = {
  "nav.howItWorks": "Hoe het werkt",
  "nav.suppliers": "Leveranciers",
  "nav.rfq": "Offerte Aanvragen",
  "nav.pricing": "Prijzen",
  "nav.faq": "Veelgestelde Vragen",
  "nav.integrations": "Integraties",
  "nav.login": "Inloggen",
  "nav.tryFree": "Gratis Proberen",
  "hero.badge": "Het sourcing intelligence platform voor professionele inkopers",
  "hero.title1": "Vind Leveranciers.",
  "hero.title2": "Ken de Kosten. Handel Snel.",
  "hero.cta": "Start Gratis Proefperiode",
  "hero.calculator": "Probeer Gratis Calculator",
  "footer.tagline": "Het AI-gestuurde sourcing platform voor professionele inkopers.",
  "footer.designedFor": "Ontworpen voor professionele sourcing teams",
  "common.loading": "Laden...",
  "common.error": "Er is iets misgegaan",
};

// Polish
const pl: Record<string, string> = {
  "nav.howItWorks": "Jak to działa",
  "nav.suppliers": "Dostawcy",
  "nav.rfq": "Zapytaj o ofertę",
  "nav.pricing": "Cennik",
  "nav.faq": "FAQ",
  "nav.integrations": "Integracje",
  "nav.login": "Zaloguj się",
  "nav.tryFree": "Wypróbuj za darmo",
  "hero.badge": "Platforma inteligencji zakupowej dla profesjonalnych kupujących",
  "hero.title1": "Znajdź dostawców.",
  "hero.title2": "Poznaj koszty. Działaj szybko.",
  "hero.cta": "Rozpocznij bezpłatny okres próbny",
  "hero.calculator": "Wypróbuj darmowy kalkulator",
  "footer.tagline": "Platforma zakupowa AI dla profesjonalnych kupujących.",
  "footer.designedFor": "Zaprojektowana dla profesjonalnych zespołów zakupowych",
  "common.loading": "Ładowanie...",
  "common.error": "Coś poszło nie tak",
};

// Vietnamese
const vi: Record<string, string> = {
  "nav.howItWorks": "Cách hoạt động",
  "nav.suppliers": "Nhà cung cấp",
  "nav.rfq": "Yêu cầu báo giá",
  "nav.pricing": "Bảng giá",
  "nav.faq": "Câu hỏi thường gặp",
  "nav.integrations": "Tích hợp",
  "nav.login": "Đăng nhập",
  "nav.tryFree": "Dùng thử miễn phí",
  "hero.badge": "Nền tảng thông minh sourcing cho người mua chuyên nghiệp",
  "hero.title1": "Tìm nhà cung cấp.",
  "hero.title2": "Biết chi phí. Hành động nhanh.",
  "hero.cta": "Bắt đầu dùng thử miễn phí",
  "hero.calculator": "Dùng thử máy tính miễn phí",
  "footer.tagline": "Nền tảng sourcing AI cho người mua chuyên nghiệp.",
  "footer.designedFor": "Thiết kế cho đội ngũ sourcing chuyên nghiệp",
  "common.loading": "Đang tải...",
  "common.error": "Đã xảy ra lỗi",
};

// Indonesian
const id: Record<string, string> = {
  "nav.howItWorks": "Cara Kerja",
  "nav.suppliers": "Pemasok",
  "nav.rfq": "Minta Penawaran",
  "nav.pricing": "Harga",
  "nav.faq": "Pertanyaan Umum",
  "nav.integrations": "Integrasi",
  "nav.login": "Masuk",
  "nav.tryFree": "Coba Gratis",
  "hero.badge": "Platform intelijen sourcing untuk pembeli profesional",
  "hero.title1": "Temukan Pemasok.",
  "hero.title2": "Ketahui Biaya. Bergerak Cepat.",
  "hero.cta": "Mulai Uji Coba Gratis",
  "hero.calculator": "Coba Kalkulator Gratis",
  "footer.tagline": "Platform sourcing AI untuk pembeli profesional.",
  "footer.designedFor": "Dirancang untuk tim sourcing profesional",
  "common.loading": "Memuat...",
  "common.error": "Terjadi kesalahan",
};

// Hindi
const hi: Record<string, string> = {
  "nav.howItWorks": "कैसे काम करता है",
  "nav.suppliers": "आपूर्तिकर्ता",
  "nav.rfq": "कोटेशन अनुरोध",
  "nav.pricing": "मूल्य निर्धारण",
  "nav.faq": "सामान्य प्रश्न",
  "nav.integrations": "एकीकरण",
  "nav.login": "लॉग इन",
  "nav.tryFree": "मुफ्त में आज़माएं",
  "hero.badge": "पेशेवर खरीदारों के लिए सोर्सिंग इंटेलिजेंस प्लेटफॉर्म",
  "hero.title1": "आपूर्तिकर्ता खोजें।",
  "hero.title2": "लागत जानें। तेज़ी से कार्य करें।",
  "hero.cta": "मुफ्त परीक्षण शुरू करें",
  "hero.calculator": "मुफ्त कैलकुलेटर आज़माएं",
  "footer.tagline": "पेशेवर खरीदारों के लिए AI-संचालित सोर्सिंग प्लेटफॉर्म।",
  "footer.designedFor": "पेशेवर सोर्सिंग टीमों के लिए डिज़ाइन किया गया",
  "common.loading": "लोड हो रहा है...",
  "common.error": "कुछ गलत हो गया",
};

// Merge all - fallback to English for missing keys
const translations: Record<string, Record<string, string>> = {
  en, tr, es, ru, zh, th, fr, ar, de, ja, ko, pt, it, nl, pl, vi, id, hi,
  bn: en, uk: en, cs: en, el: en, hu: en, ro: en, sv: en, da: en, fi: en, no: en, he: en, fa: en,
  ms: en, ta: en, te: en, mr: en, gu: en, kn: en, ml: en, pa: en, si: en, my: en, km: en,
  lo: en, ne: en, ur: en, sw: en, am: en, ha: en, yo: en, ig: en, zu: en, af: en, sq: en,
  hy: en, az: en, be: en, bs: en, bg: en, hr: en, ka: en, mk: en, sr: en, sk: en, sl: en,
  et: en, lv: en, lt: en, mt: en, cy: en, ga: en, is: en, lb: en,
};

for (const lang of LANGUAGES) {
  resources[lang] = { translation: translations[lang] || en };
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    supportedLngs: LANGUAGES,
    interpolation: { escapeValue: false },
    detection: {
      order: ["querystring", "localStorage", "navigator", "htmlTag"],
      lookupQuerystring: "lang",
      lookupLocalStorage: "i18nextLng",
      caches: ["localStorage"],
    },
  });

// Update html lang and dir (RTL for Arabic) when language changes
i18n.on("languageChanged", (lng) => {
  const html = document.documentElement;
  const code = lng.split("-")[0];
  html.lang = lng;
  html.dir = code === "ar" ? "rtl" : "ltr";
});

export default i18n;
export { LANGUAGES };
