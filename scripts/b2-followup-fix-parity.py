"""
B2 follow-up — strict, additive parity + AI-residue fix.

Three deterministic operations:

  (1) Overwrite footer.tagline in es/ru/zh/ja/tr with operator-first,
      sourcing-native, registry-compatible wording aligned to the EN
      positioning. Removes the only remaining investor-facing AI-first
      claim on a public surface.

  (2) Add 7 missing keys (currently EN-only) to es/ru/zh/ja/tr — closes
      the Phase A parity tail. Translations preserve SmartSeek operator
      conventions ("SmartSeek sourcing operator" kept as proper noun).

  (3) Remove 4 orphan keys (present only in non-EN locales, no longer in
      EN) from es/ru/zh/ja/tr — dead data from the previous About rewrite.

This script is idempotent: re-running it leaves the files unchanged.
"""
import json
import sys
from pathlib import Path

LOCALES_DIR = Path("/sessions/exciting-dreamy-einstein/mnt/Smart-sourcing/client/public/locales")

# -----------------------------------------------------------------------------
# Op 1 — footer.tagline AI-residue fix
# -----------------------------------------------------------------------------
# EN reference:
#   "Strategic sourcing intelligence and supplier discovery for industrial
#    procurement teams."
FOOTER_TAGLINE = {
    "es": "Inteligencia estratégica de abastecimiento y descubrimiento de proveedores para equipos de aprovisionamiento industrial.",
    "ru": "Стратегическая аналитика закупок и поиск поставщиков для промышленных команд закупок.",
    "zh": "面向工业采购团队的战略采购情报与供应商发现。",
    "ja": "産業調達チーム向けの戦略的調達インテリジェンスとサプライヤー発見。",
    "tr": "Endüstriyel tedarik ekipleri için stratejik sourcing istihbaratı ve tedarikçi keşfi.",
}

# -----------------------------------------------------------------------------
# Op 2 — close 7-key parity tail.
# Each translation: operator-first, no AI wording, "SmartSeek sourcing operator"
# kept as proper noun (matches Trust/Methodology/Verification copy conventions).
# -----------------------------------------------------------------------------
PARITY_ADDITIONS = {
    "es": {
        "about.antiMarketplace": "No hacemos scraping de directorios a gran escala, no enviamos RFQ en masa ni publicamos proveedores que no podamos localizar en un registro público. Un SmartSeek sourcing operator revisa cada solicitud antes de enrutarla. Es más lento que un marketplace — y más útil para un equipo de compras.",
        "about.exploreBeta": "Solicitar acceso beta",
        "about.trustStripLabel": "Cómo SmartSeek construye confianza durante la beta",
        "about.values.rfqTitle": "Enrutamiento estructurado de RFQ",
        "about.values.rfqDesc": "Los RFQ se filtran y enrutan por un SmartSeek sourcing operator. Sin envíos masivos. Sin teatro de intermediarios.",
        "supplier.resultsMatching": "Mostrando proveedores coincidentes",
        "verificationPage.lastReviewed": "Última revisión: mayo de 2026",
    },
    "ru": {
        "about.antiMarketplace": "Мы не парсим каталоги массово, не рассылаем RFQ автоматически и не публикуем поставщиков, которых не можем найти в публичном реестре. SmartSeek sourcing operator проверяет каждый запрос перед маршрутизацией. Это медленнее маркетплейса — и полезнее команде закупок.",
        "about.exploreBeta": "Запросить доступ к бете",
        "about.trustStripLabel": "Как SmartSeek завоёвывает доверие во время беты",
        "about.values.rfqTitle": "Структурированная маршрутизация RFQ",
        "about.values.rfqDesc": "RFQ фильтруются и маршрутизируются SmartSeek sourcing operator. Без массовых рассылок. Без посреднического театра.",
        "supplier.resultsMatching": "Показаны подходящие поставщики",
        "verificationPage.lastReviewed": "Последний пересмотр: май 2026 г.",
    },
    "zh": {
        "about.antiMarketplace": "我们不大规模抓取目录、不自动群发 RFQ，也不发布无法在公共注册机构中定位的供应商。每份请求在路由前由 SmartSeek sourcing operator 审核。这比市场平台更慢——但对采购团队更有用。",
        "about.exploreBeta": "申请 Beta 访问",
        "about.trustStripLabel": "SmartSeek 在 Beta 期间如何赢得信任",
        "about.values.rfqTitle": "结构化的 RFQ 路由",
        "about.values.rfqDesc": "RFQ 由 SmartSeek sourcing operator 筛选并路由。无大规模外发。无代理表演。",
        "supplier.resultsMatching": "正在显示匹配的供应商",
        "verificationPage.lastReviewed": "最后审核：2026 年 5 月",
    },
    "ja": {
        "about.antiMarketplace": "ディレクトリの大規模スクレイピング、RFQの一斉送信、公的登録機関で確認できないサプライヤーの公開は行いません。各依頼は、ルーティング前にSmartSeek sourcing operatorが審査します。マーケットプレイスより遅く――そして調達チームにとってより有用です。",
        "about.exploreBeta": "ベータアクセスをリクエスト",
        "about.trustStripLabel": "ベータ期間中にSmartSeekがどのように信頼を積み重ねるか",
        "about.values.rfqTitle": "構造化されたRFQルーティング",
        "about.values.rfqDesc": "RFQはSmartSeek sourcing operatorが精査・ルーティングします。一斉送信なし。仲介の演出なし。",
        "supplier.resultsMatching": "該当するサプライヤーを表示中",
        "verificationPage.lastReviewed": "最終レビュー:2026年5月",
    },
    "tr": {
        "about.antiMarketplace": "Dizinleri geniş ölçekte taramayız, RFQ'ları otomatik toplu göndermeyiz ve kamu sicilinde bulamadığımız tedarikçileri yayınlamayız. Her talep, yönlendirilmeden önce bir SmartSeek sourcing operator tarafından incelenir. Bu, bir pazar yerinden daha yavaştır — ve bir satın alma ekibi için daha kullanışlıdır.",
        "about.exploreBeta": "Beta erişimi talep et",
        "about.trustStripLabel": "SmartSeek beta sürecinde güveni nasıl kazanır",
        "about.values.rfqTitle": "Yapılandırılmış RFQ yönlendirmesi",
        "about.values.rfqDesc": "RFQ'lar bir SmartSeek sourcing operator tarafından elenir ve yönlendirilir. Toplu erişim yok. Aracı tiyatrosu yok.",
        "supplier.resultsMatching": "Eşleşen tedarikçiler gösteriliyor",
        "verificationPage.lastReviewed": "Son inceleme: Mayıs 2026",
    },
}

