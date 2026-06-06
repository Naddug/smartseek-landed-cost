# ORTAQ — Turkey's SME Growth Capital Marketplace
### Final company architecture (built from first principles)

ORTAQ is a multi-instrument financing marketplace for Turkish exporters and manufacturers. One verified company profile is matched to four capital instruments — Purchase Order Financing, Invoice/Receivable Financing, Revenue-Based Financing, and Strategic Equity — with providers competing to fund a stated need. ORTAQ owns the **data and origination layer**; regulated execution happens at licensed partners. The compounding asset is a proprietary, outcome-linked record of Turkish SME performance.

The wedge is debt/working-capital instruments (PO, invoice, RBF), which are high-frequency, legally clean, and generate outcome data fast. Equity is the upside layer, not the base.

---

## 1. Final Business Model

**What ORTAQ is:** the underwriting data + matching + servicing layer that turns a verified exporter's operating reality into the right financing instrument, funded by a competing panel of capital providers.

**What ORTAQ is not:** a company directory, an investor-introduction site, an equity crowdfunding platform, or a lender of its own balance sheet (at least not at launch).

**Demand (SME):** machinery, textiles, food, chemicals, components — exporters with orders/receivables/recurring revenue but collateral-constrained at the bank.

**Supply (Capital):** factoring companies, export/trade financiers, revenue-based financing funds, family offices, strategic investors, acquisition-oriented holdings.

**Core value exchange:** the SME submits one Verified Capital Profile and states a need; ORTAQ normalizes it, routes it to the instruments that fit, and providers bid. ORTAQ compresses the SME's time-to-capital and the provider's cost-to-conviction, and takes a fee on the cleared transaction plus recurring subscriptions.

**Money flow:** ORTAQ never holds investor funds or sells securities. For debt instruments, the licensed provider funds the SME directly; ORTAQ originates, structures, and services. For equity, execution runs through a licensed intermediary; ORTAQ collects a success fee through that partner.

---

## 2. Homepage Architecture

Audience-split, evidence-first, instrument-led. No mystique, no "exclusive access" language.

1. **Category headline** — "Turkish exporters raise growth capital here — purchase-order, invoice, revenue-based, and equity — from providers competing to fund them."
2. **Live proof bar** (real numbers only) — capital facilitated, SMEs funded, providers on panel, median time-to-term-sheet. If a number isn't real, it does not ship.
3. **Two clear doors:**
   - *For Companies:* "One verified profile. Four ways to fund growth. Providers compete on your terms." → CTA: **Build your Capital Profile**.
   - *For Capital Providers:* "Pre-verified, comparable, mandate-matched dealflow — diligence compressed." → CTA: **Request panel access**.
4. **The four instruments**, each one line on the problem it solves (PO → fund the order; Invoice → unlock receivables; RBF → finance against recurring revenue; Equity → structural growth/expansion).
5. **How verification works** — the moat shown as mechanism: source + date + verifier on every datum, tiered.
6. **Operator credibility** — ex-LEGO Group / Petlas / Yiğit Akü team, promoted not buried.
7. **Closing CTA** — committing actions, never "explore."

Bilingual (TR/EN) from the data layer up — international family offices and export financiers are core supply.

---

## 3. User Journeys

**SME (demand):**
1. Submits company once → identity/registry auto-verified (Tier 0).
2. Connects bank/accounting data + customs/export records → normalized into a Capital Profile (Tier 1–2).
3. States a Capital Need (amount, purpose) — instrument-agnostic.
4. ORTAQ routes the need to fitting instruments; matched providers return Instrument Offers.
5. SME compares competing offers, accepts one → execution via licensed provider/partner.
6. Funded. Post-funding performance recorded (Tier 3 outcome data). Profile is portable and reusable for the next round.

**Capital Provider (supply):**
1. Onboards with mandate (instrument type, ticket range, sector, geography).
2. Receives mandate-matched, pre-verified Needs — not raw listings.
3. Submits Instrument Offers; competes on terms.
4. On acceptance, funds (debt) or executes via licensed intermediary (equity).
5. Tracks performance/servicing through ORTAQ; outcome data sharpens future matching.

**ORTAQ (operator, especially early):** concierge underwriting behind the product — manual verification and matching while the model is trained on real outcomes.

---

## 4. Marketplace Mechanics

ORTAQ is a **router and clearing layer**, not a listing board.

- **Object model:** Company → Capital Profile (canonical, versioned data asset) → Capital Need (unit of demand) → Instrument Offer (unit of competing supply) → Deal (matched lifecycle + outcome data) → Capital Provider.
- **Clearing event:** one Need attracts multiple Instrument Offers across instrument types. Competition is the mechanic that makes it a market rather than a directory.
- **Routing logic:** working-capital gap → factoring/invoice; confirmed export order → PO/trade finance; recurring revenue → RBF; structural capex/expansion or succession → equity.
- **Feedback loop:** every funded and unfunded Deal, plus repayment/performance outcomes, trains matching and risk-pricing. Data improves with volume.

---

## 5. Revenue Streams

Stacked, weighted toward recurring and high-frequency:

1. **Transaction take rate** on PO / invoice / RBF originations (provider funds, ORTAQ originates + structures). Core engine — recurring, high-volume, legally clean.
2. **Servicing fees** on funded instruments (monitoring, covenant/repayment tracking). Sticky.
3. **SME SaaS subscription** — maintained Verified Capital Profile, data room, reporting. Predictable ARR, fills the funnel.
4. **Provider access / data subscription** — panel access + structured dealflow and risk analytics.
5. **Equity success fee** — collected via licensed partner. Upside, not base.

