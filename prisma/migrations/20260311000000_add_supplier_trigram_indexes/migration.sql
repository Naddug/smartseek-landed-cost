-- Enable pg_trgm for fast ILIKE/LIKE pattern matching on millions of rows
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- GIN trigram indexes on Supplier search columns (speeds up contains/ILIKE queries)
-- Note: For production with millions of rows, run these manually with CONCURRENTLY to avoid table locks
CREATE INDEX IF NOT EXISTS "Supplier_companyName_trgm_idx" ON "Supplier" USING gin ("companyName" gin_trgm_ops);
CREATE INDEX IF NOT EXISTS "Supplier_products_trgm_idx" ON "Supplier" USING gin ("products" gin_trgm_ops);
CREATE INDEX IF NOT EXISTS "Supplier_industry_trgm_idx" ON "Supplier" USING gin ("industry" gin_trgm_ops);
CREATE INDEX IF NOT EXISTS "Supplier_subIndustry_trgm_idx" ON "Supplier" USING gin ("subIndustry" gin_trgm_ops);
CREATE INDEX IF NOT EXISTS "Supplier_description_trgm_idx" ON "Supplier" USING gin ("description" gin_trgm_ops);
CREATE INDEX IF NOT EXISTS "Supplier_city_trgm_idx" ON "Supplier" USING gin ("city" gin_trgm_ops);
CREATE INDEX IF NOT EXISTS "Supplier_country_trgm_idx" ON "Supplier" USING gin ("country" gin_trgm_ops);
