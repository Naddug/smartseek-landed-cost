# ORTAQ — Trade Execution OS
## Information Architecture v1.0
Date: 2026-06-06

---

## 1. PRODUCT DEFINITION

ORTAQ is the operating system for cross-border trade execution.

It replaces WhatsApp + Email + Excel + PDF workflows with a single, structured Trade Room per transaction.

**Not:**
- A marketplace
- A supplier directory
- A matching service
- A verification company

**Is:**
- The workflow layer for LOI → SCO → FCO → SPA → Inspection → Shipment → Payment

---

## 2. TARGET USERS

| Role | Pain Point | ORTAQ Solves |
|------|-----------|--------------|
| Commodity trader | Version chaos on SCO/FCO revisions | Single versioned document thread |
| Exporter | Inspection status unknown until too late | Real-time inspection milestone tracking |
| Manufacturer | Buyer LOI buried in email | Structured LOI intake + counter-offer workflow |
| Industrial distributor | Payment terms scattered across DMs | SPA clause library + payment milestone board |
| Trade intermediary | Coordinating 4 parties on WhatsApp | Trade Room with role-based access |

---

## 3. TRADE CORRIDORS

Primary:
- Turkey ↔ ASEAN (Makine, tekstil, kimya → Güneydoğu Asya)
- Turkey ↔ Gulf (Gıda, inşaat malzemeleri, metal → BAE, Suudi Arabistan, Katar)
- Turkey ↔ Europe (Otomotiv yan sanayi, ambalaj → Almanya, Hollanda, İtalya)

---

## 4. CORE WORKFLOW (Trade Room Steps)

```
LOI  →  SCO  →  FCO  →  SPA  →  Inspection  →  Shipment  →  Payment
 │       │       │       │          │               │           │
Offer  Soft    Full   Contract   Third-party     B/L, AWB    LC, TT,
intent offer  offer   signed     inspector      tracking    SWIFT
```

### Step definitions

| Step | Full Name | What Happens |
|------|-----------|--------------|
| LOI | Letter of Intent | Buyer signals intent; product, quantity, delivery terms |
| SCO | Soft Corporate Offer | Seller responds with indicative price + validity |
| FCO | Full Corporate Offer | Binding offer with all commercial terms |
| SPA | Sales & Purchase Agreement | Final contract; both parties sign |
| Inspection | Third-party Inspection | SGS/Intertek/BV milestone; report attached |
| Shipment | Logistics & Shipping | B/L, AWB, packing list, COO, phyto |
| Payment | Settlement | LC, TT, SWIFT confirmation; trade closed |

---

## 5. SITE MAP

### Public Routes (Marketing Layer)

```
/                          Homepage — Trade Execution OS landing
/how-it-works              Workflow walkthrough (step by step)
/corridors                 Geographic coverage overview
/corridors/turkey-asean    Turkey ↔ ASEAN detail page
/corridors/turkey-gulf     Turkey ↔ Gulf detail page
/corridors/turkey-europe   Turkey ↔ Europe detail page
/investors                 Investor due diligence (existing, update)
/ekip                      Team page (existing, keep)
/guven                     Trust & legal (update)
/gizlilik                  Privacy policy (existing)
/kullanim                  Terms of service (existing)
/sss                       FAQ (update)
```

### App Routes (Authenticated Layer — Phase 2)

```
/app                       Dashboard — all active trades
/app/trade/new             Start a new Trade Room
/app/trade/[id]            Individual Trade Room
/app/trade/[id]/loi        LOI step
/app/trade/[id]/sco        SCO step
/app/trade/[id]/fco        FCO step
/app/trade/[id]/spa        SPA step
/app/trade/[id]/inspection Inspection milestone
/app/trade/[id]/shipment   Shipment tracking
/app/trade/[id]/payment    Payment confirmation
/app/contacts              Counterparty directory
/app/settings              Account settings
```

### Deprecated Routes (Phase-out)

