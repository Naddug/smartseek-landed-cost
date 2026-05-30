#!/usr/bin/env node
/**
 * Phase D — Turkish native UX polish + new public i18n keys (en source, tr primary)
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "../client/public/locales");

const EN_NEW = {
  "publicSearch.card.bestFor": "Best for:",
  "publicSearch.card.manufacturer": "direct production sourcing",
  "publicSearch.card.trader": "trade procurement",
  "publicSearch.card.distributor": "distribution and replenishment",
  "publicSearch.card.responseSpeed": "Response time: contact supplier for details",
  "publicSearch.card.inviteRfq": "Invite to RFQ",
  "publicSearch.recentQueries": "Recent searches",
  "publicSearch.narrowerQuery": "Try a narrower query",
  "publicSearch.meta.title": "Supplier directory search | SmartSeek",
  "publicSearch.meta.description":
    "Search suppliers by material, process, region, or certification. Continue to RFQ when no public result is available.",
  "publicSearch.chip.steel": "Steel",
  "publicSearch.chip.copper": "Copper",
  "publicSearch.chip.bearings": "Bearings",
  "publicSearch.chip.polymers": "Polymers",
  "publicSearch.chip.adhesives": "Adhesives",
  "publicSearch.chip.packaging": "Packaging",
  "publicSearch.chip.solar": "Solar modules",
  "publicSearch.chip.connectors": "Connectors",
  "rfqStatus.status.pending.label": "Received",
  "rfqStatus.status.pending.help": "Our sourcing team will review your RFQ within one business day.",
  "rfqStatus.status.routing.label": "Routing",
  "rfqStatus.status.routing.help": "We are matching your request to verified suppliers.",
  "rfqStatus.status.quoted.label": "Quotes ready",
  "rfqStatus.status.quoted.help": "Quotes have been sent to your email.",
  "rfqStatus.status.closed.label": "Closed",
  "rfqStatus.status.closed.help": "This RFQ has been closed.",
  "rfqStatus.status.needs_info.label": "Needs info",
  "rfqStatus.status.needs_info.help": "We need clarification — check your email.",
  "rfqStatus.methodologyLink": "How RFQs are routed",
  "trustPage.rfqStep1Title": "Intake check",
  "trustPage.rfqStep1Desc": "Specification, volume, delivery constraints",
  "trustPage.rfqStep2Title": "Qualification check",
  "trustPage.rfqStep2Desc": "Commodity fit, geography, compliance scope",
  "trustPage.rfqStep3Title": "Quote normalization",
  "trustPage.rfqStep3Desc": "MOQ, lead time, Incoterms, provenance",
  "trustPage.evidenceTitle": "Evidence scope and limitations",
  "trustPage.evidenceBody":
    "SmartSeek provides verification signals for sourcing — not legal, sanctions, or financial advice. Buyers remain responsible for contracting, payment security, inspection, and local compliance.",
  "trustPage.evidenceFootnote":
    "We state evidence boundaries explicitly because procurement confidence improves when limits are clear.",
  "publicSearch.savedCount": "Saved suppliers: {{count}}",
  "publicSearch.compareCount": "Compare list: {{count}}/3",
  "publicSearch.empty.tip": "Tip: add region, certification, or process terms to narrow the search.",
  "publicSearch.meta.titleWithQuery": "Supplier search: {{query}} | SmartSeek",
  "publicSearch.meta.descriptionWithQuery":
    "Find supplier options for {{query}}. Continue to RFQ when no public result is available.",
};

const TR_NEW = {
  ...Object.fromEntries(
    Object.entries({
      "publicSearch.card.bestFor": "Uygun alan:",
      "publicSearch.card.manufacturer": "doğrudan üretim tedariki",
      "publicSearch.card.trader": "ticari tedarik",
      "publicSearch.card.distributor": "dağıtım ve yenileme",
      "publicSearch.card.responseSpeed": "Yanıt süresi: detay için tedarikçiyle iletişime geçin",
      "publicSearch.card.inviteRfq": "RFQ'ya davet et",
      "publicSearch.recentQueries": "Son aramalar",
      "publicSearch.narrowerQuery": "Daha dar bir arama deneyin",
      "publicSearch.meta.title": "Tedarikçi dizini araması | SmartSeek",
      "publicSearch.meta.description":
        "Malzeme, süreç, bölge veya sertifikaya göre tedarikçi arayın. Herkese açık sonuç yoksa RFQ gönderin.",
      "publicSearch.chip.steel": "Çelik",
      "publicSearch.chip.copper": "Bakır",
      "publicSearch.chip.bearings": "Rulman",
      "publicSearch.chip.polymers": "Polimer",
      "publicSearch.chip.adhesives": "Yapıştırıcı",
      "publicSearch.chip.packaging": "Ambalaj",
      "publicSearch.chip.solar": "Güneş modülü",
      "publicSearch.chip.connectors": "Konnektör",
      "rfqStatus.status.pending.label": "Alındı",
      "rfqStatus.status.pending.help": "Tedarik ekibimiz RFQ'nuzu bir iş günü içinde inceler.",
      "rfqStatus.status.routing.label": "Yönlendiriliyor",
      "rfqStatus.status.routing.help": "Talebiniz doğrulanmış tedarikçilerle eşleştiriliyor.",
      "rfqStatus.status.quoted.label": "Teklifler hazır",
      "rfqStatus.status.quoted.help": "Teklifler e-posta adresinize gönderildi.",
      "rfqStatus.status.closed.label": "Kapalı",
      "rfqStatus.status.closed.help": "Bu RFQ kapatıldı.",
      "rfqStatus.status.needs_info.label": "Bilgi gerekli",
      "rfqStatus.status.needs_info.help": "Netleştirme gerekiyor — e-postanızı kontrol edin.",
      "rfqStatus.methodologyLink": "RFQ nasıl yönlendirilir",
      "trustPage.rfqStep1Title": "Talep kontrolü",
      "trustPage.rfqStep1Desc": "Spesifikasyon, hacim, teslimat koşulları",
      "trustPage.rfqStep2Title": "Uygunluk kontrolü",
      "trustPage.rfqStep2Desc": "Emtia uyumu, coğrafya, uyum kapsamı",
      "trustPage.rfqStep3Title": "Teklif standardizasyonu",
      "trustPage.rfqStep3Desc": "MOQ, termin, Incoterms, kaynak bilgisi",
      "trustPage.evidenceTitle": "Kanıt kapsamı ve sınırlar",
      "trustPage.evidenceBody":
        "SmartSeek tedarik için doğrulama sinyalleri sunar — hukuki, yaptırım veya finansal danışmanlık değildir. Sözleşme, ödeme güvenliği, muayene ve yerel uyum alıcı sorumluluğundadır.",
      "trustPage.evidenceFootnote":
        "Kanıt sınırlarını açık tutuyoruz; sınırlar net olduğunda satın alma güveni artar.",
      "publicSearch.savedCount": "Kayıtlı tedarikçi: {{count}}",
      "publicSearch.compareCount": "Karşılaştırma listesi: {{count}}/3",
      "publicSearch.empty.tip": "İpucu: bölge, sertifika veya süreç terimleri ekleyerek aramayı daraltın.",
      "publicSearch.meta.titleWithQuery": "Tedarikçi araması: {{query}} | SmartSeek",
      "publicSearch.meta.descriptionWithQuery":
        "{{query}} için tedarikçi seçenekleri. Herkese açık sonuç yoksa RFQ gönderin.",
    })
  ),
};

const TR_POLISH = {
  "footer.tagline": "Endüstriyel tedarik ekipleri için doğrulanmış tedarik ağı.",
  "footer.designedFor": "Kayıt doğrulamalı. Operatör yönlendirmeli. Satın alma ekipleri için.",
  "publicBanner.foundingSupport": "Kurucu kullanıcılara öncelikli tedarik desteği",
  "publicBanner.requestAccess": "Beta erişimi talep et",
  "publicFooter.howItWorks": "Nasıl çalışır",
  "publicFooter.curatedNetworkTitle": "Seçilmiş tedarikçi ağı",
  "publicFooter.curatedNetworkDesc":
    "Kamu sicilleri, ticaret kayıtları ve doğrudan başvurulardan — toplu veri kazıması değil.",
  "publicFooter.verificationFirstTitle": "Önce doğrulama",
  "publicFooter.verificationFirstDesc":
    "Yayınlanan her tedarikçi sicil kaydı ve doğrulanmış iletişim kanalıyla kontrol edilir.",
  "publicFooter.operatorRfqTitle": "Kontrollü RFQ yönlendirmesi",
  "publicFooter.operatorRfqDesc":
    "RFQ'nuzu tedarik ekibimiz yönlendirir — otomatik toplu e-posta ve pazar yeri spam'i yok.",
  "publicFooter.readMethodology": "Tedarik metodolojimizi okuyun",
  "publicFooter.sourcing": "Tedarik",
  "publicFooter.methodology": "Tedarik metodolojisi",
  "home.hero.subtitle":
    "Doğrulanmış tedarikçileri bulun, RFQ gönderin. MOQ, termin ve Incoterms'li teklifleri ekibimiz yönlendirir.",
  "home.hero.submitRfq": "RFQ gönder",
  "home.hero.becomeSupplier": "Tedarikçi ol",
  "home.hero.builtFor": "Spesifikasyon odaklı tedarik yürüten endüstriyel ekipler için.",
  "home.trust.operatorRouting": "Kontrollü RFQ yönlendirmesi",
  "home.trust.structuredQuotes": "MOQ, termin ve Incoterms'li teklifler",
  "home.sections.previewTitle": "Sektörler genelinde doğrulanmış tedarikçiler",
  "home.sections.previewBody":
    "Metaller, imalat, kimyasal, ambalaj ve makinede sicil doğrulamalı örnekler. Tam dizin beta'da kurucu kullanıcılara açık.",
  "home.preview.tabPackaging": "Ambalaj",
  "home.preview.lockBody": "Beta süresince ücretsiz. Kurucu kullanıcılar tam dizine erişir.",
  "home.preview.lockCta": "Beta erişimi talep et",
  "home.founding.body":
    "Beta'da sınırlı sayıda satın alma ekibine doğrudan tedarik desteği ve hızlı RFQ yönlendirmesi sunuyoruz.",
  "home.founding.requestBeta": "Beta erişimi talep et",
  "home.founding.submitRfq": "RFQ gönder",
  "home.why.title": "Doğrulanmış profiller. Toplu gönderim yok. Pazar yeri gösterisi yok.",
  "home.why.body":
    "Her tedarikçi kamu siciline karşı kontrol edilir ve doğrudan iletişimle teyit edilir. RFQ'ları algoritma değil, tedarik ekibimiz yönlendirir.",
  "home.why.pill1": "Sicil temelli doğrulama",
  "home.why.pill2": "Tedarik ekibi yönlendirmesi",
  "home.why.pill3": "Doğrudan tedarikçi teması",
  "about.subtitle":
    "Sınır ötesi endüstriyel tedarikte fiilen çalışan operatörler tarafından kuruldu. Kayıt doğrulaması, kontrollü RFQ yönlendirmesi — hacim odaklı pazar yerlerinin tersine.",
  "about.missionTitle": "Ne yapıyoruz",
  "about.mission1":
    "Satın alma ekiplerinin sicil doğrulamalı tedarikçi bulmasına, RFQ göndermesine ve MOQ, termin, Incoterms'li teklif almasına yardımcı oluyoruz.",
  "about.mission2":
    "Sınır ötesi ticarette gördüğümüz tekrarlayan sorunlara yanıt: sahte doğrulanmış profiller, niteliksiz RFQ yağmuru, sicil kaydının kapasite kanıtı sayılması. Çözümümüz sicil doğrulaması ve tedarik ekibi yönlendirmesi.",
  "about.serveTitle": "Kime hizmet ediyoruz",
  "about.procurers": "Endüstriyel satın alma ekipleri",
  "about.procurersDesc":
    "Metal, imalat girdisi, kimyasal, ambalaj ve makinede RFQ yürüten alıcı ekipleri.",
  "about.suppliersDesc":
    "Nitelikli RFQ isteyen üretici, trader ve distribütörler — pazar yeri spam'i değil.",
  "about.standForTitle": "Nasıl çalışıyoruz",
  "about.values.integrityTitle": "Önce sicil doğrulaması",
  "about.values.integrityDesc":
    "Her tedarikçi kamu siciline bağlanır. Rozet değil, kaynak gösteririz.",
  "about.values.globalTitle": "Sınır ötesi odak",
  "about.values.globalDesc":
    "Bölge, Incoterms ve spesifikasyon farklarını bilen ekipler için — tek ülke rehberi değil.",
  "about.antiMarketplace":
    "Dizin taramayız, RFQ toplu göndermeyiz, sicilde bulamadığımız tedarikçiyi yayınlamayız. Her talep yönlendirilmeden önce tedarik ekibimiz tarafından incelenir.",
  "about.values.rfqTitle": "Kontrollü RFQ yönlendirmesi",
  "about.values.rfqDesc": "RFQ'ları tedarik ekibimiz eler ve yönlendirir. Toplu erişim yok.",
  "about.exploreBeta": "Beta erişimi talep et",
  "about.trustStripLabel": "Beta sürecinde güven nasıl oluşur",
  "trustPage.rfqBody":
    "SmartSeek'e gelen her RFQ, platformdan çıkmadan önce tedarik ekibimiz tarafından incelenir. Tamlık, uyum ve tedarikçi uyumu kontrol edilir; ardından yalnızca ilgili doğrulanmış tedarikçilere gider. Otomatik toplu RFQ göndermiyoruz.",
  "trustPage.rfqLink": "Tedarik metodolojisini gör →",
  "methodologyPage.subtitle":
    "SmartSeek operatör yönlendirmelidir. Her RFQ, tedarikçiye ulaşmadan önce tedarik ekibimiz tarafından incelenir.",
  "methodologyPage.step1.body":
    "Alıcı RFQ gönderdiğinde tedarik ekibimiz tamlığı kontrol eder — emtia, miktar, varış, termin, düzenleyici kısıtlar — bir iş günü içinde. Eksik talepler net sorularla geri döner.",
  "publicSearch.hero.subtitle":
    "Endüstriyel malzeme, imalat, kimyasal, ambalaj ve makinede sicil doğrulamalı tedarikçi arayın. Tam dizin beta'da kurucu kullanıcılara açık.",
  "publicSearch.empty.body":
    "Herkese açık liste bilinçli olarak sınırlıdır. Aradığınız tedarikçi yoksa RFQ gönderin; tedarik ekibimiz iç indeks ve doğrulanmış ağımızda arar.",
  "publicSearch.footer.submitRfq": "RFQ gönder — sizin için kaynak bulalım",
  "publicSearch.empty.requestBeta": "Tedarik desteği talep et",
  "rfqStatus.subtitle":
    "RFQ numaranızı ve başvuru e-postanızı girin. Tedarik ekibimizden güncel durumu görün.",
  "pricing.feature3": "Her RFQ'yu tedarik ekibimiz inceler ve yönlendirir",
  "pricing.feature5": "Doğrudan tedarik ekibi desteği (e-posta)",
  "supplier.hero.subtitleWithCountries":
    "{{countries}} ülkede sicil doğrulamalı tedarikçiler — tedarik ekibimiz inceler.",
  "supplier.hero.subtitleWorldwide":
    "Dünya genelinde sicil doğrulamalı tedarikçiler — tedarik ekibimiz inceler.",
  "supplier.hero.subtitleNoStats": "Sicil doğrulamalı küresel tedarikçi arama",
  "sampleReport.step2Title": "Tedarik ekibi incelemesi",
  "sampleReport.step2Desc":
    "Tedarik ekibimiz tamlığı kontrol eder, sicil bağlamını doğrular ve yalnızca ilgili doğrulanmış tedarikçilere yönlendirir.",
  "trustBadge.operator.sub": "Tedarik ekibi yönlendirmesi",
  "trustBadge.structured": "Kontrollü RFQ süreci",
  "trustBadge.structured.sub": "Önce spesifikasyon",
  "becomeSupplier.success.body1":
    "Teşekkürler. Tedarik ekibimiz başvurunuzu ve sicil bilgilerinizi inceler. Genellikle 1–3 iş günü içinde dönüş yaparız:",
  "becomeSupplier.cards.rfqBody":
    "Alıcı talepleri tedarik ekibi tarafından süzülür; yalnızca ilgili tedarikçilere gider.",
  "rfq.form.howItWorksBody":
    "Gereksinimlerinizi girin. Tedarik ekibimiz RFQ'nuzu ilgili doğrulanmış tedarikçilerle paylaşır. Teklifler genellikle 1–3 iş gününde e-postanıza gelir. Hesap gerekmez.",
  "home.trustBlock.body":
    "SmartSeek sicil kayıtlı tedarikçi profilleri ve tam landed cost görünümü sunar — yalnızca birim fiyat değil. Sınır ötesi tedarik operatörleri tarafından kuruldu; pazar yeri listeleme ekibi değil.",
  "home.hiw.step3.desc":
    "Tedarik ekibimiz tarafından incelenen yapılandırılmış RFQ gönderin. Teklifler MOQ, termin ve Incoterms ile döner.",
  "home.step2.title": "SmartSeek tedarik ekibi incelemesi",
  "home.step2.desc":
    "Tedarik ekibimiz talebinizi süzer, sicil kaynağını doğrular ve RFQ'yu yalnızca doğrulanmış tedarikçilere yönlendirir.",
};

function patch(loc, keys) {
  const fp = path.join(root, loc, "translation.json");
  const data = JSON.parse(fs.readFileSync(fp, "utf8"));
  Object.assign(data, keys);
  fs.writeFileSync(fp, JSON.stringify(data, null, 2) + "\n");
  return Object.keys(keys).length;
}

const enN = patch("en", EN_NEW);
const trN = patch("tr", { ...TR_NEW, ...TR_POLISH });
for (const loc of ["zh", "es", "ru", "ja"]) {
  patch(loc, EN_NEW);
}
console.log(`en: +${enN} keys, tr: ${trN} keys patched, zh/es/ru/ja: +${enN} keys each`);