The $100M logic is take-rate-on-volume + provider data subscriptions, not introduction fees.

---

## 6. Trust & Verification System

The product *is* verification. No simulated or unaudited data — provenance and outcomes only.

- **Tier 0 — Identity:** trade registry, tax ID, customs exporter status. Automated.
- **Tier 1 — Financial:** ingested bank + accounting data, normalized; clearly labeled "management accounts" vs "independently reviewed."
- **Tier 2 — Operational:** dated, attributed field verification (capacity, shifts, facility) by named ORTAQ staff/accredited partners.
- **Tier 3 — Outcome:** post-funding performance recorded over time — the data that makes Tier 1 predictive and the moat real.

Every datum carries **source + date + verifier**. The SME owns a portable profile they reuse. Trust comes from provenance, never adjectives.

---

## 7. Legal Positioning (minimize SPK exposure)

Principle: own the unregulated valuable layers (data, origination, matching, servicing); push regulated acts to licensed partners.

- **No fund custody:** ORTAQ never holds or pools investor money.
- **No securities sale by ORTAQ:** no public equity offering, no retail crowdfunding — this keeps ORTAQ outside the SPK crowdfunding/intermediary perimeter.
- **Debt instruments (PO/invoice/RBF):** structured as commercial financing/receivables transactions executed by licensed factoring/financing providers; ORTAQ is originator + tech + servicer.
- **Equity:** private placement to qualified investors only, executed through a licensed intermediary; ORTAQ earns a referral/success fee via that partner.
- **Positioning language:** "financing infrastructure and origination layer," not "investment platform." Qualified/institutional supply only; no retail solicitation.

(Boundary should be confirmed with Turkish counsel before launch — but the architecture is designed to keep ORTAQ on the data/origination side of every line.)

---

## 8. MVP Roadmap

Do not build the four-instrument router on day one. Prove one clearing event end-to-end.

**MVP: Invoice/Receivable + PO Financing for a single export sector** (e.g. machinery or textiles).
- Why: urgent, recurring, high-frequency SME pain; legally cleanest (no securities); fast cycle → fast outcome data; a small, namable provider set (factors, export financiers).
- Scope: structured Capital Profile + Tier 0–2 verification (concierge/manual acceptable) + a panel of 3–5 real providers + at least one **real funded transaction with a real take rate**.
- Success metric: **funded volume and time-to-funding** — not signups, not dossier views. One real Deal with outcome data beats a thousand listings.

---

## 9. 12-Month Roadmap

- **Months 0–3:** Build the Capital Profile + verification pipeline for one sector. Sign 3–5 invoice/PO providers. Concierge underwriting. Target: first funded deals.
- **Months 3–6:** Reach repeatable funded volume in invoice/PO. Instrument the outcome-data loop. Add RBF as second instrument. Launch SME subscription. Target: provider competition on the same Need.
- **Months 6–9:** Add a second sector. Introduce equity (qualified-investor, licensed-partner execution) as the upside layer. Launch provider data subscription. Begin training matching/risk model on accumulated outcomes.
- **Months 9–12:** Multi-sector, multi-instrument routing live. Bilingual for international supply. Demonstrable data-driven matching advantage. Position metrics (funded volume, time-to-funding, default/performance data) for a priced raise. Target: category-defining traction narrative.

---

## 10. Why This Wins in Turkey

- **Structural gap:** Turkish SMEs are collateral-constrained and bank-financing-starved exactly when they have orders and receivables to grow against. The pain is real, recurring, and macro-relevant.
- **Export tailwind:** supply-chain shift out of China makes Turkish manufacturers more fundable than they've been in years; financing them is national-priority-aligned (accelerator-friendly).
- **Fragmented supply:** factors, export financiers, RBF funds, and family offices operate in silos with no shared, verified SME data layer — ORTAQ becomes the connective tissue.
- **Multi-instrument fit:** Turkish SME needs are rarely "equity only"; a single-instrument competitor can't serve the real demand. ORTAQ matches the need to the instrument.

---

## 11. Why Competitors Cannot Easily Copy It

- **Proprietary outcome data:** the repayment/performance record accumulates with volume and cannot be scraped or bought. It makes matching and risk-pricing structurally better — a data network effect.
- **Verification supply chain:** field verification + bank/customs ingestion is operationally hard and capital-intensive to stand up — a barrier, not a screen.
- **Multi-instrument provider panel + integrations:** switching cost on both sides once flows run through ORTAQ.
- **Standard-setting:** as providers underwrite against ORTAQ's verified profile format, that schema becomes the default definition of a "fundable Turkish SME," pulling new entrants onto the platform.
- **Regulatory posture as moat:** the clean data/origination + licensed-execution split is non-obvious and operationally disciplined to maintain.

A competitor can copy the homepage in a week. They cannot copy three years of outcome data, a live provider panel, and an operating verification pipeline.

---

### The one risk to internalize
Verification is expensive and slow; the SPK execution boundary is narrow; Turkish macro/FX volatility prices into every instrument. If ORTAQ cannot fund and operate the verification supply chain, it collapses back into a directory — the exact trap this design exists to escape. Fund the data layer or don't build the company.
