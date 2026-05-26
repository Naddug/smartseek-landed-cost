#!/usr/bin/env node
/** Patch es/ru/zh/ja panel locale keys (billing, reports, tools, auth signup). */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "../client/public/locales");

const KEY_TRANSLATIONS = {};

function add(key, es, ru, zh, ja) {
  KEY_TRANSLATIONS[key] = { es, ru, zh, ja };
}

// billing
add("billing.page.title", "Facturación y créditos", "Биллинг и кредиты", "账单与积分", "請求とクレジット");
add("billing.page.subtitle", "Administre su suscripción y saldo de créditos.", "Управляйте подпиской и балансом кредитов.", "管理您的订阅和积分余额。", "サブスクリプションとクレジット残高を管理します。");
add("billing.checkout.payButton", "Pagar ${{amount}}", "Оплатить ${{amount}}", "支付 ${{amount}}", "${{amount}} を支払う");
add("billing.checkout.subscribeButton", "Suscribirse - $80/mes", "Подписаться — $80/мес.", "订阅 — $80/月", "登録 — $80/月");
add("billing.checkout.loadingMessage", "Espere mientras cargamos el pago...", "Подождите, загружаем оплату...", "正在加载结账，请稍候...", "チェックアウトを読み込んでいます...");
add("billing.checkout.purchaseTitle", "Comprar {{count}} crédito{{s}}", "Купить {{count}} кредит{{s}}", "购买 {{count}} 积分", "{{count}} クレジットを購入");
add("billing.checkout.subscribeTitle", "Suscribirse al plan mensual", "Подписаться на месячный план", "订阅月度计划", "月額プランに登録");
add("billing.error.initializePaymentFailed", "No se pudo iniciar el pago. Inténtelo de nuevo.", "Не удалось инициализировать оплату. Повторите попытку.", "无法初始化支付。请重试。", "支払いの初期化に失敗しました。再試行してください。");
add("billing.error.checkoutErrorTitle", "Error de pago", "Ошибка оплаты", "结账错误", "チェックアウトエラー");
add("billing.error.startCheckoutFailed", "No se pudo iniciar el pago. Inténtelo de nuevo.", "Не удалось начать оплату. Повторите попытку.", "无法开始结账。请重试。", "チェックアウトを開始できませんでした。再試行してください。");
add("billing.error.productsNotAvailable", "Productos no disponibles", "Продукты недоступны", "产品不可用", "商品が利用できません");
add("billing.error.subscriptionNotSetup", "El producto de suscripción aún no está configurado. Actualice la página.", "Подписка ещё не настроена. Обновите страницу.", "订阅产品尚未设置。请刷新页面。", "サブスクリプション商品が未設定です。ページを更新してください。");
add("billing.error.initializeSubscriptionFailed", "No se pudo iniciar la suscripción. Inténtelo de nuevo.", "Не удалось инициализировать подписку. Повторите попытку.", "无法初始化订阅。请重试。", "サブスクリプションの初期化に失敗しました。再試行してください。");
add("billing.error.subscriptionErrorTitle", "Error de suscripción", "Ошибка подписки", "订阅错误", "サブスクリプションエラー");
add("billing.creditBalance.title", "Saldo de créditos", "Баланс кредитов", "积分余额", "クレジット残高");
add("billing.creditBalance.subtitle", "Créditos totales disponibles", "Всего доступно кредитов", "可用积分总数", "利用可能なクレジット合計");
add("billing.creditBalance.monthlyLabel", "Créditos mensuales:", "Ежемесячные кредиты:", "月度积分：", "月間クレジット：");
add("billing.creditBalance.topupLabel", "Créditos adicionales:", "Дополнительные кредиты:", "充值积分：", "追加クレジット：");
add("billing.creditBalance.nextRefreshLabel", "Próxima renovación:", "Следующее обновление:", "下次刷新：", "次回更新：");
add("billing.currentPlan.title", "Plan actual", "Текущий план", "当前计划", "現在のプラン");
add("billing.currentPlan.monthlyText", "Tiene el plan mensual", "У вас месячный план", "您使用的是月度计划", "月額プランをご利用中");
add("billing.currentPlan.freeTrialText", "Tiene la prueba gratuita", "У вас бесплатная пробная версия", "您使用的是免费试用", "無料トライアルをご利用中");
add("billing.currentPlan.activeBadge", "Suscriptor activo", "Активная подписка", "活跃订阅", "有効な登録");
add("billing.currentPlan.freeBadge", "Prueba gratuita", "Бесплатная пробная версия", "免费试用", "無料トライアル");
add("billing.plans.monthlyTitle", "Plan mensual - $80/mes", "Месячный план — $80/мес.", "月度计划 — $80/月", "月額プラン — $80/月");
add("billing.plans.monthlyDescription", "10 créditos renovados cada mes de facturación. Cancele cuando quiera.", "10 кредитов обновляются каждый расчётный месяц. Отмена в любое время.", "每个账单月刷新 10 积分。随时可取消。", "請求月ごとに10クレジット更新。いつでも解約可能。");
add("billing.plans.manageButton", "Administrar suscripción", "Управлять подпиской", "管理订阅", "サブスクリプションを管理");
add("billing.plans.freeCreditsBadge", "Prueba gratuita: {{count}} créditos", "Бесплатная пробная версия: {{count}} кредитов", "免费试用：{{count}} 积分", "無料トライアル：{{count}} クレジット");
add("billing.plans.freeTrialDescription", "Cada usuario nuevo recibe 2 créditos gratis para probar SmartSeek. No se requiere tarjeta.", "Каждый новый пользователь получает 2 бесплатных кредита. Карта не требуется.", "每位新用户获得 2 个免费积分试用 SmartSeek。无需信用卡。", "新規ユーザーは2クレジット無料。クレジットカード不要。");
add("billing.plans.annualPrice", "$64/mes facturado como $768/año", "$64/мес. при оплате $768/год", "$64/月（按年 $768 计费）", "$64/月（年$768請求）");
add("billing.plans.monthlyPrice", "$80/mes", "$80/мес.", "$80/月", "$80/月");
add("billing.plans.refreshDescription", "Obtenga 10 créditos renovados cada mes. Cancele cuando quiera.", "10 кредитов обновляются каждый месяц. Отмена в любое время.", "每月刷新 10 积分。随时可取消。", "毎月10クレジット更新。いつでも解約可能。");
add("billing.plans.subscribeButton", "Suscribirse ahora", "Подписаться сейчас", "立即订阅", "今すぐ登録");
add("billing.interval.monthly", "Mensual", "Ежемесячно", "月度", "月額");
add("billing.interval.annual", "Anual", "Ежегодно", "年度", "年額");
add("billing.interval.saveBadge", "Ahorre 20%", "Экономия 20%", "省 20%", "20%お得");
add("billing.comparison.title", "Comparación de planes", "Сравнение планов", "计划对比", "プラン比較");
add("billing.comparison.subtitle", "Compare planes y elija el que mejor le convenga", "Сравните планы и выберите подходящий", "对比计划并选择适合您的方案", "プランを比較して選択");
add("billing.comparison.featureHeader", "Función", "Функция", "功能", "機能");
add("billing.comparison.freeHeader", "Gratis", "Бесплатно", "免费", "無料");
add("billing.comparison.monthlyHeader", "Pro mensual", "Pro месячный", "Pro 月度", "Pro 月額");
add("billing.comparison.annualHeader", "Pro anual", "Pro годовой", "Pro 年度", "Pro 年額");
add("billing.comparison.enterpriseHeader", "Empresa", "Корпоративный", "企业版", "エンタープライズ");
add("billing.comparison.creditsRow", "Créditos", "Кредиты", "积分", "クレジット");
add("billing.comparison.freeCredits", "2 de prueba", "2 пробных", "2 试用", "2 トライアル");
add("billing.comparison.monthlyCredits", "10/mes", "10/мес.", "10/月", "10/月");
add("billing.comparison.annualCredits", "10/mes", "10/мес.", "10/月", "10/月");
add("billing.comparison.enterpriseCredits", "Personalizado", "Индивидуально", "定制", "カスタム");
add("billing.comparison.priceRow", "Precio", "Цена", "价格", "価格");
add("billing.comparison.freePrice", "$0", "$0", "$0", "$0");
add("billing.comparison.monthlyPriceValue", "$80/mes", "$80/мес.", "$80/月", "$80/月");
add("billing.comparison.annualPriceValue", "$64/mes", "$64/мес.", "$64/月", "$64/月");
add("billing.comparison.enterprisePrice", "Contacto", "Связаться", "联系", "お問い合わせ");
add("billing.comparison.aiReportsRow", "Informes IA", "AI-отчёты", "AI 报告", "AIレポート");
add("billing.comparison.findLeadsRow", "Buscar leads", "Поиск лидов", "查找线索", "リード検索");
add("billing.comparison.supportRow", "Soporte", "Поддержка", "支持", "サポート");
add("billing.comparison.freeSupport", "Comunidad", "Сообщество", "社区", "コミュニティ");
add("billing.comparison.monthlySupport", "Correo", "Email", "邮件", "メール");
add("billing.comparison.annualSupport", "Correo", "Email", "邮件", "メール");
add("billing.comparison.enterpriseSupport", "Dedicado", "Персональный", "专属", "専任");
add("billing.tabs.buyCreditsTab", "Comprar créditos", "Купить кредиты", "购买积分", "クレジット購入");
add("billing.tabs.historyTab", "Historial de transacciones", "История транзакций", "交易历史", "取引履歴");
add("billing.credits.title", "Créditos de pago por uso", "Кредиты pay-as-you-go", "按量付费积分", "従量課金クレジット");
add("billing.credits.subtitle", "$10 por crédito - Nunca expiran", "$10 за кредит — не сгорают", "每积分 $10 — 永不过期", "1クレジット $10 — 有効期限なし");
add("billing.credits.neverExpiresFeature", "Los créditos nunca expiran", "Кредиты не сгорают", "积分永不过期", "クレジットは失効しません");
add("billing.credits.useAnyReportFeature", "Use para cualquier informe de sourcing", "Для любого отчёта по закупкам", "可用于任何采购报告", "任意のソーシングレポートに使用");
add("billing.credits.buyAnytimeFeature", "Compre cuando necesite más", "Покупайте когда нужно", "需要时随时购买", "必要な時にいつでも購入");
add("billing.credits.buyButton", "Comprar {{count}} crédito{{s}} - ${{amount}}", "Купить {{count}} кредит{{s}} — ${{amount}}", "购买 {{count}} 积分 — ${{amount}}", "{{count}} クレジットを購入 — ${{amount}}");
add("billing.creditsInfo.title", "Cómo funcionan los créditos", "Как работают кредиты", "积分如何运作", "クレジットの仕組み");
add("billing.creditsInfo.subtitle", "Entienda su sistema de créditos", "Как устроена система кредитов", "了解您的积分系统", "クレジットシステムの説明");
add("billing.creditsInfo.deductionTitle", "Orden de deducción de créditos", "Порядок списания кредитов", "积分扣减顺序", "クレジット消費順");
add("billing.creditsInfo.deductionDescription", "Al generar un informe, primero se usan los créditos mensuales. Los créditos adicionales solo se usan cuando se agotan los mensuales.", "При создании отчёта сначала используются месячные кредиты. Дополнительные — только после исчерпания месячных.", "生成报告时先使用月度积分，月度用完后才使用充值积分。", "レポート生成時は月間クレジットを優先消費。使い切った後に追加クレジット。");
add("billing.creditsInfo.monthlyTitle", "Créditos mensuales", "Ежемесячные кредиты", "月度积分", "月間クレジット");
add("billing.creditsInfo.monthlyDescription", "Con el plan mensual ($80/mes), recibe 10 créditos cada ciclo de facturación. Los créditos mensuales no se acumulan.", "С месячным планом ($80/мес.) — 10 кредитов каждый цикл. Месячные кредиты не переносятся.", "月度计划（$80/月）每账单周期 10 积分。月度积分不结转。", "月額プラン（$80/月）で請求サイクルごとに10クレジット。繰越不可。");
add("billing.creditsInfo.topupTitle", "Créditos adicionales", "Дополнительные кредиты", "充值积分", "追加クレジット");
add("billing.creditsInfo.topupDescription", "Créditos de pago por uso a $10 cada uno. Nunca expiran y se acumulan indefinidamente.", "Pay-as-you-go по $10 за кредит. Не сгорают и накапливаются.", "按量付费每积分 $10。永不过期，可无限累积。", "従量課金 $10/クレジット。失効せず無期限に蓄積。");
add("billing.history.title", "Historial de transacciones", "История транзакций", "交易历史", "取引履歴");
add("billing.history.dateHeader", "Fecha", "Дата", "日期", "日付");
add("billing.history.descriptionHeader", "Descripción", "Описание", "描述", "説明");
add("billing.history.typeHeader", "Tipo", "Тип", "类型", "種類");
add("billing.history.sourceHeader", "Origen", "Источник", "来源", "ソース");
add("billing.history.amountHeader", "Importe", "Сумма", "金额", "金額");
add("billing.history.noTransactions", "Aún no hay transacciones.", "Транзакций пока нет.", "暂无交易。", "取引はまだありません。");
add("billing.success.title", "¡Pago exitoso!", "Оплата прошла успешно!", "支付成功！", "支払いが完了しました！");

