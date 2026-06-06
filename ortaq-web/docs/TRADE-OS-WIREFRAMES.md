# ORTAQ — Trade Execution OS
## Page Wireframes v1.0
Date: 2026-06-06

Legend: [X] = button/CTA, ─── = divider, ░░░ = image/visual zone, │ = column border

---

## PAGE 1 — HOMEPAGE ( / )

```
┌─────────────────────────────────────────────────────────────────────┐
│ NAV                                                                  │
│ ORTAQ                 How It Works    Corridors    [Start a Trade Room] │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│ HERO SECTION                                              bg: white  │
│                                                                      │
│  One Place For Every Trade.                                          │
│                                                                      │
│  Manage offers, contracts, inspections, shipments and payments       │
│  in a single structured workflow.                                    │
│                                                                      │
│  [Start a Trade Room]    [See How It Works]                          │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │ WORKFLOW TIMELINE                                             │   │
│  │                                                               │   │
│  │  ●─────────●─────────●─────────●─────────●─────────●────●   │   │
│  │  LOI       SCO       FCO       SPA    Inspection  Ship  Pay  │   │
│  │  Offer     Soft      Full    Contract  Third-party  B/L  LC  │   │
│  │  Intent    Offer     Offer    Signed    Report    Track  TT  │   │
│  │                                                               │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│ PROBLEM SECTION                                        bg: off-white │
│                                                                      │
│  Stop Running Million-Dollar Trades Through WhatsApp.                │
│                                                                      │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐               │
│  │WhatsApp │  │  Email  │  │  Excel  │  │  PDFs   │               │
│  │         │  │         │  │         │  │         │               │
│  │Messages │  │Threads  │  │Versions │  │Scattered│               │
│  │get lost │  │buried   │  │conflict │  │& unsent │               │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘               │
│                                                                      │
│  When something goes wrong, nobody knows which version is current.  │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│ PRODUCT SECTION — Trade Room                           bg: white     │
│                                                                      │
│  One Trade Room. One Source of Truth.                                │
│                                                                      │
│  Every trade gets its own structured workspace.                      │
│  Counterparties, documents, milestones and messages — all in one     │
│  place.                                                              │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │ TRADE ROOM PREVIEW (UI mockup — static)                       │   │
│  │                                                               │   │
│  │  ┌────────────┐  ┌─────────────────────────────────────┐    │   │
│  │  │ STEPS      │  │ FCO — Full Corporate Offer           │    │   │
│  │  │            │  │                                      │    │   │
│  │  │ ✓ LOI     │  │ Commodity:  Hazelnut kernel, Grade A │    │   │
│  │  │ ✓ SCO     │  │ Quantity:   500 MT                   │    │   │
│  │  │ ● FCO     │  │ Price:      USD 4,250/MT CIF Dubai   │    │   │
│  │  │   SPA     │  │ Validity:   72 hours                 │    │   │
│  │  │   Insp.   │  │                                      │    │   │
│  │  │   Ship    │  │ [Accept FCO]  [Request Revision]     │    │   │
│  │  │   Pay     │  │                                      │    │   │
│  │  └────────────┘  └─────────────────────────────────────┘    │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│ WORKFLOW MODULES                                       bg: off-white │
│                                                                      │
│  Every Step of the Trade. Structured.                                │
│                                                                      │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐           │
│  │  OFFERS   │ │ CONTRACTS │ │INSPECTION │ │ LOGISTICS │           │
│  │           │ │           │ │           │ │           │           │
│  │ LOI       │ │ SPA       │ │ SGS       │ │ B/L       │           │
│  │ SCO       │ │ templates │ │ Intertek  │ │ AWB       │           │
│  │ FCO       │ │ revisions │ │ milestone │ │ tracking  │           │
│  │ counter-  │ │ e-sign    │ │ report    │ │ ETA       │           │
│  │ offers    │ │ archive   │ │ upload    │ │ status    │           │
│  └───────────┘ └───────────┘ └───────────┘ └───────────┘           │
│                                                                      │
│  ┌───────────────────────────────────────────────────┐              │
│  │  PAYMENTS                                          │              │
│  │  LC, TT, SWIFT — Payment milestone confirmation   │              │
│  └───────────────────────────────────────────────────┘              │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│ CORRIDORS SECTION                                      bg: white     │
│                                                                      │
│  Where We Operate.                                                   │
│                                                                      │
│  ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐    │
│  │ Turkey ↔ ASEAN   │ │ Turkey ↔ Gulf    │ │ Turkey ↔ Europe  │    │
│  │                  │ │                  │ │                  │    │
│  │ Makine, tekstil  │ │ Gıda, metal,     │ │ Otomotiv, ambalaj│    │
│  │ kimya, gıda      │ │ inşaat malz.     │ │ tekstil, kimya   │    │
│  │                  │ │                  │ │                  │    │
│  │ [Learn more →]   │ │ [Learn more →]   │ │ [Learn more →]   │    │
│  └──────────────────┘ └──────────────────┘ └──────────────────┘    │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│ FINAL CTA                                              bg: dark      │
│                                                                      │
│  Start your first Trade Room today.                                  │
│                                                                      │
│  [Start a Trade Room]    [Talk to the team →]                        │
│                                                                      │
│  ORTAQ, LEGO Group, Petlas ve Yiğit Akü geçmişine sahip bir ekip    │
│  tarafından yürütülmektedir.                                         │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│ FOOTER                                                               │
│ Product │ Trust │ Company                                            │
│ How It Works │ Legal │ Team                                          │
│ Corridors │ Privacy │ Investors                                       │
│ Start Trade Room │ Terms │ Contact                                    │
└─────────────────────────────────────────────────────────────────────┘
```

