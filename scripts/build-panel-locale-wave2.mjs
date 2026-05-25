#!/usr/bin/env node
/** Wave 2: landed-cost, customs-calculator, trade-data, ai-agent panel strings. */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "../client/public/locales");

const KEY_TRANSLATIONS = {};
function add(key, es, ru, zh, ja) {
  KEY_TRANSLATIONS[key] = { es, ru, zh, ja };
}

const EN_NEW = {};
function en(key, val) {
  EN_NEW[key] = val;
}

// --- Shared ---
["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"].forEach((m, i) => {
  const names = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const esNames = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
  const ruNames = ["Янв","Фев","Мар","Апр","Май","Июн","Июл","Авг","Сен","Окт","Ноя","Дек"];
  const zhNames = ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"];
  const jaNames = ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"];
  en(`tradeData.month.${m}`, names[i]);
  add(`tradeData.month.${m}`, esNames[i], ruNames[i], zhNames[i], jaNames[i]);
});

const incoterms = {
  FOB: ["FOB - Free on Board", "FOB - Franco a bordo", "FOB — Франко борт", "FOB - 船上交货", "FOB - 本船渡し"],
  EXW: ["EXW - Ex Works", "EXW - En fábrica", "EXW — Франко-завод", "EXW - 工厂交货", "EXW - 工場渡し"],
  CIF: ["CIF - Cost, Insurance & Freight", "CIF - Coste, seguro y flete", "CIF — Стоимость, страхование и фрахт", "CIF - 成本、保险费加运费", "CIF - 運賃保険料込み"],
  DDP: ["DDP - Delivered Duty Paid", "DDP - Entregado con derechos pagados", "DDP — Поставка с оплатой пошлин", "DDP - 完税后交货", "DDP - 関税込持込渡し"],
  DAP: ["DAP - Delivered at Place", "DAP - Entregado en lugar", "DAP — Поставка в месте назначения", "DAP - 目的地交货", "DAP - 仕向地持込渡し"],
  CIF_SHORT: null,
};
for (const [code, vals] of Object.entries(incoterms)) {
  if (!vals) continue;
  en(`incoterm.${code}`, vals[0]);
  add(`incoterm.${code}`, vals[1], vals[2], vals[3], vals[4]);
}

const shippingMethods = {
  sea_fcl: ["Sea FCL (Full Container)", "Marítimo FCL (contenedor completo)", "Море FCL (полный контейнер)", "海运 FCL（整箱）", "海上 FCL（フルコンテナ）"],
  sea_lcl: ["Sea LCL (Less than Container)", "Marítimo LCL (menos de contenedor)", "Море LCL (менее контейнера)", "海运 LCL（拼箱）", "海上 LCL（混載）"],
  air: ["Air Freight", "Transporte aéreo", "Авиаперевозка", "空运", "航空輸送"],
  express: ["Express Courier", "Mensajería express", "Экспресс-курьер", "快递", "エクスプレス"],
};
for (const [code, vals] of Object.entries(shippingMethods)) {
  en(`shippingMethod.${code}`, vals[0]);
  add(`shippingMethod.${code}`, vals[1], vals[2], vals[3], vals[4]);
}

en("containerType.20ft", "20ft");
en("containerType.40ft", "40ft");
add("containerType.20ft", "20 pies", "20 футов", "20英尺", "20ft");
add("containerType.40ft", "40 pies", "40 футов", "40英尺", "40ft");

// --- Landed cost ---
en("landedCost.backToHome", "← Back to Home");
en("landedCost.dashboard", "Dashboard");
en("landedCost.login", "Login");
en("landedCost.inputParameters", "Input Parameters");
en("landedCost.inputDescription", "Enter product and shipment details");
en("landedCost.hsCode", "HS Code");
en("landedCost.lookingUpHs", "Looking up HS code...");
en("landedCost.useHsCode", "Use {{code}}");
en("landedCost.hsCodeHint", "6-10 digit code. Use 6-digit HS for general, full code for accurate duty.");
en("landedCost.category", "Category");
en("landedCost.optional", "Optional");
en("landedCost.baseCost", "Base Cost (FOB/EXW)");
en("landedCost.incoterm", "Incoterm");
en("landedCost.quantity", "Quantity");
en("landedCost.currency", "Currency");
en("landedCost.origin", "Origin");
en("landedCost.destination", "Destination");
en("landedCost.shippingMethod", "Shipping Method");
en("landedCost.containerType", "Container Type");
en("landedCost.weight", "Weight (kg)");
en("landedCost.volume", "Volume (CBM)");
en("landedCost.insuranceRate", "Insurance Rate (%) — optional");
en("landedCost.originTransport", "Origin Transport ($)");
en("landedCost.destTransport", "Dest. Transport ($)");
en("landedCost.placeholder.productName", "Product name");
en("landedCost.placeholder.hsCode", "e.g. 847130");
en("landedCost.placeholder.insurance", "Default 0.5%");
en("landedCost.placeholder.estExw", "Est. if EXW");
en("landedCost.placeholder.estDefault", "Est. default");
en("landedCost.error.calculationFailed", "Calculation failed. Please check your inputs.");
en("landedCost.totalLandedCost", "Total Landed Cost");
en("landedCost.totalSummary", "{{currency}} {{total}} total · {{currency}} {{perUnit}} per unit");
en("landedCost.perUnitSummary", "Per unit: {{currency}} {{perUnit}} × {{quantity}} units");
en("landedCost.costBreakdown", "Cost Breakdown");
en("landedCost.waterfallDesc", "Waterfall breakdown of all cost components");
en("landedCost.component", "Component");
en("landedCost.amount", "Amount");
en("landedCost.cumulative", "Cumulative");
en("landedCost.costDetails", "Cost Details");
en("landedCost.label.baseCost", "Base Cost");
en("landedCost.label.freight", "Freight");
en("landedCost.label.insurance", "Insurance");
en("landedCost.label.customs", "Customs");
en("landedCost.label.inlandTransport", "Inland Transport");
en("landedCost.dutyVat", "Duty: {{duty}}% · VAT: {{vat}}%");
en("landedCost.transportSplit", "Origin: {{origin}} · Dest: {{dest}}");
en("landedCost.calculationNotes", "Calculation Notes");
en("landedCost.emptyState", "Fill in the form and click Calculate to see results");
en("landedCost.emptyStateHint", "All calculations run client-side — no API calls");

