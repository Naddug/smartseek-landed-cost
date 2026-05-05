-- Run AFTER the migration completes. Uses CONCURRENTLY so production
-- traffic is not blocked. Cannot be in a Prisma migration because
-- Prisma wraps migrations in transactions, and CREATE INDEX
-- CONCURRENTLY cannot run inside a transaction.

CREATE INDEX CONCURRENTLY IF NOT EXISTS supplier_search_vector_idx
ON "Supplier" USING gin(search_vector);

-- Update planner statistics on the new column
ANALYZE "Supplier";
