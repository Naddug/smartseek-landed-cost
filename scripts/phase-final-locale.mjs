#!/usr/bin/env node
/** Phase Final — terminology freeze, unlock removal, TR hardening, workstation copy */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "../client/public/locales");

const EN = {
  "hero.badge": "Registry cross-checked · Sourcing-team review · Registry-verified",
  "hero.subtitle": "Registry-verified supplier discovery and structured RFQ workflows. Sourcing-team review — not marketplace volume.",
  "trust.worldwide": "Procurement-team industrial sourcing",

  "home.step2.title": "SmartSeek sourcing team review",
  "home.step2.desc": "The SmartSeek sourcing team screens your request, validates registry provenance, and routes RFQs to verified suppliers only.",
  "home.hiw.step3.desc": "Submit structured RFQs reviewed by the SmartSeek sourcing team. Quotes return with MOQ, lead time, and Incoterms.",
  "home.trustBlock.body": "SmartSeek connects you to registry-backed supplier records and the full landed cost picture — not just unit prices. Built for cross-border procurement teams, not a marketplace listing team.",
  "home.how.step2Desc": "The SmartSeek sourcing team screens your RFQ and routes it only to suppliers verified against public company registries.",
  "home.why.body": "Every supplier we publish is checked against a company registry — SAIC, Companies House, SEC EDGAR, Handelsregister, MERSIS, ASIC, KRS, DART, SEDAR — and confirmed via direct contact. RFQs are routed by the SmartSeek sourcing team, not by an algorithm.",
  "home.why.pill2": "SmartSeek sourcing team routing",
  "home.trustStrip.operatorRouting": "Sourcing-team routing",
  "home.seo.description": "Procurement sourcing platform with registry-verified suppliers, structured RFQs, and strong metals expertise.",
  "home.sections.previewBody": "A sample of registry-verified suppliers across metals, manufacturing, chemicals, packaging, and machinery. Curated directory access for founding users during beta.",
  "home.preview.verified": "Registry example",
  "home.preview.registryExample": "Registry example",
  "home.preview.disclaimer": "Illustrative registry examples shown for sourcing categories. Not SmartSeek customers or endorsements.",
  "home.preview.lockTitle": "Curated directory for founding users",
  "home.preview.lockBody": "Beta sourcing access with procurement-team onboarding. Request access to browse verified suppliers.",
  "home.demo.desc": "Search registry-verified suppliers across industrial categories. Preview results are curated; beta accounts include curated directory access.",
  "home.demo.freeUnlocks": "Beta accounts include curated supplier directory access and verified contact details where available.",
  "home.demo.clickQuick": "Or try a quick search to preview curated results",

  "nav.app.smartFinder": "Sourcing research",
  "nav.app.aiAgent": "Sourcing workflow",
  "nav.app.findLeads": "Lead outreach",

  "dashboard.newAISearch": "New sourcing search",
  "dashboard.runAISearch": "Run a sourcing search",
  "dashboard.runAISearchDesc": "Describe your product and get structured supplier research from registry data.",
  "dashboard.aiSourcing": "Sourcing research",
  "dashboard.findSuppliersWithAI": "Structured supplier research",
  "dashboard.aiAgent": "Sourcing workflow",
  "dashboard.chatWithAI": "Team-assisted sourcing steps",
  "dashboard.findLeads": "Lead outreach",
  "dashboard.subtitle": "Sourcing-team routing for procurement teams.",

  "category.searchFullDatabase": "Browse verified suppliers",
  "category.signupToSearch": "Sign up for curated sourcing access",
  "category.freeUnlocks": "Founding users receive curated supplier directory access and verified contact details where available.",
  "category.description": "Registry-verified {{name}} suppliers and manufacturers. Compare certifications, verification status, and RFQ routing — sourcing-team review, not marketplace volume.",
  "category.cta.footer": "No credit card · Beta sourcing access · Sourcing-team onboarding",
  "category.overlay.title": "Curated {{name}} directory for founding users",
  "category.overlay.body": "Beta sourcing access is controlled. Founding buyers receive verified supplier review and structured RFQ routing.",
  "category.overlay.betaAccess": "Request beta sourcing access",
  "category.trust.operatorRouting": "Sourcing-team RFQ routing",

  "publicSearch.hero.subtitle": "Search registry-verified suppliers across industrial materials, manufacturing, chemicals, packaging, and machinery. Curated directory access for founding users during beta.",
  "publicSearch.empty.body": "Our public directory is intentionally curated. If you cannot find a supplier here, submit an RFQ and the SmartSeek sourcing team will search our internal index and verified network.",
  "publicSearch.type.manufacturer": "Manufacturer",
  "publicSearch.type.trader": "Trader",
  "publicSearch.type.distributor": "Distributor",
  "publicSearch.type.short.manufacturer": "Mfr",
  "publicSearch.type.short.trader": "Trader",
  "publicSearch.type.short.distributor": "Dist",

  "publicFooter.operatorRfqTitle": "Sourcing-team RFQs",
  "publicFooter.operatorRfqDesc": "The SmartSeek sourcing team routes your RFQ — no automated email blasts, no marketplace spam.",

  "rfq.header.subtitle": "The SmartSeek sourcing team will route your RFQ to registry-verified suppliers and return structured quotes.",
  "rfq.header.pointOperator": "Sourcing-team routing",
  "rfq.form.howItWorksBody": "Submit your product requirements below. The SmartSeek sourcing team will share your RFQ with relevant verified suppliers. You'll receive competitive quotes via email within 1–3 business days—no account required. Your data is never shared with third parties.",
  "rfq.form.legalSuffix": "RFQs are reviewed by the SmartSeek sourcing team before routing.",
  "rfq.success.body": "The SmartSeek sourcing team will route your request to relevant verified suppliers. Quotes are returned to {{email}} typically within 1–3 business days.",

  "trustPage.rfqBody": "Every RFQ submitted on SmartSeek is reviewed by the SmartSeek sourcing team before it leaves the platform. We screen for completeness, regulatory red flags, and supplier match — and only then route the request to suppliers we have verified for that commodity. We do not auto-blast RFQs.",

  "verificationPage.tier3.summary": "Manual due-diligence by the SmartSeek sourcing team.",
  "verificationPage.tier3.name": "Team Verified",

  "methodologyPage.subtitle": "SmartSeek uses sourcing-team review. Every RFQ is reviewed by the SmartSeek sourcing team before it reaches a supplier.",
  "methodologyPage.step1.body": "When a buyer submits an RFQ, the SmartSeek sourcing team reviews it for completeness — commodity specification, quantity, destination, lead time, regulatory constraints — within one business day. Incomplete RFQs are returned with specific clarification questions.",

  "becomeSupplier.success.body1": "Thank you. The SmartSeek sourcing team will review your application and verify your registry details. We typically respond within 1–3 business days at",

  "about.subtitle": "Built by operators who experienced fragmented supplier trust firsthand. SmartSeek is a procurement sourcing platform for industrial buyers—registry verification, structured RFQs, and sourcing-team routing where marketplaces default to volume.",
  "about.mission2": "We built SmartSeek after seeing the same failure modes repeat in cross-border trade: scraped profiles presented as verified, RFQs blasted to unqualified contacts, and registry records treated as proof of supply capability. Our response is registry-first verification, specification-driven intake, and routing by the SmartSeek sourcing team—not algorithmic marketplace matching.",
  "about.antiMarketplace": "We do not scrape directories at scale, auto-blast RFQs, or publish suppliers we cannot locate in a public registry. The SmartSeek sourcing team reviews each request before routing it. That is slower than a marketplace—and more useful to a procurement team.",
  "about.values.rfqDesc": "RFQs are screened and routed by the SmartSeek sourcing team. No mass outreach. No proxy theatre.",

  "pricing.feature3": "SmartSeek sourcing team screens and routes every RFQ",
  "pricing.feature5": "Direct SmartSeek sourcing team support via email",
  "pricing.trust2": "Sourcing-team RFQ routing",
  "pricing.cardTitle": "Curated access · free during beta",

  "rfqStatus.subtitle": "Enter your RFQ ID and the email you used to submit. We will show the latest status from your SmartSeek sourcing team.",

  "sampleReport.step2Title": "SmartSeek sourcing team review",
  "sampleReport.step2Desc": "The SmartSeek sourcing team checks completeness, validates registry context where applicable, and routes only to suppliers verified for the commodity—no auto-blast outreach.",

  "suppliersIndex.trustLine": "Registry-verified · sourcing-team RFQ routing",

  "supplier.hero.subtitleWithCountries": "Registry-verified suppliers in {{countries}} countries — reviewed by the SmartSeek sourcing team.",
  "supplier.hero.subtitleWorldwide": "Registry-verified suppliers worldwide — reviewed by the SmartSeek sourcing team.",

  "workspace.trustWorkflow": "Sourcing-team workflow",

  "agentPage.statusReady": "Ready — sourcing-team trade & sourcing analysis",

  "terms.disclaimerBody": "SmartSeek is a procurement sourcing platform, not a marketplace. Reports and recommendations are informational and do not constitute legal, financial, or procurement advice. You remain responsible for due diligence and contract decisions.",

  "smartFinder.contactModal.title": "Request quote from {{supplierName}}",
  "smartFinder.contactModal.description": "Your inquiry will be routed through SmartSeek's sourcing-request workflow.",
  "smartFinder.contactModal.sentMessage": "Your inquiry has been sent. The supplier typically responds within 1–3 business days.",
  "smartFinder.contactModal.namePlaceholder": "Your name *",
  "smartFinder.contactModal.emailPlaceholder": "Your email *",
  "smartFinder.contactModal.companyPlaceholder": "Company name",
  "smartFinder.contactModal.messagePlaceholder": "Your message / product requirements *",
  "smartFinder.contactModal.errorMessage": "Failed to send. Please try again.",
  "smartFinder.contactModal.sendingButton": "Sending…",
  "smartFinder.contactModal.sendButton": "Send inquiry",

  "supplierDetail.tier.operatorVerified": "Team verified",
  "supplierDetail.tier.registryVerified": "Registry verified",
  "supplierDetail.tier.verificationPending": "Verification pending",

  "toolsPage.stats.countries": "Countries covered",
  "toolsPage.stats.countriesValue": "200+",
  "toolsPage.stats.hsCodes": "HS code library",
  "toolsPage.stats.hsCodesValue": "Broad coverage",
  "toolsPage.stats.routes": "Shipping routes",
  "toolsPage.stats.routesValue": "50+",
  "toolsPage.stats.rates": "Reference rates",
  "toolsPage.stats.ratesValue": "Updated regularly",

  "reports.pdf.title": "SmartSeek Sourcing Report",
  "reports.pdf.generated": "Generated",
  "reports.pdf.tradeRoute": "Trade route",
  "reports.pdf.executiveSummary": "EXECUTIVE SUMMARY",
  "reports.pdf.productClassification": "PRODUCT CLASSIFICATION",
  "reports.pdf.customsDuties": "CUSTOMS DUTIES & FEES",
  "reports.pdf.landedCost": "LANDED COST BREAKDOWN",
  "reports.pdf.profitAnalysis": "PROFIT ANALYSIS",
  "reports.pdf.supplierComparison": "SUPPLIER COMPARISON",
  "reports.pdf.riskAssessment": "RISK ASSESSMENT",
  "reports.pdf.recommendations": "RECOMMENDATIONS",
  "reports.pdf.nextSteps": "NEXT STEPS",
  "reports.pdf.verification": "Verification",
  "reports.pdf.leadTime": "Lead time",
  "reports.pdf.footer": "Generated by SmartSeek — Structured Sourcing Report",
  "reports.pdf.page": "Page {{current}} of {{total}}",

  "rfq.form.units.kg": "kg",
  "rfq.form.units.tonsMt": "tons (MT)",
  "rfq.form.units.lbs": "lbs",
  "rfq.form.units.pcs": "pcs",
  "rfq.form.units.sets": "sets",
  "rfq.form.units.boxes": "boxes",
  "rfq.form.units.container20ft": "containers (20ft)",
  "rfq.form.units.container40ft": "containers (40ft)",
  "rfq.form.units.litres": "litres",
  "rfq.form.units.cubicM": "m³",
  "rfq.form.units.meters": "meters",

  "rfq.form.incoterms.EXW": "EXW — Ex Works",
  "rfq.form.incoterms.FCA": "FCA — Free Carrier",
  "rfq.form.incoterms.FOB": "FOB — Free on Board",
  "rfq.form.incoterms.CFR": "CFR — Cost and Freight",
  "rfq.form.incoterms.CIF": "CIF — Cost, Insurance & Freight",
  "rfq.form.incoterms.CPT": "CPT — Carriage Paid To",
  "rfq.form.incoterms.CIP": "CIP — Carriage and Insurance Paid",
  "rfq.form.incoterms.DAP": "DAP — Delivered at Place",
  "rfq.form.incoterms.DDP": "DDP — Delivered Duty Paid",

  "becomeSupplier.industries.mining": "Mining & strategic metals",
  "becomeSupplier.industries.steel": "Steel & alloys",
  "becomeSupplier.industries.nonFerrous": "Non-ferrous metals",
  "becomeSupplier.industries.rareEarths": "Rare earths & critical minerals",
  "becomeSupplier.industries.chemicals": "Chemicals & polymers",
  "becomeSupplier.industries.machinery": "Industrial machinery",
  "becomeSupplier.industries.electronics": "Electronics & components",
  "becomeSupplier.industries.textiles": "Textiles & apparel",
  "becomeSupplier.industries.food": "Food & agriculture",
  "becomeSupplier.industries.other": "Other",

  "becomeSupplier.registry.saic": "SAIC (China)",
  "becomeSupplier.registry.companiesHouse": "Companies House (UK)",
  "becomeSupplier.registry.secEdgar": "SEC EDGAR (USA)",
  "becomeSupplier.registry.handelsregister": "Handelsregister (Germany)",
  "becomeSupplier.registry.mersis": "MERSIS (Turkey)",
  "becomeSupplier.registry.asic": "ASIC (Australia)",
  "becomeSupplier.registry.krs": "KRS (Poland)",
  "becomeSupplier.registry.dart": "DART (Korea)",
  "becomeSupplier.registry.sedar": "SEDAR (Canada)",
  "becomeSupplier.registry.other": "Other / national registry",

  "becomeSupplier.employees.b1_10": "1–10",
  "becomeSupplier.employees.b10_50": "10–50",
  "becomeSupplier.employees.b50_200": "50–200",
  "becomeSupplier.employees.b200_500": "200–500",
  "becomeSupplier.employees.b500_1000": "500–1000",
  "becomeSupplier.employees.b1000_5000": "1000–5000",
  "becomeSupplier.employees.b5000plus": "5000+",

  "pricing.roleSourcing": "Sourcing / procurement",
  "pricing.roleEngineering": "Engineering",
  "pricing.roleFinance": "Finance",
  "pricing.roleExecutive": "Executive",
  "pricing.roleOther": "Other",
  "pricing.roleSupplyChain": "Supply chain",
  "pricing.roleFounderOps": "Founder / ops",
  "pricing.roleTrader": "Trader / distributor",
};

