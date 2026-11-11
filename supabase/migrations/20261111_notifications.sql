-- =========================================================================
-- EnerGuru — Notification System Migration
-- File: supabase/migrations/20261111_notifications.sql
-- Description:
--   Creates the public.notifications table with Row Level Security (RLS)
--   enabling authenticated customers to store, read, and manage their notifications.
-- =========================================================================

CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'system',
  is_read BOOLEAN NOT NULL DEFAULT false,
  related_route TEXT,
  is_demo BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user_created 
  ON public.notifications(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_notifications_user_unread 
  ON public.notifications(user_id, is_read);

-- Enable Row Level Security (RLS)
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Idempotently drop existing policies
DO $$ BEGIN
  DROP POLICY IF EXISTS "notifications_select_own" ON public.notifications;
  DROP POLICY IF EXISTS "notifications_insert_own" ON public.notifications;
  DROP POLICY IF EXISTS "notifications_update_own" ON public.notifications;
  DROP POLICY IF EXISTS "notifications_delete_own" ON public.notifications;
END $$;

-- Policy: Authenticated users can select only their own notifications
CREATE POLICY "notifications_select_own"
  ON public.notifications
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy: Authenticated users can insert their own notifications (e.g. system events)
CREATE POLICY "notifications_insert_own"
  ON public.notifications
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy: Authenticated users can update only their own notifications (e.g. mark as read)
CREATE POLICY "notifications_update_own"
  ON public.notifications
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Authenticated users can delete their own notifications
CREATE POLICY "notifications_delete_own"
  ON public.notifications
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Grant least-privilege permissions
REVOKE ALL ON public.notifications FROM PUBLIC;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.notifications TO authenticated;
