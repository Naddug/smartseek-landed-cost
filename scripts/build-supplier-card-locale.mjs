#!/usr/bin/env node
/**
 * Generates supplier card i18n keys (industries, taglines, products) for all locales.
 * Run: node scripts/build-supplier-card-locale.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const localesDir = path.join(root, "client/public/locales");
const featuredPath = path.join(root, "server/data/featured-suppliers.json");

function slug(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
}

function loadJson(loc) {
  return JSON.parse(fs.readFileSync(path.join(localesDir, loc, "translation.json"), "utf8"));
}

function writeJson(loc, data) {
  fs.writeFileSync(path.join(localesDir, loc, "translation.json"), JSON.stringify(data, null, 2) + "\n");
}

const featured = JSON.parse(fs.readFileSync(featuredPath, "utf8"));
const products = [...new Set(featured.flatMap((s) => s.products))].sort();

const EN = {
  "publicSearch.industry.chemicalsAndPlastics": "Chemicals & Plastics",
  "publicSearch.industry.electronicsAndElectrical": "Electronics & Electrical",
  "publicSearch.industry.foodAndAgriculture": "Food & Agriculture",
  "publicSearch.industry.industrialMachinery": "Industrial Machinery",
  "publicSearch.industry.metalsAndMining": "Metals & Mining",
  "publicSearch.industry.textilesAndApparel": "Textiles & Apparel",
  "publicSearch.tagline.role.manufacturer": "manufacturer",
  "publicSearch.tagline.role.trading": "trading",
  "publicSearch.tagline.role.distribution": "distribution",
  "publicSearch.tagline.auditedLines":
    "{{role}} company with audited production lines and responsive international sales support.",
  "publicSearch.tagline.exportCompliance":
    "{{role}} producer focused on export compliance, traceability, and consistent batch quality.",
  "publicSearch.tagline.globalBuyers":
    "{{role}} supplier serving global buyers with stable quality and on-time shipments.",
  "publicSearch.tagline.establishedPartner":
    "Established {{role}} partner delivering reliable lead times and documented quality controls.",
  "publicSearch.tagline.exportOriented":
    "Export-oriented {{role}} provider offering flexible MOQs and dependable fulfillment performance.",
};

const TR = {
  "publicSearch.industry.chemicalsAndPlastics": "Kimyasallar ve plastikler",
  "publicSearch.industry.electronicsAndElectrical": "Elektronik ve elektrik",
  "publicSearch.industry.foodAndAgriculture": "Gıda ve tarım",
  "publicSearch.industry.industrialMachinery": "Endüstriyel makine",
  "publicSearch.industry.metalsAndMining": "Metaller ve madencilik",
  "publicSearch.industry.textilesAndApparel": "Tekstil ve konfeksiyon",
  "publicSearch.tagline.role.manufacturer": "üretici",
  "publicSearch.tagline.role.trading": "ticaret",
  "publicSearch.tagline.role.distribution": "dağıtım",
  "publicSearch.tagline.auditedLines":
    "Denetlenmiş üretim hatları ve duyarlı uluslararası satış desteği sunan {{role}} şirketi.",
  "publicSearch.tagline.exportCompliance":
    "İhracat uyumu, izlenebilirlik ve tutarlı parti kalitesine odaklanan {{role}} üreticisi.",
  "publicSearch.tagline.globalBuyers":
    "Kararlı kalite ve zamanında sevkiyatla küresel alıcılara hizmet veren {{role}} tedarikçisi.",
  "publicSearch.tagline.establishedPartner":
    "Güvenilir terminler ve belgelenmiş kalite kontrolleri sunan köklü {{role}} ortağı.",
  "publicSearch.tagline.exportOriented":
    "Esnek MOQ ve güvenilir fulfillment performansı sunan ihracat odaklı {{role}} sağlayıcısı.",
};

const ES = {
  "publicSearch.industry.chemicalsAndPlastics": "Químicos y plásticos",
  "publicSearch.industry.electronicsAndElectrical": "Electrónica y eléctricos",
  "publicSearch.industry.foodAndAgriculture": "Alimentos y agricultura",
  "publicSearch.industry.industrialMachinery": "Maquinaria industrial",
  "publicSearch.industry.metalsAndMining": "Metales y minería",
  "publicSearch.industry.textilesAndApparel": "Textil y confección",
  "publicSearch.tagline.role.manufacturer": "fabricante",
  "publicSearch.tagline.role.trading": "comercial",
  "publicSearch.tagline.role.distribution": "distribución",
  "publicSearch.tagline.auditedLines":
    "Empresa {{role}} con líneas de producción auditadas y soporte comercial internacional ágil.",
  "publicSearch.tagline.exportCompliance":
    "Productor {{role}} centrado en cumplimiento de exportación, trazabilidad y calidad de lote consistente.",
  "publicSearch.tagline.globalBuyers":
    "Proveedor {{role}} que atiende compradores globales con calidad estable y envíos puntuales.",
  "publicSearch.tagline.establishedPartner":
    "Socio {{role}} consolidado con plazos fiables y controles de calidad documentados.",
  "publicSearch.tagline.exportOriented":
    "Proveedor {{role}} orientado a exportación con MOQ flexibles y cumplimiento fiable.",
};

const RU = {
  "publicSearch.industry.chemicalsAndPlastics": "Химия и пластики",
  "publicSearch.industry.electronicsAndElectrical": "Электроника и электротехника",
  "publicSearch.industry.foodAndAgriculture": "Продовольствие и сельское хозяйство",
  "publicSearch.industry.industrialMachinery": "Промышленное оборудование",
  "publicSearch.industry.metalsAndMining": "Металлы и добыча",
  "publicSearch.industry.textilesAndApparel": "Текстиль и одежда",
  "publicSearch.tagline.role.manufacturer": "производитель",
  "publicSearch.tagline.role.trading": "торговый",
  "publicSearch.tagline.role.distribution": "дистрибуционный",
  "publicSearch.tagline.auditedLines":
    "{{role}} компания с аудированными производственными линиями и оперативной международной поддержкой продаж.",
  "publicSearch.tagline.exportCompliance":
    "{{role}} производитель с фокусом на экспортное соответствие, прослеживаемость и стабильное качество партий.",
  "publicSearch.tagline.globalBuyers":
    "{{role}} поставщик для глобальных покупателей со стабильным качеством и своевременными отгрузками.",
  "publicSearch.tagline.establishedPartner":
    "Проверенный {{role}} партнёр с надёжными сроками и документированным контролем качества.",
  "publicSearch.tagline.exportOriented":
    "Экспортно-ориентированный {{role}} поставщик с гибкими MOQ и надёжным исполнением.",
};

const ZH = {
  "publicSearch.industry.chemicalsAndPlastics": "化工与塑料",
  "publicSearch.industry.electronicsAndElectrical": "电子与电气",
  "publicSearch.industry.foodAndAgriculture": "食品与农业",
  "publicSearch.industry.industrialMachinery": "工业机械",
  "publicSearch.industry.metalsAndMining": "金属与采矿",
  "publicSearch.industry.textilesAndApparel": "纺织与服装",
  "publicSearch.tagline.role.manufacturer": "制造",
  "publicSearch.tagline.role.trading": "贸易",
  "publicSearch.tagline.role.distribution": "分销",
  "publicSearch.tagline.auditedLines":
    "拥有审计生产线和响应式国际销售支持的{{role}}公司。",
  "publicSearch.tagline.exportCompliance":
    "专注出口合规、可追溯性和稳定批次质量的{{role}}生产商。",
  "publicSearch.tagline.globalBuyers":
    "以稳定质量和准时发货服务全球买家的{{role}}供应商。",
  "publicSearch.tagline.establishedPartner":
    "提供可靠交期和文件化质量控制的成熟{{role}}合作伙伴。",
  "publicSearch.tagline.exportOriented":
    "提供灵活 MOQ 和可靠履约表现的出口导向型{{role}}供应商。",
};

const JA = {
  "publicSearch.industry.chemicalsAndPlastics": "化学品とプラスチック",
  "publicSearch.industry.electronicsAndElectrical": "電子・電気",
  "publicSearch.industry.foodAndAgriculture": "食品・農業",
  "publicSearch.industry.industrialMachinery": "産業機械",
  "publicSearch.industry.metalsAndMining": "金属・鉱業",
  "publicSearch.industry.textilesAndApparel": "繊維・アパレル",
  "publicSearch.tagline.role.manufacturer": "製造",
  "publicSearch.tagline.role.trading": "商社",
  "publicSearch.tagline.role.distribution": "流通",
  "publicSearch.tagline.auditedLines":
    "監査済み生産ラインと迅速な国際営業サポートを備えた{{role}}企業。",
  "publicSearch.tagline.exportCompliance":
    "輸出コンプライアンス、トレーサビリティ、安定したロット品質に注力する{{role}}生産者。",
  "publicSearch.tagline.globalBuyers":
    "安定品質と定時出荷でグローバルバイヤーに対応する{{role}}サプライヤー。",
  "publicSearch.tagline.establishedPartner":
    "信頼できるリードタイムと文書化された品質管理を提供する確立した{{role}}パートナー。",
  "publicSearch.tagline.exportOriented":
    "柔軟な MOQ と確実なフルフィルメントを提供する輸出志向の{{role}}プロバイダー。",
};

/** Product translations keyed by English label */
const PRODUCT_I18N = {
  "ABS granules": { tr: "ABS granül", es: "Gránulos ABS", ru: "Гранулы ABS", zh: "ABS 颗粒", ja: "ABS ペレット" },
  Acetone: { tr: "Aseton", es: "Acetona", ru: "Ацетон", zh: "丙酮", ja: "アセトン" },
  "Acrylic resin": { tr: "Akrilik reçine", es: "Resina acrílica", ru: "Акриловая смола", zh: "丙烯酸树脂", ja: "アクリル樹脂" },
  "Additive masterbatch": { tr: "Katık masterbatch", es: "Masterbatch aditivo", ru: "Аддитивный мастербatch", zh: "添加剂色母", ja: "添加剤マスターバッチ" },
  "Aluminum billet": { tr: "Alüminyum kütük", es: "Billet de aluminio", ru: "Алюминиевая болванка", zh: "铝锭坯", ja: "アルミビレット" },
  "Aluminum coil": { tr: "Alüminyum rulo", es: "Bobina de aluminio", ru: "Алюминиевая катушка", zh: "铝卷", ja: "アルミコイル" },
  "Aluminum plate": { tr: "Alüminyum plaka", es: "Placa de aluminio", ru: "Алюминиевая плита", zh: "铝板", ja: "アルミ板" },
  "Aluminum products": { tr: "Alüminyum ürünleri", es: "Productos de aluminio", ru: "Алюминиевая продукция", zh: "铝制品", ja: "アルミ製品" },
  "Aluminum profile": { tr: "Alüminyum profil", es: "Perfil de aluminio", ru: "Алюминиевый профиль", zh: "铝型材", ja: "アルミプロファイル" },
  "Anchor bolts": { tr: "Ankraj cıvataları", es: "Pernos de anclaje", ru: "Анкерные болты", zh: "锚栓", ja: "アンカーボルト" },
  "Antimony ingot": { tr: "Antimon külçe", es: "Lingote de antimonio", ru: "Сурьмяный слиток", zh: "锑锭", ja: "アンチモンインゴット" },
  "Antimony metal powder": { tr: "Antimon metal tozu", es: "Polvo de antimonio", ru: "Сурьмяный порошок", zh: "锑金属粉末", ja: "アンチモン金属粉末" },
  "Antimony products": { tr: "Antimon ürünleri", es: "Productos de antimonio", ru: "Сурьмяная продукция", zh: "锑制品", ja: "アンチモン製品" },
  "Antimony trioxide": { tr: "Antimon trioksit", es: "Trióxido de antimonio", ru: "Триоксид сурьмы", zh: "三氧化二锑", ja: "三酸化アンチモン" },
  "Ball valves": { tr: "Küresel vanalar", es: "Válvulas de bola", ru: "Шаровые краны", zh: "球阀", ja: "ボールバルブ" },
  "Battery-grade lead": { tr: "Akü kalitesi kurşun", es: "Plomo grado batería", ru: "Свинец аккумуляторного качества", zh: "电池级铅", ja: "バッテリー級鉛" },
  "Bed linen": { tr: "Yatak takımı", es: "Ropa de cama", ru: "Постельное бельё", zh: "床品", ja: "ベッドリネン" },
  "Black masterbatch": { tr: "Siyah masterbatch", es: "Masterbatch negro", ru: "Чёрный мастербatch", zh: "黑色色母", ja: "黒マスターバッチ" },
  "CNC lathe": { tr: "CNC torna", es: "Torno CNC", ru: "CNC токарный станок", zh: "CNC 车床", ja: "CNC 旋盤" },
  "CNC milling machine": { tr: "CNC freze", es: "Fresadora CNC", ru: "CNC фрезерный станок", zh: "CNC 铣床", ja: "CNC フライス盤" },
  "Canned fruit": { tr: "Konserve meyve", es: "Fruta enlatada", ru: "Консервированные фрукты", zh: " canned 水果", ja: "缶詰フルーツ" },
  "Canola oil": { tr: "Kanola yağı", es: "Aceite de canola", ru: "Масло канолы", zh: "菜籽油", ja: "キャノーラ油" },
  "Cartoning machine": { tr: "Kartonlama makinesi", es: "Máquina encartonadora", ru: "Картонажная машина", zh: "装盒机", ja: "カートナー機" },
  "Casual tops": { tr: "Gündelik üst giyim", es: "Tops casuales", ru: "Повседневные топы", zh: "休闲上衣", ja: "カジュアルトップス" },
  "Centrifugal pumps": { tr: "Santrifüj pompalar", es: "Bombas centrífugas", ru: "Центробежные насосы", zh: "离心泵", ja: "遠心ポンプ" },
  "Charging module": { tr: "Şarj modülü", es: "Módulo de carga", ru: "Зарядный модуль", zh: "充电模块", ja: "充電モジュール" },
  Chickpeas: { tr: "Nohut", es: "Garbanzos", ru: "Нут", zh: "鹰嘴豆", ja: "ひよこ豆" },
  "Coated fabric": { tr: "Kaplamalı kumaş", es: "Tejido recubierto", ru: "Покрытая ткань", zh: "涂层织物", ja: "コーティング生地" },
  "Cold rolled steel sheet": { tr: "Soğuk haddelenmiş sac", es: "Chapa de acero laminado en frío", ru: "Холоднокатаный лист", zh: "冷轧钢板", ja: "冷間圧延鋼板" },
  "Color masterbatch": { tr: "Renkli masterbatch", es: "Masterbatch de color", ru: "Цветной мастербatch", zh: "彩色色母", ja: "カラーマスターバッチ" },
  "Combed cotton": { tr: "Taraksız pamuk", es: "Algodón peinado", ru: "Гребенной хлопок", zh: "精梳棉", ja: "コームドコットン" },
  "Connector set": { tr: "Konnektör seti", es: "Juego de conectores", ru: "Набор разъёмов", zh: "连接器套件", ja: "コネクタセット" },
  "Control relay": { tr: "Kontrol rölesi", es: "Relé de control", ru: "Контрольное реле", zh: "控制继电器", ja: "制御リレー" },
  "Conveyor system": { tr: "Konveyör sistemi", es: "Sistema transportador", ru: "Конвейерная система", zh: "输送系统", ja: "コンベヤシステム" },
  "Copper cable lug": { tr: "Bakır kablo pabucu", es: "Terminal de cable de cobre", ru: "Медная кабельная наконечник", zh: "铜电缆端子", ja: "銅ケーブルラグ" },
  "Copper cathode": { tr: "Bakır katot", es: "Cátodo de cobre", ru: "Медный катод", zh: "铜阴极", ja: "銅カソード" },
  "Copper products": { tr: "Bakır ürünleri", es: "Productos de cobre", ru: "Медная продукция", zh: "铜制品", ja: "銅製品" },
  "Copper rod": { tr: "Bakır çubuk", es: "Varilla de cobre", ru: "Медный пруток", zh: "铜杆", ja: "銅棒" },
  "Copper strip": { tr: "Bakır şerit", es: "Tira de cobre", ru: "Медная полоса", zh: "铜带", ja: "銅ストリップ" },
  "Copper wire": { tr: "Bakır tel", es: "Alambre de cobre", ru: "Медная проволока", zh: "铜线", ja: "銅線" },
  "Corn gluten meal": { tr: "Mısır gluten unu", es: "Harina de gluten de maíz", ru: "Кукурузный глютен", zh: "玉米 gluten 粉", ja: "コーングルテンミール" },
  "Cotton yarn": { tr: "Pamuk ipliği", es: "Hilo de algodón", ru: "Хлопчатобумажная пряжа", zh: "棉纱", ja: "綿糸" },
  "Curtain fabric": { tr: "Perde kumaşı", es: "Tejido para cortinas", ru: "Ткань для штор", zh: "窗帘面料", ja: "カーテン生地" },
  "Display panel": { tr: "Ekran paneli", es: "Panel de visualización", ru: "Дисплейная панель", zh: "显示面板", ja: "ディスプレイパネル" },
  "Dyed cotton cloth": { tr: "Boyalı pamuklu kumaş", es: "Tela de algodón teñida", ru: "Окрашенная хлопчатобумажная ткань", zh: "染色棉布", ja: "染色綿布" },
  "Engineering plastic pellets": { tr: "Mühendislik plastik granül", es: "Pellets de plástico de ingeniería", ru: "Гранулы инженерных пластиков", zh: "工程塑料颗粒", ja: "エンプラペレット" },
  "Ethyl acetate": { tr: "Etil asetat", es: "Acetato de etilo", ru: "Этилацетат", zh: "乙酸乙酯", ja: "酢酸エチル" },
  "Feed premix": { tr: "Yem premiks", es: "Premezcla para piensos", ru: "Кормовая премix", zh: "饲料预混料", ja: "飼料プレミックス" },
  Ferronickel: { tr: "Ferronikel", es: "Ferroníquel", ru: "Ферроникель", zh: "镍铁", ja: "フェロニッケル" },
  "Filter fabric": { tr: "Filtre kumaşı", es: "Tejido filtrante", ru: "Фильтровальная ткань", zh: "过滤布", ja: "フィルター生地" },
  "Fish meal": { tr: "Balık unu", es: "Harina de pescado", ru: "Рыбная мука", zh: "鱼粉", ja: "魚粉" },
  "Flame retardant textile": { tr: "Yanmaz tekstil", es: "Textil ignífugo", ru: "Огнестойкий текстиль", zh: "阻燃纺织品", ja: "難燃テキスタイル" },
  "Forklift attachments": { tr: "Forklift ataşmanları", es: "Accesorios para montacargas", ru: "Навесное оборудование для погрузчиков", zh: "叉车属具", ja: "フォークリフトアタッチメント" },
  "Frozen vegetables": { tr: "Dondurulmuş sebze", es: "Verduras congeladas", ru: "Замороженные овощи", zh: "冷冻蔬菜", ja: "冷凍野菜" },
  "Galvanizing zinc": { tr: "Galvaniz çinko", es: "Zinc para galvanizado", ru: "Цинк для galvanizing", zh: "镀锌锌", ja: "溶融亜鉛めっき用亜鉛" },
  "Gate valves": { tr: "Sürgülü vanalar", es: "Válvulas de compuerta", ru: "Задвижки", zh: "闸阀", ja: "ゲートバルブ" },
  "Harness assembly": { tr: "Kablo demeti", es: "Ensamblaje de arneses", ru: "Жгут проводов", zh: "线束组件", ja: "ハーネスアセンブリ" },
  "Hex bolts": { tr: "Altıköşe cıvatalar", es: "Pernos hexagonales", ru: "Шестигранные болты", zh: "六角螺栓", ja: "六角ボルト" },
  "Hot melt adhesive": { tr: "Eritmeli yapıştırıcı", es: "Adhesivo hot melt", ru: "Hot melt клей", zh: "热熔胶", ja: "ホットメルト接着剤" },
  "Hot rolled steel coil": { tr: "Sıcak haddelenmiş rulo", es: "Bobina de acero laminado en caliente", ru: "Горячекатаный рулон", zh: "热轧钢卷", ja: "熱間圧延コイル" },
  "Industrial cable": { tr: "Endüstriyel kablo", es: "Cable industrial", ru: "Промышленный кабель", zh: "工业电缆", ja: "産業用ケーブル" },
  "Industrial canvas": { tr: "Endüstriyel kanvas", es: "Lona industrial", ru: "Промышленный canvas", zh: "工业帆布", ja: "産業用キャンバス" },
  "Industrial nuts": { tr: "Endüstriyel somunlar", es: "Tuercas industriales", ru: "Промышленные гайки", zh: "工业螺母", ja: "産業用ナット" },
  "Instant noodles": { tr: "Hazır erişte", es: "Fideos instantáneos", ru: "Лапша быстрого приготовления", zh: "方便面", ja: "インスタントラーメン" },
  "Insulated wire": { tr: "Yalıtımlı tel", es: "Alambre aislado", ru: "Изолированный провод", zh: "绝缘线", ja: "被覆線" },
  "Inverter board": { tr: "İnverter kartı", es: "Placa inversora", ru: "Инверторная плата", zh: "逆变器板", ja: "インバータ基板" },
  "Iron Ore products": { tr: "Demir cevheri ürünleri", es: "Productos de mineral de hierro", ru: "Продукция из железной руды", zh: "铁矿石产品", ja: "鉄鉱石製品" },
  "Iron ore concentrate": { tr: "Demir cevheri konsantresi", es: "Concentrado de mineral de hierro", ru: "Железорудный концентрат", zh: "铁精矿", ja: "鉄鉱石コンセントレート" },
  "Isopropyl alcohol": { tr: "İzopropil alkol", es: "Alcohol isopropílico", ru: "Изопропиловый спирт", zh: "异丙醇", ja: "イソプロピルアルコール" },
  "Labeling machine": { tr: "Etiketleme makinesi", es: "Máquina etiquetadora", ru: "Этикетировочная машина", zh: "贴标机", ja: "ラベラー" },
  "Lead ingot": { tr: "Kurşun külçe", es: "Lingote de plomo", ru: "Свинцовый слиток", zh: "铅锭", ja: "鉛インゴット" },
  "Lead oxide": { tr: "Kurşun oksit", es: "Óxido de plomo", ru: "Оксид свинца", zh: "氧化铅", ja: "酸化鉛" },
  "Lead products": { tr: "Kurşun ürünleri", es: "Productos de plomo", ru: "Свинцовая продукция", zh: "铅制品", ja: "鉛製品" },
  "Lead sheet": { tr: "Kurşun levha", es: "Chapa de plomo", ru: "Свинцовый лист", zh: "铅板", ja: "鉛板" },
  "Lead-antimony alloy": { tr: "Kurşun-antimon alaşımı", es: "Aleación plomo-antimonio", ru: "Свинцово-сурьмяный сплав", zh: "铅锑合金", ja: "鉛アンチモン合金" },
  Lentils: { tr: "Mercimek", es: "Lentejas", ru: "Чечевица", zh: " lentils", ja: "レンズ豆" },
  "Machining center": { tr: "İşleme merkezi", es: "Centro de mecanizado", ru: "Обрабатывающий центр", zh: "加工中心", ja: "マシニングセンター" },
  "Magnetite concentrate": { tr: "Manyetit konsantresi", es: "Concentrado de magnetita", ru: "Магнетитовый концентрат", zh: "磁铁矿精矿", ja: "磁鉄鉱コンセントレート" },
  "Mixed solvents": { tr: "Karışık solventler", es: "Disolventes mixtos", ru: "Смешанные растворители", zh: "混合溶剂", ja: "混合溶剤" },
  "Multilayer PCB": { tr: "Çok katmanlı PCB", es: "PCB multicapa", ru: "Многослойная PCB", zh: "多层 PCB", ja: "多層 PCB" },
  "Nickel briquette": { tr: "Nikel briket", es: "Briqueta de níquel", ru: "Никелевый брикет", zh: "镍块", ja: "ニッケルブリケット" },
  "Nickel cathode": { tr: "Nikel katot", es: "Cátodo de níquel", ru: "Никелевый катод", zh: "镍阴极", ja: "ニッケルカソード" },
  "Nickel products": { tr: "Nikel ürünleri", es: "Productos de níquel", ru: "Никелевая продукция", zh: "镍制品", ja: "ニッケル製品" },
  "Nickel sulfate": { tr: "Nikel sülfat", es: "Sulfato de níquel", ru: "Сульфат никеля", zh: "硫酸镍", ja: "硫酸ニッケル" },
  Outerwear: { tr: "Dış giyim", es: "Prendas de abrigo", ru: "Верхняя одежда", zh: "外套", ja: "アウター" },
  "PLC module": { tr: "PLC modülü", es: "Módulo PLC", ru: "Модуль PLC", zh: "PLC 模块", ja: "PLC モジュール" },
  "PP compound": { tr: "PP kompound", es: "Compuesto PP", ru: "PP компаунд", zh: "PP 复合材料", ja: "PP コンパウンド" },
  "PU adhesive": { tr: "PU yapıştırıcı", es: "Adhesivo PU", ru: "PU клей", zh: "PU 胶粘剂", ja: "PU 接着剤" },
  "Pallet stacker": { tr: "Palet istifleyici", es: "Apilador de pallets", ru: "Штабелёр", zh: "堆垛机", ja: "パレットスタッカー" },
  "Palm olein": { tr: "Palm olein", es: "Oleína de palma", ru: "Пальмовый olein", zh: "棕榈 olein", ja: "パームオレイン" },
  "Pellet feed": { tr: "Pelet yemi", es: "Alimento peletizado", ru: "Гранулированный корм", zh: "颗粒饲料", ja: "ペレット飼料" },
  "Pressure sensor": { tr: "Basınç sensörü", es: "Sensor de presión", ru: "Датчик давления", zh: "压力传感器", ja: "圧力センサー" },
  "Printed circuit board": { tr: "Baskılı devre kartı", es: "Placa de circuito impreso", ru: "Печатная плата", zh: "印刷电路板", ja: "プリント基板" },
  "Process additive": { tr: "Proses katkısı", es: "Aditivo de proceso", ru: "Процессная добавка", zh: "工艺添加剂", ja: "プロセス添加剤" },
  "Process pumps": { tr: "Proses pompaları", es: "Bombas de proceso", ru: "Процессные насосы", zh: "工艺泵", ja: "プロセスポンプ" },
  "Prototype PCB": { tr: "Prototip PCB", es: "PCB prototipo", ru: "Прототипная PCB", zh: "原型 PCB", ja: "試作 PCB" },
  "Proximity sensor": { tr: "Yakınlık sensörü", es: "Sensor de proximidad", ru: "Датчик приближения", zh: " proximity 传感器", ja: "近接センサー" },
  "Rectifier module": { tr: "Redresör modülü", es: "Módulo rectificador", ru: "Выпрямительный модуль", zh: "整流模块", ja: "整流モジュール" },
  "Refined sunflower oil": { tr: "Rafine ayçiçek yağı", es: "Aceite de girasol refinado", ru: "Рафинированное подсолнечное масло", zh: "精炼葵花籽油", ja: "精製ひまわり油" },
  Rice: { tr: "Pirinç", es: "Arroz", ru: "Рис", zh: "大米", ja: "米" },
  "Roller conveyor": { tr: "Rulo konveyör", es: "Transportador de rodillos", ru: "Роликовый конвейер", zh: "辊式输送机", ja: "ローラーコンベヤ" },
  "SMT assembly": { tr: "SMT montaj", es: "Ensamblaje SMT", ru: "SMT сборка", zh: "SMT 组装", ja: "SMT アセンブリ" },
  "Sinter feed": { tr: "Sinter besleme", es: "Alimentación de sinter", ru: "Синтерфид", zh: "烧结给料", ja: "焼結原料" },
  "Soybean meal": { tr: "Soya küspesi", es: "Harina de soja", ru: "Соевый шрот", zh: "豆粕", ja: "大豆粕" },
  "Soybean oil": { tr: "Soya yağı", es: "Aceite de soja", ru: "Соевое масло", zh: "大豆油", ja: "大豆油" },
  "Speaker component": { tr: "Hoparlör bileşeni", es: "Componente de altavoz", ru: "Компонент динамика", zh: "扬声器组件", ja: "スピーカーコンポーネント" },
  "Steel bar": { tr: "Çelik çubuk", es: "Barra de acero", ru: "Стальной пруток", zh: "钢棒", ja: "鋼棒" },
  "Steel products": { tr: "Çelik ürünleri", es: "Productos de acero", ru: "Стальная продукция", zh: "钢制品", ja: "鋼製品" },
  "Surfactant blend": { tr: "Yüzey aktif karışım", es: "Mezcla de surfactantes", ru: "Смесь ПАВ", zh: "表面活性剂混合物", ja: "界面活性剤ブレンド" },
  "Switching power supply": { tr: "Anahtarlama güç kaynağı", es: "Fuente conmutada", ru: "Импульсный блок питания", zh: "开关电源", ja: "スイッチング電源" },
  "Terry towel": { tr: "Havlu kumaş", es: "Toalla de rizo", ru: "Махровое полотенце", zh: "毛巾布", ja: "タオル地" },
  "Textile auxiliary": { tr: "Tekstil yardımcısı", es: "Auxiliar textil", ru: "Текстильная добавка", zh: "纺织助剂", ja: "繊維助剤" },
  "Threaded rods": { tr: "Dişli çubuklar", es: "Varillas roscadas", ru: "Резьбовые шпильки", zh: " threaded 杆", ja: "全ねじボルト" },
  "Tin products": { tr: "Kalay ürünleri", es: "Productos de estaño", ru: "Оловянная продукция", zh: "锡制品", ja: "スズ製品" },
  "Tomato paste": { tr: "Domates salçası", es: "Pasta de tomate", ru: "Томатная паста", zh: "番茄酱", ja: "トマトペースト" },
  "Tooling fixtures": { tr: "Kalıp aparatları", es: "Utillajes", ru: "Оснастка", zh: "工装夹具", ja: "治具" },
  Transformer: { tr: "Trafo", es: "Transformador", ru: "Трансформатор", zh: "变压器", ja: "トランス" },
  "Uniform apparel": { tr: "Üniforma giyim", es: "Ropa uniforme", ru: "Униформа", zh: "制服服装", ja: "ユニフォーム" },
  "Upholstery textile": { tr: "Döşemelik tekstil", es: "Textil para tapicería", ru: "Обивочный текстиль", zh: " upholstery 纺织品", ja: "家具生地" },
  "Wheat flour": { tr: "Buğday unu", es: "Harina de trigo", ru: "Пшеничная мука", zh: "小麦粉", ja: "小麦粉" },
  "White masterbatch": { tr: "Beyaz masterbatch", es: "Masterbatch blanco", ru: "Белый мастербatch", zh: "白色色母", ja: "白マスターバッチ" },
  "Workwear garments": { tr: "İş kıyafetleri", es: "Prendas de trabajo", ru: "Рабочая одежда", zh: "工装", ja: "作業服" },
  "Woven cotton fabric": { tr: "Dokuma pamuklu kumaş", es: "Tejido de algodón", ru: "Хлопчатобумажное полотно", zh: "机织棉布", ja: "綿織物" },
  "Zinc alloy": { tr: "Çinko alaşım", es: "Aleación de zinc", ru: "Цинковый сплав", zh: "锌合金", ja: "亜鉛合金" },
  "Zinc products": { tr: "Çinko ürünleri", es: "Productos de zinc", ru: "Цинковая продукция", zh: "锌制品", ja: "亜鉛製品" },
  "Zinc wire": { tr: "Çinko tel", es: "Alambre de zinc", ru: "Цинковая проволока", zh: "锌丝", ja: "亜鉛線" },
};

