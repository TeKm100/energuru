import { supabase, isSupabaseConfigured } from './supabase';
import { AppNotification } from '../types';

/**
 * Generate standard demonstration notifications for customer onboarding and prototyping.
 * All demo items are clearly labeled with is_demo: true and demonstrative copy.
 */
export function getInitialDemoNotifications(userId: string): AppNotification[] {
  const now = Date.now();
  return [
    {
      id: `demo-notif-1-${userId.slice(0, 8)}`,
      user_id: userId,
      title: 'Public Grid Supply Restored (Demo)',
      message: 'Demonstration event: Incoming mains voltage detected at ~230V. This alert demonstrates the planned DisCo grid restoration push notification.',
      category: 'power',
      is_read: false,
      created_at: new Date(now - 25 * 60 * 1000).toISOString(),
      related_route: 'energy-management',
      is_demo: true,
    },
    {
      id: `demo-notif-2-${userId.slice(0, 8)}`,
      user_id: userId,
      title: 'Unusual Voltage Detected (Demo)',
      message: 'Demonstration event: Simulated voltage fluctuation above nominal operating band. In production, protection disconnection limits will be set by qualified electrical engineers.',
      category: 'voltage',
      is_read: false,
      created_at: new Date(now - 2 * 60 * 60 * 1000).toISOString(),
      related_route: 'alerts',
      is_demo: true,
    },
    {
      id: `demo-notif-3-${userId.slice(0, 8)}`,
      user_id: userId,
      title: 'Smart Connector Heartbeat (Demo)',
      message: 'Demonstration event: Simulated cellular IoT keep-alive handshake logged. Demonstrates future device connectivity monitoring.',
      category: 'device',
      is_read: true,
      created_at: new Date(now - 5 * 60 * 60 * 1000).toISOString(),
      related_route: 'devices-operations',
      is_demo: true,
    },
    {
      id: `demo-notif-4-${userId.slice(0, 8)}`,
      user_id: userId,
      title: 'Welcome to EnerGuru Platform (Demo)',
      message: 'Your authenticated customer account is active. Explore your dashboard to monitor simulated power availability and review electrical protection concepts.',
      category: 'account',
      is_read: true,
      created_at: new Date(now - 24 * 60 * 60 * 1000).toISOString(),
      related_route: 'dashboard',
      is_demo: true,
    },
  ];
}

// In-memory session fallback cache in case Supabase table has not been migrated yet
const localCacheByUserId: Record<string, AppNotification[]> = {};

/**
 * Fetch all notifications for a specific user from Supabase.
 * If none exist, seeds initial illustrative demonstration notifications.
 */
export async function fetchUserNotifications(userId: string): Promise<AppNotification[]> {
  if (!userId) return [];

  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (!error && data) {
        if (data.length > 0) {
          localCacheByUserId[userId] = data as AppNotification[];
          return data as AppNotification[];
        }

        // If table is empty for this user, seed initial illustrative demo notifications
        const initialSeeds = getInitialDemoNotifications(userId);
        const { data: inserted, error: insertError } = await supabase
          .from('notifications')
          .insert(initialSeeds)
          .select('*');

        if (!insertError && inserted && inserted.length > 0) {
          localCacheByUserId[userId] = inserted as AppNotification[];
          return inserted as AppNotification[];
        }
      }
    } catch (err) {
      // Table may not yet be created on the remote instance; fallback gracefully
      console.warn('Note: notifications table query fallback:', err);
    }
  }

  // Graceful fallback: retrieve or initialize memory cache
  if (!localCacheByUserId[userId]) {
    localCacheByUserId[userId] = getInitialDemoNotifications(userId);
  }
  return [...localCacheByUserId[userId]];
}

/**
 * Mark a single notification as read in Supabase and update local cache.
 */
export async function markNotificationAsRead(userId: string, notificationId: string): Promise<void> {
  // Update in-memory cache first for instant optimistic response
  if (localCacheByUserId[userId]) {
    localCacheByUserId[userId] = localCacheByUserId[userId].map((n) =>
      n.id === notificationId ? { ...n, is_read: true } : n
    );
  }

  if (isSupabaseConfigured) {
    try {
      await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId)
        .eq('user_id', userId);
    } catch (err) {
      console.warn('Could not update notification in Supabase:', err);
    }
  }
}

/**
 * Mark all unread notifications as read for a given user.
 */
export async function markAllNotificationsAsRead(userId: string): Promise<void> {
  // Update in-memory cache first for instant optimistic response
  if (localCacheByUserId[userId]) {
    localCacheByUserId[userId] = localCacheByUserId[userId].map((n) => ({
      ...n,
      is_read: true,
    }));
  }

  if (isSupabaseConfigured) {
    try {
      await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', userId)
        .eq('is_read', false);
    } catch (err) {
      console.warn('Could not mark all notifications read in Supabase:', err);
    }
  }
}
