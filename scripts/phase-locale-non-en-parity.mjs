#!/usr/bin/env node
/** Patch es/ru/zh/ja — become-a-supplier, RFQ, footer keys still in English */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "../client/public/locales");

const PATCHES = {
  es: {
    "publicFooter.operatorRfqTitle": "RFQ del equipo de sourcing",
    "publicFooter.operatorRfqDesc":
      "El equipo de sourcing de SmartSeek enruta su RFQ — sin envíos masivos automáticos ni spam de marketplace.",
    "rfq.form.howItWorksBody":
      "Indique sus requisitos de producto abajo. El equipo de sourcing de SmartSeek compartirá su RFQ con proveedores verificados relevantes. Recibirá cotizaciones por email en 1–3 días hábiles — no se requiere cuenta. Sus datos no se comparten con terceros.",
    "rfq.form.legalSuffix":
      "Las RFQ son revisadas por el equipo de sourcing de SmartSeek antes de enrutarse.",
    "becomeSupplier.errors.required":
      "Complete los campos obligatorios: empresa, país, industria, productos, nombre de contacto, email de contacto.",
    "becomeSupplier.errors.submitFailed": "Error al enviar la solicitud",
    "becomeSupplier.success.title": "Solicitud recibida",
    "becomeSupplier.success.body1":
      "Gracias. El equipo de sourcing de SmartSeek revisará su solicitud y verificará los datos registrales. Normalmente respondemos en 1–3 días hábiles a",
    "becomeSupplier.success.body2":
      "Si necesitamos documentos adicionales (extracto registral, certificados ISO, facturas recientes), los solicitaremos por email.",
    "becomeSupplier.success.backHome": "Volver al inicio",
    "becomeSupplier.header.badge": "Solicitud de proveedor",
    "becomeSupplier.header.title": "Liste su empresa en SmartSeek",
    "becomeSupplier.header.subtitle":
      "Aceptamos solicitudes de fabricantes, traders y distribuidores en metales estratégicos y cadenas de suministro industrial. El listado es gratuito durante la beta. Cada solicitud se revisa manualmente y se verifica contra registros mercantiles.",
    "becomeSupplier.cards.verifyTitle": "Solo verificados en registro",
    "becomeSupplier.cards.verifyBody":
      "Confirmamos el estado legal de la entidad en un registro oficial antes del listado.",
    "becomeSupplier.cards.nopayTitle": "Sin pago por listado",
    "becomeSupplier.cards.nopayBody":
      "No vendemos posiciones. El listado se basa en verificación, no en presupuesto.",
    "becomeSupplier.cards.rfqTitle": "RFQ reales",
    "becomeSupplier.cards.rfqBody":
      "Las solicitudes de compradores son filtradas por el equipo de sourcing y se enrutan solo a proveedores relevantes.",
    "becomeSupplier.sections.company": "Empresa",
    "becomeSupplier.sections.registry": "Verificación registral",
    "becomeSupplier.sections.registryDesc":
      "Verificamos contra un registro oficial. Indique su número — lo contrastaremos.",
    "becomeSupplier.sections.offering": "Oferta",
    "becomeSupplier.sections.contact": "Contacto principal",
    "becomeSupplier.industries.mining": "Minería y metales estratégicos",
    "becomeSupplier.industries.steel": "Acero y aleaciones",
    "becomeSupplier.industries.nonFerrous": "Metales no ferrosos",
    "becomeSupplier.industries.rareEarths": "Tierras raras y minerales críticos",
    "becomeSupplier.industries.chemicals": "Químicos y polímeros",
    "becomeSupplier.industries.machinery": "Maquinaria industrial",
    "becomeSupplier.industries.electronics": "Electrónica y componentes",
    "becomeSupplier.industries.textiles": "Textil y confección",
    "becomeSupplier.industries.food": "Alimentación y agricultura",
    "becomeSupplier.industries.other": "Otro",
    "becomeSupplier.registry.saic": "SAIC (China)",
    "becomeSupplier.registry.companiesHouse": "Companies House (Reino Unido)",
    "becomeSupplier.registry.secEdgar": "SEC EDGAR (EE. UU.)",
    "becomeSupplier.registry.handelsregister": "Handelsregister (Alemania)",
    "becomeSupplier.registry.mersis": "MERSIS (Turquía)",
    "becomeSupplier.registry.asic": "ASIC (Australia)",
    "becomeSupplier.registry.krs": "KRS (Polonia)",
    "becomeSupplier.registry.dart": "DART (Corea)",
    "becomeSupplier.registry.sedar": "SEDAR (Canadá)",
    "becomeSupplier.registry.other": "Otro / registro nacional",
  },
  ru: {
    "publicFooter.operatorRfqTitle": "RFQ команды закупок",
    "publicFooter.operatorRfqDesc":
      "Команда закупок SmartSeek маршрутизирует ваш RFQ — без массовых рассылок и marketplace-спама.",
    "rfq.form.howItWorksBody":
      "Укажите требования к продукту ниже. Команда закупок SmartSeek направит ваш RFQ релевантным проверенным поставщикам. Коммерческие предложения обычно приходят на email в течение 1–3 рабочих дней — аккаунт не требуется. Ваши данные не передаются третьим лицам.",
    "rfq.form.legalSuffix":
      "RFQ проверяются командой закупок SmartSeek перед маршрутизацией.",
    "becomeSupplier.errors.required":
      "Заполните обязательные поля: компания, страна, отрасль, продукты, контактное имя, email.",
    "becomeSupplier.errors.submitFailed": "Не удалось отправить заявку",
    "becomeSupplier.success.title": "Заявка получена",
    "becomeSupplier.success.body1":
      "Спасибо. Команда закупок SmartSeek проверит заявку и регистрационные данные. Обычно отвечаем в течение 1–3 рабочих дней на",
    "becomeSupplier.success.body2":
      "При необходимости дополнительных документов (выписка из реестра, ISO, счета) запросим по email.",
    "becomeSupplier.success.backHome": "На главную",
    "becomeSupplier.header.badge": "Заявка поставщика",
    "becomeSupplier.header.title": "Разместите компанию на SmartSeek",
    "becomeSupplier.header.subtitle":
      "Принимаем заявки от производителей, трейдеров и дистрибьюторов в стратегических металлах и промышленных цепочках поставок. Размещение бесплатно в beta. Каждая заявка проверяется вручную и сверяется с реестром компаний.",
    "becomeSupplier.cards.verifyTitle": "Только с проверкой реестра",
    "becomeSupplier.cards.verifyBody":
      "Подтверждаем юридический статус по официальному реестру до публикации.",
    "becomeSupplier.cards.nopayTitle": "Без оплаты за размещение",
    "becomeSupplier.cards.nopayBody":
      "Мы не продаём позиции в рейтинге. Размещение основано на верификации, а не на бюджете.",
    "becomeSupplier.cards.rfqTitle": "Реальные RFQ",
    "becomeSupplier.cards.rfqBody":
      "Запросы покупателей фильтрует команда закупок и направляет только релевантным поставщикам.",
    "becomeSupplier.sections.company": "Компания",
    "becomeSupplier.sections.registry": "Проверка реестра",
    "becomeSupplier.sections.registryDesc":
      "Сверяем с официальным реестром. Укажите номер — мы проверим.",
    "becomeSupplier.sections.offering": "Предложение",
    "becomeSupplier.sections.contact": "Основной контакт",
    "becomeSupplier.industries.mining": "Горнодобыча и стратегические металлы",
    "becomeSupplier.industries.steel": "Сталь и сплавы",
    "becomeSupplier.industries.nonFerrous": "Цветные металлы",
    "becomeSupplier.industries.rareEarths": "Редкоземельные и критические минералы",
    "becomeSupplier.industries.chemicals": "Химия и полимеры",
    "becomeSupplier.industries.machinery": "Промышленное оборудование",
    "becomeSupplier.industries.electronics": "Электроника и компоненты",
    "becomeSupplier.industries.textiles": "Текстиль и одежда",
    "becomeSupplier.industries.food": "Продовольствие и агро",
    "becomeSupplier.industries.other": "Другое",
    "becomeSupplier.registry.saic": "SAIC (Китай)",
    "becomeSupplier.registry.companiesHouse": "Companies House (Великобритания)",
    "becomeSupplier.registry.secEdgar": "SEC EDGAR (США)",
    "becomeSupplier.registry.handelsregister": "Handelsregister (Германия)",
    "becomeSupplier.registry.mersis": "MERSIS (Турция)",
    "becomeSupplier.registry.asic": "ASIC (Австралия)",
    "becomeSupplier.registry.krs": "KRS (Польша)",
    "becomeSupplier.registry.dart": "DART (Корея)",
    "becomeSupplier.registry.sedar": "SEDAR (Канада)",
    "becomeSupplier.registry.other": "Другой / национальный реестр",
  },
  zh: {
    "publicFooter.operatorRfqTitle": "采购团队 RFQ 路由",
    "publicFooter.operatorRfqDesc":
      "SmartSeek 采购团队路由您的 RFQ — 无自动群发邮件，无 marketplace 垃圾信息。",
    "rfq.form.howItWorksBody":
      "请在下方填写产品需求。SmartSeek 采购团队将把您的 RFQ 分享给相关已验证供应商。报价通常会在 1–3 个工作日内通过电子邮件返回 — 无需账户。您的数据不会与第三方共享。",
    "rfq.form.legalSuffix": "RFQ 在路由前由 SmartSeek 采购团队审核。",
    "becomeSupplier.errors.required":
      "请填写必填项：公司、国家、行业、产品、联系人姓名、联系邮箱。",
    "becomeSupplier.errors.submitFailed": "提交失败",
    "becomeSupplier.success.title": "申请已收到",
    "becomeSupplier.success.body1":
      "谢谢。SmartSeek 采购团队将审核您的申请并验证注册信息。我们通常会在 1–3 个工作日内回复至",
    "becomeSupplier.success.body2":
      "如需补充文件（注册摘录、ISO 证书、近期发票），我们将通过电子邮件索取。",
    "becomeSupplier.success.backHome": "返回首页",
    "becomeSupplier.header.badge": "供应商申请",
    "becomeSupplier.header.subtitle":
      "我们接受战略金属与工业供应链中制造商、贸易商和分销商的申请。Beta 期间免费 listing。每项申请均人工审核并对照公司注册记录验证。",
    "becomeSupplier.cards.verifyTitle": "仅注册验证",
    "becomeSupplier.cards.verifyBody": "listing 前我们在官方注册机构确认法人状态。",
    "becomeSupplier.cards.nopayTitle": "无付费 listing",
    "becomeSupplier.cards.nopayBody": "不出售排名位置。listing 基于验证，而非预算。",
    "becomeSupplier.cards.rfqTitle": "真实 RFQ",
    "becomeSupplier.cards.rfqBody": "买方请求由采购团队筛选，仅路由至相关供应商。",
    "becomeSupplier.sections.company": "公司",
    "becomeSupplier.sections.registry": "注册验证",
    "becomeSupplier.sections.registryDesc": "我们对照官方注册机构验证。请提供编号 — 我们将交叉核对。",
    "becomeSupplier.sections.offering": "供应范围",
    "becomeSupplier.sections.contact": "主要联系人",
    "becomeSupplier.industries.mining": "采矿与战略金属",
    "becomeSupplier.industries.steel": "钢铁与合金",
    "becomeSupplier.industries.nonFerrous": "有色金属",
    "becomeSupplier.industries.rareEarths": "稀土与关键矿物",
    "becomeSupplier.industries.chemicals": "化工与聚合物",
    "becomeSupplier.industries.machinery": "工业机械",
    "becomeSupplier.industries.electronics": "电子与元器件",
    "becomeSupplier.industries.textiles": "纺织与服装",
    "becomeSupplier.industries.food": "食品与农业",
    "becomeSupplier.industries.other": "其他",
    "becomeSupplier.registry.other": "其他 / 国家注册机构",
  },
  ja: {
    "publicFooter.operatorRfqTitle": "調達チーム RFQ",
    "publicFooter.operatorRfqDesc":
      "SmartSeek 調達チームが RFQ をルーティング — 自動一斉送信やマーケットプレイス spam なし。",
    "rfq.form.howItWorksBody":
      "下記に製品要件を入力してください。SmartSeek 調達チームが関連する検証済みサプライヤーと RFQ を共有します。見積もりは通常 1–3 営業日以内にメールで届きます — アカウント不要。データは第三者と共有しません。",
    "rfq.form.legalSuffix": "RFQ はルーティング前に SmartSeek 調達チームが確認します。",
    "becomeSupplier.errors.required":
      "必須項目を入力してください：会社、国、業界、製品、担当者名、連絡先メール。",
    "becomeSupplier.errors.submitFailed": "送信に失敗しました",
    "becomeSupplier.success.title": "申請を受け付けました",
    "becomeSupplier.success.body1":
      "ありがとうございます。SmartSeek 調達チームが申請と登記情報を確認します。通常 1–3 営業日以内に次のアドレスへ返信します：",
    "becomeSupplier.success.body2":
      "追加書類（登記抄本、ISO 証明書、最近の請求書）が必要な場合はメールで依頼します。",
    "becomeSupplier.success.backHome": "ホームに戻る",
    "becomeSupplier.header.badge": "サプライヤー申請",
    "becomeSupplier.header.subtitle":
      "戦略金属・工業サプライチェーンの製造業者、商社、ディストリビューターの申請を受け付けます。ベータ期間中の掲載は無料です。各申請は手動審査し、会社登記と照合します。",
    "becomeSupplier.cards.verifyTitle": "登記検証のみ",
    "becomeSupplier.cards.verifyBody": "掲載前に公式登記で法人格を確認します。",
    "becomeSupplier.cards.nopayTitle": "有料掲載なし",
    "becomeSupplier.cards.nopayBody": "順位は販売しません。掲載は予算ではなく検証に基づきます。",
    "becomeSupplier.cards.rfqTitle": "実際の RFQ",
    "becomeSupplier.cards.rfqBody": "バイヤー依頼は調達チームが選別し、関連サプライヤーのみにルーティングします。",
    "becomeSupplier.sections.company": "会社",
    "becomeSupplier.sections.registry": "登記検証",
    "becomeSupplier.sections.registryDesc": "公式登記と照合します。番号を入力してください — 確認します。",
    "becomeSupplier.sections.offering": "提供内容",
    "becomeSupplier.sections.contact": "主要連絡先",
    "becomeSupplier.industries.mining": "鉱業・戦略金属",
    "becomeSupplier.industries.steel": "鉄鋼・合金",
    "becomeSupplier.industries.nonFerrous": "非鉄金属",
    "becomeSupplier.industries.rareEarths": "レアアース・重要鉱物",
    "becomeSupplier.industries.chemicals": "化学品・ポリマー",
    "becomeSupplier.industries.machinery": "産業機械",
    "becomeSupplier.industries.electronics": "電子・部品",
    "becomeSupplier.industries.textiles": "繊維・アパレル",
    "becomeSupplier.industries.food": "食品・農業",
    "becomeSupplier.industries.other": "その他",
    "becomeSupplier.registry.other": "その他 / 国別登記",
  },
};

for (const [loc, keys] of Object.entries(PATCHES)) {
  const fp = path.join(root, loc, "translation.json");
  const data = JSON.parse(fs.readFileSync(fp, "utf8"));
  Object.assign(data, keys);
  fs.writeFileSync(fp, JSON.stringify(data, null, 2) + "\n");
  console.log(`${loc}: +${Object.keys(keys).length} keys`);
}
