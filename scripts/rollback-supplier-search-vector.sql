-- Rollback for supplier_search_vector_idx and search_vector column.
-- Run only if the FTS migration needs to be reverted.

DROP INDEX CONCURRENTLY IF EXISTS supplier_search_vector_idx;
ALTER TABLE "Supplier" DROP COLUMN IF EXISTS search_vector;
