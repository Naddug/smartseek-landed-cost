#!/usr/bin/env node
/**
 * Phase E Batch 2 — supplier detail/category i18n + category locale polish + tools demotion keys
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "../client/public/locales");

const EN = {
  // ── Supplier detail ──
  "supplierDetail.na.rfq": "Confirmed during RFQ qualification",
  "supplierDetail.na.registry": "Registry verification in progress",
  "supplierDetail.na.disclosed": "Not publicly disclosed",
  "supplierDetail.na.viewRecord": "View record",
  "supplierDetail.na.trackedInternally": "Tracked internally",
  "supplierDetail.na.routedViaTeam": "Routed via sourcing team",

  "supplierDetail.back": "Back to suppliers",
  "supplierDetail.loading": "Loading supplier dossier…",
  "supplierDetail.notFound.title": "Not in the public directory",
  "supplierDetail.notFound.body":
    "Our public directory is intentionally curated. Submit an RFQ — our sourcing team will search our internal index and verified network.",
  "supplierDetail.notFound.submitRfq": "Submit RFQ",
  "supplierDetail.notFound.becomeSupplier": "Become a supplier",

  "supplierDetail.strategicMaterial": "Strategic material:",
  "supplierDetail.profileStrength": "Profile completeness",
  "supplierDetail.profileDisclaimer":
    "Profile completeness reflects published metadata — not a quality or marketplace rating.",
  "supplierDetail.strength.strong.label": "Strong",
  "supplierDetail.strength.strong.help": "Most procurement metadata is present. Ready for RFQ.",
  "supplierDetail.strength.workable.label": "Workable",
  "supplierDetail.strength.workable.help": "Enough metadata for RFQ; gaps confirmed during qualification.",
  "supplierDetail.strength.limited.label": "Limited",
  "supplierDetail.strength.limited.help": "Several fields missing. RFQ qualification will fill gaps.",
  "supplierDetail.strength.sparse.label": "Sparse",
  "supplierDetail.strength.sparse.help": "Limited published metadata. Submit an RFQ — our team collects details directly.",

  "supplierDetail.facts.referenceScore": "Reference score",
  "supplierDetail.facts.workforce": "Workforce",
  "supplierDetail.facts.founded": "Founded",
  "supplierDetail.facts.employees": "{{count}} employees",

  "supplierDetail.card.verification.title": "Verification & provenance",
  "supplierDetail.card.verification.subtitle": "SmartSeek directory",
  "supplierDetail.card.verification.footnote":
    "We do not publish suppliers without a located public registry record.",
  "supplierDetail.card.verification.link": "See verification standards →",
  "supplierDetail.card.capabilities.title": "Capabilities",
  "supplierDetail.card.capabilities.subtitle": "Industries served",
  "supplierDetail.card.products.title": "Products & sourcing categories",
  "supplierDetail.card.products.subtitle": "Published catalogue",
  "supplierDetail.card.certifications.title": "Certifications",
  "supplierDetail.card.certifications.subtitle": "Quality, environmental, and sector standards",
  "supplierDetail.card.export.title": "Export markets",
  "supplierDetail.card.export.subtitle": "Published shipping destinations",
  "supplierDetail.card.commercial.title": "Commercial profile",
  "supplierDetail.card.commercial.subtitle": "MOQ, payment, incoterms, lead time",
  "supplierDetail.card.commercial.footnote":
    "Only published fields are shown. Missing items are confirmed during RFQ qualification.",
  "supplierDetail.card.comms.title": "Communication readiness",
  "supplierDetail.card.digital.title": "Digital presence",
  "supplierDetail.card.digital.subtitle": "{{source}} · domain match",
  "supplierDetail.card.digital.pagesIndexed": "{{count}} pages indexed",
  "supplierDetail.card.digital.homepageIndexed": "Homepage indexed",
  "supplierDetail.card.digital.lastUpdate": "Last update:",
  "supplierDetail.card.digital.footnote":
    "Digital presence is matched on a verified website domain. We do not fabricate profiles.",
  "supplierDetail.card.channels.title": "Verified communication channels",
  "supplierDetail.card.channels.subtitleRelease": "Released after RFQ qualification",
  "supplierDetail.card.channels.subtitleMasked": "Masked until RFQ qualification",
  "supplierDetail.card.channels.viewPage": "View company page",
  "supplierDetail.card.channels.more": "+{{count}} more",
  "supplierDetail.card.channels.footnote":
    "Contact previews are masked until our team screens your RFQ. Unverified contacts are never published.",
  "supplierDetail.card.maturity.title": "Operational maturity indicators",
  "supplierDetail.card.maturity.subtitle": "From registry and published data",
  "supplierDetail.card.logistics.title": "Export & logistics",
  "supplierDetail.card.logistics.subtitle": "From published profile",
  "supplierDetail.card.scenarios.title": "Typical sourcing use cases",
  "supplierDetail.card.scenarios.subtitle": "Interpretation from published data",
  "supplierDetail.card.buyerFit.title": "Best suited for",
  "supplierDetail.card.buyerFit.subtitle": "Likely procurement fit",
  "supplierDetail.card.suitability.title": "Verification indicators",
  "supplierDetail.card.suitability.subtitle": "From published profile",
  "supplierDetail.card.suitability.empty": "Indicators confirmed during RFQ review.",
  "supplierDetail.card.rfqChecklist.title": "RFQ readiness checklist",
  "supplierDetail.card.rfqChecklist.subtitle": "Fields that improve quote quality",
  "supplierDetail.card.rfqChecklist.footnote":
    "Suggested fields — not mandatory. Submit even if some are unknown.",
  "supplierDetail.card.qualification.title": "Suggested qualification checks",
  "supplierDetail.card.qualification.subtitle": "Procurement due-diligence checklist",
  "supplierDetail.card.qualification.footnote": "Several checks are handled during RFQ routing.",
  "supplierDetail.card.qualification.link": "How RFQs are routed →",
  "supplierDetail.contactPath.title": "Buyer-safe communication path",
  "supplierDetail.contactPath.type": "Type:",
  "supplierDetail.contactPath.website": "Website:",
  "supplierDetail.contactPath.email": "Email:",
  "supplierDetail.contactPath.phone": "Phone:",
  "supplierDetail.contactPath.footnote":
    "Direct contact is released after our team screens your RFQ — protecting suppliers from spam.",

  "supplierDetail.kv.tier": "Verification tier",
  "supplierDetail.kv.registry": "Registry record",
  "supplierDetail.kv.industry": "Industry classification",
  "supplierDetail.kv.lastUpdate": "Last profile update",
  "supplierDetail.kv.industryField": "Industry",
  "supplierDetail.kv.subIndustry": "Sub-industry",
  "supplierDetail.kv.type": "Type",
  "supplierDetail.kv.moq": "Minimum order value",
  "supplierDetail.kv.leadTime": "Lead time",
  "supplierDetail.kv.payment": "Payment terms",
  "supplierDetail.kv.incoterms": "Incoterms",
  "supplierDetail.kv.response": "Response speed",

  "supplierDetail.actions.submitRfq": "Submit RFQ to engage supplier",
  "supplierDetail.actions.save": "Save supplier",
  "supplierDetail.actions.saved": "Saved",
  "supplierDetail.actions.compare": "Add to compare (up to 3)",
  "supplierDetail.actions.inCompare": "In compare",

  "supplierDetail.tier.operatorVerified": "Operator-verified",
  "supplierDetail.tier.registryVerified": "Registry-verified",

  "supplierDetail.confidence.operatorReviewed": "Operator reviewed",
  "supplierDetail.confidence.registryVerified": "Registry verified",
  "supplierDetail.confidence.domainVerified": "Domain verified",
  "supplierDetail.confidence.selfReported": "Self reported",
  "supplierDetail.confidence.pending": "Pending verification",

  "supplierDetail.channel.website": "Website",
  "supplierDetail.channel.linkedin": "LinkedIn company page",
  "supplierDetail.channel.email": "Business email",
  "supplierDetail.channel.phone": "Business phone",
  "supplierDetail.channel.address": "Registry address",
  "supplierDetail.channel.onFile": "{{count}} on file · released after RFQ qualification",

  "supplierDetail.type.manufacturer": "Manufacturer",
  "supplierDetail.type.trader": "Trader",
  "supplierDetail.type.distributor": "Distributor",

  "supplierDetail.tag.registryVerified": "Registry-verified",
  "supplierDetail.tag.contactVerified": "Operator-verified contact",
  "supplierDetail.tag.directManufacturer": "Direct manufacturer",
  "supplierDetail.tag.trader": "Trader / distribution",
  "supplierDetail.tag.exportRecord": "Export track record",
  "supplierDetail.tag.origin": "{{country}} origin",

  "supplierDetail.comms.directAfterRfq": "Direct after RFQ qualification",
  "supplierDetail.comms.directAfterRfqHelp":
    "Contact channel released once our sourcing team screens your RFQ.",
  "supplierDetail.comms.teamRouted": "Sourcing team routing",
  "supplierDetail.comms.teamRoutedHelp":
    "Contact details released after RFQ screening to prevent spam outreach.",
  "supplierDetail.comms.pending": "Verification pending",
  "supplierDetail.comms.pendingHelp":
    "Registry record will be confirmed before contact release.",

  "supplierDetail.leadTime.weeks2": "~{{days}} days (within 2 weeks)",
  "supplierDetail.leadTime.month1": "~{{days}} days (within 1 month)",
  "supplierDetail.leadTime.months2": "~{{days}} days (1–2 months)",
  "supplierDetail.leadTime.days": "~{{days}} days",

  "supplierDetail.seo.title": "{{name}} – supplier profile | SmartSeek",
  "supplierDetail.seo.typeManufacturer": " manufacturer",
  "supplierDetail.seo.typeGeneric": " supplier",
  "supplierDetail.seo.desc":
    "{{name}} is a{{type}} based in {{location}}. {{industry}} Review verification status and RFQ guidance on SmartSeek.",
  "supplierDetail.seo.breadcrumbHome": "Home",
  "supplierDetail.seo.breadcrumbSuppliers": "Suppliers",

  // Buyer fit lines
  "supplierDetail.buyerFit.mfg1": "OEM and direct-from-mill procurement",
  "supplierDetail.buyerFit.mfg2": "Programs requiring traceable production origin",
  "supplierDetail.buyerFit.trader1": "Spot purchases and blended sourcing programs",
  "supplierDetail.buyerFit.trader2": "Buyers needing flexible incoterms and origin mix",
  "supplierDetail.buyerFit.dist1": "Recurring replenishment with shorter lead times",
  "supplierDetail.buyerFit.dist2": "Buyers without container-level minimums",
  "supplierDetail.buyerFit.common1": "Strategic sourcing and category management teams",
  "supplierDetail.buyerFit.common2": "Industrial buyers running structured RFQs",

  // RFQ recs generic
  "supplierDetail.rfqRec.spec": "Exact specification and tolerance (purity, grade, dimensions, alloy)",
  "supplierDetail.rfqRec.qty": "Quantity, packaging, and unit",
  "supplierDetail.rfqRec.origin": "Origin / country-of-manufacture preference",
  "supplierDetail.rfqRec.incoterm": "Incoterm and destination port",
  "supplierDetail.rfqRec.lead": "Lead time and required delivery window",
  "supplierDetail.rfqRec.price": "Target price reference and currency",
  "supplierDetail.rfqRec.docs": "Quality documents required (mill test cert, COA, ISO scope)",

  // Qual checks
  "supplierDetail.qual.registry": "Confirm legal entity status against the company registry",
  "supplierDetail.qual.references": "Request three recent buyer references in your destination region",
  "supplierDetail.qual.mtc": "Request a current mill test certificate or certificate of analysis",
  "supplierDetail.qual.iso": "Verify ISO / industry certifications are in scope and unexpired",
  "supplierDetail.qual.bank": "Confirm bank account is held in the same legal entity name",
  "supplierDetail.qual.trace": "Ask for underlying producer / mill source for traceability",
  "supplierDetail.qual.inProgress": "Verification in progress — request registry extract before sample order",

  // Maturity / export / scenarios (representative — dynamic parts use interpolation)
  "supplierDetail.maturity.yearsPlus": "{{years}}+ years of trading history",
  "supplierDetail.maturity.established": "Established {{years}} years ago",
  "supplierDetail.maturity.since": "Operating since {{year}}",
  "supplierDetail.maturity.workforceBand": "Workforce band {{band}}",
  "supplierDetail.maturity.workforceCount": "Reported workforce ~{{count}}",
  "supplierDetail.maturity.registryLocated": "Registry record located and verified",
  "supplierDetail.maturity.contactConfirmed": "Operator-confirmed direct contact",
  "supplierDetail.maturity.certs": "{{count}} published certification on file",
  "supplierDetail.maturity.certs_plural": "{{count}} published certifications on file",
  "supplierDetail.export.confirmed": "Confirmed export to {{markets}}",
  "supplierDetail.export.pending": "Export track record confirmed during RFQ qualification",
  "supplierDetail.export.incoterms": "Published incoterms: {{terms}}",
  "supplierDetail.export.leadTime": "Stated lead time {{time}}",
  "supplierDetail.export.operating": "Operating from {{location}}",

  // ── Category page (new wiring) ──
  "category.card.productsUponRfq": "Product details confirmed during RFQ",
  "category.card.viewProfile": "View profile",
  "category.card.requestRfq": "Request RFQ",
  "category.card.save": "Save",
  "category.card.saved": "Saved",
  "category.card.compare": "Compare",
  "category.card.inCompare": "In compare",
  "category.trust.registryVerified": "Registry-verified suppliers",
  "category.trust.operatorRouting": "Operator-led RFQ routing",
  "category.quickBrowse": "Strategic materials — quick browse",
  "category.results.curated": "Curated results",
  "category.overlay.title": "Full {{name}} directory available to founding users",
  "category.overlay.body":
    "Beta access is controlled. Founding buyers receive direct sourcing support and structured RFQ routing.",
  "category.overlay.betaAccess": "Request beta access",
  "category.overlay.rfqInstead": "Submit RFQ instead",
  "category.empty.title": "No public preview for {{name}} yet",
  "category.empty.body":
    "Our public directory is intentionally curated. Submit an RFQ — our sourcing team will search our internal index and verified network.",
  "category.submitRfq": "Submit RFQ",
  "category.becomeSupplier": "Become a supplier",
  "category.requestBeta": "Request beta access",
  "category.procurement.sourcedTitle": "Commonly sourced for",
  "category.procurement.sourcedBody": "Manufacturing inputs, commodity procurement, and supplier qualification.",
  "category.procurement.rfqTitle": "Recommended RFQ fields",
  "category.procurement.rfqBody": "MOQ, Incoterms, target quantity, destination country, and delivery timeline.",
  "category.procurement.contactTitle": "Contact visibility",
  "category.procurement.contactBody": "Commercial and contact details shared during RFQ qualification.",
  "category.meta.title": "{{name}} suppliers – registry-verified | SmartSeek",
  "category.meta.description":
    "Registry-verified {{name}} suppliers with procurement context, RFQ workflows, and verification visibility on SmartSeek.",

  // Category locale polish (overwrite marketplace tone)
  "category.description":
    "Registry-verified {{name}} suppliers and manufacturers. Compare certifications, verification status, and RFQ routing — operator-led, not marketplace volume.",
  "category.feature3.title": "Structured RFQ routing",
  "category.feature3.desc": "Submit an RFQ and our sourcing team routes it to relevant verified suppliers.",
  "category.cta.desc":
    "Procurement teams use SmartSeek for registry-verified supplier discovery and controlled RFQ workflows.",
  "category.cta.primary": "Submit RFQ",
  "category.freeUnlocks":
    "Founding users access the full supplier list and verified contact details where available.",
  "category.whySource.desc":
    "SmartSeek cross-references company registries and trade records — not bulk scraped directories.",

  // Tools demotion
  "toolsPage.title": "Trade tools & calculators",
  "toolsPage.subtitle": "Procurement calculators for landed cost, customs, shipping, and trade analysis.",
  "toolsPage.openTool": "Open tool",
  "toolsPage.tradeData.title": "Trade data dashboard",
  "toolsPage.tradeData.desc": "Import/export trends, price indices, and trade flow analysis",
  "toolsPage.tradeData.f1": "Import/export trends",
  "toolsPage.tradeData.f2": "Price index",
  "toolsPage.tradeData.f3": "Supplier benchmarks",
  "toolsPage.tradeData.f4": "Market analysis",
  "toolsPage.landedCost.title": "Landed cost calculator",
  "toolsPage.landedCost.desc": "Full landed cost: freight, insurance, customs, inland transport",
  "toolsPage.customs.title": "Customs fee calculator",
  "toolsPage.customs.desc": "Import duties, VAT, and total landed cost by product",
  "toolsPage.shipping.title": "Shipping cost estimator",
  "toolsPage.shipping.desc": "Compare sea, air, and express courier rates",
  "toolsPage.sourcing.title": "Sourcing reports",
  "toolsPage.sourcing.desc": "Structured sourcing reports with registry-verified supplier recommendations",
  "toolsPage.sourcing.f1": "Supplier evaluation",
  "toolsPage.sourcing.f2": "Supplier matching",
  "toolsPage.sourcing.f3": "Cost breakdown",
  "toolsPage.sourcing.f4": "Risk assessment",
  "toolsPage.badge.new": "New",
  "toolsPage.badge.popular": "Popular",
};

// TR translations — native industrial tone
const TR = {
  "supplierDetail.na.rfq": "RFQ uygunluk sürecinde teyit edilir",
  "supplierDetail.na.registry": "Sicil doğrulaması devam ediyor",
  "supplierDetail.na.disclosed": "Herkese açık değil",
  "supplierDetail.na.viewRecord": "Kaydı görüntüle",
  "supplierDetail.na.trackedInternally": "Dahili takip",
  "supplierDetail.na.routedViaTeam": "Tedarik ekibi yönlendirmesi",

  "supplierDetail.back": "Tedarikçilere dön",
  "supplierDetail.loading": "Tedarikçi dosyası yükleniyor…",
  "supplierDetail.notFound.title": "Herkese açık dizinde yok",
  "supplierDetail.notFound.body":
    "Herkese açık dizin bilinçli olarak sınırlıdır. RFQ gönderin — tedarik ekibimiz iç indeks ve doğrulanmış ağımızda arar.",
  "supplierDetail.notFound.submitRfq": "RFQ gönder",
  "supplierDetail.notFound.becomeSupplier": "Tedarikçi ol",

  "supplierDetail.strategicMaterial": "Stratejik malzeme:",
  "supplierDetail.profileStrength": "Profil tamlığı",
  "supplierDetail.profileDisclaimer":
    "Profil tamlığı yalnızca yayınlanan metadata'yı gösterir — kalite veya pazar yeri puanı değildir.",
  "supplierDetail.strength.strong.label": "Güçlü",
  "supplierDetail.strength.strong.help": "Tedarik metadata'sının çoğu mevcut. RFQ'ya hazır.",
  "supplierDetail.strength.workable.label": "Yeterli",
  "supplierDetail.strength.workable.help": "RFQ için yeterli; eksikler uygunluk sürecinde tamamlanır.",
  "supplierDetail.strength.limited.label": "Sınırlı",
  "supplierDetail.strength.limited.help": "Bazı alanlar eksik. RFQ uygunluk süreci boşlukları doldurur.",
  "supplierDetail.strength.sparse.label": "Seyrek",
  "supplierDetail.strength.sparse.help": "Sınırlı yayınlanan bilgi. RFQ gönderin — ekibimiz detayları toplar.",

  "supplierDetail.facts.referenceScore": "Referans skoru",
  "supplierDetail.facts.workforce": "İşgücü",
  "supplierDetail.facts.founded": "Kuruluş",
  "supplierDetail.facts.employees": "{{count}} çalışan",

  "supplierDetail.card.verification.title": "Doğrulama ve kaynak",
  "supplierDetail.card.verification.subtitle": "SmartSeek dizini",
  "supplierDetail.card.verification.footnote":
    "Kamu sicilinde kaydı bulunmayan tedarikçi yayınlamayız.",
  "supplierDetail.card.verification.link": "Doğrulama standartları →",
  "supplierDetail.card.capabilities.title": "Yetkinlikler",
  "supplierDetail.card.capabilities.subtitle": "Hizmet verilen sektörler",
  "supplierDetail.card.products.title": "Ürünler ve tedarik kategorileri",
  "supplierDetail.card.products.subtitle": "Yayınlanan katalog",
  "supplierDetail.card.certifications.title": "Sertifikalar",
  "supplierDetail.card.certifications.subtitle": "Kalite, çevre ve sektör standartları",
  "supplierDetail.card.export.title": "İhracat pazarları",
  "supplierDetail.card.export.subtitle": "Yayınlanan sevkiyat bölgeleri",
  "supplierDetail.card.commercial.title": "Ticari profil",
  "supplierDetail.card.commercial.subtitle": "MOQ, ödeme, Incoterms, termin",
  "supplierDetail.card.commercial.footnote":
    "Yalnızca yayınlanan alanlar gösterilir. Eksikler RFQ uygunluk sürecinde teyit edilir.",
  "supplierDetail.card.comms.title": "İletişim hazırlığı",
  "supplierDetail.card.digital.title": "Dijital varlık",
  "supplierDetail.card.digital.subtitle": "{{source}} · alan adı eşleşmesi",
  "supplierDetail.card.digital.pagesIndexed": "{{count}} sayfa indekslendi",
  "supplierDetail.card.digital.homepageIndexed": "Ana sayfa indekslendi",
  "supplierDetail.card.digital.lastUpdate": "Son güncelleme:",
  "supplierDetail.card.digital.footnote":
    "Dijital varlık doğrulanmış web alan adına dayanır. Profil uydurmayız.",
  "supplierDetail.card.channels.title": "Doğrulanmış iletişim kanalları",
  "supplierDetail.card.channels.subtitleRelease": "RFQ uygunluğu sonrası paylaşılır",
  "supplierDetail.card.channels.subtitleMasked": "RFQ uygunluğuna kadar maskelenir",
  "supplierDetail.card.channels.viewPage": "Şirket sayfasını gör",
  "supplierDetail.card.channels.more": "+{{count}} daha",
  "supplierDetail.card.channels.footnote":
    "İletişim önizlemeleri RFQ incelemesine kadar maskelenir. Doğrulanmamış iletişim yayınlanmaz.",
  "supplierDetail.card.maturity.title": "Operasyonel olgunluk göstergeleri",
  "supplierDetail.card.maturity.subtitle": "Sicil ve yayınlanan verilerden",
  "supplierDetail.card.logistics.title": "İhracat ve lojistik",
  "supplierDetail.card.logistics.subtitle": "Yayınlanan profilden",
  "supplierDetail.card.scenarios.title": "Tipik tedarik kullanım alanları",
  "supplierDetail.card.scenarios.subtitle": "Yayınlanan veriden yorum",
  "supplierDetail.card.buyerFit.title": "Uygun alıcı profili",
  "supplierDetail.card.buyerFit.subtitle": "Olası tedarik uyumu",
  "supplierDetail.card.suitability.title": "Doğrulama göstergeleri",
  "supplierDetail.card.suitability.subtitle": "Yayınlanan profilden",
  "supplierDetail.card.suitability.empty": "Göstergeler RFQ incelemesinde teyit edilir.",
  "supplierDetail.card.rfqChecklist.title": "RFQ hazırlık kontrol listesi",
  "supplierDetail.card.rfqChecklist.subtitle": "Teklif kalitesini artıran alanlar",
  "supplierDetail.card.rfqChecklist.footnote":
    "Önerilen alanlar — zorunlu değil. Bilinmeyen alanlarla da gönderebilirsiniz.",
  "supplierDetail.card.qualification.title": "Önerilen uygunluk kontrolleri",
  "supplierDetail.card.qualification.subtitle": "Satın alma due diligence listesi",
  "supplierDetail.card.qualification.footnote": "Birçok kontrol RFQ yönlendirmesi sırasında yapılır.",
  "supplierDetail.card.qualification.link": "RFQ nasıl yönlendirilir →",
  "supplierDetail.contactPath.title": "Alıcı güvenli iletişim yolu",
  "supplierDetail.contactPath.type": "Tür:",
  "supplierDetail.contactPath.website": "Web sitesi:",
  "supplierDetail.contactPath.email": "E-posta:",
  "supplierDetail.contactPath.phone": "Telefon:",
  "supplierDetail.contactPath.footnote":
    "Doğrudan iletişim RFQ incelemesi sonrası açılır — tedarikçiyi spam'den korur.",

  "supplierDetail.kv.tier": "Doğrulama seviyesi",
  "supplierDetail.kv.registry": "Sicil kaydı",
  "supplierDetail.kv.industry": "Sektör sınıflandırması",
  "supplierDetail.kv.lastUpdate": "Son profil güncellemesi",
  "supplierDetail.kv.industryField": "Sektör",
  "supplierDetail.kv.subIndustry": "Alt sektör",
  "supplierDetail.kv.type": "Tür",
  "supplierDetail.kv.moq": "Minimum sipariş tutarı",
  "supplierDetail.kv.leadTime": "Termin",
  "supplierDetail.kv.payment": "Ödeme koşulları",
  "supplierDetail.kv.incoterms": "Incoterms",
  "supplierDetail.kv.response": "Yanıt süresi",

  "supplierDetail.actions.submitRfq": "RFQ gönder — tedarikçiyle iletişim",
  "supplierDetail.actions.save": "Tedarikçiyi kaydet",
  "supplierDetail.actions.saved": "Kaydedildi",
  "supplierDetail.actions.compare": "Karşılaştırmaya ekle (en fazla 3)",
  "supplierDetail.actions.inCompare": "Karşılaştırmada",

  "supplierDetail.tier.operatorVerified": "Operatör doğrulamalı",
  "supplierDetail.tier.registryVerified": "Sicil doğrulamalı",

  "supplierDetail.confidence.operatorReviewed": "Operatör incelendi",
  "supplierDetail.confidence.registryVerified": "Sicil doğrulandı",
  "supplierDetail.confidence.domainVerified": "Alan adı doğrulandı",
  "supplierDetail.confidence.selfReported": "Beyan edilen",
  "supplierDetail.confidence.pending": "Doğrulama bekliyor",

  "supplierDetail.channel.website": "Web sitesi",
  "supplierDetail.channel.linkedin": "LinkedIn şirket sayfası",
  "supplierDetail.channel.email": "İş e-postası",
  "supplierDetail.channel.phone": "İş telefonu",
  "supplierDetail.channel.address": "Sicil adresi",
  "supplierDetail.channel.onFile": "{{count}} kayıtlı · RFQ uygunluğu sonrası paylaşılır",

  "supplierDetail.type.manufacturer": "Üretici",
  "supplierDetail.type.trader": "Trader",
  "supplierDetail.type.distributor": "Distribütör",

  "supplierDetail.tag.registryVerified": "Sicil doğrulamalı",
  "supplierDetail.tag.contactVerified": "Operatör doğrulamalı iletişim",
  "supplierDetail.tag.directManufacturer": "Doğrudan üretici",
  "supplierDetail.tag.trader": "Trader / dağıtım",
  "supplierDetail.tag.exportRecord": "İhracat geçmişi",
  "supplierDetail.tag.origin": "{{country}} menşei",

  "supplierDetail.comms.directAfterRfq": "RFQ uygunluğu sonrası doğrudan",
  "supplierDetail.comms.directAfterRfqHelp":
    "Tedarik ekibimiz RFQ'nuzu inceledikten sonra iletişim kanalı açılır.",
  "supplierDetail.comms.teamRouted": "Tedarik ekibi yönlendirmesi",
  "supplierDetail.comms.teamRoutedHelp":
    "İletişim bilgileri RFQ incelemesi sonrası paylaşılır — spam önlenir.",
  "supplierDetail.comms.pending": "Doğrulama devam ediyor",
  "supplierDetail.comms.pendingHelp":
    "İletişim paylaşılmadan önce sicil kaydı teyit edilir.",

  "supplierDetail.leadTime.weeks2": "~{{days}} gün (2 hafta içinde)",
  "supplierDetail.leadTime.month1": "~{{days}} gün (1 ay içinde)",
  "supplierDetail.leadTime.months2": "~{{days}} gün (1–2 ay)",
  "supplierDetail.leadTime.days": "~{{days}} gün",

  "supplierDetail.seo.title": "{{name}} – tedarikçi profili | SmartSeek",
  "supplierDetail.seo.typeManufacturer": " üretici",
  "supplierDetail.seo.typeGeneric": " tedarikçi",
  "supplierDetail.seo.desc":
    "{{name}}, {{location}} merkezli bir{{type}}. {{industry}} Doğrulama durumu ve RFQ rehberi SmartSeek'te.",
  "supplierDetail.seo.breadcrumbHome": "Ana sayfa",
  "supplierDetail.seo.breadcrumbSuppliers": "Tedarikçiler",

  "supplierDetail.buyerFit.mfg1": "OEM ve doğrudan fabrika tedariki",
  "supplierDetail.buyerFit.mfg2": "İzlenebilir üretim kaynağı gerektiren programlar",
  "supplierDetail.buyerFit.trader1": "Spot alım ve karma tedarik programları",
  "supplierDetail.buyerFit.trader2": "Esnek Incoterms ve menşei karışımı isteyen alıcılar",
  "supplierDetail.buyerFit.dist1": "Kısa terminli tekrarlayan yenileme",
  "supplierDetail.buyerFit.dist2": "Konteyner minimumu olmayan alıcılar",
  "supplierDetail.buyerFit.common1": "Stratejik tedarik ve kategori yönetimi ekipleri",
  "supplierDetail.buyerFit.common2": "Yapılandırılmış RFQ yürüten endüstriyel alıcılar",

  "supplierDetail.rfqRec.spec": "Kesin spesifikasyon ve tolerans (saflık, kalite, boyut, alaşım)",
  "supplierDetail.rfqRec.qty": "Miktar, ambalaj ve birim",
  "supplierDetail.rfqRec.origin": "Menşei / üretim ülkesi tercihi",
  "supplierDetail.rfqRec.incoterm": "Incoterm ve varış limanı",
  "supplierDetail.rfqRec.lead": "Termin ve teslimat penceresi",
  "supplierDetail.rfqRec.price": "Hedef fiyat referansı ve para birimi",
  "supplierDetail.rfqRec.docs": "Gerekli kalite belgeleri (MTC, COA, ISO kapsamı)",

  "supplierDetail.qual.registry": "Tüzel kişiliği şirket siciline karşı teyit edin",
  "supplierDetail.qual.references": "Hedef bölgenizde üç güncel alıcı referansı isteyin",
  "supplierDetail.qual.mtc": "Güncel mill test sertifikası veya analiz sertifikası isteyin",
  "supplierDetail.qual.iso": "ISO / sektör sertifikalarının kapsamda ve geçerli olduğunu doğrulayın",
  "supplierDetail.qual.bank": "Banka hesabının aynı tüzel kişi adına olduğunu teyit edin",
  "supplierDetail.qual.trace": "İzlenebilirlik için asıl üretici / fabrika kaynağını sorun",
  "supplierDetail.qual.inProgress": "Doğrulama devam ediyor — numune öncesi sicil özeti isteyin",

  "supplierDetail.maturity.yearsPlus": "{{years}}+ yıllık ticaret geçmişi",
  "supplierDetail.maturity.established": "{{years}} yıl önce kuruldu",
  "supplierDetail.maturity.since": "{{year}}'den beri faaliyette",
  "supplierDetail.maturity.workforceBand": "İşgücü bandı {{band}}",
  "supplierDetail.maturity.workforceCount": "Bildirilen işgücü ~{{count}}",
  "supplierDetail.maturity.registryLocated": "Sicil kaydı bulundu ve doğrulandı",
  "supplierDetail.maturity.contactConfirmed": "Operatör teyitli doğrudan iletişim",
  "supplierDetail.maturity.certs": "{{count}} yayınlanan sertifika",
  "supplierDetail.maturity.certs_plural": "{{count}} yayınlanan sertifika",
  "supplierDetail.export.confirmed": "Onaylı ihracat: {{markets}}",
  "supplierDetail.export.pending": "İhracat geçmişi RFQ uygunluk sürecinde teyit edilir",
  "supplierDetail.export.incoterms": "Yayınlanan Incoterms: {{terms}}",
  "supplierDetail.export.leadTime": "Bildirilen termin {{time}}",
  "supplierDetail.export.operating": "Faaliyet yeri: {{location}}",

  "category.card.productsUponRfq": "Ürün detayları RFQ sürecinde teyit edilir",
  "category.card.viewProfile": "Profili gör",
  "category.card.requestRfq": "RFQ talep et",
  "category.card.save": "Kaydet",
  "category.card.saved": "Kaydedildi",
  "category.card.compare": "Karşılaştır",
  "category.card.inCompare": "Karşılaştırmada",
  "category.trust.registryVerified": "Sicil doğrulamalı tedarikçiler",
  "category.trust.operatorRouting": "Operatör yönlendirmeli RFQ",
  "category.quickBrowse": "Stratejik malzemeler — hızlı gezinme",
  "category.results.curated": "Seçilmiş sonuçlar",
  "category.overlay.title": "Tam {{name}} dizini kurucu kullanıcılara açık",
  "category.overlay.body":
    "Beta erişimi kontrollüdür. Kurucu alıcılar doğrudan tedarik desteği ve yapılandırılmış RFQ yönlendirmesi alır.",
  "category.overlay.betaAccess": "Beta erişimi talep et",
  "category.overlay.rfqInstead": "Bunun yerine RFQ gönder",
  "category.empty.title": "{{name}} için herkese açık önizleme yok",
  "category.empty.body":
    "Herkese açık dizin bilinçli olarak sınırlıdır. RFQ gönderin — tedarik ekibimiz iç indeks ve doğrulanmış ağımızda arar.",
  "category.submitRfq": "RFQ gönder",
  "category.becomeSupplier": "Tedarikçi ol",
  "category.requestBeta": "Beta erişimi talep et",
  "category.procurement.sourcedTitle": "Sık tedarik edilen alanlar",
  "category.procurement.sourcedBody": "İmalat girdisi, emtia tedariki ve tedarikçi uygunluk süreci.",
  "category.procurement.rfqTitle": "Önerilen RFQ alanları",
  "category.procurement.rfqBody": "MOQ, Incoterms, hedef miktar, varış ülkesi ve teslimat takvimi.",
  "category.procurement.contactTitle": "İletişim görünürlüğü",
  "category.procurement.contactBody": "Ticari ve iletişim bilgileri RFQ uygunluk sürecinde paylaşılır.",
  "category.meta.title": "{{name}} tedarikçileri – sicil doğrulamalı | SmartSeek",
  "category.meta.description":
    "Sicil doğrulamalı {{name}} tedarikçileri — tedarik bağlamı, RFQ iş akışı ve doğrulama görünürlüğü SmartSeek'te.",

  "category.description":
    "Sicil doğrulamalı {{name}} tedarikçi ve üreticiler. Sertifikalar, doğrulama durumu ve RFQ yönlendirmesini karşılaştırın — operatör yönlendirmeli, pazar yeri hacmi değil.",
  "category.feature3.title": "Kontrollü RFQ yönlendirmesi",
  "category.feature3.desc": "RFQ gönderin — tedarik ekibimiz ilgili doğrulanmış tedarikçilere yönlendirir.",
  "category.cta.desc":
    "Satın alma ekipleri SmartSeek'i sicil doğrulamalı tedarikçi bulma ve kontrollü RFQ süreçleri için kullanır.",
  "category.cta.primary": "RFQ gönder",
  "category.freeUnlocks":
    "Kurucu kullanıcılar tam tedarikçi listesine ve doğrulanmış iletişim bilgilerine erişir.",
  "category.whySource.desc":
    "SmartSeek şirket sicilleri ve ticaret kayıtlarını çapraz referanslar — toplu kazınmış dizin değil.",

  "toolsPage.title": "Ticaret araçları ve hesaplayıcılar",
  "toolsPage.subtitle": "Landed cost, gümrük, nakliye ve ticaret analizi için satın alma hesaplayıcıları.",
  "toolsPage.openTool": "Aracı aç",
  "toolsPage.tradeData.title": "Ticaret verisi paneli",
  "toolsPage.tradeData.desc": "İthalat/ihracat trendleri, fiyat endeksleri ve ticaret akışı analizi",
  "toolsPage.tradeData.f1": "İthalat/ihracat trendleri",
  "toolsPage.tradeData.f2": "Fiyat endeksi",
  "toolsPage.tradeData.f3": "Tedarikçi kıyaslaması",
  "toolsPage.tradeData.f4": "Pazar analizi",
  "toolsPage.landedCost.title": "Landed cost hesaplayıcı",
  "toolsPage.landedCost.desc": "Navlun, sigorta, gümrük ve iç taşıma dahil tam maliyet",
  "toolsPage.customs.title": "Gümrük ücreti hesaplayıcı",
  "toolsPage.customs.desc": "Ürüne göre ithalat vergisi, KDV ve toplam landed cost",
  "toolsPage.shipping.title": "Nakliye maliyeti tahmini",
  "toolsPage.shipping.desc": "Deniz, hava ve ekspres kurye oranlarını karşılaştırın",
  "toolsPage.sourcing.title": "Tedarik raporları",
  "toolsPage.sourcing.desc": "Sicil doğrulamalı tedarikçi önerileriyle yapılandırılmış tedarik raporları",
  "toolsPage.sourcing.f1": "Tedarikçi değerlendirme",
  "toolsPage.sourcing.f2": "Tedarikçi eşleştirme",
  "toolsPage.sourcing.f3": "Maliyet dökümü",
  "toolsPage.sourcing.f4": "Risk değerlendirmesi",
  "toolsPage.badge.new": "Yeni",
  "toolsPage.badge.popular": "Popüler",
};

function patch(loc, keys) {
  const fp = path.join(root, loc, "translation.json");
  const data = JSON.parse(fs.readFileSync(fp, "utf8"));
  Object.assign(data, keys);
  fs.writeFileSync(fp, JSON.stringify(data, null, 2) + "\n");
  return Object.keys(keys).length;
}

const enN = patch("en", EN);
const trN = patch("tr", TR);
for (const loc of ["zh", "es", "ru", "ja"]) patch(loc, EN);
console.log(`Batch 2: en +${enN}, tr +${trN}, parity +${enN}`);
