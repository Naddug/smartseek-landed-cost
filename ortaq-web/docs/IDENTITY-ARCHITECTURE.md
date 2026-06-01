# ORTAQ Identity Architecture Audit

Date: 2026-05-27. Target: 3-layer separation (Market / Product / Investors).

## Layer definitions

| Layer | Route(s) | Job | Trust depth |
|-------|----------|-----|-------------|
| **1 — Market** | `/`, `/kesfet` | "Private company market exists here" | Minimal |
| **2 — Product** | `/sirket/[slug]` | "What is happening inside this company?" | Operational |
| **3 — Investors** | `/investors` | "Is this investable?" | Deep |

## Violations found (pre-sprint)

### Layer 1 — Homepage mixing identities

| Component | Violation | Fix |
|-----------|-----------|-----|
| `DiscoveryHomeView` | Hero explains access/tanışma; `OperatorTrustLine`, `MarketRoleLine` explain ORTAQ | → `MarketHomeView`, strip operator bars |
| `MarketTerminalHero` | `access` + `legal` copy = regulatory/business model on homepage | Hide on homepage render |
| `MarketInfrastructureBar` | ORTAQ role on homepage | Remove from homepage |
| `HomepageContact` | Producer/investor lead form on homepage | Remove from homepage |
| `homeLanding/*`, `GcaSections` | Legacy capital/SPK narrative (not routed from `/` but still in repo) | Keep deprecated; noindex |

### Layer 2 — Profile (dossier) mixing identities

| Component | Violation | Fix |
|-----------|-----------|-----|
| `DossierGrowth` | Uses `c.funding.purpose`, growth/funding table machinery | → `DossierOperations` (bottlenecks only) |
| `lib/campaigns/*` | Internal `campaign` / `funding` types (data layer OK; UI must not surface raise) | UI-only fix this sprint |
| `getCampaignTensionLine` | Fundraising tone in some surfaces | Already avoided on public dossier header |
| `illustrativeCampaignSchema` | SEO name says "campaign" | Low priority rename |

### Layer 3 — Investor content on wrong pages

| Location | Violation | Fix |
|----------|-----------|-----|
| Homepage (all recent variants) | Thesis, team, process, contact | → `/investors` only |
| `/ekip` | Operator + producer CTAs (OK for hires, not pitch) | Keep; link from investors |
| `/nasil-calisir`, `/guven`, `/sss` | Education/trust (not investor deck) | OK as product/legal layer |
| Footer | Heavy regulatory block on every page | OK as site-wide legal; investors page adds depth |
| `seo/keywords.ts` | Crowdfunding keyword clusters | P2 cleanup |
| `/demo/sermaye`, `InvestHero` | Capital demo flows | noindex demo routes |

## Implementation roadmap (ranked by impact)

### P0 — Identity separation (this sprint)

1. ✅ Homepage → `MarketHomeView` (companies → activity → sectors → signals); no ORTAQ bars, no contact form.
2. ✅ `/investors` route with full 9-section investor narrative.
3. ✅ Remove `DossierGrowth` funding surface → operational priorities only.
4. ✅ `/kesfet` stays light catalog (no dark terminal header).

### P1 — Next

- Rename internal `CampaignDetailView` → `CompanyDossierView` (code clarity).
- Scrub `dossier.snapshot.growth` label → "Operasyon odağı".
- `seo/keywords.ts` remove kitle fonlama clusters.
- `RelatedLinks` on dossier: remove `/demo/sermaye`.
- Profile section order: summary → production → export → operations → risks → documents.

### P2 — Later

- Delete or archive `homeLanding`, `GcaSections`, `Invest*` if unused.
- `illustrativeCampaignSchema` → `companyDossierSchema`.
- English locale parity for `investorsPage`.

## Final test checklist

- [ ] Homepage in 10s: companies + movement (no ORTAQ pitch)
- [ ] Profile: industrial dossier, no raise/IRR
- [ ] `/investors`: complete investor FAQ
