# DNS setup — action required (GoDaddy)

**Status:** Code + Vercel are ready. **GoDaddy DNS is not configured yet.**

| URL | Current state | Target |
|-----|---------------|--------|
| https://ortaq-web.vercel.app | ✅ Live institutional UI | Production preview |
| https://ortaq.biz | ❌ GoDaddy parking page | Production (after staging QA) |
| https://staging.ortaq.biz | ❌ DNS not found | Staging QA |

---

## Step 1 — Staging first (do this now)

Log in to **GoDaddy → My Products → ortaq.biz → DNS → Manage DNS**

Add **one record**:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| **A** | `staging` | `76.76.21.21` | 600 |

Or if GoDaddy prefers CNAME for subdomains:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| **CNAME** | `staging` | `cname.vercel-dns.com` | 600 |

> Vercel recommends `A staging.ortaq.biz 76.76.21.21` for this project.

Wait 15–60 minutes, then verify:

```bash
cd ortaq-web
node scripts/dns-check.mjs
npm run validate:live:staging
```

### Vercel dashboard (one-time)

1. [Vercel → ortaq-web → Settings → Domains](https://vercel.com/naddugs-projects/ortaq-web/settings/domains)
2. Confirm `staging.ortaq.biz` is listed
3. Assign it to Git branch **`staging/predeploy-final`** (Preview — not Production)
4. Settings → Deployment Protection → allow Preview access for QA (or disable password on Preview)

SSL is automatic once DNS resolves.

---

## Step 2 — Production (only after staging QA passes)

Add apex + www in GoDaddy:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| **A** | `@` | `76.76.21.21` | 600 |
| **CNAME** | `www` | `cname.vercel-dns.com` | 600 |

Remove any GoDaddy **forwarding** or **parking** on `ortaq.biz`.

Verify:

```bash
npm run validate:live:production
npm run audit:production
```

---

## Alternative — Vercel nameservers (simpler long-term)

GoDaddy → Nameservers → Custom:

- `ns1.vercel-dns.com`
- `ns2.vercel-dns.com`

Vercel then manages all records. Current GoDaddy NS: `ns35.domaincontrol.com` / `ns36.domaincontrol.com` (must change).

---

## Environment separation (already configured)

| Vercel env | Branch | `NEXT_PUBLIC_APP_ENV` | `NEXT_PUBLIC_SITE_URL` | robots |
|------------|--------|----------------------|------------------------|--------|
| Preview | `staging/predeploy-final` | `staging` | `https://staging.ortaq.biz` | Disallow all |
| Production | `main` | `production` | `https://ortaq.biz` | Allow + sitemap |

Builds use env-aware commands (`build:staging` / `build:prod`) via `vercel.json`.

---

## Quick reference

```bash
npm run validate:staging      # local staging build
npm run validate:prod           # local production build
node scripts/dns-check.mjs      # DNS propagation
npm run validate:live:staging   # live staging smoke test
npm run audit:staging           # Lighthouse mobile
```
