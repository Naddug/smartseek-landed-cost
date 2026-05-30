#!/usr/bin/env node
/**
 * Phase E Batch 1 — notFound, suppliersIndex, FAQ body keys
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "../client/public/locales");

const EN = {
  "notFound.title": "404 — Page not found",
  "notFound.body": "This page is unavailable. Continue with a sourcing action below.",
  "notFound.home": "Back to home",
  "notFound.search": "Find suppliers",
  "notFound.rfq": "Submit RFQ",

  "suppliersIndex.badge": "Supplier directory",
  "suppliersIndex.title": "Browse suppliers by category",
  "suppliersIndex.subtitle":
    "Curated, registry-verified suppliers across strategic metals, base metals, and industrial inputs. Pick a category — or submit an RFQ and our team will source it.",
  "suppliersIndex.submitRfq": "Submit RFQ",
  "suppliersIndex.becomeSupplier": "Become a supplier",
  "suppliersIndex.trustLine": "Registry-verified · operator-led RFQ routing",
  "suppliersIndex.footerTitle": "Don't see your category?",
  "suppliersIndex.footerBody":
    "Submit an RFQ. Our sourcing team will search our internal index and verified network for the right suppliers.",
  "suppliersIndex.methodologyLink": "How sourcing works",
  "suppliersIndex.ld.home": "Home",
  "suppliersIndex.ld.suppliers": "Suppliers",
  "suppliersIndex.ld.listName": "Supplier categories on SmartSeek",
  "suppliersIndex.ld.itemSuffix": "suppliers",

  "suppliersIndex.groups.strategicMetals": "Strategic metals",
  "suppliersIndex.groups.baseMetals": "Base metals",
  "suppliersIndex.groups.industrialVerticals": "Industrial verticals",
  "suppliersIndex.groups.materialsInputs": "Materials & inputs",

  "suppliersIndex.categories.antimony.name": "Antimony",
  "suppliersIndex.categories.antimony.blurb": "Ingot, trioxide, alloys. Flame retardants, lead-acid, defence.",
  "suppliersIndex.categories.tungsten.name": "Tungsten",
  "suppliersIndex.categories.tungsten.blurb": "APT, oxide, ferrotungsten. Cutting tools, defence, lighting.",
  "suppliersIndex.categories.tin.name": "Tin",
  "suppliersIndex.categories.tin.blurb": "Refined tin, solder alloys, tinplate.",
  "suppliersIndex.categories.lithium-batteries.name": "Lithium",
  "suppliersIndex.categories.lithium-batteries.blurb": "Carbonate, hydroxide, battery-grade chemistries.",
  "suppliersIndex.categories.rare-earths.name": "Rare earths",
  "suppliersIndex.categories.rare-earths.blurb": "NdPr, Dy, Tb oxides and concentrates.",
  "suppliersIndex.categories.copper-cathode.name": "Copper",
  "suppliersIndex.categories.copper-cathode.blurb": "Cathode A-grade, rod, scrap.",
  "suppliersIndex.categories.aluminum.name": "Aluminium",
  "suppliersIndex.categories.aluminum.blurb": "Ingot, billet, sheet, extrusions.",
  "suppliersIndex.categories.steel.name": "Steel & alloys",
  "suppliersIndex.categories.steel.blurb": "HRC, CRC, rebar, plate, stainless.",
  "suppliersIndex.categories.electronics.name": "Electronics",
  "suppliersIndex.categories.electronics.blurb": "Components, PCBA, EMS partners.",
  "suppliersIndex.categories.machinery.name": "Industrial machinery",
  "suppliersIndex.categories.machinery.blurb": "Capital equipment, tooling, precision parts.",
  "suppliersIndex.categories.chemicals.name": "Chemicals & polymers",
  "suppliersIndex.categories.chemicals.blurb": "Bulk chemicals, polymers, intermediates.",
  "suppliersIndex.categories.automotive-parts.name": "Automotive parts",
  "suppliersIndex.categories.automotive-parts.blurb": "OEM and aftermarket components.",
  "suppliersIndex.categories.plastics.name": "Plastics",
  "suppliersIndex.categories.plastics.blurb": "Resins, masterbatch, compounds.",
  "suppliersIndex.categories.textiles.name": "Textiles",
  "suppliersIndex.categories.textiles.blurb": "Yarn, woven, knit, technical textiles.",
  "suppliersIndex.categories.cotton-fabric.name": "Cotton fabric",
  "suppliersIndex.categories.cotton-fabric.blurb": "Mill direct, denim, jersey, canvas.",
  "suppliersIndex.categories.food-ingredients.name": "Food ingredients",
  "suppliersIndex.categories.food-ingredients.blurb": "Bulk ingredients, agricultural commodities.",
  "suppliersIndex.categories.pharmaceutical-api.name": "Pharmaceutical API",
  "suppliersIndex.categories.pharmaceutical-api.blurb": "Active pharmaceutical ingredients, regulated.",

  "faq.sections.general.title": "General",
  "faq.sections.general.q1": "What is SmartSeek?",
  "faq.sections.general.a1":
    "SmartSeek is an industrial sourcing platform for procurement teams. Buyers discover registry-verified suppliers, submit RFQs, and compare structured quotes across industrial categories.",
  "faq.sections.general.q2": "How does supplier discovery work?",
  "faq.sections.general.a2":
    "Search by commodity, category, and region, then review curated supplier profiles. For specific demand, submit an RFQ — our sourcing team routes it to relevant verified suppliers.",
  "faq.sections.general.q3": "Is SmartSeek free?",
  "faq.sections.general.a3": "Yes. SmartSeek is free during beta. No payment flow is enabled.",

  "faq.sections.suppliers.title": "Suppliers",
  "faq.sections.suppliers.q1": "How are suppliers verified?",
  "faq.sections.suppliers.a1":
    "Every published supplier is matched to an official company registry (e.g. SAIC, Companies House, SEC EDGAR, Handelsregister, MERSIS, ASIC). See /verification for criteria and re-verification cadence.",
  "faq.sections.suppliers.q2": "How many suppliers are in the public directory?",
  "faq.sections.suppliers.a2":
    "During beta, the public directory is intentionally curated — not scraped at scale. It spans industrial materials, manufacturing, chemicals, packaging, and machinery. If a supplier isn't listed, submit an RFQ and our team searches the internal index and verified network.",
  "faq.sections.suppliers.q3": "What countries are covered?",
  "faq.sections.suppliers.a3":
    "Major industrial sourcing regions including China, India, Vietnam, Turkey, Indonesia, Thailand, South Korea, Japan, Poland, Germany, the UK, the US, Mexico, Brazil, Australia, and Canada. We do not publish unverified bulk records.",

  "faq.sections.landedCost.title": "Landed cost",
  "faq.sections.landedCost.q1": "How accurate is the landed cost calculator?",
  "faq.sections.landedCost.a1":
    "The calculator uses duty rates, freight benchmarks, and insurance formulas. Accuracy depends on your inputs — verify critical figures with customs brokers or freight forwarders for high-value shipments.",
  "faq.sections.landedCost.q2": "What incoterms are supported?",
  "faq.sections.landedCost.a2":
    "Common incoterms including EXW, FOB, CIF, and DDP. The calculator adjusts freight, insurance, and customs handling based on the selected incoterm.",
  "faq.sections.landedCost.q3": "What shipping methods?",
  "faq.sections.landedCost.a3":
    "Sea freight (FCL and LCL), air freight, and express shipping. Specify container sizes (20ft, 40ft) for sea freight estimates.",

  "faq.sections.rfq.title": "RFQ",
  "faq.sections.rfq.q1": "How does the RFQ process work?",
  "faq.sections.rfq.a1":
    "Submit an RFQ with product details, quantity, and requirements. Our team routes it to relevant verified suppliers. Quotes return with MOQ, lead time, and Incoterms where applicable.",
  "faq.sections.rfq.q2": "How quickly will I get quotes?",
  "faq.sections.rfq.a2": "Most RFQs receive first responses within 1–3 business days, depending on product complexity and supplier availability.",
  "faq.sections.rfq.q3": "Is my information shared?",
  "faq.sections.rfq.a3":
    "Contact and RFQ details are shared only with suppliers we route your request to. We do not sell your data. See our Privacy Policy for details.",

  "faq.sections.account.title": "Account",
  "faq.sections.account.q1": "How do I create an account?",
  "faq.sections.account.a1": "Click Sign Up, enter your work email and password, then verify your email to activate your account.",
  "faq.sections.account.q2": "Can I cancel anytime?",
  "faq.sections.account.a2": "There is no billing during beta. If paid plans are introduced, cancellation terms will be published in advance.",
  "faq.sections.account.q3": "What payment methods?",
  "faq.sections.account.a3": "Payments are not enabled during beta.",

  "faq.sections.trust.title": "Trust & security",
  "faq.sections.trust.q1": "Is my data secure?",
  "faq.sections.trust.a1":
    "Buyer and supplier data is treated as confidential. Communications use TLS, data is encrypted at rest, and RFQs are only shared with routed suppliers. SOC 2 attestation work is in progress.",
  "faq.sections.trust.q2": "Who can use SmartSeek?",
  "faq.sections.trust.a2":
    "Industrial procurement teams, traders, manufacturers, and verified suppliers. Built for cross-border sourcing operations — from single-category RFQs to multi-region supply programs.",

  // Dormant TR keys still referenced on legacy surfaces
  "trust.worldwide": "Operator-led industrial sourcing",
  "trust.strip1": "Registry-backed supplier verification",
  "trust.strip3": "Structured RFQ workflows",
  "trust.strip4": "Registry provenance on every profile",
  "trustBadge.registry": "Registry-backed verification",
  "trustBadge.operator": "Operator-reviewed sourcing",
  "trustBadge.operator.sub": "Sourcing team routing",
  "trustBadge.noBlast.sub": "Curated supplier release",
  "publicSearch.subtitle": "Featured suppliers — request beta access for the full directory",
  "publicSearch.signupCta": "Request beta access to the supplier directory",
  "home.trustBlock.cta": "Request beta access — founding member pricing when paid plans launch",
};

const TR = {
  "notFound.title": "404 — Sayfa bulunamadı",
  "notFound.body": "Bu sayfa mevcut değil. Aşağıdaki tedarik işlemlerinden devam edin.",
  "notFound.home": "Ana sayfaya dön",
  "notFound.search": "Tedarikçi bul",
  "notFound.rfq": "RFQ gönder",

  "suppliersIndex.badge": "Tedarikçi dizini",
  "suppliersIndex.title": "Kategoriye göre tedarikçi ara",
  "suppliersIndex.subtitle":
    "Stratejik metaller, baz metaller ve endüstriyel girdilerde sicil doğrulamalı seçilmiş tedarikçiler. Kategori seçin — veya RFQ gönderin, ekibimiz kaynak bulsun.",
  "suppliersIndex.submitRfq": "RFQ gönder",
  "suppliersIndex.becomeSupplier": "Tedarikçi ol",
  "suppliersIndex.trustLine": "Sicil doğrulamalı · kontrollü RFQ yönlendirmesi",
  "suppliersIndex.footerTitle": "Kategorinizi göremiyor musunuz?",
  "suppliersIndex.footerBody":
    "RFQ gönderin. Tedarik ekibimiz iç indeks ve doğrulanmış ağımızda arama yapar.",
  "suppliersIndex.methodologyLink": "Tedarik nasıl çalışır",
  "suppliersIndex.ld.home": "Ana sayfa",
  "suppliersIndex.ld.suppliers": "Tedarikçiler",
  "suppliersIndex.ld.listName": "SmartSeek tedarikçi kategorileri",
  "suppliersIndex.ld.itemSuffix": "tedarikçiler",

  "suppliersIndex.groups.strategicMetals": "Stratejik metaller",
  "suppliersIndex.groups.baseMetals": "Baz metaller",
  "suppliersIndex.groups.industrialVerticals": "Endüstriyel sektörler",
  "suppliersIndex.groups.materialsInputs": "Malzeme ve girdiler",

  "suppliersIndex.categories.antimony.name": "Antimon",
  "suppliersIndex.categories.antimony.blurb": "Külçe, trioksit, alaşımlar. Alev geciktirici, kurşun-asit, savunma.",
  "suppliersIndex.categories.tungsten.name": "Tungsten",
  "suppliersIndex.categories.tungsten.blurb": "APT, oksit, ferrotungsten. Kesici takım, savunma, aydınlatma.",
  "suppliersIndex.categories.tin.name": "Kalay",
  "suppliersIndex.categories.tin.blurb": "Rafine kalay, lehim alaşımları, teneke.",
  "suppliersIndex.categories.lithium-batteries.name": "Lityum",
  "suppliersIndex.categories.lithium-batteries.blurb": "Karbonat, hidroksit, batarya kalitesi kimyasallar.",
  "suppliersIndex.categories.rare-earths.name": "Nadir toprak elementleri",
  "suppliersIndex.categories.rare-earths.blurb": "NdPr, Dy, Tb oksitleri ve konsantreler.",
  "suppliersIndex.categories.copper-cathode.name": "Bakır",
  "suppliersIndex.categories.copper-cathode.blurb": "A kalite katot, çubuk, hurda.",
  "suppliersIndex.categories.aluminum.name": "Alüminyum",
  "suppliersIndex.categories.aluminum.blurb": "Külçe, billett, sac, ekstrüzyon.",
  "suppliersIndex.categories.steel.name": "Çelik ve alaşımlar",
  "suppliersIndex.categories.steel.blurb": "HRC, CRC, nervürlü, plaka, paslanmaz.",
  "suppliersIndex.categories.electronics.name": "Elektronik",
  "suppliersIndex.categories.electronics.blurb": "Komponent, PCBA, EMS ortakları.",
  "suppliersIndex.categories.machinery.name": "Endüstriyel makine",
  "suppliersIndex.categories.machinery.blurb": "Sermaye ekipmanı, takım tezgahı, hassas parça.",
  "suppliersIndex.categories.chemicals.name": "Kimyasal ve polimer",
  "suppliersIndex.categories.chemicals.blurb": "Dökme kimyasal, polimer, ara ürün.",
  "suppliersIndex.categories.automotive-parts.name": "Otomotiv parçaları",
  "suppliersIndex.categories.automotive-parts.blurb": "OEM ve yedek parça.",
  "suppliersIndex.categories.plastics.name": "Plastik",
  "suppliersIndex.categories.plastics.blurb": "Reçine, masterbatch, compound.",
  "suppliersIndex.categories.textiles.name": "Tekstil",
  "suppliersIndex.categories.textiles.blurb": "İplik, dokuma, örme, teknik tekstil.",
  "suppliersIndex.categories.cotton-fabric.name": "Pamuklu kumaş",
  "suppliersIndex.categories.cotton-fabric.blurb": "Doğrudan fabrika, denim, süprem, canvas.",
  "suppliersIndex.categories.food-ingredients.name": "Gıda hammaddeleri",
  "suppliersIndex.categories.food-ingredients.blurb": "Dökme gıda maddeleri, tarım emtiaları.",
  "suppliersIndex.categories.pharmaceutical-api.name": "Farmasötik API",
  "suppliersIndex.categories.pharmaceutical-api.blurb": "Etken madde, düzenlemeye tabi.",

  "faq.sections.general.title": "Genel",
  "faq.sections.general.q1": "SmartSeek nedir?",
  "faq.sections.general.a1":
    "SmartSeek, satın alma ekipleri için endüstriyel tedarik platformudur. Sicil doğrulamalı tedarikçi bulma, RFQ gönderme ve yapılandırılmış teklif karşılaştırma.",
  "faq.sections.general.q2": "Tedarikçi arama nasıl çalışır?",
  "faq.sections.general.a2":
    "Emtia, kategori ve bölgeye göre arayın, seçilmiş profilleri inceleyin. Spesifik talep için RFQ gönderin — tedarik ekibimiz ilgili doğrulanmış tedarikçilere yönlendirir.",
  "faq.sections.general.q3": "SmartSeek ücretsiz mi?",
  "faq.sections.general.a3": "Evet. Beta süresince ücretsizdir. Ödeme akışı etkin değildir.",

  "faq.sections.suppliers.title": "Tedarikçiler",
  "faq.sections.suppliers.q1": "Tedarikçiler nasıl doğrulanır?",
  "faq.sections.suppliers.a1":
    "Yayınlanan her tedarikçi resmi şirket siciline bağlanır (SAIC, Companies House, SEC EDGAR, Handelsregister, MERSIS, ASIC vb.). Ayrıntılar için /verification.",
  "faq.sections.suppliers.q2": "Herkese açık dizinde kaç tedarikçi var?",
  "faq.sections.suppliers.a2":
    "Beta'da herkese açık dizin bilinçli olarak sınırlıdır — toplu kazıma değil. Endüstriyel malzeme, imalat, kimyasal, ambalaj ve makine kapsanır. Listede yoksa RFQ gönderin; tedarik ekibimiz iç indeks ve doğrulanmış ağımızda arar.",
  "faq.sections.suppliers.q3": "Hangi ülkeler kapsanıyor?",
  "faq.sections.suppliers.a3":
    "Çin, Hindistan, Vietnam, Türkiye, Endonezya, Tayland, Güney Kore, Japonya, Polonya, Almanya, İngiltere, ABD, Meksika, Brezilya, Avustralya ve Kanada dahil ana endüstriyel bölgeler. Doğrulanmamış toplu kayıt yayınlamayız.",

  "faq.sections.landedCost.title": "Landed cost",
  "faq.sections.landedCost.q1": "Landed cost hesaplayıcı ne kadar doğru?",
  "faq.sections.landedCost.a1":
    "Gümrük oranları, navlun referansları ve sigorta formüllerini kullanır. Doğruluk girdilerinize bağlıdır — yüksek değerli sevkiyatlarda gümrük müşaviri veya forwarder ile teyit edin.",
  "faq.sections.landedCost.q2": "Hangi Incoterms destekleniyor?",
  "faq.sections.landedCost.a2":
    "EXW, FOB, CIF ve DDP dahil yaygın Incoterms. Seçilen Incoterm'e göre navlun, sigorta ve gümrük işleme ayarlanır.",
  "faq.sections.landedCost.q3": "Hangi taşıma yöntemleri?",
  "faq.sections.landedCost.a3":
    "Deniz (FCL/LCL), hava ve ekspres. Deniz navlunu için konteyner boyutu (20ft, 40ft) belirtilebilir.",

  "faq.sections.rfq.title": "RFQ",
  "faq.sections.rfq.q1": "RFQ süreci nasıl işler?",
  "faq.sections.rfq.a1":
    "Ürün detayı, miktar ve gereksinimlerle RFQ gönderin. Ekibimiz ilgili doğrulanmış tedarikçilere yönlendirir. Teklifler MOQ, termin ve Incoterms ile döner.",
  "faq.sections.rfq.q2": "Teklifler ne kadar sürede gelir?",
  "faq.sections.rfq.a2": "Çoğu RFQ 1–3 iş günü içinde ilk yanıt alır. Süre ürün karmaşıklığına ve tedarikçi uygunluğuna bağlıdır.",
  "faq.sections.rfq.q3": "Bilgilerim paylaşılır mı?",
  "faq.sections.rfq.a3":
    "İletişim ve RFQ bilgileri yalnızca yönlendirilen tedarikçilerle paylaşılır. Verileriniz satılmaz. Ayrıntılar için Gizlilik Politikası.",

  "faq.sections.account.title": "Hesap",
  "faq.sections.account.q1": "Hesap nasıl oluşturulur?",
  "faq.sections.account.a1": "Kayıt Ol'a tıklayın, iş e-postanız ve şifrenizi girin, ardından e-postayı doğrulayın.",
  "faq.sections.account.q2": "İstediğim zaman iptal edebilir miyim?",
  "faq.sections.account.a2": "Beta'da faturalandırma yoktur. Ücretli planlar gelirse iptal koşulları önceden duyurulur.",
  "faq.sections.account.q3": "Ödeme yöntemleri?",
  "faq.sections.account.a3": "Beta süresince ödeme etkin değildir.",

  "faq.sections.trust.title": "Güven ve güvenlik",
  "faq.sections.trust.q1": "Verilerim güvende mi?",
  "faq.sections.trust.a1":
    "Alıcı ve tedarikçi verileri gizli tutulur. İletişim TLS ile şifrelenir, veriler dinlenme halinde şifrelenir. RFQ'lar yalnızca yönlendirilen tedarikçilerle paylaşılır. SOC 2 çalışması devam ediyor.",
  "faq.sections.trust.q2": "SmartSeek'i kimler kullanabilir?",
  "faq.sections.trust.a2":
    "Endüstriyel satın alma ekipleri, trader'lar, üreticiler ve doğrulanmış tedarikçiler. Tek kategorili RFQ'dan çok bölgeli tedarik programlarına — sınır ötesi tedarik operasyonları için.",

  "trust.worldwide": "Operatör yönlendirmeli endüstriyel tedarik",
  "trust.strip1": "Sicil destekli tedarikçi doğrulaması",
  "trust.strip3": "Kontrollü RFQ süreçleri",
  "trust.strip4": "Her profilde sicil kaynağı",
  "trustBadge.registry": "Sicil destekli doğrulama",
  "trustBadge.operator": "Ekip tarafından incelenen tedarik",
  "trustBadge.operator.sub": "Tedarik ekibi yönlendirmesi",
  "trustBadge.noBlast.sub": "Seçilmiş tedarikçi paylaşımı",
  "publicSearch.subtitle": "Seçilmiş tedarikçiler — tam dizin için beta erişimi talep edin",
  "publicSearch.signupCta": "Tedarikçi dizini için beta erişimi talep et",
  "home.trustBlock.cta": "Beta erişimi talep et — ücretli planlarda kurucu fiyatlandırma",
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
console.log(`Batch 1: en +${enN}, tr +${trN}, parity locales +${enN}`);
