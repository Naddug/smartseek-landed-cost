# Deploy ORTAQ to production

**Live:** https://ortaq-web.vercel.app  
**Project:** `naddugs-projects/ortaq-web`  
**Repo:** [Naddug/smartseek-landed-cost](https://github.com/Naddug/smartseek-landed-cost) — app in `ortaq-web/`

## Automatic deploys (Git → Vercel)

Connected to GitHub. Pushes that change `ortaq-web/**` deploy automatically:

| Branch | Vercel target |
|--------|----------------|
| `staging/predeploy-final` | Production |
| `main` | Production |
| Other branches | Preview |

**Monorepo:** Vercel root directory = `ortaq-web` (not repo root).

**CI:** `.github/workflows/ortaq-ci.yml` runs `validate:prod` on push.

## Manual deploy (fallback)

```bash
cd ortaq-web && npm run validate:prod && npx vercel deploy --prod --yes
```

## Connect ortaq.biz

Vercel → ortaq-web → Settings → Domains → Add `ortaq.biz` + `www`

## Validate locally

```bash
cd ortaq-web && npm run validate:prod
```

## DNS (ortaq.biz)

| Type | Name | Value |
|------|------|-------|
| A | @ | 76.76.21.21 |
| CNAME | www | cname.vercel-dns.com |

## Rollback

Vercel → Deployments → Promote previous deployment.
