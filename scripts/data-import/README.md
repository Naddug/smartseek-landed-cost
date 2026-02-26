# SmartSeek Real Data Import Pipeline

Replaces fake/AI-generated supplier and lead data with **real company data** from free government and public sources.

**Important:** The current `npm run seed:100k` creates **FAKE** suppliers (realistic names, not real companies). For real data, run `npm run import:all` instead.

**We do NOT use Alibaba or scraped data** — see [DATA_INTEGRITY.md](../../docs/DATA_INTEGRITY.md).

## Expected Counts After import:all

| Source | Suppliers | Notes |
|--------|-----------|-------|
| Companies House UK | 500,000 | From ~5M UK companies (filtered by SIC) |
| SEC EDGAR | ~13,000 | All US public companies |
| OpenCorporates | 50,000+ | 20 jurisdictions, paginated |
| Trade.gov | Variable | If API key set |
| **Leads** | **3M+** | Derived from real suppliers |

## Prerequisites

- PostgreSQL database with `DATABASE_URL` set
- For OpenCorporates: `OPENCORPORATES_API_TOKEN` (free at https://opencorporates.com/api_accounts/new)
- For Trade.gov: `TRADE_GOV_API_KEY` (free at https://developer.trade.gov/)
- Companies House: ~468MB download (or set `COMPANIES_HOUSE_ZIP` to use pre-downloaded file)

## Schema Updates

Run before first import:

```bash
npx prisma db push    # Adds registryUrl, registryId, sicCode to Supplier
npm run db:push       # Adds dataSource to Drizzle leads table
```

## Scripts

| Script | Source | Target | Notes |
|--------|--------|--------|-------|
| `npm run import:companies-house` | Companies House UK | 50-80K UK suppliers | Downloads ~468MB ZIP, parses CSV |
| `npm run import:sec-edgar` | SEC EDGAR | 10-13K US public companies | Rate limited 10 req/sec |
| `npm run import:opencorporates` | OpenCorporates API | 5-10K from DE, FR, IN, etc. | Requires API token |
| `npm run import:trade-gov` | Trade.gov ITA | US exporters | Requires API key (free signup) |
| `npm run import:generate-leads` | Derived from suppliers | Up to 3M B2B leads | Real company data only; run after supplier imports |
| `npm run import:pdl` | People Data Labs (Kaggle) | Up to 4.3M registry-verified suppliers | **220+ countries**; set `PDL_TARGET_COUNT` to override |
| `npm run import:check-db` | — | — | Check DB size (Railway Hobby: 5GB limit) |
| `npm run import:all` | All of the above | Full pipeline | Deletes non-user-submitted, then imports |
| `npm run import:all-suppliers` | companies.csv + pdl-companies.csv | Up to 29M+ suppliers | Default target 29M; set `PDL_TARGET_COUNT` to override |
| `npm run import:all-suppliers-29m` | Same as above | 30M suppliers | Full import with `PDL_IMPORT_ALL=true` for all industries |

## People Data Labs (PDL) — 220+ Countries & Territories

**Important: Only ONE CSV file is used at a time.** You choose either:
- **Option A (7M):** [Kaggle](https://www.kaggle.com/datasets/peopledatalabssf/free-7-million-company-dataset) — subset
- **Option B (23.8M):** [PDL](https://www.peopledatalabs.com/company-dataset) — full dataset (includes 7M and more)

Using the 23.8M file gives you everything; no need to run both.

1. Download ONE CSV (Kaggle 7M or PDL 23.8M)
2. Place it at `scripts/data-import/pdl-companies.csv` (or set `PDL_CSV_PATH`)
3. Run: `PDL_TARGET_COUNT=4300000 npm run import:pdl`

**Note:** If the live site shows `ECONNRESET` during import, the DB is overloaded. Stop the import (Ctrl+C). The script now includes a 150ms delay between batches to reduce DB load. Run import during low-traffic hours.

## Run Order

1. `npm run import:all` — runs full pipeline (Companies House → SEC → OpenCorporates → Generate Leads)
2. Or run individually in that order

## Data Provenance

- **Companies House UK** / **SEC EDGAR**: `verified: true`, `registryUrl` links to official registry
- **OpenCorporates**: `verified: true`, `registryUrl` when available
- **user-submitted**: Preserved during `import:all` (not deleted)

## Full 29M+ Supplier Import (companies.csv + pdl-companies.csv)

For broad search coverage (e.g. tin ore, antimony ore, minerals):

1. **companies.csv**: Place at `/Users/harunkaya/Downloads/companies.csv` or set `COMPANIES_CSV_PATH`
2. **pdl-companies.csv**: Download [PDL 23.8M](https://www.peopledatalabs.com/company-dataset) or [Kaggle 7M](https://www.kaggle.com/datasets/peopledatalabssf/free-7-million-company-dataset), place at `scripts/data-import/pdl-companies.csv` or set `PDL_CSV_PATH`
3. Run: `npm run import:all-suppliers-29m`

This imports up to 30M suppliers with `PDL_IMPORT_ALL=true` (all industries). Expect long runtime for large CSVs. Railway DB: ensure sufficient storage.

## Railway Hobby (5GB Limit)

- **DB size**: Run `npm run import:check-db` to see current usage.
- **Suppliers**: Default target 29M. Set `PDL_TARGET_COUNT` to override.
- **Leads**: Generated from real suppliers. Default cap 2.9M. Set `LEADS_TARGET=2900000` to match.

## Leads — Real Data Only

| Source | What's real | What's derived |
|--------|-------------|----------------|
| **Same PDL file** (via generate-leads) | Company name, industry, location, website | Contact email format (`procurement@domain`), job titles |
| **Find Leads search** (AI) | Prompted to use real companies | AI-generated contact details |

The PDL company dataset has **no person names or contact emails**. To get verified contact data, you’d need:

- **PDL Person Dataset** (separate product)
- **Hunter.io** or **Apollo.io** APIs (verified emails)

## Memory Note

Companies House loads the full CSV into memory. For very large datasets, consider using the split files (part1_7 through part7_7) and processing in chunks.
