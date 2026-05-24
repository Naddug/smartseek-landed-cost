/**
 * Additive Phase A locale parity for tr, es, ru, zh, ja.
 * Preserves operator-native / registry-first tone. No JSON restructuring.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const localesDir = path.join(__dirname, "../client/public/locales");

const PATCHES = {
  tr: {
    "footer.operatedDuringBeta":
      "SmartSeek şu anda beta erişimi sürecinde kurucu ekibi tarafından işletilmektedir.",
    "verificationPage.reviewNotice":
      "Dokümantasyon son inceleme: Mayıs 2026. Doğrulama kademeleri ve kayıt gereksinimleri, operatör süreçleri geliştikçe güncellenebilir.",
    "about.subtitle":
      "Parçalanmış tedarikçi güvenini bizzat yaşayan operatörler tarafından kuruldu. SmartSeek, endüstriyel tedarik için operatör liderliğinde uluslararası bir platformdur—kayıt doğrulaması, yapılandırılmış RFQ'lar ve pazar yerlerinin hacme öncelik verdiği yerde insan yönlendirmesi.",
    "about.mission1":
      "SmartSeek, satın alma ekiplerinin kayıt doğrulanmış tedarikçileri keşfetmesine, yapılandırılmış RFQ göndermesine ve MOQ, termin ve Incoterms içeren operatör incelemeli teklifler almasına yardımcı olur. Metaller ve endüstriyel malzemeler temel güçlü yönlerimizdir—desteklediğimiz tek kategori değildir.",
    "about.mission2":
      "SmartSeek'i, sınır ötesi ticarette tekrar eden aynı hataları gördükten sonra kurduk: kazınmış profillerin doğrulanmış gibi sunulması, niteliksiz kişilere RFQ yağmuru ve kayıt kayıtlarının tedarik kapasitesi kanıtı sayılması. Yanıtımız kayıt öncelikli doğrulama, spesifikasyon odaklı alım ve SmartSeek sourcing operator yönlendirmesidir—algoritmik pazar yeri eşleştirmesi değil.",
    "about.foundersTitle": "Operatörler tarafından kuruldu",
    "about.foundersIntro":
      "SmartSeek, Türkiye, BDT, ASEAN, Çin ve ABD'de fiili sınır ötesi endüstriyel tedarik ve ticaret operasyonları deneyimine sahip uygulayıcılar tarafından kuruldu—liste hacmini optimize eden genel bir pazar yeri ekibi tarafından değil.",
    "about.founder1Name": "Harun Kaya",
    "about.founder1Role": "Kurucu ortak",
    "about.founder1Focus": "Sınır ötesi endüstriyel tedarik · tedarikçi nitelendirme · RFQ yapısı",
    "about.founder1Bio":
      "Endüstriyel malzeme ve komponentlerde sınır ötesi tedarik geçmişi. Tedarikçi keşfi, kayıt destekli nitelendirme ve kamu şirket kaydı ile fiilen sipariş verilebilir tedarikçi arasındaki operasyonel boşluk—Türkiye, BDT, ASEAN, Çin ve ABD.",
    "about.founder2Name": "Muhsin Kayıkçı",
    "about.founder2Role": "Kurucu ortak",
    "about.founder2Focus": "Ticaret operasyonları · doğrulama disiplini · uluslararası RFQ yürütme",
    "about.founder2Bio":
      "Doğrulama disiplini, tedarikçi ağı geliştirme ve uluslararası RFQ mekaniklerinde ticaret ve tedarik operasyonları deneyimi—spesifikasyon alımından MOQ, termin ve Incoterms ile teklif normalizasyonuna.",
    "sampleReport.back": "Siteye dön",
    "sampleReport.title": "Örnek tedarik iş akışı",
    "sampleReport.disclaimer":
      "Bu sayfa yalnızca SmartSeek RFQ iş akışının yapısını gösterir. Canlı bir müşteri çıktısı değildir. Tedarikçi adı, fiyat, puan, marj veya uyumluluk sonucu temsil edilmez.",
    "sampleReport.exampleLabel": "Anonim alım örneği",
    "sampleReport.fieldCommodity": "Emtia",
    "sampleReport.fieldSpec": "Spesifikasyon",
    "sampleReport.fieldQuantity": "Miktar",
    "sampleReport.fieldDestination": "Varış noktası",
    "sampleReport.fieldIncoterm": "Incoterm",
    "sampleReport.exampleCommodity": "Paslanmaz çelik soğuk haddelenmiş rulo",
    "sampleReport.exampleSpec": "304 kalite, 2B yüzey, alıcı çizimine göre kalınlık",
    "sampleReport.exampleQuantity": "Deneme partisi — miktar alıcı ile teyit edilir",
    "sampleReport.exampleDestination": "AB varış limanı (alıcı tarafından belirtilir)",
    "sampleReport.exampleIncoterm": "CIF — yapılandırılmış teklifte teyit edilir",
    "sampleReport.exampleNote":
      "Gerçek çıktılar kayıt kökeni, operatör yönlendirme notları ve karşılaştırılabilir teklif alanları içerir—projeksiyon marjı veya yıldız puanı değil.",
    "sampleReport.workflowTitle": "Talep SmartSeek'te nasıl ilerler",
    "sampleReport.step1Title": "Yapılandırılmış RFQ alımı",
    "sampleReport.step1Desc":
      "Alıcı emtia, spesifikasyon, miktar, varış, termin ve düzenleyici kısıtları spesifikasyon öncelikli form ile gönderir.",
    "sampleReport.step2Title": "SmartSeek sourcing operator incelemesi",
    "sampleReport.step2Desc":
      "SmartSeek sourcing operator tamlığı kontrol eder, uygun olduğunda kayıt bağlamını doğrular ve yalnızca emtia için doğrulanmış tedarikçilere yönlendirir—otomatik toplu ileti yok.",
    "sampleReport.step3Title": "Teklif normalizasyonu",
    "sampleReport.step3Desc":
      "Dönen teklifler MOQ, termin, Incoterms ve tedarikçi kökeni ile yapılandırılır; satın alma karşılaştırılabilir alanlarda değerlendirir.",
    "sampleReport.closing":
      "Gerçek anonim bir tedarik notu hazır olduğunda bu yapısal örneğin yerini alacaktır. O zamana kadar RFQ gönderin veya operatör iş akışı için metodolojimizi inceleyin.",
    "sampleReport.ctaRfq": "RFQ gönder",
    "sampleReport.ctaMethodology": "Metodolojiyi görüntüle",
    "sampleReport.footer": "Yalnızca örnek. Yatırım, hukuki veya uyumluluk tavsiyesi değildir.",
  },
  es: {
    "footer.operatedDuringBeta":
      "SmartSeek está operado actualmente por su equipo fundador durante el acceso beta.",
    "verificationPage.reviewNotice":
      "Documentación revisada por última vez: mayo de 2026. Los niveles de verificación y los requisitos de registro pueden actualizarse a medida que evolucionen los procedimientos del operador.",
    "about.subtitle":
      "Construido por operadores que experimentaron de primera mano la confianza fragmentada en proveedores. SmartSeek es una plataforma transfronteriza de abastecimiento industrial liderada por operadores: verificación registral, RFQ estructurados y enrutamiento humano donde los marketplaces priorizan el volumen.",
    "about.mission1":
      "SmartSeek ayuda a los equipos de compras a descubrir proveedores verificados en registros, enviar RFQ estructurados y recibir cotizaciones revisadas por operadores con MOQ, plazo e Incoterms. Metales y materiales industriales son una fortaleza central, no la única categoría.",
    "about.mission2":
      "Creamos SmartSeek tras ver los mismos fallos repetirse en el comercio transfronterizo: perfiles raspados presentados como verificados, RFQ masivos a contactos no cualificados y registros mercantiles tratados como prueba de capacidad de suministro. Nuestra respuesta es verificación registral primero, intake por especificación y enrutamiento por un SmartSeek sourcing operator, no emparejamiento algorítmico de marketplace.",
    "about.foundersTitle": "Construido por operadores",
    "about.foundersIntro":
      "SmartSeek fue fundado por practicantes con experiencia operativa en abastecimiento industrial transfronterizo y comercio en Turquía, CEI, ASEAN, China y Estados Unidos, no por un equipo genérico de marketplace orientado al volumen de listados.",
    "about.founder1Name": "Harun Kaya",
    "about.founder1Role": "Cofundador",
    "about.founder1Focus": "Abastecimiento industrial transfronterizo · calificación de proveedores · estructura RFQ",
    "about.founder1Bio":
      "Experiencia en compras transfronterizas de materiales y componentes industriales. Descubrimiento de proveedores, calificación respaldada por registros y la brecha operativa entre un registro mercantil público y un proveedor con el que realmente puede hacer un pedido, en Turquía, CEI, ASEAN, China y EE. UU.",
    "about.founder2Name": "Muhsin Kayıkçı",
    "about.founder2Role": "Cofundador",
    "about.founder2Focus": "Operaciones comerciales · disciplina de verificación · ejecución RFQ internacional",
    "about.founder2Bio":
      "Experiencia en operaciones comerciales y de compras con énfasis en disciplina de verificación, desarrollo de red de proveedores y mecánica de RFQ internacionales: desde intake de especificaciones y controles registrales hasta normalización de cotizaciones con MOQ, plazo e Incoterms.",
    "sampleReport.back": "Volver al sitio",
    "sampleReport.title": "Ejemplo ilustrativo de flujo de abastecimiento",
    "sampleReport.disclaimer":
      "Esta página muestra solo la estructura del flujo RFQ de SmartSeek. No es una entrega real a cliente. No se representan nombres de proveedores, precios, valoraciones, márgenes ni conclusiones de cumplimiento.",
    "sampleReport.exampleLabel": "Ejemplo de intake anonimizado",
    "sampleReport.fieldCommodity": "Mercancía",
    "sampleReport.fieldSpec": "Especificación",
    "sampleReport.fieldQuantity": "Cantidad",
    "sampleReport.fieldDestination": "Destino",
    "sampleReport.fieldIncoterm": "Incoterm",
    "sampleReport.exampleCommodity": "Bobina de acero inoxidable laminado en frío",
    "sampleReport.exampleSpec": "Grado 304, acabado 2B, espesor según plano del comprador",
    "sampleReport.exampleQuantity": "Lote de prueba — cantidad confirmada con el comprador",
    "sampleReport.exampleDestination": "Puerto de destino en la UE (especificado por el comprador)",
    "sampleReport.exampleIncoterm": "CIF — a confirmar en cotización estructurada",
    "sampleReport.exampleNote":
      "Las entregas reales incluyen procedencia registral, notas de enrutamiento del operador y campos comparables de cotización, no márgenes proyectados ni estrellas.",
    "sampleReport.workflowTitle": "Cómo avanza una solicitud en SmartSeek",
    "sampleReport.step1Title": "Intake RFQ estructurado",
    "sampleReport.step1Desc":
      "El comprador envía mercancía, especificación, cantidad, destino, plazo y restricciones regulatorias mediante un formulario orientado a especificaciones.",
    "sampleReport.step2Title": "Revisión del SmartSeek sourcing operator",
    "sampleReport.step2Desc":
      "Un SmartSeek sourcing operator verifica completitud, valida el contexto registral cuando aplica y enruta solo a proveedores verificados para la mercancía, sin difusión automática masiva.",
    "sampleReport.step3Title": "Normalización de cotizaciones",
    "sampleReport.step3Desc":
      "Las cotizaciones devueltas se estructuran con MOQ, plazo, Incoterms y procedencia del proveedor para comparación en compras.",
    "sampleReport.closing":
      "Cuando exista un memo de abastecimiento anonimizado real, sustituirá este ejemplo estructural. Hasta entonces, envíe un RFQ o revise nuestra metodología.",
    "sampleReport.ctaRfq": "Enviar RFQ",
    "sampleReport.ctaMethodology": "Ver metodología",
    "sampleReport.footer": "Solo ejemplo ilustrativo. No es asesoramiento de inversión, legal ni de cumplimiento.",
  },
  ru: {
    "footer.operatedDuringBeta":
      "SmartSeek в настоящее время управляется командой основателей в период бета-доступа.",
    "verificationPage.reviewNotice":
      "Документация последний раз проверена: май 2026 г. Уровни верификации и требования к реестрам могут обновляться по мере развития процедур оператора.",
    "about.subtitle":
      "Создано операторами, которые сами столкнулись с фрагментированным доверием к поставщикам. SmartSeek — операторская трансграничная платформа для промышленных закупок: верификация по реестрам, структурированные RFQ и человеческая маршрутизация там, где маркетплейсы ставят объём выше качества.",
    "about.mission1":
      "SmartSeek помогает закупочным командам находить поставщиков с верификацией по реестрам, отправлять структурированные RFQ и получать проверенные оператором котировки с MOQ, сроками и Incoterms. Металлы и промышленные материалы — ключевая компетенция, но не единственная категория.",
    "about.mission2":
      "Мы создали SmartSeek после повторяющихся сбоев в трансграничной торговле: скрапленные профили выдаются за проверенные, RFQ рассылаются нецелевым контактам, а записи реестра принимаются за доказательство поставочной способности. Наш ответ — реестр в первую очередь, intake по спецификации и маршрутизация SmartSeek sourcing operator, а не алгоритмический маркетплейс.",
    "about.foundersTitle": "Создано операторами",
    "about.foundersIntro":
      "SmartSeek основан практиками с опытом трансграничного промышленного сourcing и торговых операций в Турции, СНГ, ASEAN, Китае и США — не командой маркетплейса, оптимизирующей объём листингов.",
    "about.founder1Name": "Harun Kaya",
    "about.founder1Role": "Сооснователь",
    "about.founder1Focus": "Трансграничный промышленный sourcing · квалификация поставщиков · структура RFQ",
    "about.founder1Bio":
      "Опыт трансграничных закупок промышленных материалов и компонентов. Поиск поставщиков, квалификация по реестрам и операционный разрыв между публичной записью компании и поставщиком, у которого можно реально разместить заказ — Турция, СНГ, ASEAN, Китай, США.",
    "about.founder2Name": "Muhsin Kayıkçı",
    "about.founder2Role": "Сооснователь",
    "about.founder2Focus": "Торговые операции · дисциплина верификации · международные RFQ",
    "about.founder2Bio":
      "Опыт торговых и закупочных операций с акцентом на дисциплину верификации, развитие сети поставщиков и механику международных RFQ — от intake спецификаций и проверок реестра до нормализации котировок с MOQ, сроками и Incoterms.",
    "sampleReport.back": "На сайт",
    "sampleReport.title": "Иллюстративный пример workflow закупок",
    "sampleReport.disclaimer":
      "Эта страница показывает только структуру RFQ-workflow SmartSeek. Это не реальная клиентская поставка. Имена поставщиков, цены, рейтинги, маржа и выводы по compliance не представлены.",
    "sampleReport.exampleLabel": "Анонимизированный пример intake",
    "sampleReport.fieldCommodity": "Товар",
    "sampleReport.fieldSpec": "Спецификация",
    "sampleReport.fieldQuantity": "Объём",
    "sampleReport.fieldDestination": "Пункт назначения",
    "sampleReport.fieldIncoterm": "Incoterm",
    "sampleReport.exampleCommodity": "Рулон нержавеющей стали холодной прокатки",
    "sampleReport.exampleSpec": "Марка 304, отделка 2B, толщина по чертежу покупателя",
    "sampleReport.exampleQuantity": "Пробная партия — объём согласуется с покупателем",
    "sampleReport.exampleDestination": "Порт назначения в ЕС (указывает покупатель)",
    "sampleReport.exampleIncoterm": "CIF — подтверждается в структурированной котировке",
    "sampleReport.exampleNote":
      "Реальные deliverables включают происхождение по реестру, заметки оператора и сопоставимые поля котировок — не прогнозную маржу и звёзды.",
    "sampleReport.workflowTitle": "Как запрос проходит через SmartSeek",
    "sampleReport.step1Title": "Структурированный intake RFQ",
    "sampleReport.step1Desc":
      "Покупатель отправляет товар, спецификацию, объём, назначение, срок и регуляторные ограничения через форму, ориентированную на спецификацию.",
    "sampleReport.step2Title": "Проверка SmartSeek sourcing operator",
    "sampleReport.step2Desc":
      "SmartSeek sourcing operator проверяет полноту, при необходимости валидирует контекст реестра и направляет только проверенным поставщикам по товару — без массовой авто-рассылки.",
    "sampleReport.step3Title": "Нормализация котировок",
    "sampleReport.step3Desc":
      "Котировки структурируются с MOQ, сроками, Incoterms и происхождением поставщика для сопоставимого сравнения в закупках.",
    "sampleReport.closing":
      "Когда будет готова реальная анонимизированная sourcing-записка, она заменит этот структурный пример. До тех пор отправьте RFQ или изучите нашу методологию.",
    "sampleReport.ctaRfq": "Отправить RFQ",
    "sampleReport.ctaMethodology": "Смотреть методологию",
    "sampleReport.footer": "Только иллюстрация. Не инвестиционная, юридическая или compliance-консультация.",
  },
  zh: {
    "footer.operatedDuringBeta": "SmartSeek 目前在 beta 访问期间由创始团队运营。",
    "verificationPage.reviewNotice":
      "文档最后审阅：2026 年 5 月。验证层级与注册要求可能随运营流程更新而调整。",
    "about.subtitle":
      "由亲身经历过供应商信任碎片化的运营者创建。SmartSeek 是面向工业采购的运营主导跨境 sourcing 平台——注册验证、结构化 RFQ，以及在 marketplace 追求规模处由人工路由。",
    "about.mission1":
      "SmartSeek 帮助采购团队发现经注册验证的供应商、提交结构化 RFQ，并收到含 MOQ、交期与 Incoterms 的运营审核报价。金属与工业材料是核心优势，并非唯一品类。",
    "about.mission2":
      "我们在跨境贸易中反复看到相同失败模式后创建 SmartSeek： scraped 资料被当作已验证、RFQ 群发给不合格联系人、注册记录被当作供应能力证明。我们的回应是注册优先验证、规格驱动 intake，以及 SmartSeek sourcing operator 路由——而非算法 marketplace 匹配。",
    "about.foundersTitle": "运营者创建",
    "about.foundersIntro":
      "SmartSeek 由在土耳其、独联体、东盟、中国和美国具有跨境工业 sourcing 与贸易运营经验的从业者创立——而非优化 listing 数量的 generic marketplace 团队。",
    "about.founder1Name": "Harun Kaya",
    "about.founder1Role": "联合创始人",
    "about.founder1Focus": "跨境工业 sourcing · 供应商资格 · RFQ 结构",
    "about.founder1Bio":
      "工业材料与零部件跨境采购背景。涵盖供应商发现、注册支持资格认定，以及公开公司记录与可实际下单供应商之间的运营差距——覆盖土耳其、独联体、东盟、中国及美国。",
    "about.founder2Name": "Muhsin Kayıkçı",
    "about.founder2Role": "联合创始人",
    "about.founder2Focus": "贸易运营 · 验证纪律 · 国际 RFQ 执行",
    "about.founder2Bio":
      "贸易与采购运营经验，侧重验证纪律、供应商网络建设及国际 RFQ 机制——从规格 intake 与注册核查到含 MOQ、交期与 Incoterms 的报价标准化。",
    "sampleReport.back": "返回网站",
    "sampleReport.title": "采购工作流程示例（说明性）",
    "sampleReport.disclaimer":
      "本页仅展示 SmartSeek RFQ 工作流程结构，非真实客户交付物。不代表任何供应商名称、价格、评分、利润率或合规结论。",
    "sampleReport.exampleLabel": "匿名 intake 示例",
    "sampleReport.fieldCommodity": "商品",
    "sampleReport.fieldSpec": "规格",
    "sampleReport.fieldQuantity": "数量",
    "sampleReport.fieldDestination": "目的地",
    "sampleReport.fieldIncoterm": "Incoterm",
    "sampleReport.exampleCommodity": "不锈钢冷轧卷",
    "sampleReport.exampleSpec": "304 等级，2B 表面，厚度按买方图纸",
    "sampleReport.exampleQuantity": "试单批次——数量与买方确认",
    "sampleReport.exampleDestination": "欧盟目的港（买方指定）",
    "sampleReport.exampleIncoterm": "CIF——在结构化报价中确认",
    "sampleReport.exampleNote":
      "真实交付包含注册溯源、运营路由说明及可比较报价字段——而非预测利润率或星级。",
    "sampleReport.workflowTitle": "请求在 SmartSeek 中的流转",
    "sampleReport.step1Title": "结构化 RFQ intake",
    "sampleReport.step1Desc": "买方通过规格优先表单提交商品、规格、数量、目的地、交期及监管约束。",
    "sampleReport.step2Title": "SmartSeek sourcing operator 审核",
    "sampleReport.step2Desc":
      "SmartSeek sourcing operator 检查完整性、在适用时验证注册上下文，并仅路由至该商品已验证供应商——无自动群发。",
    "sampleReport.step3Title": "报价标准化",
    "sampleReport.step3Desc": "返回报价结构化包含 MOQ、交期、Incoterms 与供应溯源，便于采购比较。",
    "sampleReport.closing": "真实匿名 sourcing 备忘录可用后将替换本结构示例。在此之前请提交 RFQ 或查看方法论。",
    "sampleReport.ctaRfq": "提交 RFQ",
    "sampleReport.ctaMethodology": "查看方法论",
    "sampleReport.footer": "仅为说明性示例。非投资、法律或合规建议。",
  },
  ja: {
    "footer.operatedDuringBeta":
      "SmartSeek は現在、ベータアクセス期間中、創業チームによって運営されています。",
    "verificationPage.reviewNotice":
      "ドキュメント最終レビュー：2026年5月。検証ティアと登記要件は、オペレーター手順の進化に伴い更新される場合があります。",
    "about.subtitle":
      "サプライヤー信頼の断片化を実務で経験したオペレーターによって構築。SmartSeek は工業調達向けのオペレーター主導の越境ソーシング基盤です—登記検証、構造化 RFQ、マーケットプレイスが量を優先する場面での人的ルーティング。",
    "about.mission1":
      "SmartSeek は調達チームが登記検証済みサプライヤーを発見し、構造化 RFQ を提出し、MOQ・リードタイム・Incoterms を含むオペレーター確認済み見積を受け取ることを支援します。金属・工業材料は中核の強みであり、唯一のカテゴリーではありません。",
    "about.mission2":
      "越境取引で繰り返し見た失敗—スクレイププロフィールの検証済み扱い、不適格連絡先への RFQ 一斉送信、登記記録を供給能力の証明とみなす—に対し、SmartSeek は登記優先検証、仕様駆動 intake、SmartSeek sourcing operator によるルーティングを採用します。アルゴリズム型マーケットプレイスマッチングではありません。",
    "about.foundersTitle": "オペレーターによる構築",
    "about.foundersIntro":
      "SmartSeek はトルコ、CIS、ASEAN、中国、米国での越境工業ソーシング・貿易オペレーション経験を持つ実務家によって設立されました—リスティング量を最適化する汎用マーケットプレイスチームではありません。",
    "about.founder1Name": "Harun Kaya",
    "about.founder1Role": "共同創業者",
    "about.founder1Focus": "越境工業ソーシング · サプライヤー qualification · RFQ 構造",
    "about.founder1Bio":
      "工業材料・部品の越境調達経験。サプライヤー発見、登記裏付け qualification、公開会社登記と実際に発注可能なサプライヤーの間のオペレーションギャップ—トルコ、CIS、ASEAN、中国、米国。",
    "about.founder2Name": "Muhsin Kayıkçı",
    "about.founder2Role": "共同創業者",
    "about.founder2Focus": "貿易オペレーション · 検証規律 · 国際 RFQ 実行",
    "about.founder2Bio":
      "検証規律、サプライヤーネットワーク構築、国際 RFQ の実務—仕様 intake と登記確認から MOQ・リードタイム・Incoterms を含む見積正規化まで。",
    "sampleReport.back": "サイトに戻る",
    "sampleReport.title": "ソーシングワークフローの参考例",
    "sampleReport.disclaimer":
      "本ページは SmartSeek RFQ ワークフローの構造のみを示します。実際のクライアント成果物ではありません。サプライヤー名、価格、評価、マージン、コンプライアンス結論は表示されません。",
    "sampleReport.exampleLabel": "匿名 intake 例",
    "sampleReport.fieldCommodity": "品目",
    "sampleReport.fieldSpec": "仕様",
    "sampleReport.fieldQuantity": "数量",
    "sampleReport.fieldDestination": "仕向地",
    "sampleReport.fieldIncoterm": "Incoterm",
    "sampleReport.exampleCommodity": "ステンレス冷間圧延コイル",
    "sampleReport.exampleSpec": "304 グレード、2B 仕上げ、買い手図面による厚み",
    "sampleReport.exampleQuantity": "トライアルロット—数量は買い手と確認",
    "sampleReport.exampleDestination": "EU 仕向港（買い手指定）",
    "sampleReport.exampleIncoterm": "CIF—構造化見積で確認",
    "sampleReport.exampleNote":
      "実際の成果物には登記プロvenance、オペレータールーティング注記、比較可能な見積フィールドが含まれます—予測マージンや星評価ではありません。",
    "sampleReport.workflowTitle": "SmartSeek におけるリクエストの流れ",
    "sampleReport.step1Title": "構造化 RFQ intake",
    "sampleReport.step1Desc":
      "買い手が品目、仕様、数量、仕向地、リードタイム、規制制約を仕様優先フォームで提出します。",
    "sampleReport.step2Title": "SmartSeek sourcing operator レビュー",
    "sampleReport.step2Desc":
      "SmartSeek sourcing operator が完全性を確認し、該当時は登記コンテキストを検証し、当該品目で検証済みのサプライヤーのみにルーティング—自動一斉送信なし。",
    "sampleReport.step3Title": "見積正規化",
    "sampleReport.step3Desc":
      "返却見積は MOQ、リードタイム、Incoterms、サプライヤー provenance で構造化され、調達が比較可能なフィールドで評価できます。",
    "sampleReport.closing":
      "実際の匿名ソーシングメモが用意でき次第、この構造例に置き換わります。それまでは RFQ を提出するか、方法論をご確認ください。",
    "sampleReport.ctaRfq": "RFQ を提出",
    "sampleReport.ctaMethodology": "方法論を見る",
    "sampleReport.footer": "参考例のみ。投資・法務・コンプライアンス助言ではありません。",
  },
};

let patched = 0;
for (const [locale, keys] of Object.entries(PATCHES)) {
  const filePath = path.join(localesDir, locale, "translation.json");
  const json = JSON.parse(fs.readFileSync(filePath, "utf8"));
  for (const [key, value] of Object.entries(keys)) {
    json[key] = value;
    patched++;
  }
  fs.writeFileSync(filePath, JSON.stringify(json, null, 2) + "\n");
}

console.log(`Phase A parity: patched ${patched} keys across ${Object.keys(PATCHES).length} locales.`);
