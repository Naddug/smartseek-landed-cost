# CURRENT PRODUCT REALITY
## ORTAQ — Honest Audit

*Generated: June 2026. Based on full codebase analysis of `ortaq-web`.*
*Audience: Founders only. This document contains information that should not be published externally.*

---

## EXECUTIVE VERDICT

**ORTAQ today is a high-quality marketing website for a product that is designed but not yet built.**

The website showcases a coherent, well-considered product vision. The mockups are realistic, the copy is honest in several places, and the user experience of the marketing site itself is professional. But the product shown on the website — the working deal management system — does not exist in this repository or any connected backend.

The only production-grade backend capability in the entire codebase is:
> **Lead capture via email** (Resend API, used only on `/demo` form).

Everything else is static UI, editorial content, or prototype code from an earlier product direction.

---

## WHAT ORTAQ CAN GENUINELY DO TODAY

| Capability | Status | Notes |
|------------|--------|-------|
| Accept and route demo requests | **Real** | `/api/demo-request` → Resend email |
| Display TR/EN bilingual content | **Real** | react-i18next, localStorage persistence |
| Render marketing pages | **Real** | 14 active pages, high production quality |

That is the complete list of currently implemented capabilities.

---

## WHAT ORTAQ PARTIALLY DOES TODAY

Nothing. There is no partial implementation of the product features shown on the website. The product mockups are illustrations, not wired UI. There is no backend connected to any product feature.

---

## WHAT IS ROADMAP / VISION

Everything shown on the `/urun` page is vision:

| Feature Shown | Implementation Status |
|---------------|----------------------|
| Deal record (shared transaction hub) | Mockup only — no data layer, no auth, no backend |
| Document center with versioning | Mockup only |
| Deal-threaded messaging | Mockup only |
| Approval workflows | Mockup only |
| Counterparty / buyer view | Mockup only |
| Portfolio view ("whose turn") | Mockup only |
| Audit trail | Mockup only |
| Mobile view | Mockup only |
| PDF/JSON export | Non-functional buttons in mockup |
| Email notifications | Claimed in copy; no notification system |
| Counterparty invitation | Described in FAQ; no invite flow exists |
| User accounts / roles | No auth library, no login, no session management |
| Unlimited deals | No data layer |
| 2FA | Claimed on trust page; not implemented |
| AES-256 encryption | Claimed on trust page; no backend to encrypt |
| EU datacenter hosting | Claimed on trust page; no infrastructure in repo |
| GDPR compliance | Claimed; no data processing to comply |

---

## CRITICAL DISTINCTION: WHAT THE SITE ADMITS

Several pages are unusually honest. This is the company's credibility asset. Do not erase this honesty when rebuilding.

The `/guven` (trust) page explicitly states:
- WhatsApp messages are **not** automatically imported
- No ERP or API integration
- No logistics tracking
- No SOC 2 certification
- No bulk automation
- Mobile experience is not full-featured
- The team is small

The `/fiyat` (pricing) page explicitly states:
- No published price — determined at demo
- ERP integration not included
- API access not yet available

These admissions are genuinely valuable. They are the foundation of trust positioning. A visitor who reads `/guven` comes away with a more accurate expectation than most B2B SaaS products provide.

---

## WHAT DOES NOT EXIST AND IS NOT ADMITTED

The claims that are neither implemented nor disclaimed — these are the dangerous ones:

1. **The implied working product.** The product page shows 8 screens of a detailed, functional-looking application. It implies the product is built and working. It is not. A visitor who requests a demo expecting to see a working product will be surprised.

2. **AI capabilities.** The "ORTAQ understands operations" repositioning direction assumes AI that reads emails, messages, and documents to extract operational intelligence. There is zero AI in the codebase — not even an AI SDK dependency. There is one orphaned component (`CommercialOpsHomeView` / `PlatformModules`) from a previous product direction that lists WhatsApp, Email, and AI integrations — but it is not on any live page and is completely unimplemented.

3. **Security infrastructure.** Frankfurt/Paris datacenters, TLS 1.3, AES-256 at rest, GDPR compliance — all stated as product commitments on the trust page. None are verifiable in this codebase because there is no backend to apply them to.

---

## GHOST PRODUCTS IN THE CODEBASE

The repository contains code from at least three different product eras. This creates confusion and maintenance risk:

