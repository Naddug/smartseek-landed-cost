# CONTENT GAP ANALYSIS
## ORTAQ — Current Site vs. Proposed Site

*Compares current website sections against proposed architecture.*
*Decision for each element: KEEP / REMOVE / REWRITE / MERGE / CREATE*

---

## HOW TO READ THIS DOCUMENT

**KEEP:** Content is accurate and strong. Move to new site without substantive change.
**REMOVE:** Content is misleading, duplicative, outdated, or undermines trust. Delete it.
**REWRITE:** Structure or intent is right, but copy needs to be updated to new positioning.
**MERGE:** Content should be combined with another section rather than living separately.
**CREATE:** Content does not exist yet and must be written from scratch.

---

## HOMEPAGE (`/`)

### Hero section — Headline + Subhead

**Current:**
> H1: "Tüm işlem, tek kayıtta. İki taraf da aynı gerçeği görür."
> Subhead: "Sözleşme, muayene, sevkiyat ve ödeme — şu an WhatsApp, e-posta, Excel ve PDF'lere dağılmış. ORTAQ hepsini alıcı ve satıcının aynı anda gördüğü tek bir işlem kaydında toplar."

**Decision: REWRITE**

**Why:** The current H1 leads with the mechanism ("tek kayıt") not the problem. The visitor's recognition moment — "that is exactly what I experience" — is missing. The word "gerçeği" is conceptually correct but lands as vague. The subhead describes the product accurately but describes it as a feature ("toplar"), not an outcome.

**New direction:** Lead with the specific daily question the ICP asks every morning. The product is the answer to that question.

---

### Hero CTAs

**Current:**
- Primary: "Demo İsteyin →"
- Secondary: "Ürünü gör →" → `/urun`

**Decision: KEEP**

**Why:** Two-CTA structure is correct. The secondary ghost button directing to `/urun` is the right secondary path. Copy and styling are adequate. Rewrite the demo CTA framing on the demo page — not here.

---

### Chaos visual (TransformationHero)

**Current:** Side-by-side panels showing fragmented tools (WhatsApp, email, Excel, PDF icons) vs. an organized ORTAQ record card. Height compressed in Sprint 1.5.

**Decision: REWRITE (visual concept)**

**Why:** The visual concept is correct — show the before/after. But the current implementation over-indexes on the chaos side. The chaos panel becomes visually noisy (this was acknowledged in Sprint 1.5 when it had to be compressed). The visual needs to be rebuilt to make the contrast legible in 2 seconds, not 10. The "chaos" should be abstract enough to evoke the feeling without looking like a literal app-icon dump.

What changes: not the position on the page, not the before/after structure — the visual execution, which is a design task for implementation.

---

### TrustStrip (3-feature strip)

**Current:**
- "Alıcı-satıcı aynı belgeyi görür"
- "Dahili notlar gerçekten özel"
- "Kurulum yok — karşı taraf davetlе başlar"

**Decision: REWRITE**

**Why:** These are feature statements, not outcome statements. "Alıcı-satıcı aynı belgeyi görür" tells the visitor what the product does, not why that matters. The current strip functions as a feature list — which the repositioning explicitly moves away from.

**New direction:** Three outcome statements, each ending the reconstruction problem for a specific moment. Examples:
- "Hangi belge güncel? Her iki taraf da aynı anda görüyor."
- "Kim onayladı, ne zaman? Değişmez kayıt."
- "Karşı tarafı sisteme dahil etmek: tek link."

---

### CounterpartyPreview (Sprint 1 addition)

**Current:** Two-column split showing seller view vs. buyer view of documents. Key row: "BL Taslak — Yalnızca biz."

**Decision: KEEP (move to `/urun` as primary counterparty showcase)**

**Why:** This is the single most differentiating visual on the site. But it is currently buried on the homepage between the trust strip and the portfolio preview. It belongs on the product page as the Act 2 feature, not as a homepage teaser. On the homepage, the concept should be communicated in 1–2 sentences, with the detailed split view living on `/urun`.

**Homepage treatment:** Replace the full component with a brief framing statement and a "Karşı taraf görünümünü ürün sayfasında görün →" link.

