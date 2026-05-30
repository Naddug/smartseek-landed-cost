# ORTAQ → Next.js Migration Plan

**Phase 1 complete.** Production target: `ortaq-web/` (Next.js App Router).

Full architecture: [`ortaq-web/docs/ARCHITECTURE.md`](../ortaq-web/docs/ARCHITECTURE.md)

## Status

| Phase | Description | Status |
|-------|-------------|--------|
| Sprint A | Trust realism on Vite | Done |
| Phase 1 | Next scaffold, tokens, layout, routes | **Done** |
| Phase 2a | Visual parity QA | In progress |
| Phase 2b | `/nasil-calisir` page | Planned |
| Phase 2c | `/sirket/[slug]` dynamic | Planned |
| Phase 2d | Legal MDX from `content/legal/` | Planned |
| Phase 3 | Vite deprecation in production | Planned |
| Phase 4 | `(app)/panel` dashboard shell | Future |

## Run both apps

```bash
npm run dev:ortaq       # Vite — http://localhost:5174
npm run dev:ortaq-web   # Next — http://localhost:3001
npm run build:ortaq-web
```

## Route parity

| Vite | Next.js | Migrated |
|------|---------|----------|
| `/` | `/` | Yes |
| `/guven` | `/guven` | Yes |
| `/riskler` | `/riskler` | Yes |
| `/gizlilik` | `/gizlilik` | Yes |
| `/kullanim` | `/kullanim` | Yes |
| `/sirket/ornek` | `/sirket/ornek` | Yes |
| `/basla` | `/basla` | Yes |
| — | `/sitemap.xml`, `/robots.txt` | Yes (new) |
| — | `/nasil-calisir` | Phase 2b |
| — | `/sirket/[slug]` | Phase 2c |

## Cutover checklist

- [x] Next scaffold + token migration
- [x] PublicShell, header, footer
- [x] All Vite routes ported
- [x] Per-route metadata + sitemap
- [ ] Visual parity sign-off
- [ ] Lighthouse mobile ≥ 90
- [ ] Production deploy on Next only

## Do not migrate yet

Auth, MKK integration, live campaign API, dashboard, payments.
