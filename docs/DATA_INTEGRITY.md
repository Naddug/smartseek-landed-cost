# SmartSeek Data Integrity Policy

## Our Commitment: 100% Real, Verifiable Data

SmartSeek uses **only real, publicly registered companies** from official government and regulatory sources. We do not use fake, AI-generated, or scraped data.

---

## Why We Don't Use Alibaba or Similar Scraping

### Alibaba
- **No official free API** — Alibaba does not offer a public API for supplier data
- **Scraping violates Terms of Service** — Extracting data via scrapers breaches Alibaba's ToS
- **Legal risk** — Using scraped data exposes us to liability
- **Data quality** — Scraped data can be stale, incomplete, or inaccurate
- **Credibility** — We cannot verify scraped data against official sources

### Our Approach
We use **government registries and official APIs** only:
- **Companies House UK** — Official UK company register (5M+ companies)
- **SEC EDGAR** — US Securities and Exchange Commission (13K+ public companies)
- **OpenCorporates** — Aggregates 200M+ companies from official registers worldwide
- **Trade.gov ITA** — US International Trade Administration exporter database (when API key configured)

---

## Verification Tiers

| Tier | Badge | Meaning |
|------|-------|---------|
| **Registry Verified** | Green badge | Company from Companies House or SEC EDGAR. Every record links to official registry. |
| **Directory Listed** | Blue badge | From OpenCorporates or Trade.gov. Aggregated from official sources. |
| **Contact Verified** | Checkmark | Email/phone comes from official filing (e.g. SEC). |
| **Contact via Registry** | Info | No verified contact; use registry link to find official contact. |

---

## How We Beat Apollo, IndexBox & Others

| Feature | Apollo | IndexBox | SmartSeek |
|---------|--------|----------|-----------|
| **Data source** | Proprietary, scraped/enriched | Aggregated, mixed | 100% government/registry |
| **Verification** | Email accuracy claims | Supplier vetting | Every company → official registry link |
| **Transparency** | Opaque | Partial | Full provenance on every record |
| **Landed cost** | No | No | Yes — integrated |
| **Mining & minerals** | General | General | **Specialized** — antimony, tin, lithium, rare earths |
| **Free tier** | Limited | Limited | Real data from free government APIs |

### Our Differentiators
1. **Registry-first** — Every supplier links to Companies House, SEC EDGAR, or OpenCorporates. Users can verify any company in one click.
2. **No fake contacts** — When we don't have real contact info, we say "Contact via registry" instead of inventing emails.
3. **Sourcing + landed cost** — Combined platform. Competitors separate these.
4. **Mining & critical minerals** — Deep focus on supply chains that matter (batteries, electronics, defense).

---

## Data Sources (Current)

| Source | Type | Records | Contact Verified |
|--------|------|---------|------------------|
| Companies House UK | Government | 50–80K | No (constructed) |
| SEC EDGAR | Government | 10–13K | Yes (from filings) |
| OpenCorporates | Registry aggregator | 5–10K | No |
| Trade.gov ITA | Government | Optional | Varies |

---

## For Developers

- All import scripts are in `scripts/data-import/`
- Set `contactVerified: true` only when contact info comes from the source (e.g. SEC website field)
- Never generate fake personal names; use "Procurement Department" for unknown contacts
- Always set `dataSource` and `registryUrl` for traceability