# -----------------------------------------------------------------------------
# Op 3 — remove orphan keys (present in non-EN locales, no longer in EN).
# -----------------------------------------------------------------------------
ORPHAN_KEYS = {
    "about.entrepreneurs",
    "about.entrepreneursDesc",
    "about.values.speedTitle",
    "about.values.speedDesc",
}


def patch(locale: str) -> dict:
    path = LOCALES_DIR / locale / "translation.json"
    with path.open("r", encoding="utf-8") as f:
        data = json.load(f)

    before = len(data)
    actions = {"tagline_changed": False, "added": [], "removed": []}

    # Op 1: footer.tagline overwrite
    if locale in FOOTER_TAGLINE:
        new = FOOTER_TAGLINE[locale]
        if data.get("footer.tagline") != new:
            data["footer.tagline"] = new
            actions["tagline_changed"] = True

    # Op 2: parity additions (additive — never overwrite existing values)
    for k, v in PARITY_ADDITIONS.get(locale, {}).items():
        if k not in data:
            data[k] = v
            actions["added"].append(k)

    # Op 3: orphan removal
    for k in list(data.keys()):
        if k in ORPHAN_KEYS:
            del data[k]
            actions["removed"].append(k)

    after = len(data)

    with path.open("w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        f.write("\n")

    return {"locale": locale, "before": before, "after": after, **actions}


def main():
    for l in ["es", "ru", "zh", "ja", "tr"]:
        r = patch(l)
        print(
            f"  {r['locale']}: {r['before']} -> {r['after']}  "
            f"tagline_changed={r['tagline_changed']}  "
            f"added={len(r['added'])}  removed={len(r['removed'])}"
        )

    # Verify final parity vs EN
    en = json.load(open(LOCALES_DIR / "en" / "translation.json"))
    en_keys = set(en.keys())
    print("\nFinal parity vs EN:")
    print(f"  en: {len(en)} keys")
    for l in ["es", "ru", "zh", "ja", "tr"]:
        d = json.load(open(LOCALES_DIR / l / "translation.json"))
        miss = en_keys - set(d.keys())
        extra = set(d.keys()) - en_keys
        print(f"  {l}: total={len(d)}  missing={len(miss)}  extra={len(extra)}")
        if miss:
            for k in sorted(miss):
                print(f"     missing: {k}")
        if extra:
            for k in sorted(extra):
                print(f"     extra:   {k}")


if __name__ == "__main__":
    main()