add("landedCost.backToHome", "← Volver al inicio", "← На главную", "← 返回首页", "← ホームに戻る");
add("landedCost.dashboard", "Panel", "Панель", "控制台", "ダッシュボード");
add("landedCost.login", "Iniciar sesión", "Войти", "登录", "ログイン");
add("landedCost.inputParameters", "Parámetros de entrada", "Входные параметры", "输入参数", "入力パラメータ");
add("landedCost.inputDescription", "Introduzca detalles del producto y envío", "Введите данные о товаре и отправке", "输入产品和货运详情", "製品と出荷の詳細を入力");
add("landedCost.hsCode", "Código HS", "Код HS", "HS 编码", "HSコード");
add("landedCost.lookingUpHs", "Buscando código HS...", "Поиск кода HS...", "正在查询 HS 编码...", "HSコードを検索中...");
add("landedCost.useHsCode", "Usar {{code}}", "Использовать {{code}}", "使用 {{code}}", "{{code}} を使用");
add("landedCost.hsCodeHint", "Código de 6-10 dígitos. Use 6 dígitos para general, código completo para aranceles precisos.", "Код 6–10 цифр. 6 цифр — общий, полный — точная пошлина.", "6-10 位编码。一般用途用 6 位，精确关税用完整编码。", "6〜10桁。概算は6桁、正確な関税は全桁。");
add("landedCost.category", "Categoría", "Категория", "类别", "カテゴリ");
add("landedCost.optional", "Opcional", "Необязательно", "可选", "任意");
add("landedCost.baseCost", "Coste base (FOB/EXW)", "Базовая стоимость (FOB/EXW)", "基础成本 (FOB/EXW)", "基本コスト (FOB/EXW)");
add("landedCost.incoterm", "Incoterm", "Инкотerm", "贸易术语", "インコターム");
add("landedCost.quantity", "Cantidad", "Количество", "数量", "数量");
add("landedCost.currency", "Moneda", "Валюта", "货币", "通貨");
add("landedCost.origin", "Origen", "Отправление", "起运地", "出発地");
add("landedCost.destination", "Destino", "Назначение", "目的地", "仕向地");
add("landedCost.shippingMethod", "Método de envío", "Способ доставки", "运输方式", "配送方法");
add("landedCost.containerType", "Tipo de contenedor", "Тип контейнера", "集装箱类型", "コンテナ種別");
add("landedCost.weight", "Peso (kg)", "Вес (кг)", "重量 (kg)", "重量 (kg)");
add("landedCost.volume", "Volumen (CBM)", "Объём (CBM)", "体积 (CBM)", "容積 (CBM)");
add("landedCost.insuranceRate", "Tasa de seguro (%) — opcional", "Страховая ставка (%) — необязательно", "保险费率 (%) — 可选", "保険率 (%) — 任意");
add("landedCost.originTransport", "Transporte origen ($)", "Внутренняя доставка (отправление) ($)", "起运内陆运输 ($)", "出発地輸送 ($)");
add("landedCost.destTransport", "Transporte destino ($)", "Внутренняя доставка (назначение) ($)", "目的内陆运输 ($)", "仕向地輸送 ($)");
add("landedCost.placeholder.productName", "Nombre del producto", "Название продукта", "产品名称", "製品名");
add("landedCost.placeholder.hsCode", "p. ej. 847130", "напр. 847130", "例如 847130", "例: 847130");
add("landedCost.placeholder.insurance", "Predeterminado 0,5%", "По умолчанию 0,5%", "默认 0.5%", "デフォルト 0.5%");
add("landedCost.placeholder.estExw", "Est. si EXW", "Оценка при EXW", "EXW 估算", "EXW 時の見積");
add("landedCost.placeholder.estDefault", "Est. predeterminado", "Оценка по умолчанию", "默认估算", "デフォルト見積");
add("landedCost.error.calculationFailed", "Error en el cálculo. Revise sus datos.", "Ошибка расчёта. Проверьте данные.", "计算失败。请检查输入。", "計算に失敗しました。入力を確認してください。");
add("landedCost.totalLandedCost", "Coste landed total", "Итоговый landed cost", "总到岸成本", "総ランデッドコスト");
add("landedCost.totalSummary", "{{currency}} {{total}} total · {{currency}} {{perUnit}} por unidad", "{{currency}} {{total}} итого · {{currency}} {{perUnit}} за ед.", "总计 {{currency}} {{total}} · 单价 {{currency}} {{perUnit}}", "合計 {{currency}} {{total}} · 単価 {{currency}} {{perUnit}}");
add("landedCost.perUnitSummary", "Por unidad: {{currency}} {{perUnit}} × {{quantity}} unidades", "За единицу: {{currency}} {{perUnit}} × {{quantity}} шт.", "单价：{{currency}} {{perUnit}} × {{quantity}} 件", "単価: {{currency}} {{perUnit}} × {{quantity}} 単位");
add("landedCost.costBreakdown", "Desglose de costes", "Разбивка затрат", "成本明细", "コスト内訳");
add("landedCost.waterfallDesc", "Desglose en cascada de todos los componentes", "Каскадная разбивка всех компонентов", "所有成本组件的瀑布分解", "全コスト要素のウォーターフォール内訳");
add("landedCost.component", "Componente", "Компонент", "组件", "項目");
add("landedCost.amount", "Importe", "Сумма", "金额", "金額");
add("landedCost.cumulative", "Acumulado", "Накопительно", "累计", "累計");
add("landedCost.costDetails", "Detalles de coste", "Детали затрат", "成本详情", "コスト詳細");
add("landedCost.label.baseCost", "Coste base", "Базовая стоимость", "基础成本", "基本コスト");
add("landedCost.label.freight", "Flete", "Фрахт", "运费", "運賃");
add("landedCost.label.insurance", "Seguro", "Страхование", "保险", "保険");
add("landedCost.label.customs", "Aduanas", "Таможня", "关税", "関税");
add("landedCost.label.inlandTransport", "Transporte interior", "Внутренняя перевозка", "内陆运输", "内陸輸送");
add("landedCost.dutyVat", "Arancel: {{duty}}% · IVA: {{vat}}%", "Пошлина: {{duty}}% · НДС: {{vat}}%", "关税：{{duty}}% · 增值税：{{vat}}%", "関税: {{duty}}% · VAT: {{vat}}%");
add("landedCost.transportSplit", "Origen: {{origin}} · Dest: {{dest}}", "Отправление: {{origin}} · Назначение: {{dest}}", "起运：{{origin}} · 目的：{{dest}}", "出発: {{origin}} · 仕向: {{dest}}");
add("landedCost.calculationNotes", "Notas de cálculo", "Примечания к расчёту", "计算说明", "計算メモ");
add("landedCost.emptyState", "Complete el formulario y haga clic en Calcular", "Заполните форму и нажмите «Рассчитать»", "填写表单并点击计算查看结果", "フォームを入力して計算をクリック");
add("landedCost.emptyStateHint", "Todos los cálculos se ejecutan en el cliente — sin llamadas API", "Все расчёты на клиенте — без API", "所有计算在客户端运行 — 无 API 调用", "計算はすべてクライアント側 — API呼び出しなし");

// --- Customs calculator ---
en("customsCalculator.productDetails", "Product Details");
en("customsCalculator.productDetailsDesc", "Enter your product information to calculate customs fees");
en("customsCalculator.productName", "Product Name");
en("customsCalculator.hsCodeOptional", "HS Code (Optional)");
en("customsCalculator.incoterm", "Incoterm");
en("customsCalculator.originCountry", "Origin Country");
en("customsCalculator.destinationCountry", "Destination Country");
en("customsCalculator.productValue", "Product Value (USD)");
en("customsCalculator.quantity", "Quantity");
en("customsCalculator.freightCost", "Freight Cost (USD)");
en("customsCalculator.insuranceCost", "Insurance Cost (USD)");
en("customsCalculator.placeholder.productName", "e.g., Wireless Bluetooth Headphones");
en("customsCalculator.placeholder.hsCode", "e.g., 8518.30.20");
en("customsCalculator.placeholder.autoEstimate", "Auto-estimate");
en("customsCalculator.origin", "Origin");
en("customsCalculator.destination", "Destination");
en("customsCalculator.hsCodeBadge", "HS Code: {{code}}");
en("customsCalculator.totalLandedCost", "Total Landed Cost");
en("customsCalculator.perUnit", "${{cost}} per unit ({{quantity}} units)");
en("customsCalculator.feeBreakdown", "Fee Breakdown");
en("customsCalculator.productValueFob", "Product Value (FOB)");
en("customsCalculator.freightCostLabel", "Freight Cost");
en("customsCalculator.insurance", "Insurance");
en("customsCalculator.cifValue", "CIF Value");
en("customsCalculator.importDuty", "Import Duty ({{rate}}%)");
en("customsCalculator.vatGst", "VAT/GST ({{rate}}%)");
en("customsCalculator.mpf", "Merchandise Processing Fee");
en("customsCalculator.hmf", "Harbor Maintenance Fee");
en("customsCalculator.brokerage", "Customs Brokerage");
en("customsCalculator.disclaimer", "Disclaimer");
en("customsCalculator.disclaimerText", "These calculations are estimates based on standard tariff rates. Actual duties may vary based on specific HS code classification, trade agreements, and current regulations. Consult a licensed customs broker for official guidance.");
en("customsCalculator.emptyTitle", "Enter Product Details");
en("customsCalculator.emptyDesc", "Fill in the form to calculate customs duties and landed costs");
en("customsCalculator.chart.product", "Product");
en("customsCalculator.chart.freight", "Freight");
en("customsCalculator.chart.importDuty", "Import Duty");
en("customsCalculator.chart.vatTax", "VAT/Tax");
en("customsCalculator.chart.otherFees", "Other Fees");
en("customsCalculator.downloaded", "Downloaded!");
en("customsCalculator.downloadedDesc", "PDF saved to your downloads folder.");

