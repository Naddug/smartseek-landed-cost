# ORTAQ v2 — Production (ortaq.biz)

**Live domain:** https://ortaq.biz  
**Vercel project:** `ortaq-web` (monorepo root directory = `ortaq-v2`)

## Deploy

Production deploys from `main` when `ortaq-v2/**` changes.

Manual deploy:

```bash
cd ortaq-v2
npm run build
npx vercel deploy --prod --yes
```

## Vercel settings

| Setting | Value |
|---------|--------|
| Root Directory | `ortaq-v2` |
| Framework | Next.js |
| Node | 20.x |

## Environment variables (Production)

| Variable | Required | Purpose |
|----------|----------|---------|
| `NEXTAUTH_URL` | Yes | `https://ortaq.biz` |
| `NEXTAUTH_SECRET` | Yes | Session signing (`openssl rand -base64 32`) |
| `DATABASE_URL` | For registration/OAuth | Postgres — enables real accounts + profile bootstrap |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Optional | Google sign-in |
| `LINKEDIN_CLIENT_ID` / `LINKEDIN_CLIENT_SECRET` | Optional | LinkedIn sign-in |
| `EMAIL_SERVER` / `EMAIL_FROM` | Optional | Magic link email (requires `DATABASE_URL`) |

> Without `DATABASE_URL`, demo credentials still work (`demo@ortaq.biz` / `demo`). Registration and OAuth persistence require Postgres + `prisma migrate deploy`.

## Previous site

The white-label operator site (`ortaq-web`) is archived in-repo but no longer served on ortaq.biz.
