# ORTAQ Production Infrastructure

Long-term deployment architecture for ORTAQ.BIZ (separate from SmartSeek).

## Repository layout

```
Smart-sourcing/                 # Monorepo (current)
├── ortaq-web/                  # Production public site → Vercel
├── ortaq-api/                  # Future backend → Railway
├── ortaq/                      # Vite sandbox (deprecate after parity)
├── server/                     # SmartSeek only — do not mix with ORTAQ
└── .github/workflows/ortaq-ci.yml
```

**Recommendation:** When ORTAQ team grows, split `ortaq-web` + `ortaq-api` to dedicated repo. Until then, path-filtered CI keeps builds fast.

---

## Environments

| Env | Web URL | API URL | Indexing |
|-----|---------|---------|----------|
| **development** | localhost:3001 | localhost:4000 | noindex |
| **staging** | staging.ortaq.biz | api-staging.ortaq.biz | noindex |
| **production** | ortaq.biz | api.ortaq.biz | index |

### Env vars (web)

See [`ortaq-web/.env.example`](../ortaq-web/.env.example).

| Variable | Scope | Purpose |
|----------|-------|---------|
| `NEXT_PUBLIC_APP_ENV` | Client | development / staging / production |
| `NEXT_PUBLIC_SITE_URL` | Client | Canonical URL, OG, sitemap |
| `NEXT_PUBLIC_API_URL` | Client | Future API base |
| `NEXT_PUBLIC_ANALYTICS_*` | Client | Plausible (off by default) |
| `SENTRY_DSN` | Server | Error monitoring (optional) |

### Env vars (api)

See [`ortaq-api/.env.example`](../ortaq-api/.env.example).

---

## Vercel (ortaq-web)

### Project setup

1. Import GitHub repo
2. **Root Directory:** `ortaq-web`
3. **Framework:** Next.js (auto)
4. **Region:** Frankfurt (`fra1`) — Turkish latency
5. **Node:** 20.x

### Production branch

- `main` → production (`ortaq.biz`)
- `develop` or PR previews → staging previews (`noindex` via `VERCEL_ENV=preview`)

### Vercel env (Production)

```
NEXT_PUBLIC_APP_ENV=production
NEXT_PUBLIC_SITE_URL=https://ortaq.biz
NEXT_PUBLIC_ANALYTICS_ENABLED=false
```

### Vercel env (Preview / Staging)

```
NEXT_PUBLIC_APP_ENV=staging
NEXT_PUBLIC_SITE_URL=https://staging.ortaq.biz
```

### Deploy commands

```bash
cd ortaq-web

# Pre-flight (run before any deploy)
npm run validate:staging    # staging build + noindex checks
npm run validate:prod       # production build + sitemap checks

# After DNS + Vercel deploy
npm run validate:live:staging
npm run validate:live:production
npm run audit:staging       # Lighthouse mobile

# CLI deploy (optional)
npx vercel login
npx vercel link
npx vercel                  # preview → staging branch
npx vercel --prod           # production — only after QA sign-off
```

**Full runbook:** [`docs/GODADDY_VERCEL_SETUP.md`](GODADDY_VERCEL_SETUP.md)

Or push to GitHub with Vercel Git integration.

---

## Railway (ortaq-api)

### Service setup

1. New project → Deploy from repo
2. **Root directory:** `ortaq-api`
3. Uses [`ortaq-api/railway.toml`](../ortaq-api/railway.toml)
4. Health check: `GET /health`

### Domains

- Production: `api.ortaq.biz`
- Staging: `api-staging.ortaq.biz`

### Future services (same project, separate services)

- PostgreSQL (onboarding progress, audit logs, legal consents)
- Redis (session cache, rate limits)

---

## Domain strategy

| Domain | Target | Notes |
|--------|--------|-------|
| `ortaq.biz` | Vercel production | Apex + www redirect to apex |
| `www.ortaq.biz` | 301 → ortaq.biz | Single canonical |
| `staging.ortaq.biz` | Vercel staging | Password protect optional |
| `api.ortaq.biz` | Railway production | CORS: ortaq.biz only |
| `api-staging.ortaq.biz` | Railway staging | CORS: staging.ortaq.biz |

DNS: Vercel for web, CNAME for API to Railway.

---

## CI/CD

