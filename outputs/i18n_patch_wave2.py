"""
Phase 2a Wave 2 — patch script.

Closes ZH (+84) and JA (+169) parity with EN across:
  about.*, becomeSupplier.*, contact.types.*, methodologyPage.*,
  pricing.*, verificationPage.*  (shared 84-key set)
  + JA-only: category.*, common.*, nav.app.*, supplier.*, trustPage.*

Tone: operator-informed, registry-checked, sourcing-oriented, premium B2B.
Additive only. Existing keys never overwritten. Backups appended to *.json.bak2.
"""
import json, shutil, sys
from pathlib import Path

LOCALES_DIR = Path("/sessions/exciting-dreamy-einstein/mnt/Smart-sourcing/client/public/locales")

# --------------------------------------------------------------------------
# SHARED (ZH + JA both need these — same EN keys, language-specific values)
# --------------------------------------------------------------------------

PATCH = {
    # ===================================================== ZH (84 keys) =====
    "zh": {
        # ----- about (12) -----
        "about.entrepreneurs": "创业者",
        "about.entrepreneursDesc": "更快寻源，更聪明地扩张，更早进入市场。",
        "about.procurers": "采购人员",
        "about.procurersDesc": "降低风险，提升利润，保持合规。",
        "about.suppliers": "供应商与生产商",
        "about.suppliersDesc": "被发现，赢得更多 RFQ。",
        "about.values.globalDesc": "无边界的采购——我们将全球买家与供应商对接。",
        "about.values.globalTitle": "全球视野",
        "about.values.integrityDesc": "我们核验每一家供应商，并为我们的数据负责。",
        "about.values.integrityTitle": "诚信",
        "about.values.speedDesc": "决策以分钟计,而非数周。不增加复杂度。",
        "about.values.speedTitle": "速度与清晰度",

        # ----- becomeSupplier (18) -----
        "becomeSupplier.cards.nopayBody": "我们不出售排名位置。是否上架取决于核验结果，而非预算。",
        "becomeSupplier.cards.nopayTitle": "无付费上架",
        "becomeSupplier.cards.rfqBody": "买家请求经运营员审核后，仅路由至相关供应商。",
        "becomeSupplier.cards.rfqTitle": "真实 RFQ",
        "becomeSupplier.cards.verifyBody": "上架前，我们依据官方公司注册机构核验您的法人主体状态。",
        "becomeSupplier.cards.verifyTitle": "仅限注册验证",
        "becomeSupplier.header.badge": "供应商申请",
        "becomeSupplier.header.subtitle": "我们接受在战略金属及工业供应链领域经营的制造商、贸易商和分销商的申请。Beta 期间上架免费。每份申请均由人工审核，并依据公司注册记录进行核验。",
        "becomeSupplier.header.title": "将您的公司列入 SmartSeek",
        "becomeSupplier.sections.company": "公司",
        "becomeSupplier.sections.contact": "主要联系人",
        "becomeSupplier.sections.offering": "供应范围",
        "becomeSupplier.sections.registry": "注册核验",
        "becomeSupplier.sections.registryDesc": "我们依据官方注册机构进行核验。提供您的注册号——由我们交叉比对。",
        "becomeSupplier.success.backHome": "返回首页",
        "becomeSupplier.success.body1": "感谢您的申请。SmartSeek 采购运营员将审核您的资料并核验注册信息。我们通常在 1–3 个工作日内回复至",
        "becomeSupplier.success.body2": "如需补充材料（注册摘要、ISO 证书、近期发票等），我们将通过邮件联系。",
        "becomeSupplier.success.title": "申请已收到",

        # ----- contact.types (6) -----
        "contact.types.partnerships": "合作伙伴",
        "contact.types.partnershipsDesc": "集成与供应商合作",
        "contact.types.sales": "销售",
        "contact.types.salesDesc": "定价、演示与企业方案",
        "contact.types.support": "支持",
        "contact.types.supportDesc": "技术支持与上手指导",

        # ----- methodologyPage (8) -----
        "methodologyPage.step1.body": "当买家提交 RFQ 时，采购运营员将在一个工作日内审查其完整性——商品规格、数量、目的地、交付期、监管约束。信息不全的 RFQ 将连同具体澄清问题一并退回。",
        "methodologyPage.step1.title": "RFQ 接收与初审",
        "methodologyPage.step2.body": "我们依据商品类别、地理位置、认证要求和历史响应表现，将请求与已核验目录中的供应商进行匹配。我们刻意不做群发——大多数 RFQ 仅路由至 3 至 8 家供应商。",
        "methodologyPage.step2.title": "供应商匹配",
        "methodologyPage.step3.body": "供应商直接回复买家，或通过运营员转达。报价以一致的字段返回给买家：单价、MOQ、Incoterms、交付期、付款条件以及供应商来源。由买家决定与谁深入接洽。",
        "methodologyPage.step3.title": "报价归集",
        "methodologyPage.step4.body": "我们协助完成参考检查、样品请求、合同审阅要点，并在适用时提供贸易单证支持。SmartSeek 不充当中介，也不从交易中收取佣金。",
        "methodologyPage.step4.title": "报价后支持",

        # ----- pricing (23) -----
        "pricing.betaOnly": "仅限 Beta",
        "pricing.cardDesc": "适用于采购战略金属、工业原料或特殊材料的采购团队。",
        "pricing.cardTitle": "完整访问 · Beta 期间免费",
        "pricing.company": "公司",
        "pricing.feature1": "完整访问精选供应商目录",
        "pricing.feature2": "Beta 期间无限提交 RFQ",
        "pricing.feature3": "运营员主导的 RFQ 路由——由真人审核您的请求",
        "pricing.feature4": "仅限注册验证供应商",
        "pricing.feature5": "通过邮件直接获得采购团队支持",
        "pricing.feature6": "付费方案上线时锁定创始用户价格",
        "pricing.footnote": "提交此表单不构成合同。您的资料仅用于联系您完成 Beta 入驻。",
        "pricing.foundingUser": "创始用户",
        "pricing.fullName": "姓名 *",
        "pricing.reviewNote": "我们以滚动方式接纳创始用户。大多数申请将在一个工作日内完成审核。",
        "pricing.roleOptional": "职位（可选）",
        "pricing.roleProcurement": "采购 / 寻源",
        "pricing.successDesc": "我们将在一个工作日内通过 sourcing@smartseek.com 与您联系。",
        "pricing.successTitle": "您已加入名单",
        "pricing.trust1": "注册验证供应商",
        "pricing.trust2": "运营员主导的 RFQ 路由",
        "pricing.trust3": "无市场垃圾信息",
        "pricing.useCase": "您采购什么？（例如：来自亚洲的锑锭、用于欧盟的铜阴极）",
        "pricing.workEmail": "工作邮箱 *",

        # ----- verificationPage (17) -----
        "verificationPage.tier1.name": "注册验证",
        "verificationPage.tier1.req1": "公司名称、注册号与国家相互匹配",
        "verificationPage.tier1.req2": "核验时处于有效、未解散状态",
        "verificationPage.tier1.req3": "可解析的企业官网",
        "verificationPage.tier1.req4": "主要联系人可通过域名关联或经核验的地址联系",
        "verificationPage.tier1.summary": "法人主体已在官方公司注册机构中确认。",
        "verificationPage.tier2.name": "贸易验证",
        "verificationPage.tier2.req1": "包含注册验证的全部要求",
        "verificationPage.tier2.req2": "过去 24 个月内经核验的运输或海关申报记录",
        "verificationPage.tier2.req3": "列出的产品线与已申报的 HS 编码一致",
        "verificationPage.tier2.summary": "通过合法贸易数据来源确认存在持续的进出口活动。",
        "verificationPage.tier3.name": "运营员验证",
        "verificationPage.tier3.req1": "包含贸易验证的全部要求",
        "verificationPage.tier3.req2": "与具名代表进行直接电话或视频会议",
        "verificationPage.tier3.req3": "提交能力证明材料（钢厂检测证书、ISO 证书、近期发票、工厂影像）",
        "verificationPage.tier3.req4": "两步联系核验（邮件 + 电话或注册办公地址）",
        "verificationPage.tier3.summary": "由 SmartSeek 采购运营员进行人工尽调。",
    },

    # ===================================================== JA (169 keys) =====
    "ja": {
        # ----- about (12) -----
        "about.entrepreneurs": "起業家",
        "about.entrepreneursDesc": "速く調達し、賢く拡張し、より早く市場へ。",
        "about.procurers": "調達担当者",
        "about.procurersDesc": "リスクを下げ、マージンを高め、コンプライアンスを維持。",
        "about.suppliers": "サプライヤーおよび生産者",
        "about.suppliersDesc": "発見され、より多くのRFQを獲得。",
        "about.values.globalDesc": "国境のない調達——世界中のバイヤーとサプライヤーをつなぎます。",
        "about.values.globalTitle": "グローバル視点",
        "about.values.integrityDesc": "すべてのサプライヤーを検証し、データに責任を持ちます。",
        "about.values.integrityTitle": "誠実さ",
        "about.values.speedDesc": "意思決定は数週間ではなく数分で。複雑さを足しません。",
        "about.values.speedTitle": "スピードと明快さ",

        # ----- becomeSupplier (18) -----
        "becomeSupplier.cards.nopayBody": "掲載順位は販売しません。掲載可否は予算ではなく検証結果によります。",
        "becomeSupplier.cards.nopayTitle": "有料掲載なし",
        "becomeSupplier.cards.rfqBody": "バイヤーからの依頼はオペレーターが選別し、関連するサプライヤーのみへルーティングします。",
        "becomeSupplier.cards.rfqTitle": "実需のRFQ",
        "becomeSupplier.cards.verifyBody": "掲載前に、公的な企業登録機関で法人ステータスを照合します。",
        "becomeSupplier.cards.verifyTitle": "登録検証済みのみ",
        "becomeSupplier.header.badge": "サプライヤー申請",
        "becomeSupplier.header.subtitle": "戦略金属および産業サプライチェーンで事業を行うメーカー、トレーダー、ディストリビューターからの申請を受け付けています。ベータ期間中の掲載は無料です。各申請は人手で精査し、企業登録記録と照合のうえ検証します。",
        "becomeSupplier.header.title": "貴社をSmartSeekに掲載する",
        "becomeSupplier.sections.company": "会社",
        "becomeSupplier.sections.contact": "主担当者",
        "becomeSupplier.sections.offering": "提供範囲",
        "becomeSupplier.sections.registry": "登録機関による検証",
        "becomeSupplier.sections.registryDesc": "公的な登録機関と照合して検証します。登録番号をご入力ください——当方でクロスチェックします。",
        "becomeSupplier.success.backHome": "ホームに戻る",
        "becomeSupplier.success.body1": "ありがとうございました。SmartSeekの調達オペレーターが申請内容と登録情報を確認します。通常1〜3営業日以内に下記宛にご連絡します:",
        "becomeSupplier.success.body2": "追加資料が必要な場合（登録抄本、ISO証明書、直近の請求書、工場資料など）はメールでご依頼します。",
        "becomeSupplier.success.title": "申請を受け付けました",

        # ----- contact.types (6) -----
        "contact.types.partnerships": "パートナーシップ",
        "contact.types.partnershipsDesc": "連携・サプライヤー協業",
        "contact.types.sales": "営業",
        "contact.types.salesDesc": "料金、デモ、エンタープライズ",
        "contact.types.support": "サポート",
        "contact.types.supportDesc": "技術サポート・オンボーディング",

        # ----- methodologyPage (8) -----
        "methodologyPage.step1.body": "バイヤーがRFQを送信すると、調達オペレーターが1営業日以内に完全性を精査します——品目仕様、数量、仕向地、リードタイム、規制要件。情報が不足するRFQは具体的な確認事項とともに差し戻します。",
        "methodologyPage.step1.title": "RFQ受領と一次精査",
        "methodologyPage.step2.body": "品目、地域、認証要件、過去の応答実績に基づき、検証済みディレクトリ内のサプライヤーと依頼を突き合わせます。一斉送信は意図的に行いません——多くのRFQは3〜8社に絞ってルーティングします。",
        "methodologyPage.step2.title": "サプライヤーマッチング",
        "methodologyPage.step3.body": "サプライヤーはバイヤーへ直接、またはオペレーター経由で回答します。見積りは単価、MOQ、Incoterms、リードタイム、支払条件、サプライヤー出所など統一されたフィールドでバイヤーに返送されます。誰と進めるかはバイヤーが選びます。",
        "methodologyPage.step3.title": "見積りの取りまとめ",
        "methodologyPage.step4.body": "リファレンス確認、サンプル依頼、契約レビューの要点、必要に応じて貿易関連書類を支援します。SmartSeekは仲介業者として振る舞わず、取引から手数料も取りません。",
        "methodologyPage.step4.title": "見積り後の支援",

        # ----- pricing (23) -----
        "pricing.betaOnly": "ベータ限定",
        "pricing.cardDesc": "戦略金属、産業原料、特殊材料を調達する購買チーム向け。",
        "pricing.cardTitle": "フルアクセス · ベータ期間中は無料",
        "pricing.company": "会社",
        "pricing.feature1": "厳選サプライヤーディレクトリへのフルアクセス",
        "pricing.feature2": "ベータ期間中はRFQの送信回数無制限",
        "pricing.feature3": "オペレーター主導のRFQルーティング——実在の担当者が依頼を精査",
        "pricing.feature4": "登録検証済みサプライヤーのみ",
        "pricing.feature5": "調達チームによるメール直接サポート",
        "pricing.feature6": "有料プラン開始時に創設ユーザー価格を固定",
        "pricing.footnote": "本フォームの送信は契約ではありません。記入内容はベータオンボーディングのご連絡にのみ使用します。",
        "pricing.foundingUser": "創設ユーザー",
        "pricing.fullName": "氏名 *",
        "pricing.reviewNote": "創設ユーザーは順次受け付けています。多くの申請は1営業日以内に審査されます。",
        "pricing.roleOptional": "役割（任意）",
        "pricing.roleProcurement": "調達 / ソーシング",
        "pricing.successDesc": "1営業日以内に sourcing@smartseek.com からご連絡します。",
        "pricing.successTitle": "リストに登録されました",
        "pricing.trust1": "登録検証済みサプライヤー",
        "pricing.trust2": "オペレーター主導のRFQルーティング",
        "pricing.trust3": "マーケットプレイススパムなし",
        "pricing.useCase": "何を調達されていますか？（例：アジアからのアンチモン地金、EU向け銅カソード）",
        "pricing.workEmail": "業務用メール *",

        # ----- verificationPage (17) -----
        "verificationPage.tier1.name": "登録検証済み",
        "verificationPage.tier1.req1": "社名、登録番号、所在国が一致していること",
        "verificationPage.tier1.req2": "検証時点で有効・解散していない状態であること",
        "verificationPage.tier1.req3": "解決可能な企業ウェブサイトがあること",
        "verificationPage.tier1.req4": "主担当者がドメイン連動または検証済みアドレスで連絡可能であること",
        "verificationPage.tier1.summary": "法人格を公的な企業登録機関で確認済み。",
        "verificationPage.tier2.name": "貿易検証済み",
        "verificationPage.tier2.req1": "登録検証済みのすべての要件",
        "verificationPage.tier2.req2": "直近24か月以内に確認できる出荷記録または税関申告",
        "verificationPage.tier2.req3": "掲載製品ラインが申告HSコードと整合していること",
        "verificationPage.tier2.summary": "合法的な貿易データ源で輸出入の継続的な活動を確認済み。",
        "verificationPage.tier3.name": "オペレーター検証済み",
        "verificationPage.tier3.req1": "貿易検証済みのすべての要件",
        "verificationPage.tier3.req2": "氏名が明らかな担当者との直接通話またはビデオ面談",
        "verificationPage.tier3.req3": "能力証明資料の提出（ミルテスト証明書、ISO証明書、直近請求書、工場資料）",
        "verificationPage.tier3.req4": "2段階の連絡先検証(メール + 電話または登記事業所)",
        "verificationPage.tier3.summary": "SmartSeekの調達オペレーターによる手動デューデリジェンス。",

        # =========================== JA-only (85 keys) ===========================

        # ----- category.* (42) -----
        "category.andManufacturers": "およびメーカー",
        "category.breadcrumb.home": "ホーム",
        "category.breadcrumb.nav": "ナビゲーション",
        "category.breadcrumb.suppliers": "サプライヤー",
        "category.browseAllResults": "すべての結果を見る",
        "category.cannotLoad": "現在サプライヤーを読み込めません。",
        "category.countries220": "220か国以上",
        "category.cta.desc": "SmartSeekに信頼を寄せ、検証済みサプライヤーを素早く見つける数千の調達担当者に加わりましょう。",
        "category.cta.footer": "クレジットカード不要 · 無料プランあり · いつでも解約可能",
        "category.cta.primary": "無料で検索を始める",
        "category.cta.ready": "理想の",
        "category.cta.supplier": "{{name}} サプライヤーを見つける準備はできましたか？",
        "category.description": "世界中の検証済み {{name}} サプライヤー、メーカー、輸出業者を見つけましょう。認証、評価、連絡先情報をすぐに比較できます。",
        "category.employees": "従業員",
        "category.feature1.desc": "サプライヤーは220か国以上の公的取引登録機関と相互参照されます。",
        "category.feature1.title": "複数ソース検証済みデータ",
        "category.feature2.desc": "中国、インド、トルコ、ドイツ、ベトナムなど200以上の市場でメーカーを検索。",
        "category.feature2.title": "グローバルカバレッジ",
        "category.feature3.desc": "自然言語検索で1秒未満に数百件の検証済みマッチを返します。",
        "category.feature3.title": "即時の結果",
        "category.findVerifiedManufacturers": "検証済みメーカーを見つける",
        "category.freeUnlocks": "無料アカウントを作成して、すべてのサプライヤーリストと検証済み連絡先情報を解放しましょう。",
        "category.globalDirectory": "グローバルサプライヤーディレクトリ",
        "category.govVerifiedData": "複数ソース検証済みサプライヤーデータ",
        "category.loading": "読み込み中…",
        "category.logIn": "ログイン",
        "category.moreSuppliers": "さらに{{count}}件の {{name}} サプライヤーが見つかりました",
        "category.noCreditCard": "クレジットカード不要",
        "category.noPreview": "このカテゴリのプレビュー結果はありません。",
        "category.qualityScore": "QS",
        "category.relatedCategories": "関連サプライヤーカテゴリ",
        "category.searchFree": "無料で検索",
        "category.searchFullDatabase": "全データベースを検索",
        "category.searching": "検索中…",
        "category.signupToSearch": "全データベース検索には登録が必要です",
        "category.suppliersFound": "{{count}}件の検証済みサプライヤーが見つかりました",
        "category.suppliersManufacturers": "サプライヤーおよびメーカー",
        "category.topSuppliers": "主要 {{name}} サプライヤー",
        "category.totalResults": "全{{count}}件",
        "category.verified": "検証済み",
        "category.whySource.desc": "SmartSeekは企業登録機関、貿易データベース、サードパーティのデータソースを統合し、信頼性の高いサプライヤー発見を提供します。",
        "category.whySource.heading": "SmartSeekで {{name}} を調達する理由",

        # ----- common.* (17) -----
        "common.back": "戻る",
        "common.clear": "クリア",
        "common.close": "閉じる",
        "common.confirm": "確認",
        "common.delete": "削除",
        "common.dismiss": "閉じる",
        "common.edit": "編集",
        "common.filter": "フィルター",
        "common.next": "次へ",
        "common.no": "いいえ",
        "common.noData": "データがありません",
        "common.previous": "前へ",
        "common.retry": "再試行",
        "common.save": "保存",
        "common.search": "検索",
        "common.submit": "送信",
        "common.yes": "はい",

        # ----- nav.app.* (6) -----
        "nav.app.buyCredits": "クレジットを購入",
        "nav.app.creditsWarning": "残りクレジットは{{count}}件です。継続して調達するには追加購入してください。",
        "nav.app.creditsWarning_other": "残りクレジットは{{count}}件です。継続して調達するには追加購入してください。",
        "nav.app.freePlan": "無料プラン",
        "nav.app.resend": "再送信",
        "nav.app.verifyEmailBanner": "メールアドレスを確認してください。受信トレイで認証リンクをご確認ください。",

        # ----- supplier.* (6) -----
        "supplier.moqAny": "MOQ: すべて",
        "supplier.moqRange": "MOQ: {{min}}+",
        "supplier.pageSubtitle": "SmartSeek サプライヤー検索",
        "supplier.pageTitle": "検証済みグローバルサプライヤーを見つける",
        "supplier.pageTrustLine": "公的登録機関由来の100%実在企業 • すべてのサプライヤーは公的ソースにリンク",
        "supplier.verified": "検証済み",

        # ----- trustPage.* (14) -----
        "trustPage.notDo1": "有料の掲載順位は販売しません。サプライヤーは料金を支払って上位に表示することはできません。",
        "trustPage.notDo2": "偽のサプライヤープロフィール、偽のレビュー、偽の見積件数は作成しません。",
        "trustPage.notDo3": "RFQを数千のサプライヤーへ自動一斉送信することはありません。",
        "trustPage.notDo4": "明示的な同意なしにバイヤー情報を第三者と共有することはありません。",
        "trustPage.notDo5": "「世界最大」といった主張は行いません。当社の信頼性は規模ではなく検証によって支えられています。",
        "trustPage.sources1Rest": "設立、所有関係、ステータス。",
        "trustPage.sources1Strong": "公的登録機関",
        "trustPage.sources2Rest": "合法に取得可能な税関および出荷記録。",
        "trustPage.sources2Strong": "貿易データ",
        "trustPage.sources3Rest": "次のページから申請する企業:",
        "trustPage.sources3Strong": "サプライヤーからの直接申請",
        "trustPage.sources4Rest": "当社チームが手動デューデリジェンスを経て追加したサプライヤー。",
        "trustPage.sources4Strong": "オペレーターによる厳選追加",
        "trustPage.sourcesFootnote": "ベータ期間中、公開ディレクトリは社内サプライヤーインデックスの厳選された一部のみを表示します。未検証の一括レコードは意図的に表示していません。",
    },
}


