-- REQUIRED for supplier search with 25M+ rows. Without these indexes, search times out.
-- Run this manually for production (zero-downtime index creation).
-- Usage: psql $DATABASE_URL -f scripts/add-supplier-trigram-indexes-production.sql
-- Or: NODE_TLS_REJECT_UNAUTHORIZED=0 node scripts/run-trigram-indexes.mjs
-- CREATE INDEX CONCURRENTLY cannot run inside a transaction.

CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX CONCURRENTLY IF NOT EXISTS "Supplier_companyName_trgm_idx" ON "Supplier" USING gin ("companyName" gin_trgm_ops);
CREATE INDEX CONCURRENTLY IF NOT EXISTS "Supplier_products_trgm_idx" ON "Supplier" USING gin ("products" gin_trgm_ops);
CREATE INDEX CONCURRENTLY IF NOT EXISTS "Supplier_industry_trgm_idx" ON "Supplier" USING gin ("industry" gin_trgm_ops);
CREATE INDEX CONCURRENTLY IF NOT EXISTS "Supplier_subIndustry_trgm_idx" ON "Supplier" USING gin ("subIndustry" gin_trgm_ops);
CREATE INDEX CONCURRENTLY IF NOT EXISTS "Supplier_description_trgm_idx" ON "Supplier" USING gin ("description" gin_trgm_ops);
CREATE INDEX CONCURRENTLY IF NOT EXISTS "Supplier_city_trgm_idx" ON "Supplier" USING gin ("city" gin_trgm_ops);
CREATE INDEX CONCURRENTLY IF NOT EXISTS "Supplier_country_trgm_idx" ON "Supplier" USING gin ("country" gin_trgm_ops);
