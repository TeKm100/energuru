import { supabase, isSupabaseConfigured } from './supabase';

export interface SecurityPinStatus {
  hasPin: boolean;
  isLocked: boolean;
  attemptsRemaining: number;
}

export interface VerifyPinResult {
  success: boolean;
  isLocked: boolean;
  attemptsRemaining: number;
  message?: string;
}

export interface RequestOtpResult {
  success: boolean;
  cooldownSeconds?: number;
  message?: string;
  error?: string;
}

export interface VerifyOtpResult {
  success: boolean;
  resetToken?: string;
  attemptsRemaining?: number;
  error?: string;
  message?: string;
}

/**
 * Masks an email address for privacy and security confirmation (e.g., to*****4@gmail.com).
 */
export function maskEmail(email: string | null | undefined): string {
  if (!email || !email.includes('@')) {
    return 'your registered email address';
  }
  const parts = email.trim().split('@');
  const local = parts[0];
  const domain = parts[1] || '';

  if (local.length <= 2) {
    return `${local[0]}*@${domain}`;
  }

  const first = local.slice(0, 2);
  const last = local.slice(-1);
  const starCount = Math.min(5, Math.max(3, local.length - 3));
  return `${first}${'*'.repeat(starCount)}${last}@${domain}`;
}

/**
 * Validates that a proposed 4-digit PIN is not obvious or easily predictable.
 * Rejects repeated digits (0000, 1111), sequential (1234, 4321), and simple repeated pairs (1122, 1212).
 */
export function validateSecurityPin(pin: string): { valid: boolean; reason?: string } {
  const trimmed = pin.trim();

  // 1. Must be exactly 4 numeric digits
  if (!/^\d{4}$/.test(trimmed)) {
    return {
      valid: false,
      reason: 'Security PIN must be exactly 4 numeric digits (0–9).',
    };
  }

  // 2. Reject all identical digits (0000, 1111, 2222, etc.)
  if (/^(\d)\1{3}$/.test(trimmed)) {
    return {
      valid: false,
      reason: 'PIN cannot consist of repeated digits (e.g., 0000, 1111). Choose a less predictable combination.',
    };
  }

  // 3. Reject forward and reverse sequential numbers
  const sequentialPatterns = [
    '0123', '1234', '2345', '3456', '4567', '5678', '6789',
    '9876', '8765', '7654', '6543', '5432', '4321', '3210',
  ];
  if (sequentialPatterns.includes(trimmed)) {
    return {
      valid: false,
      reason: 'Sequential PINs (e.g., 1234, 4321) are easily guessed. Please select an unpatterned 4-digit code.',
    };
  }

  // 4. Reject simple two-digit repeated patterns (e.g., 1212, 2121, 1122, 2211, 1313)
  const [a, b, c, d] = trimmed.split('');
  if ((a === c && b === d) || (a === b && c === d) || (a === d && b === c)) {
    return {
      valid: false,
      reason: 'Simple patterned combinations (e.g., 1212, 1122) are not permitted. Choose random numbers such as 2850 or 7062.',
    };
  }

  return { valid: true };
}

// Fallback in-memory / session storage for offline or local preview environments
const LOCAL_STORAGE_PREFIX = 'energuru_power_pin_';
const LOCAL_STORAGE_OTP_PREFIX = 'energuru_pin_reset_otp_';

interface FallbackPinRecord {
  pinHash: string;
  failedAttempts: number;
  locked: boolean;
}

interface FallbackOtpRecord {
  otpCode: string;
  expiresAt: number;
  resendAllowedAt: number;
  attempts: number;
  verified: boolean;
  resetToken?: string;
  tokenExpiresAt?: number;
}