---

## PAGE 2 — HOW IT WORKS ( /how-it-works )

```
┌─────────────────────────────────────────────────────────────────────┐
│ HEADER                                                               │
│                                                                      │
│  The Complete Trade Workflow.                                        │
│  Seven steps. One room. Zero version confusion.                      │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│ STEP-BY-STEP EXPANSION                                               │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │ 01 — LOI  Letter of Intent                                    │   │
│  │                                                               │   │
│  │  Buyer submits intent. Commodity, quantity, origin,           │   │
│  │  target price, preferred incoterm.                            │   │
│  │                                                               │   │
│  │  Documents: LOI template / free-form                          │   │
│  │  Typical duration: 24–48h                                     │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  [Same block for SCO / FCO / SPA / Inspection / Shipment / Payment] │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│ ROLES                                                                │
│                                                                      │
│  Buyer  ──────────────────────────────→  Seller                     │
│    │                                        │                       │
│    └── Intermediary / Trade Agent ──────────┘                       │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│ FAQ                                                                  │
│  Is ORTAQ a broker?                                                  │
│  Who owns the documents?                                             │
│  What happens if the trade falls through?                            │
│  Which countries are supported?                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## PAGE 3 — CORRIDORS ( /corridors )

```
┌─────────────────────────────────────────────────────────────────────┐
│ HEADER                                                               │
│  Trade Corridors. Structured by Route.                               │
│  Each corridor has its own compliance requirements, document         │
│  standards and typical trade timelines.                              │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│ CORRIDOR CARDS                                                       │
│                                                                      │
│ ┌──────────────────────────────────────────────────────────────┐    │
│ │ Turkey ↔ ASEAN                                               │    │
│ │ TR → MY, SG, TH, ID, VN                                     │    │
│ │                                                               │    │
│ │ Typical goods: Machinery, chemicals, textiles, hazelnuts     │    │
│ │ Avg. timeline: 45–90 days port-to-port                       │    │
│ │ Key docs: COO (EUR.1), phyto, halal certs where applicable  │    │
│ │ Incoterms: CIF, CFR, FOB                                     │    │
│ │                                                               │    │
│ │ [Open Trade Room for this corridor →]                        │    │
│ └──────────────────────────────────────────────────────────────┘    │
│                                                                      │
│ [Same card for Gulf and Europe]                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## PAGE 4 — CORRIDOR DETAIL ( /corridors/turkey-gulf )

