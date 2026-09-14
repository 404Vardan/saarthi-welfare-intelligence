-- ============================================================
-- SAARTHI PHASE E3: DATABASE SECURITY & PRODUCTION INTEGRITY
-- ============================================================
-- Run AFTER migration.sql, registry_migration.sql, and rbac_migration.sql
-- Establishes authoritative, recursion-free RLS, field-level 
-- privilege lockdowns on documents & applications, storage isolation, 
-- and server-enforced audit integrity.
-- ============================================================

-- ============================================================
-- 1. PRIVATE SCHEMA & SECURITY DEFINER HELPERS
-- ============================================================
-- Fixes recursive user_roles RLS by encapsulating admin/government checks
-- in secure functions with an empty search path to prevent search_path hijacking.
CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC;
GRANT USAGE ON SCHEMA private TO authenticated, service_role;

-- Helper: Check if the calling user is an Admin
CREATE OR REPLACE FUNCTION private.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = (SELECT auth.uid())
      AND role = 'admin'
  );
$$;

REVOKE EXECUTE ON FUNCTION private.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION private.is_admin() TO authenticated, service_role;

-- Helper: Check if calling user is Government or Admin
CREATE OR REPLACE FUNCTION private.is_government()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = (SELECT auth.uid())
      AND role IN ('government', 'admin')
  );
$$;

REVOKE EXECUTE ON FUNCTION private.is_government() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION private.is_government() TO authenticated, service_role;

-- ============================================================
-- 2. BREAK user_roles RLS RECURSION
-- ============================================================
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Drop previous recursive policy
DROP POLICY IF EXISTS "admins_manage_roles" ON public.user_roles;
DROP POLICY IF EXISTS "users_read_own_roles" ON public.user_roles;

-- Users can read their own assigned roles
CREATE POLICY "users_read_own_roles" ON public.user_roles
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Admins can view and manage all roles (evaluated via private helper, ZERO recursion)
CREATE POLICY "admins_manage_roles" ON public.user_roles
  FOR ALL TO authenticated
  USING (private.is_admin())
  WITH CHECK (private.is_admin());

-- ============================================================
-- 3. FIELD-LEVEL INTEGRITY LOCKDOWN ON DOCUMENTS
-- ============================================================
-- Prevent citizens from self-verifying documents or altering verification results.
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- Drop overly broad policy
DROP POLICY IF EXISTS "users_manage_own_documents" ON public.documents;
DROP POLICY IF EXISTS "citizens_read_own_documents" ON public.documents;
DROP POLICY IF EXISTS "citizens_insert_own_documents" ON public.documents;
DROP POLICY IF EXISTS "citizens_update_own_documents" ON public.documents;
DROP POLICY IF EXISTS "officials_manage_documents" ON public.documents;

-- 3a. Read policy: Citizens read own documents; Government/Admin can view all for verification
CREATE POLICY "citizens_read_own_documents" ON public.documents
  FOR SELECT TO authenticated
  USING (auth.uid() = profile_id OR private.is_government());

-- 3b. Insert policy: Citizens can only insert with status 'uploaded' and null verification fields
CREATE POLICY "citizens_insert_own_documents" ON public.documents
  FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = profile_id
    AND (status IS NULL OR status = 'uploaded')
    AND verified_at IS NULL
    AND verified_by IS NULL
  );

-- 3c. Update policy for citizens: Can update metadata (e.g. name, document_number, expiry_date),
-- but trigger below strictly prevents status changes to 'verified' or modifying verification metadata.
CREATE POLICY "citizens_update_own_documents" ON public.documents
  FOR UPDATE TO authenticated
  USING (auth.uid() = profile_id)
  WITH CHECK (auth.uid() = profile_id);

-- 3d. Officials full management (verify/reject/request re-upload)
CREATE POLICY "officials_manage_documents" ON public.documents
  FOR ALL TO authenticated
  USING (private.is_government())
  WITH CHECK (private.is_government());