// tradeData
add("tradeData.title", "Panel de datos comerciales", "Панель торговых данных", "贸易数据面板", "貿易データダッシュボード");
add("tradeData.subtitleGlobal", "Información comercial global, tendencias de mercado e inteligencia de precios", "Глобальная торговая аналитика, рыночные тренды и ценовая разведка", "全球贸易洞察、市场趋势和定价情报", "グローバル貿易インサイト、市場トレンド、価格インテリジェンス");
add("tradeData.subtitleAsia", "Información comercial de Asia-Pacífico, tendencias e inteligencia de precios", "Торговая аналитика Азиатско-Тихоокеанского региона", "亚太贸易洞察、市场趋势和定价情报", "アジア太平洋の貿易インサイト");
add("tradeData.subtitleEurope", "Información comercial europea, tendencias e inteligencia de precios", "Европейская торговая аналитика", "欧洲贸易洞察、市场趋势和定价情报", "欧州の貿易インサイト");
add("tradeData.subtitleAmericas", "Información comercial de las Américas, tendencias e inteligencia de precios", "Торговая аналитика региона Америки", "美洲贸易洞察、市场趋势和定价情报", "アメリカ地域の貿易インサイト");
add("tradeData.export", "Exportar", "Экспорт", "导出", "エクスポート");
add("tradeData.exportSuccess", "Datos exportados correctamente", "Данные успешно экспортированы", "数据导出成功", "データをエクスポートしました");
add("tradeData.sourcingActivity", "Su actividad de sourcing", "Ваша закупочная активность", "您的采购活动", "ソーシング活動");
add("tradeData.fromReports", "Información de sus informes SmartSeek", "Данные из ваших отчётов SmartSeek", "来自 SmartSeek 报告的洞察", "SmartSeekレポートからのインサイト");
add("tradeData.reportsGenerated", "Informes generados", "Создано отчётов", "已生成报告", "生成レポート数");
add("tradeData.topRegions", "Regiones principales", "Топ регионов", "主要地区", "主要地域");
add("tradeData.noReportsYet", "Aún no hay informes generados", "Отчёты ещё не созданы", "尚未生成报告", "レポートはまだありません");
add("tradeData.commoditiesSourced", "Materias primas abastecidas", "Закупленные товары", "已采购商品", "調達コモディティ");
add("tradeData.noCommodities", "Aún no hay materias primas", "Товаров пока нет", "暂无商品", "コモディティはまだありません");
add("tradeData.insightsTitle", "Información de análisis comercial", "Аналитика торговых данных", "贸易分析洞察", "貿易分析インサイト");
add("tradeData.insightsDesc", "Análisis comercial estructurado basado en datos de mercado actuales", "Структурированный торговый анализ на основе текущих рыночных данных", "基于当前市场数据的结构化贸易分析", "現在の市場データに基づく構造化貿易分析");
add("tradeData.registryReviewed", "Revisado en registro", "Проверено в реестре", "注册已审核", "登記確認済み");
add("tradeData.orders", "{{count}} pedidos", "{{count}} заказов", "{{count}} 订单", "{{count}} 件の注文");
add("tradeData.time3m", "3 meses", "3 месяца", "3 个月", "3か月");
add("tradeData.time6m", "6 meses", "6 месяцев", "6 个月", "6か月");
add("tradeData.time12m", "12 meses", "12 месяцев", "12 个月", "12か月");
add("tradeData.timeYtd", "Año en curso", "С начала года", "年初至今", "年初来");
add("tradeData.regionGlobal", "Global", "Глобально", "全球", "グローバル");
add("tradeData.regionAsia", "Asia-Pacífico", "Азиатско-Тихоокеанский регион", "亚太", "アジア太平洋");
add("tradeData.regionEurope", "Europa", "Европа", "欧洲", "欧州");
add("tradeData.regionAmericas", "Américas", "Америка", "美洲", "アメリカ");

