-- ============================================================
-- SAARTHI SCHEME REGISTRY — FULL MIGRATION
-- ============================================================
-- Transforms Saarthi from a prototype with hardcoded seed schemes
-- into a startup-grade Scheme Registry architecture.
--
-- Run AFTER the original migration.sql has been applied.
-- This migration:
--   1. Creates new registry tables
--   2. Migrates existing schemes data
--   3. Creates the v_active_schemes view
-- ============================================================

-- ============================================================
-- 1. OPERATORS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS operators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  role TEXT DEFAULT 'operator' CHECK (role IN ('operator', 'admin', 'reviewer')),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed a demo operator
INSERT INTO operators (email, display_name, role) VALUES
  ('ops@saarthi.gov.in', 'Demo Operator', 'admin');

-- ============================================================
-- 2. SCHEME REGISTRY — Master record for every scheme
-- ============================================================
CREATE TABLE scheme_registry (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scheme_code TEXT UNIQUE NOT NULL,
  official_name TEXT NOT NULL,
  short_name TEXT,
  description TEXT,
  gov_level TEXT NOT NULL CHECK (gov_level IN ('central', 'state', 'joint')),
  ministry TEXT,
  department TEXT,
  state TEXT,
  scheme_type TEXT NOT NULL CHECK (scheme_type IN (
    'direct_benefit', 'subsidy', 'insurance', 'pension',
    'loan', 'skill_training', 'employment'
  )),
  beneficiary_groups TEXT[] DEFAULT '{}',
  benefits_summary TEXT,
  benefit_amount TEXT,
  required_documents TEXT[] DEFAULT '{}',
  application_url TEXT,
  website_url TEXT,
  launch_date DATE,
  closing_date DATE,
  processing_days INTEGER DEFAULT 30,
  success_rate INTEGER DEFAULT 75,
  popularity_score INTEGER DEFAULT 50,
  lifecycle_status TEXT NOT NULL DEFAULT 'DISCOVERED' CHECK (lifecycle_status IN (
    'DISCOVERED', 'EXTRACTED', 'UNDER_REVIEW', 'VERIFIED',
    'PUBLISHED', 'UPDATED', 'EXPIRED', 'CLOSED'
  )),
  last_verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 3. SCHEME RULE VERSIONS — Versioned eligibility rules
-- ============================================================
CREATE TABLE scheme_rule_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scheme_id UUID NOT NULL REFERENCES scheme_registry(id) ON DELETE CASCADE,
  version TEXT NOT NULL,
  rules JSONB NOT NULL DEFAULT '{}',
  income_limit INTEGER,
  min_age INTEGER,
  max_age INTEGER,
  effective_from DATE NOT NULL DEFAULT CURRENT_DATE,
  effective_until DATE,
  change_summary TEXT,
  verification_status TEXT NOT NULL DEFAULT 'PENDING' CHECK (verification_status IN (
    'PENDING', 'VERIFIED', 'REJECTED'
  )),
  verified_by TEXT,
  verified_at TIMESTAMPTZ,
  source_reference TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(scheme_id, version)
);

-- ============================================================
-- 4. SCHEME SOURCES — Provenance tracking
-- ============================================================
CREATE TABLE scheme_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scheme_id UUID NOT NULL REFERENCES scheme_registry(id) ON DELETE CASCADE,
  source_tier TEXT NOT NULL CHECK (source_tier IN (
    'TIER_1_PRIMARY', 'TIER_2_AGGREGATOR', 'TIER_3_SECONDARY'
  )),
  source_type TEXT NOT NULL,
  source_url TEXT,
  source_authority TEXT,
  retrieved_at TIMESTAMPTZ DEFAULT NOW(),
  last_verified_at TIMESTAMPTZ,
  content_hash TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 5. SCHEME CHANGE HISTORY — Full audit trail