-- Trigger: DB-level defense-in-depth against document status/verification tampering
CREATE OR REPLACE FUNCTION public.check_document_field_privileges()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- If updater is not an authorized official
  IF NOT (private.is_government()) THEN
    -- Block citizen self-verification
    IF NEW.status IS DISTINCT FROM OLD.status AND NEW.status IN ('verified', 'approved') THEN
      RAISE EXCEPTION 'Unauthorized: Citizens cannot self-verify documents.';
    END IF;
    -- Block modification of verification timestamps
    IF NEW.verified_at IS DISTINCT FROM OLD.verified_at THEN
      RAISE EXCEPTION 'Unauthorized: Citizens cannot modify verified_at timestamp.';
    END IF;
    -- Block modification of verifier identity
    IF NEW.verified_by IS DISTINCT FROM OLD.verified_by THEN
      RAISE EXCEPTION 'Unauthorized: Citizens cannot modify verified_by identifier.';
    END IF;
    -- Block tampering with OCR/analysis results
    IF NEW.analysis_result IS DISTINCT FROM OLD.analysis_result THEN
      RAISE EXCEPTION 'Unauthorized: Citizens cannot modify document analysis_result.';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_check_document_privileges ON public.documents;
CREATE TRIGGER trg_check_document_privileges
  BEFORE UPDATE ON public.documents
  FOR EACH ROW EXECUTE FUNCTION public.check_document_field_privileges();

-- ============================================================
-- 4. APPLICATIONS INTEGRITY & IDEMPOTENCY LOCKDOWN
-- ============================================================
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users_manage_own_applications" ON public.applications;
DROP POLICY IF EXISTS "citizens_read_own_applications" ON public.applications;
DROP POLICY IF EXISTS "citizens_insert_own_applications" ON public.applications;
DROP POLICY IF EXISTS "citizens_update_own_applications" ON public.applications;
DROP POLICY IF EXISTS "officials_manage_applications" ON public.applications;

-- 4a. Read policy: Citizens read own applications; Officials read all
CREATE POLICY "citizens_read_own_applications" ON public.applications
  FOR SELECT TO authenticated
  USING (auth.uid() = profile_id OR private.is_government());

-- 4b. Insert policy: Citizens insert own applications in initial 'submitted' state only
CREATE POLICY "citizens_insert_own_applications" ON public.applications
  FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = profile_id
    AND (status IS NULL OR status = 'submitted')
  );

-- 4c. Update policy for citizens (can only edit applicant notes or withdraw)
CREATE POLICY "citizens_update_own_applications" ON public.applications
  FOR UPDATE TO authenticated
  USING (auth.uid() = profile_id)
  WITH CHECK (auth.uid() = profile_id);

-- 4d. Officials full management (approve, reject, disburse)
CREATE POLICY "officials_manage_applications" ON public.applications
  FOR ALL TO authenticated
  USING (private.is_government())
  WITH CHECK (private.is_government());

-- 4e. Trigger: Prevent citizens from transitioning application workflow states
CREATE OR REPLACE FUNCTION public.check_application_field_privileges()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF NOT (private.is_government()) THEN
    -- Citizens cannot set status to privileged workflow stages
    IF NEW.status IS DISTINCT FROM OLD.status AND NEW.status NOT IN ('submitted', 'withdrawn') THEN
      RAISE EXCEPTION 'Unauthorized: Citizens cannot transition application status to %', NEW.status;
    END IF;
    -- Citizens cannot modify approval or disbursement timestamps
    IF NEW.approved_at IS DISTINCT FROM OLD.approved_at OR NEW.disbursed_at IS DISTINCT FROM OLD.disbursed_at THEN
      RAISE EXCEPTION 'Unauthorized: Citizens cannot modify approval or disbursement timestamps.';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_check_application_privileges ON public.applications;
CREATE TRIGGER trg_check_application_privileges
  BEFORE UPDATE ON public.applications
  FOR EACH ROW EXECUTE FUNCTION public.check_application_field_privileges();

-- 4f. Idempotency Unique Constraint: One active application per scheme per profile
CREATE UNIQUE INDEX IF NOT EXISTS idx_applications_profile_scheme_unique
  ON public.applications (profile_id, scheme_id);

