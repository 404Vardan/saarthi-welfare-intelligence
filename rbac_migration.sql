-- ============================================================
-- SAARTHI RBAC MIGRATION
-- ============================================================
-- Run AFTER migration.sql and registry_migration.sql
-- Establishes Role-Based Access Control for all user types.
-- ============================================================

-- ============================================================
-- 1. USER ROLES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('citizen', 'government', 'admin')),
  assigned_by UUID,
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- RLS for user_roles
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Users can read their own roles
CREATE POLICY "users_read_own_roles" ON user_roles
  FOR SELECT USING (auth.uid() = user_id);

-- Admins can manage all roles
CREATE POLICY "admins_manage_roles" ON user_roles
  FOR ALL USING (
    auth.uid() IN (SELECT user_id FROM user_roles WHERE role = 'admin')
  );

-- ============================================================
-- 2. AUTO-PROVISION PROFILE & CITIZEN ROLE ON SIGNUP (Email & OAuth)
-- ============================================================
CREATE OR REPLACE FUNCTION handle_new_user_bootstrap()
RETURNS TRIGGER AS $$
DECLARE
  extracted_name TEXT;
BEGIN
  -- Extract display name from user metadata or fallback to email prefix
  extracted_name := COALESCE(
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'name',
    SPLIT_PART(NEW.email, '@', 1),
    'Citizen'
  );

  -- 1. Ensure profile exists
  INSERT INTO public.profiles (id, full_name, created_at, updated_at)
  VALUES (NEW.id, extracted_name, NOW(), NOW())
  ON CONFLICT (id) DO UPDATE
  SET full_name = EXCLUDED.full_name,
      updated_at = NOW()
  WHERE public.profiles.full_name IS NULL OR public.profiles.full_name = '';

  -- 2. Ensure citizen role is assigned
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'citizen')
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop any previous conflicting triggers and attach bootstrap
DROP TRIGGER IF EXISTS on_auth_user_role_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user_bootstrap();

-- ============================================================
-- 3. ADD RLS TO REGISTRY TABLES (missing from registry_migration)
-- ============================================================

-- scheme_registry: public read for published/verified, admin write
ALTER TABLE scheme_registry ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_published_schemes" ON scheme_registry
  FOR SELECT USING (
    lifecycle_status IN ('PUBLISHED', 'VERIFIED', 'UPDATED')
    OR auth.uid() IN (SELECT user_id FROM user_roles WHERE role = 'admin')
  );

CREATE POLICY "admins_manage_registry" ON scheme_registry
  FOR INSERT USING (
    auth.uid() IN (SELECT user_id FROM user_roles WHERE role = 'admin')
  );

CREATE POLICY "admins_update_registry" ON scheme_registry
  FOR UPDATE USING (
    auth.uid() IN (SELECT user_id FROM user_roles WHERE role = 'admin')
  );

CREATE POLICY "admins_delete_registry" ON scheme_registry
  FOR DELETE USING (
    auth.uid() IN (SELECT user_id FROM user_roles WHERE role = 'admin')
  );

-- scheme_rule_versions: public read, admin write
ALTER TABLE scheme_rule_versions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_rule_versions" ON scheme_rule_versions
  FOR SELECT USING (true);

CREATE POLICY "admins_manage_rule_versions" ON scheme_rule_versions
  FOR ALL USING (
    auth.uid() IN (SELECT user_id FROM user_roles WHERE role = 'admin')
  );

-- verification_queue: admin-only
ALTER TABLE verification_queue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admins_manage_verification_queue" ON verification_queue
  FOR ALL USING (
    auth.uid() IN (SELECT user_id FROM user_roles WHERE role = 'admin')
  );

-- operators: read by all authenticated, manage by admin
ALTER TABLE operators ENABLE ROW LEVEL SECURITY;

CREATE POLICY "authenticated_read_operators" ON operators
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "admins_manage_operators" ON operators
  FOR ALL USING (
    auth.uid() IN (SELECT user_id FROM user_roles WHERE role = 'admin')
  );

-- scheme_sources: public read, admin write
ALTER TABLE scheme_sources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_scheme_sources" ON scheme_sources
  FOR SELECT USING (true);

CREATE POLICY "admins_manage_scheme_sources" ON scheme_sources
  FOR ALL USING (
    auth.uid() IN (SELECT user_id FROM user_roles WHERE role = 'admin')
  );

-- ============================================================
-- 4. AUDIT LOG TABLE (for tracking privileged actions)
-- ============================================================
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  details JSONB DEFAULT '{}',
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can read all audit logs, users can read their own
CREATE POLICY "admins_read_audit_logs" ON audit_logs
  FOR SELECT USING (
    auth.uid() IN (SELECT user_id FROM user_roles WHERE role = 'admin')
    OR auth.uid() = user_id
  );

-- Authenticated callers can only insert logs stamped with their own UID, or admins
CREATE POLICY "authenticated_insert_own_audit_logs" ON audit_logs
  FOR INSERT WITH CHECK (
    auth.uid() = user_id
    OR auth.uid() IN (SELECT user_id FROM user_roles WHERE role = 'admin')
  );

-- Audit logs are strictly immutable: no UPDATE or DELETE permitted
-- (Omission of UPDATE/DELETE policies enforces denial by default in PostgreSQL RLS)
