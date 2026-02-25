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
| **Leads** | **100,000** | Derived from real suppliers above |

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
| `npm run import:generate-leads` | Derived from suppliers | 100K+ B2B leads | Run after supplier imports |
| `npm run import:all` | All of the above | Full pipeline | Deletes non-user-submitted, then imports |

## Run Order

1. `npm run import:all` — runs full pipeline (Companies House → SEC → OpenCorporates → Generate Leads)
2. Or run individually in that order

## Data Provenance

- **Companies House UK** / **SEC EDGAR**: `verified: true`, `registryUrl` links to official registry
- **OpenCorporates**: `verified: true`, `registryUrl` when available
- **user-submitted**: Preserved during `import:all` (not deleted)

## Memory Note

Companies House loads the full CSV into memory. For very large datasets, consider using the split files (part1_7 through part7_7) and processing in chunks.
