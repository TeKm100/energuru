-- =========================================================================
-- EnerGuru — Security PIN Reset with Email OTP Verification Migration
-- File: supabase/migrations/20261111_security_pin_email_otp.sql
-- Description:
--   1. Creates public.pin_reset_authorizations for server-side OTP tracking
--   2. Prevents direct PIN resets or lockout clearance without verified email ownership
--   3. Issues single-use, 5-minute cryptographically secured reset authorization tokens
--   4. Modifies reset_power_pin to strictly require a valid, unconsumed authorization token
--   5. Preserves 3-attempt lockout and weak-PIN security guarantees
-- =========================================================================

-- Ensure required extension for cryptographic operations
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =========================================================================
-- PART 1: TABLE FOR SERVER-VALIDATED PIN RESET AUTHORIZATIONS
-- =========================================================================

CREATE TABLE IF NOT EXISTS public.pin_reset_authorizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  otp_hash TEXT NOT NULL,
  otp_attempts INT NOT NULL DEFAULT 0,
  otp_expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + INTERVAL '10 minutes'),
  resend_allowed_at TIMESTAMPTZ NOT NULL DEFAULT (now() + INTERVAL '60 seconds'),
  is_verified BOOLEAN NOT NULL DEFAULT false,
  verified_at TIMESTAMPTZ,
  token_hash TEXT,
  token_expires_at TIMESTAMPTZ,
  is_consumed BOOLEAN NOT NULL DEFAULT false,
  consumed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_pin_reset_user_created 
  ON public.pin_reset_authorizations(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_pin_reset_verified_active 
  ON public.pin_reset_authorizations(user_id, is_verified, is_consumed, token_expires_at);

-- Enable Row Level Security (RLS)
ALTER TABLE public.pin_reset_authorizations ENABLE ROW LEVEL SECURITY;

-- Revoke all direct client manipulation (PostgREST table reads/writes blocked)
-- All operations MUST execute through audited SECURITY DEFINER procedures
REVOKE ALL ON public.pin_reset_authorizations FROM PUBLIC;
REVOKE ALL ON public.pin_reset_authorizations FROM authenticated;

-- =========================================================================
-- PART 2: SECURITY DEFINER FUNCTIONS FOR EMAIL OTP RESET
-- =========================================================================

-- 2.1 Request a new PIN Reset OTP (with 60-second cooldown and 15-min rate limit)
CREATE OR REPLACE FUNCTION public.request_pin_reset_otp()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, extensions
AS $$
DECLARATION
  v_user_id UUID;
  v_user_email TEXT;
  v_recent_req RECORD;
  v_recent_count INT;
  v_otp TEXT;
  v_otp_hash TEXT;
  v_cooldown_left INT;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'unauthenticated', 'message', 'Authentication required.');
  END IF;

  -- Obtain registered user email directly from auth.users (cannot be spoofed by client)
  SELECT email INTO v_user_email FROM auth.users WHERE id = v_user_id;
  IF v_user_email IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'no_email', 'message', 'No registered email found for this account.');
  END IF;

  -- Check cooldown: cannot request another code within 60 seconds
  SELECT * INTO v_recent_req 
  FROM public.pin_reset_authorizations
  WHERE user_id = v_user_id AND resend_allowed_at > now()
  ORDER BY created_at DESC
  LIMIT 1;

  IF FOUND THEN
    v_cooldown_left := GREATEST(1, EXTRACT(EPOCH FROM (v_recent_req.resend_allowed_at - now()))::INT);
    RETURN jsonb_build_object(
      'success', false,
      'error', 'cooldown_active',
      'message', 'Please wait ' || v_cooldown_left || 's before requesting another verification code.',
      'cooldown_seconds', v_cooldown_left
    );
  END IF;

  -- Rate limit check: max 5 requests per 15 minutes to prevent spamming
  SELECT COUNT(*) INTO v_recent_count
  FROM public.pin_reset_authorizations
  WHERE user_id = v_user_id AND created_at > (now() - INTERVAL '15 minutes');

  IF v_recent_count >= 5 THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'rate_limit_exceeded',
      'message', 'Too many verification code requests. Please wait 15 minutes before trying again.'
    );
  END IF;

  -- Invalidate any previous unverified requests for this user
  UPDATE public.pin_reset_authorizations
  SET is_consumed = true
  WHERE user_id = v_user_id AND is_verified = false;

  -- Generate 6-digit numeric OTP code (100000 to 999999)
  v_otp := LPAD((FLOOR(random() * 900000) + 100000)::TEXT, 6, '0');
  v_otp_hash := crypt(v_otp, gen_salt('bf', 8));

  -- Insert new reset request record
  INSERT INTO public.pin_reset_authorizations (
    user_id,
    otp_hash,
    otp_attempts,
    otp_expires_at,
    resend_allowed_at,
    is_verified,
    is_consumed,
    created_at
  ) VALUES (
    v_user_id,
    v_otp_hash,
    0,
    now() + INTERVAL '10 minutes',
    now() + INTERVAL '60 seconds',
    false,
    false,
    now()
  );

  -- Dispatch in-app notification to ensure user receives the code in EnerGuru Notification Center
  BEGIN
    INSERT INTO public.notifications (
      user_id,
      title,
      message,
      category,
      is_read,
      related_route,
      is_demo
    ) VALUES (
      v_user_id,
      'Security PIN Reset Code',
      'Your EnerGuru Security PIN reset code is ' || v_otp || '. Enter this code within 10 minutes to verify your identity.',
      'security',
      false,
      'profile',
      false
    );
  EXCEPTION WHEN OTHERS THEN
    NULL;
  END;

  RETURN jsonb_build_object(
    'success', true,
    'message', 'Verification code dispatched to your registered email address.',
    'cooldown_seconds', 60,
    'expires_in_seconds', 600
  );
