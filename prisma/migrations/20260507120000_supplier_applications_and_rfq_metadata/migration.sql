-- Migration: supplier_applications + RFQ metadata
-- ----------------------------------------------------------------------------
-- Purpose:
--   1) Create the new "supplier_applications" table backing the public
--      "Become a Supplier" intake at POST /api/supplier-applications.
--   2) Add two nullable columns to the legacy "RFQ" table so the legacy POST
--      /api/rfqs endpoint can persist the new HS-code and origin-preference
--      fields. The modern POST /api/rfq path writes to "rfq_requests" and is
--      unaffected by this change.
--
-- Backward compatibility:
--   - All ALTER TABLE statements use ADD COLUMN IF NOT EXISTS and add NULLABLE
--     columns with no defaults. Existing rows remain valid.
--   - All CREATE statements use IF NOT EXISTS, so the migration is idempotent.
--   - No existing column is dropped, renamed, or retyped.
--   - No constraint is altered. Foreign keys are unchanged.
--
-- Rollback:
--   - See the inverse migration in:
--     prisma/migrations/20260507120000_supplier_applications_and_rfq_metadata/down.sql
--   - The down script drops the new table and the two columns. Drop order is
--     reversed to handle index dependencies safely.
-- ----------------------------------------------------------------------------

-- 1) supplier_applications -----------------------------------------------------
CREATE TABLE IF NOT EXISTS "supplier_applications" (
    "id" TEXT NOT NULL,

    "company_name" TEXT NOT NULL,
    "website" TEXT,
    "country" TEXT NOT NULL,
    "country_code" TEXT,
    "city" TEXT,
    "registry_number" TEXT,
    "registry_authority" TEXT,
    "year_established" INTEGER,
    "employee_band" TEXT,

    "industry" TEXT NOT NULL,
    "sub_industry" TEXT,
    "products" TEXT NOT NULL,
    "certifications" TEXT,
    "export_markets" TEXT,
    "min_order_value" DOUBLE PRECISION,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "lead_time_days" INTEGER,
    "payment_terms" TEXT,
    "incoterms" TEXT,

    "contact_name" TEXT NOT NULL,
    "contact_role" TEXT,
    "contact_email" TEXT NOT NULL,
    "contact_phone" TEXT,

    "status" TEXT NOT NULL DEFAULT 'pending',
    "reviewer" TEXT,
    "review_note" TEXT,
    "promoted_supplier_id" TEXT,

    "source" TEXT NOT NULL DEFAULT 'web',
    "ip_address" TEXT,
    "user_agent" TEXT,

    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "supplier_applications_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "supplier_applications_status_idx"        ON "supplier_applications" ("status");
CREATE INDEX IF NOT EXISTS "supplier_applications_country_idx"       ON "supplier_applications" ("country");
CREATE INDEX IF NOT EXISTS "supplier_applications_industry_idx"      ON "supplier_applications" ("industry");
CREATE INDEX IF NOT EXISTS "supplier_applications_contact_email_idx" ON "supplier_applications" ("contact_email");
CREATE INDEX IF NOT EXISTS "supplier_applications_created_at_idx"    ON "supplier_applications" ("created_at");

-- 2) RFQ metadata --------------------------------------------------------------
-- Both columns are NULLABLE. Existing rows remain valid.
ALTER TABLE "RFQ" ADD COLUMN IF NOT EXISTS "hsCode" TEXT;
ALTER TABLE "RFQ" ADD COLUMN IF NOT EXISTS "originPreference" TEXT;
