# SmartSeek Deployment Checklist

## Pre-Deployment Verification

### Build & Run
- [x] `npm run build` completes successfully
- [x] `npm start` runs production server (uses `node dist/index.cjs`)
- [x] Client assets built to `dist/public/`
- [x] Server bundled to `dist/index.cjs`

### Environment Variables
Ensure these are set in your deployment environment:
- `DATABASE_URL` - PostgreSQL connection string
- `SESSION_SECRET` - Session encryption key
- `OPENAI_API_KEY` - For AI features (SmartSeek, AI Agent)
- `STRIPE_SECRET_KEY` - For billing (optional)
- `STRIPE_WEBHOOK_SECRET` - For Stripe webhooks (optional)
- `SENDGRID_API_KEY` - For email (optional)
- `REPL_ID` / deployment domain - For CORS and meta tags

### Database
- [ ] Run `npx prisma migrate deploy` (or `prisma db push`) for production
- [ ] Run `npx prisma db seed` for initial data (optional)

### Key Fixes Applied
1. **Trade Data** - Region and time range filters now update all charts, metrics, suppliers, and insights
2. **Export** - Trade Data Export button downloads CSV
3. **Landed Cost** - Now uses protected layout (AppLayout) for consistent UX
4. **UI/UX** - Improved text readability (text-slate-600) across Tools and Trade Data

## Deployment Targets

### Replit
- `.replit` configured with `build` and `run` commands
- Deployment target: `autoscale`
- Build: `npm run build`
- Run: `node ./dist/index.cjs`

### Railway / Vercel / Other
- Set `NODE_ENV=production`
- Use `npm run build` then `npm start`
- Ensure PostgreSQL is provisioned and `DATABASE_URL` is set

## Troubleshooting

### ECONNRESET (DB connection reset)
If deploy logs show `read ECONNRESET` from session store or Stripe:
1. **STRIPE_SKIP_INIT=true** — skips Stripe init (billing disabled)
2. **USE_MEMORY_SESSION=true** — uses in-memory sessions instead of PostgreSQL (sessions reset on deploy; fixes session store ECONNRESET)
3. **DATABASE_URL** — add `?connection_limit=5` to reduce pool size
4. **Railway:** Ensure app and Postgres are in same project; try internal URL `postgres.railway.internal` if available

### Health check
- `GET /api/health` returns `{ ok: true }` — use for deploy verification (no DB required)

## Post-Deployment
- [ ] Verify login/signup flow
- [ ] Test SmartSeek AI report generation
- [ ] Test Trade Data region switching
- [ ] Test Customs Calculator
- [ ] Test Billing/Stripe (if enabled)