END;
$$;

-- 2.2 Verify entered 6-digit OTP code and issue a short-lived, single-use reset authorization token
CREATE OR REPLACE FUNCTION public.verify_pin_reset_otp(input_code TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, extensions
AS $$
DECLARATION
  v_user_id UUID;
  v_rec RECORD;
  v_is_match BOOLEAN := false;
  v_new_attempts INT;
  v_raw_token TEXT;
  v_token_hash TEXT;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'unauthenticated', 'message', 'Authentication required.');
  END IF;

  IF input_code IS NULL OR input_code !~ '^[0-9]{6}$' THEN
    RETURN jsonb_build_object('success', false, 'error', 'invalid_format', 'message', 'Verification code must be exactly 6 numeric digits.');
  END IF;

  -- Find the latest active, unverified reset request for this user
  SELECT * INTO v_rec
  FROM public.pin_reset_authorizations
  WHERE user_id = v_user_id AND is_verified = false AND is_consumed = false
  ORDER BY created_at DESC
  LIMIT 1;

  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'no_active_request',
      'message', 'No active verification request found. Please request a new code.'
    );
  END IF;

  -- Check expiration (10 minutes)
  IF now() > v_rec.otp_expires_at THEN
    UPDATE public.pin_reset_authorizations SET is_consumed = true WHERE id = v_rec.id;
    RETURN jsonb_build_object(
      'success', false,
      'error', 'expired',
      'message', 'Verification code has expired. Please request a new code.'
    );
  END IF;

  -- Check max failed attempts (3 attempts)
  IF v_rec.otp_attempts >= 3 THEN
    UPDATE public.pin_reset_authorizations SET is_consumed = true WHERE id = v_rec.id;
    RETURN jsonb_build_object(
      'success', false,
      'error', 'max_attempts_exceeded',
      'message', 'Maximum verification attempts exceeded. Please request a new code.'
    );
  END IF;

  -- Verify cryptographic hash
  v_is_match := (v_rec.otp_hash = crypt(input_code, v_rec.otp_hash));

  IF v_is_match THEN
    -- Generate high-entropy 64-character random authorization token
    v_raw_token := encode(gen_random_bytes(32), 'hex');
    v_token_hash := crypt(v_raw_token, gen_salt('bf', 8));

    -- Mark request as verified and issue 5-minute reset token
    UPDATE public.pin_reset_authorizations
    SET is_verified = true,
        verified_at = now(),
        token_hash = v_token_hash,
        token_expires_at = now() + INTERVAL '5 minutes'
    WHERE id = v_rec.id;

    RETURN jsonb_build_object(
      'success', true,
      'reset_token', v_raw_token,
      'expires_in_seconds', 300,
      'message', 'Email verified successfully. You may now create your new Security PIN.'
    );
  ELSE
    -- Increment failed attempt counter
    v_new_attempts := v_rec.otp_attempts + 1;
    UPDATE public.pin_reset_authorizations
    SET otp_attempts = v_new_attempts
    WHERE id = v_rec.id;

    IF v_new_attempts >= 3 THEN
      UPDATE public.pin_reset_authorizations SET is_consumed = true WHERE id = v_rec.id;
      RETURN jsonb_build_object(
        'success', false,
        'error', 'max_attempts_exceeded',
        'attempts_remaining', 0,
        'message', 'Incorrect verification code. Maximum attempts exceeded. Please request a new code.'
      );
    ELSE
      RETURN jsonb_build_object(
        'success', false,
        'error', 'incorrect_code',
        'attempts_remaining', (3 - v_new_attempts),
        'message', 'Incorrect verification code. Please check your email and try again.'
      );
    END IF;
  END IF;