const TR = {
  "hero.badge": "Sicil çapraz kontrol · Tedarik ekibi incelemesi · Sicil doğrulamalı",
  "hero.title1": "Endüstriyel tedarik istihbaratı",
  "hero.title2": "satın alma ekipleri için",
  "hero.subtitle": "Sicil doğrulamalı tedarikçi keşfi ve yapılandırılmış RFQ süreçleri. Tedarik ekibi incelemesi — pazar yeri hacmi değil.",
  "trust.worldwide": "Satın alma odaklı endüstriyel tedarik",

  "home.step2.title": "SmartSeek tedarik ekibi incelemesi",
  "home.step2.desc": "SmartSeek tedarik ekibi talebinizi inceler, sicil kaynağını doğrular ve RFQ'ları yalnızca doğrulanmış tedarikçilere yönlendirir.",
  "home.hiw.step3.desc": "SmartSeek tedarik ekibi tarafından incelenen yapılandırılmış RFQ gönderin. Teklifler MOQ, termin ve Incoterms ile döner.",
  "home.trustBlock.body": "SmartSeek sizi sicil destekli tedarikçi kayıtlarına ve tam yerleşik maliyet görünümüne bağlar — yalnızca birim fiyatlara değil. Sınır ötesi satın alma ekipleri için tasarlandı, pazar yeri listeleme ekibi değil.",
  "home.how.step2Desc": "SmartSeek tedarik ekibi RFQ'nuzu inceler ve yalnızca resmi şirket sicillerinde doğrulanmış tedarikçilere yönlendirir.",
  "home.why.body": "Yayınladığımız her tedarikçi bir şirket siciline karşı kontrol edilir — SAIC, Companies House, SEC EDGAR, Handelsregister, MERSIS, ASIC, KRS, DART, SEDAR — ve doğrudan iletişimle teyit edilir. RFQ'lar algoritma ile değil, SmartSeek tedarik ekibi tarafından yönlendirilir.",
  "home.why.pill2": "SmartSeek tedarik ekibi yönlendirmesi",
  "home.trustStrip.operatorRouting": "Tedarik ekibi yönlendirmesi",
  "home.seo.description": "Sicil doğrulamalı tedarikçiler, yapılandırılmış RFQ'lar ve güçlü metal uzmanlığı sunan satın alma tedarik platformu.",
  "home.sections.previewBody": "Metaller, imalat, kimyasallar, ambalaj ve makinede sicil doğrulamalı tedarikçilerden örnekler. Beta sürecinde kurucu kullanıcılar için küratörlü dizin erişimi.",
  "home.preview.verified": "Sicil örneği",
  "home.preview.registryExample": "Sicil örneği",
  "home.preview.disclaimer": "Tedarik kategorileri için gösterilen sicil örnekleridir. SmartSeek müşterisi veya onayı değildir.",
  "home.preview.lockTitle": "Kurucu kullanıcılar için küratörlü dizin",
  "home.preview.lockBody": "Satın alma ekibi onboarding ile beta tedarik erişimi. Doğrulanmış tedarikçilere göz atmak için erişim talep edin.",
  "home.demo.desc": "Endüstriyel kategorilerde sicil doğrulamalı tedarikçi arayın. Önizleme sonuçları küratörlüdür; beta hesapları küratörlü dizin erişimi içerir.",
  "home.demo.freeUnlocks": "Beta hesapları küratörlü tedarikçi dizini erişimi ve mevcut olduğunda doğrulanmış iletişim bilgilerini içerir.",
  "home.demo.clickQuick": "Veya küratörlü sonuçları önizlemek için hızlı bir arama deneyin",
  "home.demo.liveResults": "Önizleme sonuçları",
  "home.demo.suppliersFound": "{{count}} eşleşme — 3 önizleme sonucu gösteriliyor",
  "home.demo.enterProduct": "Yukarıda bir ürün, malzeme veya sektör girin",
  "home.demo.quick1": "Antimon tedarikçileri Çin",
  "home.demo.quick2": "Pamuk kumaşı Türkiye",
  "home.demo.quick3": "Güneş panelleri Vietnam",
  "home.demo.quick4": "İlaç API'si Hindistan",

  "nav.app.smartFinder": "Tedarik araştırması",
  "nav.app.aiAgent": "Tedarik iş akışı",
  "nav.app.findLeads": "Müşteri adayı",

  "dashboard.newAISearch": "Yeni tedarik araması",
  "dashboard.runAISearch": "Tedarik araması çalıştır",
  "dashboard.runAISearchDesc": "Ürününüzü tanımlayın; sicil verisinden yapılandırılmış tedarikçi araştırması alın.",
  "dashboard.aiSourcing": "Tedarik araştırması",
  "dashboard.findSuppliersWithAI": "Yapılandırılmış tedarikçi araştırması",
  "dashboard.aiAgent": "Tedarik iş akışı",
  "dashboard.chatWithAI": "Ekip destekli tedarik adımları",
  "dashboard.findLeads": "Müşteri adayı",
  "dashboard.subtitle": "Satın alma ekipleri için tedarik ekibi yönlendirmesi.",

  "category.searchFullDatabase": "Doğrulanmış tedarikçilere göz at",
  "category.signupToSearch": "Küratörlü tedarik erişimi için kaydol",
  "category.freeUnlocks": "Kurucu kullanıcılar küratörlü tedarikçi dizini erişimi ve mevcut olduğunda doğrulanmış iletişim bilgilerini alır.",
  "category.description": "Sicil doğrulamalı {{name}} tedarikçileri ve üreticileri. Sertifikalar, doğrulama durumu ve RFQ yönlendirmesini karşılaştırın — tedarik ekibi incelemesi, pazar yeri hacmi değil.",
  "category.cta.footer": "Kredi kartı yok · Beta tedarik erişimi · Tedarik ekibi onboarding",
  "category.overlay.title": "Kurucu kullanıcılar için küratörlü {{name}} dizini",
  "category.overlay.body": "Beta tedarik erişimi kontrollüdür. Kurucu alıcılar doğrulanmış tedarikçi incelemesi ve yapılandırılmış RFQ yönlendirmesi alır.",
  "category.overlay.betaAccess": "Beta tedarik erişimi talep et",
  "category.trust.operatorRouting": "Tedarik ekibi RFQ yönlendirmesi",

  "publicSearch.hero.subtitle": "Endüstriyel malzeme, imalat, kimyasal, ambalaj ve makinede sicil doğrulamalı tedarikçi arayın. Beta sürecinde kurucu kullanıcılar için küratörlü dizin erişimi.",
  "publicSearch.empty.body": "Herkese açık liste bilinçli olarak sınırlıdır. Aradığınız tedarikçi yoksa RFQ gönderin; SmartSeek tedarik ekibi iç indeks ve doğrulanmış ağımızda arar.",

  "publicSearch.type.manufacturer": "Üretici",
  "publicSearch.type.trader": "Ticaret firması",
  "publicSearch.type.distributor": "Distribütör",
  "publicSearch.type.short.manufacturer": "Üretici",
  "publicSearch.type.short.trader": "Ticaret",
  "publicSearch.type.short.distributor": "Dağıtım",

  "publicFooter.operatorRfqTitle": "Tedarik ekibi RFQ'ları",
  "publicFooter.operatorRfqDesc": "SmartSeek tedarik ekibi RFQ'nuzu yönlendirir — otomatik e-posta yağmuru yok, pazar yeri spam'i yok.",

  "rfq.header.subtitle": "SmartSeek tedarik ekibi RFQ'nuzu sicil doğrulamalı tedarikçilere yönlendirir ve yapılandırılmış teklifler döndürür.",
  "rfq.header.pointOperator": "Tedarik ekibi yönlendirmesi",

  "trustPage.rfqBody": "SmartSeek'e gönderilen her RFQ platformdan çıkmadan önce SmartSeek tedarik ekibi tarafından incelenir. Tamlık, düzenleyici uyarılar ve tedarikçi eşleşmesini kontrol eder; yalnızca ardından ilgili emtia için doğruladığımız tedarikçilere yönlendiririz. RFQ otomatik toplu gönderimi yapmayız.",

  "verificationPage.tier3.summary": "SmartSeek tedarik ekibi tarafından manuel inceleme.",
  "verificationPage.tier3.name": "Ekip doğrulamalı",

  "methodologyPage.subtitle": "SmartSeek tedarik ekibi incelemesi kullanır. Her RFQ, tedarikçiye ulaşmadan önce SmartSeek tedarik ekibi tarafından incelenir.",
  "methodologyPage.step1.body": "Alıcı RFQ gönderdiğinde SmartSeek tedarik ekibi bir iş günü içinde tamlığı kontrol eder — emtia, miktar, varış, termin, düzenleyici kısıtlar. Eksik talepler net sorularla geri döner.",

  "becomeSupplier.success.body1": "Teşekkürler. SmartSeek tedarik ekibi başvurunuzu inceleyecek ve sicil bilgilerinizi doğrulayacaktır. Genellikle 1–3 iş günü içinde şu adrese yanıt veririz:",

  "about.mission2": "SmartSeek'i sınır ötesi ticarette tekrarlayan hataları gördükten sonra kurduk: kazınmış profiller doğrulanmış gibi sunuluyor, RFQ'lar niteliksiz kişilere gönderiliyor, sicil kayıtları tedarik kapasitesi kanıtı sayılıyor. Yanıtımız sicil öncelikli doğrulama, spesifikasyon odaklı intake ve SmartSeek tedarik ekibi yönlendirmesi — algoritmik pazar yeri eşleştirmesi değil.",

  "pricing.feature3": "Her RFQ'yu SmartSeek tedarik ekibi inceler ve yönlendirir",
  "pricing.feature5": "Doğrudan SmartSeek tedarik ekibi desteği (e-posta)",
  "pricing.trust2": "Tedarik ekibi RFQ yönlendirmesi",
  "pricing.cardTitle": "Küratörlü erişim · beta boyunca ücretsiz",

  "rfqStatus.subtitle": "RFQ kimliğinizi ve gönderimde kullandığınız e-postayı girin. SmartSeek tedarik ekibinden en güncel durumu göstereceğiz.",

  "sampleReport.step2Title": "SmartSeek tedarik ekibi incelemesi",
  "sampleReport.step2Desc": "SmartSeek tedarik ekibi tamlığı kontrol eder, uygun olduğunda sicil bağlamını doğrular ve yalnızca emtia için doğrulanmış tedarikçilere yönlendirir — otomatik toplu gönderim yok.",

  "suppliersIndex.trustLine": "Sicil doğrulamalı · tedarik ekibi RFQ yönlendirmesi",

  "supplier.hero.subtitleWithCountries": "{{countries}} ülkede sicil doğrulamalı tedarikçiler — SmartSeek tedarik ekibi tarafından incelenir.",
  "supplier.hero.subtitleWorldwide": "Dünya genelinde sicil doğrulamalı tedarikçiler — SmartSeek tedarik ekibi tarafından incelenir.",

  "workspace.trustWorkflow": "Tedarik ekibi iş akışı",

  "agentPage.statusReady": "Hazır — tedarik ekibi ticaret ve tedarik analizi",

  "terms.disclaimerBody": "SmartSeek bir pazar yeri değil, satın alma tedarik platformudur. Raporlar ve öneriler bilgilendirme amaçlıdır; hukuki, finansal veya satın alma tavsiyesi değildir. Due diligence ve sözleşme kararlarından siz sorumlusunuz.",

  "smartFinder.contactModal.title": "{{supplierName}} için teklif talebi",
  "smartFinder.contactModal.description": "Talebiniz SmartSeek tedarik talebi iş akışı üzerinden yönlendirilir.",
  "smartFinder.contactModal.sentMessage": "Talebiniz gönderildi. Tedarikçi genellikle 1–3 iş günü içinde yanıt verir.",
  "smartFinder.contactModal.namePlaceholder": "Adınız *",
  "smartFinder.contactModal.emailPlaceholder": "E-posta *",
  "smartFinder.contactModal.companyPlaceholder": "Şirket adı",
  "smartFinder.contactModal.messagePlaceholder": "Mesajınız / ürün gereksinimleri *",
  "smartFinder.contactModal.errorMessage": "Gönderilemedi. Lütfen tekrar deneyin.",
  "smartFinder.contactModal.sendingButton": "Gönderiliyor…",
  "smartFinder.contactModal.sendButton": "Talep gönder",

  "supplierDetail.tier.operatorVerified": "Ekip doğrulamalı",
  "supplierDetail.tier.registryVerified": "Sicil doğrulamalı",
  "supplierDetail.tier.verificationPending": "Doğrulama bekliyor",

  "toolsPage.stats.countries": "Kapsanan ülkeler",
  "toolsPage.stats.countriesValue": "200+",
  "toolsPage.stats.hsCodes": "GTIP/HS kod kütüphanesi",
  "toolsPage.stats.hsCodesValue": "Geniş kapsam",
  "toolsPage.stats.routes": "Nakliye rotaları",
  "toolsPage.stats.routesValue": "50+",
  "toolsPage.stats.rates": "Referans oranları",
  "toolsPage.stats.ratesValue": "Düzenli güncellenir",

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
  "reports.pdf.footer": "SmartSeek tarafından oluşturuldu — Yapılandırılmış Tedarik Raporu",
  "reports.pdf.page": "Sayfa {{current}} / {{total}}",

  "rfq.form.units.kg": "kg",
  "rfq.form.units.tonsMt": "ton (MT)",
  "rfq.form.units.lbs": "lbs",
  "rfq.form.units.pcs": "adet",
  "rfq.form.units.sets": "set",
  "rfq.form.units.boxes": "kutu",
  "rfq.form.units.container20ft": "konteyner (20ft)",
  "rfq.form.units.container40ft": "konteyner (40ft)",
  "rfq.form.units.litres": "litre",
  "rfq.form.units.cubicM": "m³",
  "rfq.form.units.meters": "metre",

  "rfq.form.incoterms.EXW": "EXW — İşyerinde Teslim",
  "rfq.form.incoterms.FCA": "FCA — Taşıyıcıya Teslim",
  "rfq.form.incoterms.FOB": "FOB — Gemide Teslim",
  "rfq.form.incoterms.CFR": "CFR — Masraflar ve Navlun",
  "rfq.form.incoterms.CIF": "CIF — Masraflar, Sigorta ve Navlun",
  "rfq.form.incoterms.CPT": "CPT — Taşıma Ödenmiş",
  "rfq.form.incoterms.CIP": "CIP — Taşıma ve Sigorta Ödenmiş",
  "rfq.form.incoterms.DAP": "DAP — Belirlenen Yerde Teslim",
  "rfq.form.incoterms.DDP": "DDP — Gümrük Resmi Ödenmiş Teslim",

  "becomeSupplier.industries.mining": "Madencilik ve stratejik metaller",
  "becomeSupplier.industries.steel": "Çelik ve alaşımlar",
  "becomeSupplier.industries.nonFerrous": "Demir dışı metaller",
  "becomeSupplier.industries.rareEarths": "Nadir topraklar ve kritik mineraller",
  "becomeSupplier.industries.chemicals": "Kimyasallar ve polimerler",
  "becomeSupplier.industries.machinery": "Endüstriyel makine",
  "becomeSupplier.industries.electronics": "Elektronik ve bileşenler",
  "becomeSupplier.industries.textiles": "Tekstil ve konfeksiyon",
  "becomeSupplier.industries.food": "Gıda ve tarım",
  "becomeSupplier.industries.other": "Diğer",

  "becomeSupplier.registry.saic": "SAIC (Çin)",
  "becomeSupplier.registry.companiesHouse": "Companies House (BK)",
  "becomeSupplier.registry.secEdgar": "SEC EDGAR (ABD)",
  "becomeSupplier.registry.handelsregister": "Handelsregister (Almanya)",
  "becomeSupplier.registry.mersis": "MERSIS (Türkiye)",
  "becomeSupplier.registry.asic": "ASIC (Avustralya)",
  "becomeSupplier.registry.krs": "KRS (Polonya)",
  "becomeSupplier.registry.dart": "DART (Kore)",
  "becomeSupplier.registry.sedar": "SEDAR (Kanada)",
  "becomeSupplier.registry.other": "Diğer / ulusal sicil",

  "becomeSupplier.employees.b1_10": "1–10",
  "becomeSupplier.employees.b10_50": "10–50",
  "becomeSupplier.employees.b50_200": "50–200",
  "becomeSupplier.employees.b200_500": "200–500",
  "becomeSupplier.employees.b500_1000": "500–1000",
  "becomeSupplier.employees.b1000_5000": "1000–5000",
  "becomeSupplier.employees.b5000plus": "5000+",

  "pricing.roleSourcing": "Satın alma / tedarik",
  "pricing.roleEngineering": "Mühendislik",
  "pricing.roleFinance": "Finans",
  "pricing.roleExecutive": "Yönetim",
  "pricing.roleOther": "Diğer",
  "pricing.roleSupplyChain": "Tedarik zinciri",
  "pricing.roleFounderOps": "Kurucu / operasyon",
  "pricing.roleTrader": "Ticaret / distribütör",
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
console.log(`Phase Final: en +${enN}, tr +${trN}`);