-- ============================================================
CREATE TABLE scheme_change_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scheme_id UUID NOT NULL REFERENCES scheme_registry(id) ON DELETE CASCADE,
  change_type TEXT NOT NULL CHECK (change_type IN (
    'CREATED', 'RULE_UPDATED', 'STATUS_CHANGED',
    'SOURCE_ADDED', 'VERIFIED', 'EXPIRED', 'FIELD_UPDATED'
  )),
  field_changed TEXT,
  old_value TEXT,
  new_value TEXT,
  changed_by TEXT DEFAULT 'system',
  change_source TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 6. VERIFICATION QUEUE — Pending human reviews
-- ============================================================
CREATE TABLE verification_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scheme_id UUID NOT NULL REFERENCES scheme_registry(id) ON DELETE CASCADE,
  queue_type TEXT NOT NULL CHECK (queue_type IN (
    'NEW_SCHEME', 'RULE_CHANGE', 'STATUS_CHANGE', 'EXPIRY_WARNING'
  )),
  priority TEXT NOT NULL DEFAULT 'MEDIUM' CHECK (priority IN (
    'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'
  )),
  title TEXT NOT NULL,
  proposed_changes JSONB DEFAULT '{}',
  detection_source TEXT,
  detection_url TEXT,
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN (
    'PENDING', 'IN_REVIEW', 'APPROVED', 'REJECTED'
  )),
  reviewed_by TEXT,
  reviewed_at TIMESTAMPTZ,
  review_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 7. RLS POLICIES
-- ============================================================

-- scheme_registry: public read, operators write
ALTER TABLE scheme_registry ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_scheme_registry" ON scheme_registry
  FOR SELECT USING (true);
CREATE POLICY "operators_manage_scheme_registry" ON scheme_registry
  FOR ALL USING (true);

-- scheme_rule_versions: public read, operators write
ALTER TABLE scheme_rule_versions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_rule_versions" ON scheme_rule_versions
  FOR SELECT USING (true);
CREATE POLICY "operators_manage_rule_versions" ON scheme_rule_versions
  FOR ALL USING (true);

-- scheme_sources: public read, operators write
ALTER TABLE scheme_sources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_sources" ON scheme_sources
  FOR SELECT USING (true);
CREATE POLICY "operators_manage_sources" ON scheme_sources
  FOR ALL USING (true);

-- scheme_change_history: public read, operators write
ALTER TABLE scheme_change_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_change_history" ON scheme_change_history
  FOR SELECT USING (true);
CREATE POLICY "operators_manage_change_history" ON scheme_change_history
  FOR ALL USING (true);

-- verification_queue: public read, operators write
ALTER TABLE verification_queue ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_verification_queue" ON verification_queue
  FOR SELECT USING (true);
CREATE POLICY "operators_manage_verification_queue" ON verification_queue
  FOR ALL USING (true);

-- operators: operators manage themselves
ALTER TABLE operators ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_operators" ON operators
  FOR SELECT USING (true);
CREATE POLICY "operators_manage_operators" ON operators
  FOR ALL USING (true);

-- ============================================================
-- 8. v_active_schemes VIEW
-- ============================================================
-- This view joins scheme_registry with the currently effective
-- rule version, so the frontend simply queries this view and
-- gets everything it needs. The view auto-selects the correct
-- rule version based on today's date.
-- ============================================================
CREATE OR REPLACE VIEW v_active_schemes AS
SELECT
  sr.id,
  sr.scheme_code,
  sr.official_name AS name,
  sr.short_name,
  sr.description,
  sr.gov_level,
  sr.ministry,
  sr.department,
  sr.state,
  sr.scheme_type AS type,
  sr.beneficiary_groups AS beneficiary_tags,
  sr.benefits_summary AS benefit,
  sr.benefit_amount,
  sr.required_documents AS documents,
  sr.application_url,
  sr.website_url,
  sr.launch_date,
  sr.closing_date,
  sr.processing_days,
  sr.success_rate,
  sr.popularity_score,
  sr.lifecycle_status,
  sr.last_verified_at,
  sr.created_at,
  -- Rule version fields
  rv.rules,
  rv.income_limit,
  rv.min_age,
  rv.max_age,
  rv.version AS rule_version,
  rv.effective_from AS rule_effective_from,
  rv.verification_status AS rule_verification_status,
  rv.verified_at AS rule_verified_at,
  rv.verified_by AS rule_verified_by
