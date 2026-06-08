-- Migration 002: reference tables
-- Authority: docs/IMPLEMENTATION-FOUNDATION.md §1.3
-- Non-destructive. Idempotent where PostgreSQL allows.
-- Depends on: 001_extensions_enums.sql

-- ---------------------------------------------------------------------------
-- countries
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS countries (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  iso_code    char(2) NOT NULL UNIQUE,
  name        text NOT NULL,
  is_active   boolean NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- fx_rates
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS fx_rates (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  base_currency     char(3) NOT NULL DEFAULT 'USD',
  quote_currency    char(3) NOT NULL,
  rate              numeric(18,8) NOT NULL CHECK (rate > 0),
  effective_date    date NOT NULL,
  source            text NOT NULL DEFAULT 'manual',
  created_at        timestamptz NOT NULL DEFAULT now(),
  UNIQUE (base_currency, quote_currency, effective_date)
);