for (const product of products) {
  const key = `publicSearch.product.${slug(product)}`;
  EN[key] = product;
  const row = PRODUCT_I18N[product];
  if (!row) {
    console.warn("Missing product translation:", product);
    continue;
  }
  TR[key] = row.tr;
  ES[key] = row.es;
  RU[key] = row.ru;
  ZH[key] = row.zh;
  JA[key] = row.ja;
}

const localeMaps = { en: EN, tr: TR, es: ES, ru: RU, zh: ZH, ja: JA };

for (const [loc, keys] of Object.entries(localeMaps)) {
  const data = loadJson(loc);
  let applied = 0;
  for (const [key, value] of Object.entries(keys)) {
    if (data[key] !== value) {
      data[key] = value;
      applied++;
    }
  }
  writeJson(loc, data);
  console.log(`${loc}: applied ${applied} keys (${Object.keys(keys).length} total)`);
}

// Append to build-locale-parity-data.mjs for es/ru/zh/ja regeneration
const buildPath = path.join(__dirname, "build-locale-parity-data.mjs");
let buildSrc = fs.readFileSync(buildPath, "utf8");
const marker = "// ── Generate output module ──";
const insertLines = [];
for (const [key, value] of Object.entries({ ...ES, ...Object.fromEntries(products.map((p) => [`publicSearch.product.${slug(p)}`, ES[`publicSearch.product.${slug(p)}`]])) })) {
  if (key.startsWith("publicSearch.")) {
    const esVal = ES[key] ?? localeMaps.es[key];
    const ruVal = RU[key];
    const zhVal = ZH[key];
    const jaVal = JA[key];
    if (esVal && ruVal && zhVal && jaVal && !buildSrc.includes(`add("${key}"`)) {
      insertLines.push(`add(${JSON.stringify(key)}, ${JSON.stringify(esVal)}, ${JSON.stringify(ruVal)}, ${JSON.stringify(zhVal)}, ${JSON.stringify(jaVal)});`);
    }
  }
}

// Collect all publicSearch keys for parity
const parityKeys = Object.keys(EN);
for (const key of parityKeys) {
  if (buildSrc.includes(`add("${key}"`)) continue;
  const esVal = ES[key];
  const ruVal = RU[key];
  const zhVal = ZH[key];
  const jaVal = JA[key];
  if (esVal && ruVal && zhVal && jaVal) {
    insertLines.push(`add(${JSON.stringify(key)}, ${JSON.stringify(esVal)}, ${JSON.stringify(ruVal)}, ${JSON.stringify(zhVal)}, ${JSON.stringify(jaVal)});`);
  }
}

if (insertLines.length > 0) {
  buildSrc = buildSrc.replace(marker, `// ── supplier card content ──\n${insertLines.join("\n")}\n\n${marker}`);
  fs.writeFileSync(buildPath, buildSrc);
  console.log(`build-locale-parity-data.mjs: appended ${insertLines.length} add() calls`);
}

console.log(`Products: ${products.length}, keys per locale: ${Object.keys(EN).length}`);
