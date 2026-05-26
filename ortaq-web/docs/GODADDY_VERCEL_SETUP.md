# GoDaddy + Vercel — ORTAQ deployment runbook

**Goal:** Staging first at `https://staging.ortaq.biz`, then production at `https://ortaq.biz` — without blind overwrites.

---

## Phase 0 — Preconditions

- [ ] Code on GitHub (`origin` remote)
- [ ] Current branch: `staging/predeploy-final` (or your staging branch)
- [ ] Local baseline passes:

```bash
cd ortaq-web
npm run validate:staging   # staging build + noindex checks
npm run validate:prod      # production build + sitemap checks (do NOT deploy yet)
```

---

## Phase 1 — Vercel project (monorepo)

1. Sign in at [vercel.com](https://vercel.com) → **Add New → Project**
2. Import the GitHub repository
3. **Root Directory:** `ortaq-web` (required — repo is a monorepo)
4. **Framework:** Next.js (auto-detected)
5. **Region:** Frankfurt (`fra1`) — already set in `vercel.json`
6. **Do not deploy production domain yet** — complete staging first

### Environment variables (Vercel dashboard → Settings → Environment Variables)

| Variable | Production | Preview | Development |
|----------|------------|---------|-------------|
| `NEXT_PUBLIC_APP_ENV` | `production` | `staging` | `development` |
| `NEXT_PUBLIC_SITE_URL` | `https://ortaq.biz` | `https://staging.ortaq.biz` | — |
| `NEXT_PUBLIC_ANALYTICS_ENABLED` | `false` | `false` | `false` |

> Preview env applies to all non-production deployments including `staging.ortaq.biz`.

### Branch → deployment mapping

| Branch | Vercel type | Domain |
|--------|-------------|--------|
| `staging/predeploy-final` | Preview | `staging.ortaq.biz` |
| `main` | Production | `ortaq.biz` (add only after QA) |

**Recommended:** In Vercel → Settings → Git → Production Branch, keep `main` but **do not attach `ortaq.biz` until staging QA passes**.

---

## Phase 2 — GoDaddy DNS (staging only first)

Log in to GoDaddy → **My Products → ortaq.biz → DNS**.

### Option A — Vercel nameservers (simplest, recommended)

1. Vercel → Project → Settings → Domains → Add `ortaq.biz`
2. Vercel shows nameservers (e.g. `ns1.vercel-dns.com`, `ns2.vercel-dns.com`)
3. GoDaddy → Nameservers → **Change → Custom** → paste Vercel NS
4. Wait 15 min – 48 h for propagation

Then add domains in Vercel (order matters for QA):

1. `staging.ortaq.biz` → assign to branch `staging/predeploy-final`
2. **Wait for staging QA**
3. `ortaq.biz` (apex) → Production
4. `www.ortaq.biz` → redirect to apex (Vercel offers this when adding www)

### Option B — Keep GoDaddy DNS (manual records)

Add these records in GoDaddy DNS:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| **A** | `@` | `76.76.21.21` | 600 |
| **CNAME** | `www` | `cname.vercel-dns.com` | 600 |
| **CNAME** | `staging` | `cname.vercel-dns.com` | 600 |

Then in Vercel → Domains:

1. Add `staging.ortaq.biz` → verify → assign to `staging/predeploy-final`
2. After QA: add `ortaq.biz` + `www.ortaq.biz`

---

## Phase 3 — SSL

Vercel provisions SSL automatically (Let’s Encrypt) once DNS resolves.

Verify in Vercel → Domains: status **Valid Configuration** + **SSL Issued**.

No manual certificate upload needed on GoDaddy when using Vercel.

---

## Phase 4 — Deploy staging

```bash
# Push staging branch (triggers Vercel Preview deploy)
git push origin staging/predeploy-final
```

Or manual CLI (after `npx vercel login` + `npx vercel link` in `ortaq-web`):

```bash
cd ortaq-web
npx vercel --yes          # preview deploy
```

When `staging.ortaq.biz` resolves, run live checks:

```bash
npm run validate:live:staging
npm run audit:staging     # Lighthouse mobile (requires Chrome)
```

### Staging visual indicator

A **STAGING** banner appears at the top when `NEXT_PUBLIC_APP_ENV=staging`. Confirms you are not on production.

### Staging SEO (intentional)

- `robots.txt` → `Disallow: /`
- Empty sitemap
- `noindex` on all pages

---

## Phase 5 — Staging QA checklist

Run on real devices (iPhone + Android) against `https://staging.ortaq.biz`:

- [ ] CSS fully loaded (cream/ink palette, Inter/DM Sans — not unstyled HTML)
- [ ] Homepage section order intact (Hero → Opportunities → … → CTA → Footer)
- [ ] Mobile carousel does not horizontal-scroll the page
- [ ] All 18 company images unique (no repeated truck placeholders)
- [ ] Dossier sticky nav clears header
- [ ] Favicon + OG image load (`/favicon.svg`, `/opengraph-image`)
- [ ] Turkish OG copy on social preview debugger
- [ ] No console hydration errors
- [ ] Lighthouse mobile: Performance ≥ 80, SEO ≥ 90

---

## Phase 6 — Production promotion (only after staging sign-off)

**Do not skip staging.**

1. Merge `staging/predeploy-final` → `main` via PR
2. Vercel auto-builds Production
3. Attach `ortaq.biz` in Vercel if not already attached
4. Verify:

```bash
npm run validate:live:production
npm run audit:production
```

Production should serve:

- `robots.txt` with `Sitemap: https://ortaq.biz/sitemap.xml`
- Full sitemap (30+ URLs)
- No STAGING banner
- `index` allowed

---

## Phase 7 — Rollback

If production regresses:

1. Vercel → Deployments → find last good deployment → **Promote to Production**
2. Or revert commit on `main` and redeploy

Never force-push `main`.

---

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| Unstyled HTML | Wrong root directory — must be `ortaq-web`. Run `npm run build:clean` locally first. |
| Old cinematic layout | Stale `.next` cache — use `build:clean` / redeploy from fresh commit |
| Double `\| ORTAQ` in title | Set `NEXT_PUBLIC_SITE_URL` per environment |
| Staging indexed by Google | Check `NEXT_PUBLIC_APP_ENV=staging` on Preview env |
| SSL pending | DNS not propagated — wait or verify CNAME/A records |
| www not redirecting | Add `www.ortaq.biz` in Vercel with redirect to apex |

---

## Quick reference

```bash
cd ortaq-web

# Local pre-flight
npm run validate:staging
npm run validate:prod

# After deploy
npm run validate:live:staging
npm run validate:live:production
npm run audit:staging
```

**Production URL:** https://ortaq.biz  
**Staging URL:** https://staging.ortaq.biz