add("customsCalculator.productDetails", "Detalles del producto", "Данные о продукте", "产品详情", "製品詳細");
add("customsCalculator.productDetailsDesc", "Introduzca la información del producto para calcular tasas aduaneras", "Введите данные о продукте для расчёта таможенных сборов", "输入产品信息以计算关税", "製品情報を入力して関税を計算");
add("customsCalculator.productName", "Nombre del producto", "Название продукта", "产品名称", "製品名");
add("customsCalculator.hsCodeOptional", "Código HS (opcional)", "Код HS (необязательно)", "HS 编码（可选）", "HSコード（任意）");
add("customsCalculator.incoterm", "Incoterm", "Инкотerm", "贸易术语", "インコターム");
add("customsCalculator.originCountry", "País de origen", "Страна отправления", "原产国", "原産国");
add("customsCalculator.destinationCountry", "País de destino", "Страна назначения", "目的国", "仕向国");
add("customsCalculator.productValue", "Valor del producto (USD)", "Стоимость продукта (USD)", "产品价值 (USD)", "製品価値 (USD)");
add("customsCalculator.quantity", "Cantidad", "Количество", "数量", "数量");
add("customsCalculator.freightCost", "Coste de flete (USD)", "Стоимость фрахта (USD)", "运费 (USD)", "運賃 (USD)");
add("customsCalculator.insuranceCost", "Coste de seguro (USD)", "Стоимость страхования (USD)", "保险费 (USD)", "保険料 (USD)");
add("customsCalculator.placeholder.productName", "p. ej., auriculares Bluetooth inalámbricos", "напр., беспроводные наушники Bluetooth", "例如无线蓝牙耳机", "例: ワイヤレスBluetoothイヤホン");
add("customsCalculator.placeholder.hsCode", "p. ej., 8518.30.20", "напр., 8518.30.20", "例如 8518.30.20", "例: 8518.30.20");
add("customsCalculator.placeholder.autoEstimate", "Autoestimación", "Автооценка", "自动估算", "自動見積");
add("customsCalculator.origin", "Origen", "Отправление", "起运地", "出発地");
add("customsCalculator.destination", "Destino", "Назначение", "目的地", "仕向地");
add("customsCalculator.hsCodeBadge", "Código HS: {{code}}", "Код HS: {{code}}", "HS 编码：{{code}}", "HSコード: {{code}}");
add("customsCalculator.totalLandedCost", "Coste landed total", "Итоговый landed cost", "总到岸成本", "総ランデッドコスト");
add("customsCalculator.perUnit", "${{cost}} por unidad ({{quantity}} unidades)", "${{cost}} за ед. ({{quantity}} шт.)", "单价 ${{cost}}（{{quantity}} 件）", "単価 ${{cost}}（{{quantity}} 単位）");
add("customsCalculator.feeBreakdown", "Desglose de tasas", "Разбивка сборов", "费用明细", "手数料内訳");
add("customsCalculator.productValueFob", "Valor del producto (FOB)", "Стоимость продукта (FOB)", "产品价值 (FOB)", "製品価値 (FOB)");
add("customsCalculator.freightCostLabel", "Coste de flete", "Стоимость фрахта", "运费", "運賃");
add("customsCalculator.insurance", "Seguro", "Страхование", "保险", "保険");
add("customsCalculator.cifValue", "Valor CIF", "Стоимость CIF", "CIF 价值", "CIF価値");
add("customsCalculator.importDuty", "Arancel de importación ({{rate}}%)", "Импортная пошлина ({{rate}}%)", "进口关税 ({{rate}}%)", "輸入関税 ({{rate}}%)");
add("customsCalculator.vatGst", "IVA/IGV ({{rate}}%)", "НДС/GST ({{rate}}%)", "增值税/GST ({{rate}}%)", "VAT/GST ({{rate}}%)");
add("customsCalculator.mpf", "Tasa de procesamiento de mercancías", "Сбор за обработку товаров", "商品处理费", "商品処理手数料");
add("customsCalculator.hmf", "Tasa de mantenimiento portuario", "Сбор за содержание порта", "港口维护费", "港湾維持手数料");
add("customsCalculator.brokerage", "Agente de aduanas", "Таможенный брокер", "报关代理", "通関ブローカー");
add("customsCalculator.disclaimer", "Aviso legal", "Отказ от ответственности", "免责声明", "免責事項");
add("customsCalculator.disclaimerText", "Estos cálculos son estimaciones basadas en tarifas estándar. Los aranceles reales pueden variar. Consulte un agente de aduanas autorizado.", "Расчёты являются оценками на основе стандартных тарифов. Фактические пошлины могут отличаться. Обратитесь к лицензированному брокеру.", "这些计算基于标准关税率的估算。实际关税可能不同。请咨询持证报关代理。", "標準税率に基づく見積もりです。実際の関税は異なる場合があります。認定通関業者にご相談ください。");
add("customsCalculator.emptyTitle", "Introduzca detalles del producto", "Введите данные о продукте", "输入产品详情", "製品詳細を入力");
add("customsCalculator.emptyDesc", "Complete el formulario para calcular aranceles y costes landed", "Заполните форму для расчёта пошлин и landed cost", "填写表单以计算关税和到岸成本", "フォームに入力して関税とランデッドコストを計算");
add("customsCalculator.chart.product", "Producto", "Продукт", "产品", "製品");
add("customsCalculator.chart.freight", "Flete", "Фрахт", "运费", "運賃");
add("customsCalculator.chart.importDuty", "Arancel", "Пошлина", "关税", "関税");
add("customsCalculator.chart.vatTax", "IVA/Impuesto", "НДС/Налог", "增值税/税", "VAT/税");
add("customsCalculator.chart.otherFees", "Otras tasas", "Прочие сборы", "其他费用", "その他手数料");
add("customsCalculator.downloaded", "¡Descargado!", "Скачано!", "已下载！", "ダウンロード完了！");
add("customsCalculator.downloadedDesc", "PDF guardado en su carpeta de descargas.", "PDF сохранён в папку загрузок.", "PDF 已保存到下载文件夹。", "PDFをダウンロードフォルダに保存しました。");

// --- Trade data (wave 2) ---
en("tradeData.newSourcingReport", "New sourcing report");
en("tradeData.viewMyReports", "View My Reports →");
en("tradeData.overviewTitle", "Trade data overview");
en("tradeData.metric.totalImports", "Total Imports");
en("tradeData.metric.totalExports", "Total Exports");
en("tradeData.metric.tradeBalance", "Trade Balance");
en("tradeData.metric.activeSuppliers", "Active Suppliers");
en("tradeData.vsLastPeriod", "{{change}}% vs last period");
en("tradeData.tab.tradeVolume", "Trade Volume");
en("tradeData.tab.byCountry", "By Country");
en("tradeData.tab.byCategory", "By Category");
en("tradeData.tab.priceIndex", "Price Index");
en("tradeData.chart.importExportTrends", "Import/Export Trends");
en("tradeData.chart.importExportDesc", "Monthly trade volume in billions USD — {{region}}");
en("tradeData.chart.importsB", "Imports ($B)");
en("tradeData.chart.exportsB", "Exports ($B)");
en("tradeData.chart.imports", "Imports");
en("tradeData.chart.exports", "Exports");
en("tradeData.countryPlaceholder", "Country");
en("tradeData.hsCodePlaceholder", "HS code (e.g. 7408)");
en("tradeData.fetchComtrade", "Fetch UN Comtrade");
en("tradeData.loading", "Loading…");
en("tradeData.comtradeUnavailable", "UN Comtrade API not configured or unavailable. Showing regional estimates.");
en("tradeData.dataFrom", "Data from {{source}}");
en("tradeData.topImportOrigins", "Top Import Origins");
en("tradeData.topImportOriginsDesc", "Share of total imports by country — {{region}}");
en("tradeData.countryRankings", "Country Rankings");
en("tradeData.countryRankingsDesc", "Trade volume by country");
en("tradeData.tradeByCategory", "Trade by Product Category");
en("tradeData.tradeByCategoryDesc", "Import/Export comparison by category (billions USD) — {{region}}");
en("tradeData.searchCategories", "Search categories (e.g. ore, steel, textile)");
en("tradeData.noCategoriesMatch", "No categories match \"{{query}}\"");
en("tradeData.clearSearch", "Clear search");
en("tradeData.commodityPriceIndex", "Commodity Price Index");
en("tradeData.commodityComingSoon", "Live price trends — coming soon");
en("tradeData.comingSoon", "Coming Soon");
en("tradeData.comingSoonDesc", "Real-time commodity price indices for steel, copper, aluminum, and more. We're integrating with market data providers.");
en("tradeData.referencePrices", "Reference prices (static)");
en("tradeData.shippingRates", "Container Shipping Rates");
en("tradeData.shippingRatesDesc", "40ft container rates (USD) — {{region}} routes");
en("tradeData.container40ft", "40ft container");
en("tradeData.topSuppliers", "Top Verified Suppliers");
en("tradeData.topSuppliersDesc", "Registry-verified suppliers — {{region}}");
en("tradeData.marketAnalysis", "Market analysis");
en("tradeData.marketAnalysisDesc", "Trade data updates — {{region}}");
en("tradeData.externalSources", "External data sources");
en("tradeData.sourcingReportLink", "Sourcing report");
en("tradeData.ctaTitle", "Turn insights into action");
en("tradeData.ctaDesc", "Get structured sourcing reports, find verified suppliers, or analyze landed costs for any product.");
en("tradeData.getSourcingReport", "Get sourcing report");
en("tradeData.searchSuppliers", "Search Suppliers");
en("tradeData.supplyChainHealth", "Supply Chain Health");
en("tradeData.trendingCommodities", "Trending Commodities");
en("tradeData.insight.shippingAlert", "Shipping Alert");
en("tradeData.insight.priceTrend", "Price Trend");
en("tradeData.insight.supplierUpdate", "Supplier Update");
en("tradeData.insight.asiaPacificFocus", "Asia-Pacific Focus");
en("tradeData.insight.euTradeUpdate", "EU Trade Update");
en("tradeData.insight.usmcaUpdate", "USMCA Update");
en("tradeData.insight.sourcingOpportunity", "Sourcing Opportunity");
en("tradeData.insight.priceAlert", "Price Alert");
en("tradeData.insight.complianceUpdate", "Compliance Update");
en("tradeData.insight.routeOptimization", "Route Optimization");
en("tradeData.badge.highImpact", "High Impact");
en("tradeData.badge.actionNeeded", "Action Needed");
en("tradeData.badge.regulatory", "Regulatory");
en("tradeData.badge.costSaving", "Cost Saving");
en("tradeData.health.logistics", "Logistics");
en("tradeData.health.supplierReliability", "Supplier Reliability");
en("tradeData.health.portCongestion", "Port Congestion");
en("tradeData.health.regulatoryRisk", "Regulatory Risk");
en("tradeData.health.priceStability", "Price Stability");

