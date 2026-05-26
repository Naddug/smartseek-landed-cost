# SmartSeek — Multilingual System Audit (Phase 1, AUDIT-ONLY)

Branch: `staging/predeploy-final`
Repo: `/Users/harunkaya/Downloads/Smart-sourcing/`
Scope: Read-only audit. No files modified.

---

## 1. Architecture Map

| Layer | Implementation |
|---|---|
| Frontend stack | Vite + React 18 SPA (client/), client-side routing via `wouter`. **Not Next.js, no SSR, no App Router.** |
| i18n library | `i18next@25.8.13` + `react-i18next@16.5.4` + `i18next-http-backend@3.0.2` + `i18next-browser-languagedetector@8.2.1` |
| Init point | `client/src/lib/i18n.ts` (imported once from `client/src/main.tsx`) |
| Locale files | `client/public/locales/<lng>/translation.json` — **one file per language, single namespace `translation`** |
| Locale detection order | `querystring (?lang=)` → `localStorage("i18nextLng")` → `navigator` → `htmlTag` |
| Fallback | `fallbackLng: "en"` |
| Supported languages | **`en, es, zh, ja, ru, tr`** (the `supportedLngs` whitelist in `i18n.ts`) |
| Disk languages | 71 folders exist under `public/locales/` but only the 6 above are loaded. The other 65 are dead weight. |
| Layouts | `client/src/components/layout/PublicLayout.tsx` (nav + footer for the public site) and `AppLayout.tsx` (logged-in app). |
| Public route mounting | Two patterns coexist: (a) `<PublicPage>` wrapper in `App.tsx`, (b) pages that import `PublicLayout` directly. Both render the same Nav/Footer. Page-level mounting is therefore not the bug. |

Single namespace, HTTP-backend-loaded, fallback to EN — there is nothing wrong with this architecture for this product. The bug is **data**, not architecture.

---

## 2. Root-Cause Analysis

### 2.1 Why other languages stay in English on Nav, Footer, Banner, RFQ, Public Search, Find Leads, Supplier hero, Landed Cost error, and several page sections

`fallbackLng: "en"` is the only thing keeping the UI legible. The reason TR works correctly while ES/ZH/JA/RU do not is **not** an i18n configuration problem — the root cause is **missing keys in the non-TR JSON files**.

Per-language key counts (single flat namespace, dot-literal keys):

| Lang | Flat keys | Missing vs EN | publicNav.* | publicFooter.* | publicBanner.* | rfq.* | landedCost.* |
|---|---:|---:|---:|---:|---:|---:|---:|
| en | 1256 | 0 | 6 | 13 | 3 | 11 | 1 |
| tr | 1256 | 0 | 6 | 13 | 3 | 11 | 1 |
| es | 1206 | **50** | **0** | **0** | **0** | **0** | **0** |
| ru | 1206 | **50** | **0** | **0** | **0** | **0** | **0** |
| zh | 1122 | **134** | **0** | **0** | **0** | **0** | **0** |
| ja | 1037 | **219** | **0** | **0** | **0** | **0** | **0** |

ES, ZH, JA, RU are completely missing the entire `publicNav.*`, `publicFooter.*`, `publicBanner.*`, `rfq.*`, `publicSearch.*`, `findLeads.header.*`, `supplier.hero.subtitle*`, `landedCost.error.cannotCalculate` namespaces. i18next falls back to EN for every one of these strings — exactly the user-visible symptom ("Nav links and some sections remain English").

ZH additionally lacks ~80 more keys across `about`, `becomeSupplier`, `contact`, `methodologyPage`, `pricing`, `verificationPage`.
JA additionally lacks ~165 more keys including `common.*` (Back/Close/Confirm/Edit/Filter/Next/etc.), `category.*` (42 keys), `nav.app.*`, `supplier.*`, `trustPage.*`.

### 2.2 Why TR works while EN does not feel "complete" either

TR and EN have identical key sets. TR is the only locale that someone translated to 100% parity with EN. All other locales were partially translated and never closed out.

### 2.3 Key resolution mechanism (verified, not assumed)

The JSON files contain 1256 flat keys with **literal dots** (e.g. `"publicNav.suppliers": "Suppliers"`), not nested objects. i18next's default `keySeparator` is `.` and the option `ignoreJSONStructure` defaults to `true` (v21+), so `t("publicNav.suppliers")` falls through to the flat literal lookup and resolves correctly. **This is working.** No need to touch keySeparator.

### 2.4 Locale propagation

`useTranslation()` is consumed by every public page that renders text (verified via grep). The two exceptions are `pages/SuppliersIndex.tsx` and `pages/SupplierDetailPage.tsx`, which render `<PublicLayout>` but contain no `useTranslation` import — their page bodies are static English. Whether this matters depends on whether they show user-facing copy; needs a content review.

No SSR/CSR hydration path exists (this is a Vite SPA), so there is no SSR-mismatch class of bug.

No Suspense fallback is configured. The first paint may flash the raw key `publicNav.suppliers` for ~50–150 ms while the backend fetch resolves; not the user's reported bug but worth noting.

### 2.5 Hardcoded English in shared layout