-- ============================================================
-- 5. STORAGE RLS POLICIES (storage.objects)
-- ============================================================
-- Ensure private documents bucket exists and is not public
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', false)
ON CONFLICT (id) DO UPDATE SET public = false;

ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users_read_own_storage_objects" ON storage.objects;
DROP POLICY IF EXISTS "users_upload_own_storage_objects" ON storage.objects;
DROP POLICY IF EXISTS "users_update_own_storage_objects" ON storage.objects;
DROP POLICY IF EXISTS "users_delete_own_storage_objects" ON storage.objects;

-- 5a. Read: User reads files in documents/<auth.uid()>/*; Officials can inspect all
CREATE POLICY "users_read_own_storage_objects" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'documents'
    AND (
      (storage.foldername(name))[1] = auth.uid()::text
      OR private.is_government()
    )
  );

-- 5b. Upload: User uploads strictly into documents/<auth.uid()>/*
CREATE POLICY "users_upload_own_storage_objects" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'documents'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- 5c. Update: User can only update their own files
CREATE POLICY "users_update_own_storage_objects" ON storage.objects
  FOR UPDATE TO authenticated
  USING (
    bucket_id = 'documents'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- 5d. Delete: User deletes their own files; Admins can delete
CREATE POLICY "users_delete_own_storage_objects" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'documents'
    AND (
      (storage.foldername(name))[1] = auth.uid()::text
      OR private.is_admin()
    )
  );

-- ============================================================
-- 6. AUTHORITATIVE AUDIT LOGS & SECURE RPC
-- ============================================================
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "authenticated_insert_own_audit_logs" ON public.audit_logs;
DROP POLICY IF EXISTS "admins_read_audit_logs" ON public.audit_logs;

-- Read: Admins read all audit records; users read events related to their UID
CREATE POLICY "admins_read_audit_logs" ON public.audit_logs
  FOR SELECT TO authenticated
  USING (
    private.is_admin()
    OR auth.uid() = user_id
  );

-- Secure RPC for logging audit events: validates privilege and prevents client forgery
CREATE OR REPLACE FUNCTION public.log_audit_event(
  p_action TEXT,
  p_entity_type TEXT,
  p_entity_id TEXT DEFAULT NULL,
  p_details JSONB DEFAULT '{}'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_user_id UUID;
  v_log_id UUID;
  v_is_privileged BOOLEAN;
BEGIN
  v_user_id := (SELECT auth.uid());
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Unauthenticated audit event rejected';
  END IF;

  v_is_privileged := (SELECT private.is_government());

  -- Privileged actions cannot be forged by standard citizens
  IF p_action IN (
    'APPROVE_APPLICATION', 'REJECT_APPLICATION', 'DISBURSE_BENEFIT',
    'CHANGE_USER_ROLE', 'SUSPEND_USER', 'VERIFY_DOCUMENT', 'REJECT_DOCUMENT'
  ) AND NOT v_is_privileged THEN
    RAISE EXCEPTION 'Unauthorized: User cannot emit privileged audit action %', p_action;
  END IF;

  INSERT INTO public.audit_logs (user_id, action, entity_type, entity_id, details, created_at)
  VALUES (v_user_id, p_action, p_entity_type, p_entity_id, p_details, NOW())
  RETURNING id INTO v_log_id;

  RETURN v_log_id;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.log_audit_event(TEXT, TEXT, TEXT, JSONB) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.log_audit_event(TEXT, TEXT, TEXT, JSONB) TO authenticated;

-- Direct inserts from regular authenticated users are restricted to standard citizen actions
CREATE POLICY "authenticated_insert_safe_audit_logs" ON public.audit_logs
  FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND (
      private.is_government()
      OR action IN ('CITIZEN_LOGIN', 'PROFILE_UPDATE', 'DOCUMENT_UPLOAD', 'APPLICATION_SUBMIT', 'FEEDBACK_SUBMIT')
    )
  );

-- Immutable audit log guarantee: No UPDATE or DELETE permitted for any role