add("tradeData.newSourcingReport", "Nuevo informe de sourcing", "Новый отчёт по закупкам", "新建采购报告", "新規ソーシングレポート");
add("tradeData.viewMyReports", "Ver mis informes →", "Мои отчёты →", "查看我的报告 →", "レポートを見る →");
add("tradeData.overviewTitle", "Resumen de datos comerciales", "Обзор торговых данных", "贸易数据概览", "貿易データ概要");
add("tradeData.metric.totalImports", "Importaciones totales", "Всего импорт", "总进口", "総輸入");
add("tradeData.metric.totalExports", "Exportaciones totales", "Всего экспорт", "总出口", "総輸出");
add("tradeData.metric.tradeBalance", "Balanza comercial", "Торговый баланс", "贸易差额", "貿易収支");
add("tradeData.metric.activeSuppliers", "Proveedores activos", "Активные поставщики", "活跃供应商", "アクティブサプライヤー");
add("tradeData.vsLastPeriod", "{{change}}% vs período anterior", "{{change}}% к прошлому периоду", "较上期 {{change}}%", "前期比 {{change}}%");
add("tradeData.tab.tradeVolume", "Volumen comercial", "Торговый объём", "贸易量", "貿易量");
add("tradeData.tab.byCountry", "Por país", "По странам", "按国家", "国別");
add("tradeData.tab.byCategory", "Por categoría", "По категориям", "按类别", "カテゴリ別");
add("tradeData.tab.priceIndex", "Índice de precios", "Индекс цен", "价格指数", "価格指数");
add("tradeData.chart.importExportTrends", "Tendencias import/export", "Тренды импорта/экспорта", "进出口趋势", "輸出入トレンド");
add("tradeData.chart.importExportDesc", "Volumen mensual en miles de millones USD — {{region}}", "Ежемесячный объём в млрд USD — {{region}}", "月度贸易额（十亿美元）— {{region}}", "月次貿易額（十億USD）— {{region}}");
add("tradeData.chart.importsB", "Importaciones ($B)", "Импорт ($B)", "进口 ($B)", "輸入 ($B)");
add("tradeData.chart.exportsB", "Exportaciones ($B)", "Экспорт ($B)", "出口 ($B)", "輸出 ($B)");
add("tradeData.chart.imports", "Importaciones", "Импорт", "进口", "輸入");
add("tradeData.chart.exports", "Exportaciones", "Экспорт", "出口", "輸出");
add("tradeData.countryPlaceholder", "País", "Страна", "国家", "国");
add("tradeData.hsCodePlaceholder", "Código HS (p. ej. 7408)", "Код HS (напр. 7408)", "HS 编码（例如 7408）", "HSコード（例: 7408）");
add("tradeData.fetchComtrade", "Obtener UN Comtrade", "Загрузить UN Comtrade", "获取 UN Comtrade", "UN Comtradeを取得");
add("tradeData.loading", "Cargando…", "Загрузка…", "加载中…", "読み込み中…");
add("tradeData.comtradeUnavailable", "API UN Comtrade no configurada. Mostrando estimaciones regionales.", "API UN Comtrade недоступна. Показаны региональные оценки.", "UN Comtrade API 未配置。显示区域估算。", "UN Comtrade API未設定。地域推定を表示。");
add("tradeData.dataFrom", "Datos de {{source}}", "Данные из {{source}}", "数据来源 {{source}}", "データ: {{source}}");
add("tradeData.topImportOrigins", "Principales orígenes de importación", "Топ стран импорта", "主要进口来源", "主要輸入原産地");
add("tradeData.topImportOriginsDesc", "Participación en importaciones totales — {{region}}", "Доля в общем импорте — {{region}}", "进口总额占比 — {{region}}", "総輸入シェア — {{region}}");
add("tradeData.countryRankings", "Ranking por país", "Рейтинг стран", "国家排名", "国別ランキング");
add("tradeData.countryRankingsDesc", "Volumen comercial por país", "Торговый объём по странам", "各国贸易量", "国別貿易量");
add("tradeData.tradeByCategory", "Comercio por categoría", "Торговля по категориям", "按产品类别贸易", "カテゴリ別貿易");
add("tradeData.tradeByCategoryDesc", "Comparación import/export por categoría (miles de millones USD) — {{region}}", "Сравнение импорта/экспорта по категориям (млрд USD) — {{region}}", "按类别进出口对比（十亿美元）— {{region}}", "カテゴリ別輸出入比較（十億USD）— {{region}}");
add("tradeData.searchCategories", "Buscar categorías (p. ej. mineral, acero)", "Поиск категорий (напр. руда, сталь)", "搜索类别（例如矿石、钢铁）", "カテゴリ検索（例: 鉱石、鋼）");
add("tradeData.noCategoriesMatch", "Ninguna categoría coincide con \"{{query}}\"", "Нет категорий по запросу \"{{query}}\"", "没有匹配 \"{{query}}\" 的类别", "「{{query}}」に一致するカテゴリなし");
add("tradeData.clearSearch", "Borrar búsqueda", "Очистить поиск", "清除搜索", "検索をクリア");
add("tradeData.commodityPriceIndex", "Índice de precios de materias primas", "Индекс цен на сырьё", "大宗商品价格指数", "コモディティ価格指数");
add("tradeData.commodityComingSoon", "Tendencias de precios en vivo — próximamente", "Цены в реальном времени — скоро", "实时价格趋势 — 即将推出", "リアルタイム価格 — 近日公開");
add("tradeData.comingSoon", "Próximamente", "Скоро", "即将推出", "近日公開");
add("tradeData.comingSoonDesc", "Índices de precios en tiempo real para acero, cobre, aluminio y más.", "Индексы цен на сталь, медь, алюминий и др. в реальном времени.", "钢铁、铜、铝等实时价格指数。正在对接市场数据。", "鉄鋼・銅・アルミ等のリアルタイム指数。データ連携中。");
add("tradeData.referencePrices", "Precios de referencia (estáticos)", "Справочные цены (статич.)", "参考价格（静态）", "参考価格（静的）");
add("tradeData.shippingRates", "Tarifas de contenedores", "Тарифы на контейнеры", "集装箱运价", "コンテナ運賃");
add("tradeData.shippingRatesDesc", "Tarifas contenedor 40ft (USD) — rutas {{region}}", "Тарифы 40ft (USD) — маршруты {{region}}", "40ft 集装箱运价 (USD) — {{region}} 航线", "40ftコンテナ料金 (USD) — {{region}}ルート");
add("tradeData.container40ft", "Contenedor 40ft", "Контейнер 40ft", "40ft 集装箱", "40ftコンテナ");
add("tradeData.topSuppliers", "Principales proveedores verificados", "Топ проверенных поставщиков", "顶级已验证供应商", "トップ認証サプライヤー");
add("tradeData.topSuppliersDesc", "Proveedores verificados en registro — {{region}}", "Поставщики, проверенные в реестре — {{region}}", "注册已验证供应商 — {{region}}", "登記確認済みサプライヤー — {{region}}");
add("tradeData.marketAnalysis", "Análisis de mercado", "Анализ рынка", "市场分析", "市場分析");
add("tradeData.marketAnalysisDesc", "Actualizaciones de datos comerciales — {{region}}", "Обновления торговых данных — {{region}}", "贸易数据更新 — {{region}}", "貿易データ更新 — {{region}}");
add("tradeData.externalSources", "Fuentes de datos externas", "Внешние источники данных", "外部数据来源", "外部データソース");
add("tradeData.sourcingReportLink", "Informe de sourcing", "Отчёт по закупкам", "采购报告", "ソーシングレポート");
add("tradeData.ctaTitle", "Convierta insights en acción", "Превратите аналитику в действия", "将洞察转化为行动", "インサイトを行動に");
add("tradeData.ctaDesc", "Obtenga informes estructurados, encuentre proveedores verificados o analice costes landed.", "Получайте структурированные отчёты, находите проверенных поставщиков или анализируйте landed cost.", "获取结构化采购报告、查找已验证供应商或分析到岸成本。", "構造化レポート、認証サプライヤー、ランデッドコスト分析。");
add("tradeData.getSourcingReport", "Obtener informe de sourcing", "Получить отчёт", "获取采购报告", "ソーシングレポートを取得");
add("tradeData.searchSuppliers", "Buscar proveedores", "Поиск поставщиков", "搜索供应商", "サプライヤーを検索");
add("tradeData.supplyChainHealth", "Salud de la cadena de suministro", "Здоровье цепочки поставок", "供应链健康度", "サプライチェーン健全性");
add("tradeData.trendingCommodities", "Materias primas en tendencia", "Трендовые товары", "热门大宗商品", "トレンドコモディティ");
add("tradeData.insight.shippingAlert", "Alerta de envío", "Предупреждение о доставке", "运输预警", "配送アラート");
add("tradeData.insight.priceTrend", "Tendencia de precios", "Ценовой тренд", "价格趋势", "価格トレンド");
add("tradeData.insight.supplierUpdate", "Actualización de proveedores", "Обновление поставщиков", "供应商更新", "サプライヤー更新");
add("tradeData.insight.asiaPacificFocus", "Enfoque Asia-Pacífico", "Фокус Азиатско-Тихоокеанского региона", "亚太焦点", "アジア太平洋フォーカス");
add("tradeData.insight.euTradeUpdate", "Actualización comercio UE", "Обновление торговли ЕС", "欧盟贸易更新", "EU貿易アップデート");
add("tradeData.insight.usmcaUpdate", "Actualización USMCA", "Обновление USMCA", "USMCA 更新", "USMCAアップデート");
add("tradeData.insight.sourcingOpportunity", "Oportunidad de sourcing", "Возможность закупок", "采购机会", "ソーシング機会");
add("tradeData.insight.priceAlert", "Alerta de precios", "Ценовое предупреждение", "价格预警", "価格アラート");
add("tradeData.insight.complianceUpdate", "Actualización de cumplimiento", "Обновление соответствия", "合规更新", "コンプライアンス更新");
add("tradeData.insight.routeOptimization", "Optimización de rutas", "Оптимизация маршрутов", "路线优化", "ルート最適化");
add("tradeData.badge.highImpact", "Alto impacto", "Высокое влияние", "高影响", "高インパクト");
add("tradeData.badge.actionNeeded", "Acción requerida", "Требуются действия", "需采取行动", "要対応");
add("tradeData.badge.regulatory", "Regulatorio", "Регуляторное", "监管", "規制");
add("tradeData.badge.costSaving", "Ahorro de costes", "Экономия затрат", "成本节约", "コスト削減");
add("tradeData.health.logistics", "Logística", "Логистика", "物流", "物流");
add("tradeData.health.supplierReliability", "Fiabilidad de proveedores", "Надёжность поставщиков", "供应商可靠性", "サプライヤー信頼性");
add("tradeData.health.portCongestion", "Congestión portuaria", "Загруженность портов", "港口拥堵", "港湾混雑");
add("tradeData.health.regulatoryRisk", "Riesgo regulatorio", "Регуляторный риск", "监管风险", "規制リスク");
add("tradeData.health.priceStability", "Estabilidad de precios", "Стабильность цен", "价格稳定性", "価格安定性");