```
/kesfet        → redirect to /how-it-works or /corridors
/sirket/[slug] → remove (company discovery model deprecated)
/alan          → remove (watchlist — wrong product model)
/degerlendirme → remove
/riskler       → merge into /guven
/sozluk        → remove
/basla         → remove
/sirketler     → remove
```

---

## 6. NAVIGATION STRUCTURE

### Primary Nav (Public)
```
ORTAQ    |    How It Works    Corridors    [Start a Trade Room]
```

### Primary Nav (Authenticated)
```
ORTAQ    |    Trades    Contacts    [+ New Trade]    [Account]
```

### Footer columns
```
Product                Trust               Company
How It Works           Legal Framework     Team
Corridors              Privacy Policy      Investors
Start a Trade Room     Terms of Use        Contact
```

---

## 7. CONTENT ARCHITECTURE

### Homepage (see wireframe doc)

Priority order:
1. **What it is** — hero headline (3 seconds)
2. **Why it matters** — problem section (anxiety)
3. **How it works** — product section (relief)
4. **Where it works** — corridors (geographic credibility)
5. **Who runs it** — team one-liner (trust)
6. **Start** — final CTA

### /how-it-works
Audience: Skeptical first-time visitor who wants to understand before committing.
Structure:
- Overview of workflow (LOI → Payment)
- Step-by-step expansion of each stage
- Document types explained
- Who does what (roles)
- FAQ

### /corridors
Audience: Trader looking for geographic confidence.
Structure:
- Overview of three corridors
- Per-corridor: typical commodities, average timeline, compliance notes

### /corridors/[slug]
Structure:
- Corridor header (flag, direction, key goods)
- Typical workflow timeline for this route
- Document requirements
- Common friction points
- CTA: Start a Trade Room

---

## 8. DESIGN DIRECTION

### Preserve from existing system
- ortaq-ink / ortaq-cream / ortaq-surface color tokens
- Typography scale (bodySm, caption, h1–h3, label)
- Border radius tokens (ortaq-md, ortaq-sm)
- Container / Section layout patterns

### Replace
- Company discovery UI (cards, feed, sector chips)
- Market activity tape
- Campaign/dossier structure

### New patterns needed
- Workflow timeline component (horizontal step bar)
- Step card (LOI, SCO, etc. — icon + name + status)
- Problem strip (WhatsApp / Email / Excel / PDF chaos illustration)
- Trade Room preview (dashboard mockup in static HTML)
- Corridor card (flag + route + goods list)
- Document milestone row (inspection, B/L, etc.)

---

## 9. NEUROPSYCHOLOGY ANCHORS

| Fear | Page Element That Resolves It |
|------|-------------------------------|
| Document mistakes | Version control visible in Trade Room preview |
| Version confusion | "Single source of truth" framing in hero |
| Inspection delays | Inspection milestone shown as resolved step |
| Shipment uncertainty | Shipment tracking step with status indicator |
| Payment delays | Payment step with LC/TT confirmation badge |
| Communication breakdown | Trade Room chat visible in product section |

---

## 10. METRICS & CREDIBILITY (Rules)

- No fabricated user counts
- No fabricated transaction volumes
- No fake logos
- No fake testimonials
- Allowed: corridor descriptions, document type names, workflow step explanations
- Allowed: real team credentials (LEGO Group, Petlas, Yiğit Akü, ASEAN experience)

---

## 11. PHASE PLAN

**Phase 1 — Marketing Layer (this sprint)**
- Rebuild homepage with Trade OS positioning
- Update /how-it-works
- Add /corridors + 3 corridor pages
- Update nav, footer, /investors, /guven

**Phase 2 — App Layer (next sprint)**
- Trade Room auth shell
- LOI intake form
- Document upload + versioning
- Milestone board

**Phase 3 — Automation**
- Document template library
- Inspection partner integrations
- Payment confirmation webhooks
