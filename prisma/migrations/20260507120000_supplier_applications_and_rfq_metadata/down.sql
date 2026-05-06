-- Manual rollback for migration 20260507120000_supplier_applications_and_rfq_metadata.
-- Prisma does not auto-apply this; run it explicitly via psql when rolling back.
--
-- Order: drop indexes -> drop table -> drop RFQ columns.

DROP INDEX IF EXISTS "supplier_applications_created_at_idx";
DROP INDEX IF EXISTS "supplier_applications_contact_email_idx";
DROP INDEX IF EXISTS "supplier_applications_industry_idx";
DROP INDEX IF EXISTS "supplier_applications_country_idx";
DROP INDEX IF EXISTS "supplier_applications_status_idx";

DROP TABLE IF EXISTS "supplier_applications";

ALTER TABLE "RFQ" DROP COLUMN IF EXISTS "originPreference";
ALTER TABLE "RFQ" DROP COLUMN IF EXISTS "hsCode";
