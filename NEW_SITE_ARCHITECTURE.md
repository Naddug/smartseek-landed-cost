# NEW SITE ARCHITECTURE
## ORTAQ — Complete Replacement Architecture

*This document defines information architecture and narrative flow only.*
*No UI design. No component specifications. No code.*
*Implementation begins only after this document is approved.*

*Assumes: "Operational memory for B2B teams" positioning.*
*Constraint: All claims must be demonstrable in the demo.*

---

## ARCHITECTURAL PRINCIPLES

**1. One idea per page.**
Each page has one job. Visitors should know exactly what they're on and why it matters in under 5 seconds.

**2. The demo is the product.**
Every page should move the visitor toward one of two actions: request a demo, or deepen their understanding of the product. No page should confuse the visitor about what ORTAQ is.

**3. Claim only what you can show.**
Every capability stated on the website must be demonstrable in the demo session. If it cannot be shown, it cannot be on the website.

**4. The ICP is a B2B operations manager, not a tech buyer.**
Language, examples, and value propositions should resonate with someone who manages commercial relationships between companies — not with a CTO evaluating software infrastructure.

**5. Trust is built by admission, not assertion.**
Stating what ORTAQ does NOT do is as important as what it does. The trust page is a strategic asset, not a defensive afterthought.

---

## SITE MAP

| Page | Path | Primary Job |
|------|------|-------------|
| Homepage | `/` | Create the recognition moment. Get to demo. |
| Product | `/urun` | Show the product. Create desire. |
| How It Works | `/nasil-calisir` | Explain the mechanism. Reduce anxiety. |
| Use Cases | `/kimler-icin` or `/senaryolar` (merged) | Confirm fit. Specific > generic. |
| Why ORTAQ | `/neden-ortaq` | Handle the "why not just email?" objection. |
| Pricing | `/fiyat` | Set expectations. Remove pricing anxiety. |
| Trust | `/guven` | Answer "should I trust this company?" |
| Demo | `/demo` | Convert. As low friction as possible. |

**Removed from primary navigation:**
- `/sss` — merge FAQ into `/guven` and `/fiyat`
- `/ekip` — move to footer only
- `/corridors` — SEO utility pages, not primary navigation
- `/investors` — separate, not in customer navigation

---

## PAGE 1: HOMEPAGE (`/`)

### Purpose
Make a first-time visitor — specifically an operations manager or business owner who manages B2B relationships — immediately recognize their problem and see ORTAQ as the solution. Move them to either request a demo or explore the product.

### Audience
Primary: Operations managers and business owners at Turkish B2B companies (import/export, manufacturing, trading). People who know exactly what it feels like to spend the morning reconstructing what's happening.

### Key Message
"Your team knows what happened — somewhere. ORTAQ makes it accessible."

### Narrative Flow

---

**SECTION 1 — HERO: The recognition trigger**

Goal: Make the visitor stop and think "that is exactly my situation."

Headline (TR): "Her gün aynı soru: 'Bu işlemde son durum ne?'"
Subhead (TR): "Cevap bir yerde var — birkaç email'de, bir WhatsApp mesajında, bir PDF'te. ORTAQ hepsini tek bir işlem kaydında tutar. Artık aramak yok."

Headline (EN): "Every day, the same question: 'What's the current status on this?'"
Subhead (EN): "The answer exists — in a few emails, a WhatsApp message, a PDF. ORTAQ keeps it all in one operational record. No more searching."

What must be visible above the fold:
- Headline + subhead
- Two CTAs: "Demoyu talep et" (primary) and "Ürünü gör" (secondary, ghost)
- A single visual that illustrates the recognition moment (see visual concept below)
- NO feature list above the fold
- NO tabs, modules, or product screenshots above the fold
- NO mention of SGS, LC, BL, or other trade acronyms in the hero

**Hero visual concept:**
Two contrasting states in one image. Left: the fragmented state — a representative single question ("Karşı taraf proformayı onayladı mı?") with the answer scattered across 3–4 different source indicators (email thread, a message, a PDF name). Right: the ORTAQ state — the same question answered cleanly in one record with a timestamp and source attribution. This is not a product screenshot. It is a conceptual illustration of the problem/solution contrast.

