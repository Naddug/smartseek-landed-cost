-- Add generated tsvector column for full-text search.
-- Weighted: companyName (A, highest) > industry/subIndustry (B) >
-- products (C) > description (D, lowest).
-- Uses 'simple' config first; we can switch to 'english' later if
-- needed. 'simple' avoids language-specific stemming which is safer
-- for a multilingual supplier dataset.

ALTER TABLE "Supplier"
ADD COLUMN search_vector tsvector
GENERATED ALWAYS AS (
  setweight(to_tsvector('simple', coalesce("companyName", '')), 'A') ||
  setweight(to_tsvector('simple', coalesce(industry, '')), 'B') ||
  setweight(to_tsvector('simple', coalesce("subIndustry", '')), 'B') ||
  setweight(to_tsvector('simple', coalesce(products, '')), 'C') ||
  setweight(to_tsvector('simple', coalesce(description, '')), 'D')
) STORED;