---

### PortfolioPreview (Sprint 1 addition)

**Current:** 3-column table of active deals, with "Sıra Kimde," badges, and critical dates. Stats: Acil: 2, Aktif: 3, Bu Hafta: 2.

**Decision: KEEP (location: stays on homepage, in Section 3 of new architecture)**

**Why:** The portfolio view is the most credible "operational picture" concept on the site. It directly answers "what does your team see each morning?" It should stay on the homepage but be elevated to Section 3 (The ORTAQ Concept), not presented as a secondary teaser.

**What changes:** Framing copy. The current heading "Birden fazla işleminiz varsa, sabah buradan başlarsınız" is good. Keep it. Add an outcome subhead: "Sıra kimde, risk nerede, ne acil — tek bakışta."

---

### RealExample ("Son durum ne? Sıra kimde?" section)

**Current:** Three Q&A rows showing real operational questions answered in ORTAQ. €340K textile deal example.

**Decision: REWRITE**

**Why:** This section is directionally right — it frames value as human questions, not features. But the current implementation lists the questions and then answers them with product copy that sounds like marketing. The format works; the execution needs to be sharper.

**New direction:** Keep the Q&A format. Change the framing to make it personal: "Bu soruların cevabını bulmak şu an ne kadar sürüyor?" Then the ORTAQ answer. Three questions maximum. Different industry example — not the €840K steel deal (overused across the site).

---

### RiskBoard (portfolio risk visual)

**Current:** 6-deal risk board showing operational status, risk level, and responsible party.

**Decision: MERGE with PortfolioPreview**

**Why:** Both the RiskBoard and PortfolioPreview show portfolio-level information. Having both on the homepage creates redundancy. PortfolioPreview (the simplified 3-column table) is cleaner and more immediately readable. RiskBoard is better suited to the `/urun` Portföy module, where it already lives.

---

### RoleView (Procurement + Finance morning scenes)

**Current:** Two persona vignettes — procurement manager and finance director — with their daily questions and how ORTAQ answers them.

**Decision: REMOVE from homepage / MERGE into `/kimler-icin`**

**Why:** Role stories belong on the use case page, not the homepage. The homepage's job is to create recognition of the reconstruction problem — not to enumerate personas. Role stories are for visitors who have already recognized the problem and want to confirm it's their problem specifically. That confirmation happens on `/kimler-icin`, not on the homepage.

**Additional reason:** The current role stories follow identical structure (morning scenario → question → ORTAQ answer), which reads as formulaic when repeated twice in the same section.

---

### DealJourney (relocated to `/nasil-calisir` in Sprint 1)

**Current location:** `/nasil-calisir`
**Status:** Already relocated correctly.

**Decision: KEEP at current location**

**Why:** The lifecycle timeline (Teklif → Müzakere → Sözleşme → Muayene → Sevkiyat → Ödeme) is a mechanism explanation, not a value proposition. It belongs in "how it works," not on the homepage. Sprint 1 made the correct call.

---

## PRODUCT PAGE (`/urun`)

### Sector filter pills (Çelik / Makine / Tekstil / Gıda / Kimya / Ham Madde)

**Decision: KEEP**

**Why:** These give the visitor immediate confidence that their industry is covered. They add domain credibility without requiring explanation. Retain as the entry point to the product page.

---

### Quick navigation guidance strip (Sprint 2 addition)

**Current:** "İlk kez mi bakıyorsunuz?" with 3 pills: Karşı Taraf görünümü / Portföy / İşlem Özeti.

**Decision: REWRITE**

**Why:** The concept is correct. A first-time visitor needs a recommended path. But the current order (Karşı Taraf → Portföy → İşlem Özeti) was designed around the old homepage sequence. The new product page architecture puts İşlem Özeti first (Act 1), then Karşı Taraf (Act 2), then Portföy (Act 3). The guidance strip should reflect this new order.

**New copy:** "İlk kez mi bakıyorsunuz? Şu sırayla gidin:" → İşlem Özeti → Karşı Taraf → Portföy.