FROM scheme_registry sr
LEFT JOIN LATERAL (
  SELECT *
  FROM scheme_rule_versions srv
  WHERE srv.scheme_id = sr.id
    AND srv.verification_status = 'VERIFIED'
    AND srv.effective_from <= CURRENT_DATE
    AND (srv.effective_until IS NULL OR srv.effective_until >= CURRENT_DATE)
  ORDER BY srv.effective_from DESC, srv.created_at DESC
  LIMIT 1
) rv ON true
WHERE sr.lifecycle_status IN ('PUBLISHED', 'UPDATED');

-- ============================================================
-- 9. MIGRATE EXISTING SEED DATA
-- ============================================================
-- Insert into scheme_registry from existing schemes table
INSERT INTO scheme_registry (
  scheme_code, official_name, short_name, description,
  gov_level, ministry, state, scheme_type,
  beneficiary_groups, benefits_summary, benefit_amount,
  required_documents, website_url,
  processing_days, success_rate, popularity_score,
  lifecycle_status, last_verified_at
)
SELECT
  COALESCE(s.short_name, 'SCHEME-' || LEFT(s.id::text, 8)),
  s.name,
  s.short_name,
  s.description,
  s.gov_level,
  s.ministry,
  s.state,
  s.type,
  s.beneficiary_tags,
  s.benefit,
  s.benefit_amount,
  s.documents,
  s.website_url,
  s.processing_days,
  s.success_rate,
  s.popularity_score,
  'PUBLISHED',
  NOW()
FROM schemes s;

-- Create v1.0 rule versions for all migrated schemes
INSERT INTO scheme_rule_versions (
  scheme_id, version, rules, income_limit, min_age, max_age,
  effective_from, change_summary, verification_status,
  verified_by, verified_at, source_reference
)
SELECT
  sr.id,
  '1.0',
  s.rules,
  s.income_limit,
  s.min_age,
  s.max_age,
  COALESCE(s.added_date, CURRENT_DATE),
  'Initial version — migrated from prototype seed data',
  'VERIFIED',
  'system_migration',
  NOW(),
  'Migrated from Saarthi prototype v1.0'
FROM schemes s
JOIN scheme_registry sr ON sr.scheme_code = COALESCE(s.short_name, 'SCHEME-' || LEFT(s.id::text, 8));

-- Create source records for all migrated schemes
INSERT INTO scheme_sources (
  scheme_id, source_tier, source_type, source_authority,
  retrieved_at, last_verified_at, notes
)
SELECT
  sr.id,
  'TIER_1_PRIMARY',
  'ministry_portal',
  COALESCE(s.ministry, 'Government of India'),
  NOW(),
  NOW(),
  'Initial source — prototype seed data. To be verified against official sources.'
FROM schemes s
JOIN scheme_registry sr ON sr.scheme_code = COALESCE(s.short_name, 'SCHEME-' || LEFT(s.id::text, 8));

-- Create change history entries for all migrated schemes
INSERT INTO scheme_change_history (
  scheme_id, change_type, field_changed, new_value,
  changed_by, change_source
)
SELECT
  sr.id,
  'CREATED',
  'lifecycle_status',
  'PUBLISHED',
  'system_migration',
  'Migrated from Saarthi prototype v1.0'
FROM schemes s
JOIN scheme_registry sr ON sr.scheme_code = COALESCE(s.short_name, 'SCHEME-' || LEFT(s.id::text, 8));

