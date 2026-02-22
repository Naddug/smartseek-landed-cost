# SmartSeek Maintenance Guide

## 🚫 DO NOT TOUCH - Critical Production Code

These areas are **production-critical** and should only be modified with extreme caution and thorough testing:

### **Authentication & Security**
- `server/replit_integrations/auth/emailPasswordAuth.ts` - Core auth logic, session management
- `server/replit_integrations/auth/storage.ts` - User data persistence
- `server/auth/index.ts` - Auth module exports
- `shared/models/auth.ts` - User schema (database structure)
- Session configuration in `emailPasswordAuth.ts` (lines 14-35) - Cookie security settings

**Why**: Breaking auth = users can't log in. Session security changes could expose vulnerabilities.

### **Stripe Integration & Payments**
- `server/webhookHandlers.ts` - Webhook processing (credit fulfillment)
- `server/index.ts` lines 64-87 - Webhook route registration (MUST be before express.json())
- `server/stripeClient.ts` - Stripe client initialization
- `server/stripeService.ts` - Payment processing logic
- Credit transaction logic in `server/routes.ts` (lines 1198-1287, 1290-1375)

**Why**: Payment bugs = lost revenue, double-charging, or credit system corruption.

### **Database Schema**
- `shared/schema.ts` - All table definitions
- `server/db.ts` - Database connection (connection string handling)

**Why**: Schema changes require migrations. Breaking changes = data loss risk.

### **Build & Deployment**
- `script/build.ts` - Production build process
- `server/index.ts` lines 157-162 - Dev vs production routing logic
- `server/static.ts` - Static file serving (production)

**Why**: Breaking builds = deployment failures. Static serving = app won't load.

### **Credit System Core Logic**
- `server/storage.ts` - Credit operations (spendCredits, addTopupCredits, refreshMonthlyCredits)
- Credit deduction checks in `server/routes.ts` (lines 340-367, 549-559, 641-654)

**Why**: Credit bugs = users get free access or can't use paid features.

---

## ✅ SAFE TO SIMPLIFY - Can Refactor Later

These areas can be improved without breaking core functionality:

### **Frontend Components**
- `client/src/components/ui/` - UI component library (55 files)
  - **Safe to**: Consolidate, extract common patterns, remove unused components
  - **Risk**: Low - mostly presentational

- `client/src/pages/` - Page components
  - **Safe to**: Extract shared layouts, consolidate similar pages
  - **Risk**: Low - routing handles separation

### **API Route Organization**
- `server/routes.ts` (1420 lines) - All API routes in one file
  - **Safe to**: Split into modules (`routes/reports.ts`, `routes/billing.ts`, etc.)
  - **Risk**: Low - just organizational, doesn't change behavior

### **Replit-Specific Code**
- `server/replit_integrations/` - Replit platform integrations
  - **Safe to**: Abstract behind interfaces, make optional
  - **Risk**: Low - only affects Replit deployment

- `vite.config.ts` lines 14-24 - Replit-specific plugins
  - **Safe to**: Make conditional, add fallbacks
  - **Risk**: Low - dev-only features

### **Error Handling**
- `server/index.ts` lines 146-152 - Global error handler
  - **Safe to**: Improve logging, add error tracking (Sentry)
  - **Risk**: Low - currently just logs and responds

### **Type Definitions**
- `shared/` - Type definitions
  - **Safe to**: Add stricter types, extract to separate files
  - **Risk**: Low - TypeScript will catch breaking changes

### **UI Styling**
- `client/src/index.css` - Global styles
- Tailwind configuration
  - **Safe to**: Refactor, optimize, remove unused styles
  - **Risk**: Low - visual only

### **Landing Page Content**
- `client/src/pages/Home.tsx` (792 lines)
  - **Safe to**: Extract sections into components, simplify animations
  - **Risk**: Low - marketing content, doesn't affect functionality

---

## 🧹 Static Assets Cleanup Strategy (Conceptual)

### **Current State Analysis**

**Problem Areas:**
1. **Duplicate asset locations:**
   - `attached_assets/` (root) - 35+ files
   - `client/public/attached_assets/` - Empty/nested structure
   - `client/public/images/attached_assets/` - Duplicate nested structure

2. **Mixed import patterns:**
   - `import dashboardImage from '../public/...'` (relative path)
   - `import dashboardScreenshot from "@assets/..."` (alias)
   - Direct references to `/opengraph.jpg` (public URL)

