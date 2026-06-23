# ORTAQ v2

Foundation sprint — Next.js 14 app for the ORTAQ opportunity dossier platform.

## Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS + ORTAQ design tokens
- shadcn/ui (Button)
- Prisma ORM (PostgreSQL-ready)
- NextAuth (skeleton)

## Getting started

```bash
cp .env.example .env
npm install
npx prisma generate
npm run dev
```

## Folder structure

- `app/` — routes (marketing, app panel, onboarding, admin)
- `components/` — layout, marketing, opportunity, profile, shared, ui
- `lib/` — auth, prisma, utils
- `types/` — domain types
- `data/` — temporary mock data
- `prisma/` — database schema