---

### 8-Tab structure (İşlem Özeti, Belge Merkezi, İletişim, Onaylar, Portföy, Karşı Taraf, Denetim İzi, Mobil)

**Decision: REORDER (not add or remove)**

**Current order:** İşlem Özeti, Belge Merkezi, İletişim, Onaylar, Portföy, Karşı Taraf, Denetim İzi, Mobil

**New order (reflects Input → Understanding → Picture → Capabilities):**
1. İşlem Özeti *(Act 1 — the operational record)*
2. Karşı Taraf *(Act 2 — both parties, one reality)*
3. Portföy *(Act 3 — the operational picture)*
4. Belge Merkezi *(Act 4 — supporting capabilities)*
5. İletişim
6. Onaylar
7. Denetim İzi
8. Mobil

**Why this order:** The first three modules tell the complete product story. A visitor who sees only these three understands what ORTAQ is. The remaining five provide supporting detail for visitors who need more specifics.

---

### Product page framing copy (current page header)

**Current:** Technical design principles — no general notifications, messages tied to deals, etc.

**Decision: REWRITE**

**Why:** The current header reads as internal product specs, not visitor-facing value. A visitor coming to the product page wants to know "what will I see and why does it matter?" not "what are the design principles."

**New direction:** One orienting paragraph that sets up the narrative: "ORTAQ bir B2B işlemini baştan sona tek bir kayıtta tutar. Her aşamada ne olduğunu, kimin beklediğini ve sıradaki adımın ne olduğunu her iki taraf da aynı anda görüyor."

---

### Per-module content (the actual screen mockups)

**Decision: KEEP**

**Why:** The product mockup content is strong. Realistic data, clear layouts, domain-specific examples. The mockup quality itself is production-grade. What changes is the order and the framing — not the content.

---

## HOW IT WORKS (`/nasil-calisir`)

### 4-step buyer/seller story

**Current:** Step-by-step explanation of how two companies use ORTAQ on a shared deal.

**Decision: REWRITE (structure + copy)**

**Why:** The current "how it works" page explains the product but doesn't address the adoption anxiety. The visitor isn't just asking "how does it work?" — they're asking "how hard is it to start?" and "how do I get my counterparty to use this?"

**New direction:** 5 sections as defined in NEW_SITE_ARCHITECTURE.md. The adoption story needs to start with "you start with one deal — not a transformation project." This is both more honest and more persuasive.

---

### DealJourney visual

**Decision: KEEP at this location**

**Why:** Correctly placed here after Sprint 1. Mechanism explanation belongs in "how it works."

---

## SCENARIOS (`/senaryolar`)

### Category filter (6 categories)

**Decision: KEEP**

**Why:** Category filtering (Belge, Onay, Ödeme, Zamanlama, İletişim, Portföy) is useful for visitors with a specific concern. Keep as entry point.

---

### 15 Scenario cards (chaos vs. ORTAQ format)

**Decision: KEEP (update positioning copy only)**

**Why:** The scenario format is the best product education content on the site. Each card: 4-frame storyboard, chaos state, ORTAQ state. The structure is correct. The volume (15) is good — enough to give confidence without being overwhelming.

**What changes:** Scenario introductory copy should be updated to reflect new positioning. Currently some scenarios use language that implies AI automation that doesn't exist. Audit each scenario's ORTAQ-side copy for claims that cannot be demonstrated.

---

### Feature discovery boxes (Sprint 3 addition)

**Decision: KEEP**

**Why:** Linking each scenario to the relevant product modules is exactly right. It converts the scenario page from "problem gallery" to "product discovery path." This change from Sprint 3 should survive the repositioning.

**What changes:** The feature boxes should be reviewed for any claims that imply AI capability. Any "ORTAQ automatically detects..." language should become "ORTAQ kayıt altına alır..." — same value, no overclaiming.

---

## WHO IS IT FOR (`/kimler-icin`)

### 6 persona profiles

**Current:** İhracatçı, İthalatçı, Satınalma Müdürü, Ticari Ekip, Tüccar, Distribütör — each with a "day in life" narrative.