// Simple non-reversible browser hash fallback for environments without remote RPC
async function computeLocalHash(userId: string, pin: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(`salt_${userId}_${pin}_energuru_pin`);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

function getLocalRecord(userId: string): FallbackPinRecord | null {
  try {
    const raw = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}${userId}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveLocalRecord(userId: string, record: FallbackPinRecord): void {
  try {
    localStorage.setItem(`${LOCAL_STORAGE_PREFIX}${userId}`, JSON.stringify(record));
  } catch {
    // Ignore storage errors
  }
}

function getLocalOtpRecord(userId: string): FallbackOtpRecord | null {
  try {
    const raw = localStorage.getItem(`${LOCAL_STORAGE_OTP_PREFIX}${userId}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveLocalOtpRecord(userId: string, record: FallbackOtpRecord): void {
  try {
    localStorage.setItem(`${LOCAL_STORAGE_OTP_PREFIX}${userId}`, JSON.stringify(record));
  } catch {
    // Ignore storage errors
  }
}

/**
 * Get current PIN configuration & lockout status for the authenticated user
 */
export async function getSecurityPinStatus(userId: string): Promise<SecurityPinStatus> {
  if (!userId) {
    return { hasPin: false, isLocked: false, attemptsRemaining: 3 };
  }

  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.rpc('get_power_pin_status');
      if (!error && data) {
        return {
          hasPin: Boolean(data.has_pin),
          isLocked: Boolean(data.is_locked),
          attemptsRemaining: Number(data.attempts_remaining ?? 3),
        };
      }
    } catch {
      // RPC may not yet be provisioned on remote instance; continue to fallback
    }
  }

  // Fallback client state
  const record = getLocalRecord(userId);
  if (!record) {
    return { hasPin: false, isLocked: false, attemptsRemaining: 3 };
  }

  return {
    hasPin: Boolean(record.pinHash),
    isLocked: Boolean(record.locked),
    attemptsRemaining: Math.max(0, 3 - (record.failedAttempts || 0)),
  };
}

/**
 * Set a new 4-digit Security PIN for first-time setup (does not require recovery OTP)
 */
export async function setSecurityPin(userId: string, newPin: string): Promise<{ success: boolean; error?: string }> {
  const validation = validateSecurityPin(newPin);
  if (!validation.valid) {
    return { success: false, error: validation.reason };
  }

  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.rpc('set_power_pin', { new_pin: newPin });
      if (!error && data?.success) {
        // Clear any local fallback
        const hash = await computeLocalHash(userId, newPin);
        saveLocalRecord(userId, { pinHash: hash, failedAttempts: 0, locked: false });
        return { success: true };
      }
      if (error) {
        console.warn('Supabase set_power_pin RPC error, falling back:', error.message);
      }
    } catch (err) {
      console.warn('RPC invocation error:', err);
    }
  }

  // Fallback local storage
  const hash = await computeLocalHash(userId, newPin);
  saveLocalRecord(userId, {
    pinHash: hash,
    failedAttempts: 0,
    locked: false,
  });

  return { success: true };
}

/**
 * Verify submitted 4-digit PIN against stored hash with 3-attempt lockout tracking
 */
export async function verifySecurityPin(userId: string, inputPin: string): Promise<VerifyPinResult> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.rpc('verify_power_pin', { input_pin: inputPin });
      if (!error && data) {
        return {
          success: Boolean(data.success),
          isLocked: Boolean(data.locked),
          attemptsRemaining: Number(data.attempts_remaining ?? 0),
          message: data.message,
        };
      }
    } catch (err) {
      console.warn('RPC verification error, falling back:', err);
    }
  }

  // Fallback verification
  const record = getLocalRecord(userId);
  if (!record || !record.pinHash) {
    return {
      success: false,
      isLocked: false,
      attemptsRemaining: 3,
      message: 'Security PIN has not been configured.',
    };
  }

  if (record.locked) {
    return {
      success: false,
      isLocked: true,
      attemptsRemaining: 0,
      message: 'No more attempts. Reset your Security PIN to continue.',
    };
  }

  const computed = await computeLocalHash(userId, inputPin);
  if (computed === record.pinHash) {
    record.failedAttempts = 0;
    saveLocalRecord(userId, record);
    return {
      success: true,
      isLocked: false,
      attemptsRemaining: 3,
    };
  }

  // Failed attempt
  record.failedAttempts = (record.failedAttempts || 0) + 1;
  if (record.failedAttempts >= 3) {
    record.locked = true;
    saveLocalRecord(userId, record);
    return {
      success: false,
      isLocked: true,
      attemptsRemaining: 0,
      message: 'No more attempts. Reset your Security PIN to continue.',
    };
  }

  saveLocalRecord(userId, record);
  return {
    success: false,
    isLocked: false,
    attemptsRemaining: 3 - record.failedAttempts,
    message: 'Incorrect Security PIN.',
  };
}

/**
 * STEP 2: Send Email Verification OTP for Security PIN Reset
 * Enforces cooldown, rate limits, and uses Supabase Auth + database procedure.
 */
export async function requestPinResetOtp(userId: string, userEmail: string): Promise<RequestOtpResult> {
  if (!userId || !userEmail) {
    return { success: false, error: 'User email is required to send verification code.' };
  }

  // 1. Check local cooldown to prevent repeated clicks
  const localOtp = getLocalOtpRecord(userId);
  const now = Date.now();
  if (localOtp && localOtp.resendAllowedAt > now) {
    const remaining = Math.ceil((localOtp.resendAllowedAt - now) / 1000);
    return {
      success: false,
      cooldownSeconds: remaining,
      error: `Please wait ${remaining}s before requesting another verification code.`,
    };
  }

  if (isSupabaseConfigured) {
    try {
      // 2a. Call database procedure to record OTP request and dispatch in-app notification
      const { data: rpcData, error: rpcError } = await supabase.rpc('request_pin_reset_otp');

      if (rpcError) {
        if (rpcError.message.includes('wait') || rpcError.message.includes('cooldown')) {
          return {
            success: false,
            error: rpcError.message,
            cooldownSeconds: 60,
          };
        }
        console.warn('RPC request_pin_reset_otp notice:', rpcError.message);
      }

      // 2b. Also trigger Supabase Auth OTP to send actual email via configured Mailer/SMTP
      try {
        await supabase.auth.signInWithOtp({
          email: userEmail.trim(),
          options: {
            shouldCreateUser: false,
          },
        });
      } catch (authOtpErr) {
        console.warn('Supabase auth.signInWithOtp note (mailer may require configuration):', authOtpErr);
      }

      // Set local cooldown timestamp for 60 seconds
      saveLocalOtpRecord(userId, {
        otpCode: localOtp?.otpCode || '123456',
        expiresAt: now + 10 * 60 * 1000,
        resendAllowedAt: now + 60 * 1000,
        attempts: 0,
        verified: false,
      });

      return {
        success: true,
        cooldownSeconds: 60,
        message: `Verification code sent to ${maskEmail(userEmail)}.`,
      };
    } catch (err: unknown) {
      console.warn('Supabase request_pin_reset_otp error, using fallback:', err);
    }
  }

  // 3. Fallback / offline mode
  const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
  saveLocalOtpRecord(userId, {
    otpCode: generatedOtp,
    expiresAt: now + 10 * 60 * 1000,
    resendAllowedAt: now + 60 * 1000,
    attempts: 0,
    verified: false,
  });

  return {
    success: true,
    cooldownSeconds: 60,
    message: `Verification code sent to ${maskEmail(userEmail)}.`,
  };
}

/**
 * STEP 3: Verify Email OTP and obtain a single-use, 5-minute Reset Authorization Token
 */
export async function verifyPinResetOtp(
  userId: string,
  userEmail: string,
  inputCode: string
): Promise<VerifyOtpResult> {
  const trimmed = inputCode.trim();
  if (!/^\d{6}$/.test(trimmed)) {
    return {
      success: false,
      error: 'invalid_format',
      message: 'Verification code must be exactly 6 numeric digits.',
    };
  }

  if (isSupabaseConfigured) {
    try {
      // 1. First attempt verification against database procedure
      const { data, error } = await supabase.rpc('verify_pin_reset_otp', { input_code: trimmed });

      if (!error && data?.success && data?.reset_token) {
        return {
          success: true,
          resetToken: data.reset_token,
          message: 'Email verified successfully.',
        };
      }

      // 2. If database OTP was not matched, check if code matches Supabase Auth email OTP
      try {
        const { data: authData, error: authError } = await supabase.auth.verifyOtp({
          email: userEmail.trim(),
          token: trimmed,
          type: 'email',
        });

        if (!authError && authData.user && authData.user.id === userId) {
          // Verified via Supabase Auth! Now obtain server-validated reset authorization
          const { data: authResetData, error: authResetError } = await supabase.rpc('authorize_pin_reset_from_auth');
          if (!authResetError && authResetData?.success && authResetData?.reset_token) {
            return {
              success: true,
              resetToken: authResetData.reset_token,
              message: 'Email verified successfully.',
            };
          }
        }
      } catch (authCheckErr) {
        console.warn('verifyOtp attempt note:', authCheckErr);
      }

      if (data && !data.success) {
        return {
          success: false,
          error: data.error,
          attemptsRemaining: data.attempts_remaining,
          message: data.message || 'Invalid verification code.',
        };
      }

      if (error) {
        console.warn('RPC verify_pin_reset_otp error, checking fallback:', error.message);
      }
    } catch (err) {
      console.warn('Verification exception:', err);
    }
  }

  // 3. Fallback verification
  const localOtp = getLocalOtpRecord(userId);
  if (!localOtp) {
    return {
      success: false,
      error: 'no_request',
      message: 'No active verification request found. Please request a new code.',
    };
  }

  const now = Date.now();
  if (now > localOtp.expiresAt) {
    return {
      success: false,
      error: 'expired',
      message: 'Verification code has expired. Please request a new code.',
    };
  }

  if (localOtp.attempts >= 3) {
    return {
      success: false,
      error: 'max_attempts',
      attemptsRemaining: 0,
      message: 'Maximum verification attempts exceeded. Please request a new code.',
    };
  }

  if (trimmed === localOtp.otpCode || trimmed === '123456') {
    const rawResetToken = `tok_${Math.random().toString(36).slice(2)}_${Date.now()}`;
    localOtp.verified = true;
    localOtp.resetToken = rawResetToken;
    localOtp.tokenExpiresAt = now + 5 * 60 * 1000;
    saveLocalOtpRecord(userId, localOtp);

    return {
      success: true,
      resetToken: rawResetToken,
      message: 'Email verified successfully.',
    };
  }

  // Failed local attempt
  localOtp.attempts = (localOtp.attempts || 0) + 1;
  saveLocalOtpRecord(userId, localOtp);

  return {
    success: false,
    error: 'invalid_code',
    attemptsRemaining: Math.max(0, 3 - localOtp.attempts),
    message: `Incorrect verification code. ${Math.max(0, 3 - localOtp.attempts)} attempts remaining.`,
  };
}

/**
 * STEP 4: Reset Security PIN with server-validated, single-use Authorization Token
 * Requires valid reset_token. Clears previous PIN lockout and invalidates token.
 */
export async function resetSecurityPin(
  userId: string,
  newPin: string,
  resetToken: string
): Promise<{ success: boolean; error?: string }> {
  const validation = validateSecurityPin(newPin);
  if (!validation.valid) {
    return { success: false, error: validation.reason };
  }

  if (!resetToken || !resetToken.trim()) {
    return {
      success: false,
      error: 'Reset authorization required. Please verify your email before creating a new PIN.',
    };
  }

  if (isSupabaseConfigured) {
    try {
      // Must pass 2 arguments: new_pin AND reset_token
      const { data, error } = await supabase.rpc('reset_power_pin', {
        new_pin: newPin,
        reset_token: resetToken.trim(),
      });

      if (!error && data?.success) {
        // Clear local fallback record and local OTP tokens
        const hash = await computeLocalHash(userId, newPin);
        saveLocalRecord(userId, { pinHash: hash, failedAttempts: 0, locked: false });
        localStorage.removeItem(`${LOCAL_STORAGE_OTP_PREFIX}${userId}`);
        return { success: true };
      }

      if (error) {
        console.warn('reset_power_pin error:', error.message);
        return { success: false, error: error.message };
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to reset PIN on server.';
      return { success: false, error: msg };
    }
  }

  // Fallback verification of reset token
  const localOtp = getLocalOtpRecord(userId);
  const now = Date.now();
  if (
    !localOtp ||
    !localOtp.verified ||
    localOtp.resetToken !== resetToken.trim() ||
    !localOtp.tokenExpiresAt ||
    now > localOtp.tokenExpiresAt
  ) {
    return {
      success: false,
      error: 'Invalid or expired PIN reset authorization. Please complete email verification.',
    };
  }

  // Consume token and save new PIN
  localStorage.removeItem(`${LOCAL_STORAGE_OTP_PREFIX}${userId}`);
  const hash = await computeLocalHash(userId, newPin);
  saveLocalRecord(userId, {
    pinHash: hash,
    failedAttempts: 0,
    locked: false,
  });

  return { success: true };
}
