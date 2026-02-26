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

### ECONNRESET at startup
If deploy logs show `Failed to initialize Stripe: read ECONNRESET`:
1. **Railway:** Add `STRIPE_SKIP_INIT=true` to Variables — app will start without Stripe (billing disabled)
2. **Or** add `?connection_limit=5` to `DATABASE_URL` to reduce pool size
3. The app retries Stripe init once after 5s; if DB is temporarily unavailable, it may recover

### Health check
- `GET /api/health` returns `{ ok: true }` — use for deploy verification (no DB required)

## Post-Deployment
- [ ] Verify login/signup flow
- [ ] Test SmartSeek AI report generation
- [ ] Test Trade Data region switching
- [ ] Test Customs Calculator
- [ ] Test Billing/Stripe (if enabled)