3. **Unclear asset types:**
   - Generated images (screenshots) vs user uploads vs static branding

### **Cleanup Strategy (Without Moving Files Yet)**

#### **Phase 1: Audit & Document**
1. **Create asset inventory:**
   ```
   docs/ASSETS_INVENTORY.md
   - List all files in attached_assets/
   - Categorize: generated_images, user_uploads, branding
   - Document current usage (grep for imports)
   ```

2. **Map current usage:**
   - Search codebase for all asset references
   - Document which files are actually used
   - Identify orphaned files

#### **Phase 2: Standardize Import Patterns**
1. **Establish conventions:**
   - **Generated images** (screenshots): Use `@assets/` alias
   - **Public assets** (favicon, OG images): Use `/` public URLs
   - **User uploads**: Keep in database/blob storage (future)

2. **Create import helper:**
   ```typescript
   // client/src/lib/assets.ts (conceptual)
   export const ASSETS = {
     dashboard: () => import('@assets/generated_images/sourcing_dashboard_analytics_interface.png'),
     report: () => import('@assets/generated_images/sourcing_report_document_preview.png'),
     // Centralized asset references
   }
   ```

#### **Phase 3: Update Vite Config (No File Moves)**
1. **Clarify alias purpose:**
   - Document that `@assets` = development source
   - Ensure build process copies correctly
   - Add validation that required assets exist

2. **Add build-time checks:**
   - Warn if referenced assets are missing
   - Validate asset paths in build script

#### **Phase 4: Consolidate References (Code Changes Only)**
1. **Update all imports to use centralized paths:**
   - Replace relative paths with aliases
   - Use helper functions for dynamic imports
   - Remove duplicate nested directory references

2. **Remove unused assets:**
   - After confirming they're not referenced
   - Move to `archive/` folder first (safety)

#### **Phase 5: Future File Reorganization (Later)**
Only after all code references are updated:
- Move `attached_assets/generated_images/` → `client/src/assets/images/`
- Keep `client/public/` for truly public assets (favicon, OG images)
- Remove duplicate nested directories

### **Key Principles**
- ✅ **Do first**: Update code references, standardize imports
- ✅ **Do second**: Remove unused files, consolidate paths
- ❌ **Do last**: Move files (only after all code updated)
- ✅ **Always**: Test builds after each phase

---

## 🔧 Minimal Maintainability Improvements (Conceptual)

### **1. Environment Variable Validation**

**Concept**: Validate all required env vars on startup, fail fast with clear errors.

**Implementation approach:**
- Create `server/config.ts` that exports validated config object
- Check all required vars before starting server
- Provide helpful error messages with examples

**Files to create:**
- `server/config.ts` - Centralized config validation
- `docs/ENV_VARS.md` - Documentation of all env vars

**Benefits:**
- Prevents runtime failures from missing config
- Clear documentation of requirements
- Type-safe config access

---

### **2. API Route Modularization**

**Concept**: Split `server/routes.ts` (1420 lines) into logical modules.

**Structure:**
```
server/routes/
  ├── index.ts          # Main router, imports all modules
  ├── auth.ts           # Auth endpoints (if not in auth/)
  ├── reports.ts        # Report CRUD
  ├── billing.ts        # Stripe endpoints
  ├── leads.ts          # Lead generation
  ├── calculations.ts   # Customs/shipping calculators
  └── admin.ts          # Admin-only routes
```

**Benefits:**
- Easier to find specific endpoints
- Smaller files = easier code review
- Can test modules independently

**Migration strategy:**
- Extract one module at a time
- Keep old routes.ts as fallback during transition
- Update imports incrementally

---

### **3. Error Handling Middleware**

**Concept**: Centralized error handling with proper logging and user-friendly messages.

**Implementation approach:**
- Create `server/middleware/errorHandler.ts`
- Replace inline try/catch with error classes
- Add request ID tracking for debugging

**Error types:**
- `ValidationError` - 400 with field details
- `AuthenticationError` - 401
- `AuthorizationError` - 403
- `NotFoundError` - 404
- `PaymentError` - 402 (Stripe-specific)
- `InternalError` - 500 (logged, generic message to user)

**Benefits:**
- Consistent error responses
- Better debugging with request IDs
- Security: don't leak internal errors

---

### **4. Credit System Transaction Wrapper**

**Concept**: Wrap all credit operations in transactions to prevent race conditions.

