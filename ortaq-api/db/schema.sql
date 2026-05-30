-- ORTAQ Trust Operations — PostgreSQL schema (Phase 2)
-- Append-only audit; no soft-delete on compliance records

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Immutable audit log
CREATE TABLE audit_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL,
  actor_type TEXT NOT NULL,
  actor_id TEXT NOT NULL,
  subject_type TEXT NOT NULL,
  subject_id TEXT NOT NULL,
  payload JSONB NOT NULL,
  payload_hash TEXT NOT NULL,
  ip_hash TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX audit_events_subject_idx ON audit_events (subject_type, subject_id);
CREATE INDEX audit_events_created_idx ON audit_events (created_at DESC);

-- Companies
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mersis_no TEXT,
  trade_registry_no TEXT,
  legal_name TEXT NOT NULL,
  tax_id TEXT,
  registered_address TEXT NOT NULL,
  activity_description TEXT NOT NULL,
  verification_state TEXT NOT NULL DEFAULT 'draft',
  public_label TEXT NOT NULL DEFAULT 'not_submitted',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Founders
CREATE TABLE founders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id),
  full_name TEXT NOT NULL,
  role TEXT NOT NULL,
  identity_verified BOOLEAN NOT NULL DEFAULT false,
  verification_state TEXT NOT NULL DEFAULT 'draft',
  public_label TEXT NOT NULL DEFAULT 'not_submitted',
  pep_disclosed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Documents (metadata only — files in object storage)
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_type TEXT NOT NULL,
  subject_id UUID NOT NULL,
  doc_type TEXT NOT NULL,
  file_name TEXT NOT NULL,
  content_hash TEXT NOT NULL,
  version INT NOT NULL DEFAULT 1,
  investor_visible BOOLEAN NOT NULL DEFAULT false,
  verification_state TEXT NOT NULL DEFAULT 'draft',
  public_label TEXT NOT NULL DEFAULT 'not_submitted',
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  uploaded_by TEXT NOT NULL
);

-- Campaigns
CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  company_id UUID NOT NULL REFERENCES companies(id),
  lifecycle_state TEXT NOT NULL DEFAULT 'draft',
  verification_label TEXT NOT NULL DEFAULT 'not_submitted',
  investor_ready BOOLEAN NOT NULL DEFAULT false,
  material_change_locked BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE campaign_gates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES campaigns(id),
  name TEXT NOT NULL,
  required BOOLEAN NOT NULL DEFAULT true,
  status TEXT NOT NULL DEFAULT 'pending',
  waived_by TEXT,
  waived_reason TEXT,
  completed_at TIMESTAMPTZ
);

-- Escalations / complaints
CREATE TABLE escalation_cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  public_ref TEXT UNIQUE NOT NULL,
  case_type TEXT NOT NULL,
  tier TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open',
  priority TEXT NOT NULL DEFAULT 'normal',
  summary TEXT NOT NULL,
  contact_email TEXT,
  campaign_slug TEXT,
  sla_due_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Fraud signals
CREATE TABLE fraud_signals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  signal_type TEXT NOT NULL,
  severity TEXT NOT NULL,
  subject_type TEXT NOT NULL,
  subject_id TEXT NOT NULL,
  description TEXT NOT NULL,
  action TEXT,
  reviewed BOOLEAN NOT NULL DEFAULT false,
  resolution TEXT,
  detected_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Public transparency feed (immutable)
CREATE TABLE transparency_publications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  evidence_url TEXT,
  related_campaign_slug TEXT,
  published_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Consent records (KVKK / risk ack)
CREATE TABLE consent_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_ref TEXT NOT NULL,
  consent_type TEXT NOT NULL,
  version TEXT NOT NULL,
  granted BOOLEAN NOT NULL,
  ip_hash TEXT,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