// riskPage
add("riskPage.title", "Evaluación de riesgos", "Оценка рисков", "风险评估", "リスク評価");
add("riskPage.subtitle", "Análisis estructurado de riesgos geopolíticos, financieros, de cadena de suministro y ESG", "Структурированный анализ геополитических, финансовых, логистических и ESG-рисков", "结构化的地缘政治、财务、供应链和 ESG 风险分析", "地政学・財務・サプライチェーン・ESGリスクの構造化分析");
add("riskPage.parameters", "Parámetros de análisis", "Параметры анализа", "分析参数", "分析パラメータ");
add("riskPage.supplierName", "Nombre del proveedor", "Название поставщика", "供应商名称", "サプライヤー名");
add("riskPage.country", "País", "Страна", "国家", "国");
add("riskPage.industry", "Industria", "Отрасль", "行业", "業界");
add("riskPage.products", "Productos", "Продукция", "产品", "製品");
add("riskPage.analyzing", "Analizando…", "Анализ…", "分析中…", "分析中…");
add("riskPage.analyze", "Analizar riesgo", "Анализировать риск", "分析风险", "リスクを分析");
add("riskPage.error", "No se pudo generar el análisis. Inténtelo de nuevo.", "Не удалось создать анализ. Повторите попытку.", "无法生成分析。请重试。", "分析を生成できませんでした。再試行してください。");
add("riskPage.whatWeAnalyze", "Qué analizamos", "Что мы анализируем", "我们分析的内容", "分析内容");
add("riskPage.whatWeAnalyzeDesc", "Introduzca los parámetros a la izquierda y haga clic en Analizar para obtener una evaluación de riesgo estructurada.", "Введите параметры слева и нажмите «Анализировать» для структурированной оценки рисков.", "在左侧输入参数并点击分析，获取结构化风险评估。", "左側にパラメータを入力し、分析をクリックして構造化リスク評価を取得。");
add("riskPage.analyzingFactors", "Analizando factores de riesgo…", "Анализ факторов риска…", "正在分析风险因素…", "リスク要因を分析中…");
add("riskPage.scanningData", "Revisando señales geopolíticas, financieras, logísticas y ESG", "Проверка геополитических, финансовых, логистических и ESG-сигналов", "审查地缘政治、财务、供应链和 ESG 信号", "地政学・財務・サプライチェーン・ESGシグナルを確認中");
add("riskPage.overallAssessment", "Evaluación general de riesgo", "Общая оценка риска", "总体风险评估", "総合リスク評価");
add("riskPage.riskLabel", "Riesgo {{level}}", "Риск {{level}}", "{{level}} 风险", "{{level}} リスク");
add("riskPage.recommendations", "Recomendaciones", "Рекомендации", "建议", "推奨事項");
add("riskPage.tradeRestrictions", "Restricciones comerciales", "Торговые ограничения", "贸易限制", "貿易制限");
add("riskPage.alternativeRegions", "Regiones de sourcing alternativas", "Альтернативные регионы закупок", "替代采购地区", "代替ソーシング地域");

