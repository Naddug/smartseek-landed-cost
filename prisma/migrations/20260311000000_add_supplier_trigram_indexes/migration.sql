-- disable transaction
-- CREATE INDEX CONCURRENTLY cannot run inside a transaction block.
-- Prisma's `-- disable transaction` directive runs this migration outside a transaction,
-- which is required for CONCURRENTLY on large tables (25M+ rows).
-- Without CONCURRENTLY, Prisma's default transaction wrapper causes deadlocks or timeouts.

-- Enable pg_trgm extension for GIN trigram indexes
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- GIN trigram indexes — CONCURRENTLY avoids table locks on large datasets.
-- Each index builds in the background; reads and writes continue uninterrupted.
CREATE INDEX CONCURRENTLY IF NOT EXISTS "Supplier_companyName_trgm_idx" ON "Supplier" USING gin ("companyName" gin_trgm_ops);
CREATE INDEX CONCURRENTLY IF NOT EXISTS "Supplier_products_trgm_idx" ON "Supplier" USING gin ("products" gin_trgm_ops);
CREATE INDEX CONCURRENTLY IF NOT EXISTS "Supplier_industry_trgm_idx" ON "Supplier" USING gin ("industry" gin_trgm_ops);
CREATE INDEX CONCURRENTLY IF NOT EXISTS "Supplier_subIndustry_trgm_idx" ON "Supplier" USING gin ("subIndustry" gin_trgm_ops);
CREATE INDEX CONCURRENTLY IF NOT EXISTS "Supplier_description_trgm_idx" ON "Supplier" USING gin ("description" gin_trgm_ops);
CREATE INDEX CONCURRENTLY IF NOT EXISTS "Supplier_city_trgm_idx" ON "Supplier" USING gin ("city" gin_trgm_ops);
CREATE INDEX CONCURRENTLY IF NOT EXISTS "Supplier_country_trgm_idx" ON "Supplier" USING gin ("country" gin_trgm_ops);