```
┌─────────────────────────────────────────────────────────────────────┐
│ CORRIDOR HEADER                                                      │
│  🇹🇷 Turkey  ↔  🇦🇪🇸🇦🇶🇦 Gulf                                          │
│  Food & agriculture · Construction materials · Steel & metal         │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│ TIMELINE                                                             │
│  LOI ──[2d]── SCO ──[3d]── FCO ──[5d]── SPA ──[7d]── Insp...      │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│ DOCUMENT REQUIREMENTS                                                │
│  Commercial Invoice · Packing List · COO · Halal Cert · Bill of     │
│  Lading · Inspection Certificate (SGS/Intertek) · Letter of Credit  │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│ COMMON FRICTION POINTS                                               │
│  • COO legalization at Turkish Chamber of Commerce                   │
│  • Halal certification lead time for food products                   │
│  • UAE port demurrage if B/L corrections needed                      │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│ CTA                                                                  │
│  [Start a Trade Room for Turkey ↔ Gulf]                              │
└─────────────────────────────────────────────────────────────────────┘
```

---

## PAGE 5 — INVESTORS ( /investors ) — update existing

```
Keep existing 9-section structure but update product description:
- Section 1 (Problem): Same — private manufacturer invisibility is now
  framed as "trade execution chaos" not "company discovery"
- Section 2 (Solution): Trade Room, not company profiles
- Section 3 (Why Now): China+1 + nearshoring creates corridor demand
- Sections 4–9: Keep as is
```

---

## COMPONENT INVENTORY (new components needed)

| Component | Location | Description |
|-----------|----------|-------------|
| `TradeWorkflowTimeline` | homepage hero | Horizontal 7-step visual |
| `ProblemStrip` | homepage | 4-column WhatsApp/Email/Excel/PDF |
| `TradeRoomPreview` | homepage product | Static UI mockup of a Trade Room |
| `WorkflowModuleGrid` | homepage | 5 module cards (Offers, Contracts, etc.) |
| `CorridorCard` | homepage + /corridors | Route card with goods list |
| `StepExpander` | /how-it-works | Accordion per workflow step |
| `CorridorTimeline` | /corridors/[slug] | Route-specific timeline |

---

## OPEN QUESTIONS (resolve before coding)

1. **Language**: Homepage in Turkish or English? Corridor pages Turkish?
   → Recommend: Turkish primary, English toggle as Phase 2

2. **Trade Room CTA**: Does "Start a Trade Room" go to a waitlist form or
   a live auth screen?
   → Recommend: Waitlist/contact form for Phase 1 (no auth yet)

3. **Corridor page URLs**: /corridors/turkey-asean or /koridorlar/turkiye-asya?
   → Recommend: English slugs for SEO

4. **Existing routes**: /kesfet, /sirket/[slug] — redirect or hard-remove?
   → Recommend: 301 redirect /kesfet → /how-it-works, /sirket/* → /

5. **Nav language**: Keep "Şirketlere bak" CTA or replace with "Trade Room başlat"?
   → Replace

---

## IMPLEMENTATION ORDER

### Week 1 — Foundation
1. Update nav + footer (new links, new CTA)
2. Build `TradeWorkflowTimeline` component
3. Build `ProblemStrip` component
4. Rebuild homepage hero with new IA
5. Build `TradeRoomPreview` static component

### Week 2 — Content
6. Build `WorkflowModuleGrid`
7. Build `CorridorCard`
8. Rebuild /how-it-works page
9. Build /corridors overview page
10. Build 3 corridor detail pages

### Week 3 — Polish + Auth Shell
11. Update /investors to Trade OS framing
12. Build Trade Room waitlist/contact form
13. 301 redirects for deprecated routes
14. SEO metadata update for all routes