**Implementation approach:**
- Create `server/services/creditService.ts`
- All credit checks + deductions in single transaction
- Use database-level locking for critical sections

**Current problem:**
```typescript
// Check credits (separate query)
const totalCredits = (profile?.monthlyCredits || 0) + (profile?.topupCredits || 0);
if (totalCredits < 1) return error;

// Deduct credits (separate query) - RACE CONDITION RISK
await storage.spendCredits(userId, 1, "Report");
```

**Improved approach:**
```typescript
// Single atomic operation
const success = await creditService.spendCreditsAtomically(userId, 1, "Report");
if (!success) return error;
```

**Benefits:**
- Prevents double-spending
- Ensures data consistency
- Simpler error handling

---

### **5. Request Validation Layer**

**Concept**: Centralized request validation using Zod schemas.

**Implementation approach:**
- Create `server/middleware/validate.ts`
- Define request schemas alongside routes
- Auto-generate error messages

**Example:**
```typescript
// Instead of inline validation
app.post("/api/reports", validate(createReportSchema), async (req, res) => {
  // req.body is already validated and typed
});
```

**Benefits:**
- Consistent validation
- Type safety
- Less boilerplate

---

### **6. Database Query Helpers**

**Concept**: Extract common query patterns into reusable functions.

**Implementation approach:**
- Create `server/db/queries.ts`
- Functions like `getUserWithProfile(userId)`, `getUserCredits(userId)`
- Reduces code duplication in routes

**Benefits:**
- DRY principle
- Easier to optimize queries
- Consistent data access patterns

---

### **7. Logging & Monitoring Setup**

**Concept**: Structured logging with request context.

**Implementation approach:**
- Replace `console.log` with structured logger
- Add request ID to all logs
- Log levels: error, warn, info, debug
- Consider adding Sentry/DataDog later

**Benefits:**
- Easier debugging in production
- Can filter/search logs
- Performance monitoring

---

### **8. Type Safety Improvements**

**Concept**: Stricter TypeScript, shared types between frontend/backend.

**Implementation approach:**
- Move API response types to `shared/types/api.ts`
- Use branded types for IDs (UserId, ReportId)
- Add runtime validation with Zod for API boundaries

**Benefits:**
- Catch errors at compile time
- Better IDE autocomplete
- Self-documenting APIs

---

### **9. Testing Infrastructure (Foundation)**

**Concept**: Set up testing framework, even if tests added gradually.

**Implementation approach:**
- Add Vitest for unit tests
- Add Playwright for E2E tests
- Create test utilities (mock auth, mock Stripe)

**Benefits:**
- Can add tests incrementally
- Prevents regressions
- Documents expected behavior

---

### **10. Documentation Structure**

**Concept**: Centralized documentation for onboarding and maintenance.

**Structure:**
```
docs/
  ├── ARCHITECTURE.md        # System overview
  ├── API.md                 # API documentation
  ├── DEPLOYMENT.md          # Deployment process
  ├── ENV_VARS.md            # Environment variables
  ├── ASSETS_INVENTORY.md    # Asset management
  └── TROUBLESHOOTING.md     # Common issues
```

**Benefits:**
- Faster onboarding
- Knowledge preservation
- Easier maintenance

---

## 📋 Implementation Priority

### **Phase 1: Critical Stability (Do First)**
1. Environment variable validation
2. Credit system transaction wrapper
3. Error handling middleware

### **Phase 2: Code Organization (Do Second)**
4. API route modularization
5. Request validation layer
6. Database query helpers

### **Phase 3: Developer Experience (Do Third)**
7. Logging & monitoring setup
8. Type safety improvements
9. Documentation structure

### **Phase 4: Quality Assurance (Do Last)**
10. Testing infrastructure

---

## 🎯 Success Metrics

After implementing improvements:
- ✅ Zero production incidents from missing env vars
- ✅ Zero credit system race conditions
- ✅ All API routes in <200 line files
- ✅ Consistent error responses across all endpoints
- ✅ New developers can understand codebase in <1 day

---

## ⚠️ Important Notes

- **Never modify** DO NOT TOUCH areas without:
  1. Full test coverage
  2. Staging environment testing
  3. Database backup
  4. Rollback plan

- **Always test** after any changes to:
  - Authentication flow
  - Payment processing
  - Credit system
  - Database schema

- **Document** all changes in:
  - Commit messages
  - Changelog
  - Architecture docs