// compliancePage
add("compliancePage.title", "Control de cumplimiento", "Проверка соответствия", "合规检查", "コンプライアンスチェック");
add("compliancePage.subtitle", "Controles de certificación respaldados por registro, alcance regulatorio y cribado de sanciones", "Проверки сертификации на основе реестра, регуляторный охват и санкционный скрининг", "注册支持的认证检查、监管范围与制裁筛查", "登記裏付けの認証チェック、規制範囲、制裁スクリーニング");
add("compliancePage.parameters", "Parámetros de control", "Параметры проверки", "检查参数", "チェックパラメータ");
add("compliancePage.run", "Ejecutar control de cumplimiento", "Запустить проверку соответствия", "运行合规检查", "コンプライアンスチェックを実行");
add("compliancePage.checking", "Comprobando…", "Проверка…", "检查中…", "確認中…");
add("compliancePage.checksTitle", "Controles ejecutados automáticamente", "Автоматически выполняемые проверки", "自动执行的检查", "自動実行されるチェック");
add("compliancePage.checksDesc", "Introduzca los datos del proveedor y ejecute el control:", "Введите данные поставщика и запустите проверку:", "输入供应商信息并运行检查：", "サプライヤー情報を入力してチェックを実行：");
add("compliancePage.overview", "Resumen de cumplimiento", "Обзор соответствия", "合规概览", "コンプライアンス概要");

// reports
add("reports.statusComplete", "Completado", "Завершено", "完成", "完了");
add("reports.statusFailed", "Fallido", "Ошибка", "失败", "失敗");
add("reports.statusProcessing", "Procesando", "Обработка", "处理中", "処理中");
add("reports.statusPending", "Pendiente", "Ожидание", "待处理", "保留中");
add("reports.landedCostPerUnit", "Coste landed/unidad", "Landed cost/ед.", "到岸成本/单位", "ランデッドコスト/単位");
add("reports.estMargin", "Margen est. %", "Оцен. маржа %", "预估利润率 %", "推定マージン %");
add("reports.suppliersCount", "Proveedores", "Поставщики", "供应商", "サプライヤー");
add("reports.viewFullReport", "Ver informe completo", "Открыть полный отчёт", "查看完整报告", "レポート全文を見る");
add("reports.generating", "Generando…", "Создание…", "生成中…", "生成中…");
add("reports.retryBtn", "↻ Reintentar", "↻ Повторить", "↻ 重试", "↻ 再試行");
add("reports.view", "Ver", "Просмотр", "查看", "表示");
add("reports.generationFailed", "Error al generar el informe. Revise su consulta e inténtelo de nuevo.", "Не удалось создать отчёт. Проверьте запрос и повторите.", "报告生成失败。请检查查询并重试。", "レポート生成に失敗しました。クエリを確認して再試行してください。");

// auth signup
add("auth.accountType", "Tipo de cuenta", "Тип аккаунта", "账户类型", "アカウント種別");
add("auth.procurementBuyer", "Comprador de procurement", "Закупщик", "采购买家", "調達バイヤー");
add("auth.supplierRole", "Proveedor", "Поставщик", "供应商", "サプライヤー");
add("auth.and", "y", "и", "和", "および");
add("auth.privacyPolicy", "Política de privacidad", "Политика конфиденциальности", "隐私政策", "プライバシーポリシー");
add("auth.supplierOnboardingTitle", "Detalles de incorporación del proveedor", "Данные для онбординга поставщика", "供应商入驻详情", "サプライヤーオンボーディング詳細");
add("auth.supplierVerificationNote", "Las solicitudes de proveedor son verificación primero. Podemos solicitar documentos registrales antes del listado.", "Заявки поставщиков проходят проверку. Мы можем запросить реестровые документы до публикации.", "供应商申请以验证为先。上架前我们可能要求注册文件。", "サプライヤー申請は検証優先。掲載前に登記書類を求める場合があります。");
add("auth.validation.accountTypeRequired", "Seleccione un tipo de cuenta", "Выберите тип аккаунта", "请选择账户类型", "アカウント種別を選択してください");
add("auth.validation.supplierCompanyRequired", "El nombre legal de la empresa es obligatorio", "Требуется юридическое название компании", "公司法定名称为必填项", "会社の正式名称は必須です");
add("auth.validation.supplierCountryRequired", "El país o región es obligatorio", "Требуется страна или регион", "国家或地区为必填项", "国または地域は必須です");
add("auth.validation.supplierCategoriesRequired", "Las categorías suministradas son obligatorias", "Требуются категории поставок", "供应类别为必填项", "供給カテゴリは必須です");
add("auth.validation.supplierMoqRequired", "La capacidad de pedido mínimo es obligatoria", "Требуется минимальный объём заказа", "最小订购能力为必填项", "最小発注能力は必須です");

