-- =========================================================================
-- EnerGuru — Stage 1 Migration: Security Hardening & RBAC Foundation
-- File: supabase/migrations/20261031_stage1_security_rbac.sql
-- Description:
--   1. Hardens public.profiles with column-level least-privilege security
--   2. Establishes dedicated Role-Based Access Control (public.user_roles)
--   3. Creates security definer role-checking helpers with fixed search_paths
--   4. Creates the audit logging foundation (public.audit_logs)
--   5. Idempotently backfills default 'customer' role for existing accounts
--   6. Leaves initial super-admin assignment pending founder UUID confirmation
-- =========================================================================

-- Ensure required extensions are available
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =========================================================================
-- PART 1: HARDEN EXISTING public.profiles TABLE
-- =========================================================================

-- 1.1 Ensure RLS is enabled on public.profiles
ALTER TABLE IF EXISTS public.profiles ENABLE ROW LEVEL SECURITY;

-- 1.2 Re-create clean, strict RLS policies on public.profiles
DO $$ BEGIN
  -- Drop existing policies if they exist to ensure consistent state
  DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
  DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
  DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
  DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
  DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
  DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
END $$;

-- Customers can view only their own profile
CREATE POLICY "profiles_select_own"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Customers can update only their own profile row
CREATE POLICY "profiles_update_own"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 1.3 Column-Level Permission Hardening (Least Privilege)
-- Revoke general public/authenticated update on all columns
REVOKE ALL ON public.profiles FROM PUBLIC;
REVOKE UPDATE ON public.profiles FROM authenticated;

-- Grant SELECT on all profile columns to authenticated users (governed by RLS)
GRANT SELECT ON public.profiles TO authenticated;

-- Grant UPDATE ONLY on customer-editable fields: full_name, nickname, updated_at
-- This physically prevents users from tampering with id, email, created_at, or system fields
GRANT UPDATE (full_name, nickname, updated_at) ON public.profiles TO authenticated;


-- =========================================================================
-- PART 2: DEDICATED ROLE-BASED ACCESS CONTROL (RBAC)
-- =========================================================================

-- 2.1 Create app_role enum type
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type t
    JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE t.typname = 'app_role' AND n.nspname = 'public'
  ) THEN
    CREATE TYPE public.app_role AS ENUM (
      'customer',
      'technician',
      'support_staff',
      'admin',
      'super_admin'
    );
  END IF;
END $$;

-- 2.2 Create public.user_roles dedicated table
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL DEFAULT 'customer',
  assigned_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT user_roles_user_role_unique UNIQUE (user_id, role)
);

-- Indexes for performant role lookups
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON public.user_roles(role);

-- 2.3 RLS on public.user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  DROP POLICY IF EXISTS "user_roles_select_own" ON public.user_roles;
  DROP POLICY IF EXISTS "user_roles_super_admin_all" ON public.user_roles;
END $$;

-- Users can read their own roles
CREATE POLICY "user_roles_select_own"
  ON public.user_roles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Explicitly revoke INSERT, UPDATE, DELETE from authenticated and public
-- Normal users can NEVER assign, modify, or delete roles directly via PostgREST
REVOKE ALL ON public.user_roles FROM PUBLIC;
REVOKE INSERT, UPDATE, DELETE ON public.user_roles FROM authenticated;
GRANT SELECT ON public.user_roles TO authenticated;


-- =========================================================================
-- PART 3: AUDIT LOGGING FOUNDATION (public.audit_logs)
-- =========================================================================

CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  ip_address INET,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_actor_id ON public.audit_logs(actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON public.audit_logs(action);

-- Enable RLS on audit_logs
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Ordinary users cannot read, insert, update, or delete audit logs
REVOKE ALL ON public.audit_logs FROM PUBLIC;
REVOKE ALL ON public.audit_logs FROM authenticated;


-- =========================================================================
-- PART 4: SECURE ROLE & AUDIT HELPER FUNCTIONS (SECURITY DEFINER)
-- =========================================================================

-- 4.1 Check if the current authenticated user holds a specific role
CREATE OR REPLACE FUNCTION public.has_role(required_role public.app_role)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, pg_temp
STABLE
AS $$
DECLARE
  current_user_id UUID;
BEGIN
  current_user_id := auth.uid();
  IF current_user_id IS NULL THEN
    RETURN FALSE;
  END IF;

  RETURN EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = current_user_id
      AND role = required_role
  );
END;
$$;

-- 4.2 Check if current user is super_admin
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, pg_temp
STABLE
AS $$
BEGIN
  RETURN public.has_role('super_admin');
END;
$$;

-- 4.3 Check if current user is admin or super_admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, pg_temp
STABLE
AS $$
BEGIN
  RETURN public.has_role('admin') OR public.has_role('super_admin');
END;
$$;

-- 4.4 Super-Admin policy for audit logs (now that is_super_admin exists)
DO $$ BEGIN
  DROP POLICY IF EXISTS "audit_logs_select_super_admin" ON public.audit_logs;
END $$;

CREATE POLICY "audit_logs_select_super_admin"
  ON public.audit_logs
  FOR SELECT
  TO authenticated
  USING (public.is_super_admin());

GRANT SELECT ON public.audit_logs TO authenticated;