en("tradeData.analysisInsight.sourcingOpportunity", "{{region}} suppliers show 12-18% cost advantage vs. established markets. Consider diversifying supply chain.");
en("tradeData.analysisInsight.priceAlert", "Copper prices up 32% YTD. Lock in contracts now or consider aluminum substitutes where possible. Forecast suggests continued upward pressure through Q3.");
en("tradeData.analysisInsight.complianceUpdate", "New EU Carbon Border Adjustment Mechanism (CBAM) affects steel, aluminum, and cement imports. Factor carbon costs into landed cost calculations.");
en("tradeData.analysisInsight.routeOptimization", "Rail freight via China-Europe corridor is 40% cheaper than air and 60% faster than sea for mid-weight shipments. Consider for time-sensitive orders under 5 tonnes.");
add("tradeData.analysisInsight.sourcingOpportunity", "Proveedores de {{region}} con ventaja de coste del 12-18%. Considere diversificar la cadena de suministro.", "Поставщики из {{region}} на 12–18% дешевле. Рассмотрите диверсификацию.", "{{region}} 供应商比成熟市场成本低 12-18%。考虑供应链多元化。", "{{region}}サプライヤーは既存市場比12-18%コスト優位。サプライチェーン分散を検討。");
add("tradeData.analysisInsight.priceAlert", "El cobre sube un 32% interanual. Cierre contratos o considere sustitutos de aluminio.", "Медь выросла на 32% с начала года. Заключайте контракты или рассмотрите алюминий.", "铜价年初至今上涨 32%。锁定合同或考虑铝替代。", "銅価格YTD+32%。契約固定またはアルミ代替を検討。");
add("tradeData.analysisInsight.complianceUpdate", "El CBAM de la UE afecta importaciones de acero, aluminio y cemento. Incluya costes de carbono.", "CBAM ЕС затрагивает сталь, алюминий и цемент. Учитывайте углеродные затраты.", "欧盟 CBAM 影响钢、铝、水泥进口。计入碳成本。", "EU CBAMは鉄鋼・アルミ・セメント輸入に影響。炭素コストを考慮。");
add("tradeData.analysisInsight.routeOptimization", "El ferrocarril China-Europa es 40% más barato que el aire y 60% más rápido que el mar para cargas medias.", "Ж/д Китай–Европа на 40% дешевле авиа и на 60% быстрее моря для средних грузов.", "中欧铁路比空运便宜 40%、比海运快 60%，适合 5 吨以下急单。", "中国-欧州鉄道は航空比40%安、海上比60%速い（5t未満向け）。");

en("agentPage.proactive.copperMessage", "Copper prices up 3.2% this week — consider locking in contracts with current suppliers.");
en("agentPage.proactive.aseanMessage", "New ASEAN–Turkey trade agreement reduces tariffs on textiles and electronics by 12%.");
en("agentPage.proactive.semiconductorMessage", "Supply chain disruption detected in Southeast Asia — semiconductor lead times extended 3 weeks.");
add("agentPage.proactive.copperMessage", "El cobre sube un 3,2% esta semana — considere fijar contratos con proveedores actuales.", "Медь выросла на 3,2% на этой неделе — рассмотрите фиксацию контрактов.", "本周铜价上涨 3.2% — 考虑与现有供应商锁定合同。", "今週銅+3.2% — 現行サプライヤーと契約固定を検討。");
add("agentPage.proactive.aseanMessage", "Nuevo acuerdo ASEAN–Turquía reduce aranceles en textiles y electrónica un 12%.", "Новое соглашение АСЕАН–Турция снижает пошлины на текстиль и электронику на 12%.", "新东盟-土耳其协定使纺织品和电子产品关税降低 12%。", "新ASEAN-トルコ協定で繊維・電子の関税12%減。");
add("agentPage.proactive.semiconductorMessage", "Interrupción en el sudeste asiático — plazos de semiconductores +3 semanas.", "Сбои в ЮВА — сроки поставки полупроводников +3 недели.", "东南亚供应链中断 — 半导体交期延长 3 周。", "東南アジアの混乱 — 半導体リードタイム+3週。");

