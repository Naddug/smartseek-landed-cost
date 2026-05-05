ALTER TABLE waitlist_signups
ADD COLUMN IF NOT EXISTS tier_interest VARCHAR(64) NOT NULL DEFAULT 'professional';

ALTER TABLE waitlist_signups
ADD COLUMN IF NOT EXISTS source_page VARCHAR(64) NOT NULL DEFAULT 'pricing';