**CTA logic:**
- Primary: "Demo İsteyin →" — goes to `/demo`
- Secondary: "Ürünü görün →" — goes to `/urun`
- No email capture on homepage. Demo page handles conversion.

---

**SECTION 2 — THE STRUCTURAL PROBLEM: Why email, WhatsApp, and shared drives fail for this**

Goal: Establish that the problem is structural, not a discipline failure. This removes blame from the visitor and creates receptivity to a systematic solution.

Headline (TR): "Bilgi var. Ama hiç kimse hepsini okuyamıyor."
Headline (EN): "The information exists. Nobody reads all of it."

Content:
This section does not list ORTAQ features. It describes the structural problem. It names the specific tools that B2B operations teams currently use and explains why they fail operationally — not because they are bad tools, but because they were designed for a different job.

Format: 3 short paired statements. Each one names a tool and what it misses.

- "Email iletişimi saklıyor. Operasyonu anlamıyor."
- "WhatsApp hızlı. Ama kaybolup gidiyor."
- "Shared drive belgeleri tutuyor. Hangisinin güncel olduğunu söylemiyor."

Each statement: one sentence, no icons, no arrows, no product screenshots.

Closing line: "Operasyonel bilgi bu araçlara dağıldığında, gerçek durumu her gün yeniden inşa etmek zorunda kalırsınız."

**What this section does NOT do:**
- Does not introduce ORTAQ features yet
- Does not list competing products as enemies
- Does not suggest AI analysis or automation

---

**SECTION 3 — THE ORTAQ CONCEPT: Operational memory**

Goal: Introduce ORTAQ — but through what it is, not what it has.

Headline (TR): "İki taraf. Tek kayıt. Her şey yerli yerinde."
Headline (EN): "Two parties. One record. Everything in its place."

Content:
ORTAQ creates one shared operational record for both you and your counterparty. Every document, commitment, approval, and message belongs to the operation it came from. Both parties see the same reality. The reconstruction stops.

This section introduces the concept of "operational memory" without using the term explicitly. The concept is shown through 3 specific capabilities stated as outcomes, not features:

1. "İki taraf da aynı belgeyi görüyor — hangi sürümün güncel olduğunu sormanıza gerek kalmıyor."
2. "Her onay kayıt altında — kimin, ne zaman, hangi belgeye onay verdiği değişmez biçimde saklanıyor."
3. "Sıra kimde, açıkça görünüyor — ekibinizin mi, karşı tarafın mı."

**Visual concept:**
A clean, simple representation of one operational record shared between two entities (Türk üretici / Alman alıcı). Show the record structure — not a full product screenshot, but the key elements: deal name, parties, document list with a "görülebilir" status, one approval with timestamp. No mock UI chrome. Just the structural concept.

**What this section does NOT do:**
- Does not claim AI analysis
- Does not list 8 product modules
- Does not use the term "tek kayıt" as a product tagline yet (it belongs in detail pages)

---

**SECTION 4 — THE SCENARIOS: The recognition moment made specific**

Goal: Make the abstract concrete with specific operational situations the ICP immediately recognizes.

Headline (TR): "Hangi durumda ORTAQ fark yaratır?"
Headline (EN): "When does ORTAQ make a difference?"

Content: 3 specific scenario snapshots. Each is a one-paragraph story: the situation, the problem in the current state, the resolution with ORTAQ.

