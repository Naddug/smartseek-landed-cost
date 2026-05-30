#!/usr/bin/env node
/** Phase E Batch 3 — verification signals, workspace/compliance/assistant copy */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "../client/public/locales");

const EN = {
  "supplier.signals.registryVerified": "Registry verified",
  "supplier.signals.verificationPending": "Verification pending",
  "supplier.signals.rfqReady": "RFQ-ready",
  "supplier.signals.documentationAvailable": "Documentation on file",
  "supplier.signals.profileComplete": "Profile complete",
  "supplier.qualityScore": "Profile completeness",
  "supplier.sortTopRated": "Registry verified first",
  "category.qualityScore": "Verified",
  "category.profileComplete": "Complete",

  "supplierDetail.facts.verificationTier": "Verification tier",
  "supplierDetail.signals.noScoreDisclaimer": "No marketplace rating — verification status from registry data only.",

  "workspace.intelligence": "Sourcing analysis",
  "workspace.intelligenceDesc": "Structured supplier evaluation reports",
  "workspace.discoverDesc": "Search registry-verified suppliers",
  "workspace.verifyDesc": "Registry and compliance screening",
  "workspace.trustWorkflow": "Operator-led sourcing workflow",

  "compliancePage.title": "Compliance check",
  "compliancePage.subtitle": "Registry-backed certification checks, regulatory scope, and sanctions screening",
  "compliancePage.parameters": "Check parameters",
  "compliancePage.run": "Run compliance check",
  "compliancePage.checking": "Checking…",
  "compliancePage.checksTitle": "Checks we run automatically",
  "compliancePage.checksDesc": "Enter supplier details and run a check. We verify the following:",
  "compliancePage.overview": "Compliance overview",

  "assistantPage.title": "Sourcing decision assistant",
  "assistantPage.subtitle": "Operator-reviewed procurement analysis for sourcing decisions",
  "assistantPage.tabAnalyze": "Analyze",
  "assistantPage.tabResults": "Results",
  "assistantPage.formDesc": "Enter product details for sourcing analysis",
  "assistantPage.generate": "Generate analysis",
  "assistantPage.analyzing": "Analyzing…",
  "assistantPage.poweredNote": "Analysis uses registry data, trade benchmarks, and supplier verification signals — not marketplace ratings.",
  "assistantPage.recommendation": "Sourcing recommendation",
  "assistantPage.tip": "Sourcing note",
  "assistantPage.insightsReady": "Analysis ready for review",

  "signup.benefitReports": "Structured sourcing reports",
  "signup.benefitCredits": "10 free credits to get started",
  "signup.benefitNoCard": "No credit card required",

  "supplierDiscovery.upgradeCopy": "Upgrade to Pro for full results, contact details, and advanced filters.",
  "supplierDiscovery.filterVerified": "Registry verified only",

  "reports.chartNoRatings": "Compare MOQ, lead time, and Incoterms — contact suppliers for pricing.",
  "reports.verificationTier": "Verification",

  "smartFinder.primaryMatch": "Primary match",
  "smartFinder.verificationField": "Verification",
  "smartFinder.registryReviewed": "Registry reviewed",

  "category.cta.footer": "No credit card · Beta access · Operator-led onboarding",
};

const TR = {
  "supplier.signals.registryVerified": "Sicil doğrulamalı",
  "supplier.signals.verificationPending": "Doğrulama bekliyor",
  "supplier.signals.rfqReady": "RFQ'ya hazır",
  "supplier.signals.documentationAvailable": "Belge mevcut",
  "supplier.signals.profileComplete": "Profil tam",
  "supplier.qualityScore": "Profil tamlığı",
  "supplier.sortTopRated": "Önce sicil doğrulamalı",
  "category.qualityScore": "Doğrulandı",
  "category.profileComplete": "Tam",

  "supplierDetail.facts.verificationTier": "Doğrulama seviyesi",
  "supplierDetail.signals.noScoreDisclaimer": "Pazar yeri puanı yok — yalnızca sicil verilerinden doğrulama durumu.",

  "workspace.intelligence": "Tedarik analizi",
  "workspace.intelligenceDesc": "Yapılandırılmış tedarikçi değerlendirme raporları",
  "workspace.discoverDesc": "Sicil doğrulamalı tedarikçi ara",
  "workspace.verifyDesc": "Sicil ve uyum taraması",
  "workspace.trustWorkflow": "Operatör yönlendirmeli tedarik süreci",

  "compliancePage.title": "Uyum kontrolü",
  "compliancePage.subtitle": "Sicil destekli sertifika kontrolleri, düzenleyici kapsam ve yaptırım taraması",
  "compliancePage.parameters": "Kontrol parametreleri",
  "compliancePage.run": "Uyum kontrolü çalıştır",
  "compliancePage.checking": "Kontrol ediliyor…",
  "compliancePage.checksTitle": "Otomatik çalıştırılan kontroller",
  "compliancePage.checksDesc": "Tedarikçi bilgilerini girin ve kontrolü çalıştırın:",
  "compliancePage.overview": "Uyum özeti",

  "assistantPage.title": "Tedarik karar asistanı",
  "assistantPage.subtitle": "Satın alma kararları için operatör inceli tedarik analizi",
  "assistantPage.tabAnalyze": "Analiz",
  "assistantPage.tabResults": "Sonuçlar",
  "assistantPage.formDesc": "Tedarik analizi için ürün detaylarını girin",
  "assistantPage.generate": "Analiz oluştur",
  "assistantPage.analyzing": "Analiz ediliyor…",
  "assistantPage.poweredNote": "Analiz sicil verisi, ticaret referansları ve doğrulama sinyallerini kullanır — pazar yeri puanı değil.",
  "assistantPage.recommendation": "Tedarik önerisi",
  "assistantPage.tip": "Tedarik notu",
  "assistantPage.insightsReady": "Analiz incelemeye hazır",

  "signup.benefitReports": "Yapılandırılmış tedarik raporları",
  "signup.benefitCredits": "Başlangıç için 10 ücretsiz kredi",
  "signup.benefitNoCard": "Kredi kartı gerekmez",

  "supplierDiscovery.upgradeCopy": "Tam sonuçlar, iletişim bilgileri ve gelişmiş filtreler için Pro'ya yükseltin.",
  "supplierDiscovery.filterVerified": "Yalnızca sicil doğrulamalı",

  "reports.chartNoRatings": "MOQ, termin ve Incoterms karşılaştırın — fiyat için tedarikçiyle iletişime geçin.",
  "reports.verificationTier": "Doğrulama",

  "smartFinder.primaryMatch": "Birincil eşleşme",
  "smartFinder.verificationField": "Doğrulama",
  "smartFinder.registryReviewed": "Sicil incelendi",

  "category.cta.footer": "Kredi kartı yok · Beta erişimi · Operatör yönlendirmeli onboarding",
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
console.log(`Batch 3: en +${enN}, tr +${trN}`);