**Decision: REWRITE (reduce to 3 ICP profiles, restructure format)**

**Why:** 6 personas with identical narrative structure dilutes the page. A visitor looking at 6 equal-weight profiles isn't sure which one is the primary audience. The site should project confident ICP clarity: "this is who ORTAQ is built for."

**New direction:** 3 ICP profiles:
1. İhracat/İthalat Operasyon Ekibi (the primary ICP)
2. Satınalma ve Tedarik Müdürü
3. Ticari Direktör / Genel Müdür (the economic buyer)

For each: one specific morning question they ask, one specific pain in the current state, what ORTAQ changes for them specifically. 150 words maximum per profile.

---

## WHY ORTAQ (`/neden-ortaq`)

### Current content

**Current:** Problem scatter, trade credibility, what it is/isn't sections.

**Decision: REWRITE**

**Why:** The current `/neden-ortaq` page explains the problem well but doesn't directly answer the "why not just use email?" objection that this page's purpose should address. The page needs to be structured as a rational response to that specific objection — not as a general problem statement.

**What survives:** The honest tone. The trade domain examples. The "is / is not" structure.

---

## PRICING (`/fiyat`)

### Pricing model description

**Decision: KEEP (update framing)**

**Why:** "Fixed monthly per company, not per user or per deal" is the right pricing model description and should stay. The clarity is genuinely differentiating.

**What changes:** Add explicit acknowledgment that price is confirmed in the demo session — the visitor won't be surprised. Also add: "Ürün henüz tam olarak kurulu değilse demo aşamasında bunu da konuşuruz" — i.e., honest about where in the build the product is.

---

### Included/excluded feature lists

**Decision: KEEP**

**Why:** Both lists are accurate, honest, and set correct expectations. The excluded list (ERP, API, auto-translation, logistics) is especially valuable — it prevents wrong-fit demos.

---

### Pricing FAQ

**Decision: MERGE into `/guven`**

**Why:** Pricing questions and trust questions are often the same question. Consolidating them into one "trust and pricing" FAQ section on `/guven` is cleaner than maintaining two separate FAQ sections on two pages.

---

## TRUST (`/guven`)

### Section 1 — Why ORTAQ exists

**Decision: REWRITE**

**Why:** The founding story needs to align with the new positioning. The new version: "We watched operations teams spend hours every day reconstructing what was happening in their B2B relationships. The information existed — in email, WhatsApp, PDFs. Nobody was synthesizing it. We built the system that was missing."

---

### Section 2 — Who it's for / not for

**Decision: KEEP (minor updates)**

**Why:** The structure is right. The "not for" list is especially important. Add one item to the "not for" list: "Şu an yapay zekâ ile email veya mesaj analizi bekleyenler" — honest about current AI absence.

---

### Section 3 — Does / doesn't

**Decision: REWRITE (add critical new "doesn't")**

**Why:** The current "doesn't" list correctly excludes ERP, CRM, chat, logistics, legal advice. But it does not address the AI expectation. Given that the repositioning direction involves AI, and visitors may arrive expecting AI capabilities that don't exist, the "doesn't" list must explicitly include:

> "Şu an ORTAQ email, WhatsApp veya diğer iletişim kanallarından veri otomatik olarak çekmez. Siz neyi kayıt altına alacağınıza karar verirsiniz; ORTAQ onu düzenler, saklar ve her iki tarafa erişilebilir kılar."

This is not a weakness admission — it is trust-building specificity that prevents the demo-to-reality gap.

---

### Section 4 — Security & Privacy

**Decision: KEEP (add one honesty note)**

**Why:** The security commitments are genuine. The copy is credible. Add one sentence: "Bu sayfa ürün taahhütlerimizi yansıtmaktadır — bazı teknik detaylar ürün kurulumunun tamamlanmasıyla birlikte doğrulanabilir hale gelecektir."

---

### Section 5 — Commercial Reliability

**Decision: KEEP as is**

**Why:** This is the best section on the site. "We're a small company. Here's what happens if we shut down." This is rare and builds genuine trust. Do not touch it.

---