Select from existing scenarios, but rewrite for homepage length. Recommended three:
1. Belge versiyonu tartışması (which contract version is current?)
2. Karşı tarafın onayı beklenirken yanıt yok (buyer hasn't responded — did they even see it?)
3. Sabah durumu (executive morning briefing — what's happening across 6 active deals?)

Each scenario: 40–60 words maximum. No bullet points. Narrative prose.

Below the scenarios: "15 senaryonun tamamını görün →" → `/senaryolar`

**What this section does NOT do:**
- Does not use the chaos visual here (it belongs in the scenarios page)
- Does not repeat the feature list
- Does not show any product UI screenshots

---

**SECTION 5 — WHO IS IT FOR: Confirm or disqualify**

Goal: Give the visitor confidence that ORTAQ is or is not for them — specifically and honestly.

Headline (TR): "ORTAQ kimin için doğru?"
Headline (EN): "Is ORTAQ right for your team?"

Content: Two columns.

Left column — ORTAQ FIT:
- Birden fazla aktif B2B ilişkisini yönetenler
- Sözleşme, belge ve onayları email'de takip edenler
- Karşı tarafla aynı gerçeği görmek isteyenler
- Operasyonel durumu sabah yeniden inşa etmek istemeyenler

Right column — NOT A FIT:
- Tek seferlik işlem yapanlar
- İç proje yönetimi arayanlar
- ERP veya lojistik takibi arayanlar
- Otomatik WhatsApp entegrasyonu bekleyenler (bu biz değiliz)

The "not a fit" column is not a weakness. It is a trust-building statement. It signals that ORTAQ will tell visitors honestly in the demo whether it is the right fit for them.

---

**SECTION 6 — CTA: The working session invitation**

Goal: Convert. Frame the demo not as a sales call but as a working session with the visitor's own operations.

Headline (TR): "Bir işleminizi getirin."
Headline (EN): "Bring one active operation."

Subhead (TR): "30 dakikalık bir çalışma seansında kendi operasyonunuzda ORTAQ'ın ne bulduğunu görün. Demo değil, keşif."
Subhead (EN): "In a 30-minute working session, see what ORTAQ finds in your own operation. Not a demo — a discovery."

CTA button: "Seans talep edin →" → `/demo`
Supporting line: "Hazırlık gerekmez. Sektör fark etmez."

**What this section does NOT do:**
- Does not ask for email address on the homepage
- Does not offer a "free trial" (there is no product to trial yet)
- Does not list pricing

---

### Homepage CTA Strategy Summary

| Moment | CTA | Destination |
|--------|-----|-------------|
| First fold — not ready | "Ürünü görün" (ghost) | `/urun` |
| First fold — ready | "Demo İsteyin" (primary) | `/demo` |
| After scenarios | "15 senaryonun tamamı" (link) | `/senaryolar` |
| After who-for section | Implicit — they've self-qualified | — |
| Bottom of page | "Seans talep edin" (primary) | `/demo` |

---

## PAGE 2: PRODUCT (`/urun`)

### Purpose
Show the product in enough detail that a qualified visitor understands what they would get — specifically, what a working session with their own data would look like. Create desire, not just curiosity.

### Audience
Visitors who came from the homepage and want to understand the product before deciding to request a demo. These are self-qualified visitors with genuine interest.

### Key Message
"This is what your operation looks like in ORTAQ."

### Narrative Flow

---

**ENTRY — Context setting (not a section, just the page header)**

Before any product tabs: one paragraph that frames the entire product page.

"ORTAQ bir B2B işlemini baştan sona tek bir kayıtta tutar. Bu sayfada her modülü görebilirsiniz — gerçek sektörlerden gerçek operasyonlarla."

This confirms what the visitor is about to see and sets the expectation that examples are illustrative, not live user data.

---

**STRUCTURE — The Input → Understanding → Picture → Capabilities model**

Replace the flat 8-tab layout with a 4-act structure:

**Act 1 — The Operational Record (what gets captured)**
Show the İşlem Özeti module. This is the foundation. One transaction, all parties, all stages, all documents, all communications — in one place. This is "operational memory" made concrete.

**Act 2 — Both Parties, One Reality (the counterparty dimension)**
Show the Karşı Taraf module immediately after. This is the most visually distinct and differentiating capability. A visitor who sees the buyer-view vs. seller-view split understands immediately that this is not just internal software — it creates shared operational reality.

**Act 3 — The Operational Picture (what you know at any moment)**
Show the Portföy module. Multiple active operations, one view. Who is waiting. What's at risk. Where attention is needed. This converts from "one deal" to "my entire operation."

**Act 4 — The Supporting Capabilities (the specifics)**
The remaining 5 modules (Belge Merkezi, İletişim, Onaylar, Denetim İzi, Mobil) presented as supporting detail — accessible via tabs but not the primary narrative. A visitor should be able to understand the product fully after Acts 1–3, and explore further through Act 4.

---

**The guidance strip** (retained from Sprint 2, but reworded)

Above all tabs: "İlk kez mi bakıyorsunuz? Buradan başlayın:" with three ordered pills: "İşlem Özeti → Karşı Taraf → Portföy". This reflects the new Act 1–2–3 structure.

---

**Page-level CTA**

Bottom of page, after all modules: "Kendi işleminizde nasıl göründüğünü görün →" → `/demo`

Do not repeat this CTA multiple times through the page. Once, at the end, after the visitor has seen what they need.

---

### What the product page does NOT do

- Does not claim AI capabilities
- Does not claim integrations that don't exist
- Does not have a feature count ("8 modül") as a selling point — features are not the product
- Does not open with an 8-tab grid with no narrative — this was the original problem

---

## PAGE 3: HOW IT WORKS (`/nasil-calisir`)

### Purpose
Answer the question "how does ORTAQ actually work in practice?" for visitors who understand the value but need to understand the mechanism before committing to a demo. Reduce anxiety about adoption, onboarding, and change management.

### Audience
Operations managers who are interested but not ready. They have a specific unspoken question: "What does the transition actually look like? How do I explain this to my counterparty? How much work is this?"

### Key Message
"Starting is one deal. Not a transformation project."

### Narrative Flow

**Section 1 — The starting point**
You don't implement ORTAQ across your whole operation. You start with one active deal. Open the record, add both parties, upload the current document set. That's the starting point.

**Section 2 — The counterparty joins**
Your counterparty receives an access link — no account creation required for the basic view. They see what they're supposed to see. You control what's shared. The shared record begins.

**Section 3 — The operational record grows**
As the deal progresses, the record grows. Documents are versioned, not replaced. Approvals are timestamped. Communications are attached to the deal. The history is always there.

**Section 4 — The Deal Journey**
*(Relocated here from homepage in Sprint 1 — this is where it belongs.)*
The deal lifecycle visual (Teklif → Müzakere → Sözleşme → Muayene → Sevkiyat → Ödeme) lives here, in the how-it-works context. It is a mechanism explanation, not a value proposition.

**Section 5 — What your team sees**
Show the portfolio view from a "what does the team lead see each morning?" perspective. This completes the mechanism story: individual deals compose into operational awareness.

**CTA:** "Bunu kendi işleminizde deneyin" → `/demo`

---

## PAGE 4: USE CASES (`/kimler-icin` + `/senaryolar` — restructured)

### Current problem
The current site has two separate pages — `/kimler-icin` (6 persona profiles) and `/senaryolar` (15 scenario cards). These overlap in purpose and dilute each other.

### Recommendation
**Merge into a single "Use Cases" architecture with two entry points:**

**Entry Point A — By situation (`/senaryolar` — kept)**
15 specific operational situations. A visitor who has a specific problem can find it here and see exactly how ORTAQ resolves it. The scenario format (problem → chaos → ORTAQ) is strong. Keep the feature discovery boxes (Sprint 3). This page stays as is, with the new positioning applied to copy.

**Entry Point B — By role/industry (`/kimler-icin` — rebuilt)**
Simplify from 6 persona profiles to 3 clean ICP groups. For each: the specific pain they have, the specific question they ask every morning, the specific ORTAQ capability that answers it. Keep it brief. This page's purpose is confirmation, not education.

The two pages are cross-linked: `/kimler-icin` → "İşlem senaryolarını görün →" `/senaryolar` and vice versa.

---

## PAGE 5: WHY ORTAQ (`/neden-ortaq`)

### Purpose
Handle the most common rational objection: "Why can't I just use email and a shared drive?" This page exists for the visitor who is intellectually interested but not yet convinced that a new system is justified.

### Audience
Skeptical but qualified. They have the problem. They're not sure they need ORTAQ to solve it. They're considering "good enough" as the answer.

### Key Message
"Email and shared drives were not designed for this. They will never be."

### Narrative Flow

**Section 1 — What works fine in email**
Acknowledge what email does well. Don't attack email. Email is excellent for communication. The problem is that operations require more than communication — they require a persistent, organized, shared record.

**Section 2 — What email cannot do**
Specific, not generic. "Email cannot tell you which version of the contract both parties accepted." "Email cannot show you whose turn it is to act across 12 active deals." "Email cannot produce an audit trail without someone manually compiling it."

**Section 3 — The cost of reconstruction**
Name the daily cost of the current situation. Not as a made-up statistic — as a named experience. "How many times last month did you or someone on your team spend 30 minutes finding the answer to a question that should have taken 30 seconds?"

**Section 4 — The ORTAQ comparison**
Side-by-side: "With current tools" vs. "With ORTAQ." Not a feature list — specific operational moments. "Finding the current contract version: 15 min of email search vs. 5 seconds." Not fabricated time savings — directionally true operational comparisons.

**Section 5 — The AI direction**
"We're building something further: ORTAQ that doesn't just store the operational record but actively reads it and surfaces what matters. That direction is clear. We're building toward it. The operational memory foundation is what we're delivering today."

**CTA:** "Bunu kendi operasyonunuzda görün" → `/demo`

---

## PAGE 6: PRICING (`/fiyat`)

### Purpose
Remove pricing anxiety. Set honest expectations. Explain the pricing model clearly enough that the visitor understands what they're committing to before the demo.

### Audience
Visitors who are interested but need to understand the commercial model before investing time in a demo. Also: the economic buyer (CFO, CEO) who reviews the page independently.

### Key Message
"One fixed price per company. No traps."

### Narrative Flow

**Section 1 — The pricing model**
Fixed monthly fee per company. Not per user. Not per deal. Not per document. Counterparty access is free. This is the most important pricing statement and should appear immediately.

**Section 2 — What's included**
Clear list. Exactly as currently exists — this content is good. Keep it.

**Section 3 — What's not included**
Keep the current honest exclusions list. This is a trust builder.

**Section 4 — The evaluation process**
"Price is determined at the demo based on company size and deal volume. We will tell you the exact number before you commit to anything. If we're not the right fit, we'll tell you that too."

**Section 5 — The commercial terms**
3-month minimum, then month-by-month. No long-term lock-in after the initial period. 30-day data export on cancellation. Keep all current commitments.

**What changes:** Replace any language that sounds like the product is fully built and live. The pricing page should reflect honest uncertainty about exact scope while being clear about the model.

**CTA:** "Fiyatı görüşmek için demo talep edin" → `/demo`

---

## PAGE 7: TRUST (`/guven`)

### Purpose
Answer the question "should I trust this company with my operational data?" This page exists for the visitor who has decided they want ORTAQ but needs to verify the company is credible before sharing business data.

### Audience
The operations manager who has nearly decided, the IT stakeholder doing due diligence, and the economic buyer checking whether this is a serious company.

### Key Message
"Small team. Big honesty. Here's exactly what we can and cannot do."

### Narrative Flow

Keep the existing `/guven` structure — it is unusually good. The major change is updating it to reflect the new positioning.

**Section 1 — Why ORTAQ exists**
Update the "why" from "we needed this in our own trade operations" to something that aligns with the operational memory positioning. The founding insight should be: "we watched teams reconstruct reality every day from fragmented tools, and decided to build the system that was missing."

**Section 2 — Who it's for / not for**
Keep current structure. Update language to reflect new positioning.

**Section 3 — What ORTAQ does and doesn't do**
Critical update: the "does not do" list must now explicitly include:
- "ORTAQ şu an email veya WhatsApp mesajlarını otomatik olarak okumaz." (currently stated — keep and make more prominent)
- "ORTAQ şu an yapay zekâ ile iletişim analizi yapmıyor." (add this explicitly — covers the AI repositioning risk)
- "Mevcut ürün, veriyi kendiniz giren bir operasyonel kayıt sistemidir." (honest product state)

**Section 4 — Security**
Keep claims that are real commitments. Flag infrastructure claims that require an actual backend to verify. Do not remove them — they are genuine commitments — but ensure the language says "commitments" not "implemented features."

**Section 5 — Commercial reliability**
Keep as is. This is excellent content.

**Section 6 — FAQ**
Merge `/sss` content here. Remove it as a separate page. FAQs belong in context, next to the trust content.

**CTA:** None at the bottom of trust page. Trust page converts by building trust, not by asking for action. The demo CTA lives in the header.

---

## PAGE 8: DEMO (`/demo`)

### Purpose
Convert a qualified, interested visitor into a scheduled working session. As low friction as possible. As clear as possible about what happens next.

### Audience
Visitors who are ready. They understand the product. They want to see it on their own operations.

### Key Message
"Tell us who you are. We'll take it from there."

### Narrative Flow

**Reframe the demo:**
This is not "request a demo." It is "book a working session." The visitor comes with one active deal in mind. The session shows them what ORTAQ looks like with their own data.

**The form:**
Keep the 3-field form (name, company, email). Add one optional field: "Hangi sektörde çalışıyorsunuz?" — this helps ORTAQ prepare the right scenario. Do not add more fields. More fields = fewer conversions.

**After submission:**
Clear confirmation: what happens next, when to expect contact, what to prepare (nothing — just think of one active deal).

**The WhatsApp option:**
Keep the WhatsApp contact option currently on `/demo`. This is a real conversion path and matches how the ICP actually communicates. Place it as an equal alternative, not a secondary one.

**What changes:**
The framing. Not "product demo" but "working session." Not "we'll show you ORTAQ" but "we'll show you what ORTAQ finds in your operation." This shift is not cosmetic — it changes the visitor's expectation of value and self-qualification.

---

## NAVIGATION STRUCTURE

### Primary navigation (header)

| Label (TR) | Label (EN) | Path | Priority |
|-----------|-----------|------|----------|
| Nasıl Çalışır | How It Works | `/nasil-calisir` | Medium |
| Ürün | Product | `/urun` | High |
| Senaryolar | Use Cases | `/senaryolar` | High |
| Fiyatlandırma | Pricing | `/fiyat` | Medium |
| Demo İsteyin | Request Demo | `/demo` | CTA — always visible |

**Removed from primary nav:**
- Kimler İçin (merge into Senaryolar or footer)
- Neden ORTAQ (keep as secondary page, link from footer and FAQ)
- Güven (footer only — visitors who need it will find it)
- SSS (merged into Güven)

### Footer

**Ürün:** Nasıl Çalışır, Ürün Turu, Senaryolar, Fiyatlandırma
**Şirket:** Neden ORTAQ, Güven ve Güvenlik, Ekip, İletişim
**Destek:** Sık Sorulan Sorular, Demo Talebi, destek@ortaq.biz
**Yasal:** Gizlilik Politikası, Kullanım Koşulları

---

## PAGES TO DEPRECATE

The following pages should be removed from public access or set to noindex:

| Page | Action | Reason |
|------|--------|--------|
| `/kesfet` | Noindex + remove from nav | Legacy crowdfunding product — wrong audience |
| `/sirket/[slug]` | Noindex | Legacy fictional dossiers — confusing |
| `/demo/sermaye` | Remove | Capital marketplace prototype — different product |
| `/degerlendirme` | Noindex | Legacy evaluation stages — wrong product |
| `/basla` | Already noindex — confirm | Deprecated onboarding |
| `/alan` | Already noindex — confirm | Legacy watchlist |
| `/sozluk` | Already noindex — confirm | Legacy glossary |
| `/investors` | Keep but separate | Has value for investors, not customers |
| `/corridors` | Keep — useful SEO | Trade corridor pages have search value |
| `/riskler` | Review | Risk disclosure reads as investment risk, not operational risk |

---

## CONTENT THAT SURVIVES THE REBUILD

The following content assets are strong and should be preserved:

1. **The 15 scenario cards** — The best product education content on the site. Keep and upgrade.
2. **The trust page honesty** — Admissions about limits build credibility. Keep all of them, add the AI one.
3. **The trade domain copy** — SGS/LC/BL/SPA examples in product detail. Keep in detail screens, not headlines.
4. **The counterparty split view concept** — The strongest differentiating product visual. Keep on product page.
5. **The portfolio "whose turn" concept** — Genuinely useful and unique. Keep.
6. **The pricing model clarity** — Fixed per company, not per user/deal. Keep and make more prominent.
7. **The "we'll tell you in the demo if you're not a fit" commitment** — Rare and valuable. Keep.