`PublicLayout.tsx` has three hardcoded strings inside `<Link>` elements in the footer Company column:
- Line 200: `FAQ` (acronym, arguably fine to leave)
- Line 208: `Privacy` (also rendered via `t("footer.privacy")` on line 216 — inconsistent)
- Line 209: `Terms` (also rendered via `t("footer.terms")` on line 217 — inconsistent)

The same two link labels are translated correctly on lines 216–217 and untranslated on lines 208–209. This is a duplicate-source inconsistency.

`AppLayout.tsx` is clean.

### 2.6 Mobile homepage hero spacing defect (`intelligencefor`)

Visible in the screenshot. **Root cause confirmed in `client/src/pages/Home.tsx` lines 200–204**:

```jsx
<h1 ...>
  {t("home.hero.titleLine1")}        // EN: "Strategic sourcing intelligence"
  <br className="hidden sm:block" /> // hidden on mobile (<640px)
  {t("home.hero.titleLine2")}        // EN: "for industrial procurement teams"
</h1>
```

On viewports `≥ sm` (640px+) the `<br>` is shown and the two segments render as two lines. On mobile the `<br>` is `display:none`, leaving two adjacent JSX text nodes with no separator between them. JSX collapses the inter-node whitespace, producing the concatenation `intelligencefor`. This is a per-locale-safe bug (it will show on every language that uses two title segments) and is unrelated to the missing-keys problem above but should be fixed in the same stabilization PR.

---

## 3. Inventory: Missing Translation Keys (authoritative)

The complete list of keys present in `en/translation.json` and missing from each locale is written to disk by the audit script. Summary by root namespace:

**es — 50 missing**: `publicFooter (13)`, `rfq (11)`, `publicNav (6)`, `publicSearch (8)`, `publicBanner (3)`, `findLeads (4)`, `supplier (4)`, `landedCost (1)`.

**ru — 50 missing**: same set as `es`.

**zh — 134 missing**: above set + `about (12)`, `becomeSupplier (18)`, `contact (6)`, `methodologyPage (8)`, `pricing (23)`, `verificationPage (17)`.

**ja — 219 missing**: above set + `category (42)`, `common (17)`, `nav.app (6)`, `supplier (10 total)`, `trustPage (14)`.

Detailed key lists per language are reproducible from `client/public/locales/` and were enumerated during this audit. The full list is in the chat response and can be regenerated deterministically with a single Python pass.

---

## 4. Hardcoded String Inventory (shared / layout / high-traffic)

Confirmed in `PublicLayout.tsx`:
- `FAQ`, `Privacy`, `Terms` (lines 200, 208, 209). Already have working `t()` keys on lines 216–217 for two of them — straight cleanup.

Page-level hardcoded English (heuristic top offenders, prioritized for public-facing pages):
- `pages/Reports.tsx`, `pages/TradeData.tsx`, `pages/SampleReport.tsx`, `pages/SmartFinder.tsx`, `pages/AIAssistant.tsx`, `pages/AIAgent.tsx`, `pages/CustomsCalculator.tsx`, `pages/Tools.tsx`, `pages/ComplianceCheck.tsx`, `pages/LandedCostCalculator.tsx`, `pages/RiskIntelligence.tsx`, `pages/ShippingEstimator.tsx`, `pages/Signup.tsx`, `pages/ResetPassword.tsx`, `pages/SuppliersIndex.tsx`, `pages/SupplierDetailPage.tsx`.
- These are all **internal/app or non-public-priority pages**. For the fundraising round, the public site is what investors see — fixing the public site (Phase 2a below) restores >95% of the user-visible problem.

---

## 5. Broken Translation Flows (concrete, observable)

1. **Public navigation in ES/RU/ZH/JA** → all five nav items + the Beta Access CTA fall back to EN (`publicNav.*` missing).
2. **Top beta banner in ES/RU/ZH/JA** → "Free during beta · Founding pilot cohort · Request access" stays EN (`publicBanner.*` missing).
3. **Public footer methodology strip + column headers + link labels in ES/RU/ZH/JA** → entire `publicFooter.*` block stays EN.
4. **RFQ submission page header, error toasts, methodology link in ES/RU/ZH/JA** → `rfq.*` block stays EN.
5. **Public Search Results title, subtitle, placeholder, counts, sign-up CTA in ES/RU/ZH/JA** → `publicSearch.*` block stays EN.
6. **Find Leads header in ES/RU/ZH/JA** → `findLeads.header.*` stays EN.
7. **Supplier landing hero subtitle variants in ES/RU/ZH/JA** → `supplier.hero.subtitle*` stay EN.
8. **Landed Cost error toast in ES/RU/ZH/JA** → `landedCost.error.cannotCalculate` stays EN.
9. **About page values/segment cards in ZH/JA** → `about.values.*`, `about.entrepreneurs|procurers|suppliers*` stay EN.
10. **Pricing page beta cohort form in ZH/JA** → 23 form labels stay EN.
11. **Verification page tier descriptions in ZH/JA** → 17 keys stay EN.
12. **Methodology page steps in ZH/JA** → 8 keys stay EN.
13. **Become-a-Supplier form in ZH/JA** → 18 keys stay EN.
14. **Contact page lead-type cards in ZH/JA** → 6 keys stay EN.
15. **Mobile homepage hero (all languages)** → "intelligencefor" / "intelligenciapara" / "情报面向" type concatenation. Cosmetic + investor-visible.
16. **PublicLayout footer Company column** → FAQ/Privacy/Terms hardcoded.