### Era 1: Capital marketplace / crowdfunding (Legacy, ~40% of codebase)
- `/kesfet` — Company catalog with 18 simulated investment dossiers
- `/sirket/[slug]` — Individual company pages with "field verification" and export credentials
- `/demo/sermaye` — A capital marketplace prototype using localStorage
- `/basla`, `/alan`, `/degerlendirme` — Onboarding, watchlist, evaluation stages
- `ortaq-api` — Express service with in-memory endpoints for trust scores, complaints, campaigns

This was an earlier product: a structured company discovery and investment-facilitation platform. It is still live and partially indexed.

### Era 2: Current trade transaction record (Active, ~50% of codebase)
- Homepage, `/urun`, `/senaryolar`, `/guven`, `/fiyat`, `/nasil-calisir`, `/demo`
- All product mockups and scenarios

### Era 3: Orphaned alternate positionings (Abandoned, ~10%)
- `CommercialOpsHomeView` — "Commercial Operations Platform" with WhatsApp/Email/AI modules listed
- `TradeHomeView`, `DiscoveryHomeView`, `MarketHomeView` — Alternative homepage experiments
- `TrustDashboardView` — Member education progress (localStorage, no route)
- `UnifiedInbox.tsx` — Rich 3-panel inbox mockup, unimported

These orphaned components represent previous strategic bets that were abandoned. They add to the codebase schizophrenia visible to any developer who opens the project.

---

## THE DEMO REALITY

A visitor who requests a demo today will:

1. Fill out the form on `/demo` (name, company, email)
2. Receive a confirmation email (if Resend is configured)
3. Be contacted for a live call

In that call, what can actually be demonstrated?

- The marketing website itself (live, well-designed)
- The product mockups on `/urun` (static, realistic-looking, but not interactive with real data)
- A walkthrough of the conceptual design

What cannot be demonstrated:
- A working product with their own data
- Real document upload or management
- Real messaging between parties
- Real approval workflows
- Real audit trail
- Any AI analysis of communications

**This is the most critical alignment problem.** Every positioning decision must account for what the demo can actually deliver. Overclaiming in marketing creates demo-to-reality mismatch, which destroys conversion at the moment of highest intent.

---

## WHAT IS ACTUALLY STRONG ABOUT THE CURRENT SITUATION

This is not all bad news. Several things are genuinely strong:

**1. The product design is coherent and well-considered.**
The 8-module structure, the counterparty view concept, the "whose turn" portfolio logic — these are genuinely smart product decisions. The design work done for the mockups would serve well as the functional spec for a real build.

**2. The scenarios are a powerful asset.**
15 detailed scenario cards, each showing a specific operational problem and the ORTAQ resolution, in two languages, with realistic trade data. This is excellent sales and onboarding content. The format (chaos vs. clarity) is effective.

**3. The trust page is unusually honest.**
In a market full of SaaS companies with fake customer logos and fabricated metrics, ORTAQ's trust page says "we're a small team, here's what we can and cannot do, here are the real limits." This is a positioning asset, not a weakness.

**4. The domain expertise is visible.**
The use of real trade terminology (SGS, LC, BL, SPA, FCO, SCO), real trade flows (Türkiye → Hamburg, Dubai, Osaka), and realistic deal structures signals genuine industry knowledge. This builds ICP credibility immediately.

**5. The visual design is production-quality.**
The UI mockups look like a real, premium SaaS product. This is not a Canva mockup — it reads as a working application to a non-technical visitor.

---

## FINAL SUMMARY TABLE

| Category | Reality |
|----------|---------|
| Is ORTAQ a working product? | No. It is a designed, unbuilt product with a marketing website. |
| Are the product mockups accurate? | Conceptually yes. Technically no — they are static illustrations. |
| Does ORTAQ read emails or messages? | No. This capability does not exist anywhere in the codebase. |
| Does ORTAQ use AI? | No. Zero AI libraries or integrations exist. |
| What is the only working backend feature? | Demo request form → email notification via Resend. |
| Is the current positioning correct? | No. "Shared transaction record" undersells the vision and overstates current functionality simultaneously. |
| Is the "AI operational intelligence" repositioning feasible now? | Not as a current capability. Only as a product vision with honest framing. |
| What is the honest best positioning for today? | A shared operational workspace for B2B teams, with AI intelligence as the explicit product direction being built. |
| What should not change in the rebuild? | The honesty. The trade domain credibility. The scenarios. The product design vision. |