Workflow: [`.github/workflows/ortaq-ci.yml`](../../.github/workflows/ortaq-ci.yml)

- **ortaq-web:** `npm ci && npm run build` on push/PR
- **ortaq-api:** `npm ci && npm run check`

### Recommended additions (Phase 2)

- Vercel GitHub integration (auto deploy)
- Railway GitHub integration (auto deploy api)
- Lighthouse CI on `/`, `/guven`, `/riskler` (mobile)
- Sentry release on production deploy

---

## Security

### Headers (Next.js)

Set in [`next.config.ts`](../next.config.ts):

- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Strict-Transport-Security`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` (no camera/mic/geo)

### API

- `helmet` middleware
- CORS restricted to web origin
- Rate limiting before auth (Phase 2)
- No secrets in `NEXT_PUBLIC_*`

### Trust

- No fake analytics or social proof
- Staging/preview: `robots.txt` disallows all

---

## SEO technical

- Per-route `metadata` via `lib/metadata.ts`
- Dynamic [`app/sitemap.ts`](../app/sitemap.ts) (production only)
- Dynamic [`app/robots.ts`](../app/robots.ts) (noindex staging)
- `metadataBase` from `NEXT_PUBLIC_SITE_URL`
- No `AggregateRating` or fake structured data

---

## Analytics

Privacy-first, **disabled by default**.

- Provider: Plausible (recommended) or none
- Enable: `NEXT_PUBLIC_ANALYTICS_ENABLED=true`
- Requires KVKK/cookie review before production enable
- Implementation: `lib/analytics.ts` + `AnalyticsProvider`

---

## Error monitoring

- Hook: [`instrumentation.ts`](../instrumentation.ts)
- Set `SENTRY_DSN` in Vercel when ready
- `@sentry/nextjs` install deferred until ops sign-off

---

## Performance

- `next/font` (Fraunces, DM Sans) — no render-blocking CSS
- Static prerender for all public routes
- Image config: AVIF/WebP, long cache on `/media/*`
- Region: `fra1`
- Mobile-first; avoid heavy client JS on legal pages

### Image optimization (Phase 2)

Migrate `DocumentaryImage` to `next/image` when assets are licensed campaign photos.

---

## Logging

| Layer | Tool | Notes |
|-------|------|-------|
| Web (Vercel) | Vercel Logs | Runtime + build |
| API (Railway) | Railway Logs | stdout JSON later |
| Errors | Sentry | When DSN set |
| Audit (future) | Postgres | Legal consents, onboarding ack |

Structured logging format (api, future):

```json
{"level":"info","service":"ortaq-api","msg":"request","path":"/health"}
```

---

## Backup strategy

| Data | Backup | RPO |
|------|--------|-----|
| Web content | Git | 0 (deploy = state) |
| Locales/copy | Git | 0 |
| Media | Git + CDN cache | commit-based |
| API DB (future) | Railway Postgres daily snapshots | 24h |
| Legal consents (future) | DB + immutable audit table | realtime |

---

## Future compatibility

| System | Location | Phase |
|--------|----------|-------|
| Auth / e-Devlet | `ortaq-api/v1/auth` | 3 |
| Onboarding persistence | `ortaq-api/v1/onboarding` | 2 |
| Campaigns | `ortaq-api/v1/campaigns` + partner API | 3 |
| Trust documents | `ortaq-api/v1/trust` + object storage | 3 |
| Legal workflows | `ortaq-api/v1/legal` + audit log | 3 |

Web stays thin: SSR marketing + client shells. Business logic on API.

---

## Production checklist

- [ ] Vercel project linked, `ortaq-web` root
- [ ] GoDaddy DNS → staging.ortaq.biz verified first ([runbook](GODADDY_VERCEL_SETUP.md))
- [ ] Staging QA passed (mobile, Lighthouse, SEO noindex)
- [ ] `NEXT_PUBLIC_SITE_URL` set per environment
- [ ] Domain `ortaq.biz` on Vercel (after staging sign-off)
- [ ] Staging `noindex` verified (`npm run validate:live:staging`)
- [ ] Production crawl verified (`npm run validate:live:production`)
- [ ] Railway `ortaq-api` health check green
- [ ] CI green on `main`
- [ ] Analytics off until legal review
- [ ] Sentry optional, documented