---

## 6. Shared-Component Risk Assessment

| Component | i18n status | Risk |
|---|---|---|
| `PublicLayout` (nav, banner, footer) | Uses `t()` correctly; 3 hardcoded strings | **HIGH** (every public page renders this) |
| `AppLayout` | Clean | Low |
| `LanguageSwitcher` | Switches locales correctly; persists to `localStorage` | Low |
| `NewsletterForm` (inside PublicLayout) | Uses `t()`; depends on `newsletter.*` and `footer.subscribe` — all 6 langs have them | Low |
| `pages/SuppliersIndex.tsx`, `pages/SupplierDetailPage.tsx` | **No `useTranslation` import** — page bodies static EN | Medium — needs content review before deciding |

No component bypasses i18n via custom locale state or shadow contexts. There is no caching layer between detection and `t()` that could go stale.

---

## 7. Recommended Stabilization Strategy (Phase 2 — PENDING APPROVAL)

The goal is investor-grade multilingual consistency without touching architecture. Three ordered sub-phases.

### 7.1 Phase 2a — Data fix (fastest, highest investor impact)

Patch the four incomplete locale files with the exact missing keys, in two waves:

**Wave 1 (50 keys × 4 languages — unblocks public navigation, footer, banner, RFQ, public search, find-leads header, supplier hero, landed-cost toast):**
- es, ru → add 50 keys each
- zh → add the same 50 (the first set of its 134)
- ja → add the same 50 (the first set of its 219)

This single wave eliminates ~all visible English leakage on the public site for every supported language.

**Wave 2 (ZH +84 keys; JA +169 keys — closes parity on About, Pricing, Methodology, Verification, Become-Supplier, Contact, Category, common.*, trustPage, nav.app, supplier).**

All additions go into the existing flat-dotted JSON; no file is restructured. Diffs are append-only.

### 7.2 Phase 2b — Layout cleanup (small)

In `PublicLayout.tsx`:
- Replace the hardcoded `FAQ`, `Privacy`, `Terms` on lines 200/208/209 with `t("nav.faq")` / `t("footer.privacy")` / `t("footer.terms")` (all six locales already have these keys).
- Fix the mobile hero spacing in `pages/Home.tsx` lines 200–204 by replacing the conditionally hidden `<br>` with `<span className="block sm:inline">…</span>` per segment (or inserting `{" "}` before the `<br>`). Recommend the span approach — it makes the line-break deterministic and removes the JSX whitespace-collapsing footgun for every future translation.

### 7.3 Phase 2c — Optional housekeeping (DO NOT bundle into the fundraising-cut PR)

- Remove the 65 unused locale folders from `public/locales/` (dead weight, bundled into the deploy artifact).
- Add `useTranslation` + a small string extraction pass to `SuppliersIndex.tsx` and `SupplierDetailPage.tsx` if a content review finds user-facing English in them.
- Add a CI guard: `client/public/locales/<l>/translation.json` must have the same key set as `en/translation.json`. A 30-line check in `script/build.ts`. Prevents this entire class of regression from re-occurring.

Phases 2a and 2b are safe, additive, and rollback-trivial. Phase 2c should ship after the round.

---

## 8. Implementation Order & Rollback Precautions

Order:
1. Branch off `staging/predeploy-final` into `staging/i18n-stabilize`.
2. **Phase 2a Wave 1** — apply 50-key patches to `es`, `ru`, `zh`, `ja`. Commit per language.
3. **Phase 2b** — PublicLayout hardcoded strings + Home.tsx mobile hero spacing. One commit.
4. **Phase 2a Wave 2** — `zh` (+84) and `ja` (+169) parity closeouts. Commit per language.
5. QA pass: visit `/?lang=es`, `/?lang=ru`, `/?lang=zh`, `/?lang=ja`, `/?lang=tr` on `/`, `/search`, `/rfq`, `/about`, `/pricing`, `/methodology`, `/verification`, `/trust`, `/become-a-supplier`, `/contact` on both desktop and a 375px viewport. Confirm no English leakage and confirm hero on mobile shows correct line break + space.
6. Merge to `staging/predeploy-final`.

Rollback:
- All changes are additive to JSON and trivial JSX edits. Each language's patch is in its own commit and can be reverted independently with no functional impact (the missing keys will simply fall back to EN as they do today).
- The Home.tsx hero change is a 4-line JSX adjustment, revertable in isolation.
- No locale-loading or i18n config changes are proposed in Phase 2, so the runtime behavior for the EN/TR users (the only locales currently complete) cannot be affected.

---

## 9. STOP

Audit complete. Awaiting approval to proceed with **Phase 2a Wave 1 + Phase 2b** as the first execution unit.
