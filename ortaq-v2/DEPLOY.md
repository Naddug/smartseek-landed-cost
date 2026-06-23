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

| Variable | Example |
|----------|---------|
| `NEXTAUTH_URL` | `https://ortaq.biz` |
| `NEXTAUTH_SECRET` | (generate with `openssl rand -base64 32`) |
| `DATABASE_URL` | Postgres URL when DB is connected |

> Draft dossiers use in-memory storage on Vercel until `DATABASE_URL` + Prisma migrate are configured.

## Previous site

The white-label operator site (`ortaq-web`) is archived in-repo but no longer served on ortaq.biz.