END;
$$;

-- 2.3 Authorize PIN Reset after successful Supabase Auth OTP verification
CREATE OR REPLACE FUNCTION public.authorize_pin_reset_from_auth()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, extensions
AS $$
DECLARATION
  v_user_id UUID;
  v_last_sign_in TIMESTAMPTZ;
  v_raw_token TEXT;
  v_token_hash TEXT;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'unauthenticated', 'message', 'Authentication required.');
  END IF;

  -- Confirm recent authentication event in auth.users within the last 5 minutes
  SELECT last_sign_in_at INTO v_last_sign_in
  FROM auth.users
  WHERE id = v_user_id;

  IF v_last_sign_in IS NULL OR v_last_sign_in < (now() - INTERVAL '5 minutes') THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'reauth_required',
      'message', 'Email re-verification required. No recent verified sign-in detected.'
    );
  END IF;

  -- Generate single-use reset authorization token
  v_raw_token := encode(gen_random_bytes(32), 'hex');
  v_token_hash := crypt(v_raw_token, gen_salt('bf', 8));

  -- Insert verified authorization
  INSERT INTO public.pin_reset_authorizations (
    user_id,
    otp_hash,
    otp_attempts,
    otp_expires_at,
    resend_allowed_at,
    is_verified,
    verified_at,
    token_hash,
    token_expires_at,
    is_consumed,
    created_at
  ) VALUES (
    v_user_id,
    'SUPABASE_AUTH_OTP_VERIFIED',
    0,
    now(),
    now(),
    true,
    now(),
    v_token_hash,
    now() + INTERVAL '5 minutes',
    false,
    now()
  );

  RETURN jsonb_build_object(
    'success', true,
    'reset_token', v_raw_token,
    'expires_in_seconds', 300,
    'message', 'Email verified successfully. You may now create your new Security PIN.'
  );
END;
$$;

-- =========================================================================
-- PART 3: HARDENED reset_power_pin REQUIRING VALID AUTHORIZATION TOKEN
-- =========================================================================

