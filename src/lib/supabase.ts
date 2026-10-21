import { createClient } from '@supabase/supabase-js';

function sanitizeUrl(rawUrl?: string): string {
  if (!rawUrl) return '';
  const trimmed = rawUrl.trim();
  try {
    const parsed = new URL(trimmed);
    return parsed.origin;
  } catch {
    return trimmed.replace(/\/+$/, '').replace(/\/rest\/v1\/?$/, '');
  }
}

const rawUrl = (import.meta.env.VITE_SUPABASE_URL as string) || '';
export const supabaseUrl = sanitizeUrl(rawUrl);
export const supabasePublishableKey = ((import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string) || '').trim();

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseUrl.trim() !== '' && 
  supabasePublishableKey && 
  supabasePublishableKey.trim() !== ''
);

// Initialized Supabase client with verified origin URL and publishable key
export const supabase = createClient(
  isSupabaseConfigured ? supabaseUrl : 'https://placeholder.supabase.co',
  isSupabaseConfigured ? supabasePublishableKey : 'placeholder-anon-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);

/**
 * Resolves the appropriate authentication redirect URL for the current runtime environment.
 * Ensures we use window.location.origin instead of hardcoded localhost URLs when deployed,
 * while automatically supporting localhost during local development and custom domains later.
 */
export function getAuthRedirectUrl(subpath: string = ''): string {
  if (typeof window === 'undefined') return '';
  const origin = window.location.origin;
  const path = subpath ? (subpath.startsWith('/') ? subpath : `/${subpath}`) : '';
  return `${origin}${path}`;
}

export interface AuthCallbackParams {
  type?: string | null;
  errorCode?: string | null;
  errorDescription?: string | null;
  accessToken?: string | null;
  refreshToken?: string | null;
  hasAuthData: boolean;
}

/**
 * Extracts Supabase authentication tokens, event types, or errors from URL hash (#) or query string (?).
 */
export function extractAuthCallbackParams(): AuthCallbackParams {
  if (typeof window === 'undefined') {
    return { hasAuthData: false };
  }

  const hash = window.location.hash.startsWith('#') 
    ? window.location.hash.substring(1) 
    : window.location.hash;
  const search = window.location.search.startsWith('?') 
    ? window.location.search.substring(1) 
    : window.location.search;

  const hashParams = new URLSearchParams(hash);
  const searchParams = new URLSearchParams(search);

  const type = hashParams.get('type') || searchParams.get('type');
  const errorCode = hashParams.get('error_code') || searchParams.get('error_code') || hashParams.get('error') || searchParams.get('error');
  const errorDescription = hashParams.get('error_description') || searchParams.get('error_description');
  const accessToken = hashParams.get('access_token') || searchParams.get('access_token');
  const refreshToken = hashParams.get('refresh_token') || searchParams.get('refresh_token');

  const hasAuthData = Boolean(type || errorCode || errorDescription || accessToken || refreshToken);

  return {
    type,
    errorCode,
    errorDescription: errorDescription ? decodeURIComponent(errorDescription.replace(/\+/g, ' ')) : null,
    accessToken,
    refreshToken,
    hasAuthData,
  };
}

/**
 * Cleans auth hash fragments or query parameters from the browser address bar without a page reload.
 */
export function cleanAuthUrlParams(): void {
  if (typeof window === 'undefined') return;
  try {
    const cleanUrl = window.location.pathname;
    window.history.replaceState({}, document.title, cleanUrl);
  } catch (err) {
    console.warn('Could not clean auth parameters from URL:', err);
  }
}