def patch_locale(locale: str, additions: dict) -> dict:
    path = LOCALES_DIR / locale / "translation.json"
    if not path.exists():
        raise FileNotFoundError(path)
    with path.open("r", encoding="utf-8") as f:
        data = json.load(f)

    backup = path.with_suffix(".json.bak2")
    if not backup.exists():
        shutil.copy2(path, backup)

    added, skipped, conflicts = [], [], []
    for k, v in additions.items():
        if k in data:
            # Additive-only: never overwrite an existing translation.
            skipped.append(k)
            if data[k] != v:
                conflicts.append((k, data[k], v))
            continue
        data[k] = v
        added.append(k)

    with path.open("w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        f.write("\n")

    return {
        "locale": locale,
        "added": len(added),
        "skipped": len(skipped),
        "conflicts": conflicts,
        "total_after": len(data),
    }


def main():
    # Sanity: patch sizes must match the expected per-locale Wave-2 counts.
    expected = {"zh": 84, "ja": 169}
    for l, exp in expected.items():
        actual = len(PATCH[l])
        if actual != exp:
            print(f"FATAL: {l} patch has {actual} keys, expected {exp}", file=sys.stderr)
            sys.exit(2)

    report = []
    for locale, additions in PATCH.items():
        report.append(patch_locale(locale, additions))

    for r in report:
        print(
            f"  {r['locale']}: +{r['added']} added, {r['skipped']} already present, "
            f"{r['total_after']} keys total"
        )
        if r["conflicts"]:
            print(f"    WARNING: {len(r['conflicts'])} conflict(s) — kept existing values")
            for k, old, new in r["conflicts"]:
                print(f"      {k}: existing={old!r}  proposed={new!r}")


if __name__ == "__main__":
    main()
