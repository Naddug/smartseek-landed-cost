# routes.ts — Supplier search fix

**File:** `server/routes.ts`  
**Location:** ~line 2414 (in GET /api/suppliers handler)

**Change:** Fix pg_class table name for PostgreSQL (lowercase).

**Find:**
```ts
: prisma.$queryRaw<[{ cnt: number }]>`SELECT reltuples::bigint as cnt FROM pg_class WHERE relname = 'Supplier'`
```

**Replace with:**
```ts
: prisma.$queryRaw<[{ cnt: number }]>`SELECT reltuples::bigint as cnt FROM pg_class WHERE relname = 'supplier'`
```

PostgreSQL stores unquoted table names in lowercase, so `'supplier'` is correct.
