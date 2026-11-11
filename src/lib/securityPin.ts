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

interface FallbackPinRecord {
  pinHash: string;
  failedAttempts: number;
  locked: boolean;
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
 * Set a new 4-digit Security PIN for the user
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
 * Reset Security PIN (e.g. after lockout or forgotten PIN)
 */
export async function resetSecurityPin(userId: string, newPin: string): Promise<{ success: boolean; error?: string }> {
  const validation = validateSecurityPin(newPin);
  if (!validation.valid) {
    return { success: false, error: validation.reason };
  }

  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.rpc('reset_power_pin', { new_pin: newPin });
      if (!error && data?.success) {
        const hash = await computeLocalHash(userId, newPin);
        saveLocalRecord(userId, { pinHash: hash, failedAttempts: 0, locked: false });
        return { success: true };
      }
    } catch (err) {
      console.warn('RPC reset error:', err);
    }
  }

  const hash = await computeLocalHash(userId, newPin);
  saveLocalRecord(userId, {
    pinHash: hash,
    failedAttempts: 0,
    locked: false,
  });

  return { success: true };
}
