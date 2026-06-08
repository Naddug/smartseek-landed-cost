-- Migration 001: extensions and enums
-- Authority: docs/IMPLEMENTATION-FOUNDATION.md §1.1, §1.2
-- Non-destructive. Idempotent where PostgreSQL allows.

-- ---------------------------------------------------------------------------
-- Extensions
-- ---------------------------------------------------------------------------

CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "moddatetime";

-- ---------------------------------------------------------------------------
-- Enums (stable sets only)
-- ---------------------------------------------------------------------------

DO $$
BEGIN
  CREATE TYPE category_status AS ENUM ('live', 'roadmap', 'hidden');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END
$$;

DO $$
BEGIN
  CREATE TYPE unit_basis AS ENUM ('tonne', 'kg', 'unit', 'liter');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END
$$;

DO $$
BEGIN
  CREATE TYPE incoterm AS ENUM ('EXW', 'FOB', 'CFR', 'CIF', 'DAP', 'DDP');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END
$$;

DO $$
BEGIN
  CREATE TYPE app_role AS ENUM ('admin', 'ops', 'sales');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END
$$;

DO $$
BEGIN
  CREATE TYPE lead_status AS ENUM ('new', 'contacted', 'qualified', 'disqualified', 'converted');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END
$$;

DO $$
BEGIN
  CREATE TYPE sample_status AS ENUM ('requested', 'approved', 'in_production', 'shipped', 'received', 'cancelled');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END
$$;

DO $$
BEGIN
  CREATE TYPE shipment_status AS ENUM ('planned', 'booked', 'in_transit', 'delivered', 'cancelled');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END
$$;