const insightContent = {
  "global.shipping_alert": ["Container rates on Asia-US routes increased 7.5% this month due to port congestion in Los Angeles.", "Las tarifas de contenedor en rutas Asia-EE.UU. subieron un 7,5% por congestión en Los Ángeles.", "Тарифы на маршрутах Азия–США выросли на 7,5% из-за загруженности порта LA.", "本月亚欧-美国航线集装箱运价因洛杉矶港口拥堵上涨 7.5%。", "LA港混雑でアジア-USルートコンテナ料金+7.5%。"],
  "global.price_trend": ["Copper prices continue to climb, up 32% YTD. Consider hedging strategies for electronics sourcing.", "El cobre sigue subiendo, +32% interanual. Considere coberturas para electrónica.", "Медь продолжает расти, +32% с начала года. Рассмотрите хеджирование.", "铜价持续上涨，年初至今涨 32%。考虑电子采购对冲策略。", "銅価格上昇継続、YTD+32%。電子調達のヘッジを検討。"],
  "global.supplier_update": ["New verified suppliers added in Vietnam and Thailand offering competitive rates for textiles.", "Nuevos proveedores verificados en Vietnam y Tailandia con tarifas competitivas en textiles.", "Новые проверенные поставщики во Вьетнаме и Таиланде с конкурентными ценами на текстиль.", "越南和泰国新增已验证供应商，纺织品价格有竞争力。", "ベトナム・タイに認証サプライヤー追加、繊維で競争力。"],
  "asia.asia_pacific_focus": ["Vietnam continues to gain market share in textiles and electronics. Tariff shifts favor Vietnam over China for US-bound goods.", "Vietnam gana cuota en textiles y electrónica. Los aranceles favorecen Vietnam frente a China para EE.UU.", "Вьетнам наращивает долю в текстиле и электронике. Пошлины благоприятствуют Вьетнаму перед Китаем для США.", "越南在纺织品和电子产品市场份额持续上升。关税变化有利于越南替代中国输美。", "ベトナムが繊維・電子でシェア拡大。米向けは中国よりベトナムが有利。"],
  "asia.shipping_alert": ["Port congestion in Shanghai and Singapore affecting transit times. Consider booking 2 weeks early.", "Congestión en Shanghái y Singapur afecta tránsitos. Reserve con 2 semanas de antelación.", "Загруженность портов Шанхая и Сингапура. Бронируйте за 2 недели.", "上海和新加坡港口拥堵影响 transit 时间。建议提前 2 周订舱。", "上海・シンガポール港混雑。2週前の予約を。"],
  "asia.price_trend": ["Copper and aluminum prices up 12% in Asia. Electronics component costs rising.", "Cobre y aluminio +12% en Asia. Suben costes de componentes electrónicos.", "Медь и алюминий +12% в Азии. Растут цены на электронные компоненты.", "亚洲铜铝价格上涨 12%。电子元件成本上升。", "アジアで銅・アルミ+12%。電子部品コスト上昇。"],
  "europe.eu_trade_update": ["EU CBAM compliance requirements now in effect. Check carbon footprint for imported steel and aluminum.", "Requisitos CBAM de la UE en vigor. Verifique huella de carbono en acero y aluminio importados.", "Требования CBAM ЕС вступили в силу. Проверьте углеродный след стали и алюминия.", "欧盟 CBAM 合规要求已生效。检查进口钢铝碳足迹。", "EU CBAM要件発効。輸入鉄鋼・アルミのカーボンフットプリント確認。"],
  "europe.price_trend": ["European steel prices stable. EU-US trade agreements may reduce duties on select categories.", "Precios del acero europeo estables. Acuerdos UE-EE.UU. pueden reducir aranceles.", "Европейские цены на сталь стабильны. Соглашения ЕС–США могут снизить пошлины.", "欧洲钢价稳定。欧美贸易协定可能降低部分品类关税。", "欧州鉄鋼価格安定。EU-US協定で一部関税減の可能性。"],
  "europe.supplier_update": ["New verified suppliers in Poland and Slovakia offering competitive rates for electronics assembly.", "Nuevos proveedores verificados en Polonia y Eslovaquia para ensamblaje electrónico.", "Новые проверенные поставщики в Польше и Словакии для сборки электроники.", "波兰和斯洛伐克新增已验证供应商，电子组装价格有竞争力。", "ポーランド・スロバキアに認証サプライヤー追加、電子組立で競争力。"],
  "americas.usmca_update": ["USMCA rules of origin verified for 95% of auto parts. Mexico and Canada remain top sourcing partners.", "Reglas de origen USMCA verificadas para el 95% de autopartes. México y Canadá siguen siendo socios clave.", "Правила происхождения USMCA подтверждены для 95% автозапчастей. Мексика и Канада — ключевые партнёры.", "USMCA 原产地规则已验证 95% 汽车零部件。墨西哥和加拿大仍是主要采购伙伴。", "USMCA原産地規則、自動車部品95%確認。メキシコ・カナダが主要パートナー。"],
  "americas.shipping_alert": ["Port of LA/Long Beach congestion easing. Transit times from Asia improving by 3-5 days.", "Congestión en LA/Long Beach disminuye. Tránsitos desde Asia mejoran 3-5 días.", "Загруженность LA/Long Beach снижается. Сроки из Азии улучшились на 3–5 дней.", "洛杉矶/长滩港口拥堵缓解。亚洲 transit 时间缩短 3-5 天。", "LA/LB港混雑緩和。アジアから3-5日短縮。"],
  "americas.price_trend": ["Nearshoring to Mexico driving demand. Mexican supplier rates up 4% in Q4.", "Nearshoring a México impulsa demanda. Tarifas mexicanas +4% en Q4.", "Nearshoring в Мексику повышает спрос. Тарифы мексиканских поставщиков +4% в Q4.", "近岸外包至墨西哥推动需求。墨西哥供应商 Q4 费率上涨 4%。", "メキシコ近岸化で需要増。Q4でメキシコ料金+4%。"],
};
for (const [slug, vals] of Object.entries(insightContent)) {
  const fullKey = `tradeData.insightContent.${slug}`;
  en(fullKey, vals[0]);
  add(fullKey, vals[1], vals[2], vals[3], vals[4]);
}

