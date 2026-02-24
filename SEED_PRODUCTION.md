# Seeding Production Database (100K Suppliers)

This guide explains how to populate your **Railway production database** with 100,000 suppliers.

---

## Option 1: Railway CLI (Recommended)

Uses Railway's environment variables automatically. No need to copy secrets.

### Prerequisites

1. Install Railway CLI: `npm i -g @railway/cli`
2. Log in: `railway login`
3. Link your project: `railway link` (select your SmartSeek project)

### Run the seed

```bash
railway run npx prisma db seed
```

This runs the seed against your production database. Expect **15–30 minutes** for 100K suppliers.

---

## Option 2: Run Locally with Production URL

If you prefer not to use the Railway CLI:

1. **Get your production `DATABASE_URL`**
   - Railway Dashboard → Your project → Variables
   - Copy the `DATABASE_URL` value

2. **Run the seed** (replace with your actual URL):

   ```bash
   DATABASE_URL="postgresql://user:pass@host:port/db?sslmode=require" npx prisma db seed
   ```

   Or use the npm script:

   ```bash
   DATABASE_URL="postgresql://..." npm run seed:100k
   ```

---

## What the seed does

- **Deletes** existing RFQs, leads, and suppliers
- **Inserts** 100,000 suppliers (or `SUPPLIER_COUNT` from env)
- **Distributes** across industries (Electronics, Textiles, Machinery, Mining & Minerals, etc.)
- **Distributes** across countries (China, India, Turkey, Vietnam, etc.)

---

## Custom supplier count

To seed fewer suppliers (e.g. 10K for testing):

```bash
SUPPLIER_COUNT=10000 railway run npx prisma db seed
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `Can't reach database server` | Check `DATABASE_URL` and network access |
| `Connection timeout` | Railway DB may be sleeping; trigger a deploy first |
| `Out of memory` | Seed uses batches of 50; if it still fails, reduce `SUPPLIER_COUNT` |
| Seed runs but count is low | Check logs; Prisma may have hit a batch error |