add("common.chooseFile", "Elegir archivo", "Выбрать файл", "选择文件", "ファイルを選択");
add("common.noFileChosen", "Ningún archivo seleccionado", "Файл не выбран", "未选择文件", "ファイル未選択");

// shippingEstimator
add("shippingEstimator.title", "Estimador de costes de envío", "Калькулятор стоимости доставки", "运费估算器", "配送コスト見積もり");
add("shippingEstimator.subtitle", "Compare tarifas de envío marítimo, aéreo y mensajería express. Usa tarifas de referencia del mercado (Freightos/Xeneta 2024) para su ruta.", "Сравните тарифы морской, авиа и экспресс-доставки. Используются рыночные бенчмарки (Freightos/Xeneta 2024).", "对比海运、空运和快递费率。使用市场基准费率（Freightos/Xeneta 2024）。", "海上・航空・エクスプレスの料金を比較。市場ベンチマーク（Freightos/Xeneta 2024）を使用。");
add("shippingEstimator.shipmentDetails", "Detalles del envío", "Детали отправки", "货运详情", "出荷詳細");
add("shippingEstimator.originCountry", "País de origen", "Страна отправления", "原产国", "原産国");
add("shippingEstimator.destinationCountry", "País de destino", "Страна назначения", "目的国", "仕向国");
add("shippingEstimator.totalWeight", "Peso total (kg)", "Общий вес (кг)", "总重量 (kg)", "総重量 (kg)");
add("shippingEstimator.dimensions", "Dimensiones (cm)", "Габариты (см)", "尺寸 (cm)", "寸法 (cm)");
add("shippingEstimator.containerType", "Tipo de contenedor (mar)", "Тип контейнера (море)", "集装箱类型（海运）", "コンテナ種別（海上）");
add("shippingEstimator.getRates", "Obtener tarifas de envío", "Получить тарифы доставки", "获取运费", "配送料金を取得");
add("shippingEstimator.gettingRates", "Obteniendo tarifas...", "Получение тарифов...", "正在获取费率...", "料金を取得中...");
add("shippingEstimator.saveToReports", "Guardar en informes", "Сохранить в отчёты", "保存到报告", "レポートに保存");
add("shippingEstimator.downloadPdf", "Descargar PDF", "Скачать PDF", "下载 PDF", "PDFをダウンロード");
add("shippingEstimator.seaFreight", "Transporte marítimo", "Морская перевозка", "海运", "海上輸送");
add("shippingEstimator.airFreight", "Transporte aéreo", "Авиаперевозка", "空运", "航空輸送");
add("shippingEstimator.expressCourier", "Mensajería express", "Экспресс-курьер", "快递", "エクスプレス");
add("shippingEstimator.saved", "¡Guardado!", "Сохранено!", "已保存！", "保存しました！");
add("shippingEstimator.savedDesc", "Estimación de envío guardada en sus informes.", "Оценка доставки сохранена в отчёты.", "运费估算已保存到报告。", "配送見積もりをレポートに保存しました。");
add("shippingEstimator.error", "Error", "Ошибка", "错误", "エラー");
add("shippingEstimator.saveFailed", "No se pudo guardar la estimación. Inténtelo de nuevo.", "Не удалось сохранить оценку. Повторите попытку.", "无法保存估算。请重试。", "見積もりを保存できませんでした。再試行してください。");

// customsCalculator
add("customsCalculator.title", "Calculadora de aranceles", "Калькулятор таможенных пошлин", "关税计算器", "関税計算機");
add("customsCalculator.subtitle", "Estime aranceles de importación, IVA y coste landed para su ruta comercial.", "Оцените импортные пошлины, НДС и landed cost для вашего торгового маршрута.", "估算进口关税、增值税和到岸成本。", "輸入関税、VAT、ランデッドコストを見積もり。");
add("customsCalculator.calculate", "Calcular aranceles", "Рассчитать пошлины", "计算关税", "関税を計算");
add("customsCalculator.calculating", "Calculando...", "Расчёт...", "计算中...", "計算中...");
add("customsCalculator.saveToReports", "Guardar en informes", "Сохранить в отчёты", "保存到报告", "レポートに保存");
add("customsCalculator.downloadPdf", "Descargar PDF", "Скачать PDF", "下载 PDF", "PDFをダウンロード");
add("customsCalculator.saved", "¡Guardado!", "Сохранено!", "已保存！", "保存しました！");
add("customsCalculator.savedDesc", "Cálculo guardado en sus informes.", "Расчёт сохранён в отчёты.", "计算已保存到报告。", "計算をレポートに保存しました。");
add("customsCalculator.saveFailed", "No se pudo guardar el cálculo. Inténtelo de nuevo.", "Не удалось сохранить расчёт. Повторите попытку.", "无法保存计算。请重试。", "計算を保存できませんでした。再試行してください。");
add("customsCalculator.error", "Error", "Ошибка", "错误", "エラー");