// --- AI Agent page ---
en("agentPage.welcomeTitle", "Smart Sourcing Agent");
en("agentPage.welcomeDesc", "Operator-reviewed trade intelligence. Search leads, analyze markets, assess risks, and compare suppliers.");
en("agentPage.tryAsking", "Try asking");
en("agentPage.searchPlaceholder", "Search leads, research companies, analyze markets...");
en("agentPage.pipeline", "Pipeline");
en("agentPage.runPipelineTitle", "Run full pipeline");
en("agentPage.callScript", "Call Script");
en("agentPage.emailDraft", "Email Draft");
en("agentPage.research", "Research");
en("agentPage.marketAnalysis", "Market analysis");
en("agentPage.configuration", "Configuration");
en("agentPage.agentName", "Agent Name");
en("agentPage.emailSignature", "Email Signature");
en("agentPage.phoneScriptTone", "Phone Script Tone");
en("agentPage.emailTemplate", "Email Template");
en("agentPage.targetIndustries", "Target Industries");
en("agentPage.tone.professional", "Professional");
en("agentPage.tone.friendly", "Friendly");
en("agentPage.tone.direct", "Direct");
en("agentPage.template.formal", "Formal");
en("agentPage.template.casual", "Casual");
en("agentPage.template.sales", "Sales");
en("agentPage.pipelineProgress", "Pipeline Progress");
en("agentPage.pipelineComplete", "Complete");
en("agentPage.pipelineWaiting", "Waiting");
en("agentPage.leads", "Leads");
en("agentPage.generatedContent", "Generated Content");
en("agentPage.outputCall", "Call");
en("agentPage.outputEmail", "Email");
en("agentPage.status.draft", "Draft");
en("agentPage.status.ready", "Ready");
en("agentPage.status.sent", "Sent");
en("agentPage.copy", "Copy");
en("agentPage.cap.marketAnalysis.label", "Market analysis");
en("agentPage.cap.marketAnalysis.desc", "Trend analysis & price monitoring");
en("agentPage.cap.marketAnalysis.tooltip", "Get commodity price trends, market alerts, and trade flow insights.");
en("agentPage.cap.supplierDiscovery.label", "Supplier discovery");
en("agentPage.cap.supplierDiscovery.desc", "Find & qualify suppliers globally");
en("agentPage.cap.supplierDiscovery.tooltip", "Search registry-verified suppliers by product, region, and certification.");
en("agentPage.cap.riskAnalysis.label", "Risk Analysis");
en("agentPage.cap.riskAnalysis.desc", "Geopolitical & supply chain risks");
en("agentPage.cap.riskAnalysis.tooltip", "Assess geopolitical, financial, and ESG risks for suppliers and regions.");
en("agentPage.cap.costOptimization.label", "Cost Optimization");
en("agentPage.cap.costOptimization.desc", "Landed cost & shipping routes");
en("agentPage.cap.costOptimization.tooltip", "Calculate landed costs, compare shipping routes, and optimize total cost of ownership.");
en("agentPage.cap.tradeCompliance.label", "Trade Compliance");
en("agentPage.cap.tradeCompliance.desc", "HS codes, customs & regulations");
en("agentPage.cap.tradeCompliance.tooltip", "Look up HS codes, check tariffs, and verify regulatory requirements for target markets.");
en("agentPage.suggest.copperTrends", "Analyze copper market trends");
en("agentPage.suggest.vietnamSuppliers", "Find suppliers in Vietnam");
en("agentPage.suggest.shippingTurkey", "Compare shipping costs to Turkey");
en("agentPage.suggest.riskChina", "Generate risk assessment for China imports");
en("agentPage.suggest.complianceEu", "Research trade compliance for EU");
en("agentPage.suggest.landedElectronics", "Optimize landed costs for electronics");
en("agentPage.proactive.marketAlert", "Market Alert");
en("agentPage.proactive.opportunity", "Opportunity");
en("agentPage.proactive.riskAlert", "Risk Alert");
en("agentPage.pipeline.prospecting", "Prospecting");
en("agentPage.pipeline.enriching", "Enriching");
en("agentPage.pipeline.qualifying", "Qualifying");
en("agentPage.pipeline.outreach", "Outreach");
en("agentPage.pipeline.prospectingDesc", "Finding qualified leads");
en("agentPage.pipeline.enrichingDesc", "Gathering company intelligence");
en("agentPage.pipeline.qualifyingDesc", "Scoring & ranking leads");
en("agentPage.pipeline.outreachDesc", "Preparing personalized content");

add("agentPage.welcomeTitle", "Agente de sourcing inteligente", "Агент умных закупок", "智能采购代理", "スマートソーシングエージェント");
add("agentPage.welcomeDesc", "Inteligencia comercial revisada. Busque leads, analice mercados, evalúe riesgos y compare proveedores.", "Проверенная торговая аналитика. Поиск лидов, анализ рынков, оценка рисков и сравнение поставщиков.", "经审核的贸易情报。搜索线索、分析市场、评估风险并比较供应商。", "オペレーター確認済みの貿易インテリジェンス。リード検索、市場分析、リスク評価、サプライヤー比較。");
add("agentPage.tryAsking", "Pruebe preguntar", "Попробуйте спросить", "试试这样问", "質問例");
add("agentPage.searchPlaceholder", "Buscar leads, investigar empresas, analizar mercados...", "Поиск лидов, исследование компаний, анализ рынков...", "搜索线索、调研公司、分析市场...", "リード検索、企業調査、市場分析...");
add("agentPage.pipeline", "Pipeline", "Конвейер", "流水线", "パイプライン");
add("agentPage.runPipelineTitle", "Ejecutar pipeline completo", "Запустить полный pipeline", "运行完整流水线", "フルパイプライン実行");
add("agentPage.callScript", "Guion de llamada", "Скрипт звонка", "通话脚本", "通話スクリプト");
add("agentPage.emailDraft", "Borrador de email", "Черновик письма", "邮件草稿", "メール下書き");
add("agentPage.research", "Investigación", "Исследование", "调研", "リサーチ");
add("agentPage.marketAnalysis", "Análisis de mercado", "Анализ рынка", "市场分析", "市場分析");
add("agentPage.configuration", "Configuración", "Настройки", "配置", "設定");
add("agentPage.agentName", "Nombre del agente", "Имя агента", "代理名称", "エージェント名");
add("agentPage.emailSignature", "Firma de email", "Подпись email", "邮件签名", "メール署名");
add("agentPage.phoneScriptTone", "Tono del guion telefónico", "Тон телефонного скрипта", "电话脚本语气", "通話スクリプトのトーン");
add("agentPage.emailTemplate", "Plantilla de email", "Шаблон email", "邮件模板", "メールテンプレート");
add("agentPage.targetIndustries", "Industrias objetivo", "Целевые отрасли", "目标行业", "対象業界");
add("agentPage.tone.professional", "Profesional", "Профессиональный", "专业", "プロフェッショナル");
add("agentPage.tone.friendly", "Amigable", "Дружелюбный", "友好", "フレンドリー");
add("agentPage.tone.direct", "Directo", "Прямой", "直接", "ダイレクト");
add("agentPage.template.formal", "Formal", "Формальный", "正式", "フォーマル");
add("agentPage.template.casual", "Informal", "Неформальный", "随意", "カジュアル");
add("agentPage.template.sales", "Ventas", "Продажи", "销售", "セールス");
add("agentPage.pipelineProgress", "Progreso del pipeline", "Прогресс pipeline", "流水线进度", "パイプライン進捗");
add("agentPage.pipelineComplete", "Completo", "Завершено", "完成", "完了");
add("agentPage.pipelineWaiting", "En espera", "Ожидание", "等待中", "待機");
add("agentPage.leads", "Leads", "Лиды", "线索", "リード");
add("agentPage.generatedContent", "Contenido generado", "Сгенерированный контент", "生成的内容", "生成コンテンツ");
add("agentPage.outputCall", "Llamada", "Звонок", "通话", "通話");
add("agentPage.outputEmail", "Email", "Email", "邮件", "メール");
add("agentPage.status.draft", "Borrador", "Черновик", "草稿", "下書き");
add("agentPage.status.ready", "Listo", "Готов", "就绪", "準備完了");
add("agentPage.status.sent", "Enviado", "Отправлено", "已发送", "送信済み");
add("agentPage.copy", "Copiar", "Копировать", "复制", "コピー");
add("agentPage.cap.marketAnalysis.label", "Análisis de mercado", "Анализ рынка", "市场分析", "市場分析");
add("agentPage.cap.marketAnalysis.desc", "Análisis de tendencias y precios", "Анализ трендов и цен", "趋势分析与价格监控", "トレンド分析と価格モニタリング");
add("agentPage.cap.marketAnalysis.tooltip", "Obtenga tendencias de materias primas, alertas y flujos comerciales.", "Тренды сырья, рыночные оповещения и торговые потоки.", "获取大宗商品价格趋势、市场预警和贸易流洞察。", "コモディティ価格トレンド、市場アラート、貿易フロー。");
add("agentPage.cap.supplierDiscovery.label", "Descubrimiento de proveedores", "Поиск поставщиков", "供应商发现", "サプライヤー発見");
add("agentPage.cap.supplierDiscovery.desc", "Encuentre y califique proveedores globalmente", "Найдите и оцените поставщиков по всему миру", "全球查找和评估供应商", "世界中のサプライヤーを検索・評価");
add("agentPage.cap.supplierDiscovery.tooltip", "Busque proveedores verificados por producto, región y certificación.", "Поиск проверенных поставщиков по продукту, региону и сертификации.", "按产品、地区和认证搜索注册验证供应商。", "製品・地域・認証で登記確認済みサプライヤーを検索。");
add("agentPage.cap.riskAnalysis.label", "Análisis de riesgos", "Анализ рисков", "风险分析", "リスク分析");
add("agentPage.cap.riskAnalysis.desc", "Riesgos geopolíticos y de cadena de suministro", "Геополитические и логистические риски", "地缘政治与供应链风险", "地政学・サプライチェーンリスク");
add("agentPage.cap.riskAnalysis.tooltip", "Evalúe riesgos geopolíticos, financieros y ESG.", "Оцените геополитические, финансовые и ESG-риски.", "评估地缘政治、财务和 ESG 风险。", "地政学・財務・ESGリスクを評価。");
add("agentPage.cap.costOptimization.label", "Optimización de costes", "Оптимизация затрат", "成本优化", "コスト最適化");
add("agentPage.cap.costOptimization.desc", "Coste landed y rutas de envío", "Landed cost и маршруты доставки", "到岸成本与运输路线", "ランデッドコストと配送ルート");
add("agentPage.cap.costOptimization.tooltip", "Calcule costes landed y compare rutas de envío.", "Рассчитайте landed cost и сравните маршруты.", "计算到岸成本、比较运输路线并优化总拥有成本。", "ランデッドコスト計算、ルート比較、TCO最適化。");
add("agentPage.cap.tradeCompliance.label", "Cumplimiento comercial", "Торговое соответствие", "贸易合规", "貿易コンプライアンス");
add("agentPage.cap.tradeCompliance.desc", "Códigos HS, aduanas y regulaciones", "Коды HS, таможня и регулирование", "HS 编码、关税与法规", "HSコード、関税、規制");
add("agentPage.cap.tradeCompliance.tooltip", "Consulte códigos HS, aranceles y requisitos regulatorios.", "Поиск кодов HS, тарифов и регуляторных требований.", "查询 HS 编码、关税和目标市场监管要求。", "HSコード、関税、規制要件を確認。");
add("agentPage.suggest.copperTrends", "Analizar tendencias del mercado del cobre", "Анализ трендов рынка меди", "分析铜市场趋势", "銅市場トレンドを分析");
add("agentPage.suggest.vietnamSuppliers", "Encontrar proveedores en Vietnam", "Найти поставщиков во Вьетнаме", "查找越南供应商", "ベトナムのサプライヤーを検索");
add("agentPage.suggest.shippingTurkey", "Comparar costes de envío a Turquía", "Сравнить стоимость доставки в Турцию", "比较运往土耳其的运费", "トルコ向け配送コストを比較");
add("agentPage.suggest.riskChina", "Evaluación de riesgo para importaciones de China", "Оценка рисков импорта из Китая", "生成中国进口风险评估", "中国輸入のリスク評価");
add("agentPage.suggest.complianceEu", "Investigar cumplimiento comercial para la UE", "Исследовать соответствие для ЕС", "调研欧盟贸易合规", "EU向け貿易コンプライアンス調査");
add("agentPage.suggest.landedElectronics", "Optimizar costes landed para electrónica", "Оптимизировать landed cost для электроники", "优化电子产品到岸成本", "電子製品のランデッドコスト最適化");
add("agentPage.proactive.marketAlert", "Alerta de mercado", "Рыночное предупреждение", "市场预警", "市場アラート");
add("agentPage.proactive.opportunity", "Oportunidad", "Возможность", "机会", "機会");
add("agentPage.proactive.riskAlert", "Alerta de riesgo", "Предупреждение о рисках", "风险预警", "リスクアラート");
add("agentPage.pipeline.prospecting", "Prospección", "Поиск", "潜在客户开发", "見込み客探索");
add("agentPage.pipeline.enriching", "Enriquecimiento", "Обогащение", "信息丰富化", "情報収集");
add("agentPage.pipeline.qualifying", "Calificación", "Квалификация", "线索筛选", "選別");
add("agentPage.pipeline.outreach", "Contacto", "Контакт", "外联拓展", "アウトリーチ");
add("agentPage.pipeline.prospectingDesc", "Buscando leads cualificados", "Поиск квалифицированных лидов", "寻找合格线索", "適格リードを探索");
add("agentPage.pipeline.enrichingDesc", "Recopilando inteligencia empresarial", "Сбор информации о компаниях", "收集企业情报", "企業情報を収集");
add("agentPage.pipeline.qualifyingDesc", "Puntuación y clasificación de leads", "Оценка и ранжирование лидов", "线索评分与排名", "リードのスコアリングとランク付け");
add("agentPage.pipeline.outreachDesc", "Preparando contenido personalizado", "Подготовка персонализированного контента", "准备个性化内容", "パーソナライズコンテンツを準備");

