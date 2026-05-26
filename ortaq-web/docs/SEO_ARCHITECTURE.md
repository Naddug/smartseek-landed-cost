# ORTAQ SEO & Organic Discovery Architecture

Category authority strategy — not campaign microsite SEO.

## 1. Site architecture

```
/                     Hub — brand + entry
/nasil-calisir        Education hub — HowTo schema
/guven                Trust hub — E-E-A-T, transparency
/riskler              Risk hub — loss, limits
/sss                  FAQ hub — FAQPage schema
/sozluk               Glossary — DefinedTermSet
/basla                Beginner onboarding
/sirket/ornek         Illustrative template (no fake Product schema)
/sirket/[slug]        Phase 2 — live campaigns (dynamic sitemap)
/gizlilik, /kullanim  Legal
```

**Hub-and-spoke:** Every cluster links to 2–3 related hubs via `RelatedLinks`.

## 2. Turkish keyword strategy

See `lib/seo/keywords.ts` — clusters:

| Cluster | Hub | Audience |
|---------|-----|----------|
| ortaklik-basics | /nasil-calisir | Curious beginners |
| trust-regulation | /guven | "SPK güvenilir mi" |
| money-safety | /guven | Para endişesi |
| risk-limits | /riskler | Kayıp korkusu |
| comparison | /sss | Alternatif arayan |
| founders | /sss | Şirket sahipleri |
| terminology | /sozluk | Terim bilmeyen |

**Rule:** Keywords inform content and anchors — never stuffed into meta tags.

## 3. Category authority map

ORTAQ owns **paya dayalı ortaklık eğitimi** in Turkey:

1. **Process authority** — /nasil-calisir
2. **Trust authority** — /guven + transparency API feed
3. **Risk authority** — /riskler (regulatory-safe)
4. **Term authority** — /sozluk
5. **Question authority** — /sss

Phase 2: `/rehber/*` long-form guides (real economy stories, not AI blog slop).

## 4. Educational content clusters

| Cluster | Pages now | Phase 2 |
|---------|-----------|---------|
| Süreç | /nasil-calisir, homepage timeline | /rehber/ortaklik-nedir |
| Güven | /guven, /sss | /rehber/spk-ve-kitle-fonlama |
| Para | /sss, /sozluk#emanet | /rehber/emanet-hesabi |
| Risk | /riskler, /sss | /rehber/yillik-limit |
| Dolandırıcılık | /sss#dolandiricilik | /rehber/dolandiricilik-belirtileri |

## 5. Schema strategy

| Page | Schema | Avoid |
|------|--------|-------|
| Global | Organization, WebSite | Fake ratings |
| /nasil-calisir | HowTo, BreadcrumbList | |
| /sss | FAQPage | |
| /sozluk | DefinedTermSet | |
| /guven, /riskler | WebPage, BreadcrumbList | |
| /sirket/ornek | WebPage (illustrative) | Product, Offer, AggregateRating |
| Live campaign | WebPage + factual fields only | Fake funding stats |

Implementation: `lib/seo/schema.ts`, `components/seo/JsonLd.tsx`

## 6. Metadata system

SSOT: `lib/seo/routes.ts` → `buildMetadata()` in `lib/metadata.ts`

Each route: title, description, canonical, OpenGraph, Twitter card, robots (staging noindex).

## 7. Internal linking

`lib/seo/internal-links.ts` + `RelatedLinks` component on hub pages.

Footer: Öğren (süreç, SSS, sözlük) + Güven (güven, riskler).

FAQ answers link to deep pages. Glossary terms cross-link.

## 8. Trust page SEO

- Title: "Güven ve şeffaflık"
- Targets: SPK güvenilir mi, emanet hesabı, şikâyet
- Schema: WebPage + transparency content
- Related: SSS, riskler, nasil-calisir

## 9. Company page SEO

**Example (`/sirket/ornek`):** index with honest "Örnek" title — no fake company schema.

**Live (`/sirket/[slug]`):** Phase 2

- Title: `{Şirket unvanı} | ORTAQ`
- Description from bilgi formu — no invented metrics
- Dynamic sitemap entry when `investorReady`
- noindex until approved

## 10. FAQ architecture

10 questions in `lib/seo/faq.ts` — rendered at `/sss` with FAQPage schema.

Covers: ORTAQ ne, SPK, para yolu, dolandırıcılık, garanti yok, MKK, limit, kripto farkı, şirket başvurusu.

## 11. Glossary architecture

11 terms in `lib/seo/glossary.ts` — `/sozluk` with anchor IDs and DefinedTermSet.

Phase 2: `/sozluk/[term]` only if terms need dedicated long-form.

## 12. Search intent mapping

`lib/seo/intents.ts` maps queries → target paths.

Review quarterly with Google Search Console — add intents from real queries.

---

## Operational rules

1. **No spam** — one primary intent per page
2. **No hype titles** — "Kazanç garantisi" never in titles
3. **Regulatory-safe** — cite process, not promises
4. **Staging noindex** — automatic via `env.isStaging`
5. **Real economy** — future `/rehber` uses documentary photos only
6. **Measure** — Search Console + Plausible (when enabled)

## Code map

```
lib/seo/routes.ts       Route registry + sitemap
lib/seo/keywords.ts     Cluster strategy
lib/seo/intents.ts      Query → page map
lib/seo/faq.ts          FAQ content
lib/seo/glossary.ts     Terms
lib/seo/internal-links.ts Hub linking
lib/seo/schema.ts       JSON-LD builders
components/seo/JsonLd.tsx
components/seo/RelatedLinks.tsx
```

## Phase 2 roadmap

- [ ] `/rehber/*` MDX guides
- [ ] Dynamic `/sirket/[slug]` sitemap
- [ ] `hreflang` if EN content expands
- [ ] Search Console integration in CI sitemap ping
- [ ] Editorial calendar from keyword clusters
