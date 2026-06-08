-- Migration 003: category registry
-- Authority: docs/IMPLEMENTATION-FOUNDATION.md §1.4
-- Non-destructive. Idempotent where PostgreSQL allows.
-- Depends on: 001_extensions_enums.sql

-- ---------------------------------------------------------------------------
-- categories
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS categories (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug                 text NOT NULL UNIQUE,
  name                 text NOT NULL,
  status               category_status NOT NULL DEFAULT 'hidden',
  sort_order           int NOT NULL DEFAULT 0,
  unit_basis           unit_basis NOT NULL DEFAULT 'unit',
  tagline              text,
  summary              text,
  attribute_schema     jsonb NOT NULL DEFAULT '{"version":1,"fields":[]}',
  content              jsonb NOT NULL DEFAULT '{"version":1}',
  feasibility_strategy text,
  is_active            boolean NOT NULL DEFAULT true,
  created_at           timestamptz NOT NULL DEFAULT now(),
  updated_at           timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT categories_slug_format CHECK (slug ~ '^[a-z0-9-]+$')
);

-- ---------------------------------------------------------------------------
-- category_variants
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS category_variants (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  slug        text NOT NULL,
  name        text NOT NULL,
  sort_order  int NOT NULL DEFAULT 0,
  is_active   boolean NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (category_id, slug)
);

-- ---------------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_category_variants_category_id
  ON category_variants(category_id);

CREATE INDEX IF NOT EXISTS idx_categories_status_sort
  ON categories(status, sort_order)
  WHERE is_active = true;