// reports extras (phase-f keys that were EN-copied to es/ru/zh/ja)
add("reports.useSmartseekai", "Genere su primer informe de sourcing estructurado para comparar proveedores verificados.", "Создайте первый структурированный отчёт по закупкам для сравнения проверенных поставщиков.", "生成您的首份结构化采购报告，比较已验证供应商。", "検証済みサプライヤーを比較する最初の構造化ソーシングレポートを生成。");
add("signup.benefitReports", "Informes de sourcing estructurados", "Структурированные отчёты по закупкам", "结构化采购报告", "構造化ソーシングレポート");
add("signup.benefitCredits", "10 créditos gratis para empezar", "10 бесплатных кредитов для старта", "10 个免费积分起步", "開始用10無料クレジット");
add("signup.benefitNoCard", "No se requiere tarjeta de crédito", "Кредитная карта не требуется", "无需信用卡", "クレジットカード不要");
add("reports.chartNoRatings", "Compare MOQ, plazo y Incoterms — contacte proveedores para precios.", "Сравните MOQ, сроки и Incoterms — уточняйте цены у поставщиков.", "比较 MOQ、交期和 Incoterms — 联系供应商获取报价。", "MOQ・リードタイム・Incotermsを比較 — 価格はサプライヤーにお問い合わせ。");
add("reports.verificationTier", "Verificación", "Верификация", "验证", "検証");
add("reports.deleteTitle", "¿Eliminar informe?", "Удалить отчёт?", "删除报告？", "レポートを削除しますか？");
add("reports.deleteDesc", "Esta acción no se puede deshacer.", "Это действие нельзя отменить.", "此操作无法撤销。", "この操作は元に戻せません。");
add("reports.cancel", "Cancelar", "Отмена", "取消", "キャンセル");
add("reports.delete", "Eliminar", "Удалить", "删除", "削除");
add("reports.deleted", "Informe eliminado", "Отчёт удалён", "报告已删除", "レポートを削除しました");
add("reports.deleteFailed", "No se pudo eliminar", "Не удалось удалить", "删除失败", "削除に失敗しました");
add("reports.copied", "Copiado", "Скопировано", "已复制", "コピーしました");
add("reports.copiedFull", "Copiado al portapapeles", "Скопировано в буфер обмена", "已复制到剪贴板", "クリップボードにコピーしました");
add("reports.exportPdf", "Exportar PDF", "Экспорт PDF", "导出 PDF", "PDFをエクスポート");
add("reports.generatingPdf", "Generando PDF…", "Создание PDF…", "正在生成 PDF…", "PDFを生成中…");
add("reports.createWorkflow", "Crear flujo con el equipo de sourcing", "Создать workflow с командой закупок", "与采购团队创建工作流", "ソーシングチームでワークフローを作成");
add("reports.dataNotGenerated", "No se pudieron generar los datos del informe. Inténtelo de nuevo.", "Не удалось создать данные отчёта. Повторите попытку.", "无法生成报告数据。请重试。", "レポートデータを生成できませんでした。再試行してください。");
add("reports.pdf.title", "Informe de sourcing SmartSeek", "Отчёт SmartSeek по закупкам", "SmartSeek 采购报告", "SmartSeek ソーシングレポート");
add("reports.pdf.generated", "Generado", "Создан", "生成于", "生成日");
add("reports.pdf.tradeRoute", "Ruta comercial", "Торговый маршрут", "贸易路线", "貿易ルート");
add("reports.pdf.executiveSummary", "RESUMEN EJECUTIVO", "ИСПОЛНИТЕЛЬНОЕ РЕЗЮМЕ", "执行摘要", "エグゼクティブサマリー");
add("reports.pdf.productClassification", "CLASIFICACIÓN DEL PRODUCTO", "КЛАССИФИКАЦИЯ ПРОДУКТА", "产品分类", "製品分類");
add("reports.pdf.customsDuties", "ARANCELES Y TASAS ADUANERAS", "ТАМОЖЕННЫЕ ПОШЛИНЫ И СБОРЫ", "关税与费用", "関税と手数料");
add("reports.pdf.landedCost", "DESGLOSE DE COSTE LANDED", "РАЗБИВКА LANDED COST", "到岸成本明细", "ランデッドコスト内訳");
add("reports.pdf.profitAnalysis", "ANÁLISIS DE BENEFICIOS", "АНАЛИЗ ПРИБЫЛИ", "利润分析", "利益分析");
add("reports.pdf.supplierComparison", "COMPARACIÓN DE PROVEEDORES", "СРАВНЕНИЕ ПОСТАВЩИКОВ", "供应商对比", "サプライヤー比較");
add("reports.pdf.riskAssessment", "EVALUACIÓN DE RIESGOS", "ОЦЕНКА РИСКОВ", "风险评估", "リスク評価");
add("reports.pdf.recommendations", "RECOMENDACIONES", "РЕКОМЕНДАЦИИ", "建议", "推奨事項");
add("reports.pdf.nextSteps", "PRÓXIMOS PASOS", "СЛЕДУЮЩИЕ ШАГИ", "后续步骤", "次のステップ");
add("reports.pdf.verification", "Verificación", "Верификация", "验证", "検証");
add("reports.pdf.leadTime", "Plazo", "Срок поставки", "交期", "リードタイム");
add("reports.pdf.footer", "Generado por SmartSeek — Inteligencia de sourcing estructurada", "Создано SmartSeek — структурированная закупочная аналитика", "由 SmartSeek 生成 — 结构化采购情报", "SmartSeek により生成 — 構造化ソーシングインテリジェンス");
add("reports.pdf.page", "Página {{current}} / {{total}}", "Страница {{current}} / {{total}}", "第 {{current}} / {{total}} 页", "{{current}} / {{total}} ページ");

// landedCost
add("landedCost.title", "Calculadora de coste landed", "Калькулятор landed cost", "到岸成本计算器", "ランデッドコスト計算機");
add("landedCost.subtitle", "Calcule el coste total de importación incluyendo flete, aranceles, IVA y seguro.", "Рассчитайте полную стоимость импорта: фрахт, пошлины, НДС и страховка.", "计算包括运费、关税、增值税和保险在内的总进口成本。", "運賃・関税・VAT・保険を含む総輸入コストを計算。");
add("landedCost.productName", "Nombre del producto", "Название продукта", "产品名称", "製品名");
add("landedCost.calculate", "Calcular coste landed", "Рассчитать landed cost", "计算到岸成本", "ランデッドコストを計算");
add("landedCost.calculating", "Calculando...", "Расчёт...", "计算中...", "計算中...");