### Section 6 — FAQ (currently at `/sss`)

**Decision: MERGE here**

**Why:** FAQs should live next to the trust content, not as a standalone page. Visitors who have trust questions will find answers in context.

**What changes:** Add 2–3 new FAQ items:
- "ORTAQ şu an yapay zekâ kullanıyor mu?" → Honest answer: not yet, but that's the direction.
- "Demo'da gerçek ürünü mü görüyorum?" → Honest answer: the demo shows the product design and concept; the working product is in development.
- "WhatsApp mesajları otomatik geliyor mu?" → This is already in the FAQ. Keep it.

---

### Section 7 — Honest Limits

**Decision: KEEP + EXPAND**

**Why:** The current "honest limits" section is exceptional — no SOC 2, no bulk automation, no logistics tracking, mobile not full-featured. Expand it with two more honest limits:
- "Ürün şu an aktif olarak geliştirme aşamasındadır. Demo, ürünün tasarımını ve çalışma mantığını gösterir."
- "Yapay zekâ entegrasyonları şu an geliştirme yol haritasında yer almaktadır. Bugünkü ürün manuel girişe dayalı bir operasyonel kayıt sistemidir."

---

## DEMO PAGE (`/demo`)

### Current form (3 fields)

**Decision: KEEP + ADD ONE FIELD**

**Why:** 3-field forms convert better than long forms. Keep name, company, email. Add one optional field: "Hangi sektörde çalışıyorsunuz?" — helps ORTAQ prepare the right scenario for the session. Optional, not required.

---

### Page framing / headline

**Current:** Standard "demo iste" framing.

**Decision: REWRITE**

**Why:** The reframe from "demo request" to "working session request" is the most important conversion change on the site. The visitor should feel they are getting value from the session — not just being sold to.

**New headline:** "Bir işleminizi getirin. Birlikte bakacağız."
**Subhead:** "30 dakika. Kendi operasyonunuz. Hazırlık gerekmez."

---

### WhatsApp alternative CTA

**Decision: KEEP**

**Why:** This is a legitimate conversion path. The ICP communicates by WhatsApp. Having a WhatsApp contact option meets them where they are. Keep it as equal alternative, not secondary.

---

## NAVIGATION

### Current primary nav

**Current:** Nasıl Çalışır / Ürün / Kimler İçin / Senaryolar / Neden ORTAQ / Fiyatlandırma / Demo İste (7 items + CTA)

**Decision: SIMPLIFY**

**New:** Nasıl Çalışır / Ürün / Senaryolar / Fiyatlandırma / Demo İsteyin (4 items + CTA)

**Removed:**
- "Kimler İçin" — cross-linked from Senaryolar; reduces primary nav clutter
- "Neden ORTAQ" — moves to footer; this is a secondary page for deeper visitors

**Why:** 7-item navigation creates decision paralysis for a first-time visitor. The primary navigation should guide visitors to the 4 things that matter most: understanding the product (Ürün), seeing it in scenarios (Senaryolar), understanding pricing (Fiyatlandırma), and taking action (Demo).

---

## PAGES TO CREATE (NET NEW CONTENT)

### 1. AI Direction Statement (section within `/neden-ortaq` or `/guven`)

**What:** A clear, honest statement about where ORTAQ is going — AI that reads operational communications and surfaces understanding automatically. Positioned as the explicit product direction, not a current capability.

**Why it must be created:** Without this, the repositioning toward "operational intelligence" has no honest home on the site. Visitors who have read about the AI vision (e.g., from conversations, conferences, or media) need to find the honest, grounded version of that vision on the website.

**Contents:**
- What ORTAQ will do (the direction)
- What ORTAQ does today (the foundation)
- Why the foundation must exist before the AI layer
- When to expect the AI capabilities (honest: "in development")

---

### 2. What happens in the demo (section within `/demo`)

**What:** A short, specific description of what a working session looks like: who attends, how long, what they'll see, what to prepare.

**Why it must be created:** Currently the demo page is just a form. The conversion gap is "I don't know what I'm signing up for." Explaining what happens next reduces this anxiety and increases form submission rates.

