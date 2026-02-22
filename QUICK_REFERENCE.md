# Quick Reference: Critical Areas & Safe Zones

## 🚫 DO NOT TOUCH (Production-Critical)

| Area | Files | Risk Level |
|------|-------|------------|
| **Authentication** | `server/replit_integrations/auth/*` | 🔴 CRITICAL |
| **Stripe Webhooks** | `server/webhookHandlers.ts`, `server/index.ts:64-87` | 🔴 CRITICAL |
| **Credit System** | `server/storage.ts` (credit methods), `server/routes.ts:340-367` | 🔴 CRITICAL |
| **Database Schema** | `shared/schema.ts` | 🔴 CRITICAL |
| **Build Process** | `script/build.ts`, `server/static.ts` | 🟠 HIGH |
| **Payment Processing** | `server/stripeService.ts`, `server/stripeClient.ts` | 🔴 CRITICAL |

## ✅ SAFE TO SIMPLIFY

| Area | Files | What You Can Do |
|------|-------|-----------------|
| **UI Components** | `client/src/components/ui/*` | Consolidate, remove unused |
| **API Routes** | `server/routes.ts` (1420 lines) | Split into modules |
| **Landing Page** | `client/src/pages/Home.tsx` | Extract sections, simplify |
| **Replit Code** | `server/replit_integrations/*` | Abstract, make optional |
| **Error Handling** | `server/index.ts:146-152` | Improve logging, add tracking |
| **Styling** | `client/src/index.css` | Optimize, remove unused |

## 🧹 Static Assets Current State

```
attached_assets/                    ← Source images (35+ files)
├── generated_images/               ← Screenshots (used in Home.tsx)
└── [user uploads]                  ← Temporary files

client/public/                      ← Public web assets
├── favicon.png                     ← ✅ Keep
├── opengraph.jpg                   ← ✅ Keep
└── attached_assets/                ← ❌ Duplicate, remove
    └── generated_images/           ← ❌ Empty/nested

client/public/images/               ← ❌ Duplicate structure
└── attached_assets/
    └── generated_images/
```

**Current Import Patterns:**
- ✅ `import x from "@assets/..."` (alias) - **Use this**
- ⚠️ `import x from '../public/...'` (relative) - **Standardize**
- ✅ `/opengraph.jpg` (public URL) - **Keep for public assets**

## 🔧 Top 3 Immediate Improvements

### 1. **Environment Variable Validation** (30 min)
- Create `server/config.ts`
- Validate on startup
- **Impact**: Prevents runtime failures

### 2. **Credit System Transactions** (2 hours)
- Wrap credit ops in DB transactions
- **Impact**: Prevents race conditions, double-spending

### 3. **API Route Split** (4 hours)
- Extract `routes/reports.ts`, `routes/billing.ts`
- **Impact**: Easier maintenance, smaller files

## 📁 File Organization Quick Guide

```
✅ TOUCH FREELY:
- client/src/components/ui/        (UI library)
- client/src/pages/                (Page components)
- docs/                            (Documentation)

⚠️ MODIFY CAREFULLY:
- server/routes.ts                  (Split first, then modify)
- client/src/pages/Home.tsx        (Marketing content)

🚫 DO NOT MODIFY WITHOUT TESTING:
- server/replit_integrations/auth/  (Auth system)
- server/webhookHandlers.ts        (Payments)
- shared/schema.ts                 (Database)
- script/build.ts                  (Build process)
```

## 🎯 Static Assets Cleanup Plan

**Phase 1: Code Changes (No File Moves)**
1. Audit all asset references
2. Standardize to `@assets/` alias
3. Remove duplicate imports

**Phase 2: File Cleanup**
4. Delete duplicate nested directories
5. Archive unused files
6. Document asset locations

**Phase 3: Reorganization (Future)**
7. Move files to final locations
8. Update build process if needed

## ⚡ Quick Wins

| Task | Time | Impact |
|------|------|--------|
| Add env var validation | 30 min | 🔴 Prevents crashes |
| Add request ID logging | 1 hour | 🟡 Better debugging |
| Split routes.ts into 3 files | 2 hours | 🟢 Easier navigation |
| Add error handling middleware | 2 hours | 🟡 Consistent errors |
| Document API endpoints | 3 hours | 🟢 Better DX |

## 🚨 Red Flags (Stop & Investigate)

If you see these patterns, **investigate before changing**:

- `req.session.userId` - Session management (auth)
- `storage.spendCredits()` - Credit system (payments)
- `stripe.webhooks.constructEvent()` - Payment verification
- `db.transaction()` - Critical data operations
- `process.env.DATABASE_URL` - Database connection
- `express.raw()` middleware - Stripe webhooks

## 📞 When in Doubt

1. **Check** `MAINTENANCE_GUIDE.md` for detailed analysis
2. **Test** in development environment first
3. **Backup** database before schema changes
4. **Document** your changes
5. **Review** with team before production deploy