const TR_OVERRIDE = {
  ...Object.fromEntries(Object.entries(EN_NEW).map(([k, v]) => {
    const trMap = {
      "landedCost.backToHome": "← Ana sayfaya dön",
      "landedCost.dashboard": "Panel",
      "landedCost.login": "Giriş",
      "landedCost.inputParameters": "Giriş parametreleri",
      "landedCost.inputDescription": "Ürün ve sevkiyat detaylarını girin",
      "landedCost.origin": "Menşe",
      "landedCost.destination": "Varış",
      "landedCost.shippingMethod": "Taşıma yöntemi",
      "landedCost.containerType": "Konteyner tipi",
      "landedCost.insuranceRate": "Sigorta oranı (%) — isteğe bağlı",
      "landedCost.originTransport": "Menşe taşıma ($)",
      "landedCost.destTransport": "Varış taşıma ($)",
      "landedCost.calculate": "Landed cost hesapla",
      "customsCalculator.productDetails": "Ürün detayları",
      "customsCalculator.productDetailsDesc": "Gümrük ücretlerini hesaplamak için ürün bilgilerinizi girin",
      "customsCalculator.emptyTitle": "Ürün detaylarını girin",
      "customsCalculator.emptyDesc": "Gümrük vergileri ve landed cost hesaplamak için formu doldurun",
      "tradeData.overviewTitle": "Ticaret verisi özeti",
      "tradeData.metric.totalImports": "Toplam ithalat",
      "tradeData.metric.totalExports": "Toplam ihracat",
      "tradeData.chart.importsB": "İthalat ($B)",
      "tradeData.chart.exportsB": "İhracat ($B)",
      "tradeData.shippingRates": "Konteyner navlun tarifeleri",
      "tradeData.topSuppliers": "En iyi doğrulanmış tedarikçiler",
      "tradeData.marketAnalysis": "Pazar analizi",
      "tradeData.ctaTitle": "İçgörüleri eyleme dönüştürün",
      "tradeData.getSourcingReport": "Tedarik raporu al",
      "tradeData.searchSuppliers": "Tedarikçi ara",
      "agentPage.welcomeTitle": "Akıllı tedarik ajanı",
      "agentPage.tryAsking": "Şunu deneyin",
      "agentPage.searchPlaceholder": "Lead ara, şirket araştır, pazar analiz et...",
      "agentPage.callScript": "Arama metni",
      "agentPage.emailDraft": "E-posta taslağı",
      "agentPage.research": "Araştırma",
      "agentPage.pipeline": "İş akışı",
    };
    return [k, trMap[k] ?? v];
  })),
};

function patchLocale(loc) {
  const fp = path.join(root, loc, "translation.json");
  const data = JSON.parse(fs.readFileSync(fp, "utf8"));
  const enFile = JSON.parse(fs.readFileSync(path.join(root, "en/translation.json"), "utf8"));
  let n = 0;
  if (loc === "en") {
    Object.assign(data, EN_NEW);
    n = Object.keys(EN_NEW).length;
  } else if (loc === "tr") {
    for (const [key, val] of Object.entries(EN_NEW)) {
      if (!data[key] || data[key] === enFile[key] || data[key] === EN_NEW[key]) {
        data[key] = TR_OVERRIDE[key] ?? val;
        n++;
      }
    }
  } else {
    for (const [key, trans] of Object.entries(KEY_TRANSLATIONS)) {
      const enVal = enFile[key] || EN_NEW[key];
      if (!enVal) continue;
      if (!data[key] || data[key] === enVal) {
        data[key] = trans[loc];
        n++;
      }
    }
    for (const [key, val] of Object.entries(EN_NEW)) {
      if (!data[key]) {
        data[key] = KEY_TRANSLATIONS[key]?.[loc] ?? val;
        n++;
      }
    }
  }
  fs.writeFileSync(fp, JSON.stringify(data, null, 2) + "\n");
  return n;
}

const enN = patchLocale("en");
for (const loc of ["es", "ru", "zh", "ja", "tr"]) {
  console.log(`${loc}: patched ${patchLocale(loc)} keys`);
}
console.log(`Wave2 panel locale: en +${enN}, total keys ${Object.keys(EN_NEW).length}`);