const EN_NEW = {
  "reports.statusComplete": "Complete",
  "reports.statusFailed": "Failed",
  "reports.statusProcessing": "Processing",
  "reports.statusPending": "Pending",
  "reports.landedCostPerUnit": "Landed Cost/Unit",
  "reports.estMargin": "Est. Margin %",
  "reports.suppliersCount": "Suppliers",
  "reports.viewFullReport": "View Full Report",
  "reports.generating": "Generating…",
  "reports.retryBtn": "↻ Retry",
  "reports.view": "View",
  "reports.generationFailed": "Report generation failed. Check your query and retry.",
  "auth.accountType": "Account Type",
  "auth.procurementBuyer": "Procurement Buyer",
  "auth.supplierRole": "Supplier",
  "auth.and": "and",
  "auth.privacyPolicy": "Privacy Policy",
  "auth.supplierOnboardingTitle": "Supplier onboarding details",
  "auth.supplierVerificationNote": "Supplier applications are verification-first. We may request registry documents before listing.",
  "auth.validation.accountTypeRequired": "Please select account type",
  "auth.validation.supplierCompanyRequired": "Legal company name is required",
  "auth.validation.supplierCountryRequired": "Country or region is required",
  "auth.validation.supplierCategoriesRequired": "Categories supplied are required",
  "auth.validation.supplierMoqRequired": "Minimum order capability is required",
  "common.chooseFile": "Choose File",
  "common.noFileChosen": "No file chosen",
  "shippingEstimator.title": "Shipping Cost Estimator",
  "shippingEstimator.subtitle": "Compare shipping rates for sea freight, air freight, and express courier. Uses real market benchmark rates (Freightos/Xeneta 2024) for your route.",
  "shippingEstimator.shipmentDetails": "Shipment Details",
  "shippingEstimator.originCountry": "Origin Country",
  "shippingEstimator.destinationCountry": "Destination Country",
  "shippingEstimator.totalWeight": "Total Weight (kg)",
  "shippingEstimator.dimensions": "Dimensions (cm)",
  "shippingEstimator.containerType": "Container Type (Sea)",
  "shippingEstimator.getRates": "Get Shipping Rates",
  "shippingEstimator.gettingRates": "Getting Rates...",
  "shippingEstimator.saveToReports": "Save to Reports",
  "shippingEstimator.downloadPdf": "Download PDF",
  "shippingEstimator.seaFreight": "Sea Freight",
  "shippingEstimator.airFreight": "Air Freight",
  "shippingEstimator.expressCourier": "Express Courier",
  "shippingEstimator.saved": "Saved!",
  "shippingEstimator.savedDesc": "Shipping estimate saved to your reports.",
  "shippingEstimator.error": "Error",
  "shippingEstimator.saveFailed": "Failed to save estimate. Please try again.",
  "customsCalculator.title": "Customs Duty Calculator",
  "customsCalculator.subtitle": "Estimate import duties, VAT, and landed cost for your trade route.",
  "customsCalculator.calculate": "Calculate Duties",
  "customsCalculator.calculating": "Calculating...",
  "customsCalculator.saveToReports": "Save to Reports",
  "customsCalculator.downloadPdf": "Download PDF",
  "customsCalculator.saved": "Saved!",
  "customsCalculator.savedDesc": "Calculation saved to your reports.",
  "customsCalculator.saveFailed": "Failed to save calculation. Please try again.",
  "customsCalculator.error": "Error",
  "landedCost.title": "Landed Cost Calculator",
  "landedCost.subtitle": "Calculate total import cost including freight, duties, VAT, and insurance.",
  "landedCost.productName": "Product name",
  "landedCost.calculate": "Calculate Landed Cost",
  "landedCost.calculating": "Calculating...",
};

