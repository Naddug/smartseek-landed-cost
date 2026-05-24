"""
Phase 2a Wave 1 — patch script.
Appends the 50 missing public-site translation keys to es/ru/zh/ja
translation.json files. Idempotent: existing keys are left untouched
(does not overwrite a value if it is already present).
"""
import json, os, sys, shutil
from pathlib import Path

LOCALES_DIR = Path("/sessions/exciting-dreamy-einstein/mnt/Smart-sourcing/client/public/locales")

PATCH = {
    # ---------------------------------------------------------------- es
    "es": {
        "publicNav.suppliers": "Proveedores",
        "publicNav.submitRfq": "Enviar RFQ",
        "publicNav.becomeSupplier": "Conviértete en proveedor",
        "publicNav.trustVerification": "Confianza y verificación",
        "publicNav.betaAccess": "Comienza gratis en beta",
        "publicNav.requestBetaAccess": "Comienza gratis",

        "publicFooter.howItWorks": "Cómo funciona SmartSeek",
        "publicFooter.curatedNetworkTitle": "Red de proveedores curada",
        "publicFooter.curatedNetworkDesc": "Obtenida de registros públicos, datos comerciales y solicitudes directas de proveedores — no extraída a gran escala.",
        "publicFooter.verificationFirstTitle": "Verificación primero",
        "publicFooter.verificationFirstDesc": "Cada proveedor que publicamos se verifica con registros oficiales y canales de contacto confirmados.",
        "publicFooter.operatorRfqTitle": "RFQ dirigidas por operadores",
        "publicFooter.operatorRfqDesc": "Un operador de abastecimiento real enruta tu RFQ — sin envíos masivos automatizados ni spam de marketplace.",
        "publicFooter.readMethodology": "Lee nuestra metodología de abastecimiento",
        "publicFooter.sourcing": "Abastecimiento",
        "publicFooter.trust": "Confianza",
        "publicFooter.company": "Empresa",
        "publicFooter.methodology": "Metodología de abastecimiento",
        "publicFooter.verificationStandards": "Estándares de verificación",

        "publicBanner.freeDuringBeta": "Gratis durante la beta",
        "publicBanner.foundingSupport": "Los usuarios fundadores reciben soporte prioritario de abastecimiento",
        "publicBanner.requestAccess": "Comienza gratis",

        "rfq.errors.required": "Por favor completa los campos obligatorios: Nombre, Correo, Nombre del producto y Cantidad.",
        "rfq.errors.quantityPositive": "La cantidad debe ser un número positivo.",
        "rfq.errors.submitFailed": "No se pudo enviar el RFQ",
        "rfq.errors.submitFailedTryAgain": "Error al enviar. Por favor inténtalo de nuevo.",
        "rfq.header.badge": "SmartSeek · Solicitud de cotización",
        "rfq.header.title": "Envía una solicitud de abastecimiento",
        "rfq.header.subtitle": "Un operador de abastecimiento de SmartSeek enrutará tu RFQ a proveedores verificados por registro y devolverá cotizaciones estructuradas.",
        "rfq.header.pointOperator": "Enrutamiento por operador",
        "rfq.header.pointNoAccount": "No se requiere cuenta durante la beta",
        "rfq.header.pointTurnaround": "Plazo habitual: 1–3 días hábiles",
        "rfq.header.linkMethodology": "Cómo se enrutan las RFQ",

        "publicSearch.title": "Explorar proveedores destacados",
        "publicSearch.subtitle": "Proveedores destacados — regístrate para acceder al directorio completo de más de 25,2 M",
        "publicSearch.searchPlaceholder": "Busca por empresa, producto, sector, país o ciudad",
        "publicSearch.loading": "Cargando proveedores destacados…",
        "publicSearch.loadError": "No se pudieron cargar los proveedores destacados en este momento.",
        "publicSearch.noResults": "Ningún proveedor destacado coincide con tu búsqueda.",
        "publicSearch.resultsCount": "{{count}} resultados destacados",
        "publicSearch.signupCta": "Regístrate para acceder a más de 25,2 M de proveedores",

        "findLeads.header.intentFromSuppliers": "Intención y firmografía de {{suppliers}} proveedores",
        "findLeads.header.intentFromVerifiedSuppliers": "Intención y firmografía de proveedores verificados",
        "findLeads.header.leadsAndTrade": "leads de compradores y comerciales",
        "findLeads.header.rankedFromRealSupplierData": "Clasificado a partir de datos reales de proveedores",

        "supplier.hero.subtitleWithCountries": "Búsqueda con IA en {{suppliers}} proveedores verificados de {{countries}} países",
        "supplier.hero.subtitleWorldwide": "Búsqueda con IA en {{suppliers}} proveedores verificados a nivel mundial",
        "supplier.hero.subtitleNoStats": "Descubrimiento global de proveedores con IA",
        "supplier.banner.narrowSearchHint": "Consejo: Añade un filtro de país o sector para agilizar tu búsqueda.",

        "landedCost.error.cannotCalculate": "No se puede calcular",
    },

    # ---------------------------------------------------------------- ru
    "ru": {
        "publicNav.suppliers": "Поставщики",
        "publicNav.submitRfq": "Отправить RFQ",
        "publicNav.becomeSupplier": "Стать поставщиком",
        "publicNav.trustVerification": "Доверие и верификация",
        "publicNav.betaAccess": "Начать бесплатно в бета",
        "publicNav.requestBetaAccess": "Начать бесплатно",

        "publicFooter.howItWorks": "Как работает SmartSeek",
        "publicFooter.curatedNetworkTitle": "Курируемая сеть поставщиков",
        "publicFooter.curatedNetworkDesc": "Собрано из публичных реестров, торговых данных и прямых заявок поставщиков — без массового парсинга.",
        "publicFooter.verificationFirstTitle": "Верификация в первую очередь",
        "publicFooter.verificationFirstDesc": "Каждый публикуемый поставщик проверяется по записям реестров компаний и подтверждённым каналам связи.",
        "publicFooter.operatorRfqTitle": "RFQ под управлением оператора",
        "publicFooter.operatorRfqDesc": "Реальный оператор закупок направляет ваш RFQ — без автоматических рассылок и спама.",
        "publicFooter.readMethodology": "Прочитайте нашу методологию закупок",
        "publicFooter.sourcing": "Закупки",
        "publicFooter.trust": "Доверие",
        "publicFooter.company": "Компания",
        "publicFooter.methodology": "Методология закупок",
        "publicFooter.verificationStandards": "Стандарты верификации",

        "publicBanner.freeDuringBeta": "Бесплатно во время беты",
        "publicBanner.foundingSupport": "Пользователи-основатели получают приоритетную поддержку закупок",
        "publicBanner.requestAccess": "Начать бесплатно",

        "rfq.errors.required": "Пожалуйста, заполните обязательные поля: Имя, Email, Название продукта и Количество.",
        "rfq.errors.quantityPositive": "Количество должно быть положительным числом.",
        "rfq.errors.submitFailed": "Не удалось отправить RFQ",
        "rfq.errors.submitFailedTryAgain": "Не удалось отправить. Пожалуйста, попробуйте ещё раз.",
        "rfq.header.badge": "SmartSeek · Запрос на коммерческое предложение",
        "rfq.header.title": "Отправьте запрос на закупку",
        "rfq.header.subtitle": "Оператор закупок SmartSeek направит ваш RFQ верифицированным по реестрам поставщикам и вернёт структурированные предложения.",
        "rfq.header.pointOperator": "Маршрутизация оператором",
        "rfq.header.pointNoAccount": "Аккаунт во время беты не требуется",
        "rfq.header.pointTurnaround": "Обычный срок ответа: 1–3 рабочих дня",
        "rfq.header.linkMethodology": "Как маршрутизируются RFQ",

        "publicSearch.title": "Просмотр избранных поставщиков",
        "publicSearch.subtitle": "Избранные поставщики — зарегистрируйтесь для доступа к полному каталогу из 25,2 млн+",
        "publicSearch.searchPlaceholder": "Поиск по компании, продукту, отрасли, стране или городу",
        "publicSearch.loading": "Загрузка избранных поставщиков…",
        "publicSearch.loadError": "Не удалось загрузить избранных поставщиков прямо сейчас.",
        "publicSearch.noResults": "Под ваш запрос не найдено избранных поставщиков.",
        "publicSearch.resultsCount": "{{count}} избранных результатов",
        "publicSearch.signupCta": "Зарегистрируйтесь для доступа к 25,2 млн+ поставщиков",

        "findLeads.header.intentFromSuppliers": "Намерения и фирмография от {{suppliers}} поставщиков",
        "findLeads.header.intentFromVerifiedSuppliers": "Намерения и фирмография от верифицированных поставщиков",
        "findLeads.header.leadsAndTrade": "лиды покупателей и торговые лиды",
        "findLeads.header.rankedFromRealSupplierData": "Ранжировано по реальным данным поставщиков",

        "supplier.hero.subtitleWithCountries": "Поиск на базе ИИ среди {{suppliers}} верифицированных поставщиков в {{countries}} странах",
        "supplier.hero.subtitleWorldwide": "Поиск на базе ИИ среди {{suppliers}} верифицированных поставщиков по всему миру",
        "supplier.hero.subtitleNoStats": "Глобальный поиск поставщиков на базе ИИ",
        "supplier.banner.narrowSearchHint": "Совет: добавьте фильтр по стране или отрасли, чтобы ускорить поиск.",

        "landedCost.error.cannotCalculate": "Невозможно рассчитать",
    },

    # ---------------------------------------------------------------- zh
    "zh": {
        "publicNav.suppliers": "供应商",
        "publicNav.submitRfq": "提交 RFQ",
        "publicNav.becomeSupplier": "成为供应商",
        "publicNav.trustVerification": "信任与验证",
        "publicNav.betaAccess": "Beta 期间免费开始",
        "publicNav.requestBetaAccess": "免费开始",

        "publicFooter.howItWorks": "SmartSeek 如何运作",
        "publicFooter.curatedNetworkTitle": "精选供应商网络",
        "publicFooter.curatedNetworkDesc": "数据来自公共注册机构、贸易数据和供应商直接申请 —— 非大规模抓取。",
        "publicFooter.verificationFirstTitle": "验证优先",
        "publicFooter.verificationFirstDesc": "我们发布的每一家供应商都依据公司注册记录和确认的联系渠道进行核查。",
        "publicFooter.operatorRfqTitle": "运营员主导的 RFQ",
        "publicFooter.operatorRfqDesc": "由真实的采购运营员路由您的 RFQ —— 无自动群发邮件，无市场垃圾信息。",
        "publicFooter.readMethodology": "阅读我们的采购方法论",
        "publicFooter.sourcing": "采购",
        "publicFooter.trust": "信任",
        "publicFooter.company": "公司",
        "publicFooter.methodology": "采购方法论",
        "publicFooter.verificationStandards": "验证标准",

        "publicBanner.freeDuringBeta": "Beta 期间免费",
        "publicBanner.foundingSupport": "创始用户享有优先采购支持",
        "publicBanner.requestAccess": "免费开始",

        "rfq.errors.required": "请填写必填字段：姓名、邮箱、产品名称和数量。",
        "rfq.errors.quantityPositive": "数量必须为正数。",
        "rfq.errors.submitFailed": "RFQ 提交失败",
        "rfq.errors.submitFailedTryAgain": "提交失败，请重试。",
        "rfq.header.badge": "SmartSeek · 报价请求",
        "rfq.header.title": "提交采购请求",
        "rfq.header.subtitle": "SmartSeek 采购运营员会将您的 RFQ 路由至注册验证供应商，并返回结构化报价。",
        "rfq.header.pointOperator": "运营员主导的路由",
        "rfq.header.pointNoAccount": "Beta 期间无需注册账户",
        "rfq.header.pointTurnaround": "通常响应时间：1–3 个工作日",
        "rfq.header.linkMethodology": "RFQ 如何路由",

        "publicSearch.title": "浏览精选供应商",
        "publicSearch.subtitle": "精选供应商 —— 注册即可访问完整的 2520 万+ 名录",
        "publicSearch.searchPlaceholder": "按公司、产品、行业、国家或城市搜索",
        "publicSearch.loading": "正在加载精选供应商…",
        "publicSearch.loadError": "目前无法加载精选供应商。",
        "publicSearch.noResults": "没有精选供应商匹配您的搜索。",
        "publicSearch.resultsCount": "{{count}} 个精选结果",
        "publicSearch.signupCta": "注册以访问 2520 万+ 供应商",

        "findLeads.header.intentFromSuppliers": "来自 {{suppliers}} 家供应商的意向与企业信息",
        "findLeads.header.intentFromVerifiedSuppliers": "来自已验证供应商的意向与企业信息",
        "findLeads.header.leadsAndTrade": "买家与贸易线索",
        "findLeads.header.rankedFromRealSupplierData": "基于真实供应商数据排序",

        "supplier.hero.subtitleWithCountries": "在 {{countries}} 个国家的 {{suppliers}} 家已验证供应商中进行 AI 驱动搜索",
        "supplier.hero.subtitleWorldwide": "在全球 {{suppliers}} 家已验证供应商中进行 AI 驱动搜索",
        "supplier.hero.subtitleNoStats": "AI 驱动的全球供应商发现",
        "supplier.banner.narrowSearchHint": "提示：添加国家或行业筛选可加快您的搜索。",

        "landedCost.error.cannotCalculate": "无法计算",
    },

    # ---------------------------------------------------------------- ja
    "ja": {
        "publicNav.suppliers": "サプライヤー",
        "publicNav.submitRfq": "RFQを送信",
        "publicNav.becomeSupplier": "サプライヤーになる",
        "publicNav.trustVerification": "信頼と検証",
        "publicNav.betaAccess": "ベータ版を無料で開始",
        "publicNav.requestBetaAccess": "無料で開始",

        "publicFooter.howItWorks": "SmartSeekの仕組み",
        "publicFooter.curatedNetworkTitle": "厳選されたサプライヤーネットワーク",
        "publicFooter.curatedNetworkDesc": "公的登録機関、貿易データ、サプライヤーからの直接申請から収集 — 大規模スクレイピングではありません。",
        "publicFooter.verificationFirstTitle": "検証ファースト",
        "publicFooter.verificationFirstDesc": "公開する各サプライヤーは、会社登録記録および確認済み連絡先チャネルと照合されます。",
        "publicFooter.operatorRfqTitle": "オペレーター主導のRFQ",
        "publicFooter.operatorRfqDesc": "実際の調達オペレーターがRFQをルーティングします — 自動メール一斉送信もマーケットプレイスのスパムもありません。",
        "publicFooter.readMethodology": "調達方法論を読む",
        "publicFooter.sourcing": "調達",
        "publicFooter.trust": "信頼",
        "publicFooter.company": "会社",
        "publicFooter.methodology": "調達方法論",
        "publicFooter.verificationStandards": "検証基準",

        "publicBanner.freeDuringBeta": "ベータ期間中は無料",
        "publicBanner.foundingSupport": "創設ユーザーは優先調達サポートを受けられます",
        "publicBanner.requestAccess": "無料で開始",

        "rfq.errors.required": "必須項目を入力してください：名前、メール、製品名、数量。",
        "rfq.errors.quantityPositive": "数量は正の数である必要があります。",
        "rfq.errors.submitFailed": "RFQの送信に失敗しました",
        "rfq.errors.submitFailedTryAgain": "送信に失敗しました。もう一度お試しください。",
        "rfq.header.badge": "SmartSeek · 見積依頼",
        "rfq.header.title": "調達リクエストを送信",
        "rfq.header.subtitle": "SmartSeekの調達オペレーターがRFQを登録検証済みサプライヤーへルーティングし、構造化された見積を返します。",
        "rfq.header.pointOperator": "オペレーター主導のルーティング",
        "rfq.header.pointNoAccount": "ベータ期間中はアカウント不要",
        "rfq.header.pointTurnaround": "通常の所要時間：1〜3営業日",
        "rfq.header.linkMethodology": "RFQのルーティング方法",

        "publicSearch.title": "注目のサプライヤーを閲覧",
        "publicSearch.subtitle": "注目のサプライヤー — 完全な2,520万件以上のディレクトリにアクセスするには登録してください",
        "publicSearch.searchPlaceholder": "会社、製品、業界、国、または都市で検索",
        "publicSearch.loading": "注目のサプライヤーを読み込み中…",
        "publicSearch.loadError": "現在、注目のサプライヤーを読み込めません。",
        "publicSearch.noResults": "検索条件に一致する注目のサプライヤーはありません。",
        "publicSearch.resultsCount": "{{count}} 件の注目結果",
        "publicSearch.signupCta": "2,520万件以上のサプライヤーにアクセスするには登録してください",

        "findLeads.header.intentFromSuppliers": "{{suppliers}} 社のサプライヤーからのインテントと企業情報",
        "findLeads.header.intentFromVerifiedSuppliers": "検証済みサプライヤーからのインテントと企業情報",
        "findLeads.header.leadsAndTrade": "バイヤーおよびトレードリード",
        "findLeads.header.rankedFromRealSupplierData": "実際のサプライヤーデータに基づくランキング",

        "supplier.hero.subtitleWithCountries": "{{countries}} か国の {{suppliers}} 社の検証済みサプライヤーをAIで検索",
        "supplier.hero.subtitleWorldwide": "世界中の {{suppliers}} 社の検証済みサプライヤーをAIで検索",
        "supplier.hero.subtitleNoStats": "AIによるグローバルサプライヤー検索",
        "supplier.banner.narrowSearchHint": "ヒント：国または業界フィルターを追加すると検索が速くなります。",

        "landedCost.error.cannotCalculate": "計算できません",
    },
}