-- ============================================================
-- 10. UPDATE FOREIGN KEYS
-- ============================================================
DO $$
BEGIN
  ALTER TABLE saved_schemes DROP CONSTRAINT IF EXISTS saved_schemes_scheme_id_fkey;
  ALTER TABLE applications DROP CONSTRAINT IF EXISTS applications_scheme_id_fkey;
EXCEPTION
  WHEN OTHERS THEN NULL;
END $$;

-- ============================================================
-- 11. INDEXES FOR PERFORMANCE
-- ============================================================
CREATE INDEX idx_scheme_registry_status ON scheme_registry(lifecycle_status);
CREATE INDEX idx_scheme_registry_type ON scheme_registry(scheme_type);
CREATE INDEX idx_scheme_registry_gov_level ON scheme_registry(gov_level);
CREATE INDEX idx_scheme_registry_code ON scheme_registry(scheme_code);

CREATE INDEX idx_rule_versions_scheme ON scheme_rule_versions(scheme_id);
CREATE INDEX idx_rule_versions_effective ON scheme_rule_versions(effective_from, effective_until);
CREATE INDEX idx_rule_versions_status ON scheme_rule_versions(verification_status);

CREATE INDEX idx_sources_scheme ON scheme_sources(scheme_id);
CREATE INDEX idx_change_history_scheme ON scheme_change_history(scheme_id);
CREATE INDEX idx_change_history_type ON scheme_change_history(change_type);

CREATE INDEX idx_verification_queue_status ON verification_queue(status);
CREATE INDEX idx_verification_queue_priority ON verification_queue(priority);
CREATE INDEX idx_verification_queue_scheme ON verification_queue(scheme_id);

-- ============================================================
-- 12. HELPER FUNCTIONS
-- ============================================================

-- Function to get the active rule version for a scheme on a given date
CREATE OR REPLACE FUNCTION get_active_rule_version(
  p_scheme_id UUID,
  p_date DATE DEFAULT CURRENT_DATE
)
RETURNS TABLE (
  version TEXT,
  rules JSONB,
  income_limit INTEGER,
  min_age INTEGER,
  max_age INTEGER,
  effective_from DATE,
  effective_until DATE,
  verification_status TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    srv.version,
    srv.rules,
    srv.income_limit,
    srv.min_age,
    srv.max_age,
    srv.effective_from,
    srv.effective_until,
    srv.verification_status
  FROM scheme_rule_versions srv
  WHERE srv.scheme_id = p_scheme_id
    AND srv.verification_status = 'VERIFIED'
    AND srv.effective_from <= p_date
    AND (srv.effective_until IS NULL OR srv.effective_until >= p_date)
  ORDER BY srv.effective_from DESC, srv.created_at DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- Function to get scheme statistics for the operations dashboard
CREATE OR REPLACE FUNCTION get_scheme_stats()
RETURNS TABLE (
  total_schemes BIGINT,
  published_schemes BIGINT,
  under_review_schemes BIGINT,
  discovered_schemes BIGINT,
  expired_schemes BIGINT,
  pending_verifications BIGINT,
  recent_changes BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    (SELECT COUNT(*) FROM scheme_registry)::BIGINT,
    (SELECT COUNT(*) FROM scheme_registry WHERE lifecycle_status = 'PUBLISHED')::BIGINT,
    (SELECT COUNT(*) FROM scheme_registry WHERE lifecycle_status = 'UNDER_REVIEW')::BIGINT,
    (SELECT COUNT(*) FROM scheme_registry WHERE lifecycle_status = 'DISCOVERED')::BIGINT,
    (SELECT COUNT(*) FROM scheme_registry WHERE lifecycle_status IN ('EXPIRED', 'CLOSED'))::BIGINT,
    (SELECT COUNT(*) FROM verification_queue WHERE status = 'PENDING')::BIGINT,
    (SELECT COUNT(*) FROM scheme_change_history WHERE created_at > NOW() - INTERVAL '7 days')::BIGINT;
END;
$$ LANGUAGE plpgsql;
