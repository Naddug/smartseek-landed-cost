/**
 * Neutralize investor-risk locale strings across all translation.json files.
 * Removes fabricated metrics, fake compliance claims, AI hype, and testimonials.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const localesDir = path.join(__dirname, "../client/public/locales");

/** Keys → sourcing-native neutral values (EN). Applied to every locale bundle. */
const NEUTRAL = {
  "hero.title1": "Industrial sourcing intelligence",
  "hero.title2": "for procurement teams",
  "hero.subtitle":
    "Registry-verified supplier discovery and structured RFQ workflows. Operator-reviewed sourcing — not marketplace volume.",
  "hero.cta": "Request beta access",
  "hero.freeReports": "",
  "hero.fullAccess": "",
  "home.cta.subtitle":
    "Structured RFQ workflows for industrial procurement teams. No fabricated scale claims during beta.",
  "home.cta.button": "Submit an RFQ",
  "home.cta.primary": "Search verified suppliers",
  "trustBadge.registry": "Registry-backed verification",
  "trustBadge.registry.sub": "Public-registry validation",
  "trustBadge.operator": "Operator-reviewed sourcing",
  "trustBadge.operator.sub": "SmartSeek sourcing operator routing",
  "trustBadge.structured": "Structured RFQ workflows",
  "trustBadge.structured.sub": "Specification-first intake",
  "trustBadge.noBlast": "No auto-blast RFQs",
  "trustBadge.noBlast.sub": "Curated supplier release",
  "integrationsPage.securityTitle": "Data handling during beta",
  "integrationsPage.securityDesc":
    "Buyer and supplier data is handled confidentially. TLS in transit, encryption at rest. SOC 2 attestation is in progress — we do not claim certifications we have not completed.",
  "home.benefits.costReduction": "",
  "home.benefits.qualification": "",
  "home.benefits.resilience": "",
  "home.benefits.soc2": "",
  "home.benefits.securityDesc":
    "Confidential RFQ handling, encrypted transport, and role-based access. Compliance attestation status is published when available.",
  "home.benefits.saveDesc":
    "SmartSeek focuses on registry-verified discovery and operator-routed RFQs — not inflated outcome metrics.",
  "home.feature1.desc":
    "Registry-verified supplier records with procurement-oriented metadata. Risk signals from published registry and trade data — not fabricated scores.",
  "home.feature6.title": "Sourcing reports",
  "home.feature6.desc":
    "Structured supplier comparisons and RFQ-ready specification summaries for procurement teams.",
  "persona.procurers.subline":
    "Registry-verified supplier discovery, landed cost tools, and operator-routed RFQs for procurement teams.",
  "dashboard.subtitle": "Operator-routed sourcing for procurement teams.",
  "supplier.hero.subtitleWithCountries":
    "Registry-verified suppliers in {{countries}} countries — reviewed by a SmartSeek sourcing operator.",
  "supplier.hero.subtitleWorldwide":
    "Registry-verified suppliers worldwide — reviewed by a SmartSeek sourcing operator.",
  "supplier.hero.subtitleNoStats": "Registry-verified global supplier discovery",
  "home.capabilities.subtitle":
    "From verified supplier discovery to structured RFQ workflows — built for procurement teams.",
  "home.capabilities.findSuppliersChip2": "Global sourcing regions",
  "home.capabilities.aiIntel": "Sourcing intelligence",
  "home.capabilities.aiIntelDesc":
    "Registry provenance, landed cost estimates, and structured quote comparison for procurement decisions.",
  "home.capabilities.tryAI": "Explore sourcing tools",
  "home.capabilities.aiIntelChip1": "Registry provenance",
  "home.capabilities.aiIntelChip2": "Landed cost estimates",
  "home.capabilities.aiIntelChip3": "RFQ workflows",
  "category.countries220": "Global sourcing regions",
  "category.feature1.desc":
    "Suppliers cross-referenced with official company registries where records are publicly available.",
  "trust.strip4": "Registry provenance on every profile",
  "home.pain.stat3": "",
  "home.testimonial.badge": "",
  "home.testimonials.badge": "",
  "home.testimonials.title": "",
  "home.testimonials.subtitle": "",
  "home.testimonial1.quote": "",
  "home.testimonial1.outcome": "",
  "home.testimonial1.name": "",
  "home.testimonial1.role": "",
  "home.testimonial2.quote": "",
  "home.testimonial2.outcome": "",
  "home.testimonial2.name": "",
  "home.testimonial2.role": "",
  "home.testimonial3.quote": "",
  "home.testimonial3.outcome": "",
  "home.testimonial3.name": "",
  "home.testimonial3.role": "",
  "home.testimonialCard1.quote": "",
  "home.testimonialCard1.name": "",
  "home.testimonialCard1.role": "",
  "home.testimonialCard2.quote": "",
  "home.testimonialCard2.name": "",
  "home.testimonialCard2.role": "",
  "home.testimonialCard3.quote": "",
  "home.testimonialCard3.name": "",
  "home.testimonialCard3.role": "",
  "home.testimonialCard4.quote": "",
  "home.testimonialCard4.name": "",
  "home.testimonialCard4.role": "",
  "stat.uptime": "",
  "home.hero.proofLine": "",
  "publicSearch.hero.subtitle":
    "Search registry-verified suppliers across industrial materials, manufacturing, chemicals, packaging, and machinery. Full directory unlocked for founding users during beta.",
  "home.why.body":
    "Every supplier we publish is checked against a company registry — SAIC, Companies House, SEC EDGAR, Handelsregister, MERSIS, ASIC, KRS, DART, SEDAR — and confirmed via direct contact. RFQs are routed by a SmartSeek sourcing operator, not by an algorithm.",
  "home.why.pill2": "SmartSeek sourcing operator routing",
  "home.seo.description":
    "Operator-led industrial sourcing platform with registry-verified suppliers, structured RFQs, and strong metals expertise.",
  "verificationPage.lastReviewed": "Last reviewed: May 2026",
  "supplier.resultsMatching": "Showing matching suppliers",
  "pricing.feature3": "SmartSeek sourcing operator screens and routes every RFQ",
  "pricing.feature5": "Direct SmartSeek sourcing operator support via email",
  "about.subtitle":
    "SmartSeek is an operator-led cross-border sourcing platform built by practitioners who have sourced industrial materials, managed RFQs, and learned—through trade—why registry verification and structured workflows matter.",
  "about.mission1":
    "SmartSeek helps procurement teams discover registry-verified suppliers, submit structured RFQs, and receive operator-reviewed quotes with MOQ, lead time, and Incoterms. Metals and industrial materials remain a core strength—not the whole story.",
  "about.mission2":
    "We built SmartSeek because cross-border sourcing breaks when profiles are scraped, contacts are blasted, and verification is treated as a badge instead of a process. Our approach is registry-first, operator-routed, and specification-driven.",
  "about.procurers": "Procurement & sourcing teams",
  "about.procurersDesc":
    "Industrial buyers running structured RFQs across metals, manufacturing inputs, chemicals, packaging, and machinery.",
  "about.suppliersDesc":
    "Manufacturers, traders, and distributors who want qualified RFQs—not marketplace spam.",
  "about.foundersTitle": "Built by operators",
  "about.foundersIntro":
    "SmartSeek was founded by practitioners with hands-on exposure to cross-border industrial trade—not by a generic marketplace team optimizing for listing volume.",
  "about.founder1Name": "Harun Kaya",
  "about.founder1Role": "Co-founder",
  "about.founder1Bio":
    "Cross-border industrial sourcing background across Turkey, CIS, ASEAN, China, and the US. Focused on supplier qualification, RFQ structure, and the operational gap between a registry record and a supplier you can actually place an order with.",
  "about.founder2Name": "Muhsin Kayıkçı",
  "about.founder2Role": "Co-founder",
  "about.founder2Bio":
    "Trade and procurement operations experience with emphasis on verification discipline, supplier network development, and the practical mechanics of international RFQs—from specification intake through quote normalization.",
  "about.antiMarketplace":
    "We do not scrape directories at scale, auto-blast RFQs, or publish suppliers we cannot locate in a public registry. A SmartSeek sourcing operator reviews each request before routing it. That is slower than a marketplace—and more useful to a procurement team.",
  "about.standForTitle": "How we operate",
  "about.values.integrityTitle": "Registry-first verification",
  "about.values.integrityDesc":
    "Every published supplier is anchored to a public company registry. We show provenance—not marketing badges.",
  "about.values.globalTitle": "Cross-border by default",
  "about.values.globalDesc":
    "Built for buyers sourcing across regions, incoterms, and specification regimes—not a single domestic directory.",
  "about.values.rfqTitle": "Structured RFQ routing",
  "about.values.rfqDesc":
    "RFQs are screened and routed by a SmartSeek sourcing operator. No mass outreach. No proxy theatre.",
  "about.trustStripLabel": "How SmartSeek earns trust during beta",
  "about.exploreBeta": "Request beta access",
  "trust.worldwide": "Operator-led industrial sourcing",
  "trust.strip1": "Registry-backed supplier verification",
  "trust.strip3": "Structured RFQ workflows",
  "home.hiw.step1.desc":
    "Search registry-verified suppliers by commodity, region, and specification. Matches include registry provenance — not scraped contact lists.",
  "home.hiw.step3.desc":
    "Submit structured RFQs reviewed by a SmartSeek sourcing operator. Quotes return with MOQ, lead time, and Incoterms.",
  "publicSearch.subtitle": "Featured suppliers — request beta access for the full directory",
  "publicSearch.signupCta": "Request beta access to the supplier directory",
  "home.trustBlock.body":
    "SmartSeek connects you to registry-backed supplier records and the full landed cost picture — not just unit prices. Built by cross-border sourcing operators, not a marketplace listing team.",
  "home.trustBlock.cta": "Request beta access — founding member pricing when paid plans launch",
  "home.demo.desc":
    "Search registry-verified suppliers across industrial categories. Preview results are curated; full directory access is available to founding users during beta.",
  "home.demo.freeUnlocks":
    "Beta accounts unlock the full supplier directory and verified contact details where available.",
  "category.freeUnlocks":
    "Beta accounts unlock the full supplier list and verified contact details where available.",
  "about.procurers": "Industrial procurement teams",
  "home.sections.previewBody":
    "A sample of registry-verified suppliers across metals, manufacturing, chemicals, packaging, and machinery. Full directory unlocked for founding users during beta.",
  "publicSearch.empty.body":
    "Our public directory is intentionally curated. If you cannot find a supplier here, submit an RFQ and a SmartSeek sourcing operator will search our internal index and verified network.",
  "trustPage.rfqBody":
    "Every RFQ submitted on SmartSeek is reviewed by a SmartSeek sourcing operator before it leaves the platform. We screen for completeness, regulatory red flags, and supplier match — and only then route the request to suppliers we have verified for that commodity. We do not auto-blast RFQs.",
  "methodologyPage.subtitle":
    "SmartSeek is operator-led. Every RFQ is reviewed by a SmartSeek sourcing operator before it reaches a supplier.",
  "methodologyPage.step1.body":
    "When a buyer submits an RFQ, a SmartSeek sourcing operator reviews it for completeness — commodity specification, quantity, destination, lead time, regulatory constraints — within one business day. Incomplete RFQs are returned with specific clarification questions.",
  "rfqStatus.subtitle":
    "Enter your RFQ ID and the email you used to submit. We will show the latest status from your SmartSeek sourcing operator.",
  "home.how.step2Desc":
    "A SmartSeek sourcing operator screens your RFQ and routes it only to suppliers verified against public company registries.",
  "auth.signupDesc": "Create your beta account for registry-verified supplier discovery and structured RFQ workflows.",
  "home.step1.desc":
    "Enter commodity, specification, quantity, destination, and lead time. Structured intake — not a keyword marketplace search.",
  "home.step2.title": "SmartSeek sourcing operator review",
  "home.step2.desc":
    "A SmartSeek sourcing operator screens your request, validates registry provenance, and routes RFQs to verified suppliers only.",
  "home.step3.desc":
    "Receive structured quotes with MOQ, lead time, Incoterms, and supplier provenance. You decide who to engage.",
  "home.features.subtitle":
    "Not a generic contact database. Registry-verified supplier records, landed costs, and structured RFQ workflows — built for industrial procurement teams.",
  "home.preview.tabTextiles": "",
  "publicFooter.operatorRfqDesc":
    "A SmartSeek sourcing operator routes your RFQ — no automated email blasts, no marketplace spam.",
};

const dirs = fs.readdirSync(localesDir).filter((d) => {
  const p = path.join(localesDir, d, "translation.json");
  return fs.existsSync(p);
});

let filesUpdated = 0;
let keysPatched = 0;

for (const locale of dirs) {
  const filePath = path.join(localesDir, locale, "translation.json");
  const json = JSON.parse(fs.readFileSync(filePath, "utf8"));
  let changed = false;
  for (const [key, value] of Object.entries(NEUTRAL)) {
    if (key in json && json[key] !== value) {
      json[key] = value;
      changed = true;
      keysPatched++;
    }
  }
  if (changed) {
    fs.writeFileSync(filePath, JSON.stringify(json, null, 2) + "\n");
    filesUpdated++;
  }
}

console.log(`Patched ${keysPatched} key instances across ${filesUpdated} locale files.`);