def patch_locale(locale: str, additions: dict) -> dict:
    path = LOCALES_DIR / locale / "translation.json"
    if not path.exists():
        raise FileNotFoundError(path)
    with path.open("r", encoding="utf-8") as f:
        data = json.load(f)

    backup = path.with_suffix(".json.bak")
    if not backup.exists():
        shutil.copy2(path, backup)

    added, skipped = [], []
    for k, v in additions.items():
        if k in data:
            skipped.append(k)
            continue
        data[k] = v
        added.append(k)

    # Preserve flat-dotted format. Use 2-space indent, UTF-8, no ASCII escape,
    # and a trailing newline — matches what i18next-http-backend serves.
    with path.open("w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        f.write("\n")

    return {"locale": locale, "added": len(added), "skipped": len(skipped), "total_after": len(data)}


def main():
    expected_count = 50
    for locale, additions in PATCH.items():
        if len(additions) != expected_count:
            print(f"FATAL: {locale} patch has {len(additions)} keys, expected {expected_count}", file=sys.stderr)
            sys.exit(2)

    report = []
    for locale, additions in PATCH.items():
        report.append(patch_locale(locale, additions))

    for r in report:
        print(f"  {r['locale']}: +{r['added']} added, {r['skipped']} already present, {r['total_after']} keys total")


if __name__ == "__main__":
    main()
