# ORTAQ Web — Platform Architecture

Next.js App Router production target. Visual parity with `ortaq/` (Vite). No UI redesign.

## Principles

- **Turkish-first:** default locale `tr`, clean URLs (no `/tr` prefix)
- **Trust-first:** SSR for legal/trust pages, honest metadata, no fake structured data
- **Modular:** shared tokens, JSON locales, composable components
- **Incremental:** Vite remains until Next parity verified

---

## Folder architecture

```
ortaq-web/
├── app/                          # Routes (thin server pages + metadata)
│   ├── layout.tsx                # Root: fonts, i18n provider, globals
│   ├── page.tsx                  # Homepage
│   ├── guven/                    # Trust (SSR metadata)
│   ├── riskler/                  # Risks (SSR metadata)
│   ├── gizlilik/                 # Privacy stub
│   ├── kullanim/                 # Terms stub
│   ├── basla/                    # Onboarding shell (client)
│   ├── sirket/ornek/             # Illustrative campaign
│   ├── sirket/[slug]/            # Phase 3: live campaigns
│   ├── nasil-calisir/            # Phase 2b: expanded process
│   ├── (app)/                    # Phase 4: authenticated area
│   │   └── panel/                # Future dashboard (empty shell)
│   ├── robots.ts
│   ├── sitemap.ts
│   └── not-found.tsx
├── components/
│   ├── brand/                    # Logo
│   ├── layout/                   # PublicShell, header, footer
│   ├── home/                     # Homepage sections
│   ├── trust/                    # Trust UI primitives
│   ├── media/                    # DocumentaryImage
│   ├── ui/                       # Button, Section, Card
│   └── views/                    # Page-level client compositions
├── design/
│   ├── tokens.ts                 # Programmatic tokens (SSOT)
│   └── typography.ts             # Composable type classes
├── content/
│   └── legal/                    # Phase 2: MDX/markdown legal bodies
│       ├── tr/
│       └── en/
├── lib/
│   ├── metadata.ts               # SEO + sitemap config
│   ├── media.ts
│   ├── cn.ts
│   └── i18n/
│       ├── config.ts             # i18next init
│       └── provider.tsx          # Client provider
├── locales/
│   ├── tr.json                   # Primary copy
│   └── en.json
└── public/media/                 # Documentary stock images
```

---

## Migration sequence

| Phase | Scope | Status |
|-------|--------|--------|
| **1** | Scaffold, tokens, layout, routes, PublicShell | **Done** |
| **2a** | Visual parity QA vs Vite | Next |
| **2b** | `/nasil-calisir` standalone page | Planned |
| **2c** | `/sirket/[slug]` dynamic + content types | Planned |
| **2d** | Legal content from `content/legal/` | Planned |
| **3** | Deprecate Vite dev in production | Planned |
| **4** | `(app)/panel` dashboard shell | Future |
| **5** | Auth, partner API, MKK | Do not migrate until partner signed |

---

## Design token architecture

**Dual layer (unchanged from Vite):**

1. `design/tokens.ts` — programmatic values (colors, space, type scale)
2. `app/globals.css` `@theme` — Tailwind v4 CSS variables

Rules:
- Copy-only during migration; no color changes
- `TrustStatus` type lives in `components/trust/StatusBadge.tsx`
- Typography composables in `design/typography.ts`

---

## Route strategy

| Route | Rendering | Notes |
|-------|-----------|-------|
| `/` | Server page → client view | Sticky mobile CTA homepage only |
| `/guven`, `/riskler` | Server metadata + client view | SSR trust indexing |
| `/gizlilik`, `/kullanim` | Server metadata + client view | Legal stubs → full MDX later |
| `/basla` | Client | Education gates, no auth |
| `/sirket/ornek` | Server metadata + client view | Illustrative only |
| `/sirket/[slug]` | Dynamic SSR | Live campaigns + API (future) |
| `/nasil-calisir` | Static SSR | Split from homepage anchor |
| `(app)/panel/*` | Protected client | Future dashboard |

Hash anchors (`/#nasil-calisir`) remain on homepage until `/nasil-calisir` ships.

---

## SEO structure

- Per-route `export const metadata` via `lib/metadata.ts` → `buildMetadata(routeKey)`
- `app/sitemap.ts` — all public trust routes
- `app/robots.ts` — allow all, point to sitemap
- `NEXT_PUBLIC_SITE_URL` for canonical URLs
- **No** `AggregateRating`, fake org schema, or investor counts
- `Organization` JSON-LD only after entity registry verified (future)

---

## Metadata system

```typescript
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata("guven");
```

Central registry in `lib/metadata.ts`: title, description, path, Open Graph.

---

## Legal page structure (Phase 2d)

```
content/legal/tr/gizlilik.md
content/legal/tr/kullanim.md
```

Pages load stub from `locales/*.json` now. Full text replaces `p1–p3` after hukuk review via MDX or markdown loader in `lib/content/legal.ts`.

---

## Content architecture

| Layer | Purpose |
|-------|---------|
| `locales/*.json` | UI copy, labels, trust claims |
| `content/legal/` | Long-form legal (future) |
| `lib/content/campaigns.ts` | Campaign page data (future API) |

Campaign type (future):

```typescript
type CampaignPage = {
  slug: string;
  status: "illustrative" | "live" | "closed";
  verification: TrustStatus;
  memorandumUrl?: string;
  fields: { company: string; location: string; activity: string; useOfFunds: string };
};
```

---

## Onboarding architecture (future)

```
app/basla/
  layout.tsx    # Minimal shell, no marketing CTA
  page.tsx      # Step wizard (client)
```

Steps: what ORTAQ is → risk ack → process → partner redirect (disabled until live).

No fake auth, portfolio, or welcome-back states.

---

## Dashboard architecture (future)

```
app/(app)/
  layout.tsx           # Auth gate + minimal app chrome
  panel/
    page.tsx           # Empty state: "Henüz canlı kampanya yok"
    kampanyalar/       # List when API exists
    hesap/             # Profile (partner SSO)
```

Route group `(app)` isolates authenticated shell from public marketing.

---

## i18n

- **Now:** `react-i18next` + client `I18nProvider` (parity with Vite)
- **Later:** optional `next-intl` if locale-prefixed EN routes needed
- Default: `tr`, toggle via header (client cookie in Phase 2)

---

## Performance

- `next/font` for Fraunces + DM Sans (no render-blocking Google CSS)
- Trust pages: static metadata at build time
- Images: plain `<img>` for documentary stock (no optimization theater)
- Mobile: minimal JS on legal pages; homepage sections lazy via route code-splitting

---

## Run

```bash
cd ortaq-web && npm install && npm run dev   # http://localhost:3001
npm run build
```

Root monorepo:

```bash
npm run dev:ortaq-web
npm run build:ortaq-web
```

---

## Vite deprecation

Keep `ortaq/` until:
- [ ] Visual parity signed off
- [ ] All routes migrated
- [ ] SEO verified (sitemap, metadata)
- [ ] Production deploy on Next only