---

### 3. The "operational memory" concept page or section

**What:** A short explainer of the category concept — why "operational memory" is the right way to think about what ORTAQ provides, why existing tools don't fill this role, and what operational memory looks like in practice.

**Why it must be created:** If "operational memory" is the category ORTAQ is claiming, the site must define it. Otherwise the category name is just words.

**Location:** Could be a section within `/neden-ortaq`, or a standalone page if the concept warrants depth.

---

## SUMMARY DECISION TABLE

| Content Element | Decision | Priority |
|----------------|----------|----------|
| Hero headline/subhead | REWRITE | Critical |
| Hero CTAs | KEEP | — |
| Chaos visual | REWRITE concept | High |
| TrustStrip 3-features | REWRITE | High |
| CounterpartyPreview (homepage) | MOVE to `/urun`, simplify on homepage | High |
| PortfolioPreview | KEEP + reframe copy | Medium |
| RealExample Q&A | REWRITE | Medium |
| RiskBoard | MERGE with PortfolioPreview → `/urun` | Medium |
| RoleView | REMOVE from homepage → MERGE `/kimler-icin` | High |
| DealJourney | KEEP at `/nasil-calisir` | — |
| `/urun` sector pills | KEEP | — |
| `/urun` tab order | REORDER | High |
| `/urun` guidance strip | REWRITE copy | Medium |
| `/urun` module content | KEEP | — |
| `/urun` page header | REWRITE | Medium |
| `/nasil-calisir` 4-step story | REWRITE | High |
| `/senaryolar` category filter | KEEP | — |
| `/senaryolar` 15 scenario cards | KEEP + audit AI claims | Medium |
| `/senaryolar` feature boxes | KEEP + audit AI claims | Medium |
| `/kimler-icin` 6 personas | REWRITE → reduce to 3 | Medium |
| `/neden-ortaq` | REWRITE | High |
| `/fiyat` pricing model | KEEP + update framing | Low |
| `/fiyat` included/excluded | KEEP | — |
| `/fiyat` FAQ | MERGE into `/guven` | Low |
| `/guven` Section 1 — Why exists | REWRITE | High |
| `/guven` Section 2 — Who for/not | KEEP + add AI disclaimer | High |
| `/guven` Section 3 — Does/doesn't | REWRITE + add AI "doesn't" | Critical |
| `/guven` Section 4 — Security | KEEP + add honesty note | Medium |
| `/guven` Section 5 — Commercial | KEEP as is | — |
| `/guven` Section 6 — FAQ | MERGE from `/sss` + add 3 new items | High |
| `/guven` Section 7 — Honest limits | KEEP + add 2 items | High |
| `/demo` form | KEEP + add 1 optional field | Low |
| `/demo` headline/framing | REWRITE | High |
| `/demo` WhatsApp CTA | KEEP | — |
| Primary navigation | SIMPLIFY (7→4 items) | High |
| `/kesfet`, `/sirket/[slug]` | NOINDEX / REMOVE | Medium |
| `/demo/sermaye`, `/degerlendirme` | REMOVE | Medium |
| AI direction statement | CREATE | Critical |
| "What happens in the demo" | CREATE | High |
| Operational memory concept | CREATE | Medium |

---

## THE MOST CRITICAL CHANGE

Of all the changes in this document, one is more important than all the others:

**Section 3 of `/guven` must be updated before any other change is made.**

Specifically: **"ORTAQ şu an email veya WhatsApp mesajlarını otomatik olarak okumaz."** and **"ORTAQ şu an yapay zekâ ile iletişim analizi yapmıyor."** must be on the live website before any implementation of the new "AI operational intelligence" positioning begins.

Why: If the repositioning goes live (even partially — even just the new headline) without these disclaimers, and a visitor requests a demo expecting AI capabilities, the demo will disappoint them and damage trust. The trust page is the safety valve. Update it first.

**Implementation order:**
1. Update `/guven` Section 3 (trust page honest limits) — first
2. Rewrite the hero headline (recognition-first positioning) — second
3. Everything else in priority order

No other implementation sequence is acceptable.