const TR_OVERRIDE = {
  "reports.statusComplete": "Tamamlandı",
  "reports.statusFailed": "Başarısız",
  "reports.statusProcessing": "İşleniyor",
  "reports.statusPending": "Beklemede",
  "reports.landedCostPerUnit": "Birim landed cost",
  "reports.estMargin": "Tah. marj %",
  "reports.suppliersCount": "Tedarikçiler",
  "reports.viewFullReport": "Tam raporu görüntüle",
  "reports.generating": "Oluşturuluyor…",
  "reports.retryBtn": "↻ Yeniden dene",
  "reports.view": "Görüntüle",
  "reports.generationFailed": "Rapor oluşturulamadı. Sorgunuzu kontrol edip tekrar deneyin.",
  "auth.accountType": "Hesap türü",
  "auth.procurementBuyer": "Tedarik alıcısı",
  "auth.supplierRole": "Tedarikçi",
  "auth.and": "ve",
  "auth.privacyPolicy": "Gizlilik Politikası",
  "auth.supplierOnboardingTitle": "Tedarikçi onboarding detayları",
  "auth.supplierVerificationNote": "Tedarikçi başvuruları önce doğrulamadan geçer. Listelemeden önce sicil belgeleri isteyebiliriz.",
  "auth.validation.accountTypeRequired": "Lütfen hesap türü seçin",
  "auth.validation.supplierCompanyRequired": "Yasal şirket adı gerekli",
  "auth.validation.supplierCountryRequired": "Ülke veya bölge gerekli",
  "auth.validation.supplierCategoriesRequired": "Tedarik edilen kategoriler gerekli",
  "auth.validation.supplierMoqRequired": "Minimum sipariş kapasitesi gerekli",
  "common.chooseFile": "Dosya seç",
  "common.noFileChosen": "Dosya seçilmedi",
  "shippingEstimator.title": "Kargo maliyeti tahmini",
  "shippingEstimator.subtitle": "Deniz, hava ve express kurye tarifelerini karşılaştırın. Rotanız için gerçek pazar referans tarifeleri (Freightos/Xeneta 2024) kullanılır.",
  "shippingEstimator.shipmentDetails": "Gönderi detayları",
  "shippingEstimator.originCountry": "Menşe ülke",
  "shippingEstimator.destinationCountry": "Varış ülkesi",
  "shippingEstimator.totalWeight": "Toplam ağırlık (kg)",
  "shippingEstimator.dimensions": "Boyutlar (cm)",
  "shippingEstimator.containerType": "Konteyner tipi (deniz)",
  "shippingEstimator.getRates": "Kargo tarifelerini al",
  "shippingEstimator.gettingRates": "Tarifeler alınıyor...",
  "shippingEstimator.saveToReports": "Raporlara kaydet",
  "shippingEstimator.downloadPdf": "PDF indir",
  "shippingEstimator.seaFreight": "Deniz taşımacılığı",
  "shippingEstimator.airFreight": "Hava taşımacılığı",
  "shippingEstimator.expressCourier": "Express kurye",
  "shippingEstimator.saved": "Kaydedildi!",
  "shippingEstimator.savedDesc": "Kargo tahmini raporlarınıza kaydedildi.",
  "shippingEstimator.error": "Hata",
  "shippingEstimator.saveFailed": "Tahmin kaydedilemedi. Lütfen tekrar deneyin.",
  "customsCalculator.title": "Gümrük vergisi hesaplayıcı",
  "customsCalculator.subtitle": "Ticaret rotanız için ithalat vergileri, KDV ve landed cost tahmini.",
  "customsCalculator.calculate": "Vergileri hesapla",
  "customsCalculator.calculating": "Hesaplanıyor...",
  "customsCalculator.saveToReports": "Raporlara kaydet",
  "customsCalculator.downloadPdf": "PDF indir",
  "customsCalculator.saved": "Kaydedildi!",
  "customsCalculator.savedDesc": "Hesaplama raporlarınıza kaydedildi.",
  "customsCalculator.saveFailed": "Hesaplama kaydedilemedi. Lütfen tekrar deneyin.",
  "customsCalculator.error": "Hata",
  "landedCost.title": "Landed cost hesaplayıcı",
  "landedCost.subtitle": "Navlun, vergi, KDV ve sigorta dahil toplam ithalat maliyetini hesaplayın.",
  "landedCost.productName": "Ürün adı",
  "landedCost.calculate": "Landed cost hesapla",
  "landedCost.calculating": "Hesaplanıyor...",
  "reports.useSmartseekai": "Doğrulanmış tedarikçileri karşılaştırmak için ilk yapılandırılmış tedarik raporunuzu oluşturun.",
  "signup.benefitReports": "Yapılandırılmış tedarik raporları",
  "signup.benefitCredits": "Başlangıç için 10 ücretsiz kredi",
  "signup.benefitNoCard": "Kredi kartı gerekmez",
  "reports.chartNoRatings": "MOQ, termin ve Incoterms karşılaştırın — fiyat için tedarikçilerle iletişime geçin.",
  "reports.verificationTier": "Doğrulama",
  "reports.deleteTitle": "Rapor silinsin mi?",
  "reports.deleteDesc": "Bu işlem geri alınamaz.",
  "reports.cancel": "İptal",
  "reports.delete": "Sil",
  "reports.deleted": "Rapor silindi",
  "reports.deleteFailed": "Silinemedi",
  "reports.copied": "Kopyalandı",
  "reports.copiedFull": "Panoya kopyalandı",
  "reports.exportPdf": "PDF dışa aktar",
  "reports.generatingPdf": "PDF oluşturuluyor…",
  "reports.createWorkflow": "Tedarik ekibiyle iş akışı oluştur",
  "reports.dataNotGenerated": "Rapor verisi oluşturulamadı. Lütfen tekrar deneyin.",
  "reports.pdf.title": "SmartSeek Tedarik Raporu",
  "reports.pdf.generated": "Oluşturulma",
  "reports.pdf.tradeRoute": "Ticaret rotası",
  "reports.pdf.executiveSummary": "YÖNETİCİ ÖZETİ",
  "reports.pdf.productClassification": "ÜRÜN SINIFLANDIRMASI",
  "reports.pdf.customsDuties": "GÜMRÜK VERGİLERİ VE ÜCRETLER",
  "reports.pdf.landedCost": "YERLEŞİK MALİYET DÖKÜMÜ",
  "reports.pdf.profitAnalysis": "KÂR ANALİZİ",
  "reports.pdf.supplierComparison": "TEDARİKÇİ KARŞILAŞTIRMASI",
  "reports.pdf.riskAssessment": "RİSK DEĞERLENDİRMESİ",
  "reports.pdf.recommendations": "ÖNERİLER",
  "reports.pdf.nextSteps": "SONRAKİ ADIMLAR",
  "reports.pdf.verification": "Doğrulama",
  "reports.pdf.leadTime": "Termin",
  "reports.pdf.footer": "SmartSeek tarafından oluşturuldu — Yapılandırılmış tedarik istihbaratı",
  "reports.pdf.page": "Sayfa {{current}} / {{total}}",
};

function patchLocale(loc) {
  const fp = path.join(root, loc, "translation.json");
  const data = JSON.parse(fs.readFileSync(fp, "utf8"));
  const en = JSON.parse(fs.readFileSync(path.join(root, "en/translation.json"), "utf8"));
  let n = 0;
  if (loc === "en") {
    Object.assign(data, EN_NEW);
    n = Object.keys(EN_NEW).length;
  } else if (loc === "tr") {
    Object.assign(data, TR_OVERRIDE);
    n = Object.keys(TR_OVERRIDE).length;
  } else {
    for (const [key, trans] of Object.entries(KEY_TRANSLATIONS)) {
      const enVal = en[key] || EN_NEW[key];
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
  const n = patchLocale(loc);
  console.log(`${loc}: patched ${n} keys`);
}
console.log(`Panel locale: en +${enN}, total translation keys ${Object.keys(KEY_TRANSLATIONS).length}`);
