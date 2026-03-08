# Fixes to Apply

Copy these files over your project to apply all fixes.

## 1. package.json
- **Fix:** `@types/node`: `"20.19.0"` (pinned, no `^`)
- **Copy:** Replace root `package.json` with `package.json` from this folder

## 2. tsconfig.json
- **Fix:** `moduleResolution`: `"node"` (was `"bundler"`)
- **Copy:** Replace root `tsconfig.json` with `tsconfig.json` from this folder

## 3. server/index.ts
- **Fixes:**
  - Rate limiter: skip `/api/auth`, `/api/health`, `/api/stripe/webhook`
  - Removed Replit webhook URL setup (REPLIT_DOMAINS block)
  - Removed `throw err` from error handler
  - Removed duplicate `ensureReportsTable` call
- **Copy:** Replace `server/index.ts` with `server-index.ts` from this folder (rename to `index.ts`)

## 4. server/routes.ts
- **Fix:** Supplier search — change `relname = 'Supplier'` to `relname = 'supplier'` (line ~2414)
- **See:** `ROUTES-PATCH.md` for exact find/replace