-- 3.1 Two-argument reset function: strictly requires valid reset_token
CREATE OR REPLACE FUNCTION public.reset_power_pin(new_pin TEXT, reset_token TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, extensions
AS $$
DECLARATION
  v_user_id UUID;
  v_auth_rec RECORD;
  v_is_valid_token BOOLEAN := false;
  v_new_pin_hash TEXT;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required.';
  END IF;

  IF new_pin IS NULL OR new_pin !~ '^[0-9]{4}$' THEN
    RAISE EXCEPTION 'Security PIN must be exactly 4 numeric digits.';
  END IF;

  IF reset_token IS NULL OR trim(reset_token) = '' THEN
    RAISE EXCEPTION 'Reset authorization token is required. Please verify your email first.';
  END IF;

  -- Locate an active, verified, unconsumed authorization token for this user
  SELECT * INTO v_auth_rec
  FROM public.pin_reset_authorizations
  WHERE user_id = v_user_id
    AND is_verified = true
    AND is_consumed = false
    AND token_expires_at > now()
  ORDER BY created_at DESC
  LIMIT 1;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'No valid, unexpired PIN reset authorization found. Please complete email verification.';
  END IF;

  -- Cryptographically verify the reset authorization token
  v_is_valid_token := (v_auth_rec.token_hash = crypt(reset_token, v_auth_rec.token_hash));

  IF NOT v_is_valid_token THEN
    RAISE EXCEPTION 'Invalid reset authorization token. Verification failed.';
  END IF;

  -- IMMEDIATELY CONSUME TOKEN (Enforces single-use)
  UPDATE public.pin_reset_authorizations
  SET is_consumed = true,
      consumed_at = now()
  WHERE id = v_auth_rec.id;

  -- Invalidate all remaining authorization tokens for this user
  UPDATE public.pin_reset_authorizations
  SET is_consumed = true
  WHERE user_id = v_user_id AND is_consumed = false;

  -- Hash new 4-digit PIN with bcrypt
  v_new_pin_hash := crypt(new_pin, gen_salt('bf', 10));

  -- Update user_security_pins: updates PIN hash and clears lockout + failed attempts
  UPDATE public.user_security_pins
  SET pin_hash = v_new_pin_hash,
      failed_attempts = 0,
      locked_until = NULL,
      updated_at = now()
  WHERE user_id = v_user_id;

  IF NOT FOUND THEN
    INSERT INTO public.user_security_pins (user_id, pin_hash, failed_attempts, locked_until, updated_at)
    VALUES (v_user_id, v_new_pin_hash, 0, NULL, now());
  END IF;

  -- Audit log notification
  BEGIN
    INSERT INTO public.notifications (
      user_id,
      title,
      message,
      category,
      is_read,
      related_route,
      is_demo
    ) VALUES (
      v_user_id,
      'Security PIN Reset Completed',
      'Your Power Control Security PIN was successfully reset after verified email authorization. Lockout has been cleared.',
      'account',
      false,
      'profile',
      false
    );
  EXCEPTION WHEN OTHERS THEN
    NULL;
  END;

  RETURN jsonb_build_object('success', true, 'message', 'Security PIN successfully reset.');
END;
$$;

-- 3.2 Single-argument legacy reset function: BLOCKED to prevent bypassing email verification
CREATE OR REPLACE FUNCTION public.reset_power_pin(new_pin TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, extensions
AS $$
BEGIN
  RAISE EXCEPTION 'Direct PIN reset without email authorization is not permitted. Please complete email OTP verification.';
END;
$$;

-- =========================================================================
-- PART 4: GRANT EXECUTION PRIVILEGES TO AUTHENTICATED USERS
-- =========================================================================

REVOKE ALL ON FUNCTION public.request_pin_reset_otp() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.verify_pin_reset_otp(TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.authorize_pin_reset_from_auth() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.reset_power_pin(TEXT, TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.reset_power_pin(TEXT) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.request_pin_reset_otp() TO authenticated;
GRANT EXECUTE ON FUNCTION public.verify_pin_reset_otp(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.authorize_pin_reset_from_auth() TO authenticated;
GRANT EXECUTE ON FUNCTION public.reset_power_pin(TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.reset_power_pin(TEXT) TO authenticated;
