import { supabase, isSupabaseConfigured } from './supabase';
import { AppRole } from '../types';

/**
 * Client-Side Role Utilities for EnerGuru
 * 
 * CRITICAL ARCHITECTURAL BOUNDARY:
 * These client-side helper functions are strictly for UI rendering (e.g. role badges, conditional menus).
 * All actual authorization, data access control, and mutation rights are enforced exclusively by the
 * database server through Row Level Security (RLS) policies and SECURITY DEFINER PostgreSQL functions.
 * Client-side claims are never trusted for privileged backend operations.
 */

/**
 * Retrieves the assigned roles for the currently authenticated user from public.user_roles.
 * Row Level Security ensures users can only read their own role records (auth.uid() = user_id).
 */
export async function getMyRoles(): Promise<AppRole[]> {
  if (!isSupabaseConfigured) return ['customer'];

  try {
    const { data, error } = await supabase
      .from('user_roles')
      .select('role');

    if (error || !data || data.length === 0) {
      // Default to customer role if table is not yet migrated or no role is found
      return ['customer'];
    }

    return data.map((r: { role: string }) => r.role as AppRole);
  } catch (err) {
    console.warn('Could not retrieve user roles from database:', err);
    return ['customer'];
  }
}

/**
 * Checks whether an array of user roles contains a specific required role.
 */
export function hasRole(userRoles: AppRole[], requiredRole: AppRole): boolean {
  if (userRoles.includes('super_admin')) return true; // super_admin has broad supervisory authority
  return userRoles.includes(requiredRole);
}

/**
 * Checks whether the user holds an administrative role (admin or super_admin).
 */
export function isAdmin(userRoles: AppRole[]): boolean {
  return userRoles.includes('admin') || userRoles.includes('super_admin');
}
