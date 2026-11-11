-- =========================================================================
-- EnerGuru — Power Control Security PIN Migration
-- File: supabase/migrations/20261111_security_pin.sql
-- Description:
--   1. Creates public.user_security_pins for secure, bcrypt-hashed transaction PINs
--   2. Enforces strict zero-direct-access RLS (no direct SELECT or UPDATE from client)
--   3. Provides SECURITY DEFINER functions for PIN status, setup, verification, and reset
--   4. Implements server-side lockout tracking (3 failed attempts triggers persistent lock)
-- =========================================================================

-- Ensure required extension for cryptographic hashing
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Table: public.user_security_pins
CREATE TABLE IF NOT EXISTS public.user_security_pins (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  pin_hash TEXT NOT NULL,
  failed_attempts INT NOT NULL DEFAULT 0,
  locked_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.user_security_pins ENABLE ROW LEVEL SECURITY;

-- Revoke direct table manipulation from authenticated users and public
-- All interactions MUST occur via vetted SECURITY DEFINER functions
REVOKE ALL ON public.user_security_pins FROM PUBLIC;
REVOKE ALL ON public.user_security_pins FROM authenticated;

-- =========================================================================
-- SECURITY DEFINER HELPER FUNCTIONS
-- =========================================================================

-- 1. Check PIN configuration and lockout status for current authenticated user
CREATE OR REPLACE FUNCTION public.get_power_pin_status()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, extensions
AS $$
DECLARE
  v_user_id UUID;
  v_rec RECORD;
  v_is_locked BOOLEAN := false;
  v_attempts_left INT := 3;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object('has_pin', false, 'is_locked', false, 'attempts_remaining', 0);
  END IF;

  SELECT * INTO v_rec FROM public.user_security_pins WHERE user_id = v_user_id;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('has_pin', false, 'is_locked', false, 'attempts_remaining', 3);
  END IF;

  IF v_rec.locked_until IS NOT NULL AND v_rec.locked_until > now() THEN
    v_is_locked := true;
    v_attempts_left := 0;
  ELSE
    v_attempts_left := GREATEST(0, 3 - v_rec.failed_attempts);
  END IF;

  RETURN jsonb_build_object(
    'has_pin', true,
    'is_locked', v_is_locked,
    'attempts_remaining', v_attempts_left
  );
END;
$$;

-- 2. Configure a new 4-digit Security PIN (Bcrypt hashed with unique salt)
CREATE OR REPLACE FUNCTION public.set_power_pin(new_pin TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, extensions
AS $$
DECLARE
  v_user_id UUID;
  v_hash TEXT;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required.';
  END IF;

  IF new_pin IS NULL OR new_pin !~ '^[0-9]{4}$' THEN
    RAISE EXCEPTION 'Security PIN must be exactly 4 numeric digits.';
  END IF;

  -- Compute secure bcrypt hash
  v_hash := crypt(new_pin, gen_salt('bf', 10));

  INSERT INTO public.user_security_pins (user_id, pin_hash, failed_attempts, locked_until, updated_at)
  VALUES (v_user_id, v_hash, 0, NULL, now())
  ON CONFLICT (user_id) DO UPDATE SET
    pin_hash = EXCLUDED.pin_hash,
    failed_attempts = 0,
    locked_until = NULL,
    updated_at = now();

  -- Insert audit notification if notifications table exists
  BEGIN
    INSERT INTO public.notifications (user_id, title, message, category, is_read, related_route, is_demo)
    VALUES (
      v_user_id,
      'Security PIN Configured',
      'A four-digit Security PIN has been configured for remote electricity power controls.',
      'account',
      false,
      'profile',
      false
    );
  EXCEPTION WHEN OTHERS THEN
    -- Fallback quietly if notifications table not populated
    NULL;
  END;

  RETURN jsonb_build_object('success', true);
END;
$$;

-- 3. Verify 4-digit Security PIN with persistent 3-attempt lockout tracking
CREATE OR REPLACE FUNCTION public.verify_power_pin(input_pin TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, extensions
AS $$
DECLARE
  v_user_id UUID;
  v_rec RECORD;
  v_is_valid BOOLEAN := false;
  v_new_failed INT;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'locked', false, 'attempts_remaining', 0, 'message', 'Authentication required.');
  END IF;

  SELECT * INTO v_rec FROM public.user_security_pins WHERE user_id = v_user_id;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'locked', false, 'attempts_remaining', 3, 'message', 'Security PIN has not been configured.');
  END IF;

  -- Check if user is currently locked out
  IF v_rec.locked_until IS NOT NULL AND v_rec.locked_until > now() THEN
    RETURN jsonb_build_object(
      'success', false,
      'locked', true,
      'attempts_remaining', 0,
      'message', 'No more attempts. Reset your Security PIN to continue.'
    );
  END IF;

  -- Verify bcrypt hash
  v_is_valid := (v_rec.pin_hash = crypt(input_pin, v_rec.pin_hash));

  IF v_is_valid THEN
    -- Successful verification: reset failed attempt counter and lockout
    UPDATE public.user_security_pins
    SET failed_attempts = 0, locked_until = NULL, updated_at = now()
    WHERE user_id = v_user_id;

    RETURN jsonb_build_object('success', true, 'locked', false, 'attempts_remaining', 3);
  ELSE
    -- Failed verification: increment attempt counter
    v_new_failed := v_rec.failed_attempts + 1;

    IF v_new_failed >= 3 THEN
      -- Lock out user until explicitly reset
      UPDATE public.user_security_pins
      SET failed_attempts = v_new_failed, locked_until = now() + INTERVAL '100 years', updated_at = now()
      WHERE user_id = v_user_id;

      RETURN jsonb_build_object(
        'success', false,
        'locked', true,
        'attempts_remaining', 0,
        'message', 'No more attempts. Reset your Security PIN to continue.'
      );
    ELSE
      UPDATE public.user_security_pins
      SET failed_attempts = v_new_failed, updated_at = now()
      WHERE user_id = v_user_id;

      RETURN jsonb_build_object(
        'success', false,
        'locked', false,
        'attempts_remaining', 3 - v_new_failed,
        'message', 'Incorrect Security PIN.'
      );
    END IF;
  END IF;
END;
$$;

-- 4. Secure PIN Reset after account re-authentication
CREATE OR REPLACE FUNCTION public.reset_power_pin(new_pin TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, extensions
AS $$
DECLARE
  v_user_id UUID;
  v_hash TEXT;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required.';
  END IF;

  IF new_pin IS NULL OR new_pin !~ '^[0-9]{4}$' THEN
    RAISE EXCEPTION 'Security PIN must be exactly 4 numeric digits.';
  END IF;

  v_hash := crypt(new_pin, gen_salt('bf', 10));

  UPDATE public.user_security_pins
  SET pin_hash = v_hash,
      failed_attempts = 0,
      locked_until = NULL,
      updated_at = now()
  WHERE user_id = v_user_id;

  IF NOT FOUND THEN
    INSERT INTO public.user_security_pins (user_id, pin_hash, failed_attempts, locked_until, updated_at)
    VALUES (v_user_id, v_hash, 0, NULL, now());
  END IF;

  -- Create notification
  BEGIN
    INSERT INTO public.notifications (user_id, title, message, category, is_read, related_route, is_demo)
    VALUES (
      v_user_id,
      'Security PIN Reset Completed',
      'Your Power Control Security PIN was successfully reset and lockout cleared.',
      'account',
      false,
      'profile',
      false
    );
  EXCEPTION WHEN OTHERS THEN
    NULL;
  END;

  RETURN jsonb_build_object('success', true);
END;
$$;

-- Grant execution permissions on helper functions to authenticated users
GRANT EXECUTE ON FUNCTION public.get_power_pin_status() TO authenticated;
GRANT EXECUTE ON FUNCTION public.set_power_pin(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.verify_power_pin(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.reset_power_pin(TEXT) TO authenticated;
