# ORTAQ API

Trust operations backend for ORTAQ.BIZ — verification, fraud signals, complaints, transparency.

Separate from SmartSeek (`server/`).

## Run

```bash
npm install
npm run dev     # http://localhost:4000
curl localhost:4000/health
curl localhost:4000/v1/trust/platform
```

## Deploy (Railway)

1. New Railway service, root directory: `ortaq-api`
2. Set env from `.env.example`
3. Custom domain: `api.ortaq.biz` (staging: `api-staging.ortaq.biz`)

## Public endpoints

| Route | Purpose |
|-------|---------|
| `GET /health` | Liveness |
| `GET /ready` | Readiness |
| `GET /v1/trust/platform` | Platform trust snapshot |
| `GET /v1/trust/transparency` | Accountability feed |
| `GET /v1/trust/campaigns` | Campaign verification summaries |
| `GET /v1/campaigns/:slug` | Single campaign trust state |
| `POST /v1/complaints` | Investor complaint intake |
| `GET /v1/complaints/:publicRef` | Complaint status lookup |

## Admin endpoints (require `x-ortaq-admin-key`)

| Route | Purpose |
|-------|---------|
| `GET /admin/queue` | Ops dashboard summary |
| `GET /admin/audit` | Recent audit events |
| `GET /admin/fraud/signals` | Open fraud queue |
| `POST /admin/fraud/signals/:id/resolve` | Resolve fraud signal |
| `POST /admin/verification/transition` | Enforced state machine |

## Architecture

- Domain types: `../ortaq-shared/src/trust/`
- Ops documentation: `../ortaq-web/docs/TRUST_OPERATIONS.md`
- Postgres schema: `db/schema.sql`

## Phase 2

- PostgreSQL persistence
- Partner webhooks (SPK platform)
- e-Devlet auth
- Document object storage
- Admin reviewer UI