-- 4.5 Internal audit logging function
CREATE OR REPLACE FUNCTION public.log_audit_event(
  p_action TEXT,
  p_resource_type TEXT,
  p_resource_id TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, pg_temp
AS $$
DECLARE
  v_log_id UUID;
BEGIN
  INSERT INTO public.audit_logs (actor_id, action, resource_type, resource_id, metadata)
  VALUES (auth.uid(), p_action, p_resource_type, p_resource_id, p_metadata)
  RETURNING id INTO v_log_id;
  
  RETURN v_log_id;
END;
$$;

-- 4.6 Secure role assignment function (Callable only by super_admin)
CREATE OR REPLACE FUNCTION public.assign_user_role(
  target_user_id UUID,
  target_role public.app_role
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, pg_temp
AS $$
DECLARE
  caller_id UUID;
BEGIN
  caller_id := auth.uid();
  IF caller_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Verify caller is a verified super_admin
  IF NOT public.has_role('super_admin') THEN
    RAISE EXCEPTION 'Access denied: Only a super_admin can assign user roles';
  END IF;

  -- Verify target user exists in auth.users
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = target_user_id) THEN
    RAISE EXCEPTION 'Target user does not exist';
  END IF;

  -- Insert role idempotently
  INSERT INTO public.user_roles (user_id, role, assigned_by)
  VALUES (target_user_id, target_role, caller_id)
  ON CONFLICT (user_id, role) DO NOTHING;

  -- Record in audit log
  PERFORM public.log_audit_event(
    'role_assigned',
    'user_roles',
    target_user_id::text,
    jsonb_build_object('assigned_role', target_role, 'target_user_id', target_user_id)
  );

  RETURN TRUE;
END;
$$;

-- 4.7 Secure role removal function (Callable only by super_admin)
CREATE OR REPLACE FUNCTION public.remove_user_role(
  target_user_id UUID,
  target_role public.app_role
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, pg_temp
AS $$
DECLARE
  caller_id UUID;
BEGIN
  caller_id := auth.uid();
  IF caller_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Verify caller is a verified super_admin
  IF NOT public.has_role('super_admin') THEN
    RAISE EXCEPTION 'Access denied: Only a super_admin can remove user roles';
  END IF;

  -- Prevent removing the last super_admin
  IF target_role = 'super_admin' AND (
    SELECT COUNT(*) FROM public.user_roles WHERE role = 'super_admin'
  ) <= 1 THEN
    RAISE EXCEPTION 'Cannot remove the last super_admin account';
  END IF;

  DELETE FROM public.user_roles
  WHERE user_id = target_user_id
    AND role = target_role;

  -- Record in audit log
  PERFORM public.log_audit_event(
    'role_removed',
    'user_roles',
    target_user_id::text,
    jsonb_build_object('removed_role', target_role, 'target_user_id', target_user_id)
  );

  RETURN TRUE;
END;
$$;

-- 4.8 Get current user's roles
CREATE OR REPLACE FUNCTION public.get_my_roles()
RETURNS TABLE (role public.app_role)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, pg_temp
STABLE
AS $$
BEGIN
  RETURN QUERY
  SELECT ur.role
  FROM public.user_roles ur
  WHERE ur.user_id = auth.uid();
END;
$$;

-- Explicitly revoke PUBLIC execution and grant to authenticated
REVOKE EXECUTE ON FUNCTION public.has_role(public.app_role) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.is_super_admin() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.get_my_roles() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.log_audit_event(TEXT, TEXT, TEXT, JSONB) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.assign_user_role(UUID, public.app_role) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.remove_user_role(UUID, public.app_role) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.has_role(public.app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_super_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_my_roles() TO authenticated;
GRANT EXECUTE ON FUNCTION public.assign_user_role(UUID, public.app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.remove_user_role(UUID, public.app_role) TO authenticated;


-- =========================================================================
-- PART 5: AUTOMATIC DEFAULT ROLE ON USER REGISTRATION
-- =========================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, pg_temp
AS $$
BEGIN
  -- Automatically assign 'customer' role to newly registered accounts
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'customer')
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created_assign_role ON auth.users;
CREATE TRIGGER on_auth_user_created_assign_role
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_role();


-- =========================================================================
-- PART 6: SAFE, IDEMPOTENT BACKFILL FOR EXISTING ACCOUNTS
-- =========================================================================

-- Assign 'customer' role to existing accounts in auth.users that have no assigned role yet
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'customer'::public.app_role
FROM auth.users u
WHERE NOT EXISTS (
  SELECT 1 FROM public.user_roles ur WHERE ur.user_id = u.id
)
ON CONFLICT (user_id, role) DO NOTHING;


-- =========================================================================
-- PART 7: INITIAL FOUNDER SUPER-ADMIN ASSIGNMENT (PENDING CONFIRMATION)
-- =========================================================================
-- NOTE: Per strict security instructions, the initial super_admin role
-- will NOT be guessed or granted based on editable fields or email patterns.
-- Once the founder confirms their existing Supabase Auth User UUID, execute:
--
-- INSERT INTO public.user_roles (user_id, role)
-- VALUES ('<INSERT_CONFIRMED_FOUNDER_AUTH_UUID_HERE>', 'super_admin')
-- ON CONFLICT (user_id, role) DO NOTHING;
-- =========================================================================
